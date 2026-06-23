import type { EnterpriseBlueprintDraft, EnterpriseBlueprintExport } from "./blueprint-types";
import { stableStringify } from "./blueprint-hash";
import { buildProvenanceChain, listAllProvenanceRecords } from "../provenance/provenance-engine";

function safeModelKey(draft: EnterpriseBlueprintDraft): string {
  return draft.metadata.sourceModelKey.replace(/[^a-z0-9_-]+/gi, "_").slice(0, 48);
}

export function exportBlueprintJson(draft: EnterpriseBlueprintDraft): EnterpriseBlueprintExport {
  const sanitized = sanitizeBlueprintForExport(draft);
  return {
    format: "json",
    filename: `crow-blueprint-preview-${safeModelKey(draft)}.json`,
    content: stableStringify(sanitized),
    previewClassification: "BLUEPRINT_PREVIEW",
  };
}

export function exportBlueprintMarkdown(draft: EnterpriseBlueprintDraft): EnterpriseBlueprintExport {
  const lines = [
    `# Crow Blueprint Preview`,
    ``,
    `> **PREVIEW** — Advisory only. Requires human blueprint review. Not authoritative.`,
    ``,
    `- Schema: ${draft.metadata.schemaVersion}`,
    `- Compiler: ${draft.metadata.compilerVersion}`,
    `- Source model: ${draft.metadata.sourceModelKey}`,
    `- Content hash: ${draft.metadata.contentHash}`,
    ``,
    `## Executive summary`,
    draft.executiveSummary,
    ``,
    `## Organization`,
    `- Primary industry: ${draft.modelDNA && typeof draft.modelDNA === "object" && "primaryIndustry" in draft.modelDNA ? (draft.modelDNA as { primaryIndustry: string }).primaryIndustry : "—"}`,
    ``,
    `## Work Personas (${draft.workPersonas.items.length})`,
    ...draft.workPersonas.items.map((p) => `- ${(p as { displayName: string }).displayName}`),
    ``,
    `## Workflows (${draft.workflows.items.length})`,
    ...draft.workflows.items.map((w) => `- ${(w as { displayName: string }).displayName}`),
    ``,
    `## Unresolved decisions`,
    ...draft.unresolvedDecisions.map((d) => `- ${d.question}`),
  ];
  return {
    format: "markdown",
    filename: `crow-blueprint-preview-${safeModelKey(draft)}.md`,
    content: lines.join("\n"),
    previewClassification: "BLUEPRINT_PREVIEW",
  };
}

export function exportValidationReport(draft: EnterpriseBlueprintDraft): EnterpriseBlueprintExport {
  return {
    format: "validation",
    filename: `crow-blueprint-validation-${safeModelKey(draft)}.json`,
    content: stableStringify(draft.validation),
    previewClassification: "BLUEPRINT_PREVIEW",
  };
}

export function exportDecisionRegister(draft: EnterpriseBlueprintDraft): EnterpriseBlueprintExport {
  return {
    format: "decisions",
    filename: `crow-blueprint-decisions-${safeModelKey(draft)}.json`,
    content: stableStringify(draft.unresolvedDecisions),
    previewClassification: "BLUEPRINT_PREVIEW",
  };
}

export function exportProvenanceSummary(draft: EnterpriseBlueprintDraft): EnterpriseBlueprintExport {
  const records = listAllProvenanceRecords();
  const chains = draft.capabilities.provenancePaths.slice(0, 10).map((p) => buildProvenanceChain(p));
  return {
    format: "provenance",
    filename: `crow-blueprint-provenance-${safeModelKey(draft)}.json`,
    content: stableStringify({ recordCount: records.length, sampleChains: chains }),
    previewClassification: "BLUEPRINT_PREVIEW",
  };
}

function sanitizeBlueprintForExport(draft: EnterpriseBlueprintDraft): unknown {
  const clone = JSON.parse(stableStringify(draft)) as EnterpriseBlueprintDraft;
  return {
    ...clone,
    metadata: {
      ...clone.metadata,
      generatedAtDisplay: clone.metadata.generatedAtDisplay,
    },
    _exportNotice: "BLUEPRINT_PREVIEW — not authoritative, not persisted",
  };
}
