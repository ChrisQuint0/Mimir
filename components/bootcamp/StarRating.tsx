"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  value,
  onChange,
  size = "md",
  className,
}: StarRatingProps) {
  const interactive = Boolean(onChange);

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={cn(
            "transition-transform",
            interactive
              ? "cursor-pointer hover:scale-110 focus-visible:outline-none"
              : "cursor-default",
          )}
          aria-label={
            interactive
              ? `Rate ${star} star${star !== 1 ? "s" : ""}`
              : undefined
          }
        >
          <Star
            className={cn(
              sizeMap[size],
              "transition-colors",
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-slate-600",
              interactive && star > value && "hover:text-amber-400/60",
            )}
          />
        </button>
      ))}
    </div>
  );
}
