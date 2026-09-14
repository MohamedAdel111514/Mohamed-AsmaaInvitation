import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendWhatsAppConfirmation } from "@/lib/whatsapp";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabaseAdmin();

  const { data: guest, error: fetchError } = await supabase
    .from("guests")
    .select("*")
    .eq("id", params.id)
    .single();

  if (fetchError || !guest) {
    return NextResponse.json({ error: "Guest not found." }, { status: 404 });
  }

  const waResult = await sendWhatsAppConfirmation(guest.name, guest.phone);

  const { data: updated, error: updateError } = await supabase
    .from("guests")
    .update({
      whatsapp_status: waResult.success ? "sent" : "failed",
      whatsapp_error: waResult.success ? null : waResult.error ?? "Unknown error",
    })
    .eq("id", params.id)
    .select()
    .single();

  if (updateError) {
    console.error("Failed to update guest after retry:", updateError);
    return NextResponse.json({ error: "Retry attempted but failed to save status." }, { status: 500 });
  }

  return NextResponse.json({ success: waResult.success, guest: updated, error: waResult.error });
}
