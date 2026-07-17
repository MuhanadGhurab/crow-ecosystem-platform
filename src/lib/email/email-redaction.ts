const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
const OTP_PATTERN = /\b\d{6}\b/g;
const SECRET_PATTERN =
  /(?:re_[A-Za-z0-9_-]+|Bearer\s+[A-Za-z0-9._-]+|api[_-]?key[=:\s]+[^\s,;]+|Authorization[=:\s]+[^\s,;]+)/gi;

/** Redact an email address for operator logs (e.g. `a***@example.com`). */
export function redactEmailAddress(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.indexOf("@");
  if (at <= 0) return "[redacted-email]";
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const visible = local.length <= 1 ? `${local.charAt(0) || ""}***` : `${local[0]}***`;
  return `${visible}@${domain}`;
}

/** Strip OTP codes and secrets from free-form log text. */
export function redactOperationalMessage(message: string): string {
  return message
    .replace(SECRET_PATTERN, "[redacted-secret]")
    .replace(OTP_PATTERN, "[redacted-code]")
    .replace(EMAIL_PATTERN, (match) => redactEmailAddress(match));
}

export function containsSixDigitOtp(text: string): boolean {
  return OTP_PATTERN.test(text);
}
