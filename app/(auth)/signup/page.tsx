"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/supabase/auth";
import { Eye, EyeOff, Zap } from "lucide-react";
import mimirLogo from "@/app/assets/mimir_logo_white.png";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess("");

    try {
      await signUp(email, password);
      setSuccess("Check your email to confirm your account!");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Static background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <img src={mimirLogo.src} alt="Mimir Logo" className="w-16 h-auto mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2 font-lora">
            Mimir
          </h1>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Create Your Account
            </h2>
            <p className="text-slate-400 text-sm">
              Join the sanctuary of lifelong learners
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-300 block"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading || !!success}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all disabled:opacity-50 [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s,color_9999s_ease-in-out_0s]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-300 block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  disabled={loading || !!success}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all pr-12 disabled:opacity-50 [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s,color_9999s_ease-in-out_0s]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || !!success}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                <p className="font-medium mb-1">Welcome, seeker!</p>
                <p className="text-emerald-400/80">{success}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !!success}
              className="w-full py-3 px-4 bg-[#6749fb] hover:bg-[#5b3ce4] text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#6749fb]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing up...</span>
                </>
              ) : success ? (
                <>
                  <span>Account Created!</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              {"Have an account? "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
