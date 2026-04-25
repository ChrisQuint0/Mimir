"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EnrollButtonProps {
  bootcampId: string;
  initiallyEnrolled: boolean;
  className?: string;
  idleLabel?: string;
  enrolledLabel?: string;
  pendingLabel?: string;
  onEnrollmentChange?: (enrolled: boolean) => void;
}

export function EnrollButton({
  bootcampId,
  initiallyEnrolled,
  className,
  idleLabel = "Enroll",
  enrolledLabel = "Continue Learning",
  pendingLabel = "Enrolling...",
  onEnrollmentChange,
}: EnrollButtonProps) {
  const router = useRouter();
  const [isEnrolled, setIsEnrolled] = useState(initiallyEnrolled);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnenroll, setShowUnenroll] = useState(false);

  const handleEnroll = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/bootcamp/${bootcampId}/enroll`, {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to enroll");

      setIsEnrolled(true);
      onEnrollmentChange?.(true);
      toast.success("Enrolled successfully", {
        description: "This bootcamp is now part of your learning path.",
      });
      router.refresh();
    } catch (error: unknown) {
      toast.error("Enrollment failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnenroll = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/bootcamp/${bootcampId}/unenroll`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to unenroll");

      setIsEnrolled(false);
      setShowUnenroll(false);
      onEnrollmentChange?.(false);
      toast.success("Unenrolled", {
        description: "You have been removed from this bootcamp.",
      });
      router.refresh();
    } catch (error: unknown) {
      toast.error("Unenroll failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEnrolled) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href={`/bootcamp/${bootcampId}`}
          className={cn(
            "inline-flex items-center justify-center rounded-xl bg-[#6749fb] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5a3ee0]",
            className,
          )}
        >
          {enrolledLabel}
        </Link>
        {showUnenroll ? (
          <button
            onClick={handleUnenroll}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-500/40 px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserMinus className="h-4 w-4" />
            )}
            Unenroll
          </button>
        ) : (
          <button
            onClick={() => setShowUnenroll(true)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-400"
            title="Unenroll from bootcamp"
          >
            <UserMinus className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={isSubmitting}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#6749fb] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5a3ee0] disabled:cursor-not-allowed disabled:bg-slate-700",
        className,
      )}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{pendingLabel}</span>
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          <span>{idleLabel}</span>
        </>
      )}
    </button>
  );
}
