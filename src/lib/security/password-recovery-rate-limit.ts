/**
 * In-memory throttling for password recovery requests (Node runtime).
 */

import { createHmac } from "node:crypto";
import { normalizeEmail } from "@/lib/account/email-normalize";

const WINDOW_MS = 15 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_PER_IP = 10;
const MAX_PER_EMAIL_WINDOW = 3;
const MAX_PER_EMAIL_DAY = 10;
const RESEND_COOLDOWN_MS = 60 * 1000;

const ipBuckets = new Map<string, number[]>();
const emailWindowBuckets = new Map<string, number[]>();
const emailDayBuckets = new Map<string, number[]>();
const lastRequestByEmail = new Map<string, number>();

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSec: number };

function pruneRecent(hits: number[], windowMs: number, now: number): number[] {
  return hits.filter((t) => now - t < windowMs);
}

function checkBucket(
  buckets: Map<string, number[]>,
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const recent = pruneRecent(buckets.get(key) ?? [], windowMs, now);

  if (recent.length >= maxRequests) {
    const oldest = recent[0] ?? now;
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  recent.push(now);
  buckets.set(key, recent);
  return { allowed: true };
}

function resolveDigestSecret(): string {
  const fromEnv =
    process.env.PASSWORD_RECOVERY_RATE_LIMIT_SECRET?.trim() ??
    process.env.EMAIL_VERIFICATION_CODE_SECRET?.trim();
  if (fromEnv && fromEnv.length >= 16) return fromEnv;
  return "crow-password-recovery-rate-limit-dev-only";
}

export function emailDigestForRateLimit(email: string): string {
  const normalized = normalizeEmail(email);
  return createHmac("sha256", resolveDigestSecret())
    .update(normalized)
    .digest("hex")
    .slice(0, 24);
}

export function checkPasswordRecoveryRateLimit(
  clientIp: string | null,
  email: string
): RateLimitResult {
  const now = Date.now();
  const digest = emailDigestForRateLimit(email);

  const last = lastRequestByEmail.get(digest);
  if (last && now - last < RESEND_COOLDOWN_MS) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((last + RESEND_COOLDOWN_MS - now) / 1000)),
    };
  }

  if (clientIp) {
    const ipResult = checkBucket(ipBuckets, clientIp, MAX_PER_IP, WINDOW_MS);
    if (!ipResult.allowed) return ipResult;
  }

  const emailWindow = checkBucket(
    emailWindowBuckets,
    digest,
    MAX_PER_EMAIL_WINDOW,
    WINDOW_MS
  );
  if (!emailWindow.allowed) return emailWindow;

  const emailDay = checkBucket(emailDayBuckets, digest, MAX_PER_EMAIL_DAY, DAY_MS);
  if (!emailDay.allowed) return emailDay;

  lastRequestByEmail.set(digest, now);
  return { allowed: true };
}

export function resetPasswordRecoveryRateLimitForTests(): void {
  ipBuckets.clear();
  emailWindowBuckets.clear();
  emailDayBuckets.clear();
  lastRequestByEmail.clear();
}
