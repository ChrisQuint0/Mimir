import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, BookOpen, Calendar, Target } from "lucide-react";
import { SyllabusView } from "@/components/bootcamp/SyllabusView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BootcampDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch bootcamp
  const { data: bootcamp, error } = await supabase
    .from("bootcamps")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !bootcamp) {
    notFound();
  }

  // Fetch existing lessons for this bootcamp
  const { data: lessons } = await supabase
    .from("lessons")
    .select("day_number")
    .eq("bootcamp_id", id);

  const existingLessons = lessons?.map((l) => l.day_number) || [];

  const completedDays = bootcamp.current_day - 1;
  const totalDays = bootcamp.duration_days;
  const progressPercentage = Math.round((completedDays / totalDays) * 100);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link
              href="/dashboard"
              className="hover:text-slate-300 transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-400">Bootcamp</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-3">
                  {bootcamp.title}
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {bootcamp.goal}
                </p>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Progress card */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Target className="w-4 h-4" />
                  <span>Progress</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {progressPercentage}%
                  </span>
                  <span className="text-sm text-slate-500">complete</span>
                </div>
                <div className="mt-3 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Current day card */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Current Day</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {bootcamp.current_day}
                  </span>
                  <span className="text-sm text-slate-500">
                    of {bootcamp.duration_days}
                  </span>
                </div>
              </div>

              {/* Days remaining card */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Days Remaining</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {Math.max(0, totalDays - completedDays)}
                  </span>
                  <span className="text-sm text-slate-500">days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Syllabus section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Learning Path</h2>
              <p className="text-sm text-slate-500">
                {bootcamp.syllabus_json.days.length} days total
              </p>
            </div>

            <SyllabusView
              days={bootcamp.syllabus_json.days}
              currentDay={bootcamp.current_day}
              bootcampId={bootcamp.id}
              bootcampGoal={bootcamp.goal}
              existingLessons={existingLessons}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
