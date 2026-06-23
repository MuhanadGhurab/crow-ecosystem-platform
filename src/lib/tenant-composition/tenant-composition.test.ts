import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CAPABILITY_CATALOG,
  CYBERCROW_POLICY_PACK_CATALOG,
  INDUSTRY_ARCHETYPE_CATALOG,
  JOB_DEFINITION_SAMPLES,
  JOB_FAMILY_CATALOG,
  ORGANIZATIONAL_OVERLAY_CATALOG,
  PERMISSION_BUNDLE_CATALOG,
  FORBIDDEN_PLATFORM_BUNDLE_KEYS,
  REFERENCE_COMPOSITIONS,
  ROLE_ARCHETYPE_CATALOG,
  SAREA_EXPERIENCE_PATTERN_CATALOG,
  WORKFLOW_PATTERN_CATALOG,
  applyOverlays,
  composeTenantBlueprint,
  detectConflicts,
  listCapabilities,
  mapDiscoverySignalsToCompositionInput,
  resolveCatalogKey,
  validateCapabilityDependencies,
} from "./index";

function assertUniqueKeys<T extends { key: string }>(label: string, items: readonly T[]) {
  const keys = items.map((i) => i.key);
  assert.equal(new Set(keys).size, keys.length, `${label} keys must be unique`);
}

assertUniqueKeys("capabilities", CAPABILITY_CATALOG);
assertUniqueKeys("workflows", WORKFLOW_PATTERN_CATALOG);
assertUniqueKeys("roles", ROLE_ARCHETYPE_CATALOG);
assertUniqueKeys("job families", JOB_FAMILY_CATALOG);
assertUniqueKeys("permission bundles", PERMISSION_BUNDLE_CATALOG);
assertUniqueKeys("sarea patterns", SAREA_EXPERIENCE_PATTERN_CATALOG);
assertUniqueKeys("cybercrow packs", CYBERCROW_POLICY_PACK_CATALOG);
assertUniqueKeys("industry archetypes", INDUSTRY_ARCHETYPE_CATALOG);
assertUniqueKeys("overlays", ORGANIZATIONAL_OVERLAY_CATALOG);

for (const cap of CAPABILITY_CATALOG) {
  for (const wf of cap.typicalWorkflowPatternKeys) {
    assert(resolveCatalogKey("workflow", wf), `capability ${cap.key} references workflow ${wf}`);
  }
  for (const role of cap.recommendedRoleArchetypeKeys) {
    assert(resolveCatalogKey("role", role), `capability ${cap.key} references role ${role}`);
  }
}

for (const wf of WORKFLOW_PATTERN_CATALOG) {
  for (const pb of wf.requiredPermissionBundleKeys) {
    assert(resolveCatalogKey("permissionBundle", pb), `workflow ${wf.key} references bundle ${pb}`);
  }
}

for (const archetype of INDUSTRY_ARCHETYPE_CATALOG) {
  assert(resolveCatalogKey("industryArchetype", archetype.key));
  for (const cap of archetype.recommendedCapabilityKeys) {
    assert(resolveCatalogKey("capability", cap), `archetype ${archetype.key} capability ${cap}`);
  }
}

const depTest = validateCapabilityDependencies(["dispatch", "fleet"]);
assert.equal(depTest.valid, true);

const unknown = validateCapabilityDependencies(["not_a_real_capability"]);
assert.equal(unknown.valid, false);
assert.ok(unknown.unknownKeys.includes("not_a_real_capability"));

const conflicts = detectConflicts([]);
assert.deepEqual(conflicts, []);

const draftA = composeTenantBlueprint({
  industryArchetype: "logistics_and_fleet",
  overlays: ["multi_branch"],
  organizationSignals: { approval_complexity: "medium" },
});
const draftB = composeTenantBlueprint({
  industryArchetype: "logistics_and_fleet",
  overlays: ["multi_branch"],
  organizationSignals: { approval_complexity: "medium" },
});
assert.deepEqual(draftA, draftB, "composition must be deterministic");

const overlayApplied = applyOverlays(draftA, ["enterprise", "field_workforce"]);
assert.ok(overlayApplied.recommendedCapabilities.includes("field_service") || overlayApplied.recommendedCapabilities.includes("dispatch"));

for (const job of JOB_DEFINITION_SAMPLES) {
  assert.equal(job.grantsPermissions, false, "job definitions must not grant permissions");
}

for (const role of ROLE_ARCHETYPE_CATALOG) {
  assert.equal(role.grantsPermissions, false, "role archetypes must not grant permissions");
}

for (const sarea of SAREA_EXPERIENCE_PATTERN_CATALOG) {
  assert.equal(sarea.grantsPermissions, false, "SAREA patterns must not grant permissions");
}

for (const bundle of PERMISSION_BUNDLE_CATALOG) {
  assert.equal(bundle.platformAuthority, false, "bundles must be tenant-scoped");
  assert.ok(!FORBIDDEN_PLATFORM_BUNDLE_KEYS.includes(bundle.key as (typeof FORBIDDEN_PLATFORM_BUNDLE_KEYS)[number]));
}

const industryDraft = composeTenantBlueprint({ industryArchetype: "retail_and_commerce" });
assert.ok(
  !industryDraft.recommendedPermissionBundles.some((k) =>
    (FORBIDDEN_PLATFORM_BUNDLE_KEYS as readonly string[]).includes(k),
  ),
  "industry must not recommend platform bundles",
);

for (const pack of CYBERCROW_POLICY_PACK_CATALOG) {
  assert.ok(!pack.displayName.toLowerCase().includes("user creation"));
}

assert.equal(REFERENCE_COMPOSITIONS.length, 6);
for (const ref of REFERENCE_COMPOSITIONS) {
  assert.ok(ref.snapshot.recommendedDepartments.length > 0, `${ref.key} has departments`);
  assert.ok(ref.snapshot.recommendedCapabilities.length > 0, `${ref.key} has capabilities`);
}

const discoveryMapped = mapDiscoverySignalsToCompositionInput({
  industry: "logistics",
  organization_size: "enterprise",
  field_workforce: true,
  branch_count: 4,
});
assert.equal(discoveryMapped.industryArchetype, "logistics_and_fleet");
assert.ok(discoveryMapped.overlays.includes("enterprise"));
assert.ok(discoveryMapped.overlays.includes("field_workforce"));
assert.ok(discoveryMapped.overlays.includes("multi_branch"));

assert.ok(listCapabilities().length >= 60, "capability catalog minimum breadth");

const studioPage = readFileSync(
  join(process.cwd(), "src/app/admin/tenant-studio/page.tsx"),
  "utf8",
);
assert.ok(studioPage.includes('auth.role !== "platform_admin"'), "Tenant Studio requires PLATFORM_ADMIN");
assert.ok(!studioPage.includes("prisma"), "Tenant Studio must not mutate hosted data");

console.log("tenant-composition: PASS");
