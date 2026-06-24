import type { EnterpriseBlueprintDraft } from "../blueprint/blueprint-types";
import type { GraphNodeType } from "../domain-types";
import {
  getProvenanceForBlueprintPath,
  listAllProvenanceRecords,
  countUnexplainedTargets,
} from "../provenance/provenance-engine";
import { collectAllBlueprintProvenancePaths } from "../provenance/provenance-registration";
import { resolveGraphSources } from "../graph/graph-sources";
import type { EnterpriseModelDraft } from "../types";

export type ProvenanceCoverageSection = {
  section: string;
  expectedPaths: number;
  coveredPaths: number;
  missingPaths: readonly string[];
};

export type ProvenanceCoverageReport = {
  sections: readonly ProvenanceCoverageSection[];
  totalExpected: number;
  totalCovered: number;
  unexplainedPaths: readonly string[];
  complete: boolean;
};

export function calculateProvenanceCoverage(
  draft: EnterpriseModelDraft,
  blueprint: EnterpriseBlueprintDraft,
  specialistKeys: string[] = [],
): ProvenanceCoverageReport {
  const sources = resolveGraphSources(draft, specialistKeys);
  const allPaths = collectAllBlueprintProvenancePaths(draft, sources);
  const unexplained = countUnexplainedTargets(allPaths);

  const sectionMap: Record<string, string[]> = {};
  for (const p of allPaths) {
    const parts = p.split(".");
    const section = parts[1] ?? "unknown";
    const list = sectionMap[section] ?? [];
    list.push(p);
    sectionMap[section] = list;
  }

  const sections: ProvenanceCoverageSection[] = Object.entries(sectionMap).map(([section, paths]) => {
    const missing = paths.filter((p) => getProvenanceForBlueprintPath(p).length === 0);
    return {
      section,
      expectedPaths: paths.length,
      coveredPaths: paths.length - missing.length,
      missingPaths: missing,
    };
  });

  return {
    sections: sections.sort((a, b) => a.section.localeCompare(b.section)),
    totalExpected: allPaths.length,
    totalCovered: allPaths.length - unexplained.length,
    unexplainedPaths: unexplained,
    complete: unexplained.length === 0,
  };
}

export function countProvenanceByNodeType(records = listAllProvenanceRecords()): Partial<Record<GraphNodeType, number>> {
  const counts: Partial<Record<GraphNodeType, number>> = {};
  const kindMap: Record<string, GraphNodeType> = {
    industry: "INDUSTRY",
    work_persona: "WORK_PERSONA",
    workflow: "WORKFLOW",
    workflow_stage: "WORKFLOW_STAGE",
    entity: "ENTITY",
    capability: "CAPABILITY",
    kpi: "KPI",
    evidence: "EVIDENCE",
    authority_proposal: "AUTHORITY_PROPOSAL",
    sarea_experience: "SAREA_EXPERIENCE",
    cybercrow_policy: "CYBERCROW_POLICY",
    integration: "INTEGRATION",
    compliance_overlay: "COMPLIANCE_OVERLAY",
    department: "DEPARTMENT",
    outcome: "OUTCOME",
  };
  for (const r of records) {
    const t = kindMap[r.target.kind];
    if (t) counts[t] = (counts[t] ?? 0) + 1;
  }
  return counts;
}
