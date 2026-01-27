import { BookOpen, Sparkles, Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Empty State */}
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="relative mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 relative">
              <BookOpen className="w-12 h-12 text-blue-400" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 bg-blue-500/20 blur-3xl rounded-full"></div>
          </div>

          {/* Text */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Journey Begins Here
          </h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Welcome to Mimir, your personalized learning sanctuary. Create your
            first bootcamp and embark on a structured path to mastery.
          </p>

          {/* CTA Button */}
          <button className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25">
            <Plus className="w-5 h-5" />
            <span>Create Your First Bootcamp</span>
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>

          {/* Subtle hint */}
          <p className="text-xs text-slate-500 mt-6 italic">
            AI-powered curriculum · Sequential learning · Track your progress
          </p>
        </div>
      </div>
    </div>
  );
}
