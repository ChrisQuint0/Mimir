"use client";

import Link from "next/link";
import { ChevronRight, BookOpen, Clock, ArrowRight, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/tokyo-night-dark.css";
import type { ComponentPropsWithoutRef } from "react";
import { getDemoLesson, DEMO_BOOTCAMP, DEMO_SYLLABUS } from "@/lib/demo-data";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LearningMaterialsDialog } from "@/components/bootcamp/LearningMaterialsDialog";

type MarkdownCodeProps = ComponentPropsWithoutRef<"code"> & {
  node?: unknown;
};

interface DemoLessonPageProps {
  bootcampId: string;
  dayNumber: number;
}

export function DemoLessonPage({ bootcampId, dayNumber }: DemoLessonPageProps) {
  const router = useRouter();
  const [hasActivities, setHasActivities] = useState(false);

  useEffect(() => {
    // Check if activities exist for this lesson
    const savedActivities = localStorage.getItem(`demo-activities-day-${dayNumber}`);
    setHasActivities(!!savedActivities);
  }, [dayNumber]);

  const lesson = getDemoLesson(dayNumber);
  const syllabusDay = DEMO_SYLLABUS.days.find((d) => d.day === dayNumber);

  // Estimate reading time
  const wordCount = lesson.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              Feed
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/bootcamp/${bootcampId}`}
              className="hover:text-slate-300 transition-colors"
            >
              {DEMO_BOOTCAMP.title}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-400">Day {dayNumber} (Demo)</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>
                  Day {dayNumber} of {DEMO_BOOTCAMP.duration_days}
                </span>
              </div>
              <div>•</div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min read</span>
              </div>
              <div>•</div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-300 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Demo Mode
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              {syllabusDay?.title || lesson.title}
            </h1>
          </div>

          <LearningMaterialsDialog
            lessonId={lesson.id}
            lessonTitle={syllabusDay?.title || lesson.title}
          />

          {/* Lesson Content */}
          <article className="prose prose-invert prose-lg max-w-none mb-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
                h1: ({ children }) => (
                  <h1
                    className="text-3xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-3"
                    style={{ fontFamily: "var(--font-lora)" }}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2
                    className="text-2xl font-bold text-white mt-8 mb-4"
                    style={{ fontFamily: "var(--font-lora)" }}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    className="text-xl font-semibold text-slate-200 mt-6 mb-3"
                    style={{ fontFamily: "var(--font-lora)" }}
                  >
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-slate-300 space-y-2 mb-4 ml-4">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-slate-300 space-y-2 mb-4 ml-4">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-slate-300">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-500/5 italic text-slate-400">
                    {children}
                  </blockquote>
                ),
                code: ({
                  className,
                  children,
                  ...props
                }: MarkdownCodeProps) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match;

                  if (isInline) {
                    return (
                      <code className="px-1.5 py-0.5 bg-slate-800 text-blue-300 rounded text-sm font-mono">
                        {children}
                      </code>
                    );
                  }

                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-slate-900 border border-slate-800 rounded-lg p-4 overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-white">
                    {children}
                  </strong>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border border-slate-800">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-slate-800 bg-slate-900 px-4 py-2 text-left text-white font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-slate-800 px-4 py-2 text-slate-300">
                    {children}
                  </td>
                ),
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </article>

          {/* Navigation footer */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex items-center justify-between">
              <Link
                href={`/bootcamp/${bootcampId}`}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Back to Syllabus</span>
              </Link>

              {hasActivities ? (
                <Link
                  href={`/bootcamp/${bootcampId}/lesson/${dayNumber}/activities`}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-[#6749fb] hover:bg-[#6749fb]/90 text-white font-medium rounded-lg transition-all shadow-lg shadow-[#6749fb]/25"
                >
                  <span>View Activities</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link
                  href={`/bootcamp/${bootcampId}/lesson/${dayNumber}/activities`}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-[#f44c00] hover:bg-[#e64600] text-white font-medium rounded-lg transition-all shadow-lg shadow-[#f44c00]/25 hover:shadow-[#f44c00]/40"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Activities</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
