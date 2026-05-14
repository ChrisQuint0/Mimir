"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Sparkles, Zap, Rocket } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { DEMO_BOOTCAMP, DEMO_SYLLABUS } from "@/lib/demo-data";

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
  const [demoMode, setDemoMode] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);

  const titleCharsLeft = 60 - title.length;
  const goalCharsLeft = 200 - goal.length;

  // Keyboard shortcut: Ctrl+Shift+Q then E to autofill demo data
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect Ctrl+Shift+Q
      if (e.ctrlKey && e.shiftKey && e.key === "Q") {
        e.preventDefault();
        setKeySequence(["Q"]);
        toast.info("Press E to autofill demo data", { duration: 2000 });
        return;
      }

      // Detect E after Q
      if (keySequence.length === 1 && keySequence[0] === "Q" && e.key === "e") {
        e.preventDefault();
        // Autofill with demo data
        setTitle(DEMO_BOOTCAMP.title);
        setGoal(DEMO_BOOTCAMP.goal);
        setDuration([DEMO_BOOTCAMP.duration_days]);
        setDemoMode(true);
        setKeySequence([]);
        toast.success("Demo data loaded!", {
          description: "Ready to generate a demo bootcamp",
          icon: <Sparkles className="w-5 h-5 text-amber-400" />,
        });
        return;
      }

      // Reset sequence on any other key
      if (keySequence.length > 0) {
        setKeySequence([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, keySequence]);

  // Reset demo mode when dialog closes
  useEffect(() => {
    if (!open) {
      setDemoMode(false);
      setKeySequence([]);
    }
  }, [open]);

  // Clear demo localStorage when creating new demo
  const clearDemoData = () => {
    localStorage.removeItem("demo-current-day");
    localStorage.removeItem("demo-existing-lessons");
    localStorage.removeItem("demo-bootcamp-active");

    // Clear all activity data (30 days)
    for (let i = 1; i <= 30; i++) {
      localStorage.removeItem(`demo-activities-day-${i}`);
    }
  };

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
      // DEMO MODE: Skip API calls, use static data
      if (demoMode) {
        console.log("Demo mode: Generating fake syllabus...");

        // Clear any existing demo data first
        clearDemoData();

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Demo mode: Syllabus generated");

        // Show success message
        toast.success("Bootcamp Created!", {
          description: `Your ${duration[0]}-day learning journey has begun! (Demo Mode)`,
          icon: <Rocket className="w-5 h-5 text-blue-400" />,
        });

        // Close dialog and redirect to demo bootcamp
        onOpenChange(false);
        setTitle("");
        setGoal("");
        setDuration([14]);
        setDemoMode(false);

        // Store demo mode in localStorage
        localStorage.setItem("demo-bootcamp-active", "true");

        router.push(`/bootcamp/${DEMO_BOOTCAMP.id}`);
        router.refresh();
        return;
      }

      // NORMAL MODE: Real API calls
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
      toast.success("Bootcamp Created!", {
        description: `Your ${duration[0]}-day learning journey has begun!`,
        icon: <Rocket className="w-5 h-5 text-blue-400" />,
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
          <DialogTitle className="text-2xl font-bold text-[#57a1ff]">
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
            className="w-full py-3 px-4 bg-[#6749fb] hover:bg-[#6749fb]/90 disabled:bg-slate-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-[#6749fb]/25 disabled:shadow-none flex items-center justify-center gap-2 group"
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
