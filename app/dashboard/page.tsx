"use client";

import { useState, useEffect } from "react";
import { BookOpen, Sparkles, Plus, Zap, Star } from "lucide-react";
import { CreateBootcampDialog } from "@/components/bootcamp/CreateBootcampDialog";
import { BootcampCard } from "@/components/bootcamp/BootcampCard";
import { DeleteBootcampDialog } from "@/components/bootcamp/DeleteBootcampDialog";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Bootcamp } from "@/lib/types/bootcamp";

export default function DashboardPage() {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bootcampToDelete, setBootcampToDelete] = useState<Bootcamp | null>(
    null,
  );

  const supabase = createClient();

  // Fetch bootcamps on mount
  useEffect(() => {
    fetchBootcamps();
  }, []);

  async function fetchBootcamps() {
    try {
      const { data, error } = await supabase
        .from("bootcamps")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBootcamps(data || []);
    } catch (error) {
      console.error("Failed to fetch bootcamps:", error);
      toast.error("Failed to load bootcamps");
    } finally {
      setLoading(false);
    }
  }

  // Delete handler
  async function handleDelete(id: string) {
    try {
      const { error } = await supabase.from("bootcamps").delete().eq("id", id);

      if (error) throw error;

      // Remove from local state
      setBootcamps((prev) => prev.filter((b) => b.id !== id));
      setDeleteOpen(false);
      setBootcampToDelete(null);

      toast.success("Bootcamp deleted successfully");
    } catch (error) {
      console.error("Failed to delete bootcamp:", error);
      toast.error("Failed to delete bootcamp");
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-40 bg-slate-800 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-slate-800 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-4 w-1/3 bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-4 w-1/4 bg-slate-800 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (bootcamps.length === 0) {
    return (
      <>
        <div className="container mx-auto px-4 py-12">
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
                <div className="absolute inset-0 -z-10 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
              </div>

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
                onClick={() => setCreateOpen(true)}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 overflow-hidden"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Bootcamp</span>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
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

              <p className="mt-8 text-slate-600 italic text-sm">
                "Wisdom is not a product of schooling but of the lifelong
                attempt to acquire it."
                <span className="text-slate-500"> — Albert Einstein</span>
              </p>
            </div>
          </div>

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

        <CreateBootcampDialog open={createOpen} onOpenChange={setCreateOpen} />
      </>
    );
  }

  // Bootcamp grid (has bootcamps)
  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">My Bootcamps</h1>
              <p className="text-slate-400 text-sm mt-1">
                {bootcamps.length} active{" "}
                {bootcamps.length === 1 ? "journey" : "journeys"}
              </p>
            </div>
            <button
              onClick={() => setCreateOpen(true)}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25 overflow-hidden"
            >
              <Plus className="w-4 h-4" />
              <span>New Bootcamp</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            </button>
          </div>

          {/* Bootcamp grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bootcamps.map((bootcamp) => (
              <BootcampCard
                key={bootcamp.id}
                bootcamp={bootcamp}
                onDelete={(id) => {
                  setBootcampToDelete(
                    bootcamps.find((b) => b.id === id) || null,
                  );
                  setDeleteOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreateBootcampDialog open={createOpen} onOpenChange={setCreateOpen} />
      <DeleteBootcampDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        bootcampTitle={bootcampToDelete?.title || ""}
        onConfirm={() => bootcampToDelete && handleDelete(bootcampToDelete.id)}
      />
    </>
  );
}
