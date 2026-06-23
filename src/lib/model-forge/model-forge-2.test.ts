import assert from "node:assert/strict";
import {
  listSpecialistDomains,
  listDomainPacks,
  validateDomainPack,
  composeDomainPack,
  compareDomainPacks,
  DEPARTMENT_ARCHETYPE_CATALOG,
  ENTITY_PACK_CATALOG,
  INTEGRATION_PACK_CATALOG,
  COMPLIANCE_OVERLAY_CATALOG,
  buildOperatingGraph,
  validateOperatingGraph,
  filterGraph,
  compareOperatingModelVariants,
  OPERATING_MODEL_VARIANTS,
  composeEnterpriseModel,
  buildScaleProfile,
  MODEL_FORGE_BOUNDARY,
  listWorkPersonas,
  listWorkflowTemplates,
} from "./index";
import {
  adaptLegacySectorToArchetype,
  adaptErpModuleToCapability,
} from "@/lib/tenant-composition/legacy-adapters";

assert.equal(MODEL_FORGE_BOUNDARY.targetedRefoundationExecuted, true);
assert.equal(MODEL_FORGE_BOUNDARY.broadMoveExecuted, false);

const specialists = listSpecialistDomains();
assert.ok(specialists.length >= 45, `expected >=45 specialists, got ${specialists.length}`);
assert.equal(new Set(specialists.map((d) => d.key)).size, specialists.length);

for (const pack of listDomainPacks()) {
  assert.equal(pack.grantsPermissions, false);
  assert.equal(pack.provisionsTenant, false);
  const v = validateDomainPack(pack);
  assert.equal(v.valid, true, `${pack.key}: ${v.errors.join(", ")}`);
}

const composed = composeDomainPack("esports_operations_pack");
assert.ok(composed);
assert.equal(composed!.advisory, true);

const packDiff = compareDomainPacks("bookkeeping_office_pack", "esports_operations_pack");
assert.ok(packDiff && packDiff.addedPersonas.length > 0);

for (const d of DEPARTMENT_ARCHETYPE_CATALOG) {
  assert.equal(d.grantsPermissions, false);
}
assert.ok(DEPARTMENT_ARCHETYPE_CATALOG.length >= 28);

for (const e of ENTITY_PACK_CATALOG) {
  assert.ok(e.coreEntityKeys.length > 0 || e.specialistEntityKeys.length > 0);
}

for (const i of INTEGRATION_PACK_CATALOG) {
  assert.equal(i.createsIdentity, false);
  if (i.key === "nafath" || i.key === "gosi") {
    assert.equal(i.availabilityStatus, "REQUIRES_PROVIDER_APPROVAL");
  }
}

for (const c of COMPLIANCE_OVERLAY_CATALOG) {
  assert.equal(c.grantsAuthority, false);
  assert.equal(c.certificationClaim, false);
  assert.ok(c.description.toLowerCase().includes("advisory") || c.operationalConcern.length > 0);
}

const input = {
  primaryIndustry: "technology_and_saas",
  specialistDomains: ["gaming_and_esports", "esports_organization"],
  scaleProfile: buildScaleProfile("GROWING_ORGANIZATION"),
  topologies: ["PRODUCT_TEAMS" as const],
  organizationSignals: { approval_complexity: "medium" },
};

const draft = composeEnterpriseModel(input);
const graphA = buildOperatingGraph(draft, "OPERATING_MODEL", input.specialistDomains);
const graphB = buildOperatingGraph(draft, "OPERATING_MODEL", input.specialistDomains);
assert.equal(graphA.nodes.length, graphB.nodes.length);
assert.equal(graphA.edges.length, graphB.edges.length);

const nodeIds = new Set(graphA.nodes.map((n) => n.id));
assert.equal(nodeIds.size, graphA.nodes.length);
for (const e of graphA.edges) {
  assert.ok(nodeIds.has(e.source) && nodeIds.has(e.target));
}

const filtered = filterGraph(graphA, new Set(["WORK_PERSONA"]));
assert.ok(filtered.nodes.every((n) => n.type === "WORK_PERSONA"));

const findings = validateOperatingGraph(graphA);
assert.ok(findings.every((f) => f.severity !== "BLOCKING_DRAFT_ERROR" || f.code !== "PLATFORM_ROLE_LEAKAGE"));

const scenario = compareOperatingModelVariants(input, "MICRO", "ENTERPRISE");
assert.equal(scenario.deterministic, true);
assert.ok(scenario.diffs.some((d) => d.change !== "unchanged" || d.category === "composition"));

const topoScenario = compareOperatingModelVariants(
  { ...input, topologies: ["DEPARTMENTAL_HIERARCHY"] },
  "DEPARTMENTAL",
  "OUTCOME_POD",
);
assert.ok(topoScenario.diffs.length > 0);

for (const p of listWorkPersonas()) {
  assert.equal(p.grantsPermissions, false);
}
for (const w of listWorkflowTemplates()) {
  assert.ok(w.states.length > 0);
}

const sector = adaptLegacySectorToArchetype("logistics");
assert.equal(sector.grantsAuthority, false);
assert.equal(sector.mapped, true);

const unmapped = adaptLegacySectorToArchetype("unknown_sector_xyz");
assert.equal(unmapped.mapped, false);

const erp = adaptErpModuleToCapability("crm");
assert.equal(erp.value, "crm");

assert.ok(OPERATING_MODEL_VARIANTS.length >= 10);

console.log("model-forge-2: PASS");
