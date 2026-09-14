import "server-only";

interface WhatsAppSendResult {
  success: boolean;
  error?: string;
  providerMessageId?: string;
}

const GRAPH_API_VERSION = "v20.0";

function getWeddingDetails() {
  return {
    groom: process.env.NEXT_PUBLIC_GROOM_NAME || "the Groom",
    bride: process.env.NEXT_PUBLIC_BRIDE_NAME || "the Bride",
    dateISO: process.env.NEXT_PUBLIC_WEDDING_DATE || "",
    venue: process.env.NEXT_PUBLIC_VENUE_NAME || "the venue",
    mapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "",
  };
}

function formatWeddingDate(dateISO: string): string {
  if (!dateISO) return "";
  try {
    return new Date(dateISO).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateISO;
  }
}

/**
 * Sends the guest a WhatsApp confirmation via the Meta WhatsApp Cloud API.
 *
 * IMPORTANT — WhatsApp template requirement:
 * WhatsApp only allows businesses to *initiate* a conversation (i.e. message
 * a guest who has not messaged you first / outside a 24h session window)
 * using a pre-approved Message Template. A free-form text message sent
 * cold, like the one built here, will be rejected by the Graph API with an
 * error such as "(#131047) Message failed to send because more than 24
 * hours have passed since the customer last replied to this number" —
 * unless the guest has already messaged your business number.
 *
 * To make outbound confirmations work reliably you must:
 *   1. Create and submit a message template in Meta Business Manager
 *      (e.g. name: "rsvp_confirmation") with variables for name, groom,
 *      bride, date, venue, and maps link, and wait for approval.
 *   2. Set WHATSAPP_CONFIRMATION_TEMPLATE_NAME to that template's name.
 *   3. This function will then send the templated message instead of a
 *      free-form one automatically.
 *
 * Until a template is approved, this function will attempt free-form text
 * (which works for guests who already opened a chat with your number
 * within the last 24h) and report a clear failure otherwise — the guest
 * record is still saved either way; see /api/rsvp.
 */
export async function sendWhatsAppConfirmation(
  name: string,
  phoneE164: string
): Promise<WhatsAppSendResult> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_CONFIRMATION_TEMPLATE_NAME;

  if (!accessToken || !phoneNumberId) {
    return {
      success: false,
      error:
        "WhatsApp is not configured (missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID).",
    };
  }

  const { groom, bride, dateISO, venue, mapsUrl } = getWeddingDetails();
  const formattedDate = formatWeddingDate(dateISO);
  const to = phoneE164.replace(/^\+/, "");

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`;

  // Prefer the approved template when one is configured — this is the
  // only path guaranteed to work for a cold outbound message.
  const body = templateName
    ? {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: name },
                { type: "text", text: groom },
                { type: "text", text: bride },
                { type: "text", text: formattedDate },
                { type: "text", text: venue },
                { type: "text", text: mapsUrl },
              ],
            },
          ],
        },
      }
    : {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          preview_url: true,
          body:
            `Hello ${name} ❤️\n\n` +
            `Your attendance has been successfully confirmed for the wedding of ${groom} & ${bride}.\n\n` +
            `📅 Date: ${formattedDate}\n` +
            `📍 Venue: ${venue}\n\n` +
            `📌 Location:\n${mapsUrl}\n\n` +
            `We can't wait to celebrate with you! ❤️`,
        },
      };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      const message =
        data?.error?.message || `WhatsApp API request failed (${res.status}).`;
      return { success: false, error: message };
    }

    const providerMessageId = data?.messages?.[0]?.id as string | undefined;
    return { success: true, providerMessageId };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown WhatsApp API error.",
    };
  }
}
