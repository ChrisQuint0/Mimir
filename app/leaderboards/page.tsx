import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Trophy } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";

function getDurationDays(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    return getDurationDays(value[0]);
  }

  if (
    "duration_days" in value &&
    typeof (value as { duration_days?: unknown }).duration_days === "number"
  ) {
    return (value as { duration_days: number }).duration_days;
  }

  return null;
}

interface LeaderRowProps {
  rank: number;
  userId: string;
  displayName: string;
  count: number;
  accentClass: string;
}

function LeaderRow({
  rank,
  userId,
  displayName,
  count,
  accentClass,
}: LeaderRowProps) {
  return (
    <Link
      href={`/u/${userId}`}
      className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 transition-colors hover:border-slate-700"
    >
      <span className="inline-flex items-center gap-3 text-slate-200">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-400">
          {rank}
        </span>
        <span className="truncate max-w-50 text-sm font-medium">
          {displayName}
        </span>
      </span>
      <span className={`text-sm font-semibold ${accentClass}`}>{count}</span>
    </Link>
  );
}

export default async function LeaderboardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: publishedBootcamps }, { data: completionRows }] =
    await Promise.all([
      supabase
        .from("bootcamps")
        .select("user_id")
        .not("published_at", "is", null),
      supabase
        .from("bootcamp_enrollments")
        .select("user_id, current_day, bootcamps!inner(duration_days)"),
    ]);

  const publishedCountByUser = new Map<string, number>();
  for (const bootcamp of publishedBootcamps || []) {
    publishedCountByUser.set(
      bootcamp.user_id,
      (publishedCountByUser.get(bootcamp.user_id) ?? 0) + 1,
    );
  }

  const completedCountByUser = new Map<string, number>();
  for (const row of completionRows || []) {
    const durationDays = getDurationDays(row.bootcamps);
    if (!durationDays) continue;
    if (row.current_day > durationDays) {
      completedCountByUser.set(
        row.user_id,
        (completedCountByUser.get(row.user_id) ?? 0) + 1,
      );
    }
  }

  const profileIds = Array.from(
    new Set([
      ...Array.from(publishedCountByUser.keys()),
      ...Array.from(completedCountByUser.keys()),
    ]),
  );

  const { data: profiles } = profileIds.length
    ? await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", profileIds)
    : { data: [] };

  const profileMap = new Map(
    (profiles || []).map((p) => [p.id, p.display_name]),
  );

  const publishedLeaders = Array.from(publishedCountByUser.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([userId, count]) => ({
      userId,
      count,
      displayName: profileMap.get(userId) || "Mimir Learner",
    }));

  const completedLeaders = Array.from(completedCountByUser.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([userId, count]) => ({
      userId,
      count,
      displayName: profileMap.get(userId) || "Mimir Learner",
    }));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to feed
            </Link>
          </div>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/70 px-6 py-8 sm:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-300/70">
              Community Rankings
            </p>
            <h1
              className="mt-3 text-4xl font-bold text-white sm:text-5xl"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              Leaderboards
            </h1>
            <p className="mt-3 text-slate-400">
              See who is publishing the most and who completes the most courses
              across Mimir.
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-300">
                <Trophy className="h-4 w-4 text-cyan-300" />
                Most Published
              </div>
              <div className="space-y-2">
                {publishedLeaders.length > 0 ? (
                  publishedLeaders.map((leader, index) => (
                    <LeaderRow
                      key={`published-${leader.userId}`}
                      rank={index + 1}
                      userId={leader.userId}
                      displayName={leader.displayName}
                      count={leader.count}
                      accentClass="text-cyan-300"
                    />
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No published bootcamps yet.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-300">
                <Trophy className="h-4 w-4 text-emerald-300" />
                Most Completed Courses
              </div>
              <div className="space-y-2">
                {completedLeaders.length > 0 ? (
                  completedLeaders.map((leader, index) => (
                    <LeaderRow
                      key={`completed-${leader.userId}`}
                      rank={index + 1}
                      userId={leader.userId}
                      displayName={leader.displayName}
                      count={leader.count}
                      accentClass="text-emerald-300"
                    />
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No completed courses yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
