import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bootcamp_reviews")
    .select(
      `id, bootcamp_id, user_id, rating, comment, created_at, updated_at,
       profiles ( id, display_name, avatar_url )`,
    )
    .eq("bootcamp_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reviews: data });
}

export async function POST(
  req: NextRequest,
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

  // Only enrolled non-owners can review
  const { data: bootcamp } = await supabase
    .from("bootcamps")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!bootcamp) {
    return NextResponse.json({ error: "Bootcamp not found" }, { status: 404 });
  }

  if (bootcamp.user_id === user.id) {
    return NextResponse.json(
      { error: "Owners cannot review their own bootcamp" },
      { status: 403 },
    );
  }

  const { data: enrollment } = await supabase
    .from("bootcamp_enrollments")
    .select("id")
    .eq("bootcamp_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!enrollment) {
    return NextResponse.json(
      { error: "You must be enrolled to leave a review" },
      { status: 403 },
    );
  }

  const body = await req.json();
  const rating = Number(body.rating);
  const comment: string | null = body.comment?.trim() || null;

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5" },
      { status: 400 },
    );
  }

  const { data: review, error } = await supabase
    .from("bootcamp_reviews")
    .upsert(
      {
        bootcamp_id: id,
        user_id: user.id,
        rating,
        comment,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,bootcamp_id" },
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ review });
}
