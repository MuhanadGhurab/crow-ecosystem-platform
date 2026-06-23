import assert from "node:assert/strict";

import {
  isMetadataOnlyClientCrowRole,
  isPrivilegedMetadataCrowRole,
} from "./metadata-crow-role";

assert.equal(isPrivilegedMetadataCrowRole("client"), false);
assert.equal(isPrivilegedMetadataCrowRole("admin"), true);
assert.equal(isPrivilegedMetadataCrowRole("platform_admin"), true);
assert.equal(isPrivilegedMetadataCrowRole("none"), false);
assert.equal(isMetadataOnlyClientCrowRole("client"), true);

console.log("PASS — retained requester metadata crow_role classification");
