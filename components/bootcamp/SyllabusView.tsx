"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock, Circle, Sparkles, Loader2, BookOpen } from "lucide-react";
import { SyllabusDay } from "@/lib/types/bootcamp";
import { toast } from "sonner";

interface SyllabusViewProps {
  days: SyllabusDay[];
  currentDay: number;
  bootcampId: string;
  bootcampGoal: string;
  existingLessons: number[]; // Array of day numbers that have lessons
}

export function SyllabusView({
  days,
  currentDay,
  bootcampId,
  bootcampGoal,
  existingLessons,
}: SyllabusViewProps) {
  const router = useRouter();
  const [generatingDay, setGeneratingDay] = useState<number | null>(null);

  const handleGenerateLesson = async (day: SyllabusDay) => {
    setGeneratingDay(day.day);

    try {
      console.log("Generating lesson for day", day.day);

      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bootcampId,
          dayNumber: day.day,
          dayTitle: day.title,
          topics: day.topics,
          goal: bootcampGoal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate lesson");
      }

      toast.success("Lesson Generated!", {
        description: `Day ${day.day} is ready for you to learn!`,
        icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      });

      // Redirect to the lesson page
      router.push(`/bootcamp/${bootcampId}/lesson/${day.day}`);
      router.refresh();
    } catch (error: any) {
      console.error("Failed to generate lesson:", error);
      toast.error("Generation Failed", {
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setGeneratingDay(null);
    }
  };

  const handleViewLesson = (dayNumber: number) => {
    router.push(`/bootcamp/${bootcampId}/lesson/${dayNumber}`);
  };

  return (
    <div className="space-y-4">
      {days.map((day, index) => {
        const isPast = day.day < currentDay;
        const isCurrent = day.day === currentDay;
        const isFuture = day.day > currentDay;
        const hasLesson = existingLessons.includes(day.day);
        const isGenerating = generatingDay === day.day;

        return (
          <div
            key={day.day}
            className={`relative group ${isFuture ? "opacity-60 cursor-not-allowed" : ""}`}
            title={isFuture ? `Complete Day ${day.day - 1} to unlock this lesson` : ""}
          >
            {/* Timeline line (except for last item) */}
            {index < days.length - 1 && (
              <div
                className={`absolute left-6 top-[64px] bottom-0 w-0.5 ${isPast
                  ? "bg-[#6749fb]"
                  : "bg-slate-800"
                  }`}
              ></div>
            )}

            {/* Day card */}
            <div
              className={`relative flex gap-4 p-5 rounded-xl border transition-all ${isCurrent
                ? "bg-blue-500/5 border-blue-500/30 shadow-lg shadow-blue-500/10"
                : isPast
                  ? "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                  : "bg-slate-900/30 border-slate-800/50"
                }`}
            >
              {/* Day number badge */}
              <div className="flex-shrink-0">
                <div
                  className={`relative w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${isCurrent
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
                    className={`font-semibold ${isCurrent
                      ? "text-white"
                      : isPast
                        ? "text-slate-300"
                        : "text-slate-400"
                      }`}
                    style={{ fontFamily: 'var(--font-lora)' }}
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
                    <span className="text-xs text-green-400 flex items-center gap-1 flex-shrink-0">
                      <Check className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                  {isFuture && (
                    <span className="text-xs text-slate-500 flex items-center gap-1 flex-shrink-0">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                </div>

                <p
                  className={`text-sm mb-3 ${isCurrent ? "text-slate-400" : "text-slate-500"
                    }`}
                >
                  {day.description}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-2">
                  {day.topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2.5 py-1 rounded-full ${isCurrent
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

                {/* Action buttons for current and past days */}
                {(isCurrent || (isPast && hasLesson)) && (
                  <div className="mt-4 flex gap-2">
                    {/* Generate or View Lesson button */}
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
                          onClick={() => handleGenerateLesson(day)}
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

                {/* Tooltip for locked days */}
                {isFuture && (
                  <p className="text-xs text-slate-600 mt-3 italic">
                    Complete Day {day.day - 1} to unlock this lesson
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
