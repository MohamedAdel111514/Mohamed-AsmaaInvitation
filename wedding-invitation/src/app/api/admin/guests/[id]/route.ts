import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const updateSchema = z.object({
  attendance_status: z.enum(["confirmed", "pending", "cancelled"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || "Invalid input." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("guests")
    .update({ attendance_status: parsed.data.attendance_status })
    .eq("id", params.id)
    .select()
    .single();

  if (error || !data) {
    console.error("Failed to update guest:", error);
    return NextResponse.json({ error: "Guest not found or update failed." }, { status: 404 });
  }

  return NextResponse.json({ guest: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("guests").delete().eq("id", params.id);

  if (error) {
    console.error("Failed to delete guest:", error);
    return NextResponse.json({ error: "Failed to delete guest." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
