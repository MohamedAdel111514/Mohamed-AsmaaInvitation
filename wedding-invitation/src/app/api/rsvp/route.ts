import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { rsvpSchema, normalizeEgyptianPhone } from "@/lib/validation";
import { sendWhatsAppConfirmation } from "@/lib/whatsapp";
import { isRateLimited, getClientKey } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const clientKey = getClientKey(req.headers);
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = rsvpSchema.safeParse(json);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message || "Invalid input.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { name, phone } = parsed.data;
  const normalizedPhone = normalizeEgyptianPhone(phone);
  if (!normalizedPhone) {
    return NextResponse.json(
      { error: "Please enter a valid Egyptian phone number." },
      { status: 400 }
    );
  }

let supabase: ReturnType<typeof getSupabaseAdmin>;
try {
  supabase = getSupabaseAdmin();
} catch (err) {
  console.error("Supabase misconfigured:", err);
  return NextResponse.json(
    {
      error:
        "The server isn't connected to the database yet. Check that .env has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set, then restart the dev server.",
    },
    { status: 500 }
  );
}

// Save the guest first.

  // Save the guest first. Registration is considered successful once this
  // insert succeeds, regardless of what happens with WhatsApp next.
  const { data: guest, error: insertError } = await supabase
    .from("guests")
    .insert({
      name,
      phone: normalizedPhone,
      attendance_status: "confirmed",
      whatsapp_status: "pending",
    })
    .select()
    .single();

  if (insertError || !guest) {
    console.error("Failed to save guest:", insertError);
    return NextResponse.json(
      { error: "We couldn't save your RSVP right now. Please try again shortly." },
      { status: 500 }
    );
  }

  // Attempt WhatsApp confirmation. Failure here never deletes or rolls
  // back the guest record — it's logged for the admin to retry.
  const waResult = await sendWhatsAppConfirmation(name, normalizedPhone);

  const { error: updateError } = await supabase
    .from("guests")
    .update({
      whatsapp_status: waResult.success ? "sent" : "failed",
      whatsapp_error: waResult.success ? null : waResult.error ?? "Unknown error",
    })
    .eq("id", guest.id);

  if (updateError) {
    console.error("Failed to update WhatsApp status:", updateError);
  }

  if (!waResult.success) {
    console.error(`WhatsApp confirmation failed for guest ${guest.id}:`, waResult.error);
  }

  return NextResponse.json({
    success: true,
    guest: {
      id: guest.id,
      name: guest.name,
      attendance_status: "confirmed",
    },
    whatsappSent: waResult.success,
  });
}
