import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  compileEnterpriseBlueprintPreview,
  compareEnterpriseBlueprintDrafts,
  validateEnterpriseBlueprintDraft,
  importBlueprintPreviewJson,
  exportBlueprintJson,
  buildOperatingGraph,
  analyzeOperatingGraphCompleteness,
  auditGraphNodeTypeCoverage,
  composeEnterpriseModel,
  buildScaleProfile,
  hashBlueprintContent,
  containsSecretShapedField,
  containsDatabaseIds,
  listAllProvenanceRecords,
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

assert.equal(draftA.metadata.advisory, true);
assert.equal(draftA.metadata.authoritative, false);
assert.equal(draftA.metadata.persistenceState, "EPHEMERAL_PREVIEW");
assert.equal(draftA.metadata.contentHash, draftB.metadata.contentHash);
assert.equal(draftA.metadata.sourceModelHash, draftB.metadata.sourceModelHash);

const hashAgain = hashBlueprintContent({ ...draftA, metadata: { ...draftA.metadata, generatedAtDisplay: undefined } });
assert.equal(hashAgain, draftA.metadata.contentHash);

assert.equal(validateEnterpriseBlueprintDraft(draftA).valid, true);

for (const p of draftA.workPersonas.items) {
  assert.equal((p as { grantsPermissions: boolean }).grantsPermissions, false);
}

const secrets = containsSecretShapedField(draftA);
assert.equal(secrets.length, 0);

const dbIds = containsDatabaseIds(draftA);
assert.equal(dbIds.length, 0);

const exported = exportBlueprintJson(draftA);
const imported = importBlueprintPreviewJson(exported.content);
assert.equal(imported.ok, true);

const model = composeEnterpriseModel({
  primaryIndustry: input.primaryIndustry,
  specialistDomains: input.specialistDomains,
  scaleProfile: buildScaleProfile("GROWING_ORGANIZATION"),
  topologies: ["PRODUCT_TEAMS"],
  organizationSignals: { approval_complexity: "medium" },
});

const graph = buildOperatingGraph(model, "OPERATING_MODEL", [...input.specialistDomains]);
const nodeIds = graph.nodes.map((n) => n.id);
assert.equal(new Set(nodeIds).size, nodeIds.length);

for (const e of graph.edges) {
  assert.ok(nodeIds.includes(e.source) && nodeIds.includes(e.target), `orphan edge ${e.id}`);
}

const coverage = auditGraphNodeTypeCoverage(graph, model, [...input.specialistDomains]);
const populatedTypes = Object.values(coverage).filter((c) => c.populated).length;
assert.ok(populatedTypes >= 12, `expected >=12 populated node types, got ${populatedTypes}`);

const completeness = analyzeOperatingGraphCompleteness(graph, model, [...input.specialistDomains]);
assert.ok(completeness.layers.length >= 10);

const micro = compileEnterpriseBlueprintPreview({ ...input, scalePreset: "MICRO" });
const enterprise = compileEnterpriseBlueprintPreview({ ...input, scalePreset: "ENTERPRISE" });
const diff = compareEnterpriseBlueprintDrafts(micro, enterprise);
assert.ok(diff.some((d) => d.change !== "UNCHANGED"));

assert.ok(listAllProvenanceRecords().length >= 1);

const page = readFileSync(join(process.cwd(), "src/app/admin/blueprint-studio/page.tsx"), "utf8");
assert.ok(page.includes("requireBlueprintPlatformAdmin") || page.includes('auth.role !== "platform_admin"'));

const forgePage = readFileSync(join(process.cwd(), "src/app/admin/model-forge/page.tsx"), "utf8");
assert.ok(forgePage.includes("platform_admin"));

console.log("model-forge-3: PASS");
