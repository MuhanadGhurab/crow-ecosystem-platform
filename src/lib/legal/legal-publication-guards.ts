/**
 * Hosted legal publication safety gates — shared Preview/Production database and Production code compatibility.
 */

export const SHARED_HOSTED_DATABASE_FINGERPRINT = "0355c17692e2a90d" as const;

export const SHARED_HOSTED_SUPABASE_PROJECT_REF = "wbwnsndcxrgyqwppurms" as const;

export class LegalPublicationBlockedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LegalPublicationBlockedError";
  }
}

export function isExplicitLegalV11PublicationAuthorized(): boolean {
  return process.env.CROW_LEGAL_V1_1_PUBLICATION_AUTHORIZED === "true";
}

export function isHostedLegalPublicationAllowed(): boolean {
  return process.env.ALLOW_HOSTED_LEGAL_PUBLICATION === "true";
}

/** Production deployment must understand v1.1 reacceptance before shared DB publication. */
export function isProductionLegalV11CodeCompatible(): boolean {
  return process.env.PRODUCTION_LEGAL_V11_CODE_COMPATIBLE === "true";
}

export function isSharedHostedDatabaseFingerprint(): boolean {
  const expected = process.env.EXPECTED_DATABASE_FINGERPRINT?.trim();
  return expected === SHARED_HOSTED_DATABASE_FINGERPRINT;
}

export function assertHostedLegalPublicationSafe(context: string): void {
  if (!isExplicitLegalV11PublicationAuthorized()) {
    throw new LegalPublicationBlockedError(
      `${context}: CROW_LEGAL_V1_1_PUBLICATION_AUTHORIZED must be true for hosted v1.1 publication.`
    );
  }
  if (!isHostedLegalPublicationAllowed()) {
    throw new LegalPublicationBlockedError(
      `${context}: ALLOW_HOSTED_LEGAL_PUBLICATION must be true for hosted v1.1 publication.`
    );
  }
  if (isSharedHostedDatabaseFingerprint() && !isProductionLegalV11CodeCompatible()) {
    throw new LegalPublicationBlockedError(
      `${context}: shared Preview/Production database (${SHARED_HOSTED_DATABASE_FINGERPRINT}) — PRODUCTION_LEGAL_V11_CODE_COMPATIBLE must be true before v1.1 becomes current.`
    );
  }
}
