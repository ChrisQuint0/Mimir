"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { BookOpen, Sparkles, Zap, Brain, Rocket, ChartLine, Target } from "lucide-react";

interface LandingPageProps {
    user: User | null;
}

export function LandingPage({ user }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col selection:bg-blue-500/30 selection:text-white">
            {/* Animated background orbs (from login page) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
            </div>

            {/* Floating particles (from login page) */}
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-400/30 rounded-full pointer-events-none"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${15 + Math.random() * 10}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                />
            ))}

            {/* Navbar */}
            <header className="fixed top-0 w-full z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
                <div className="container flex h-16 items-center justify-between px-6 mx-auto max-w-7xl">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg shadow-blue-500/20">
                            <BookOpen className="size-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Mimir</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        {/* Features link removed */}
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Button asChild variant="default" size="sm" className="rounded-xl px-6 font-semibold bg-[#6749fb] hover:bg-[#5a3ee0] text-white border-none">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors px-4">
                                    Log in
                                </Link>
                                <Button asChild size="sm" className="rounded-xl px-6 font-semibold bg-[#6749fb] hover:bg-[#5a3ee0] text-white border-none shadow-lg shadow-[#6749fb]/20">
                                    <Link href="/login">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 pt-8 relative z-10">
                {/* Hero Section */}
                <section className="relative py-16 md:py-24 lg:py-32 flex flex-col items-center min-h-[80vh] justify-center">
                    <div className="container px-6 mx-auto max-w-7xl relative">
                        <div className="flex flex-col items-center text-center space-y-10">
                            <h1 className="text-6xl md:text-8xl font-black tracking-tight max-w-5xl balance leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both text-white">
                                Master any skill with{" "}
                                <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                                    Wisdom
                                </span>
                            </h1>

                            <p className="max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-both delay-100">
                                Mimir is your personalized learning sanctuary. Build structured, AI-powered paths to mastery and unlock your full potential with adaptive education.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both delay-200">
                                <button
                                    className="group relative inline-flex items-center gap-3 px-10 py-4 bg-[#6749fb] hover:bg-[#5a3ee0] text-white font-bold rounded-xl transition-all transform hover:scale-[1.05] active:scale-[0.98] shadow-2xl shadow-[#6749fb]/40"
                                >
                                    <Link href={user ? "/dashboard" : "/login"} className="flex items-center gap-2">
                                        <span>{user ? "Go to Dashboard" : "Start Learning Free"}</span>
                                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    </Link>
                                </button>
                            </div>

                            {/* Tagline */}
                            <p className="text-slate-500 italic text-sm pt-12 animate-in fade-in duration-1000 delay-500">
                                "Wisdom is not a product of schooling but of the lifelong attempt to acquire it"
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 border-t border-slate-800/50 bg-slate-900/20">
                    <div className="container px-6 mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pathways to Mastery</h2>
                            <p className="text-slate-400">Everything you need to master your chosen craft.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Brain className="size-6 text-blue-400" />}
                                title="AI-Powered Curriculums"
                                description="Generate comprehensive, structured learning paths for any topic you want to master in seconds."
                            />
                            <FeatureCard
                                icon={<Zap className="size-6 text-purple-400" />}
                                title="Sequential Learning"
                                description="Experience a structured journey where content unlocks day-by-day, building your knowledge progressively."
                            />
                            <FeatureCard
                                icon={<Rocket className="size-6 text-amber-400" />}
                                title="Tailored Lessons"
                                description="Receive AI-generated lessons specifically designed to guide you through each topic in your syllabus."
                            />
                            <FeatureCard
                                icon={<Target className="size-6 text-blue-400" />}
                                title="Practice Activities"
                                description="Reinforce your learning with AI-generated exercises and activities tailored to the day's lesson."
                            />
                            <FeatureCard
                                icon={<ChartLine className="size-6 text-purple-400" />}
                                title="Progress Tracking"
                                description="Visualize your journey as you complete days and unlock new sections of your personal bootcamp."
                            />
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800/50 py-12 bg-slate-950/50 relative z-10">
                <div className="container px-6 mx-auto max-w-7xl text-center">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Mimir AI. All rights reserved.
                    </p>
                </div>
            </footer>

            <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          50% {
            transform: translateY(-100px) translateX(50px);
          }
        }
      `}</style>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex flex-col gap-4 p-8 rounded-2xl border border-slate-800/50 bg-slate-900/30 hover:bg-slate-900/50 transition-all hover:border-slate-700/50 group">
            <div className="size-12 rounded-xl bg-slate-800/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
                {description}
            </p>
        </div>
    );
}
