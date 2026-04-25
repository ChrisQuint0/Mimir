import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getAchievementStatuses,
  type AchievementStatus,
} from "@/lib/achievements";
import { ProfilePageClient } from "@/components/profile/ProfilePageClient";

function getDurationDays(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    const firstValue = value[0];
    return getDurationDays(firstValue);
  }

  if ("duration_days" in value && typeof value.duration_days === "number") {
    return value.duration_days;
  }

  return null;
}

async function resolveAvatarUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  avatarValue: string | null | undefined,
) {
  if (!avatarValue) {
    return null;
  }

  if (avatarValue.startsWith("http://") || avatarValue.startsWith("https://")) {
    return avatarValue;
  }

  const { data } = await supabase.storage
    .from("profile_pictures")
    .createSignedUrl(avatarValue, 60 * 60 * 24 * 7);

  return data?.signedUrl ?? null;
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: profile },
    { count: publishedCount },
    { data: enrollmentRows },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, avatar_url, created_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("bootcamps")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .not("published_at", "is", null),
    supabase
      .from("bootcamp_enrollments")
      .select("current_day, bootcamps!inner(duration_days)")
      .eq("user_id", user.id),
  ]);

  const completionSummary = (enrollmentRows ?? []).reduce(
    (summary, row) => {
      const durationDays = getDurationDays(row.bootcamps);

      if (durationDays === null) {
        return summary;
      }

      if (row.current_day > durationDays) {
        summary.completed += 1;
      } else {
        summary.active += 1;
      }

      return summary;
    },
    { completed: 0, active: 0 },
  );

  const achievementStatuses: AchievementStatus[] = getAchievementStatuses({
    publishedCount: publishedCount ?? 0,
    completedCount: completionSummary.completed,
  });

  const avatarValue =
    profile?.avatar_url ?? user.user_metadata.avatar_url ?? null;
  const avatarSrc = await resolveAvatarUrl(supabase, avatarValue);

  return (
    <ProfilePageClient
      userId={user.id}
      email={user.email ?? ""}
      displayName={
        profile?.display_name ||
        user.user_metadata.display_name ||
        user.email?.split("@")[0] ||
        "Mimir Learner"
      }
      memberSince={profile?.created_at ?? user.created_at}
      initialAvatarPath={typeof avatarValue === "string" ? avatarValue : null}
      initialAvatarSrc={avatarSrc}
      publishedCount={publishedCount ?? 0}
      completedCount={completionSummary.completed}
      activeCount={completionSummary.active}
      achievementStatuses={achievementStatuses}
    />
  );
}
