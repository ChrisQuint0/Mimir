"use client";

import { createClient } from "@/lib/supabase/client";
import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, BookOpen, CheckCircle2, Lightbulb, Eye, EyeOff, Sparkles } from "lucide-react";
import { ActivityCard } from "@/components/bootcamp/ActivityCard";
import { useEffect, useState } from "react";
import { toast } from "sonner";


interface Activity {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  revealed: boolean;
}

interface Bootcamp {
  title: string;
}

interface Lesson {
  id: string;
  title: string;
}

export default function ActivitiesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const day = params?.day as string;
  const dayNumber = parseInt(day);

  const [bootcamp, setBootcamp] = useState<Bootcamp | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealAll, setRevealAll] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Fetch bootcamp info
      const { data: bootcampData } = await supabase
        .from("bootcamps")
        .select("title")
        .eq("id", id)
        .single();

      if (!bootcampData) {
        notFound();
        return;
      }

      setBootcamp(bootcampData);

      // Fetch lesson
      const { data: lessonData } = await supabase
        .from("lessons")
        .select("id, title")
        .eq("bootcamp_id", id)
        .eq("day_number", dayNumber)
        .single();

      if (!lessonData) {
        notFound();
        return;
      }

      setLesson(lessonData);

      // Fetch activities
      const { data: activitiesData } = await supabase
        .from("activities")
        .select("*")
        .eq("lesson_id", lessonData.id)
        .order("order_index", { ascending: true });

      if (!activitiesData || activitiesData.length === 0) {
        // No activities exist, generate them
        setLoading(false);
        setGenerating(true);

        try {
          const response = await fetch("/api/generate-activities", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ lessonId: lessonData.id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to generate activities");
          }

          const result = await response.json();
          setActivities(result.activities || []);
          setGenerating(false);
        } catch (err: any) {
          console.error("Error generating activities:", err);
          setError(err.message || "Failed to generate activities");
          setGenerating(false);
        }
      } else {
        setActivities(activitiesData);
        setLoading(false);
      }
    }

    fetchData();
  }, [id, dayNumber]);

  const handleCompleteDay = async () => {
    setCompleting(true);
    try {
      const response = await fetch(`/api/bootcamp/${id}/complete-day`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dayNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to complete day");
      }

      const result = await response.json();

      // Show success toast
      toast.success(`Day ${dayNumber} completed! 🎉`, {
        description: "Great work! Moving to the next day.",
      });

      // Redirect to bootcamp syllabus after a short delay
      setTimeout(() => {
        router.push(`/bootcamp/${id}`);
      }, 1000);
    } catch (err: any) {
      console.error("Error completing day:", err);
      toast.error("Failed to complete day", {
        description: err.message || "Please try again.",
      });
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white animate-bounce" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Generating Activities...
          </h2>
          <p className="text-slate-400 mb-2">
            Mimir is crafting personalized practice exercises for you.
          </p>
          <p className="text-slate-500 text-sm">
            This usually takes 10-20 seconds.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Generation Failed
          </h2>
          <p className="text-slate-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-500/25"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!bootcamp || !lesson) {
    return null;
  }

  // If no activities exist, show generation prompt
  if (!activities || activities.length === 0) {

    return (
      <div className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
              <Link
                href="/dashboard"
                className="hover:text-slate-300 transition-colors"
              >
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                href={`/bootcamp/${id}`}
                className="hover:text-slate-300 transition-colors"
              >
                {bootcamp.title}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                href={`/bootcamp/${id}/lesson/${dayNumber}`}
                className="hover:text-slate-300 transition-colors"
              >
                Day {dayNumber}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-400">Activities</span>
            </nav>

            {/* Empty state */}
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-8 h-8 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  No Activities Yet
                </h2>
                <p className="text-slate-400 mb-6">
                  Activities haven't been generated for this lesson yet.
                  Generate them to start practicing!
                </p>
                <Link
                  href={`/bootcamp/${id}/lesson/${dayNumber}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-500/25"
                >
                  Back to Lesson
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link
              href="/dashboard"
              className="hover:text-slate-300 transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/bootcamp/${id}`}
              className="hover:text-slate-300 transition-colors"
            >
              {bootcamp.title}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/bootcamp/${id}/lesson/${dayNumber}`}
              className="hover:text-slate-300 transition-colors"
            >
              Day {dayNumber}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-400">Activities</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Practice Activities</span>
            </div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {lesson.title}
                </h1>
                <p className="text-slate-400">
                  Complete these {activities.length} activities to reinforce what
                  you've learned.
                </p>
              </div>
              <button
                onClick={() => setRevealAll(!revealAll)}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${revealAll
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
                  }`}
              >
                {revealAll ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Hide All Answers</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Reveal All Answers</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Activities */}
          <div className="space-y-6 mb-12">
            {activities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                number={index + 1}
                total={activities.length}
                forceReveal={revealAll}
              />
            ))}
          </div>

          {/* Completion section */}
          <div className="border-t border-slate-800 pt-8">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Great Progress!
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    You've completed the activities for Day {dayNumber}. When
                    you're ready, mark this day as complete to unlock the next
                    lesson.
                  </p>
                  <button
                    onClick={handleCompleteDay}
                    disabled={completing}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-green-600/50 disabled:to-emerald-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                  >
                    {completing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Completing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Day {dayNumber} Complete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
