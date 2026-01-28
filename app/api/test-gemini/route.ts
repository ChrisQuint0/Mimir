import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini/client";
import { generateSyllabusPrompt } from "@/lib/gemini/prompts";

export async function GET() {
  try {
    // Test with a simple goal
    const testGoal = "Master React Hooks";
    const testDuration = 7;

    console.log("Testing Gemini API...");

    // Generate the prompt
    const prompt = generateSyllabusPrompt(testGoal, testDuration);

    // Call Gemini
    const rawResponse = await generateContent(prompt);

    console.log("Raw Gemini response:", rawResponse);

    // Try to parse as JSON
    let syllabusData;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = rawResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      syllabusData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse JSON response",
          rawResponse: rawResponse,
        },
        { status: 500 },
      );
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: "Gemini API is working!",
      testGoal,
      testDuration,
      syllabus: syllabusData,
    });
  } catch (error: any) {
    console.error("Gemini API test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { goal, duration } = await req.json();

    if (!goal || !duration) {
      return NextResponse.json(
        {
          error: "Missing goal or duration",
        },
        { status: 400 },
      );
    }

    const prompt = generateSyllabusPrompt(goal, duration);
    const rawResponse = await generateContent(prompt);

    // Clean and parse JSON
    const cleanedResponse = rawResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const syllabusData = JSON.parse(cleanedResponse);

    return NextResponse.json({
      success: true,
      syllabus: syllabusData,
    });
  } catch (error: any) {
    console.error("Gemini generation error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate syllabus",
      },
      { status: 500 },
    );
  }
}
