import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import type { User } from "@supabase/supabase-js";

import {
  pickHighestInternalCrowRole,
  resolveAuthoritativeClientRole,
  resolveAuthoritativePlatformRole,
} from "@/lib/auth/authority-boundaries";
import { canAccessPlatformPath } from "@/lib/auth/permissions";
import { getCrowAuth, isPlatformConsoleRole, type CrowRole } from "@/lib/auth/roles";
import { routes } from "@/lib/routes";

function mockUser(metadata: { crow_role?: string; tenant_slugs?: string[] }): User {
  return {
    id: "test-user-id",
    email: "operator@example.com",
    app_metadata: metadata,
    user_metadata: {},
    aud: "authenticated",
    created_at: new Date(0).toISOString(),
  } as User;
}

function hasProcrowPortalAccess(role: CrowRole | null): boolean {
  return Boolean(
    role && isPlatformConsoleRole(role) && canAccessPlatformPath(role, routes.admin.overview)
  );
}

function procrowDestinationForAuthoritativeRole(
  internalRoles: readonly ("PLATFORM_ADMIN" | "IMPLEMENTER")[],
  metadataRole: CrowRole | null,
  clientEvidence = { submittedRequestCount: 0, activeOrganizationMembershipCount: 0 }
): string | null {
  const platformRole = resolveAuthoritativePlatformRole(internalRoles, metadataRole);
  const clientRole = resolveAuthoritativeClientRole(clientEvidence, metadataRole);
  const role = platformRole ?? clientRole;
  if (!role || !hasProcrowPortalAccess(role)) return null;
  return routes.admin.overview;
}

test("access page resolves authoritative Crow auth before gateway snapshot", () => {
  const accessPage = readFileSync(join(process.cwd(), "src/app/access/page.tsx"), "utf8");
  assert(accessPage.includes("resolveAuthoritativeCrowAuthContext"));
  assert(!accessPage.includes("buildCrowAccessGatewaySnapshot(getSessionUser())"));
});

test("PLATFORM_ADMIN receives ProCrow card targeting /admin/overview", () => {
  const destination = procrowDestinationForAuthoritativeRole(["PLATFORM_ADMIN"], "client", {
    submittedRequestCount: 1,
    activeOrganizationMembershipCount: 0,
  });
  assert.equal(destination, routes.admin.overview);
});

test("dual-role owner receives ProCrow card from PLATFORM_ADMIN resolution", () => {
  assert.equal(pickHighestInternalCrowRole(["PLATFORM_ADMIN", "IMPLEMENTER"]), "platform_admin");
  const destination = procrowDestinationForAuthoritativeRole(
    ["PLATFORM_ADMIN", "IMPLEMENTER"],
    "client",
    { submittedRequestCount: 1, activeOrganizationMembershipCount: 0 }
  );
  assert.equal(destination, routes.admin.overview);
});

test("IMPLEMENTER-only does not resolve as platform_admin", () => {
  assert.equal(resolveAuthoritativePlatformRole(["IMPLEMENTER"], null), "implementer");
  assert.notEqual(resolveAuthoritativePlatformRole(["IMPLEMENTER"], null), "platform_admin");
});

test("metadata-only platform_admin does not produce ProCrow card authority", () => {
  assert.equal(resolveAuthoritativePlatformRole([], "platform_admin"), null);
  const user = mockUser({ crow_role: "platform_admin" });
  assert.equal(hasProcrowPortalAccess(getCrowAuth(user).role), true);
  assert.equal(
    procrowDestinationForAuthoritativeRole([], "platform_admin"),
    null
  );
});

test("client owner without PLATFORM_ADMIN does not receive ProCrow card", () => {
  const destination = procrowDestinationForAuthoritativeRole([], "client", {
    submittedRequestCount: 1,
    activeOrganizationMembershipCount: 0,
  });
  assert.equal(destination, null);
});

test("role-neutral account without internal roles does not receive ProCrow card", () => {
  assert.equal(resolveAuthoritativePlatformRole([], null), null);
  assert.equal(procrowDestinationForAuthoritativeRole([], null), null);
});

test("tenant member metadata alone does not grant ProCrow card", () => {
  const role = resolveAuthoritativePlatformRole([], "tenant_admin");
  assert.equal(role, null);
  assert.equal(hasProcrowPortalAccess("tenant_admin"), false);
});

test("email in session is not used for access-card authority", () => {
  const service = readFileSync(
    join(process.cwd(), "src/lib/services/portal-access.service.ts"),
    "utf8"
  );
  assert(!service.includes("PROCROW_OWNER_ADMIN_EMAIL"));
  assert(!service.includes("primaryEmail"));
});

test("ProCrow card destination is an implemented route", () => {
  const overviewPage = readFileSync(
    join(process.cwd(), "src/app/admin/overview/page.tsx"),
    "utf8"
  );
  assert(overviewPage.length > 0);
  assert(!existsSync(join(process.cwd(), "src/app/admin/users/page.tsx")));
  assert(!existsSync(join(process.cwd(), "src/app/admin/roles/page.tsx")));
});

function existsSync(path: string): boolean {
  try {
    readFileSync(path);
    return true;
  } catch {
    return false;
  }
}

console.log("PASS — PROCROW ACCESS CARD GATEWAY TESTS");
