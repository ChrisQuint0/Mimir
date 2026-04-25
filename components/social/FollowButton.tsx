"use client";

import { useState } from "react";
import { Loader2, UserPlus, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  userId: string;
  initiallyFollowing: boolean;
  size?: "sm" | "md";
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({
  userId,
  initiallyFollowing,
  size = "sm",
  className,
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initiallyFollowing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not update follow status");
      }

      const nextValue = !isFollowing;
      setIsFollowing(nextValue);
      onFollowChange?.(nextValue);
      toast.success(nextValue ? "Now following" : "Unfollowed");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Follow action failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        isFollowing
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
          : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-600 hover:text-white",
        className,
      )}
    >
      {isSubmitting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="h-3.5 w-3.5" />
      ) : (
        <UserPlus className="h-3.5 w-3.5" />
      )}
      <span>{isFollowing ? "Following" : "Follow"}</span>
    </button>
  );
}
