"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  Castle,
  Crown,
  Flame,
  Footprints,
  Hammer,
  Library,
  Loader2,
  Lock,
  PencilLine,
  Radio,
  Rocket,
  Save,
  Sparkles,
  Trophy,
  User,
  Waves,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { AchievementStatus } from "@/lib/achievements";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProfilePageClientProps {
  userId: string;
  email: string;
  displayName: string;
  memberSince: string;
  initialAvatarPath: string | null;
  initialAvatarSrc: string | null;
  publishedCount: number;
  completedCount: number;
  activeCount: number;
  achievementStatuses: AchievementStatus[];
}

const iconMap = {
  Sparkles,
  Radio,
  Hammer,
  Castle,
  Library,
  Footprints,
  Flame,
  Waves,
  Rocket,
  Crown,
} as const;

function AchievementCard({
  achievement,
  compact = false,
}: {
  achievement: AchievementStatus;
  compact?: boolean;
}) {
  const Icon = iconMap[achievement.icon as keyof typeof iconMap] ?? Trophy;
  const progressPercent =
    achievement.threshold > 0
      ? (achievement.progress / achievement.threshold) * 100
      : 0;

  return (
    <div
      className={cn(
        "rounded-3xl border p-4 transition-colors",
        compact ? "min-h-0" : "min-h-40",
        achievement.unlocked
          ? cn("bg-linear-to-br", achievement.accentClass)
          : "border-slate-800 bg-slate-900/40 text-slate-500",
      )}
    >
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-2xl border",
              achievement.unlocked
                ? "border-white/15 bg-white/10"
                : "border-slate-800 bg-slate-900",
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          {achievement.unlocked ? (
            <BadgeCheck className="h-5 w-5 text-white/80" />
          ) : (
            <Lock className="h-5 w-5 text-slate-600" />
          )}
        </div>

        <div className={cn("space-y-2", compact ? "mt-3" : "mt-4")}>
          <p
            className={cn(
              "font-semibold",
              compact ? "text-sm" : "text-base",
              achievement.unlocked ? "text-white" : "text-slate-300",
            )}
          >
            {achievement.title}
          </p>
          {!compact && (
            <p className="text-sm leading-6 text-inherit/80">
              {achievement.description}
            </p>
          )}
        </div>

        <div className={cn(compact ? "mt-3" : "mt-4")}>
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em]">
            <span>
              {compact ? achievement.threshold : achievement.category}
            </span>
            <span>
              {achievement.progress}/{achievement.threshold}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/20">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                achievement.unlocked ? "bg-white/85" : "bg-slate-600",
              )}
              style={{
                width: `${Math.max(0, Math.min(100, progressPercent))}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <p className={cn("mt-3 text-3xl font-semibold", accent)}>{value}</p>
    </div>
  );
}

function getLegendTitle(unlockedCount: number) {
  if (unlockedCount >= 10) return "Mythic Builder";
  if (unlockedCount >= 8) return "Legendary Guide";
  if (unlockedCount >= 5) return "Rising Mentor";
  if (unlockedCount >= 2) return "Momentum Seeker";
  return "Fresh Explorer";
}

export function ProfilePageClient({
  userId,
  email,
  displayName,
  memberSince,
  initialAvatarPath,
  initialAvatarSrc,
  publishedCount,
  completedCount,
  activeCount,
  achievementStatuses,
}: ProfilePageClientProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPath, setAvatarPath] = useState(initialAvatarPath);
  const [avatarSrc, setAvatarSrc] = useState(initialAvatarSrc);
  const [currentDisplayName, setCurrentDisplayName] = useState(displayName);
  const [draftDisplayName, setDraftDisplayName] = useState(displayName);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  const unlockedAchievements = achievementStatuses.filter(
    (achievement) => achievement.unlocked,
  );
  const nextAchievement = achievementStatuses.find(
    (achievement) => !achievement.unlocked,
  );
  const unlockedCount = unlockedAchievements.length;
  const legendTitle = getLegendTitle(unlockedCount);
  const joinDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(memberSince));

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const currentInitials = currentDisplayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleDisplayNameSave = async () => {
    const trimmedName = draftDisplayName.trim();

    if (trimmedName.length < 2) {
      toast.error("Display name must be at least 2 characters.");
      return;
    }

    setIsSavingName(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName: trimmedName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update display name");
      }

      setCurrentDisplayName(trimmedName);
      setDraftDisplayName(trimmedName);
      setIsEditingName(false);
      toast.success("Display name updated.");
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update display name.",
      );
    } finally {
      setIsSavingName(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
    const supabase = createClient();

    setIsUploading(true);

    try {
      const { error: uploadError } = await supabase.storage
        .from("profile_pictures")
        .upload(filePath, file, {
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatarPath: filePath }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save profile picture");
      }

      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("profile_pictures")
          .createSignedUrl(filePath, 60 * 60 * 24 * 7);

      if (signedUrlError) {
        throw signedUrlError;
      }

      if (
        avatarPath &&
        avatarPath !== filePath &&
        !avatarPath.startsWith("http")
      ) {
        await supabase.storage.from("profile_pictures").remove([avatarPath]);
      }

      setAvatarPath(filePath);
      setAvatarSrc(signedUrlData.signedUrl);
      toast.success("Profile picture updated.");
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update profile picture.",
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>

          <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.1),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.92))] p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-200">
                    {legendTitle}
                  </span>
                  <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1">
                    Member since {joinDate}
                  </span>
                  <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-amber-200">
                    {unlockedCount}/10 badges unlocked
                  </span>
                </div>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-800 shadow-xl shadow-slate-950/30">
                    {avatarSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarSrc}
                        alt={currentDisplayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-800 to-slate-700 text-4xl font-semibold text-slate-200">
                        {currentInitials || initials || (
                          <User className="h-10 w-10" />
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute inset-x-3 bottom-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950/90 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Camera className="h-3.5 w-3.5" />
                      )}
                      {isUploading ? "Uploading" : "Change photo"}
                    </button>
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="space-y-3">
                      {isEditingName ? (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <input
                            value={draftDisplayName}
                            onChange={(event) =>
                              setDraftDisplayName(event.target.value)
                            }
                            maxLength={50}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-2xl font-semibold text-white outline-none ring-0 transition-colors focus:border-cyan-400 sm:text-3xl"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleDisplayNameSave}
                              disabled={isSavingName}
                              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950 transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isSavingName ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDraftDisplayName(currentDisplayName);
                                setIsEditingName(false);
                              }}
                              className="rounded-2xl border border-slate-700 px-4 py-3 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-3">
                          <h1
                            className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
                            style={{ fontFamily: "var(--font-lora)" }}
                          >
                            {currentDisplayName}
                          </h1>
                          <button
                            type="button"
                            onClick={() => setIsEditingName(true)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
                          >
                            <PencilLine className="h-4 w-4" />
                            Edit name
                          </button>
                        </div>
                      )}

                      <p className="text-slate-400">{email}</p>
                    </div>

                    <p className="max-w-3xl text-lg leading-8 text-slate-300">
                      A clean snapshot of your work in Mimir: what you have
                      built, what you have finished, and which milestones you
                      are closing in on next.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    label="Published Bootcamps"
                    value={publishedCount}
                    accent="text-cyan-300"
                  />
                  <StatCard
                    label="Completed Bootcamps"
                    value={completedCount}
                    accent="text-emerald-300"
                  />
                  <StatCard
                    label="Active Runs"
                    value={activeCount}
                    accent="text-amber-300"
                  />
                  <StatCard
                    label="Badge Score"
                    value={`${unlockedCount * 10}%`}
                    accent="text-fuchsia-300"
                  />
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/55 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Next target
                </p>
                {nextAchievement ? (
                  <>
                    <h2 className="mt-3 text-3xl font-semibold text-white">
                      {nextAchievement.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {nextAchievement.description}
                    </p>
                    <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                      <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
                        <span>Progress</span>
                        <span>
                          {nextAchievement.progress}/{nextAchievement.threshold}
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-cyan-400 via-sky-300 to-amber-300"
                          style={{
                            width: `${(nextAchievement.progress / nextAchievement.threshold) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mt-3 text-3xl font-semibold text-white">
                      Cabinet complete
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      You have unlocked every current badge. The wall is fully
                      lit.
                    </p>
                  </>
                )}

                <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <div className="flex items-center gap-3 text-emerald-200">
                    <Trophy className="h-5 w-5" />
                    <p className="font-medium">Legend status: {legendTitle}</p>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-emerald-100/75">
                    Keep publishing bootcamps and finishing your own learning
                    paths to brighten more of your cabinet.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="group h-auto rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 text-left align-top transition-colors hover:border-slate-700 hover:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Achievement Cabinet
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold text-white">
                        Your badge wall
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
                        Click to open every achievement, including the locked
                        ones you are still chasing.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-right text-amber-200">
                      <p className="text-xs uppercase tracking-[0.18em] text-amber-200/70">
                        Unlocked
                      </p>
                      <p className="text-2xl font-semibold">{unlockedCount}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {(unlockedAchievements.length > 0
                      ? unlockedAchievements.slice(0, 4)
                      : achievementStatuses.slice(0, 4)
                    ).map((achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        compact
                      />
                    ))}
                  </div>
                </button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl border-slate-800 bg-slate-950 text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Achievement Cabinet
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Unlocked badges shine. Locked ones stay dim until your next
                    milestone.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid auto-rows-max max-h-[70vh] items-start gap-4 overflow-y-auto pr-1 md:grid-cols-2">
                  {achievementStatuses.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Snapshot
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
                  <p className="text-sm text-slate-400">Legend status</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {legendTitle}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
                  <p className="text-sm text-slate-400">Cabinet completion</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {unlockedCount}/10 badges
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    Unlock more by publishing more bootcamps and completing more
                    learning runs.
                  </p>
                </div>
                {nextAchievement && (
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
                    <p className="text-sm text-slate-400">Closest badge</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {nextAchievement.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-400">
                      {nextAchievement.progress}/{nextAchievement.threshold}{" "}
                      complete
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
