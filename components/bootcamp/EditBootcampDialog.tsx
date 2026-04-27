"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FilePenLine, Loader2, PencilLine, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SyllabusDay } from "@/lib/types/bootcamp";
import { toast } from "sonner";

interface EditBootcampDialogProps {
  bootcampId: string;
  initialTitle: string;
  initialGoal: string;
  initialCaption?: string | null;
  initialDays: SyllabusDay[];
  isPublished: boolean;
}

interface EditableDay {
  day: number;
  title: string;
  description: string;
  topics: string;
}

interface EditableLesson {
  id: string;
  dayNumber: number;
  title: string;
  content: string;
}

type EditTab = "bootcamp" | "lesson";

function toEditableDays(days: SyllabusDay[]): EditableDay[] {
  return days.map((day) => ({
    day: day.day,
    title: day.title,
    description: day.description,
    topics: day.topics.join("\n"),
  }));
}

export function EditBootcampDialog({
  bootcampId,
  initialTitle,
  initialGoal,
  initialCaption = "",
  initialDays,
  isPublished,
}: EditBootcampDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [goal, setGoal] = useState(initialGoal);
  const [days, setDays] = useState<EditableDay[]>(toEditableDays(initialDays));
  const [lessons, setLessons] = useState<EditableLesson[]>([]);
  const [activeTab, setActiveTab] = useState<EditTab>("bootcamp");
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [lessonsLoaded, setLessonsLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
    setGoal(initialGoal);
    setDays(toEditableDays(initialDays));
    setLessons([]);
    setActiveTab("bootcamp");
    setLessonsLoaded(false);
  }, [initialDays, initialGoal, initialTitle]);

  useEffect(() => {
    async function loadLessons() {
      if (!open || activeTab !== "lesson" || lessonsLoaded) {
        return;
      }

      setLoadingLessons(true);

      try {
        const response = await fetch(`/api/bootcamp/${bootcampId}/lessons`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load lessons");
        }

        setLessons(data.lessons || []);
        setLessonsLoaded(true);
      } catch (error: unknown) {
        toast.error("Could not load lesson content", {
          description:
            error instanceof Error
              ? error.message
              : "You can still edit the syllabus and try again.",
        });
      } finally {
        setLoadingLessons(false);
      }
    }

    void loadLessons();
  }, [activeTab, bootcampId, lessonsLoaded, open]);

  const handleDayChange = (
    index: number,
    field: keyof EditableDay,
    value: string,
  ) => {
    setDays((currentDays) =>
      currentDays.map((day, currentIndex) =>
        currentIndex === index ? { ...day, [field]: value } : day,
      ),
    );
  };

  const handleLessonChange = (
    index: number,
    field: keyof EditableLesson,
    value: string,
  ) => {
    setLessons((currentLessons) =>
      currentLessons.map((lesson, currentIndex) =>
        currentIndex === index ? { ...lesson, [field]: value } : lesson,
      ),
    );
  };

  const handleSave = async () => {
    if (!title.trim() || !goal.trim()) {
      toast.error("Missing information", {
        description: "Title and goal are required.",
      });
      return;
    }

    const normalizedDays = days.map((day, index) => ({
      day: index + 1,
      title: day.title.trim(),
      description: day.description.trim(),
      topics: day.topics
        .split("\n")
        .map((topic) => topic.trim())
        .filter(Boolean),
    }));

    if (
      normalizedDays.some(
        (day) => !day.title || !day.description || day.topics.length === 0,
      )
    ) {
      toast.error("Complete each day", {
        description:
          "Every syllabus day needs a title, description, and at least one topic.",
      });
      return;
    }

    const invalidLesson = lessons.find(
      (lesson) => !lesson.title.trim() || !lesson.content.trim(),
    );

    if (invalidLesson) {
      toast.error("Complete each lesson", {
        description:
          "Lesson title and content cannot be empty when updating generated lessons.",
      });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/bootcamp/${bootcampId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          goal: goal.trim(),
          caption: initialCaption,
          syllabus: {
            days: normalizedDays,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update bootcamp");
      }

      if (lessons.length > 0) {
        const lessonResponse = await fetch(
          `/api/bootcamp/${bootcampId}/lessons`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lessons: lessons.map((lesson) => ({
                dayNumber: lesson.dayNumber,
                title: lesson.title.trim(),
                content: lesson.content.trim(),
              })),
            }),
          },
        );

        const lessonData = await lessonResponse.json();

        if (!lessonResponse.ok) {
          throw new Error(
            lessonData.error || "Failed to update lesson content",
          );
        }
      }

      toast.success("Bootcamp updated", {
        description: isPublished
          ? "Changes are now live everywhere this bootcamp appears."
          : "Your draft has been updated.",
      });
      setOpen(false);
      router.refresh();
    } catch (error: unknown) {
      toast.error("Update failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-100 text-slate-950 hover:bg-white">
          <PencilLine className="h-4 w-4" />
          Edit Bootcamp
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[92vh] flex-col overflow-hidden border-slate-800 bg-slate-950 p-0 text-white sm:max-w-5xl">
        <DialogHeader className="border-b border-slate-800 px-6 py-5">
          <DialogTitle>Edit Bootcamp</DialogTitle>
          <DialogDescription className="text-slate-400">
            Update title, goal, syllabus, and lesson content. Published
            bootcamps refresh everywhere after save.
          </DialogDescription>
        </DialogHeader>

        <div className="border-b border-slate-800 px-6 py-3">
          <div className="inline-flex rounded-xl border border-slate-700 bg-slate-900/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("bootcamp")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "bootcamp"
                  ? "bg-[#6749fb] text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Edit Bootcamp
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("lesson")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "lesson"
                  ? "bg-[#6749fb] text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Edit Lesson
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-8">
            {activeTab === "bootcamp" && (
              <>
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Core Details
                </h3>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bootcamp-title" className="text-slate-300">
                      Title
                    </Label>
                    <Input
                      id="bootcamp-title"
                      value={title}
                      onChange={(event) =>
                        setTitle(event.target.value.slice(0, 60))
                      }
                      disabled={saving}
                      className="border-slate-700 bg-slate-900 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bootcamp-goal" className="text-slate-300">
                      Goal
                    </Label>
                    <Textarea
                      id="bootcamp-goal"
                      value={goal}
                      onChange={(event) =>
                        setGoal(event.target.value.slice(0, 200))
                      }
                      disabled={saving}
                      rows={4}
                      className="border-slate-700 bg-slate-900 text-white"
                    />
                  </div>
                </div>
              </section>

                <section className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Syllabus Days
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      One topic per line. Day order is preserved and will be
                      renumbered automatically.
                    </p>
                  </div>

                  {days.map((day, index) => (
                    <div
                      key={day.day}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
                    >
                      <div className="mb-4 text-sm font-medium text-blue-300">
                        Day {index + 1}
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Day title</Label>
                          <Input
                            value={day.title}
                            onChange={(event) =>
                              handleDayChange(index, "title", event.target.value)
                            }
                            disabled={saving}
                            className="border-slate-700 bg-slate-950 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Description</Label>
                          <Textarea
                            value={day.description}
                            onChange={(event) =>
                              handleDayChange(
                                index,
                                "description",
                                event.target.value,
                              )
                            }
                            disabled={saving}
                            rows={3}
                            className="border-slate-700 bg-slate-950 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Topics</Label>
                          <Textarea
                            value={day.topics}
                            onChange={(event) =>
                              handleDayChange(index, "topics", event.target.value)
                            }
                            disabled={saving}
                            rows={4}
                            className="border-slate-700 bg-slate-950 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              </>
            )}

            {activeTab === "lesson" && (
              <section className="space-y-4">
                  <div>
                    <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                      <FilePenLine className="h-4 w-4" />
                      Lesson Content
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Edit generated lesson title and content. Days without
                      generated lessons are skipped here.
                    </p>
                  </div>

                  {loadingLessons && (
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading lesson content...
                    </div>
                  )}

                  {!loadingLessons && lessons.length === 0 && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400">
                      No generated lessons yet. Generate a day lesson from the
                      syllabus to edit its full content here.
                    </div>
                  )}

                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
                    >
                      <div className="mb-4 text-sm font-medium text-emerald-300">
                        Day {lesson.dayNumber} Lesson
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Lesson title</Label>
                          <Input
                            value={lesson.title}
                            onChange={(event) =>
                              handleLessonChange(
                                index,
                                "title",
                                event.target.value,
                              )
                            }
                            disabled={saving}
                            className="border-slate-700 bg-slate-950 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Lesson content</Label>
                          <Textarea
                            value={lesson.content}
                            onChange={(event) =>
                              handleLessonChange(
                                index,
                                "content",
                                event.target.value,
                              )
                            }
                            disabled={saving}
                            rows={10}
                            className="border-slate-700 bg-slate-950 text-sm text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t border-slate-800 px-6 py-4">
          <Button
            onClick={handleSave}
            disabled={saving || loadingLessons}
            className="bg-[#6749fb] text-white hover:bg-[#5a3ee0]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
