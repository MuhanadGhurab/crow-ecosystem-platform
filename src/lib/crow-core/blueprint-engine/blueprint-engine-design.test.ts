import assert from "node:assert/strict";
import { compileEnterpriseBlueprintPreview } from "@/lib/model-forge/blueprint/blueprint-compiler";
import { clearProvenanceRegistry } from "@/lib/model-forge/provenance/provenance-engine";
import {
  authorizeBlueprintAction,
  resolveActorClass,
  evaluateTransition,
  buildPersistentSnapshot,
  verifyServerContentHash,
  rejectClientProvidedHash,
  supersedeOnNewVersion,
  projectClientBlueprint,
  projectClientBlueprintDeterministic,
  classifySectionVisibility,
  createMemoryBlueprintStores,
  BlueprintEngineError,
} from "./index";

const input = {
  primaryIndustry: "technology_and_saas",
  specialistDomains: ["gaming_and_esports"],
  scalePreset: "GROWING_ORGANIZATION" as const,
  topology: "PRODUCT_TEAMS" as const,
  organizationalOverlays: ["mid_market"],
};

clearProvenanceRegistry();
const draft = compileEnterpriseBlueprintPreview(input);
const snapshot = buildPersistentSnapshot(draft);
const serverHash = verifyServerContentHash(snapshot);

// --- Hash integrity ---
assert.equal(serverHash, snapshot.contentHash);
assert.equal(buildPersistentSnapshot(draft).contentHash, snapshot.contentHash);
const mutated = { ...snapshot, contentJson: { ...snapshot.contentJson, executiveSummary: "changed" } };
assert.throws(() => verifyServerContentHash(mutated), (e: unknown) => e instanceof BlueprintEngineError && e.code === "BLUEPRINT_CONTENT_HASH_MISMATCH");
assert.throws(() => rejectClientProvidedHash("deadbeef", serverHash), (e: unknown) => e instanceof BlueprintEngineError);
rejectClientProvidedHash(serverHash, serverHash);

// --- Lifecycle transitions ---
const baseCtx = {
  currentState: "SHARED_WITH_CLIENT" as const,
  action: "CLIENT_ACCEPT" as const,
  exactVersionNumber: 1,
  currentVersionNumber: 1,
  sharedVersionNumber: 1,
  reviewCycleState: "OPEN" as const,
  contentHash: snapshot.contentHash,
  actionContentHash: snapshot.contentHash,
  requestOwnerPlatformAccountId: "owner_1",
  actorPlatformAccountId: "owner_1",
  expectedRowVersion: 1,
  actualRowVersion: 1,
};
const accept = evaluateTransition(baseCtx);
assert.equal(accept.nextState, "CLIENT_ACCEPTED");

assert.throws(
  () => evaluateTransition({ ...baseCtx, currentVersionNumber: 2 }),
  (e: unknown) => e instanceof BlueprintEngineError && e.code === "BLUEPRINT_VERSION_STALE",
);
assert.throws(
  () => evaluateTransition({ ...baseCtx, actionContentHash: "wrong" }),
  (e: unknown) => e instanceof BlueprintEngineError && e.code === "BLUEPRINT_CONTENT_HASH_MISMATCH",
);
assert.throws(
  () => evaluateTransition({ ...baseCtx, currentState: "PLATFORM_FINALIZED" }),
  (e: unknown) => e instanceof BlueprintEngineError && e.code === "BLUEPRINT_ALREADY_FINALIZED",
);
assert.throws(
  () => evaluateTransition({ ...baseCtx, action: "PLATFORM_FINALIZE" }),
  (e: unknown) => e instanceof BlueprintEngineError && e.code === "BLUEPRINT_INVALID_TRANSITION",
);

const finalize = evaluateTransition({
  ...baseCtx,
  currentState: "CLIENT_ACCEPTED",
  action: "PLATFORM_FINALIZE",
  reviewCycleState: "ACCEPTED",
});
assert.equal(finalize.nextState, "PLATFORM_FINALIZED");

// --- Authority ---
assert.equal(authorizeBlueprintAction("PLATFORM_ADMIN", "SHARE_WITH_CLIENT").allowed, true);
assert.equal(authorizeBlueprintAction("IMPLEMENTER", "SHARE_WITH_CLIENT").allowed, false);
assert.equal(authorizeBlueprintAction("REQUEST_OWNER", "CLIENT_ACCEPT").allowed, true);
assert.equal(authorizeBlueprintAction("REQUEST_OWNER", "PLATFORM_FINALIZE").allowed, false);
assert.equal(resolveActorClass({ isPlatformAdmin: false, isImplementer: false, isRequestOwner: false, isTenantMember: true, metadataClaimsPlatformAdmin: false, emailOnlyMatch: false }), "TENANT_MEMBER");
assert.equal(resolveActorClass({ isPlatformAdmin: false, isImplementer: false, isRequestOwner: false, isTenantMember: false, metadataClaimsPlatformAdmin: true, emailOnlyMatch: false }), "UNRELATED_CLIENT");
assert.equal(resolveActorClass({ isPlatformAdmin: false, isImplementer: false, isRequestOwner: false, isTenantMember: false, metadataClaimsPlatformAdmin: false, emailOnlyMatch: true }), "UNRELATED_CLIENT");

// --- Projection ---
const projection = projectClientBlueprint(snapshot, 1);
const projection2 = projectClientBlueprint(snapshot, 1);
assert.equal(projectClientBlueprintDeterministic(projection, projection2), true);
assert.ok(projection.contentHashPrefix.length >= 8);
assert.equal(classifySectionVisibility("executiveSummary"), "CLIENT_VISIBLE");
assert.equal(classifySectionVisibility("warnings"), "INTERNAL_ONLY");
const serialized = JSON.stringify(projection);
assert.ok(!serialized.includes("operatorNotes"));
assert.ok(!serialized.includes("@"));

const supersede = supersedeOnNewVersion({ previousSharedVersion: 1, newVersionNumber: 2 });
assert.equal(supersede.invalidatesAcceptance, true);
assert.equal(supersede.closesReviewCycles, true);

async function runImmutabilityTests() {
  const stores = createMemoryBlueprintStores();
  const root = await stores.blueprintRepo.createRoot({ requestId: "req_1", createdByPlatformAccountId: "admin_1" });
  const v1 = await stores.versionRepo.createImmutableVersion({
    blueprintId: root.id,
    versionNumber: 1,
    snapshot,
    createdByPlatformAccountId: "admin_1",
  });
  assert.equal(v1.immutable, true);
  assert.throws(() => stores.versionRepo.updateVersionUnsupported());
  assert.throws(() => stores.versionRepo.deleteVersionUnsupported());
  await assert.rejects(() =>
    stores.versionRepo.createImmutableVersion({
      blueprintId: root.id,
      versionNumber: 1,
      snapshot,
      createdByPlatformAccountId: "admin_1",
    }),
  );

  await stores.blueprintRepo.transitionLifecycle(root.id, 1, { currentVersionNumber: 1 });
  await assert.rejects(() => stores.blueprintRepo.transitionLifecycle(root.id, 1, { lifecycleState: "SHARED_WITH_CLIENT" }));

  const cycle = await stores.reviewRepo.openReviewCycle({
    blueprintId: root.id,
    blueprintVersionId: v1.id,
    versionNumber: 1,
    cycleNumber: 1,
    audience: "CLIENT",
  });
  await stores.reviewRepo.recordAction({
    reviewCycleId: cycle.id,
    blueprintVersionId: v1.id,
    actorPlatformAccountId: "owner_1",
    actorClass: "REQUEST_OWNER",
    action: "CLIENT_ACCEPT",
    reason: null,
    contentHashAtAction: snapshot.contentHash,
  });
  await stores.auditRepo.append({
    blueprintId: root.id,
    blueprintVersionId: v1.id,
    eventType: "BLUEPRINT_CLIENT_ACCEPTED",
    actorClass: "REQUEST_OWNER",
    actorPlatformAccountId: "owner_1",
    payload: { versionNumber: 1, contentHashPrefix: snapshot.contentHash.slice(0, 16) },
  });
  const audits = await stores.auditRepo.listByBlueprint(root.id);
  assert.equal(audits.length, 1);
  assert.ok(!JSON.stringify(audits[0]!.payload).includes("@"));
}

void runImmutabilityTests().then(() => {
  console.log("blueprint-engine-design: OK");
});
