import { getRelationshipRule } from "../relationships/relationship-registry";
import {
  getProvenanceForBlueprintPath,
  listAllProvenanceRecords,
  traceRecommendationUpstream,
} from "./provenance-engine";
import type { EnterpriseBlueprintDraft } from "../blueprint/blueprint-types";

export type ProvenanceIntegrityFinding = {
  severity: "INFO" | "RECOMMENDATION" | "WARNING" | "BLOCKING_ERROR";
  code: string;
  message: string;
  path?: string;
};

export type ProvenanceIntegrityReport = {
  valid: boolean;
  targetErrors: number;
  sourceErrors: number;
  chainCycles: number;
  unknownFallbacks: number;
  findings: readonly ProvenanceIntegrityFinding[];
};

export function validateProvenanceIntegrity(
  blueprint: EnterpriseBlueprintDraft,
  expectedPaths: string[],
): ProvenanceIntegrityReport {
  const findings: ProvenanceIntegrityFinding[] = [];
  let targetErrors = 0;
  let sourceErrors = 0;
  let unknownFallbacks = 0;

  for (const path of expectedPaths) {
    const records = getProvenanceForBlueprintPath(path);
    if (records.length === 0) {
      targetErrors += 1;
      findings.push({ severity: "BLOCKING_ERROR", code: "MISSING_PROVENANCE", message: `No provenance for ${path}`, path });
      continue;
    }
    for (const r of records) {
      if (r.catalogRefs.length === 0 && r.userInputs.length === 0 && r.rules.length === 0) {
        sourceErrors += 1;
        findings.push({ severity: "BLOCKING_ERROR", code: "EMPTY_SOURCE", message: `Provenance ${r.id} has no sources`, path });
      }
      for (const rule of r.rules) {
        if (!getRelationshipRule(rule.ruleId)) {
          unknownFallbacks += 1;
          findings.push({ severity: "WARNING", code: "UNKNOWN_RULE", message: `Unknown rule ${rule.ruleId}`, path });
        }
      }
      if (r.sources.includes("LEGACY_ADAPTER" as never) === false && r.reason.toLowerCase().includes("fallback")) {
        unknownFallbacks += 1;
        findings.push({ severity: "WARNING", code: "UNKNOWN_FALLBACK", message: `Fallback language in ${path}`, path });
      }
    }
  }

  const chainCycles = detectProvenanceCycles(expectedPaths);

  return {
    valid: targetErrors === 0 && sourceErrors === 0 && chainCycles === 0 && unknownFallbacks === 0,
    targetErrors,
    sourceErrors,
    chainCycles,
    unknownFallbacks,
    findings,
  };
}

function detectProvenanceCycles(paths: string[]): number {
  let cycles = 0;
  for (const path of paths.slice(0, 50)) {
    const upstream = traceRecommendationUpstream(path, 10);
    if (upstream.includes(path)) cycles += 1;
  }
  return cycles;
}

export function countUnknownProvenanceFallbacks(): number {
  return listAllProvenanceRecords().filter(
    (r) => r.catalogRefs.length === 0 && r.rules.length === 0 && r.userInputs.length === 0,
  ).length;
}
