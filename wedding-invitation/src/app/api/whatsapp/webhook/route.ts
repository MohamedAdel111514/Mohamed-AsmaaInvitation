import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!expectedToken) {
    console.error("WHATSAPP_VERIFY_TOKEN is not set.");
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 500 }
    );
  }

  if (mode === "subscribe" && token === expectedToken && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json(
    { error: "Verification failed." },
    { status: 403 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const entries = payload?.entry ?? [];

    for (const entry of entries) {
      for (const change of entry?.changes ?? []) {
        const value = change?.value ?? {};

        for (const status of value?.statuses ?? []) {
          console.log("WHATSAPP STATUS", {
            messageId: status?.id,
            recipient: status?.recipient_id,
            status: status?.status,
            timestamp: status?.timestamp,
            errors: status?.errors ?? null,
          });

          if (status?.status === "failed") {
            console.error("WHATSAPP DELIVERY FAILED", {
              messageId: status?.id,
              recipient: status?.recipient_id,
              errors: status?.errors ?? [],
            });
          }
        }

        for (const message of value?.messages ?? []) {
          console.log("WHATSAPP INBOUND MESSAGE", {
            from: message?.from,
            messageId: message?.id,
            type: message?.type,
            timestamp: message?.timestamp,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);

    // Still acknowledge the webhook so Meta doesn't repeatedly retry it.
    return NextResponse.json({ received: true });
  }
}