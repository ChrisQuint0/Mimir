"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  BookOpen,
  Calendar,
  Target,
  UserCircle2,
  Check,
  Lock,
  Sparkles,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { DEMO_BOOTCAMP, DEMO_SYLLABUS } from "@/lib/demo-data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DemoBootcampPageProps {
  bootcampId: string;
}

export function DemoBootcampPage({ bootcampId }: DemoBootcampPageProps) {
  const router = useRouter();
  const [currentDay, setCurrentDay] = useState(1);
  const [existingLessons, setExistingLessons] = useState<number[]>([]);
  const [generatingDay, setGeneratingDay] = useState<number | null>(null);

  useEffect(() => {
    // Load progress from localStorage
    const savedDay = localStorage.getItem("demo-current-day");
    if (savedDay) {
      setCurrentDay(parseInt(savedDay));
    }

    const savedLessons = localStorage.getItem("demo-existing-lessons");
    if (savedLessons) {
      setExistingLessons(JSON.parse(savedLessons));
    }
  }, []);

  const handleGenerateLesson = async (day: number) => {
    setGeneratingDay(day);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Add to existing lessons
    const newLessons = [...existingLessons, day];
    setExistingLessons(newLessons);
    localStorage.setItem("demo-existing-lessons", JSON.stringify(newLessons));

    toast.success("Lesson Generated!", {
      description: `Day ${day} is ready for you to learn!`,
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    });

    setGeneratingDay(null);

    // Redirect to lesson page
    router.push(`/bootcamp/${bootcampId}/lesson/${day}`);
  };

  const handleViewLesson = (dayNumber: number) => {
    router.push(`/bootcamp/${bootcampId}/lesson/${dayNumber}`);
  };

  const handleResetDemo = () => {
    // Clear all demo-related localStorage
    localStorage.removeItem("demo-current-day");
    localStorage.removeItem("demo-existing-lessons");

    // Clear all activity data
    for (let i = 1; i <= DEMO_BOOTCAMP.duration_days; i++) {
      localStorage.removeItem(`demo-activities-day-${i}`);
    }

    // Reset state
    setCurrentDay(1);
    setExistingLessons([]);

    toast.success("Demo reset!", {
      description: "Starting fresh from Day 1",
      icon: <RotateCcw className="w-5 h-5 text-blue-400" />,
    });
  };

  const completedDays = Math.max(0, currentDay - 1);
  const totalDays = DEMO_BOOTCAMP.duration_days;
  const progressPercentage = Math.round((completedDays / totalDays) * 100);

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
            <span className="text-slate-400">Bootcamp (Demo)</span>
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
                    Demo User
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-300 text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    Demo Mode
                  </span>
                  <button
                    onClick={handleResetDemo}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-slate-300 text-xs hover:bg-slate-700 transition-colors"
                    title="Reset demo progress"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Demo
                  </button>
                </div>
                <h1
                  className="text-4xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  {DEMO_BOOTCAMP.title}
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {DEMO_BOOTCAMP.goal}
                </p>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Progress card */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Target className="w-4 h-4" />
                  <span>Your Progress</span>
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
                  <span>Current Day</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {currentDay}
                  </span>
                  <span className="text-sm text-slate-500">of {totalDays}</span>
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
                {DEMO_SYLLABUS.days.length} days total
              </p>
            </div>

            {/* Syllabus days */}
            <div className="space-y-4">
              {DEMO_SYLLABUS.days.map((day, index) => {
                const isPast = day.day < currentDay;
                const isCurrent = day.day === currentDay;
                const isFuture = day.day > currentDay;
                const hasLesson = existingLessons.includes(day.day);
                const isGenerating = generatingDay === day.day;

                return (
                  <div
                    key={day.day}
                    className={`relative group ${isFuture ? "opacity-60" : ""}`}
                  >
                    {/* Timeline line */}
                    {index < DEMO_SYLLABUS.days.length - 1 && (
                      <div
                        className={`absolute left-6 top-16 bottom-0 w-0.5 ${
                          isPast ? "bg-[#6749fb]" : "bg-slate-800"
                        }`}
                      ></div>
                    )}

                    {/* Day card */}
                    <div
                      className={`relative flex gap-4 p-5 rounded-xl border transition-all ${
                        isCurrent
                          ? "bg-blue-500/5 border-blue-500/30 shadow-lg shadow-blue-500/10"
                          : isPast
                            ? "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                            : "bg-slate-900/30 border-slate-800/50"
                      }`}
                    >
                      {/* Day number badge */}
                      <div className="shrink-0">
                        <div
                          className={`relative w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                            isCurrent
                              ? "bg-[#6749fb] text-white shadow-lg shadow-[#6749fb]/30"
                              : isPast
                                ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400"
                                : "bg-slate-800 border border-slate-700 text-slate-500"
                          }`}
                        >
                          {day.day}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3
                            className={`font-semibold ${
                              isCurrent
                                ? "text-white"
                                : isPast
                                  ? "text-slate-300"
                                  : "text-slate-400"
                            }`}
                            style={{ fontFamily: "var(--font-lora)" }}
                          >
                            {day.title}
                            {isCurrent && (
                              <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                                Current
                              </span>
                            )}
                          </h3>

                          {/* Status badge */}
                          {isPast && (
                            <span className="text-xs text-green-400 flex items-center gap-1 shrink-0">
                              <Check className="w-3 h-3" />
                              Completed
                            </span>
                          )}
                          {isFuture && (
                            <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                              <Lock className="w-3 h-3" />
                              Locked
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-sm mb-3 ${
                            isCurrent ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {day.description}
                        </p>

                        {/* Topics */}
                        <div className="flex flex-wrap gap-2">
                          {day.topics.map((topic, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-2.5 py-1 rounded-full ${
                                isCurrent
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  : isPast
                                    ? "bg-slate-800/80 text-slate-400 border border-slate-700/50"
                                    : "bg-slate-800/50 text-slate-500 border border-slate-700/30"
                              }`}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>

                        {/* Action buttons */}
                        {(isCurrent || (isPast && hasLesson)) && (
                          <div className="mt-4 flex gap-2">
                            {hasLesson ? (
                              <button
                                onClick={() => handleViewLesson(day.day)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-all border border-slate-700"
                              >
                                <BookOpen className="w-4 h-4" />
                                <span>View Lesson</span>
                              </button>
                            ) : (
                              isCurrent && (
                                <button
                                  onClick={() => handleGenerateLesson(day.day)}
                                  disabled={isGenerating}
                                  className="group/btn inline-flex items-center gap-2 px-4 py-2 bg-[#6749fb] hover:bg-[#6749fb]/90 disabled:bg-slate-700 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-[#6749fb]/25 disabled:shadow-none disabled:cursor-not-allowed"
                                >
                                  {isGenerating ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      <span>Generating...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                                      <span>Generate Lesson</span>
                                    </>
                                  )}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
