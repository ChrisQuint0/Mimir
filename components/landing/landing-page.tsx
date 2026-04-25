"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { User } from "@supabase/supabase-js";
import {
  Sparkles,
  Zap,
  Brain,
  Rocket,
  ChartLine,
  Target,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import logo from "@/public/mimir_logo_white.png";

interface LandingPageProps {
  user: User | null;
}

export function LandingPage({ user }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col selection:bg-blue-500/30 selection:text-white">
      {/* Animated background orbs (from login page) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-6 mx-auto max-w-7xl">
          <div className="flex items-center gap-3 group cursor-pointer">
            <Image
              src={logo}
              alt="Mimir Logo"
              width={40}
              height={40}
              className="transition-transform group-hover:scale-105"
            />
            <span className="text-2xl font-bold tracking-tight text-white font-lora">
              Mimir
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            {/* Features link removed */}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Button
                asChild
                variant="default"
                size="sm"
                className="rounded-xl px-6 font-semibold bg-[#6749fb] hover:bg-[#5a3ee0] text-white border-none"
              >
                <Link href="/dashboard">My Bootcamps</Link>
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors px-4"
                >
                  Log in
                </Link>
                <Button
                  asChild
                  size="sm"
                  className="rounded-xl px-6 font-semibold bg-[#6749fb] hover:bg-[#5a3ee0] text-white border-none shadow-lg shadow-[#6749fb]/20"
                >
                  <Link href="/login">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-8 relative z-10">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 lg:py-32 flex flex-col items-center min-h-screen justify-center">
          <div className="container px-6 mx-auto max-w-7xl relative">
            <div className="flex flex-col items-center text-center space-y-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl balance leading-[1.15] animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both text-white font-lora">
                The Structure of a Bootcamp.
                <br />
                <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                  The Freedom of Self-Paced Learning.
                </span>
              </h1>

              <p className="max-w-3xl text-lg md:text-xl text-slate-400 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-both delay-100 font-sans">
                Tell Mimir what you want to learn and when. Our AI instantly
                generates a personalized, day-by-day curriculum with adaptive
                lessons and assessments designed specifically for your goals.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both delay-200">
                <Link
                  href={user ? "/" : "/login"}
                  className="group relative inline-flex items-center gap-3 px-10 py-4 bg-[#6749fb] hover:bg-[#5a3ee0] text-white font-bold rounded-xl transition-all transform hover:scale-[1.05] active:scale-[0.98] shadow-2xl shadow-[#6749fb]/40"
                >
                  <span>{user ? "Open the Feed" : "Start Learning Free"}</span>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Concept Demo */}
        <SyllabusDemo user={user} />

        {/* Features Section */}
        <section
          id="features"
          className="py-24 border-t border-slate-800/50 bg-slate-900/20"
        >
          <div className="container px-6 mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-lora">
                Pathways to Mastery
              </h2>
              <p className="text-slate-400">
                Everything you need to master your chosen craft.
              </p>
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
              <FeatureCard
                icon={<Lightbulb className="size-6 text-amber-400" />}
                title="Detailed Solutions"
                description="Verify your knowledge with comprehensive, step-by-step answers and clear reasoning for every practice exercise."
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
    </div>
  );
}

function SyllabusDemo({ user }: { user: User | null }) {
  const [duration, setDuration] = useState([14]);
  const [step, setStep] = useState<"input" | "generating" | "result">("input");
  const [typedText, setTypedText] = useState("");
  const [activeLesson, setActiveLesson] = useState<{
    day: number;
    title: string;
    desc: string;
  } | null>(null);
  const fullText = "Master React Hooks";
  const sectionRef = useRef<HTMLElement>(null);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedTyping) {
          setHasStartedTyping(true);
        }
      },
      { threshold: 0.5 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasStartedTyping]);

  useEffect(() => {
    if (!hasStartedTyping || step !== "input") return;

    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [typedText, hasStartedTyping, step]);

  const handleGenerate = () => {
    setStep("generating");
    setTimeout(() => setStep("result"), 2000);
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden flex flex-col items-center border-t border-slate-800/50"
    >
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-6 mx-auto max-w-4xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-lora">
            What do you want to master?
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl font-sans">
            Tell Mimir your goal. We'll instantly generate a complete,
            day-by-day curriculum specialized just for you.
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-2xl shadow-blue-900/20 max-w-3xl mx-auto min-h-[400px]">
          {step === "input" && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              {/* Goal Input */}
              <div className="space-y-3 text-left">
                <label className="text-sm font-semibold text-slate-300 ml-1">
                  Your Learning Goal
                </label>
                <div className="h-14 bg-slate-950 border border-slate-700 text-white text-lg rounded-xl flex items-center px-4 w-full cursor-text relative overflow-hidden">
                  {typedText.length === 0 && !hasStartedTyping && (
                    <span className="text-slate-500 absolute left-4 pointer-events-none">
                      e.g., Master React Hooks, Learn Spanish...
                    </span>
                  )}
                  <span className="z-10">{typedText}</span>
                  <span
                    className={`w-0.5 h-6 bg-blue-500 ml-[2px] ${hasStartedTyping ? "animate-pulse" : "hidden"}`}
                  ></span>
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-5 text-left pt-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-semibold text-slate-300">
                    How much time do you have?
                  </label>
                  <span className="text-sm font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                    {duration[0]} days
                  </span>
                </div>
                <Slider
                  value={duration}
                  onValueChange={setDuration}
                  min={7}
                  max={90}
                  step={1}
                  className="cursor-pointer py-4"
                />
                <div className="flex justify-between text-xs text-slate-500 font-medium px-1">
                  <span>7 days</span>
                  <span>90 days</span>
                </div>
              </div>

              {/* Submit Actions */}
              <div className="pt-6 relative">
                <button
                  onClick={handleGenerate}
                  className="w-full py-4 px-6 bg-[#6749fb] hover:bg-[#5a3ee0] text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#6749fb]/40 flex items-center justify-center gap-3 group text-lg relative overflow-hidden"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Generate My {duration[0]}-Day Syllabus</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out"></div>
                </button>
                <p className="text-center text-sm text-slate-500 mt-4 font-medium flex items-center justify-center gap-2">
                  Interactive demo. See what Mimir builds for you.
                </p>
              </div>
            </div>
          )}

          {step === "generating" && (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
              <div className="size-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Brain className="size-10 text-white animate-pulse" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-2xl font-bold text-white font-lora">
                  Mimir is thinking...
                </h3>
                <p className="text-slate-400">
                  Crafting your personalized {duration[0]}-day journey
                </p>
              </div>
            </div>
          )}

          {step === "result" && !activeLesson && (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Master React Hooks
                  </h3>
                  <p className="text-blue-400 font-medium text-sm mt-1">
                    {duration[0]}-Day Curriculum
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStep("input");
                    setTypedText("");
                    setHasStartedTyping(false);
                  }}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 group bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
                >
                  <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />{" "}
                  Back
                </button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar text-left">
                {[
                  {
                    day: 1,
                    title: "Understanding State & Effect",
                    desc: "Deep dive into useState and useEffect core mechanics.",
                  },
                  {
                    day: 2,
                    title: "Context API & Reducers",
                    desc: "Managing complex state using useContext and useReducer.",
                  },
                  {
                    day: 3,
                    title: "Custom Hooks & Optimization",
                    desc: "Extracting logic and optimizing with useMemo/useCallback.",
                  },
                  {
                    day: 4,
                    title: "Advanced Patterns & Refs",
                    desc: "Exploring useRef for DOM manipulation and keeping mutable state.",
                  },
                ].map((lesson) => (
                  <div
                    key={lesson.day}
                    onClick={() => setActiveLesson(lesson)}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                        {lesson.day}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {lesson.title}
                        </h4>
                        <p className="text-sm text-slate-400 mt-1 line-clamp-1">
                          {lesson.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex w-full">
                <Link
                  href={
                    user
                      ? `/dashboard?goal=Master React Hooks&duration=${duration[0]}`
                      : `/login?goal=Master React Hooks&duration=${duration[0]}`
                  }
                  className="w-full"
                >
                  <button className="w-full py-4 px-6 bg-[#6749fb] hover:bg-[#5a3ee0] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group">
                    Start Learning For Real{" "}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          )}

          {step === "result" && activeLesson && (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500 text-left">
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Day {activeLesson.day}: {activeLesson.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveLesson(null)}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 group bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
                >
                  <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />{" "}
                  Back
                </button>
              </div>

              <div className="max-h-[300px] overflow-y-auto pr-4 custom-scrollbar text-slate-300 space-y-4 text-sm leading-relaxed">
                {activeLesson.day === 1 && (
                  <>
                    <h4 className="text-white font-bold text-lg">
                      Introduction
                    </h4>
                    <p>
                      React components need to remember things.{" "}
                      <code>useState</code> is the hook that lets you add React
                      state to functional components.
                    </p>
                    <h4 className="text-white font-bold text-lg mt-6">
                      Core Mechanics
                    </h4>
                    <p>
                      When state changes, the component re-renders.{" "}
                      <code>useEffect</code> is used to synchronize your
                      component with an external system or perform side effects.
                    </p>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-blue-300 my-4 overflow-x-auto custom-scrollbar">
                      <pre>
                        <code>{`import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`}</code>
                      </pre>
                    </div>
                  </>
                )}
                {activeLesson.day === 2 && (
                  <>
                    <h4 className="text-white font-bold text-lg">
                      Introduction
                    </h4>
                    <p>
                      As applications grow, passing props down multiple levels
                      becomes tedious. The Context API allows you to share data
                      globally, and <code>useReducer</code> lets you manage
                      complex updates predictable.
                    </p>
                    <h4 className="text-white font-bold text-lg mt-6">
                      Core Mechanics
                    </h4>
                    <p>
                      A reducer function takes the current state and an action,
                      returning the new state. This provides a clear,
                      maintainable state architecture.
                    </p>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-blue-300 my-4 overflow-x-auto custom-scrollbar">
                      <pre>
                        <code>{`function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    default: throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return <button onClick={() => dispatch({ type: 'increment' })}>{state.count}</button>;
}`}</code>
                      </pre>
                    </div>
                  </>
                )}
                {activeLesson.day === 3 && (
                  <>
                    <h4 className="text-white font-bold text-lg">
                      Introduction
                    </h4>
                    <p>
                      When you have logic that needs to be shared across
                      multiple components, you can extract it into a Custom
                      Hook—a normal JavaScript function whose name starts with
                      "use".
                    </p>
                    <h4 className="text-white font-bold text-lg mt-6">
                      Core Mechanics
                    </h4>
                    <p>
                      Additionally, React provides <code>useMemo</code> to cache
                      expensive calculations, and <code>useCallback</code> to
                      keep function references stable and prevent unnecessary
                      child re-renders.
                    </p>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-blue-300 my-4 overflow-x-auto custom-scrollbar">
                      <pre>
                        <code>{`function useFetch(url) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData);
  }, [url]);

  return data;
}

// In component: const posts = useFetch('/api/posts');`}</code>
                      </pre>
                    </div>
                  </>
                )}
                {activeLesson.day === 4 && (
                  <>
                    <h4 className="text-white font-bold text-lg">
                      Introduction
                    </h4>
                    <p>
                      Sometimes you need to store information without triggering
                      a re-render, or you need direct access to a DOM node. This
                      is where <code>useRef</code> shines.
                    </p>
                    <h4 className="text-white font-bold text-lg mt-6">
                      Core Mechanics
                    </h4>
                    <p>
                      Unlike state, mutating the <code>.current</code> property
                      of a ref doesn't re-render the component. It's an escape
                      hatch that perfectly complements your React toolkit.
                    </p>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-blue-300 my-4 overflow-x-auto custom-scrollbar">
                      <pre>
                        <code>{`function TextInputWithFocus() {
  const inputEl = useRef(null);
  const onBtnClick = () => inputEl.current.focus();

  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onBtnClick}>Focus the input</button>
    </>
  );
}`}</code>
                      </pre>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2 flex w-full">
                <Link
                  href={
                    user
                      ? `/dashboard?goal=Master React Hooks&duration=${duration[0]}`
                      : `/login?goal=Master React Hooks&duration=${duration[0]}`
                  }
                  className="w-full"
                >
                  <button className="w-full py-4 px-6 bg-[#6749fb] hover:bg-[#5a3ee0] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group">
                    Start Learning For Real{" "}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 p-8 rounded-2xl border border-slate-800/50 bg-slate-900/30 hover:bg-slate-900/50 transition-all hover:border-slate-700/50 group">
      <div className="size-12 rounded-xl bg-slate-800/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
