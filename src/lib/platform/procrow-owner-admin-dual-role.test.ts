import assert from "node:assert/strict";
import test from "node:test";

import {
  includesActiveInternalRole,
  internalRoleToCrowRole,
  pickHighestInternalCrowRole,
  resolveAuthoritativePlatformRole,
} from "@/lib/auth/authority-boundaries";
import { Permission, hasPermission } from "@/lib/auth/permissions";

test("PLATFORM_ADMIN alone does not include IMPLEMENTER assignment", () => {
  const roles = ["PLATFORM_ADMIN"] as const;
  assert.equal(includesActiveInternalRole(roles, "PLATFORM_ADMIN"), true);
  assert.equal(includesActiveInternalRole(roles, "IMPLEMENTER"), false);
  assert.equal(pickHighestInternalCrowRole(roles), "platform_admin");
});

test("IMPLEMENTER alone does not include PLATFORM_ADMIN assignment", () => {
  const roles = ["IMPLEMENTER"] as const;
  assert.equal(includesActiveInternalRole(roles, "IMPLEMENTER"), true);
  assert.equal(includesActiveInternalRole(roles, "PLATFORM_ADMIN"), false);
  assert.equal(pickHighestInternalCrowRole(roles), "implementer");
});

test("dual-role account resolves both assignments independently", () => {
  const roles = ["PLATFORM_ADMIN", "IMPLEMENTER"] as const;
  assert.equal(includesActiveInternalRole(roles, "PLATFORM_ADMIN"), true);
  assert.equal(includesActiveInternalRole(roles, "IMPLEMENTER"), true);
  assert.equal(pickHighestInternalCrowRole(roles), "platform_admin");
});

test("revoking one role would preserve the other (simulated)", () => {
  const dual = ["PLATFORM_ADMIN", "IMPLEMENTER"] as const;
  const afterPaRevoke = dual.filter((r) => r !== "PLATFORM_ADMIN");
  assert.deepEqual(afterPaRevoke, ["IMPLEMENTER"]);
  assert.equal(includesActiveInternalRole(afterPaRevoke, "IMPLEMENTER"), true);

  const afterImplRevoke = dual.filter((r) => r !== "IMPLEMENTER");
  assert.deepEqual(afterImplRevoke, ["PLATFORM_ADMIN"]);
  assert.equal(includesActiveInternalRole(afterImplRevoke, "PLATFORM_ADMIN"), true);
});

test("no implicit role inheritance via crow_role metadata", () => {
  assert.equal(resolveAuthoritativePlatformRole([], "platform_admin"), null);
  assert.equal(resolveAuthoritativePlatformRole([], "implementer"), null);
});

test("platform admin-only permission surface requires PLATFORM_ADMIN crow role", () => {
  const paOnly = pickHighestInternalCrowRole(["PLATFORM_ADMIN"]);
  const implOnly = pickHighestInternalCrowRole(["IMPLEMENTER"]);
  assert.equal(paOnly, "platform_admin");
  assert.equal(implOnly, "implementer");
  assert.equal(internalRoleToCrowRole("PLATFORM_ADMIN"), "platform_admin");
  assert.equal(internalRoleToCrowRole("IMPLEMENTER"), "implementer");
  assert(hasPermission(paOnly, Permission["account.profile.read.self"]));
  assert(!hasPermission(implOnly, Permission["account.profile.read.self"]));
});

test("internal roles do not imply client ownership without evidence", () => {
  const roles = ["PLATFORM_ADMIN", "IMPLEMENTER"] as const;
  assert.equal(pickHighestInternalCrowRole(roles), "platform_admin");
  assert.equal(includesActiveInternalRole(roles, "PLATFORM_ADMIN"), true);
});
