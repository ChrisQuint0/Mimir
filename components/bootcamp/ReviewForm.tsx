"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { StarRating } from "./StarRating";
import type { ReviewWithAuthor } from "@/lib/types/bootcamp";

interface ReviewFormProps {
  bootcampId: string;
  existingReview?: ReviewWithAuthor | null;
  onReviewSaved: (review: ReviewWithAuthor) => void;
}

export function ReviewForm({
  bootcampId,
  existingReview,
  onReviewSaved,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/bootcamp/${bootcampId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save review");

      onReviewSaved(data.review);
      toast.success(existingReview ? "Review updated" : "Review submitted", {
        description: "Thank you for your feedback!",
      });
    } catch (error: unknown) {
      toast.error("Could not save review", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4"
    >
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        {existingReview ? "Update your review" : "Leave a review"}
      </p>

      <div className="space-y-1">
        <p className="text-sm text-slate-400">Your rating</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div className="space-y-1">
        <label htmlFor="review-comment" className="text-sm text-slate-400">
          Comment <span className="text-slate-600">(optional)</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share what you thought about this bootcamp…"
          rows={3}
          maxLength={1000}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-[#6749fb] focus:outline-none focus:ring-1 focus:ring-[#6749fb]"
        />
        <p className="text-right text-xs text-slate-600">
          {comment.length}/1000
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="inline-flex items-center gap-2 rounded-xl bg-[#6749fb] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5a3ee0] disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {existingReview ? "Update Review" : "Submit Review"}
      </button>
    </form>
  );
}
