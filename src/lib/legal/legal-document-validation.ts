import type { LegalDocumentVersion } from "@prisma/client";
import { hashLegalDocumentContent } from "@/lib/legal/legal-document-hash";

/** Reject mutation of immutable published content fields. */
export function assertPublishedVersionImmutable(
  existing: Pick<
    LegalDocumentVersion,
    "contentBody" | "contentSha256" | "status" | "publishedAt" | "effectiveAt"
  >,
  patch: Partial<
    Pick<
      LegalDocumentVersion,
      "contentBody" | "contentSha256" | "status" | "publishedAt" | "effectiveAt"
    >
  >
): void {
  if (existing.status !== "published") return;
  if (patch.contentBody !== undefined && patch.contentBody !== existing.contentBody) {
    throw new Error("Published legal document content is immutable; publish a new version.");
  }
  if (
    patch.contentSha256 !== undefined &&
    patch.contentSha256 !== existing.contentSha256
  ) {
    throw new Error("Published legal document hash is immutable.");
  }
  if (
    patch.publishedAt !== undefined &&
    existing.publishedAt &&
    patch.publishedAt.getTime() !== existing.publishedAt.getTime()
  ) {
    throw new Error("Published legal document publishedAt is immutable.");
  }
  if (
    patch.effectiveAt !== undefined &&
    patch.effectiveAt.getTime() !== existing.effectiveAt.getTime()
  ) {
    throw new Error("Published legal document effectiveAt is immutable.");
  }
}

export function verifyVersionContentHash(
  version: Pick<LegalDocumentVersion, "contentBody" | "contentSha256">
): boolean {
  return hashLegalDocumentContent(version.contentBody) === version.contentSha256;
}
