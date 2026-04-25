import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Compass, Rocket, Users } from "lucide-react";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import { Header } from "@/components/layout/Header";
import { LandingPage } from "@/components/landing/landing-page";
import { FeedBootcamp } from "@/lib/types/bootcamp";

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const rawQuery = (resolvedSearchParams.q || "").trim();
  const normalizedQuery = rawQuery.toLowerCase();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage user={user} />;
  }

  const { data: bootcamps } = await supabase
    .from("bootcamps")
    .select(
      "id, user_id, title, goal, duration_days, current_day, caption, published_at, created_at, syllabus_json",
    )
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  const userIds = Array.from(
    new Set((bootcamps || []).map((bootcamp) => bootcamp.user_id)),
  );
  const bootcampIds = (bootcamps || []).map((bootcamp) => bootcamp.id);

  const { data: profiles } = userIds.length
    ? await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds)
    : { data: [] };

  const { data: followingRows } = userIds.length
    ? await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", user.id)
        .in("following_id", userIds)
    : { data: [] };

  const { data: enrollments } = bootcampIds.length
    ? await supabase
        .from("bootcamp_enrollments")
        .select("bootcamp_id, user_id")
        .in("bootcamp_id", bootcampIds)
    : { data: [] };

  const profileMap = new Map(
    (profiles || []).map((profile) => [profile.id, profile]),
  );
  const followingSet = new Set(
    (followingRows || []).map((item) => item.following_id),
  );

  const enrollmentCountMap = new Map<string, number>();
  const enrolledBootcampIds = new Set<string>();

  for (const enrollment of enrollments || []) {
    enrollmentCountMap.set(
      enrollment.bootcamp_id,
      (enrollmentCountMap.get(enrollment.bootcamp_id) ?? 0) + 1,
    );

    if (enrollment.user_id === user.id) {
      enrolledBootcampIds.add(enrollment.bootcamp_id);
    }
  }

  const feedBootcamps: FeedBootcamp[] = (bootcamps || []).map((bootcamp) => {
    const authorProfile = profileMap.get(bootcamp.user_id);

    return {
      ...bootcamp,
      author: {
        id: bootcamp.user_id,
        display_name:
          authorProfile?.display_name ||
          (bootcamp.user_id === user.id
            ? user.user_metadata?.display_name ||
              user.email?.split("@")[0] ||
              "You"
            : "Mimir Author"),
        avatar_url: authorProfile?.avatar_url || null,
      },
      enrollment_count: enrollmentCountMap.get(bootcamp.id) ?? 0,
      is_enrolled: enrolledBootcampIds.has(bootcamp.id),
      is_owner: bootcamp.user_id === user.id,
      is_following_author: followingSet.has(bootcamp.user_id),
    };
  });

  const filteredFeedBootcamps = normalizedQuery
    ? feedBootcamps.filter((bootcamp) => {
        const dayEntries = Array.isArray(
          (bootcamp as { syllabus_json?: { days?: unknown[] } }).syllabus_json
            ?.days,
        )
          ? ((bootcamp as { syllabus_json?: { days?: unknown[] } })
              .syllabus_json?.days as Array<{ topics?: string[] }>)
          : [];

        const topicsBlob = dayEntries
          .flatMap((day) => day.topics || [])
          .join(" ");

        const searchable = [
          bootcamp.title,
          bootcamp.goal,
          bootcamp.caption || "",
          bootcamp.author.display_name,
          topicsBlob,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      })
    : feedBootcamps;

  const publishedCount = filteredFeedBootcamps.length;
  const totalEnrollments = filteredFeedBootcamps.reduce(
    (sum, bootcamp) => sum + bootcamp.enrollment_count,
    0,
  );
  const myPublishedCount = filteredFeedBootcamps.filter(
    (bootcamp) => bootcamp.is_owner,
  ).length;
  const newestBootcamps = filteredFeedBootcamps.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <main className="relative overflow-hidden px-4 py-8 lg:px-8 lg:py-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-48 top-16 h-80 w-80 rounded-full bg-cyan-500/8 blur-3xl" />
          <div className="absolute -right-40 top-24 h-96 w-96 rounded-full bg-blue-500/8 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-500/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <section className="mb-8 rounded-[2rem] border border-slate-800/80 bg-slate-950/80 px-6 py-8 shadow-2xl shadow-slate-950/20 lg:px-8 lg:py-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
              <div className="max-w-4xl">
                <p className="mb-3 text-sm uppercase tracking-[0.24em] text-blue-400/80">
                  Community Feed
                </p>
                <h1
                  className="max-w-4xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-[3.5rem]"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  Shared bootcamps from the Mimir network
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-400 md:text-lg">
                  Explore what other learners are building, enroll in the
                  journeys that fit your goals, and publish your own once they
                  are ready.
                </p>

                <form action="/" method="GET" className="mt-6">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="search"
                      name="q"
                      defaultValue={rawQuery}
                      placeholder="Search authors, users, or topics..."
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none ring-0 transition-colors focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-medium text-slate-950 transition-colors hover:bg-cyan-300"
                    >
                      Search
                    </button>
                    {rawQuery && (
                      <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-700 px-5 py-3 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
                      >
                        Clear
                      </Link>
                    )}
                  </div>
                </form>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Published now
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      {publishedCount}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Total enrollments
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      {totalEnrollments}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Your published
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      {myPublishedCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:justify-self-end lg:w-full">
                <Link
                  href="/dashboard"
                  className="group block rounded-3xl border border-slate-800 bg-linear-to-br from-slate-900 to-slate-950 p-6 transition-colors hover:border-slate-700"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6749fb]/15 text-[#8e79ff]">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <div className="mt-10">
                    <p className="text-lg font-semibold text-white">
                      Manage my bootcamps
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Create, refine, and publish your own learning tracks from
                      one place.
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-300">
                      <span>Open dashboard</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="space-y-5">
              {filteredFeedBootcamps.length > 0 ? (
                filteredFeedBootcamps.map((bootcamp) => (
                  <FeedPostCard key={bootcamp.id} bootcamp={bootcamp} />
                ))
              ) : (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-10 text-center">
                  <p className="mb-3 text-sm uppercase tracking-[0.24em] text-slate-500">
                    No matches
                  </p>
                  <h2
                    className="mb-3 text-3xl font-bold text-white"
                    style={{ fontFamily: "var(--font-lora)" }}
                  >
                    No bootcamps found for this search
                  </h2>
                  <p className="mb-6 text-slate-400">
                    Try another author name, user name, or topic keyword.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex rounded-xl bg-[#6749fb] px-5 py-3 font-medium text-white transition-colors hover:bg-[#5a3ee0]"
                  >
                    Reset Feed
                  </Link>
                </div>
              )}
            </div>

            <aside className="lg:sticky lg:top-24">
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/65 p-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Compass className="h-4 w-4 text-blue-300" />
                    Feed Brief
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    The best-performing posts are concise, outcome-oriented, and
                    framed for a specific learner profile.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/65 p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Fresh in the feed
                  </p>
                  <div className="mt-4 space-y-3">
                    {newestBootcamps.length > 0 ? (
                      newestBootcamps.map((bootcamp) => (
                        <Link
                          key={bootcamp.id}
                          href={`/bootcamp/${bootcamp.id}`}
                          className="block rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 transition-colors hover:border-slate-700"
                        >
                          <p className="text-sm font-semibold text-white line-clamp-2">
                            {bootcamp.title}
                          </p>
                          <p className="mt-2 text-xs leading-6 text-slate-400 line-clamp-2">
                            {bootcamp.goal}
                          </p>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">
                        New community shares will appear here.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-linear-to-br from-slate-900 to-slate-950 p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Publishing workflow
                  </p>
                  <ol className="mt-4 space-y-4 text-sm text-slate-300">
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[11px]">
                        1
                      </span>
                      <span>Create a bootcamp in your dashboard.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[11px]">
                        2
                      </span>
                      <span>Add a short caption from the syllabus view.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[11px]">
                        3
                      </span>
                      <span>Publish it so others can discover and enroll.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}
