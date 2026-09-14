import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to export guests:", error);
    return NextResponse.json({ error: "Failed to export guests." }, { status: 500 });
  }

  const header = ["Name", "Phone", "Attendance Status", "Registration Date", "WhatsApp Status"];
  const rows = (data || []).map((g) =>
    [
      g.name,
      g.phone,
      g.attendance_status,
      new Date(g.created_at).toLocaleString("en-GB"),
      g.whatsapp_status,
    ]
      .map((v) => csvEscape(String(v)))
      .join(",")
  );

  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="guest-list-${Date.now()}.csv"`,
    },
  });
}
