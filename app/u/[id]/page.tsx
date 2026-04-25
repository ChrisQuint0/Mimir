import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpen, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAchievementStatuses } from "@/lib/achievements";
import { Header } from "@/components/layout/Header";
import { FollowButton } from "@/components/social/FollowButton";

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

function getDurationDays(value: unknown) {
  if (!value || typeof value !== "object") return null;
  if (Array.isArray(value)) return getDurationDays(value[0]);
  if ("duration_days" in value && typeof value.duration_days === "number") {
    return value.duration_days;
  }
  return null;
}

async function resolveAvatarUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  avatarValue: string | null | undefined,
) {
  if (!avatarValue) return null;
  if (avatarValue.startsWith("http://") || avatarValue.startsWith("https://")) {
    return avatarValue;
  }

  const { data } = await supabase.storage
    .from("profile_pictures")
    .createSignedUrl(avatarValue, 60 * 60 * 24 * 7);

  return data?.signedUrl ?? null;
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  const [
    { count: publishedCount },
    { data: enrollments },
    { count: followerCount },
    { count: followingCount },
    { data: followRelation },
    { data: publishedBootcamps },
  ] = await Promise.all([
    supabase
      .from("bootcamps")
      .select("id", { count: "exact", head: true })
      .eq("user_id", id)
      .not("published_at", "is", null),
    supabase
      .from("bootcamp_enrollments")
      .select("current_day, bootcamps!inner(duration_days)")
      .eq("user_id", id),
    supabase
      .from("user_follows")
      .select("follower_id", { count: "exact", head: true })
      .eq("following_id", id),
    supabase
      .from("user_follows")
      .select("following_id", { count: "exact", head: true })
      .eq("follower_id", id),
    user.id === id
      ? Promise.resolve({ data: null })
      : supabase
          .from("user_follows")
          .select("id")
          .eq("follower_id", user.id)
          .eq("following_id", id)
          .maybeSingle(),
    supabase
      .from("bootcamps")
      .select("id, title, goal, published_at")
      .eq("user_id", id)
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(6),
  ]);

  const completedCount = (enrollments ?? []).reduce((count, row) => {
    const duration = getDurationDays(row.bootcamps);
    if (duration && row.current_day > duration) {
      return count + 1;
    }
    return count;
  }, 0);

  const achievements = getAchievementStatuses({
    publishedCount: publishedCount ?? 0,
    completedCount,
  });

  const unlockedAchievements = achievements.filter(
    (achievement) => achievement.unlocked,
  ).length;

  const avatarSrc = await resolveAvatarUrl(supabase, profile.avatar_url);
  const initials = profile.display_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to feed
            </Link>

            {user.id !== id && (
              <FollowButton
                userId={id}
                initiallyFollowing={Boolean(followRelation)}
                size="md"
              />
            )}
          </div>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-slate-700 bg-slate-800 text-3xl font-semibold text-slate-200">
                  {avatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarSrc}
                      alt={profile.display_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials || "MM"
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Learner Profile
                  </p>
                  <h1
                    className="mt-2 text-4xl font-bold text-white"
                    style={{ fontFamily: "var(--font-lora)" }}
                  >
                    {profile.display_name}
                  </h1>
                  <p className="mt-2 text-sm text-slate-400">
                    {unlockedAchievements}/10 achievements unlocked
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:w-72">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                    Followers
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-cyan-300">
                    {followerCount ?? 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                    Following
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-blue-300">
                    {followingCount ?? 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Published
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {publishedCount ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Completed
                </p>
                <p className="mt-2 text-3xl font-semibold text-emerald-300">
                  {completedCount}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Achievement Score
                </p>
                <p className="mt-2 text-3xl font-semibold text-amber-300">
                  {unlockedAchievements * 10}%
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
              <Trophy className="h-4 w-4 text-amber-300" />
              Achievements
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`rounded-2xl border p-4 ${
                    achievement.unlocked
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : "border-slate-800 bg-slate-950/60"
                  }`}
                >
                  <p className="text-sm font-semibold text-white">
                    {achievement.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    {achievement.description}
                  </p>
                  <p className="mt-3 text-xs text-slate-500">
                    {achievement.progress}/{achievement.threshold}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
              <BookOpen className="h-4 w-4 text-cyan-300" />
              Published Bootcamps
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(publishedBootcamps || []).length > 0 ? (
                (publishedBootcamps || []).map((bootcamp) => (
                  <Link
                    key={bootcamp.id}
                    href={`/bootcamp/${bootcamp.id}`}
                    className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-colors hover:border-slate-700"
                  >
                    <p className="font-semibold text-white line-clamp-2">
                      {bootcamp.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">
                      {bootcamp.goal}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-400">
                  No published bootcamps yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
