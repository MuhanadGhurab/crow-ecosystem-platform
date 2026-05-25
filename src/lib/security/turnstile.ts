/**
 * Optional Cloudflare Turnstile verification for public intake.
 * When TURNSTILE_ENABLED is not true, verification is skipped (local dev friendly).
 */

import { logIntakeAbuse } from "@/lib/security/intake-abuse-log";

let loggedDisabled = false;

export function isTurnstileEnforced(): boolean {
  return (
    process.env.TURNSTILE_ENABLED === "true" &&
    Boolean(process.env.TURNSTILE_SECRET_KEY?.trim()) &&
    Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim())
  );
}

export function logTurnstileProtectionStatusOnce(): void {
  if (loggedDisabled) return;
  loggedDisabled = true;
  if (isTurnstileEnforced()) return;
  logIntakeAbuse("turnstile_disabled", {
    enabledFlag: process.env.TURNSTILE_ENABLED === "true",
    hasSecret: Boolean(process.env.TURNSTILE_SECRET_KEY?.trim()),
    hasSiteKey: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()),
  });
}

type SiteverifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(
  token: string | undefined | null,
  remoteIp?: string | null
): Promise<{ ok: true } | { ok: false; reason: "missing" | "invalid" | "misconfigured" }> {
  logTurnstileProtectionStatusOnce();

  if (!isTurnstileEnforced()) {
    return { ok: true };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY!.trim();
  const trimmed = token?.trim();
  if (!trimmed) {
    logIntakeAbuse("turnstile_missing");
    return { ok: false, reason: "missing" };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", trimmed);
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as SiteverifyResponse;
    if (data.success) return { ok: true };
    logIntakeAbuse("turnstile_failed", { status: res.status });
    return { ok: false, reason: "invalid" };
  } catch {
    logIntakeAbuse("turnstile_failed", { network: true });
    return { ok: false, reason: "invalid" };
  }
}
