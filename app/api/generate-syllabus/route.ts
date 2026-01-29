import { NextResponse } from "next/server";
import { z } from "zod";
import { generateContent } from "@/lib/gemini/client";
import { generateSyllabusPrompt } from "@/lib/gemini/prompts";

// Zod schemas for validation
const SyllabusDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1),
  topics: z.array(z.string()).min(1),
  description: z.string().min(1),
});

const SyllabusSchema = z.object({
  days: z.array(SyllabusDaySchema),
});

const RequestSchema = z.object({
  goal: z.string().min(1).max(200),
  duration: z.number().int().min(7).max(90),
});

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { goal, duration } = RequestSchema.parse(body);

    console.log(`Generating syllabus for: "${goal}" (${duration} days)`);

    // Generate the prompt
    const prompt = generateSyllabusPrompt(goal, duration);

    // Try up to 3 times to get valid JSON
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Attempt ${attempts}/${maxAttempts}...`);

      try {
        // Call Gemini
        const rawResponse = await generateContent(prompt);
        console.log("Raw response received, length:", rawResponse.length);

        // Clean up the response (remove markdown code blocks if present)
        const cleanedResponse = rawResponse
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        // Parse and validate JSON with Zod
        const parsed = JSON.parse(cleanedResponse);
        const syllabusData = SyllabusSchema.parse(parsed);

        // Verify we have the correct number of days
        if (syllabusData.days.length !== duration) {
          console.warn(
            `Warning: Expected ${duration} days but got ${syllabusData.days.length}`,
          );
        }

        console.log("✓ Successfully generated and validated syllabus");

        // Return success
        return NextResponse.json({
          success: true,
          syllabus: syllabusData,
          goal,
          duration,
        });
      } catch (parseError: any) {
        console.error(`Attempt ${attempts} failed:`, parseError.message);

        if (attempts === maxAttempts) {
          return NextResponse.json(
            {
              error:
                "Failed to generate valid syllabus after multiple attempts",
              details: parseError.message,
            },
            { status: 500 },
          );
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // This shouldn't be reached, but just in case
    return NextResponse.json(
      { error: "Failed to generate syllabus" },
      { status: 500 },
    );
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

    console.error("Syllabus generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate syllabus",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
