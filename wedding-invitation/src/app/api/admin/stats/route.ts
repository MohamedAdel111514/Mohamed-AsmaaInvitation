import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = getSupabaseAdmin();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [{ count: total }, { count: confirmed }, { count: today }, { count: waFailed }] =
    await Promise.all([
      supabase.from("guests").select("*", { count: "exact", head: true }),
      supabase
        .from("guests")
        .select("*", { count: "exact", head: true })
        .eq("attendance_status", "confirmed"),
      supabase
        .from("guests")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfToday.toISOString()),
      supabase
        .from("guests")
        .select("*", { count: "exact", head: true })
        .eq("whatsapp_status", "failed"),
    ]);

  return NextResponse.json({
    total: total ?? 0,
    confirmed: confirmed ?? 0,
    today: today ?? 0,
    whatsappFailed: waFailed ?? 0,
  });
}
