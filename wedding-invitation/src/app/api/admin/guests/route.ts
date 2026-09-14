import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim() || "";
  const status = searchParams.get("status") || "all";
  const sort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || "20")));

  const supabase = getSupabaseAdmin();
  let query = supabase.from("guests").select("*", { count: "exact" });

  if (search) {
    // Search by name OR phone
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  if (status !== "all") {
    query = query.eq("attendance_status", status);
  }

  query = query.order("created_at", { ascending: sort === "oldest" });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Failed to fetch guests:", error);
    return NextResponse.json({ error: "Failed to fetch guests." }, { status: 500 });
  }

  return NextResponse.json({
    guests: data,
    total: count ?? 0,
    page,
    pageSize,
  });
}
