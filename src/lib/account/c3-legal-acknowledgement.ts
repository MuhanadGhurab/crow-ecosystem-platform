import type { LegalDocumentType } from "@prisma/client";
import { hashLegalDocumentContent } from "@/lib/legal/legal-document-hash";
import { getCurrentPublishedMandatoryVersions } from "@/lib/legal/legal-document.service";
import { LegalAcceptanceValidationError } from "@/lib/legal/legal-errors";

export {
  isLegalAcknowledgementChecked,
  parseMandatoryLegalAcknowledgements,
  validateMandatoryAcknowledgements,
} from "@/lib/account/c3-legal-form-acknowledgement";

/** Resolve published mandatory legal versions server-side — never trust client version IDs. */
export async function resolveMandatoryAcceptancesForLocale(locale: string): Promise<
  { documentType: LegalDocumentType; versionId: string; contentHash: string }[]
> {
  const versions = await getCurrentPublishedMandatoryVersions({ locale });
  if (versions.length === 0) {
    throw new LegalAcceptanceValidationError(
      "Legal documents are not available for your locale."
    );
  }

  return versions.map((version) => ({
    documentType: version.legalDocument.documentType,
    versionId: version.id,
    contentHash: hashLegalDocumentContent(version.contentBody),
  }));
}
