import assert from "node:assert/strict";
import { BLUEPRINT_LIFECYCLE_SIDE_EFFECTS } from "./side-effect-policy";
import { resolveBlueprintProjectionSource } from "./legacy-projection.adapter";

assert.equal(BLUEPRINT_LIFECYCLE_SIDE_EFFECTS.tenantCreation, false);
assert.equal(BLUEPRINT_LIFECYCLE_SIDE_EFFECTS.membershipCreation, false);
assert.equal(BLUEPRINT_LIFECYCLE_SIDE_EFFECTS.permissionAssignment, false);
assert.equal(BLUEPRINT_LIFECYCLE_SIDE_EFFECTS.workflowCompilation, false);

assert.equal(
  resolveBlueprintProjectionSource({
    compilerVersion: "1.0",
    sourceModelHash: "abc",
    validationJson: {},
  } as Parameters<typeof resolveBlueprintProjectionSource>[0]),
  "CANONICAL_JSON",
);

assert.equal(
  resolveBlueprintProjectionSource({
    compilerVersion: null,
    sourceModelHash: null,
    validationJson: null,
  } as Parameters<typeof resolveBlueprintProjectionSource>[0]),
  "LEGACY_NORMALIZED",
);

console.log("blueprint-engine-1b-containment: OK");
