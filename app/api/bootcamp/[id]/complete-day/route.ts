import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const RequestSchema = z.object({
  dayNumber: z.number().int().min(1),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Parse and validate request body
    const body = await req.json();
    const { dayNumber } = RequestSchema.parse(body);

    console.log(`Completing Day ${dayNumber} for bootcamp ${id}`);

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch bootcamp and viewer progress
    const { data: bootcamp, error: bootcampError } = await supabase
      .from("bootcamps")
      .select("id, user_id, current_day, duration_days")
      .eq("id", id)
      .single();

    if (bootcampError || !bootcamp) {
      return NextResponse.json(
        { error: "Bootcamp not found" },
        { status: 404 },
      );
    }

    const isOwner = bootcamp.user_id === user.id;

    const { data: enrollment, error: enrollmentError } = await supabase
      .from("bootcamp_enrollments")
      .select("id, current_day")
      .eq("bootcamp_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (enrollmentError) {
      console.error("Enrollment lookup error:", enrollmentError);
      return NextResponse.json(
        { error: "Failed to load progress" },
        { status: 500 },
      );
    }

    const currentDay =
      enrollment?.current_day ?? (isOwner ? bootcamp.current_day : null);

    if (!currentDay) {
      return NextResponse.json(
        { error: "You are not enrolled in this bootcamp" },
        { status: 403 },
      );
    }

    // Validate the day number
    if (dayNumber > bootcamp.duration_days) {
      return NextResponse.json(
        { error: "Invalid day number" },
        { status: 400 },
      );
    }

    // Ensure user is completing the current day (not skipping ahead)
    if (dayNumber !== currentDay) {
      return NextResponse.json(
        { error: `You must complete Day ${currentDay} first` },
        { status: 400 },
      );
    }

    // Increment current_day
    const newCurrentDay = currentDay + 1;

    const progressMutation = enrollment
      ? supabase
          .from("bootcamp_enrollments")
          .update({ current_day: newCurrentDay })
          .eq("id", enrollment.id)
          .select("bootcamp_id, current_day")
          .single()
      : supabase
          .from("bootcamp_enrollments")
          .insert({
            bootcamp_id: id,
            user_id: user.id,
            current_day: newCurrentDay,
          })
          .select("bootcamp_id, current_day")
          .single();

    const { data: updatedEnrollment, error: updateError } =
      await progressMutation;

    if (updateError || !updatedEnrollment) {
      console.error("Database error:", updateError);
      throw new Error("Failed to update enrollment progress");
    }

    console.log(`✓ Day ${dayNumber} completed, now on Day ${newCurrentDay}`);

    return NextResponse.json({
      success: true,
      enrollment: {
        bootcampId: updatedEnrollment.bootcamp_id,
        currentDay: updatedEnrollment.current_day,
        completedDay: dayNumber,
      },
    });
  } catch (error: unknown) {
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

    console.error("Complete day error:", error);
    return NextResponse.json(
      {
        error: "Failed to complete day",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
