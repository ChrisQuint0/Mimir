import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  BookOpen,
  Calendar,
  Globe2,
  Target,
  UserCircle2,
  Star,
} from "lucide-react";
import { SyllabusView } from "@/components/bootcamp/SyllabusView";
import { EnrollButton } from "@/components/bootcamp/EnrollButton";
import { ReviewsSection } from "@/components/bootcamp/ReviewsSection";
import type { ReviewWithAuthor } from "@/lib/types/bootcamp";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BootcampDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch bootcamp
  const { data: bootcamp, error } = await supabase
    .from("bootcamps")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !bootcamp) {
    notFound();
  }

  const isOwner = user?.id === bootcamp.user_id;
  const { data: enrollment } = user
    ? await supabase
        .from("bootcamp_enrollments")
        .select("current_day")
        .eq("bootcamp_id", id)
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  const isEnrolled = Boolean(enrollment) || isOwner;

  if (!isOwner && !isEnrolled && !bootcamp.published_at) {
    notFound();
  }

  const { data: authorProfile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", bootcamp.user_id)
    .maybeSingle();

  // Fetch existing lessons for this bootcamp
  const { data: lessons } = await supabase
    .from("lessons")
    .select("day_number")
    .eq("bootcamp_id", id);

  const existingLessons = lessons?.map((l) => l.day_number) || [];

  // Fetch reviews + profiles separately (no direct FK from reviews → profiles)
  const { data: rawReviews } = await supabase
    .from("bootcamp_reviews")
    .select("id, bootcamp_id, user_id, rating, comment, created_at, updated_at")
    .eq("bootcamp_id", id)
    .order("created_at", { ascending: false });

  const reviewUserIds = [...new Set((rawReviews ?? []).map((r) => r.user_id))];
  const { data: reviewProfiles } =
    reviewUserIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .in("id", reviewUserIds)
      : { data: [] };

  const profileMap = Object.fromEntries(
    (reviewProfiles ?? []).map((p) => [p.id, p]),
  );

  const reviews: ReviewWithAuthor[] = (rawReviews ?? []).map((r) => ({
    ...r,
    author: profileMap[r.user_id] ?? {
      id: r.user_id,
      display_name: "Learner",
      avatar_url: null,
    },
  }));

  const avgRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length) *
            10,
        ) / 10
      : null;

  const viewerCurrentDay =
    enrollment?.current_day ?? (isOwner ? (bootcamp.current_day ?? 1) : 1);
  const completedDays = Math.max(0, viewerCurrentDay - 1);
  const totalDays = bootcamp.duration_days;
  const progressPercentage = Math.round((completedDays / totalDays) * 100);
  const authorName =
    authorProfile?.display_name ||
    (isOwner
      ? user?.user_metadata?.display_name || user?.email?.split("@")[0]
      : "Mimir Author");

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              Feed
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-400">Bootcamp</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <UserCircle2 className="w-4 h-4" />
                    {authorName}
                  </span>
                  {bootcamp.published_at && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-300">
                      <Globe2 className="w-3.5 h-3.5" />
                      Published
                    </span>
                  )}
                  {bootcamp.published_at && avgRating !== null && (
                    <a
                      href="#reviews"
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-300 hover:bg-amber-500/20 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{avgRating}</span>
                      <span className="text-amber-400/60">·</span>
                      <span>
                        {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                      </span>
                    </a>
                  )}
                  {bootcamp.published_at && avgRating === null && (
                    <a
                      href="#reviews"
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1 text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-colors text-xs"
                    >
                      <Star className="w-3.5 h-3.5" />
                      No reviews yet
                    </a>
                  )}
                </div>
                <h1
                  className="text-4xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  {bootcamp.title}
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {bootcamp.goal}
                </p>
              </div>
            </div>

            {bootcamp.caption && (
              <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500 mb-3">
                  Author caption
                </p>
                <p className="text-slate-200 leading-7">{bootcamp.caption}</p>
              </div>
            )}

            {!isOwner && bootcamp.published_at && !isEnrolled && (
              <div className="mb-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-blue-300/80 mb-2">
                    Ready to join?
                  </p>
                  <h2 className="text-xl font-semibold text-white">
                    Enroll to unlock the lessons and track your own progress
                  </h2>
                </div>
                <EnrollButton
                  bootcampId={bootcamp.id}
                  initiallyEnrolled={false}
                />
              </div>
            )}

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Progress card */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Target className="w-4 h-4" />
                  <span>{isEnrolled ? "Your Progress" : "Progress"}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {progressPercentage}%
                  </span>
                  <span className="text-sm text-slate-500">complete</span>
                </div>
                <div className="mt-3 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6749fb] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Current day card */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{isEnrolled ? "Current Day" : "Starting Day"}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {viewerCurrentDay}
                  </span>
                  <span className="text-sm text-slate-500">
                    of {bootcamp.duration_days}
                  </span>
                </div>
              </div>

              {/* Days remaining card */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Days Remaining</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {Math.max(0, totalDays - completedDays)}
                  </span>
                  <span className="text-sm text-slate-500">days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Syllabus section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Learning Path</h2>
              <p className="text-sm text-slate-500">
                {bootcamp.syllabus_json.days.length} days total
              </p>
            </div>

            <SyllabusView
              days={bootcamp.syllabus_json.days}
              currentDay={viewerCurrentDay}
              bootcampId={bootcamp.id}
              bootcampGoal={bootcamp.goal}
              existingLessons={existingLessons}
              canGenerateLessons={isOwner}
              canAccessLessons={isEnrolled}
              showPublishControls={isOwner}
              initialCaption={bootcamp.caption}
              isPublished={Boolean(bootcamp.published_at)}
            />
          </div>

          {/* Reviews — anchor target at bottom */}
          {bootcamp.published_at && (
            <div id="reviews" className="mt-12 scroll-mt-6">
              <ReviewsSection
                bootcampId={bootcamp.id}
                initialReviews={reviews}
                canReview={isEnrolled && !isOwner}
                currentUserId={user?.id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
