"use client";

import { useState } from "react";
import { BookOpen, Sparkles, Plus, Zap, Star } from "lucide-react";
import { CreateBootcampDialog } from "@/components/bootcamp/CreateBootcampDialog";

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  // TODO: Later we'll fetch bootcamps here and show them if they exist
  const bootcamps = []; // Empty for now

  if (bootcamps.length === 0) {
    return (
      <>
        <div className="container mx-auto px-4 py-12">
          {/* Empty State */}
          <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center relative">
            {/* Background glow effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
              <div
                className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute pointer-events-none"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                <Star className="w-2 h-2 text-amber-400/30 fill-amber-400/10" />
              </div>
            ))}

            {/* Main content */}
            <div className="text-center max-w-2xl relative z-10">
              {/* Icon with glow */}
              <div className="relative mb-8 inline-block">
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center backdrop-blur-sm">
                    <BookOpen className="w-16 h-16 text-blue-400" />
                  </div>
                  {/* Sparkle decorations */}
                  <div
                    className="absolute -top-3 -right-3 animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <Sparkles className="w-8 h-8 text-amber-400" />
                  </div>
                  <div
                    className="absolute -bottom-2 -left-2 animate-bounce"
                    style={{ animationDelay: "1s" }}
                  >
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                {/* Glow effect behind icon */}
                <div className="absolute inset-0 -z-10 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
              </div>

              {/* Text content */}
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                Your Journey Begins Here
              </h1>

              <p className="text-slate-400 text-lg mb-3 leading-relaxed max-w-xl mx-auto">
                Welcome to{" "}
                <span className="text-blue-400 font-semibold">Mimir</span>, your
                personalized learning sanctuary.
              </p>

              <p className="text-slate-500 text-sm mb-10 max-w-md mx-auto">
                Create your first bootcamp and embark on a structured,
                AI-powered path to mastery. Each day unlocks new knowledge,
                building progressively toward your goals.
              </p>

              {/* CTA Button */}
              <button
                onClick={() => setDialogOpen(true)}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 overflow-hidden"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Bootcamp</span>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-xl"></div>
              </button>

              {/* Feature hints */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <span>AI-Powered Curriculum</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                  <span>Sequential Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span>Track Your Progress</span>
                </div>
              </div>

              {/* Inspirational quote */}
              <p className="mt-8 text-slate-600 italic text-sm">
                "Wisdom is not a product of schooling but of the lifelong
                attempt to acquire it."
                <span className="text-slate-500"> — Albert Einstein</span>
              </p>
            </div>
          </div>

          {/* CSS for twinkle animation */}
          <style jsx>{`
            @keyframes twinkle {
              0%,
              100% {
                opacity: 0.2;
                transform: scale(1);
              }
              50% {
                opacity: 1;
                transform: scale(1.3);
              }
            }
          `}</style>
        </div>

        {/* Create Bootcamp Dialog */}
        <CreateBootcampDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </>
    );
  }

  // TODO: Show bootcamp cards when user has bootcamps
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">My Bootcamps</h2>
      {/* Bootcamp cards will go here */}
    </div>
  );
}
