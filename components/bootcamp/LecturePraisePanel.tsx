"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Flame,
  Handshake,
  Medal,
  Rocket,
  Sparkles,
  Trophy,
} from "lucide-react";
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
import { toast } from "sonner";

type PraiseId =
  | "clear_explainer"
  | "sharp_examples"
  | "mind_opener"
  | "practical_builder"
  | "momentum_boost"
  | "legendary_teacher";

type PraiseCounts = Record<PraiseId, number>;

interface PraiseOption {
  id: PraiseId;
  label: string;
  description: string;
  charisma: number;
  icon: LucideIcon;
  colorClass: string;
}

interface LecturePraisePanelProps {
  lessonId: string;
  lessonTitle: string;
}

const PRAISE_OPTIONS: PraiseOption[] = [
  {
    id: "clear_explainer",
    label: "Clear Explainer",
    description: "Easy to follow and well structured",
    charisma: 5,
    icon: Medal,
    colorClass: "text-blue-300 border-blue-500/35 bg-blue-500/10",
  },
  {
    id: "sharp_examples",
    label: "Sharp Examples",
    description: "Examples made the concept click",
    charisma: 6,
    icon: Brain,
    colorClass: "text-violet-300 border-violet-500/35 bg-violet-500/10",
  },
  {
    id: "mind_opener",
    label: "Mind Opener",
    description: "Fresh perspective unlocked",
    charisma: 8,
    icon: Sparkles,
    colorClass: "text-amber-300 border-amber-500/35 bg-amber-500/10",
  },
  {
    id: "practical_builder",
    label: "Practical Builder",
    description: "Immediately useful in real projects",
    charisma: 7,
    icon: Handshake,
    colorClass: "text-emerald-300 border-emerald-500/35 bg-emerald-500/10",
  },
  {
    id: "momentum_boost",
    label: "Momentum Boost",
    description: "Motivating and action focused",
    charisma: 4,
    icon: Rocket,
    colorClass: "text-orange-300 border-orange-500/35 bg-orange-500/10",
  },
  {
    id: "legendary_teacher",
    label: "Legendary Teacher",
    description: "Top tier lecture energy",
    charisma: 10,
    icon: Trophy,
    colorClass: "text-rose-300 border-rose-500/35 bg-rose-500/10",
  },
];

function createEmptyCounts(): PraiseCounts {
  return {
    clear_explainer: 0,
    sharp_examples: 0,
    mind_opener: 0,
    practical_builder: 0,
    momentum_boost: 0,
    legendary_teacher: 0,
  };
}

function createSingleReactionCounts(
  selectedPraise: PraiseId | null,
): PraiseCounts {
  const next = createEmptyCounts();
  if (selectedPraise) {
    next[selectedPraise] = 1;
  }
  return next;
}

export function LecturePraisePanel({
  lessonId,
  lessonTitle,
}: LecturePraisePanelProps) {
  const storageKey = `lecture-praise:${lessonId}`;
  const [counts, setCounts] = useState<PraiseCounts>(createEmptyCounts);
  const [selectedPraise, setSelectedPraise] = useState<PraiseId | null>(null);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as {
        counts?: Partial<PraiseCounts>;
        selectedPraise?: PraiseId | null;
      };

      const nextSelectedPraise = parsed.selectedPraise ?? null;
      setSelectedPraise(nextSelectedPraise);
      // Keep exactly one active reaction per user for this lecture.
      setCounts(createSingleReactionCounts(nextSelectedPraise));
    } catch {
      // Ignore malformed local storage and keep defaults.
    }
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ counts, selectedPraise }),
    );
  }, [counts, hydrated, selectedPraise, storageKey]);

  const totalReactions = useMemo(() => {
    return Object.values(counts).reduce((sum, value) => sum + value, 0);
  }, [counts]);

  const charismaScore = useMemo(() => {
    return PRAISE_OPTIONS.reduce((score, option) => {
      return score + counts[option.id] * option.charisma;
    }, 0);
  }, [counts]);

  const topPraises = useMemo(() => {
    return [...PRAISE_OPTIONS]
      .sort((a, b) => counts[b.id] - counts[a.id])
      .filter((option) => counts[option.id] > 0)
      .slice(0, 3);
  }, [counts]);

  const handleReact = (option: PraiseOption) => {
    setCounts(createSingleReactionCounts(option.id));
    setSelectedPraise(option.id);
    setOpen(false);

    toast.success(
      selectedPraise && selectedPraise !== option.id
        ? "Praise changed"
        : "Praise sent",
      {
        description:
          selectedPraise && selectedPraise !== option.id
            ? `Updated to ${option.label}.`
            : `${option.label} added to this lecture.`,
      },
    );
  };

  return (
    <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            Lecture Praises
          </p>
          <h3 className="text-base md:text-lg font-semibold text-white">
            Drop a badge for this lecture
          </h3>
          <p className="text-sm text-slate-400">
            Pick a reaction style for{" "}
            <span className="text-slate-200">{lessonTitle}</span>.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="inline-flex items-center gap-2 rounded-xl bg-[#6749fb] px-4 py-2.5 text-white hover:bg-[#5a3ee0]">
              <Sparkles className="h-4 w-4" />
              <span>Praise This Lecture</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Choose a praise badge</DialogTitle>
              <DialogDescription className="text-slate-400">
                Each badge adds charisma points to this lecture.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 sm:grid-cols-2">
              {PRAISE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedPraise === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleReact(option)}
                    className={`rounded-xl border p-3 text-left transition-all hover:scale-[1.01] ${option.colorClass} ${
                      isSelected ? "ring-2 ring-white/40" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/20">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs uppercase tracking-wider text-slate-200">
                        +{option.charisma} charisma
                      </span>
                    </div>
                    <p className="mt-3 font-semibold text-white">
                      {option.label}
                    </p>
                    <p className="mt-1 text-sm text-slate-200/90">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Lecture Charisma
          </p>
          <div className="mt-1 flex items-end gap-2">
            <span className="text-2xl font-bold text-white">
              {charismaScore}
            </span>
            <span className="pb-1 text-sm text-slate-400">points</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {totalReactions} total reactions
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Top Praises
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {topPraises.length > 0 ? (
              topPraises.map((option) => (
                <span
                  key={option.id}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${option.colorClass}`}
                >
                  {option.label}
                  <span className="text-slate-100">{counts[option.id]}</span>
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">
                No praises yet. Be the first.
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
