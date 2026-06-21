import type { LegalDocumentType, LegalDocumentVersion } from "@prisma/client";
import {
  CROW_LEGAL_V1_1_DOCUMENTS,
  CROW_LEGAL_V1_1_SEMVER,
  CROW_LEGAL_V1_1_VERSION_NUMBER,
} from "@/lib/legal/crow-legal-v1-1-content";
import {
  assertAllLegalContactsConfiguredForPublication,
  assertNoExampleLegalContacts,
  finalizeLegalDocumentTemplate,
} from "@/lib/legal/legal-contact-config";
import { hashLegalDocumentContent } from "@/lib/legal/legal-document-hash";
import { verifyVersionContentHash } from "@/lib/legal/legal-document-validation";

export type FinalizedLegalDocument = {
  documentType: LegalDocumentType;
  title: string;
  contentBody: string;
  contentSha256: string;
};

export type LegalPublicationPayload = {
  documents: FinalizedLegalDocument[];
  semanticVersion: typeof CROW_LEGAL_V1_1_SEMVER;
  versionNumber: typeof CROW_LEGAL_V1_1_VERSION_NUMBER;
};

export type PublishCrowLegalV11Result = {
  action: "published" | "already_published" | "draft_seeded";
  versionIds: Record<LegalDocumentType, string>;
};

/** Build publication payload with contacts resolved once — hash covers exact accepted text. */
export function buildLegalV11PublicationPayload(): LegalPublicationPayload {
  assertAllLegalContactsConfiguredForPublication("buildLegalV11PublicationPayload");

  const documents: FinalizedLegalDocument[] = CROW_LEGAL_V1_1_DOCUMENTS.map((doc) => {
    const contentBody = finalizeLegalDocumentTemplate(doc.contentBody);
    assertNoExampleLegalContacts(contentBody, doc.documentType);
    const contentSha256 = hashLegalDocumentContent(contentBody);
    return {
      documentType: doc.documentType,
      title: doc.title,
      contentBody,
      contentSha256,
    };
  });

  return {
    documents,
    semanticVersion: CROW_LEGAL_V1_1_SEMVER,
    versionNumber: CROW_LEGAL_V1_1_VERSION_NUMBER,
  };
}

export function payloadsMatch(
  existing: Pick<LegalDocumentVersion, "contentBody" | "contentSha256" | "title">,
  requested: FinalizedLegalDocument
): boolean {
  return (
    existing.contentBody === requested.contentBody &&
    existing.contentSha256 === requested.contentSha256 &&
    existing.title === requested.title &&
    verifyVersionContentHash(existing)
  );
}
