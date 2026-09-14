import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  verifyAdminCredentials,
  createAdminSessionToken,
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";
import { isRateLimited, getClientKey } from "@/lib/rateLimit";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export async function POST(req: NextRequest) {
  const clientKey = `login:${getClientKey(req.headers)}`;
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || "Invalid input." },
      { status: 400 }
    );
  }

  let isValid: boolean;
  try {
    isValid = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  } catch (err) {
    console.error("Admin auth misconfigured:", err);
    return NextResponse.json(
      { error: "Admin authentication is not configured on the server." },
      { status: 500 }
    );
  }

  if (!isValid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await createAdminSessionToken(parsed.data.email);

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
