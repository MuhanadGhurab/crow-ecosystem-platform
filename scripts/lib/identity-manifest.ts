import { createHash, randomBytes } from "node:crypto";

/** Stable opaque reference for operator comparison — never reversible to raw identity. */
export function opaqueManifestRef(
  namespace: string,
  stableId: string,
  salt?: string
): string {
  const material = `${namespace}:${stableId}:${salt ?? "c3-10a-manifest"}`;
  return createHash("sha256").update(material).digest("hex").slice(0, 16);
}

export function manifestDigest(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export type IdentityResetClassification =
  | "DISPOSABLE_TEST_IDENTITY"
  | "DELETE_AFTER_DEPENDENCY_CLEANUP"
  | "ARCHIVE_LEGAL_EVIDENCE_THEN_DELETE"
  | "TRANSFER_OPERATIONAL_OWNERSHIP_THEN_DELETE"
  | "SYSTEM_OR_SERVICE_PRINCIPAL"
  | "MANUAL_REVIEW_REQUIRED";

export const EMPTY_CLASSIFICATION_COUNTS: Record<
  IdentityResetClassification,
  number
> = {
  DISPOSABLE_TEST_IDENTITY: 0,
  DELETE_AFTER_DEPENDENCY_CLEANUP: 0,
  ARCHIVE_LEGAL_EVIDENCE_THEN_DELETE: 0,
  TRANSFER_OPERATIONAL_OWNERSHIP_THEN_DELETE: 0,
  SYSTEM_OR_SERVICE_PRINCIPAL: 0,
  MANUAL_REVIEW_REQUIRED: 0,
};

export function incrementClassification(
  counts: Record<IdentityResetClassification, number>,
  category: IdentityResetClassification
): void {
  counts[category] += 1;
}

/** Product-owner authorization phrase for future execute (never required for plan). */
export const IDENTITY_RESET_EXECUTE_PHRASE_EXPECTED =
  "WIPE ALL PREVIOUS USERS AND BEGIN GENERATION 2";

export const HOSTED_CENSUS_EXPECTED_FINGERPRINT = "0355c17692e2a90d";
export const HOSTED_CENSUS_EXPECTED_SUPABASE_REF = "wbwnsndcxrgyqwppurms";

export function generateManifestSalt(): string {
  return randomBytes(16).toString("hex");
}
