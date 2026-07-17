import type { LegalDocumentType } from "@prisma/client";

export const LEGAL_DOCUMENT_SLUGS: Record<LegalDocumentType, string> = {
  TERMS_OF_SERVICE: "terms-of-service",
  PRIVACY_NOTICE: "privacy-notice",
  ACCEPTABLE_USE_POLICY: "acceptable-use-policy",
};

const SLUG_TO_TYPE = Object.fromEntries(
  Object.entries(LEGAL_DOCUMENT_SLUGS).map(([type, slug]) => [slug, type])
) as Record<string, LegalDocumentType>;

export function legalDocumentPublicPath(
  documentType: LegalDocumentType,
  versionId: string
): string {
  return `/legal/${LEGAL_DOCUMENT_SLUGS[documentType]}/${versionId}`;
}

export function parseLegalDocumentSlug(slug: string): LegalDocumentType | null {
  return SLUG_TO_TYPE[slug] ?? null;
}
