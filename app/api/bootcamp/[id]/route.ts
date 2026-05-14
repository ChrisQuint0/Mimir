import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const SyllabusDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(400),
  topics: z.array(z.string().trim().min(1).max(80)).min(1).max(12),
});

const UpdateBootcampSchema = z.object({
  title: z.string().trim().min(1).max(60),
  goal: z.string().trim().min(1).max(200),
  caption: z.string().trim().max(280).nullable().optional(),
  syllabus: z.object({
    days: z.array(SyllabusDaySchema).min(1).max(90),
  }),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, goal, caption, syllabus } = UpdateBootcampSchema.parse(body);
    const normalizedCaption = caption?.trim() ? caption.trim() : null;
    const durationDays = syllabus.days.length;

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: bootcamp, error: bootcampError } = await supabase
      .from("bootcamps")
      .select("id, user_id, current_day, published_at")
      .eq("id", id)
      .single();

    if (bootcampError || !bootcamp) {
      return NextResponse.json(
        { error: "Bootcamp not found" },
        { status: 404 },
      );
    }

    if (bootcamp.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prevent editing published bootcamps
    if (bootcamp.published_at) {
      return NextResponse.json(
        { error: "Cannot edit published bootcamp" },
        { status: 403 },
      );
    }

    const clampedCurrentDay = Math.min(
      Math.max(bootcamp.current_day ?? 1, 1),
      durationDays,
    );

    const { data: updatedBootcamp, error: updateError } = await supabase
      .from("bootcamps")
      .update({
        title,
        goal,
        caption: normalizedCaption,
        current_day: clampedCurrentDay,
        duration_days: durationDays,
        syllabus_json: syllabus,
      })
      .eq("id", id)
      .select(
        "id, title, goal, caption, published_at, duration_days, syllabus_json",
      )
      .single();

    if (updateError || !updatedBootcamp) {
      console.error("Update bootcamp error:", updateError);
      return NextResponse.json(
        { error: "Failed to update bootcamp" },
        { status: 500 },
      );
    }

    const { error: enrollmentClampError } = await supabase
      .from("bootcamp_enrollments")
      .update({ current_day: durationDays })
      .eq("bootcamp_id", id)
      .gt("current_day", durationDays);

    if (enrollmentClampError) {
      console.error("Clamp enrollment progress error:", enrollmentClampError);
      return NextResponse.json(
        { error: "Failed to update bootcamp progress" },
        { status: 500 },
      );
    }

    const { data: staleLessons, error: staleLessonsError } = await supabase
      .from("lessons")
      .select("id")
      .eq("bootcamp_id", id)
      .gt("day_number", durationDays);

    if (staleLessonsError) {
      console.error("Load stale lessons error:", staleLessonsError);
      return NextResponse.json(
        { error: "Failed to clean up bootcamp lessons" },
        { status: 500 },
      );
    }

    const staleLessonIds = (staleLessons ?? []).map((lesson) => lesson.id);

    if (staleLessonIds.length > 0) {
      const { error: deleteActivitiesError } = await supabase
        .from("activities")
        .delete()
        .in("lesson_id", staleLessonIds);

      if (deleteActivitiesError) {
        console.error("Delete stale activities error:", deleteActivitiesError);
        return NextResponse.json(
          { error: "Failed to clean up bootcamp activities" },
          { status: 500 },
        );
      }

      const { error: deleteLessonsError } = await supabase
        .from("lessons")
        .delete()
        .in("id", staleLessonIds);

      if (deleteLessonsError) {
        console.error("Delete stale lessons error:", deleteLessonsError);
        return NextResponse.json(
          { error: "Failed to clean up bootcamp lessons" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      bootcamp: updatedBootcamp,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Update bootcamp route error:", error);
    return NextResponse.json(
      { error: "Failed to update bootcamp" },
      { status: 500 },
    );
  }
}
