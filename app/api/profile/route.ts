import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ProfileUpdateSchema = z
  .object({
    avatarPath: z.string().min(1).optional(),
    displayName: z.string().trim().min(2).max(50).optional(),
  })
  .refine(
    (value) => Boolean(value.avatarPath || value.displayName),
    "At least one profile field must be provided",
  );

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { avatarPath, displayName } = ProfileUpdateSchema.parse(body);

    const updatePayload: {
      avatar_url?: string;
      display_name?: string;
      updated_at: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (avatarPath) {
      updatePayload.avatar_url = avatarPath;
    }

    if (displayName) {
      updatePayload.display_name = displayName;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 },
      );
    }

    const { error: authUpdateError } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        ...(avatarPath ? { avatar_url: avatarPath } : {}),
        ...(displayName ? { display_name: displayName } : {}),
      },
    });

    if (authUpdateError) {
      return NextResponse.json(
        { error: authUpdateError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      avatarPath: avatarPath ?? null,
      displayName: displayName ?? null,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid profile update", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update profile",
      },
      { status: 500 },
    );
  }
}
