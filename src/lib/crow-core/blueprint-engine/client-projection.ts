import type { ClientProjectionVisibility, PersistentBlueprintVersionSnapshot } from "./types";
import type { EnterpriseBlueprintDraft } from "@/lib/model-forge/blueprint/blueprint-types";

const CLIENT_VISIBLE_SECTIONS = new Set([
  "executiveSummary",
  "organization",
  "departments",
  "capabilities",
  "entities",
  "workPersonas",
  "workflows",
  "outcomes",
  "kpis",
  "evidence",
  "sareaExperiences",
  "integrations",
  "complianceOverlays",
  "unresolvedDecisions",
  "scenarioProfile",
]);

const INTERNAL_ONLY_PATHS = [
  "warnings",
  "authorityProposals",
  "cyberCrowPolicies",
  "provenanceSummary",
  "validation.findings",
  "metadata",
] as const;

export type ClientBlueprintProjection = {
  versionNumber: number;
  contentHashPrefix: string;
  executiveSummary: string;
  sections: Record<string, unknown>;
  decisionsRequiringClientInput: unknown[];
  advisoryNotice: string;
};

export function projectClientBlueprint(
  snapshot: PersistentBlueprintVersionSnapshot,
  versionNumber: number,
): ClientBlueprintProjection {
  const draft = snapshot.contentJson;
  const sections: Record<string, unknown> = {};

  for (const key of CLIENT_VISIBLE_SECTIONS) {
    const section = (draft as Record<string, unknown>)[key];
    if (section !== undefined) sections[key] = section;
  }

  const sanitized = stripInternalFields(JSON.parse(JSON.stringify(sections)) as Record<string, unknown>);

  return {
    versionNumber,
    contentHashPrefix: snapshot.contentHash.slice(0, 16),
    executiveSummary: draft.executiveSummary,
    sections: sanitized,
    decisionsRequiringClientInput: draft.unresolvedDecisions.filter((d) => !d.blocking || d.category !== "AUTHORITY"),
    advisoryNotice:
      "Advisory organizational design proposal. Acceptance does not grant permissions, provision a tenant, or activate workflows.",
  };
}

export function classifySectionVisibility(sectionKey: string): ClientProjectionVisibility {
  if (CLIENT_VISIBLE_SECTIONS.has(sectionKey)) return "CLIENT_VISIBLE";
  if (INTERNAL_ONLY_PATHS.some((p) => p.startsWith(sectionKey))) return "INTERNAL_ONLY";
  if (sectionKey === "cyberCrowPolicies") return "CLIENT_SUMMARIZED";
  return "INTERNAL_ONLY";
}

function stripInternalFields(obj: unknown): Record<string, unknown> {
  if (!obj || typeof obj !== "object") return {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (k === "metadata" || k === "internalNotes" || k === "operatorNotes") continue;
    if (typeof v === "string" && v.includes("@") && v.includes(".")) continue;
    if (typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v)) continue;
    out[k] = v;
  }
  return out;
}

export function projectClientBlueprintDeterministic(
  a: ClientBlueprintProjection,
  b: ClientBlueprintProjection,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
