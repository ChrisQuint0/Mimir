import { NextResponse } from "next/server";
import { z } from "zod";
import { generateContent } from "@/lib/gemini/client";
import { generateActivitiesPrompt } from "@/lib/gemini/prompts";
import { createClient } from "@/lib/supabase/server";

const RequestSchema = z.object({
  lessonId: z.string().uuid(),
});

const ActivitySchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const ActivitiesArraySchema = z.array(ActivitySchema).length(4);

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { lessonId } = RequestSchema.parse(body);

    console.log(`Generating activities for lesson ${lessonId}`);

    const supabase = await createClient();

    // Fetch the lesson content
    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .select("*, bootcamps!inner(user_id)")
      .eq("id", lessonId)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if activities already exist for this lesson
    const { data: existingActivities } = await supabase
      .from("activities")
      .select("id")
      .eq("lesson_id", lessonId)
      .limit(1);

    if (existingActivities && existingActivities.length > 0) {
      return NextResponse.json(
        { error: "Activities already exist for this lesson" },
        { status: 409 },
      );
    }

    // Generate activities with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    let activitiesData = null;

    while (attempts < maxAttempts && !activitiesData) {
      attempts++;
      console.log(`Attempt ${attempts}/${maxAttempts}...`);

      try {
        // Generate the prompt
        const prompt = generateActivitiesPrompt(lesson.content);

        // Call Gemini
        const rawResponse = await generateContent(prompt);
        console.log("Raw response received, length:", rawResponse.length);

        // Clean up the response (remove markdown code blocks if present)
        const cleanedResponse = rawResponse
          .replace(/^```json\s*/, "")
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "")
          .trim();

        // Parse and validate JSON
        const parsed = JSON.parse(cleanedResponse);
        activitiesData = ActivitiesArraySchema.parse(parsed);

        console.log("✓ Successfully generated and validated 4 activities");
      } catch (parseError: any) {
        console.error(`Attempt ${attempts} failed:`, parseError.message);

        if (attempts === maxAttempts) {
          return NextResponse.json(
            {
              error:
                "Failed to generate valid activities after multiple attempts",
              details: parseError.message,
            },
            { status: 500 },
          );
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!activitiesData) {
      return NextResponse.json(
        { error: "Failed to generate activities" },
        { status: 500 },
      );
    }

    // Save activities to database
    console.log("Saving activities to database...");
    const activitiesToInsert = activitiesData.map((activity, index) => ({
      lesson_id: lessonId,
      question: activity.question,
      answer: activity.answer,
      order_index: index,
      revealed: false,
    }));

    const { data: savedActivities, error: saveError } = await supabase
      .from("activities")
      .insert(activitiesToInsert)
      .select();

    if (saveError) {
      console.error("Database error:", saveError);
      throw new Error("Failed to save activities to database");
    }

    console.log("✓ Activities saved successfully");

    return NextResponse.json({
      success: true,
      activities: savedActivities,
      count: savedActivities.length,
    });
  } catch (error: any) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("Activity generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate activities",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// Optional: GET endpoint to fetch activities
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json(
        { error: "Missing lessonId parameter" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data: activities, error } = await supabase
      .from("activities")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("order_index", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      activities: activities || [],
      count: activities?.length || 0,
    });
  } catch (error: any) {
    console.error("Fetch activities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 },
    );
  }
}
