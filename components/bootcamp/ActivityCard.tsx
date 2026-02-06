"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Activity {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  revealed: boolean;
}

interface ActivityCardProps {
  activity: Activity;
  number: number;
  total: number;
  forceReveal?: boolean;
}

export function ActivityCard({ activity, number, total, forceReveal = false }: ActivityCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Sync with forceReveal prop
  const shouldReveal = forceReveal || isRevealed;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
      {/* Question Section */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Number badge */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <span className="text-blue-400 font-semibold text-sm">
              {number}
            </span>
          </div>

          {/* Question content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500">
                Question {number} of {total}
              </span>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  p: ({ children }) => (
                    <p className="text-slate-200 leading-relaxed mb-0">
                      {children}
                    </p>
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
                    <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 overflow-x-auto mt-2">
                      {children}
                    </pre>
                  ),
                }}
              >
                {activity.question}
              </ReactMarkdown>
            </div>

            {/* Reveal button */}
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${shouldReveal
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                : "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
                }`}
            >
              {shouldReveal ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hide Answer</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Reveal Answer</span>
                </>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${shouldReveal ? "rotate-180" : ""
                  }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Answer Section (collapsible) */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${shouldReveal ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
      >
        <div className="overflow-hidden">
          <div
            className={`border-t border-slate-800 bg-gradient-to-br from-slate-950/80 to-slate-900/50 p-6 transition-all duration-500 ${shouldReveal
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4"
              }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-400 text-sm font-semibold">A</span>
              </div>
              <h4 className="text-amber-400 font-semibold">Answer</h4>
            </div>

            <div className="pl-11">
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold text-white mt-4 mb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-bold text-white mt-3 mb-2">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold text-slate-200 mt-2 mb-1">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-slate-300 leading-relaxed mb-3">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-slate-300 space-y-1 mb-3 ml-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-slate-300 space-y-1 mb-3 ml-2">
                        {children}
                      </ol>
                    ),
                    code: ({ className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline = !match;

                      if (isInline) {
                        return (
                          <code className="px-1.5 py-0.5 bg-slate-800 text-amber-300 rounded text-sm font-mono">
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
                      <pre className="bg-slate-900 border border-slate-800 rounded-lg p-4 overflow-x-auto mb-3">
                        {children}
                      </pre>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-white">
                        {children}
                      </strong>
                    ),
                  }}
                >
                  {activity.answer}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
