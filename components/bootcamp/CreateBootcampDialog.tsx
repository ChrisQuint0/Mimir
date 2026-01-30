"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Loader2, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface CreateBootcampDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBootcampDialog({
  open,
  onOpenChange,
}: CreateBootcampDialogProps) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState([14]); // Default 14 days
  const [loading, setLoading] = useState(false);

  const titleCharsLeft = 60 - title.length;
  const goalCharsLeft = 200 - goal.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !goal.trim()) {
      toast.error("Missing information", {
        description: "Please fill in both title and goal.",
      });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Generate syllabus from AI
      console.log("Generating syllabus...");
      const syllabusResponse = await fetch("/api/generate-syllabus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: goal.trim(),
          duration: duration[0],
        }),
      });

      if (!syllabusResponse.ok) {
        throw new Error("Failed to generate syllabus");
      }

      const syllabusData = await syllabusResponse.json();
      console.log("Syllabus generated successfully");

      // Step 2: Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to create a bootcamp");
      }

      // Step 3: Save bootcamp to database
      console.log("Saving bootcamp to database...");
      const { data: bootcamp, error } = await supabase
        .from("bootcamps")
        .insert({
          user_id: user.id,
          title: title.trim(),
          goal: goal.trim(),
          duration_days: duration[0],
          syllabus_json: syllabusData.syllabus,
          current_day: 1,
        })
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw new Error("Failed to save bootcamp");
      }

      console.log("Bootcamp created:", bootcamp);

      // Step 4: Show success message
      toast.success("Bootcamp Created! 🎉", {
        description: `Your ${duration[0]}-day learning journey has begun!`,
      });

      // Step 5: Close dialog and redirect
      onOpenChange(false);

      // Reset form
      setTitle("");
      setGoal("");
      setDuration([14]);

      // Redirect to bootcamp detail page
      router.push(`/bootcamp/${bootcamp.id}`);
      router.refresh();
    } catch (error: any) {
      console.error("Error creating bootcamp:", error);
      toast.error("Creation Failed", {
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Create Your Bootcamp
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Define your learning goal and let Mimir craft a personalized
            curriculum just for you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">
              Bootcamp Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 60))}
              placeholder="e.g., Master React Hooks"
              disabled={loading}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            <p
              className={`text-xs text-right ${titleCharsLeft < 10 ? "text-amber-400" : "text-slate-500"}`}
            >
              {titleCharsLeft} characters left
            </p>
          </div>

          {/* Goal Textarea */}
          <div className="space-y-2">
            <Label htmlFor="goal" className="text-slate-300">
              Learning Goal
            </Label>
            <Textarea
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value.slice(0, 200))}
              placeholder="Describe what you want to learn... Be specific!"
              disabled={loading}
              rows={4}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none"
            />
            <p
              className={`text-xs text-right ${goalCharsLeft < 20 ? "text-amber-400" : "text-slate-500"}`}
            >
              {goalCharsLeft} characters left
            </p>
          </div>

          {/* Duration Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Duration</Label>
              <span className="text-sm font-semibold text-blue-400">
                {duration[0]} days
              </span>
            </div>
            <Slider
              value={duration}
              onValueChange={setDuration}
              min={7}
              max={90}
              step={1}
              disabled={loading}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>7 days</span>
              <span>90 days</span>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              This will create a{" "}
              <span className="text-blue-400 font-semibold">
                {duration[0]}-day
              </span>{" "}
              learning journey
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !title.trim() || !goal.trim()}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating your bootcamp...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Generate My Bootcamp</span>
              </>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
