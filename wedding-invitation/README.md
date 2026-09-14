# Wedding Invitation — Full-Stack Project

A production-ready wedding invitation site: public invitation page (hero,
countdown, gallery, RSVP, location, music) backed by Supabase, with
WhatsApp confirmation messages and a protected admin dashboard.

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Next.js API routes (Node.js runtime)
- **Database**: Supabase (PostgreSQL)
- **Messaging**: Meta WhatsApp Cloud API
- **Auth**: JWT session cookie (httpOnly) + bcrypt-hashed password, no third-party auth service required

## 1. Install

```bash
npm install
```

## 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql` from this repo. It creates
   the `guests` table with Row Level Security enabled and **no** public
   policies — only the service role key (server-only) can read/write.
3. Copy your Project URL, anon key, and service role key from
   **Project Settings → API**.

## 3. Set up WhatsApp Cloud API

1. Create a Meta developer app and add the **WhatsApp** product
   (developers.facebook.com).
2. Grab your temporary access token (or generate a permanent one via a
   System User for production) and your Phone Number ID.
3. **Read this carefully — it affects whether messages actually send:**
   WhatsApp only lets a business *initiate* a chat (message someone who
   hasn't messaged your number in the last 24 hours) using a pre-approved
   **Message Template**. Since wedding guests are messaged cold after
   filling out the RSVP form, you need an approved template for
   confirmations to reliably deliver.
   - In Meta Business Manager, create a template (e.g. `rsvp_confirmation`)
     with a body like:
     `Hello {{1}} ❤️. Your attendance has been confirmed for the wedding
     of {{2}} & {{3}} on {{4}} at {{5}}. Location: {{6}}`
   - Submit it for approval (usually approved within minutes to a day).
   - Set `WHATSAPP_CONFIRMATION_TEMPLATE_NAME` to its name once approved.
   - Until then, the app falls back to a free-form text message, which
     will only succeed for guests who have messaged your business number
     first — everyone else's send will fail gracefully and be logged as
     `whatsapp_status: "failed"`, retryable from the admin dashboard.

## 4. Set up admin login

Generate a bcrypt hash for your chosen password:

```bash
npm run hash-password -- "your-chosen-password"
```

Paste the output into `ADMIN_PASSWORD_HASH` in your `.env` file, and set
`ADMIN_EMAIL` to your login email. Generate `AUTH_SECRET` with:

```bash
openssl rand -hex 32
```

## 5. Configure environment variables

Copy `.env.example` to `.env` and fill in every value described above,
plus the wedding details (`NEXT_PUBLIC_GROOM_NAME`, `NEXT_PUBLIC_BRIDE_NAME`,
`NEXT_PUBLIC_WEDDING_DATE`, `NEXT_PUBLIC_VENUE_NAME`,
`NEXT_PUBLIC_GOOGLE_MAPS_URL`).

For the Maps URL, the simplest reliable option is a search-query link:
`https://www.google.com/maps/search/?api=1&query=Sea+Rena+Hall` — or find
the venue on Google Maps, click "Share," and copy the link it gives you.

## 6. Add real photos (optional for now)

Drop files into `public/images/` with these exact names — no code changes
needed:

```
groom.jpg
bride.jpg
gallery-1.jpg
gallery-2.jpg
gallery-3.jpg
gallery-4.jpg
```

Placeholder images are already included so the site runs immediately.

## 7. Run locally

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin (redirects to
  `/admin/login` until you sign in)

## 8. Deploy

Any Node-capable host works (Vercel, Render, a VPS with `npm run build && npm start`).
Set the same environment variables in your host's dashboard — never commit
`.env` to version control.

**Production notes:**
- The RSVP rate limiter in `src/lib/rateLimit.ts` is in-memory and only
  effective per warm server instance. For real protection on serverless
  hosting, swap it for a shared store (e.g. Upstash Redis with
  `@upstash/ratelimit`).
- Always serve over HTTPS in production — most hosts (Vercel, etc.)
  handle this automatically.

## Project structure

```
src/
  app/
    page.tsx                 → public invitation page
    admin/login/page.tsx      → admin sign-in
    admin/page.tsx            → admin dashboard
    api/rsvp/route.ts         → guest submits RSVP
    api/admin/...             → protected admin endpoints
  components/                 → Hero, Countdown, Gallery, RSVPForm, etc.
  lib/
    supabaseAdmin.ts          → server-only DB client (service role key)
    whatsapp.ts               → WhatsApp Cloud API integration
    auth.ts                   → admin session (JWT + bcrypt)
    validation.ts             → Egyptian phone validation (zod)
    rateLimit.ts               → basic RSVP rate limiting
  middleware.ts                → protects /admin and /api/admin
supabase/schema.sql            → guests table + RLS
```

## Security notes

- The Supabase **anon** key is never given table access (no RLS policies
  for it) — all reads/writes go through API routes using the service
  role key on the server only.
- Admin password is bcrypt-hashed and stored only as a hash in env vars —
  never in source code.
- Admin routes are protected by middleware that verifies a signed,
  httpOnly session cookie; unauthenticated requests to `/admin/*` redirect
  to login, and to `/api/admin/*` return `401`.
- All API input is validated server-side with `zod`, independent of the
  client-side checks.
- WhatsApp and Supabase credentials only ever live in server-only files
  (`server-only` package enforced) and environment variables.
