import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BookOpen, Calendar } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Bootcamp</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {bootcamp.title}
            </h1>
            <p className="text-slate-400 text-lg mb-4">{bootcamp.goal}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{bootcamp.duration_days} days</span>
              </div>
              <div>•</div>
              <div>
                Day {bootcamp.current_day} of {bootcamp.duration_days}
              </div>
            </div>
          </div>

          {/* Syllabus Preview */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Curriculum Overview
            </h2>
            <div className="space-y-3">
              {bootcamp.syllabus_json.days.map((day: any) => (
                <div
                  key={day.day}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-sm font-semibold">
                      {day.day}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">
                        {day.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-2">
                        {day.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {day.topics.map((topic: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-amber-400 text-sm text-center">
              🚧 Full syllabus view and lesson generation coming in Day 11-13!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
