-- Run this once in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  attendance_status text not null default 'confirmed'
    check (attendance_status in ('confirmed', 'pending', 'cancelled')),
  whatsapp_status text not null default 'pending'
    check (whatsapp_status in ('pending', 'sent', 'failed')),
  whatsapp_error text,
  created_at timestamptz not null default now()
);

create index if not exists guests_created_at_idx on guests (created_at desc);
create index if not exists guests_phone_idx on guests (phone);
create index if not exists guests_status_idx on guests (attendance_status);

-- Row Level Security: locked down. All access goes through the server
-- using the service role key, which bypasses RLS. The anon/public key
-- (used only in the browser) is never given direct table access.
alter table guests enable row level security;

-- No policies are created for the anon role on purpose — this means
-- the public Supabase key cannot read/write guests at all. Every
-- read/write must go through our Next.js API routes, which use the
-- service role key on the server only.
