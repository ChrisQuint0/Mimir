"use client";

import Link from "next/link";
import {
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
} from "lucide-react";
import { ActivityCard } from "@/components/bootcamp/ActivityCard";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getDemoActivities, DEMO_BOOTCAMP, DEMO_SYLLABUS } from "@/lib/demo-data";
import { useRouter } from "next/navigation";

interface DemoActivitiesPageProps {
  bootcampId: string;
  dayNumber: number;
}

export function DemoActivitiesPage({ bootcampId, dayNumber }: DemoActivitiesPageProps) {
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [revealAll, setRevealAll] = useState(false);
  const [completing, setCompleting] = useState(false);

  const syllabusDay = DEMO_SYLLABUS.days.find((d) => d.day === dayNumber);

  useEffect(() => {
    // Check if activities already exist
    const savedActivities = localStorage.getItem(`demo-activities-day-${dayNumber}`);
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    } else {
      // Generate activities
      setGenerating(true);
      setTimeout(() => {
        const demoActivities = getDemoActivities(`demo-lesson-${dayNumber}`);
        setActivities(demoActivities);
        localStorage.setItem(
          `demo-activities-day-${dayNumber}`,
          JSON.stringify(demoActivities)
        );
        setGenerating(false);
      }, 1500);
    }
  }, [dayNumber]);

  const handleCompleteDay = async () => {
    setCompleting(true);

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Update current day
    const newCurrentDay = dayNumber + 1;
    localStorage.setItem("demo-current-day", newCurrentDay.toString());

    toast.success(`Day ${dayNumber} completed!`, {
      description: "Great work! Moving to the next day.",
      icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
    });

    // Redirect back to bootcamp
    setTimeout(() => {
      router.push(`/bootcamp/${bootcampId}`);
    }, 1000);
  };

  if (generating) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-linear-to-r from-amber-500 to-orange-500 rounded-2xl animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white animate-bounce" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Generating Activities...
          </h2>
          <p className="text-slate-400 mb-2">
            Mimir is crafting personalized practice exercises for you. (Demo Mode)
          </p>
          <p className="text-slate-500 text-sm">
            This usually takes 10-20 seconds.
          </p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading activities...</p>
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
            <Link href="/" className="hover:text-slate-300 transition-colors">
              Feed
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/bootcamp/${bootcampId}`}
              className="hover:text-slate-300 transition-colors"
            >
              {DEMO_BOOTCAMP.title}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/bootcamp/${bootcampId}/lesson/${dayNumber}`}
              className="hover:text-slate-300 transition-colors"
            >
              Day {dayNumber}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-400">Activities (Demo)</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Practice Activities</span>
              <div>•</div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-300 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Demo Mode
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1
                  className="text-4xl font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  {syllabusDay?.title || `Day ${dayNumber}`}
                </h1>
                <p className="text-slate-400">
                  Complete these {activities.length} activities to reinforce
                  what you&apos;ve learned.
                </p>
              </div>
              <button
                onClick={() => setRevealAll(!revealAll)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  revealAll
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
            <div className="bg-linear-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Ready to Move Forward?
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Mark this day as complete to unlock the next lesson in your
                    learning journey.
                  </p>
                  <button
                    onClick={handleCompleteDay}
                    disabled={completing}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-green-600/25 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    {completing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Completing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Complete Day {dayNumber}</span>
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
