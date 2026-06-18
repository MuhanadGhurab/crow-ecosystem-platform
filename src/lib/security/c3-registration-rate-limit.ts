/**
 * In-memory rate limit for C3 registration and OTP resend (Node runtime only).
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REGISTRATION_ATTEMPTS = 8;
const MAX_VERIFY_ATTEMPTS = 20;

const registrationBuckets = new Map<string, number[]>();
const verifyBuckets = new Map<string, number[]>();

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSec: number };

function checkBucket(
  buckets: Map<string, number[]>,
  clientKey: string | null,
  maxRequests: number
): RateLimitResult {
  if (!clientKey) return { allowed: true };

  const now = Date.now();
  const hits = buckets.get(clientKey) ?? [];
  const recent = hits.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= maxRequests) {
    const oldest = recent[0] ?? now;
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000)),
    };
  }

  recent.push(now);
  buckets.set(clientKey, recent);
  return { allowed: true };
}

export function checkC3RegistrationRateLimit(clientKey: string | null): RateLimitResult {
  return checkBucket(registrationBuckets, clientKey, MAX_REGISTRATION_ATTEMPTS);
}

export function checkC3VerificationRateLimit(clientKey: string | null): RateLimitResult {
  return checkBucket(verifyBuckets, clientKey, MAX_VERIFY_ATTEMPTS);
}
