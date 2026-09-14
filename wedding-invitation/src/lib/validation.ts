import { z } from "zod";

// Egyptian mobile numbers:
//  - Local format:  01[0,1,2,5]XXXXXXXX   (11 digits total)
//  - International: +201[0,1,2,5]XXXXXXXX or 00201[0,1,2,5]XXXXXXXX
const EG_PHONE_REGEX = /^(?:\+20|0020|0)?1[0125]\d{8}$/;

export function normalizeEgyptianPhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s()-]/g, "");
  if (!EG_PHONE_REGEX.test(cleaned)) return null;

  const digits = cleaned.replace(/^\+?20|^0020/, "").replace(/^0/, "");
  // digits now looks like "1XXXXXXXXX" (10 digits, no leading 0)
  return `+20${digits}`;
}

export const rsvpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "That name looks too long — please shorten it."),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter your phone number.")
    .refine((val) => normalizeEgyptianPhone(val) !== null, {
      message: "Please enter a valid Egyptian phone number (e.g. 010XXXXXXXX).",
    }),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
