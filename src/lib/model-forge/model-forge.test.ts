import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  listSpecialistDomains,
  WORK_PERSONA_CATALOG,
  WORKFLOW_TEMPLATE_CATALOG,
  HYBRID_REFERENCE_MODELS,
  composeEnterpriseModel,
  buildScaleProfile,
  suggestPersonaMerge,
  suggestPersonaSplit,
  scaleWorkflowTemplate,
  validateAuthorityProposal,
  createAuthorityProposal,
  validateSpecialistDomainReferences,
  validateWorkflowTemplate,
  MODEL_FORGE_BOUNDARY,
} from "./index";
import { FORBIDDEN_PLATFORM_BUNDLE_KEYS } from "@/lib/tenant-composition/permission-bundle-catalog";

assert.equal(MODEL_FORGE_BOUNDARY.broadMoveExecuted, false);
assert.equal(MODEL_FORGE_BOUNDARY.destructiveChangesExecuted, false);
assert.equal(MODEL_FORGE_BOUNDARY.targetedRefoundationExecuted, true);

const specialistKeys = listSpecialistDomains().map((d) => d.key);
assert.equal(new Set(specialistKeys).size, specialistKeys.length, "specialist domain keys unique");
assert.ok(specialistKeys.length >= 25, "minimum specialist domains");

const domainRefErrors = validateSpecialistDomainReferences();
assert.equal(domainRefErrors.length, 0, domainRefErrors.join("; "));

for (const p of WORK_PERSONA_CATALOG) {
  assert.equal(p.grantsPermissions, false);
  assert.equal(p.authoritative, false);
  assert.ok(p.sourceRoleArchetypeKeys.length > 0, `${p.key} traceable to role archetypes`);
}

for (const wf of WORKFLOW_TEMPLATE_CATALOG) {
  const v = validateWorkflowTemplate(wf.key);
  assert.equal(v.valid, true, `${wf.key}: ${v.errors.join(", ")}`);
}

const input = {
  primaryIndustry: "technology_and_saas",
  secondaryIndustries: ["media_and_creative"],
  specialistDomains: ["gaming_and_esports", "digital_content_publishing"],
  scaleProfile: buildScaleProfile("GROWING_ORGANIZATION"),
  topologies: ["PRODUCT_TEAMS" as const],
  organizationSignals: { approval_complexity: "medium" },
};

const draftA = composeEnterpriseModel(input);
const draftB = composeEnterpriseModel(input);
assert.deepEqual(draftA.compositionKey, draftB.compositionKey);
assert.equal(draftA.workPersonas.length, draftB.workPersonas.length);

const micro = buildScaleProfile("MICRO");
const enterprise = buildScaleProfile("ENTERPRISE");
const microDraft = composeEnterpriseModel({ ...input, scaleProfile: micro });
const entDraft = composeEnterpriseModel({ ...input, scaleProfile: enterprise });
assert.ok(entDraft.workPersonas.length >= microDraft.workPersonas.length, "enterprise has more personas");

const mergeMicro = suggestPersonaMerge(["workflow_coordinator", "resource_allocator"], micro);
assert.ok(mergeMicro.length > 0);
const splitEnt = suggestPersonaSplit("workflow_coordinator", enterprise);
assert.ok(splitEnt.length > 0);

const scaled = scaleWorkflowTemplate("vendor_qualification", enterprise);
assert.ok(scaled && scaled.approvalDepth >= 5);

for (const proposal of draftA.authorityProposals) {
  assert.equal(proposal.authoritative, false);
  assert.equal(proposal.requiresApproval, true);
  assert.equal(validateAuthorityProposal(proposal).length, 0);
  for (const b of proposal.recommendedPermissionBundleKeys) {
    assert.ok(!FORBIDDEN_PLATFORM_BUNDLE_KEYS.includes(b as (typeof FORBIDDEN_PLATFORM_BUNDLE_KEYS)[number]));
  }
}

assert.ok(draftA.dna.provenance.length > 0, "Model DNA explainable");
assert.ok(HYBRID_REFERENCE_MODELS.length >= 10);

const forgePage = readFileSync(join(process.cwd(), "src/app/admin/model-forge/page.tsx"), "utf8");
assert.ok(forgePage.includes('auth.role !== "platform_admin"'));
assert.ok(!forgePage.includes("prisma"));

const globals = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
assert.ok(globals.includes("prefers-reduced-motion"));

console.log("model-forge: PASS");
