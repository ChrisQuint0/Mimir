import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, BookOpen, Clock, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/tokyo-night-dark.css";

interface PageProps {
  params: Promise<{ id: string; day: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { id, day } = await params;
  const dayNumber = parseInt(day);
  const supabase = await createClient();

  // Fetch bootcamp info
  const { data: bootcamp } = await supabase
    .from("bootcamps")
    .select("title, goal, duration_days, current_day")
    .eq("id", id)
    .single();

  if (!bootcamp) {
    notFound();
  }

  // Fetch lesson
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("bootcamp_id", id)
    .eq("day_number", dayNumber)
    .single();

  if (error || !lesson) {
    notFound();
  }

  // Estimate reading time (assuming 200 words per minute)
  const wordCount = lesson.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link
              href="/dashboard"
              className="hover:text-slate-300 transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/bootcamp/${id}`}
              className="hover:text-slate-300 transition-colors"
            >
              {bootcamp.title}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-400">Day {dayNumber}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>
                  Day {dayNumber} of {bootcamp.duration_days}
                </span>
              </div>
              <div>•</div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {lesson.title}
            </h1>
          </div>

          {/* Lesson Content */}
          <article className="prose prose-invert prose-lg max-w-none mb-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-3">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-slate-200 mt-6 mb-3">
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
                code: ({ className, children, ...props }: any) => {
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
                href={`/bootcamp/${id}`}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Back to Syllabus</span>
              </Link>

              <Link
                href={`/bootcamp/${id}/lesson/${dayNumber}/activities`}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <span>Proceed to Activities</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
