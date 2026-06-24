import type { HybridCompositionInput } from "../types";
import { composeEnterpriseModel } from "../composition/hybrid-composition";
import { buildOperatingGraph } from "../graph/operating-graph";
import { compileEnterpriseBlueprintPreview } from "../blueprint/blueprint-compiler";
import { calculateProvenanceCoverage } from "../provenance/provenance-coverage";
import { assessBlueprintReviewReadiness, compositionInputFromBlueprintScenario } from "../blueprint/blueprint-review-readiness";
import { compareScenarioGraphs } from "../variants/scenario-graph-diff";
import { hashBlueprintContent } from "../blueprint/blueprint-hash";

export type GoldenReferenceFixture = {
  key: string;
  displayName: string;
  input: HybridCompositionInput;
};

export type GoldenSemanticSnapshot = {
  fixtureKey: string;
  nodeKeys: string[];
  relationshipRuleKeys: string[];
  blueprintSectionKeys: string[];
  contentHash: string;
  provenanceTargetCount: number;
  scenarioDiffCategories: string[];
  reviewReadinessStatus: string;
};

export const MODEL_4_GOLDEN_FIXTURES: readonly GoldenReferenceFixture[] = [
  {
    key: "gaming_live_services_studio",
    displayName: "Gaming live services studio",
    input: {
      primaryIndustry: "technology_and_saas",
      specialistDomains: ["gaming_and_esports", "digital_content_publishing"],
      organizationalOverlays: ["mid_market"],
      scaleProfile: { preset: "GROWING_ORGANIZATION", dimensions: { workforceScale: 5, branchScale: 2, workflowVolume: 7, workflowComplexity: 6, approvalDepth: 4, externalActorVolume: 8, assetIntensity: 3, projectIntensity: 5, dataSensitivity: 6, regulatoryIntensity: 3, geographicDistribution: 5, automationMaturity: 6, fieldWorkforceIntensity: 2 }, displayName: "Growing", description: "Growing" },
      topologies: ["PRODUCT_TEAMS"],
      organizationSignals: { approval_complexity: "medium" },
    },
  },
  {
    key: "legal_professional_services_firm",
    displayName: "Legal professional services firm",
    input: {
      primaryIndustry: "professional_services",
      specialistDomains: ["legal_services"],
      organizationalOverlays: ["enterprise"],
      topologies: ["DEPARTMENTAL_HIERARCHY"],
      organizationSignals: { approval_complexity: "high" },
    },
  },
  {
    key: "construction_accommodation_operator",
    displayName: "Construction accommodation operator",
    input: {
      primaryIndustry: "construction_and_epc",
      specialistDomains: ["equipment_rental", "maintenance_services"],
      organizationalOverlays: ["field_workforce"],
      topologies: ["MISSION_TEAMS"],
      organizationSignals: { field_workforce: true },
    },
  },
  {
    key: "accounting_and_bookkeeping_office",
    displayName: "Accounting and bookkeeping office",
    input: {
      primaryIndustry: "professional_services",
      specialistDomains: ["accounting_and_bookkeeping"],
      topologies: ["DEPARTMENTAL_HIERARCHY"],
      organizationSignals: { approval_complexity: "medium" },
    },
  },
  {
    key: "film_and_production_company",
    displayName: "Film and production company",
    input: {
      primaryIndustry: "media_and_creative",
      specialistDomains: ["film_and_video_production"],
      topologies: ["PROJECT_BASED"],
      organizationSignals: { approval_complexity: "medium" },
    },
  },
  {
    key: "research_laboratory_operator",
    displayName: "Research laboratory operator",
    input: {
      primaryIndustry: "healthcare_and_life_sciences",
      specialistDomains: ["research_and_laboratory"],
      organizationalOverlays: ["highly_regulated"],
      topologies: ["DEPARTMENTAL_HIERARCHY"],
      organizationSignals: { approval_complexity: "high" },
    },
  },
  {
    key: "equipment_rental_field_service",
    displayName: "Equipment rental field service",
    input: {
      primaryIndustry: "construction_and_epc",
      specialistDomains: ["equipment_rental"],
      organizationalOverlays: ["field_workforce"],
      topologies: ["MISSION_TEAMS"],
      organizationSignals: { field_workforce: true },
    },
  },
  {
    key: "hospitality_events_membership_group",
    displayName: "Hospitality events membership group",
    input: {
      primaryIndustry: "hospitality_and_tourism",
      specialistDomains: ["membership_and_clubs", "events_and_experiences"],
      organizationalOverlays: ["customer_membership"],
      topologies: ["OUTCOME_PODS"],
      organizationSignals: { approval_complexity: "low" },
    },
  },
] as const;

export function runGoldenFixture(fixture: GoldenReferenceFixture): {
  model: ReturnType<typeof composeEnterpriseModel>;
  graph: ReturnType<typeof buildOperatingGraph>;
  blueprint: ReturnType<typeof compileEnterpriseBlueprintPreview>;
  provenance: ReturnType<typeof calculateProvenanceCoverage>;
  scenario: ReturnType<typeof compareScenarioGraphs>;
  readiness: ReturnType<typeof assessBlueprintReviewReadiness>;
} {
  const model = composeEnterpriseModel(fixture.input);
  const specialistKeys = [...(fixture.input.specialistDomains ?? [])];
  const graph = buildOperatingGraph(model, "OPERATING_MODEL", specialistKeys, { registerProvenance: true });
  const blueprint = compileEnterpriseBlueprintPreview({
    primaryIndustry: fixture.input.primaryIndustry,
    specialistDomains: specialistKeys,
    scalePreset: fixture.input.scaleProfile?.preset,
    topology: fixture.input.topologies?.[0],
    organizationalOverlays: fixture.input.organizationalOverlays ? [...fixture.input.organizationalOverlays] : undefined,
  });
  const provenance = calculateProvenanceCoverage(model, blueprint, specialistKeys);
  const scenario = compareScenarioGraphs(fixture.input, "MICRO", "ENTERPRISE", specialistKeys);
  const readiness = assessBlueprintReviewReadiness(
    blueprint,
    graph,
    compositionInputFromBlueprintScenario(blueprint, fixture.input.primaryIndustry, specialistKeys),
  );
  return { model, graph, blueprint, provenance, scenario, readiness };
}

export function snapshotGoldenFixture(fixture: GoldenReferenceFixture): GoldenSemanticSnapshot {
  const { graph, blueprint, scenario, readiness } = runGoldenFixture(fixture);
  const ruleKeys = [...new Set(graph.edges.map((e) => e.provenance.replace(/^rule:/, "")))].sort();
  return {
    fixtureKey: fixture.key,
    nodeKeys: graph.nodes.map((n) => `${n.type}:${n.key}`).sort(),
    relationshipRuleKeys: ruleKeys,
    blueprintSectionKeys: [
      "organization", "departments", "capabilities", "entities", "workPersonas", "workflows",
      "outcomes", "kpis", "evidence", "authorityProposals", "sareaExperiences", "cyberCrowPolicies",
      "integrations", "complianceOverlays",
    ],
    contentHash: blueprint.metadata.contentHash,
    provenanceTargetCount: blueprint.provenanceSummary.recordCount,
    scenarioDiffCategories: [...new Set(scenario.nodeDiffs.map((d) => d.nodeType))].sort(),
    reviewReadinessStatus: readiness.overallStatus,
  };
}

export function hashGoldenSnapshot(snapshot: GoldenSemanticSnapshot): string {
  return hashBlueprintContent(snapshot);
}
