import type { EnterpriseBlueprintDraft } from "./blueprint-types";
import type { EnterpriseOperatingGraph } from "../domain-types";
import { validateProvenanceIntegrity } from "../provenance/provenance-integrity";
import { collectAllBlueprintProvenancePaths } from "../provenance/provenance-registration";
import { resolveGraphSources } from "../graph/graph-sources";
import { composeEnterpriseModel } from "../composition/hybrid-composition";
import type { HybridCompositionInput } from "../types";
import { buildScaleProfile } from "../scale/tenant-scale";
import type { OrganizationalTopologyKey, TenantScalePreset } from "../types";

export type ReviewReadinessStatus =
  | "READY"
  | "READY_WITH_RECOMMENDATIONS"
  | "NEEDS_DECISION"
  | "BLOCKED"
  | "NOT_APPLICABLE";

export type BlueprintReviewReadinessSection = {
  section: string;
  status: ReviewReadinessStatus;
  blockingIssues: readonly string[];
  recommendations: readonly string[];
};

export type BlueprintReviewReadiness = {
  overallStatus: "READY_FOR_HUMAN_BLUEPRINT_REVIEW" | "NEEDS_DECISION" | "BLOCKED";
  sections: readonly BlueprintReviewReadinessSection[];
  blockingIssueCount: number;
  unexplainedProvenance: number;
  platformRoleLeakage: number;
  authorityBearingItems: number;
  orphanGraphEdges: number;
  contentHash: string;
  compilerVersion: string;
};

function sectionStatus(
  name: string,
  blocking: string[],
  recommendations: string[],
): BlueprintReviewReadinessSection {
  let status: ReviewReadinessStatus = "READY";
  if (blocking.length > 0) status = "BLOCKED";
  else if (recommendations.length > 0) status = "READY_WITH_RECOMMENDATIONS";
  return { section: name, status, blockingIssues: blocking, recommendations };
}

export function assessBlueprintReviewReadiness(
  blueprint: EnterpriseBlueprintDraft,
  graph?: EnterpriseOperatingGraph,
  compositionInput?: HybridCompositionInput,
): BlueprintReviewReadiness {
  const model = compositionInput
    ? composeEnterpriseModel(compositionInput)
    : null;
  const sources = model ? resolveGraphSources(model, [...(compositionInput?.specialistDomains ?? [])]) : null;
  const expectedPaths = model && sources ? collectAllBlueprintProvenancePaths(model, sources) : [];
  const integrity = validateProvenanceIntegrity(blueprint, expectedPaths);

  const unexplained = blueprint.provenanceSummary.unexplainedCount;
  const blockingValidation = blueprint.validation.findings.filter((f) => f.severity === "BLOCKING_DRAFT_ERROR");
  const platformLeak = blueprint.validation.findings.filter((f) => f.code === "PLATFORM_ROLE_LEAKAGE");
  const authorityBearing = [
    ...blueprint.workPersonas.items,
    ...blueprint.authorityProposals.items,
  ].filter((i) => (i as { grantsPermissions?: boolean }).grantsPermissions === true).length;

  const orphanEdges = graph?.findings.filter((f) => f.code === "ORPHAN_EDGE").length ?? 0;

  const sections: BlueprintReviewReadinessSection[] = [
    sectionStatus("organization", unexplained > 0 ? ["Unexplained provenance"] : [], []),
    sectionStatus("departments", [], blueprint.departments.items.length === 0 ? ["No departments resolved"] : []),
    sectionStatus("capabilities", [], []),
    sectionStatus("entities", [], []),
    sectionStatus("personas", authorityBearing > 0 ? ["Authority-bearing persona"] : [], []),
    sectionStatus("workflows", blockingValidation.filter((f) => f.message.includes("workflow")).map((f) => f.message), []),
    sectionStatus("outcomes and KPIs", [], []),
    sectionStatus("evidence and audit", [], []),
    sectionStatus("authority proposals", [], ["All proposals advisory"]),
    sectionStatus("experience", [], []),
    sectionStatus("trust", [], []),
    sectionStatus("integrations", [], []),
    sectionStatus("compliance", [], ["Advisory overlays only"]),
    sectionStatus("decisions", blueprint.unresolvedDecisions.filter((d) => d.blocking).map((d) => d.question), []),
    sectionStatus("provenance", integrity.targetErrors > 0 ? [`${integrity.targetErrors} missing provenance`] : [], []),
  ];

  const blockingIssueCount =
    unexplained +
    blockingValidation.length +
    platformLeak.length +
    authorityBearing +
    orphanEdges +
    integrity.targetErrors;

  let overallStatus: BlueprintReviewReadiness["overallStatus"] = "READY_FOR_HUMAN_BLUEPRINT_REVIEW";
  if (blockingIssueCount > 0) overallStatus = "BLOCKED";
  else if (blueprint.unresolvedDecisions.some((d) => d.blocking)) overallStatus = "NEEDS_DECISION";

  return {
    overallStatus,
    sections,
    blockingIssueCount,
    unexplainedProvenance: unexplained,
    platformRoleLeakage: platformLeak.length,
    authorityBearingItems: authorityBearing,
    orphanGraphEdges: orphanEdges,
    contentHash: blueprint.metadata.contentHash,
    compilerVersion: blueprint.metadata.compilerVersion,
  };
}

export function buildReviewSummary(readiness: BlueprintReviewReadiness, blueprint: EnterpriseBlueprintDraft) {
  return {
    readiness: readiness.overallStatus,
    blockingIssues: readiness.blockingIssueCount,
    recommendations: readiness.sections.flatMap((s) => s.recommendations),
    unresolvedDecisions: blueprint.unresolvedDecisions.length,
    provenanceCoverage: `${blueprint.provenanceSummary.recordCount} records, ${blueprint.provenanceSummary.unexplainedCount} unexplained`,
    scenario: blueprint.scenarioProfile,
    compilerVersion: blueprint.metadata.compilerVersion,
    contentHash: blueprint.metadata.contentHash,
    previewOnly: true,
  };
}

export function compositionInputFromBlueprintScenario(
  blueprint: EnterpriseBlueprintDraft,
  primaryIndustry: string,
  specialistDomains?: string[],
): HybridCompositionInput {
  return {
    primaryIndustry,
    specialistDomains,
    scaleProfile: buildScaleProfile(blueprint.scenarioProfile.scalePreset as TenantScalePreset),
    topologies: [blueprint.scenarioProfile.topology as OrganizationalTopologyKey],
    organizationalOverlays: blueprint.scenarioProfile.overlays ? [...blueprint.scenarioProfile.overlays] : undefined,
    organizationSignals: { approval_complexity: "medium" },
  };
}
