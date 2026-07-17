
import { isValidE164Phone } from "@/lib/account/phone-normalize";

function normalizeAllowlistEntry(entry: string): string | null {
  const trimmed = entry.trim();
  if (!trimmed) return null;
  const e164 = trimmed.startsWith("+")
    ? `+${trimmed.replace(/\D/g, "")}`
    : `+${trimmed.replace(/\D/g, "")}`;
  return isValidE164Phone(e164) ? e164 : null;
}

function parseAllowlist(): Set<string> {
  const raw = process.env.C3_PHONE_SMS_TEST_ALLOWLIST?.trim();
  if (!raw) return new Set();

  const normalized = new Set<string>();
  for (const entry of raw.split(/[,;\n]+/)) {
    const e164 = normalizeAllowlistEntry(entry);
    if (e164) normalized.add(e164);
  }
  return normalized;
}

/** Preview-only destination gate for controlled SMS proof. Production never uses this mechanism. */
export function isPreviewPhoneDestinationAllowed(destinationE164: string): boolean {
  if (process.env.VERCEL_ENV === "production") {
    return true;
  }

  if (process.env.VERCEL_ENV !== "preview") {
    return true;
  }

  const allowlist = parseAllowlist();
  if (allowlist.size === 0) {
    return false;
  }

  return allowlist.has(destinationE164);
}

export function previewAllowlistConfigured(): boolean {
  return parseAllowlist().size > 0;
}
