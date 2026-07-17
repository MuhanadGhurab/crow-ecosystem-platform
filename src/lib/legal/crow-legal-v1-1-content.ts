/**
 * Crow Legal v1.1 — implementation templates loaded from product-owner canonical source.
 * Source of truth: docs/legal/source/product-owner-v1-1/*.md
 * Final immutable bodies and hashes are created by legal-publication.service at publication time.
 * Counsel and product-owner review required before hosted publication.
 */

import { readFileSync } from "fs";
import { join } from "path";
import type { LegalDocumentType, MandatoryClassification } from "@prisma/client";

export const CROW_LEGAL_V1_1_SEMVER = "1.1" as const;
export const CROW_LEGAL_V1_1_VERSION_NUMBER = 2 as const;

export type CrowLegalV11Document = {
  documentType: LegalDocumentType;
  title: string;
  mandatoryClassification: MandatoryClassification;
  contentBody: string;
};

const PO_SOURCE_DIR = join(process.cwd(), "docs/legal/source/product-owner-v1-1");

function loadProductOwnerSource(filename: string): string {
  return readFileSync(join(PO_SOURCE_DIR, filename), "utf8");
}

export const CROW_LEGAL_V1_1_DOCUMENTS: readonly CrowLegalV11Document[] = [
  {
    documentType: "TERMS_OF_SERVICE",
    title: "Crow Platform Terms of Service — Version 1.1",
    mandatoryClassification: "mandatory_contractual",
    contentBody: loadProductOwnerSource("terms-of-service-v1-1.md"),
  },
  {
    documentType: "PRIVACY_NOTICE",
    title: "Crow Platform Privacy Notice — Version 1.1",
    mandatoryClassification: "mandatory_notice",
    contentBody: loadProductOwnerSource("privacy-notice-v1-1.md"),
  },
  {
    documentType: "ACCEPTABLE_USE_POLICY",
    title: "Crow Acceptable Use Policy — Version 1.1",
    mandatoryClassification: "mandatory_contractual",
    contentBody: loadProductOwnerSource("acceptable-use-policy-v1-1.md"),
  },
] as const;

export function getCrowLegalV11Document(type: LegalDocumentType): CrowLegalV11Document | undefined {
  return CROW_LEGAL_V1_1_DOCUMENTS.find((d) => d.documentType === type);
}
