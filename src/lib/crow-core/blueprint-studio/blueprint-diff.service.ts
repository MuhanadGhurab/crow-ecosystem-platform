import type {
  BlueprintDiffImpact,
  BlueprintSectionDiff,
  BlueprintVersionDiff,
  BlueprintVersionSnapshot,
  EnterpriseBlueprintDocument,
} from "../blueprint";

const SLICE_SECTION_KEYS = [
  "organizational",
  "operational",
  "security_trust",
  "experience",
  "integration",
  "commercial",
  "assumptions",
  "exclusions",
  "acceptanceCriteria",
] as const;

function summarizeSlice(doc: EnterpriseBlueprintDocument, key: string): string {
  if (key === "assumptions") return `${doc.assumptions.length} assumptions`;
  if (key === "exclusions") return `${doc.exclusions.length} exclusions`;
  if (key === "acceptanceCriteria") {
    return `${doc.acceptanceCriteria.length} acceptance criteria`;
  }
  const slice = doc.slices.find((s) => s.type === key);
  if (!slice) return "missing";
  return JSON.stringify(slice).slice(0, 120);
}

function impactFromChange(before: string, after: string): BlueprintDiffImpact {
  if (before === after) return "NONE";
  if (before === "missing" || after === "missing") return "HIGH";
  const delta = Math.abs(before.length - after.length);
  if (delta > 200) return "CRITICAL";
  if (delta > 80) return "HIGH";
  if (delta > 20) return "MEDIUM";
  return "LOW";
}

function maxImpact(impacts: BlueprintDiffImpact[]): BlueprintDiffImpact {
  const order: BlueprintDiffImpact[] = ["NONE", "LOW", "MEDIUM", "HIGH", "CRITICAL"];
  let max = 0;
  for (const i of impacts) {
    max = Math.max(max, order.indexOf(i));
  }
  return order[max] ?? "NONE";
}

export function diffBlueprintDocuments(
  fromDoc: EnterpriseBlueprintDocument,
  toDoc: EnterpriseBlueprintDocument
): BlueprintSectionDiff[] {
  return SLICE_SECTION_KEYS.map((key) => {
    const beforeSummary = summarizeSlice(fromDoc, key);
    const afterSummary = summarizeSlice(toDoc, key);
    const impact = impactFromChange(beforeSummary, afterSummary);
    return {
      sectionKey: key,
      impact,
      summary:
        impact === "NONE"
          ? "No material change"
          : `Changed: ${beforeSummary} → ${afterSummary}`,
      beforeSummary,
      afterSummary,
    };
  });
}

export function diffBlueprintVersions(
  from: BlueprintVersionSnapshot,
  to: BlueprintVersionSnapshot
): BlueprintVersionDiff {
  const sections = diffBlueprintDocuments(from.document, to.document);
  return {
    fromVersionId: from.id,
    toVersionId: to.id,
    sections,
    overallImpact: maxImpact(sections.map((s) => s.impact)),
  };
}

/** Alias for C1 studio naming. */
export type BlueprintDiffResult = BlueprintVersionDiff;

export type { BlueprintSectionDiff } from "../blueprint";

export function compareBlueprintSnapshots(
  from: BlueprintVersionSnapshot,
  to: BlueprintVersionSnapshot
): BlueprintDiffResult {
  return diffBlueprintVersions(from, to);
}
