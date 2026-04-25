import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const RequestSchema = z.object({
  caption: z.string().trim().min(1).max(280),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { caption } = RequestSchema.parse(body);
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

    if (bootcamp.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const publishedAt = bootcamp.published_at ?? new Date().toISOString();

    const { data: updatedBootcamp, error: updateError } = await supabase
      .from("bootcamps")
      .update({
        caption,
        published_at: publishedAt,
      })
      .eq("id", id)
      .select("id, caption, published_at")
      .single();

    if (updateError || !updatedBootcamp) {
      console.error("Publish bootcamp error:", updateError);
      return NextResponse.json(
        { error: "Failed to publish bootcamp" },
        { status: 500 },
      );
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

    console.error("Publish route error:", error);
    return NextResponse.json(
      { error: "Failed to publish bootcamp" },
      { status: 500 },
    );
  }
}
