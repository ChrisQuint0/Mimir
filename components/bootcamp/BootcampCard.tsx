"use client";

import { useRouter } from "next/navigation";
import { BookOpen, ArrowRight, Trash2, Calendar } from "lucide-react";
import { Bootcamp } from "@/lib/types/bootcamp";

interface BootcampCardProps {
  bootcamp: Bootcamp;
  onDelete: (id: string) => void;
}

export function BootcampCard({ bootcamp, onDelete }: BootcampCardProps) {
  const router = useRouter();
  const progress = Math.round(
    ((bootcamp.current_day - 1) / bootcamp.duration_days) * 100,
  );
  const isComplete = bootcamp.current_day > bootcamp.duration_days;

  return (
    <div
      className="group relative bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer"
      onClick={() => router.push(`/bootcamp/${bootcamp.id}`)}
    >
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(bootcamp.id);
        }}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">
            {bootcamp.title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2 mt-0.5">
            {bootcamp.goal}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2 mb-4">
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: isComplete
                ? "linear-gradient(to right, #10b981, #34d399)"
                : "linear-gradient(to right, #2563eb, #7c3aed)",
            }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {isComplete
                ? "Completed!"
                : `Day ${bootcamp.current_day} of ${bootcamp.duration_days}`}
            </span>
          </div>
          <div>•</div>
          <span>{progress}%</span>
        </div>

        {/* Continue Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/bootcamp/${bootcamp.id}`);
          }}
          className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors group/btn"
        >
          <span>{bootcamp.current_day === 1 ? "Start" : "Continue"}</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
