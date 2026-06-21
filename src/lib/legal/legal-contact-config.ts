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

function readContactEnv(key: LegalContactPlaceholderKey): string | undefined {
  switch (key) {
    case "LEGAL_CONTACT_EMAIL":
      return process.env.LEGAL_CONTACT_EMAIL;
    case "PRIVACY_CONTACT_EMAIL":
      return process.env.PRIVACY_CONTACT_EMAIL;
    case "DATA_RIGHTS_CONTACT_EMAIL":
      return process.env.DATA_RIGHTS_CONTACT_EMAIL;
    case "SECURITY_CONTACT_EMAIL":
      return process.env.SECURITY_CONTACT_EMAIL;
    case "ABUSE_CONTACT_EMAIL":
      return process.env.ABUSE_CONTACT_EMAIL;
    case "CROW_LEGAL_ENTITY_NAME":
      return process.env.CROW_LEGAL_ENTITY_NAME;
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}

/** Resolve placeholder token to configured value or keep token until approved. */
export function resolveLegalContactPlaceholder(key: LegalContactPlaceholderKey): string {
  const configured = readContactEnv(key)?.trim();
  if (configured && configured.length > 0) return configured;
  return key;
}

/** Interpolate {{TOKEN}} placeholders — publication/seed finalization only; never on published render. */
export function interpolateLegalContactPlaceholders(content: string): string {
  let out = content;
  for (const key of LEGAL_CONTACT_PLACEHOLDER_KEYS) {
    out = out.replaceAll(`{{${key}}}`, resolveLegalContactPlaceholder(key));
  }
  return out;
}

/** Finalize approved template at controlled publication time (immutable stored body). */
export function finalizeLegalDocumentTemplate(templateBody: string): string {
  const resolved = interpolateLegalContactPlaceholders(templateBody);
  for (const key of LEGAL_CONTACT_PLACEHOLDER_KEYS) {
    if (resolved.includes(`{{${key}}}`)) {
      throw new Error(
        `finalizeLegalDocumentTemplate: ${key} is not configured — publication blocked.`
      );
    }
    if (resolved.includes(key)) {
      throw new Error(
        `finalizeLegalDocumentTemplate: unresolved ${key} token remains in body — publication blocked.`
      );
    }
  }
  return resolved;
}

export function assertAllLegalContactsConfiguredForPublication(context: string): void {
  const missing = LEGAL_CONTACT_PLACEHOLDER_KEYS.filter((key) => {
    const value = readContactEnv(key)?.trim();
    return !value || value === key;
  });
  if (missing.length > 0) {
    throw new Error(
      `${context}: hosted publication blocked — configure: ${missing.join(", ")}`
    );
  }
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
      readContactEnv(key)?.trim() ? "configured" : "placeholder",
    ])
  ) as Record<LegalContactPlaceholderKey, "configured" | "placeholder">;
}
