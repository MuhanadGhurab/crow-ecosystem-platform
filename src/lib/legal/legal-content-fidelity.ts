import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { LegalDocumentType } from "@prisma/client";
import {
  CROW_LEGAL_V1_1_DOCUMENTS,
  type CrowLegalV11Document,
} from "@/lib/legal/crow-legal-v1-1-content";
import { LEGAL_CONTACT_PLACEHOLDER_KEYS } from "@/lib/legal/legal-contact-config";

export type LegalContentFidelityClassification =
  | "EXACT_MATCH"
  | "EDITORIAL_ONLY_DIFFERENCES"
  | "MATERIAL_DIFFERENCES_REQUIRE_APPROVAL"
  | "PO_SOURCE_MISSING";

export type LegalDocumentFidelityReport = {
  documentType: LegalDocumentType;
  classification: LegalContentFidelityClassification;
  preservedSections: string[];
  editorialChanges: string[];
  omittedClauses: string[];
  newClauses: string[];
  materialObligationChanges: string[];
  contactPlaceholderNotes: string[];
  governingLawNotes: string[];
  liabilityNotes: string[];
  securityComplianceNotes: string[];
  lineDiffSummary: { added: number; removed: number; changed: number };
};

export type LegalContentFidelitySummary = {
  overallClassification: LegalContentFidelityClassification;
  documents: LegalDocumentFidelityReport[];
  poSourceAvailable: boolean;
  poSourcePath: string;
};

const PO_SOURCE_DIR = join(process.cwd(), "docs/legal/source/product-owner-v1-1");

const PO_SOURCE_FILES: Record<LegalDocumentType, string> = {
  TERMS_OF_SERVICE: "terms-of-service-v1-1.md",
  PRIVACY_NOTICE: "privacy-notice-v1-1.md",
  ACCEPTABLE_USE_POLICY: "acceptable-use-policy-v1-1.md",
};

/** Normalize markdown for line-oriented comparison (placeholders preserved). */
export function normalizeLegalMarkdownForComparison(content: string): string[] {
  return content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line, index, arr) => !(line === "" && arr[index - 1] === ""));
}

function readPoSource(documentType: LegalDocumentType): string | null {
  const filePath = join(PO_SOURCE_DIR, PO_SOURCE_FILES[documentType]);
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath, "utf8");
}

function extractSectionHeadings(lines: string[]): string[] {
  return lines.filter((line) => /^##\s+/.test(line)).map((line) => line.replace(/^##\s+/, "").trim());
}

function lineDiff(
  left: string[],
  right: string[]
): { added: number; removed: number; changed: number } {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  let changed = 0;
  for (const line of left) {
    if (!rightSet.has(line)) changed++;
  }
  let added = 0;
  for (const line of right) {
    if (!leftSet.has(line)) added++;
  }
  const removed = changed;
  return { added, removed, changed };
}

function classifyDiff(materialHints: string[], diff: { changed: number; added: number }): LegalContentFidelityClassification {
  if (diff.changed === 0 && diff.added === 0) return "EXACT_MATCH";
  if (materialHints.length > 0) return "MATERIAL_DIFFERENCES_REQUIRE_APPROVAL";
  if (diff.changed + diff.added <= 3) return "EDITORIAL_ONLY_DIFFERENCES";
  return "MATERIAL_DIFFERENCES_REQUIRE_APPROVAL";
}

function compareDocument(
  committed: CrowLegalV11Document,
  poSource: string | null
): LegalDocumentFidelityReport {
  const committedLines = normalizeLegalMarkdownForComparison(committed.contentBody);
  const committedHeadings = extractSectionHeadings(committedLines);

  const placeholderNotes = LEGAL_CONTACT_PLACEHOLDER_KEYS.filter((key) =>
    committed.contentBody.includes(`{{${key}}}`)
  ).map((key) => `Template retains {{${key}}} until controlled publication finalization.`);

  if (!poSource) {
    return {
      documentType: committed.documentType,
      classification: "PO_SOURCE_MISSING",
      preservedSections: committedHeadings,
      editorialChanges: [],
      omittedClauses: [],
      newClauses: committedHeadings,
      materialObligationChanges: [
        "Line-by-line PO comparison blocked — deposit canonical PO markdown at docs/legal/source/product-owner-v1-1/.",
      ],
      contactPlaceholderNotes: placeholderNotes,
      governingLawNotes: committed.contentBody.includes("governing law")
        ? ["Governing-law language references {{CROW_LEGAL_ENTITY_NAME}} placeholder."]
        : [],
      liabilityNotes: committed.contentBody.includes("Limitation of liability")
        ? ["Liability section references entity placeholder and commercial relationship."]
        : [],
      securityComplianceNotes: committed.contentBody.includes("ISO/IEC")
        ? ["Alignment language present with explicit non-certification negation."]
        : [],
      lineDiffSummary: { added: 0, removed: 0, changed: 0 },
    };
  }

  const poLines = normalizeLegalMarkdownForComparison(poSource);
  const poHeadings = extractSectionHeadings(poLines);
  const diff = lineDiff(poLines, committedLines);

  const preservedSections = poHeadings.filter((h) => committedHeadings.includes(h));
  const omittedClauses = poHeadings.filter((h) => !committedHeadings.includes(h));
  const newClauses = committedHeadings.filter((h) => !poHeadings.includes(h));

  const materialObligationChanges: string[] = [];
  if (omittedClauses.length > 0) {
    materialObligationChanges.push(`PO sections absent from committed body: ${omittedClauses.join(", ")}`);
  }
  if (newClauses.length > 0) {
    materialObligationChanges.push(`Committed sections not in PO source: ${newClauses.join(", ")}`);
  }

  const governingLawNotes: string[] = [];
  const poGov = poLines.find((l) => /governing law/i.test(l));
  const committedGov = committedLines.find((l) => /governing law/i.test(l));
  if (poGov && committedGov && poGov !== committedGov) {
    governingLawNotes.push("Governing-law clause differs from PO source.");
    materialObligationChanges.push("Governing-law language change.");
  }

  const liabilityNotes: string[] = [];
  const poLiab = poLines.find((l) => /limitation of liability/i.test(l));
  const committedLiab = committedLines.find((l) => /limitation of liability/i.test(l));
  if (poLiab && committedLiab && poLiab !== committedLiab) {
    liabilityNotes.push("Limitation-of-liability clause differs from PO source.");
    materialObligationChanges.push("Liability language change.");
  }

  const securityComplianceNotes: string[] = [];
  if (committed.contentBody.includes("does **not** represent") || committed.contentBody.includes("does **not** state")) {
    securityComplianceNotes.push("Explicit non-certification negation present in committed body.");
  }

  const classification = classifyDiff(materialObligationChanges, diff);

  return {
    documentType: committed.documentType,
    classification,
    preservedSections,
    editorialChanges:
      diff.changed > 0 && materialObligationChanges.length === 0
        ? [`${diff.changed} line(s) differ without detected obligation-heading changes.`]
        : [],
    omittedClauses,
    newClauses,
    materialObligationChanges,
    contactPlaceholderNotes: placeholderNotes,
    governingLawNotes,
    liabilityNotes,
    securityComplianceNotes,
    lineDiffSummary: diff,
  };
}

export function buildLegalContentFidelitySummary(): LegalContentFidelitySummary {
  const poSourceAvailable = CROW_LEGAL_V1_1_DOCUMENTS.every(
    (doc) => readPoSource(doc.documentType) !== null
  );

  const documents = CROW_LEGAL_V1_1_DOCUMENTS.map((doc) =>
    compareDocument(doc, readPoSource(doc.documentType))
  );

  let overallClassification: LegalContentFidelityClassification;
  if (!poSourceAvailable) {
    overallClassification = "PO_SOURCE_MISSING";
  } else if (documents.some((d) => d.classification === "MATERIAL_DIFFERENCES_REQUIRE_APPROVAL")) {
    overallClassification = "MATERIAL_DIFFERENCES_REQUIRE_APPROVAL";
  } else if (documents.every((d) => d.classification === "EXACT_MATCH")) {
    overallClassification = "EXACT_MATCH";
  } else {
    overallClassification = "EDITORIAL_ONLY_DIFFERENCES";
  }

  return {
    overallClassification,
    documents,
    poSourceAvailable,
    poSourcePath: PO_SOURCE_DIR,
  };
}
