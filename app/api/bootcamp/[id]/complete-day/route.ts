import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const RequestSchema = z.object({
    dayNumber: z.number().int().min(1),
});

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Parse and validate request body
        const body = await req.json();
        const { dayNumber } = RequestSchema.parse(body);

        console.log(`Completing Day ${dayNumber} for bootcamp ${id}`);

        const supabase = await createClient();

        // Verify user owns this bootcamp and get current state
        const { data: bootcamp, error: bootcampError } = await supabase
            .from("bootcamps")
            .select("id, user_id, current_day, duration_days")
            .eq("id", id)
            .single();

        if (bootcampError || !bootcamp) {
            return NextResponse.json(
                { error: "Bootcamp not found" },
                { status: 404 }
            );
        }

        // Validate the day number
        if (dayNumber > bootcamp.duration_days) {
            return NextResponse.json(
                { error: "Invalid day number" },
                { status: 400 }
            );
        }

        // Ensure user is completing the current day (not skipping ahead)
        if (dayNumber !== bootcamp.current_day) {
            return NextResponse.json(
                { error: `You must complete Day ${bootcamp.current_day} first` },
                { status: 400 }
            );
        }

        // Increment current_day
        const newCurrentDay = bootcamp.current_day + 1;

        const { data: updatedBootcamp, error: updateError } = await supabase
            .from("bootcamps")
            .update({ current_day: newCurrentDay })
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            console.error("Database error:", updateError);
            throw new Error("Failed to update bootcamp progress");
        }

        console.log(`✓ Day ${dayNumber} completed, now on Day ${newCurrentDay}`);

        return NextResponse.json({
            success: true,
            bootcamp: {
                id: updatedBootcamp.id,
                currentDay: updatedBootcamp.current_day,
                completedDay: dayNumber,
            },
        });
    } catch (error: any) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: "Invalid request data",
                    details: error.issues,
                },
                { status: 400 }
            );
        }

        console.error("Complete day error:", error);
        return NextResponse.json(
            {
                error: "Failed to complete day",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
