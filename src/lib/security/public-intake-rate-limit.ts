/**
 * In-memory rate limit for public intake (Node runtime only).
 * Not shared across Vercel instances — pair with Vercel Firewall for production.
 * See docs/internal/PUBLIC_INTAKE_PROTECTION.md
 */

import { logIntakeAbuse } from "@/lib/security/intake-abuse-log";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const buckets = new Map<string, number[]>();

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSec: number };

export function checkPublicIntakeRateLimit(clientKey: string | null): RateLimitResult {
  if (!clientKey) {
    return { allowed: true };
  }

  const now = Date.now();
  const hits = buckets.get(clientKey) ?? [];
  const recent = hits.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    const oldest = recent[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));
    logIntakeAbuse("rate_limited", { clientKey: hashKey(clientKey) });
    return { allowed: false, retryAfterSec };
  }

  recent.push(now);
  buckets.set(clientKey, recent);

  if (buckets.size > 10_000) {
    for (const [key, times] of buckets) {
      if (times.every((t) => now - t >= WINDOW_MS)) buckets.delete(key);
    }
  }

  return { allowed: true };
}

/** Short hash for logs — not cryptographic. */
function hashKey(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return `ip-${(h >>> 0).toString(16)}`;
}
