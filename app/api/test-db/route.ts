import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Try to query the bootcamps table
    const { data, error } = await supabase
      .from("bootcamps")
      .select("*")
      .limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Database connection working!",
      bootcamps: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to connect to database",
      },
      { status: 500 },
    );
  }
}
