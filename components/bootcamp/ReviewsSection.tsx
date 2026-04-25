"use client";

import { useState } from "react";
import { MessageSquare, UserCircle2 } from "lucide-react";
import { StarRating } from "./StarRating";
import { ReviewForm } from "./ReviewForm";
import type { ReviewWithAuthor } from "@/lib/types/bootcamp";

interface ReviewsSectionProps {
  bootcampId: string;
  initialReviews: ReviewWithAuthor[];
  canReview: boolean;
  currentUserId?: string;
}

function AverageStars({ reviews }: { reviews: ReviewWithAuthor[] }) {
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const rounded = Math.round(avg * 10) / 10;

  return (
    <div className="flex items-center gap-3">
      <span className="text-3xl font-bold text-white">{rounded}</span>
      <div className="space-y-0.5">
        <StarRating value={Math.round(avg)} size="sm" />
        <p className="text-xs text-slate-500">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewWithAuthor }) {
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(review.updated_at));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400">
            <UserCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              {review.author?.display_name ?? "Learner"}
            </p>
            <p className="text-xs text-slate-600">{date}</p>
          </div>
        </div>
        <StarRating value={review.rating} size="sm" />
      </div>
      {review.comment && (
        <p className="text-sm text-slate-400 leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  );
}

export function ReviewsSection({
  bootcampId,
  initialReviews,
  canReview,
  currentUserId,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewWithAuthor[]>(initialReviews);

  const myReview = currentUserId
    ? (reviews.find((r) => r.user_id === currentUserId) ?? null)
    : null;

  const handleReviewSaved = (saved: ReviewWithAuthor) => {
    setReviews((prev) => {
      const existing = prev.findIndex((r) => r.user_id === saved.user_id);
      if (existing >= 0) {
        const next = [...prev];
        // preserve the author field from existing review since API response may not include it
        next[existing] = { ...next[existing], ...saved };
        return next;
      }
      return [saved, ...prev];
    });
  };

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Reviews</h2>
        <AverageStars reviews={reviews} />
      </div>

      {/* Form for enrolled students */}
      {canReview && (
        <ReviewForm
          bootcampId={bootcampId}
          existingReview={myReview}
          onReviewSaved={handleReviewSaved}
        />
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-800 py-10 text-center">
          <MessageSquare className="h-7 w-7 text-slate-700" />
          <p className="text-sm text-slate-500">No reviews yet.</p>
          {canReview && (
            <p className="text-xs text-slate-600">
              Be the first to share your experience!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}
