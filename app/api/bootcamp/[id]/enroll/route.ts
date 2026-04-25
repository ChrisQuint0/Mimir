import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
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

    const { data: bootcamp, error: bootcampError } = await supabase
      .from("bootcamps")
      .select("id, user_id, published_at")
      .eq("id", id)
      .single();

    if (bootcampError || !bootcamp) {
      return NextResponse.json(
        { error: "Bootcamp not found" },
        { status: 404 },
      );
    }

    if (!bootcamp.published_at && bootcamp.user_id !== user.id) {
      return NextResponse.json(
        { error: "This bootcamp is not published yet" },
        { status: 403 },
      );
    }

    const { data: existingEnrollment, error: enrollmentLookupError } =
      await supabase
        .from("bootcamp_enrollments")
        .select("id, current_day")
        .eq("bootcamp_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

    if (enrollmentLookupError) {
      console.error("Enrollment lookup error:", enrollmentLookupError);
      return NextResponse.json(
        { error: "Failed to verify enrollment" },
        { status: 500 },
      );
    }

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        enrollment: existingEnrollment,
        alreadyEnrolled: true,
      });
    }

    const { data: enrollment, error: enrollError } = await supabase
      .from("bootcamp_enrollments")
      .insert({
        bootcamp_id: id,
        user_id: user.id,
        current_day: 1,
      })
      .select("id, current_day")
      .single();

    if (enrollError || !enrollment) {
      console.error("Enrollment create error:", enrollError);
      return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      enrollment,
      alreadyEnrolled: false,
    });
  } catch (error) {
    console.error("Enroll route error:", error);
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
  }
}
