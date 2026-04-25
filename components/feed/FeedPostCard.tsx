"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Globe2, Layers3, Users } from "lucide-react";
import { FeedBootcamp } from "@/lib/types/bootcamp";
import { EnrollButton } from "@/components/bootcamp/EnrollButton";
import { FollowButton } from "@/components/social/FollowButton";

interface FeedPostCardProps {
  bootcamp: FeedBootcamp;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function formatPublishedDate(value?: string | null) {
  if (!value) {
    return "Just shared";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getJourneyStage(durationDays: number) {
  if (durationDays <= 14) return "Sprint";
  if (durationDays <= 30) return "Deep Dive";
  return "Long Arc";
}

export function FeedPostCard({ bootcamp }: FeedPostCardProps) {
  const [enrollmentCount, setEnrollmentCount] = useState(
    bootcamp.enrollment_count,
  );
  const initials = useMemo(
    () => getInitials(bootcamp.author.display_name || "Mimir Author"),
    [bootcamp.author.display_name],
  );
  const journeyStage = useMemo(
    () => getJourneyStage(bootcamp.duration_days),
    [bootcamp.duration_days],
  );

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-900/70 shadow-xl shadow-slate-950/20">
      <div className="border-b border-slate-800/80 px-6 py-5">
        <div className="flex items-start gap-4">
          <Link
            href={`/u/${bootcamp.author.id}`}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 text-sm font-semibold text-blue-200 transition-colors hover:from-blue-500/30 hover:to-cyan-500/30"
          >
            {initials || "MM"}
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/u/${bootcamp.author.id}`}
                className="text-[15px] font-semibold text-white hover:text-cyan-300 transition-colors"
              >
                {bootcamp.author.display_name}
              </Link>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1 text-sm text-slate-400">
                <Globe2 className="h-3.5 w-3.5" />
                {formatPublishedDate(bootcamp.published_at)}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              shared a new learning bootcamp
            </p>
          </div>

          {!bootcamp.is_owner && (
            <FollowButton
              userId={bootcamp.author.id}
              initiallyFollowing={bootcamp.is_following_author}
            />
          )}
        </div>

        {bootcamp.caption && (
          <p className="mt-4 max-w-4xl text-[15px] leading-7 text-slate-200">
            {bootcamp.caption}
          </p>
        )}
      </div>

      <div className="px-6 py-6">
        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-400/80">
              Shared Bootcamp
            </p>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-300">
              <Layers3 className="h-3 w-3 text-cyan-300" />
              {journeyStage}
            </span>
          </div>

          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
            <div>
              <h3
                className="text-2xl font-bold leading-tight text-white"
                style={{ fontFamily: "var(--font-lora)" }}
              >
                {bootcamp.title}
              </h3>
              <p className="mt-3 max-w-2xl text-slate-400 leading-7">
                {bootcamp.goal}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Snapshot
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-medium text-white">
                    {bootcamp.duration_days} days
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Enrolled</span>
                  <span className="font-medium text-white">
                    {enrollmentCount}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Track type</span>
                  <span className="font-medium text-white">{journeyStage}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5">
              <CalendarDays className="h-4 w-4 text-blue-400" />
              {bootcamp.duration_days} days
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5">
              <Users className="h-4 w-4 text-emerald-400" />
              {enrollmentCount} enrolled
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {bootcamp.is_owner ? (
              <Link
                href={`/bootcamp/${bootcamp.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
              >
                Published
              </Link>
            ) : (
              <EnrollButton
                bootcampId={bootcamp.id}
                initiallyEnrolled={bootcamp.is_enrolled}
                onEnrollmentChange={(enrolled) =>
                  setEnrollmentCount((count) => count + (enrolled ? 1 : -1))
                }
              />
            )}

            <Link
              href={`/bootcamp/${bootcamp.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white"
            >
              <span>View bootcamp</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
