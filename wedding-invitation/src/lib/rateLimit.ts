import "server-only";

/**
 * A minimal in-memory sliding-window rate limiter.
 *
 * IMPORTANT: this only works correctly on a single long-lived server
 * process. On serverless/edge platforms (Vercel, most hosts run Next.js
 * this way) each invocation may run in a fresh instance, so this map does
 * not persist reliably across requests. It still helps against basic
 * rapid-fire abuse within one warm instance, but for real protection in
 * production, replace this with a shared store such as Upstash Redis
 * (`@upstash/ratelimit`) keyed by IP address.
 */

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}

export function getClientKey(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}
