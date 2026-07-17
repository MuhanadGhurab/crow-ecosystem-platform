/** ISO 3166-1 alpha-2 → dial code (subset used in onboarding UI). */
const DIAL_CODES: Record<string, string> = {
  SA: "966",
  AE: "971",
  US: "1",
  GB: "44",
};

export type PhoneNormalizeResult =
  | { ok: true; e164: string; masked: string }
  | { ok: false; reason: "invalid" | "missing" };

/** Mask E.164 for display — last 2 digits visible. */
export function maskPhoneE164(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  if (digits.length < 4) return "••••";
  const tail = digits.slice(-2);
  const hidden = "•".repeat(Math.max(0, digits.length - 2));
  return `+${hidden}${tail}`;
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Saudi mobile: 9 digits starting with 5 (national significant number). */
function isValidSaMobile(national: string): boolean {
  return /^5\d{8}$/.test(national);
}

export function normalizePhoneToE164(input: {
  countryCode: string;
  nationalNumber: string;
}): PhoneNormalizeResult {
  const country = input.countryCode.trim().toUpperCase();
  let raw = input.nationalNumber.replace(/\s+/g, "").trim();
  if (!country || !raw) {
    return { ok: false, reason: "missing" };
  }

  if (raw.startsWith("+")) {
    const e164 = `+${digitsOnly(raw)}`;
    return isValidE164Phone(e164)
      ? { ok: true, e164, masked: maskPhoneE164(e164) }
      : { ok: false, reason: "invalid" };
  }

  if (raw.startsWith("00")) {
    raw = raw.slice(2);
  }

  const dial = DIAL_CODES[country];
  if (!dial) {
    return { ok: false, reason: "invalid" };
  }

  let national = digitsOnly(raw);
  if (national.startsWith(dial)) {
    national = national.slice(dial.length);
  }
  if (national.startsWith("0")) {
    national = national.replace(/^0+/, "");
  }

  if (country === "SA" && !isValidSaMobile(national)) {
    return { ok: false, reason: "invalid" };
  }

  if (national.length < 6 || national.length > 14) {
    return { ok: false, reason: "invalid" };
  }

  const e164 = `+${dial}${national}`;
  return isValidE164Phone(e164)
    ? { ok: true, e164, masked: maskPhoneE164(e164) }
    : { ok: false, reason: "invalid" };
}

export function isValidE164Phone(e164: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(e164);
}
