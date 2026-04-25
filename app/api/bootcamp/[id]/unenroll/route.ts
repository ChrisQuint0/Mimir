import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Prevent owner from unenrolling (they should unpublish instead)
  const { data: bootcamp, error: bootcampError } = await supabase
    .from("bootcamps")
    .select("user_id")
    .eq("id", id)
    .single();

  if (bootcampError || !bootcamp) {
    return NextResponse.json({ error: "Bootcamp not found" }, { status: 404 });
  }

  if (bootcamp.user_id === user.id) {
    return NextResponse.json(
      { error: "Owners cannot unenroll from their own bootcamp" },
      { status: 403 },
    );
  }

  const { error } = await supabase
    .from("bootcamp_enrollments")
    .delete()
    .eq("bootcamp_id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
