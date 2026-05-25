/** Structured console warnings for public intake abuse (no secrets, minimal PII). */

export type IntakeAbuseEvent =
  | "honeypot_triggered"
  | "rate_limited"
  | "turnstile_missing"
  | "turnstile_failed"
  | "turnstile_disabled"
  | "payload_too_large"
  | "validation_failed";

export function logIntakeAbuse(
  event: IntakeAbuseEvent,
  meta?: Record<string, string | number | boolean | undefined>
): void {
  const safe: Record<string, string | number | boolean> = {};
  if (meta) {
    for (const [k, v] of Object.entries(meta)) {
      if (v !== undefined) safe[k] = v;
    }
  }
  console.warn("[public-intake]", event, Object.keys(safe).length ? safe : "");
}
