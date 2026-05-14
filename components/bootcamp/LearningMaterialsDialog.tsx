"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  FileText,
  Loader2,
  Presentation,
  Sparkles,
  Video,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LearningMaterialsDialogProps {
  lessonId: string;
  lessonTitle: string;
}

const GENERATION_STEPS = [
  "Analyzing lesson goals...",
  "Drafting presentation slides...",
  "Creating video lesson flow...",
  "Compiling handout summary...",
  "Finalizing downloadable assets...",
];

const MATERIALS = [
  {
    id: "video",
    title: "Video Lesson",
    description: "Short recorded walkthrough for this lesson",
    href: "/materials/sample_video_lesson.mp4",
    fileName: "video-lesson.mp4",
    icon: Video,
  },
  {
    id: "handout",
    title: "Handout",
    description: "Printable notes and key points",
    href: "/materials/handout_example.pdf",
    fileName: "lesson-handout.pdf",
    icon: FileText,
  },
  {
    id: "slides",
    title: "Presentation",
    description: "PPTX deck for review and studying",
    href: "/materials/sample_ppt.pptx",
    fileName: "lesson-slides.pptx",
    icon: Presentation,
  },
];

export function LearningMaterialsDialog({
  lessonId,
  lessonTitle,
}: LearningMaterialsDialogProps) {
  const storageKey = useMemo(
    () => `learning-materials-ready:${lessonId}`,
    [lessonId],
  );
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const persisted = window.localStorage.getItem(storageKey);
    setIsReady(persisted === "true");
  }, [storageKey]);

  useEffect(() => {
    if (!isGenerating) {
      return;
    }

    setStepIndex(0);
    const stepTimer = window.setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= GENERATION_STEPS.length - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, 700);

    const finishTimer = window.setTimeout(() => {
      setIsGenerating(false);
      setIsReady(true);
      window.localStorage.setItem(storageKey, "true");
      toast.success("Learning materials ready", {
        description: "Downloads are now available for this lesson.",
      });
    }, 3600);

    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(finishTimer);
    };
  }, [isGenerating, storageKey]);

  const handleGenerate = () => {
    if (isGenerating || isReady) {
      return;
    }
    setIsGenerating(true);
  };

  return (
    <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            Lesson Resources
          </p>
          <h3 className="mt-2 text-base md:text-lg font-semibold text-white">
            Learning Materials
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Generate and download a video, handout, and slides for this lesson.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="inline-flex items-center gap-2 rounded-xl bg-[#0ea5e9] px-4 py-2.5 text-white hover:bg-[#0284c7]">
              <Sparkles className="h-4 w-4" />
              <span>Learning Materials</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Learning Materials</DialogTitle>
              <DialogDescription className="text-slate-400">
                {lessonTitle}
              </DialogDescription>
            </DialogHeader>

            {!isReady && !isGenerating && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-300">
                  Start AI generation to prepare downloadable materials for this
                  lesson.
                </p>
                <Button
                  onClick={handleGenerate}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#6749fb] text-white hover:bg-[#5a3ee0]"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate with AI
                </Button>
              </div>
            )}

            {isGenerating && (
              <div className="rounded-xl border border-blue-500/25 bg-blue-500/10 p-4">
                <div className="inline-flex items-center gap-2 text-blue-200">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">
                    AI is generating your materials...
                  </span>
                </div>
                <p className="mt-3 text-sm text-blue-100/90">
                  {GENERATION_STEPS[stepIndex]}
                </p>
              </div>
            )}

            {isReady && (
              <div className="space-y-3">
                {MATERIALS.map((material) => {
                  const Icon = material.icon;
                  return (
                    <div
                      key={material.id}
                      className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900">
                          <Icon className="h-4 w-4 text-slate-200" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {material.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            {material.description}
                          </p>
                        </div>
                      </div>

                      <a
                        href={material.href}
                        download={material.fileName}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 transition-colors hover:border-slate-500"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
