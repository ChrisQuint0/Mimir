"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Lock,
  Sparkles,
  Loader2,
  BookOpen,
  Send,
  Globe2,
  Trash2,
} from "lucide-react";
import { SyllabusDay } from "@/lib/types/bootcamp";
import { toast } from "sonner";

interface SyllabusViewProps {
  days: SyllabusDay[];
  currentDay: number;
  bootcampId: string;
  bootcampGoal: string;
  existingLessons: number[]; // Array of day numbers that have lessons
  canGenerateLessons: boolean;
  canAccessLessons: boolean;
  showPublishControls?: boolean;
  initialCaption?: string | null;
  isPublished: boolean;
}

export function SyllabusView({
  days,
  currentDay,
  bootcampId,
  bootcampGoal,
  existingLessons,
  canGenerateLessons,
  canAccessLessons,
  showPublishControls = false,
  initialCaption = "",
  isPublished,
}: SyllabusViewProps) {
  const router = useRouter();
  const [generatingDay, setGeneratingDay] = useState<number | null>(null);
  const [caption, setCaption] = useState(initialCaption ?? "");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(isPublished);

  useEffect(() => {
    setCaption(initialCaption ?? "");
  }, [initialCaption]);

  useEffect(() => {
    setPublished(isPublished);
  }, [isPublished]);

  const captionCharsLeft = 280 - caption.length;

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
    } catch (error: unknown) {
      console.error("Failed to generate lesson:", error);
      toast.error("Generation Failed", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setGeneratingDay(null);
    }
  };

  const handleViewLesson = (dayNumber: number) => {
    router.push(`/bootcamp/${bootcampId}/lesson/${dayNumber}`);
  };

  const handlePublish = async () => {
    if (!caption.trim()) {
      toast.error("Add a caption first", {
        description: "Write a short note before publishing your bootcamp.",
      });
      return;
    }

    setPublishing(true);

    try {
      const response = await fetch(`/api/bootcamp/${bootcampId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: caption.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to publish bootcamp");
      }

      setPublished(true);
      setCaption(data.bootcamp.caption);
      toast.success(published ? "Post updated" : "Bootcamp published", {
        description: published
          ? "Your published post now shows the latest caption."
          : "Your bootcamp is now live in the community feed.",
      });
      router.refresh();
    } catch (error: unknown) {
      toast.error(published ? "Update failed" : "Publish failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setPublishing(true);

    try {
      const response = await fetch(`/api/bootcamp/${bootcampId}/publish`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove published post");
      }

      setPublished(false);
      toast.success("Post removed", {
        description: "Your bootcamp is no longer shown in the community feed.",
      });
      router.refresh();
    } catch (error: unknown) {
      toast.error("Could not remove post", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-4">
      {showPublishControls && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-blue-300">
                <Globe2 className="h-3.5 w-3.5" />
                Share to feed
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Publish this bootcamp for other learners
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Add a short caption about what this bootcamp helps people learn.
                Once published, it appears in the main feed and others can
                enroll. You can edit the caption later or remove the published
                post at any time.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              {published ? "Published" : "Draft"}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value.slice(0, 280))}
              disabled={publishing}
              rows={4}
              placeholder="Tell the community why this bootcamp is worth enrolling in..."
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                className={`text-xs ${captionCharsLeft < 25 ? "text-amber-400" : "text-slate-500"}`}
              >
                {captionCharsLeft} characters left
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {published && (
                  <button
                    onClick={handleUnpublish}
                    disabled={publishing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-400"
                  >
                    {publishing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Removing...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Remove Post</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={handlePublish}
                  disabled={publishing || !caption.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6749fb] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5a3ee0] disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  {publishing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{published ? "Saving..." : "Publishing..."}</span>
                    </>
                  ) : published ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Save Post</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Publish</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {days.map((day, index) => {
        const isPast = canAccessLessons && day.day < currentDay;
        const isCurrent = canAccessLessons && day.day === currentDay;
        const isFuture = !canAccessLessons || day.day > currentDay;
        const hasLesson = existingLessons.includes(day.day);
        const isGenerating = generatingDay === day.day;

        return (
          <div
            key={day.day}
            className={`relative group ${isFuture ? "opacity-60 cursor-not-allowed" : ""}`}
            title={
              isFuture
                ? canAccessLessons
                  ? `Complete Day ${day.day - 1} to unlock this lesson`
                  : "Enroll to unlock this bootcamp"
                : ""
            }
          >
            {/* Timeline line (except for last item) */}
            {index < days.length - 1 && (
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

                {/* Action buttons for current and past days */}
                {canAccessLessons && (isCurrent || (isPast && hasLesson)) && (
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
                      isCurrent &&
                      canGenerateLessons && (
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
                    {isCurrent &&
                      !hasLesson &&
                      !canGenerateLessons &&
                      showPublishControls && (
                        <p className="text-xs text-slate-500 italic py-2">
                          Generate all lessons before publishing. Published
                          bootcamps cannot be edited.
                        </p>
                      )}
                  </div>
                )}

                {/* Tooltip for locked days */}
                {isFuture && (
                  <p className="text-xs text-slate-600 mt-3 italic">
                    {canAccessLessons
                      ? `Complete Day ${day.day - 1} to unlock this lesson`
                      : "Enroll in this bootcamp to unlock the lessons"}
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
