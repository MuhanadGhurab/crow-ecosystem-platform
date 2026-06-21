/**
 * Centrally configured legal contact placeholders until monitored addresses are approved.
 * Production-readiness verifiers fail if `.example` domains appear in releasable legal content.
 */

export const LEGAL_CONTACT_PLACEHOLDER_KEYS = [
  "LEGAL_CONTACT_EMAIL",
  "PRIVACY_CONTACT_EMAIL",
  "DATA_RIGHTS_CONTACT_EMAIL",
  "SECURITY_CONTACT_EMAIL",
  "ABUSE_CONTACT_EMAIL",
  "CROW_LEGAL_ENTITY_NAME",
] as const;

export type LegalContactPlaceholderKey = (typeof LEGAL_CONTACT_PLACEHOLDER_KEYS)[number];

const ENV_MAP: Record<LegalContactPlaceholderKey, string | undefined> = {
  LEGAL_CONTACT_EMAIL: process.env.LEGAL_CONTACT_EMAIL,
  PRIVACY_CONTACT_EMAIL: process.env.PRIVACY_CONTACT_EMAIL,
  DATA_RIGHTS_CONTACT_EMAIL: process.env.DATA_RIGHTS_CONTACT_EMAIL,
  SECURITY_CONTACT_EMAIL: process.env.SECURITY_CONTACT_EMAIL,
  ABUSE_CONTACT_EMAIL: process.env.ABUSE_CONTACT_EMAIL,
  CROW_LEGAL_ENTITY_NAME: process.env.CROW_LEGAL_ENTITY_NAME,
};

/** Resolve placeholder token to configured value or keep token until approved. */
export function resolveLegalContactPlaceholder(key: LegalContactPlaceholderKey): string {
  const configured = ENV_MAP[key]?.trim();
  if (configured && configured.length > 0) return configured;
  return key;
}

/** Interpolate {{TOKEN}} placeholders in legal markdown bodies at seed/render time. */
export function interpolateLegalContactPlaceholders(content: string): string {
  let out = content;
  for (const key of LEGAL_CONTACT_PLACEHOLDER_KEYS) {
    out = out.replaceAll(`{{${key}}}`, resolveLegalContactPlaceholder(key));
  }
  return out;
}

const EXAMPLE_CONTACT_PATTERNS = [
  /@cybercrow\.example\b/i,
  /@.*\.example\b/i,
  /\b[a-z0-9._%+-]+@example\.(com|org|net)\b/i,
] as const;

export function containsExampleLegalContact(content: string): boolean {
  return EXAMPLE_CONTACT_PATTERNS.some((re) => re.test(content));
}

export function assertNoExampleLegalContacts(content: string, context: string): void {
  if (containsExampleLegalContact(content)) {
    throw new Error(`${context}: releasable legal content must not contain .example contact addresses`);
  }
}

export function legalContactConfigurationStatus(): Record<
  LegalContactPlaceholderKey,
  "configured" | "placeholder"
> {
  return Object.fromEntries(
    LEGAL_CONTACT_PLACEHOLDER_KEYS.map((key) => [
      key,
      ENV_MAP[key]?.trim() ? "configured" : "placeholder",
    ])
  ) as Record<LegalContactPlaceholderKey, "configured" | "placeholder">;
}
