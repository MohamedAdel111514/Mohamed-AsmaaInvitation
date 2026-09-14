import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/Database.types";

// This client uses the SERVICE ROLE key and must only ever be imported
// from server-side code (API routes, server components). It bypasses
// Row Level Security, so it is never bundled for the browser.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertConfigured(
  url: string | undefined,
  key: string | undefined
): asserts url is string {
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY in your environment (see .env.example)."
    );
  }
}

let cached: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdmin() {
  assertConfigured(supabaseUrl, serviceRoleKey);
  if (!cached) {
    cached = createClient<Database>(supabaseUrl, serviceRoleKey as string, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached!;
}