"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Flame,
  Handshake,
  Lightbulb,
  Medal,
  MessageSquare,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type StudentPraiseId =
  | "great_question"
  | "helpful_peer"
  | "deep_thinker"
  | "consistent_builder"
  | "fast_learner"
  | "insight_drop"
  | "momentum_engine"
  | "team_lifter";

interface StudentPraiseOption {
  id: StudentPraiseId;
  label: string;
  charisma: number;
  icon: LucideIcon;
  chipClass: string;
}

interface ThreadReply {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  isAuthor?: boolean;
}

interface ThreadComment {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  replies: ThreadReply[];
  studentPraise?: StudentPraiseId | null;
}

interface LessonDiscussionThreadProps {
  lessonId: string;
  lessonTitle: string;
}

const STUDENT_PRAISE_OPTIONS: StudentPraiseOption[] = [
  {
    id: "great_question",
    label: "Great Question",
    charisma: 4,
    icon: Lightbulb,
    chipClass: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
  },
  {
    id: "helpful_peer",
    label: "Helpful Peer",
    charisma: 6,
    icon: Handshake,
    chipClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  },
  {
    id: "deep_thinker",
    label: "Deep Thinker",
    charisma: 7,
    icon: Brain,
    chipClass: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  },
  {
    id: "consistent_builder",
    label: "Consistent Builder",
    charisma: 5,
    icon: Medal,
    chipClass: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  },
  {
    id: "fast_learner",
    label: "Fast Learner",
    charisma: 5,
    icon: Rocket,
    chipClass: "border-orange-500/30 bg-orange-500/10 text-orange-200",
  },
  {
    id: "insight_drop",
    label: "Insight Drop",
    charisma: 8,
    icon: Sparkles,
    chipClass: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200",
  },
  {
    id: "momentum_engine",
    label: "Momentum Engine",
    charisma: 6,
    icon: Flame,
    chipClass: "border-rose-500/30 bg-rose-500/10 text-rose-200",
  },
  {
    id: "team_lifter",
    label: "Team Lifter",
    charisma: 7,
    icon: Star,
    chipClass: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  },
];

function createSeedComments(lessonTitle: string): ThreadComment[] {
  return [
    {
      id: "seed-1",
      authorName: "Kian",
      body: `The walkthrough for \"${lessonTitle}\" made the concept way less intimidating. Especially the part where ideas were broken into small steps.`,
      createdAt: "2h ago",
      replies: [
        {
          id: "seed-1-r1",
          authorName: "Author",
          body: "Love this feedback. I can add a short recap checklist at the end of the next lesson too.",
          createdAt: "1h ago",
          isAuthor: true,
        },
      ],
      studentPraise: "great_question",
    },
    {
      id: "seed-2",
      authorName: "Mara",
      body: "Question: should we practice this with small exercises first, or jump straight to a mini project?",
      createdAt: "54m ago",
      replies: [
        {
          id: "seed-2-r1",
          authorName: "Author",
          body: "Start with two tiny exercises, then do the mini project. That sequence helps most learners retain the pattern.",
          createdAt: "41m ago",
          isAuthor: true,
        },
      ],
    },
    {
      id: "seed-3",
      authorName: "Jules",
      body: "I tested the same flow in my side project and it worked. Posting this in case others need confidence to try it in real code.",
      createdAt: "26m ago",
      replies: [],
      studentPraise: "helpful_peer",
    },
  ];
}

export function LessonDiscussionThread({
  lessonId,
  lessonTitle,
}: LessonDiscussionThreadProps) {
  const storageKey = useMemo(() => `lesson-thread:${lessonId}`, [lessonId]);
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [praiseTargetCommentId, setPraiseTargetCommentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    setHydrated(true);

    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { comments?: ThreadComment[] };
        if (parsed.comments && parsed.comments.length > 0) {
          setComments(parsed.comments);
          return;
        }
      } catch {
        // Ignore malformed storage and use seed comments.
      }
    }

    setComments(createSeedComments(lessonTitle));
  }, [lessonTitle, storageKey]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify({ comments }));
  }, [comments, hydrated, storageKey]);

  const handleAddComment = () => {
    const body = newComment.trim();
    if (!body) {
      toast.error("Write a comment first.");
      return;
    }

    const comment: ThreadComment = {
      id: `comment-${Date.now()}`,
      authorName: "You",
      body,
      createdAt: "Just now",
      replies: [],
      studentPraise: null,
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment("");
    toast.success("Comment posted");
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    toast.success("Comment deleted");
  };

  const handleSetStudentPraise = (
    commentId: string,
    praiseId: StudentPraiseId | null,
  ) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              studentPraise: praiseId,
            }
          : comment,
      ),
    );

    if (praiseId) {
      const praise = STUDENT_PRAISE_OPTIONS.find(
        (option) => option.id === praiseId,
      );
      toast.success(`Assigned: ${praise?.label ?? "Badge"}`, {
        description: `+${praise?.charisma ?? 0} charisma for this student.`,
      });
      return;
    }

    toast.success("Student badge removed");
  };

  const praiseTargetComment = praiseTargetCommentId
    ? (comments.find((comment) => comment.id === praiseTargetCommentId) ?? null)
    : null;

  return (
    <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-400">
            <MessageSquare className="h-3.5 w-3.5" />
            Lesson Thread
          </div>
          <h3 className="mt-3 text-lg font-semibold text-white">Discussion</h3>
          <p className="mt-1 text-sm text-slate-400">
            Share insights and questions about this lesson.
          </p>
        </div>
        <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-xs text-slate-400">
          {comments.length} comments
        </span>
      </div>

      <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Add a comment
        </label>
        <textarea
          value={newComment}
          onChange={(event) => setNewComment(event.target.value.slice(0, 500))}
          rows={4}
          placeholder="Drop your takeaway, question, or tip..."
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {500 - newComment.length} characters left
          </p>
          <button
            onClick={handleAddComment}
            className="inline-flex items-center gap-2 rounded-lg bg-[#6749fb] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5a3ee0]"
          >
            <Send className="h-4 w-4" />
            Post Comment
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => {
          const selectedPraise = comment.studentPraise
            ? STUDENT_PRAISE_OPTIONS.find(
                (option) => option.id === comment.studentPraise,
              )
            : null;
          const isStudentComment = comment.authorName !== "Author";

          return (
            <article
              key={comment.id}
              className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-200">
                    {comment.authorName.charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-white">
                    {comment.authorName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {comment.createdAt}
                  </span>
                  {comment.authorName === "You" && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[11px] text-rose-200 transition-colors hover:bg-rose-500/20"
                      aria-label="Delete your comment"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-300">{comment.body}</p>

              {isStudentComment && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setPraiseTargetCommentId(comment.id)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 transition-colors hover:border-blue-500/40 hover:bg-slate-800"
                  >
                    {selectedPraise ? "Change Praise" : "Give Praise"}
                  </button>

                  {selectedPraise && (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${selectedPraise.chipClass}`}
                    >
                      <selectedPraise.icon className="h-3.5 w-3.5" />
                      {selectedPraise.label}
                      <span className="text-slate-100/90">
                        +{selectedPraise.charisma}
                      </span>
                    </span>
                  )}

                  {selectedPraise && (
                    <button
                      onClick={() => handleSetStudentPraise(comment.id, null)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200"
                    >
                      Clear badge
                    </button>
                  )}
                </div>
              )}

              {comment.replies.length > 0 && (
                <div className="mt-4 space-y-3 border-l border-slate-700 pl-4">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="rounded-lg border border-slate-800 bg-slate-900/70 p-3"
                    >
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">
                            {reply.authorName}
                          </p>
                          {reply.isAuthor && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-300">
                              <ShieldCheck className="h-3 w-3" />
                              Author
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">
                          {reply.createdAt}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-slate-300">
                        {reply.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <Dialog
        open={praiseTargetCommentId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPraiseTargetCommentId(null);
          }
        }}
      >
        <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a student praise badge</DialogTitle>
            <DialogDescription className="text-slate-400">
              {praiseTargetComment
                ? `Assign a badge to ${praiseTargetComment.authorName}.`
                : "Assign a badge to this student."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {STUDENT_PRAISE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected =
                praiseTargetComment?.studentPraise === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => {
                    if (!praiseTargetCommentId) {
                      return;
                    }
                    handleSetStudentPraise(praiseTargetCommentId, option.id);
                    setPraiseTargetCommentId(null);
                  }}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                    isSelected
                      ? `${option.chipClass} ring-1 ring-white/35`
                      : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                    <Icon className="h-3.5 w-3.5" />
                    {option.label}
                  </span>
                  <p className="mt-1 text-[11px] text-slate-400">
                    +{option.charisma} charisma
                  </p>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
