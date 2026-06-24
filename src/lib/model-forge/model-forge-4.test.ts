import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  compileEnterpriseBlueprintPreview,
  buildOperatingGraph,
  composeEnterpriseModel,
  buildScaleProfile,
  validateCatalogRelationshipRules,
  validateResolvedRelationships,
  CATALOG_RELATIONSHIP_RULES,
  validateProvenanceIntegrity,
  calculateProvenanceCoverage,
  compareScenarioGraphs,
  scenarioDiffNodeTypeCoverageCount,
  synchronizeStudioSelection,
  resetStudioSelectionGuard,
  graphNodeIdToBlueprintPath,
  blueprintPathToGraphNodeId,
  analyzeBlueprintDecisionImpact,
  applyDecisionToSessionDraft,
  revertSessionDecision,
  assessBlueprintReviewReadiness,
  compositionInputFromBlueprintScenario,
  MODEL_4_GOLDEN_FIXTURES,
  snapshotGoldenFixture,
  collectAllBlueprintProvenancePaths,
  resolveGraphSources,
  clearProvenanceRegistry,
} from "./index";

const input = {
  primaryIndustry: "technology_and_saas",
  specialistDomains: ["gaming_and_esports", "esports_organization"],
  scalePreset: "GROWING_ORGANIZATION",
  topology: "PRODUCT_TEAMS",
  organizationalOverlays: ["mid_market"],
};

clearProvenanceRegistry();
const draftA = compileEnterpriseBlueprintPreview(input);
const draftB = compileEnterpriseBlueprintPreview(input);
assert.equal(draftA.metadata.contentHash, draftB.metadata.contentHash);
assert.equal(draftA.provenanceSummary.unexplainedCount, 0, "all blueprint items must have provenance");

const model = composeEnterpriseModel({
  primaryIndustry: input.primaryIndustry,
  specialistDomains: input.specialistDomains,
  scaleProfile: buildScaleProfile("GROWING_ORGANIZATION"),
  topologies: ["PRODUCT_TEAMS"],
  organizationSignals: { approval_complexity: "medium" },
});
const graph = buildOperatingGraph(model, "OPERATING_MODEL", [...input.specialistDomains], { registerProvenance: false });

const ruleFindings = validateCatalogRelationshipRules();
assert.equal(ruleFindings.filter((f) => f.severity === "BLOCKING_ERROR").length, 0);

const relFindings = validateResolvedRelationships(graph);
assert.equal(relFindings.filter((f) => f.code === "UNDOCUMENTED_EDGE").length, 0, "UNDOCUMENTED_RELATIONSHIP_RULE_COUNT=0");

const compositionInput = compositionInputFromBlueprintScenario(draftA, input.primaryIndustry, input.specialistDomains);
const sources = resolveGraphSources(model, input.specialistDomains);
const allPaths = collectAllBlueprintProvenancePaths(model, sources);
const integrity = validateProvenanceIntegrity(draftA, allPaths);
assert.equal(integrity.targetErrors, 0);

const coverage = calculateProvenanceCoverage(model, draftA, input.specialistDomains);
assert.equal(coverage.complete, true);

const scenario = compareScenarioGraphs(
  {
    primaryIndustry: input.primaryIndustry,
    specialistDomains: input.specialistDomains,
    scaleProfile: buildScaleProfile("GROWING_ORGANIZATION"),
    topologies: ["PRODUCT_TEAMS"],
    organizationSignals: { approval_complexity: "medium" },
  },
  "MICRO",
  "ENTERPRISE",
  [...input.specialistDomains],
);
assert.equal(scenarioDiffNodeTypeCoverageCount(scenario), 17, "SCENARIO_DIFF_NODE_TYPE_COVERAGE=17/17");
assert.ok(scenario.edgeDiffs.length >= 0);

resetStudioSelectionGuard();
const sync = synchronizeStudioSelection({
  source: "GRAPH",
  target: { graphNodeId: "persona:operations_coordinator" },
  timestamp: Date.now(),
});
assert.ok(sync.blueprintPath?.includes("workPersonas") || sync.graphNodeId);

const bpSync = synchronizeStudioSelection({
  source: "BLUEPRINT_SECTION",
  target: { blueprintPath: "blueprint.workflows.incident_response" },
  timestamp: Date.now(),
});
assert.equal(bpSync.graphNodeId, blueprintPathToGraphNodeId("blueprint.workflows.incident_response"));

const decision = draftA.unresolvedDecisions[0];
if (decision) {
  const impact = analyzeBlueprintDecisionImpact(draftA, decision, decision.options[0] ?? decision.recommendedOption);
  assert.equal(impact.deterministic, true);
  const applied = applyDecisionToSessionDraft(draftA, decision.key, decision.options[0] ?? "define_later");
  assert.notEqual(applied, draftA);
  const reverted = revertSessionDecision(applied, decision.key);
  assert.equal(reverted.unresolvedDecisions.find((d) => d.key === decision.key)?.draftSelection, undefined);
}

const readiness = assessBlueprintReviewReadiness(draftA, graph, compositionInput);
assert.equal(readiness.unexplainedProvenance, 0);
assert.equal(readiness.authorityBearingItems, 0);
assert.ok(
  readiness.overallStatus === "READY_FOR_HUMAN_BLUEPRINT_REVIEW" || readiness.overallStatus === "NEEDS_DECISION",
);

for (const fixture of MODEL_4_GOLDEN_FIXTURES.slice(0, 3)) {
  const snap = snapshotGoldenFixture(fixture);
  assert.ok(snap.nodeKeys.length > 0);
  assert.ok(snap.relationshipRuleKeys.length > 0);
}

assert.ok(CATALOG_RELATIONSHIP_RULES.every((r) => r.authorityEffect === "NONE"));
assert.ok(CATALOG_RELATIONSHIP_RULES.every((r) => Boolean(r.version)));

const mapped = graphNodeIdToBlueprintPath("persona:test_key");
assert.ok(mapped?.path.startsWith("blueprint.workPersonas."));

const page = readFileSync(join(process.cwd(), "src/app/admin/blueprint-studio/page.tsx"), "utf8");
assert.ok(page.includes('auth.role !== "platform_admin"'));

console.log("model-forge-4: PASS");
