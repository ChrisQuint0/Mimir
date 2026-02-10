import { NextResponse } from "next/server";
import { z } from "zod";
import { generateContent } from "@/lib/gemini/client";
import { generateLessonPrompt } from "@/lib/gemini/prompts";
import { createClient } from "@/lib/supabase/server";

const RequestSchema = z.object({
  bootcampId: z.string().uuid(),
  dayNumber: z.number().int().min(1),
  dayTitle: z.string().min(1),
  topics: z.array(z.string()).min(1),
  goal: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { bootcampId, dayNumber, dayTitle, topics, goal } =
      RequestSchema.parse(body);

    console.log(
      `Generating lesson for bootcamp ${bootcampId}, Day ${dayNumber}: ${dayTitle}`,
    );

    const supabase = await createClient();

    // Verify user owns this bootcamp
    const { data: bootcamp, error: bootcampError } = await supabase
      .from("bootcamps")
      .select("id, user_id")
      .eq("id", bootcampId)
      .single();

    if (bootcampError || !bootcamp) {
      return NextResponse.json(
        { error: "Bootcamp not found" },
        { status: 404 },
      );
    }

    // Enforce sequential unlocking
    // Users can regenerate past lessons (if needed) or generate the current day
    // But cannot generate future days
    if (dayNumber > bootcamp.current_day) {
      return NextResponse.json(
        { error: `You must complete Day ${bootcamp.current_day} first` },
        { status: 403 },
      );
    }

    // Check if lesson already exists
    const { data: existingLesson } = await supabase
      .from("lessons")
      .select("id")
      .eq("bootcamp_id", bootcampId)
      .eq("day_number", dayNumber)
      .single();

    if (existingLesson) {
      return NextResponse.json(
        { error: "Lesson already exists for this day" },
        { status: 409 },
      );
    }

    // Generate the lesson content
    const prompt = generateLessonPrompt(goal, dayNumber, dayTitle, topics);

    console.log("Calling Gemini API...");
    const lessonContent = await generateContent(prompt);
    console.log(`Lesson generated, length: ${lessonContent.length} characters`);

    // Validate we got content
    if (!lessonContent || lessonContent.trim().length < 100) {
      throw new Error("Generated lesson content is too short");
    }

    // Save lesson to database
    const { data: lesson, error: saveError } = await supabase
      .from("lessons")
      .insert({
        bootcamp_id: bootcampId,
        day_number: dayNumber,
        title: dayTitle,
        content: lessonContent.trim(),
      })
      .select()
      .single();

    if (saveError) {
      console.error("Database error:", saveError);
      throw new Error("Failed to save lesson to database");
    }

    console.log("✓ Lesson saved successfully");

    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        dayNumber: lesson.day_number,
        title: lesson.title,
        contentLength: lesson.content.length,
      },
    });
  } catch (error: any) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    console.error("Lesson generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate lesson",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// Optional: GET endpoint to fetch a lesson
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bootcampId = searchParams.get("bootcampId");
    const dayNumber = searchParams.get("dayNumber");

    if (!bootcampId || !dayNumber) {
      return NextResponse.json(
        { error: "Missing bootcampId or dayNumber" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("bootcamp_id", bootcampId)
      .eq("day_number", parseInt(dayNumber))
      .single();

    if (error || !lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      lesson,
    });
  } catch (error: any) {
    console.error("Fetch lesson error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 },
    );
  }
}
