import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const LessonUpdateSchema = z.object({
  dayNumber: z.number().int().min(1),
  title: z.string().trim().min(1).max(180),
  content: z.string().trim().min(1),
});

const UpdateLessonsSchema = z.object({
  lessons: z.array(LessonUpdateSchema).min(1),
});

async function assertOwner(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bootcampId: string,
  userId: string,
) {
  const { data: bootcamp, error: bootcampError } = await supabase
    .from("bootcamps")
    .select("id, user_id, published_at")
    .eq("id", bootcampId)
    .single();

  if (bootcampError || !bootcamp) {
    return {
      error: NextResponse.json(
        { error: "Bootcamp not found" },
        { status: 404 },
      ),
      bootcamp: null,
    };
  }

  if (bootcamp.user_id !== userId) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      bootcamp: null,
    };
  }

  return { error: null, bootcamp };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error: ownerError, bootcamp } = await assertOwner(
      supabase,
      id,
      user.id,
    );
    if (ownerError) {
      return ownerError;
    }

    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("id, day_number, title, content")
      .eq("bootcamp_id", id)
      .order("day_number", { ascending: true });

    if (lessonsError) {
      console.error("Load lessons error:", lessonsError);
      return NextResponse.json(
        { error: "Failed to load lessons" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      lessons: (lessons ?? []).map((lesson) => ({
        id: lesson.id,
        dayNumber: lesson.day_number,
        title: lesson.title,
        content: lesson.content,
      })),
    });
  } catch (error) {
    console.error("Get lessons route error:", error);
    return NextResponse.json(
      { error: "Failed to load lessons" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { lessons } = UpdateLessonsSchema.parse(body);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error: ownerError, bootcamp } = await assertOwner(
      supabase,
      id,
      user.id,
    );
    if (ownerError) {
      return ownerError;
    }

    // Prevent editing lessons for published bootcamps
    if (bootcamp?.published_at) {
      return NextResponse.json(
        { error: "Cannot edit lessons for published bootcamp" },
        { status: 403 },
      );
    }

    const { data: existingLessons, error: existingLessonsError } =
      await supabase
        .from("lessons")
        .select("id, day_number")
        .eq("bootcamp_id", id);

    if (existingLessonsError) {
      console.error("Lookup lessons error:", existingLessonsError);
      return NextResponse.json(
        { error: "Failed to update lessons" },
        { status: 500 },
      );
    }

    const lessonIdByDay = new Map(
      (existingLessons ?? []).map((lesson) => [lesson.day_number, lesson.id]),
    );

    const missingDays = lessons
      .map((lesson) => lesson.dayNumber)
      .filter((dayNumber) => !lessonIdByDay.has(dayNumber));

    if (missingDays.length > 0) {
      return NextResponse.json(
        {
          error:
            "Some lessons do not exist yet. Generate those day lessons before editing content.",
          missingDays,
        },
        { status: 400 },
      );
    }

    for (const lesson of lessons) {
      const lessonId = lessonIdByDay.get(lesson.dayNumber);

      const { error: updateError } = await supabase
        .from("lessons")
        .update({
          title: lesson.title,
          content: lesson.content,
        })
        .eq("id", lessonId);

      if (updateError) {
        console.error("Update lesson error:", updateError);
        return NextResponse.json(
          { error: "Failed to update lessons" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Update lessons route error:", error);
    return NextResponse.json(
      { error: "Failed to update lessons" },
      { status: 500 },
    );
  }
}
