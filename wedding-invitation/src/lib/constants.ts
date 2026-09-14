// Kept in its own file (no "server-only" / bcrypt imports) so that
// src/middleware.ts, which runs in the Edge runtime, can safely import it.
export const ADMIN_SESSION_COOKIE = "admin_session";
