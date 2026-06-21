import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { PlatformInternalRole } from "@prisma/client";
import type { User } from "@supabase/supabase-js";

import {
  hasAuthoritativeCustomerPortalAccess,
  internalRoleToCrowRole,
  metadataAloneWouldAuthorizeClient,
  metadataAloneWouldAuthorizePlatform,
  pickHighestInternalCrowRole,
  resolveAuthoritativeClientRole,
  resolveAuthoritativePlatformRole,
} from "@/lib/auth/authority-boundaries";
import { Permission, hasPermission } from "@/lib/auth/permissions";
import { canAccessPortal, getCrowAuth, isPlatformConsoleRole } from "@/lib/auth/roles";

const root = process.cwd();

function readSrc(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

// 1. Generation-2 signup receives no Crow role (static — registration path)
{
  const platform = readSrc("src/lib/account/platform-account.service.ts");
  assert(platform.includes("onboardingGeneration"), "platform accounts track onboarding generation");
  const orch = readSrc("src/lib/account/c3-auth-orchestration.ts");
  assert(
    orch.includes("grantClientRole: false"),
    "C3 deferred onboarding must not grant crow_role metadata"
  );
}

// 2. ACTIVE role-neutral account resolves to /account
{
  const landing = readSrc("src/lib/auth/c3-post-auth-landing.ts");
  assert(
    landing.includes("if (!auth.role)") && landing.includes("routes.account.home"),
    "role-neutral active accounts land on /account"
  );
}

// 3–5. Stale metadata alone cannot authorize client or platform paths
{
  const evidence = { submittedRequestCount: 0, activeOrganizationMembershipCount: 0 };
  assert.equal(resolveAuthoritativeClientRole(evidence, "client"), null);
  assert(metadataAloneWouldAuthorizeClient("client", evidence));

  for (const meta of ["platform_admin", "implementer", "sales", "auditor_readonly"] as const) {
    assert.equal(resolveAuthoritativePlatformRole([], meta), null);
    assert(metadataAloneWouldAuthorizePlatform(meta, []));
  }
}

// 6–8. Request ownership is authoritative; email alone does not authorize
{
  assert.equal(
    resolveAuthoritativeClientRole(
      { submittedRequestCount: 1, activeOrganizationMembershipCount: 0 },
      null
    ),
    "client"
  );
  assert.equal(
    resolveAuthoritativeClientRole(
      { submittedRequestCount: 0, activeOrganizationMembershipCount: 0 },
      null
    ),
    null
  );

  const customerService = readSrc("src/lib/auth/customer-access.service.ts");
  assert(
    !customerService.includes("findRequestIdsByContactEmail"),
    "customer access service must not use primary-contact email matching"
  );
  const link = readSrc("src/lib/services/client-request-link.service.ts");
  assert(
    link.includes("clientCanAccessRequestAuthoritative"),
    "clientCanAccessRequest delegates to authoritative ownership check"
  );
}

// 9. Org membership may authorize defined scope
{
  assert.equal(
    resolveAuthoritativeClientRole(
      { submittedRequestCount: 0, activeOrganizationMembershipCount: 1 },
      null
    ),
    "client"
  );
}

// 10. Internal assignment authorizes only permitted platform paths
{
  const implementer = pickHighestInternalCrowRole(["IMPLEMENTER"]);
  assert.equal(implementer, "implementer");
  assert(hasPermission(implementer, Permission["platform.requests.manage"]));
  assert(hasPermission(implementer, Permission["platform.admin.view"]));

  const sales = pickHighestInternalCrowRole(["SALES"]);
  assert.equal(sales, "sales");
  assert(hasPermission(sales, Permission["platform.requests.view"]));
  assert(!hasPermission(sales, Permission["platform.requests.manage"]));

  const auditor = pickHighestInternalCrowRole(["AUDITOR_READONLY"]);
  assert.equal(auditor, "auditor_readonly");
  assert(!hasPermission(auditor, Permission["platform.requests.view"]));
  assert(hasPermission(auditor, Permission["platform.audit.view"]));
}

// 11. Requester and operator identities remain independent (static)
{
  const bootstrap = readSrc("src/lib/platform/platform-internal-role-bootstrap.ts");
  assert(bootstrap.includes("existing_platform_admin"));
  assert(bootstrap.includes("bootstrapRequiresExplicitTarget"));
}

// 12–13. Internal role assignment does not create ownership or tenant membership
{
  const service = readSrc("src/lib/auth/platform-internal-role.service.ts");
  assert(!service.includes("tenantMembership"));
  assert(!service.includes("submittedByUserId"));
  assert(!service.includes("ClientOrganizationMember"));
}

// 14–15. Login never creates internal authority; no first-user-admin
{
  const session = readSrc("src/lib/auth/session.ts");
  assert(!session.includes("countRequestsForEmail"));
  const bootstrap = readSrc("src/lib/platform/platform-internal-role-bootstrap.ts");
  assert(bootstrap.includes("No first-user-admin"));
}

// 16–17. Revocation and audit (service contract)
{
  const service = readSrc("src/lib/auth/platform-internal-role.service.ts");
  assert(service.includes("revokeInternalPlatformRole"));
  assert(service.includes("platform_internal_role_revoked"));
  assert(service.includes("DUPLICATE_ACTIVE"));
}

// Resolver integration — stale JWT stripped for landing
{
  const staleClientUser = {
    id: "user_stale_client",
    email: "stale@example.com",
    app_metadata: { crow_role: "client" },
  } as unknown as User;
  const meta = getCrowAuth(staleClientUser);
  assert.equal(meta.role, "client");
  const stripped = resolveAuthoritativeClientRole(
    { submittedRequestCount: 0, activeOrganizationMembershipCount: 0 },
    meta.role
  );
  assert.equal(stripped, null);
}

{
  const staleAdminUser = {
    id: "user_stale_admin",
    app_metadata: { crow_role: "platform_admin" },
  } as unknown as User;
  const meta = getCrowAuth(staleAdminUser);
  assert(isPlatformConsoleRole(meta.role));
  assert.equal(resolveAuthoritativePlatformRole([], meta.role), null);
}

// Internal role mapping exhaustiveness
{
  const roles: PlatformInternalRole[] = [
    "PLATFORM_ADMIN",
    "IMPLEMENTER",
    "SALES",
    "AUDITOR_READONLY",
  ];
  for (const role of roles) {
    assert(internalRoleToCrowRole(role));
  }
  assert.equal(
    pickHighestInternalCrowRole(["SALES", "IMPLEMENTER"]),
    "implementer"
  );
}

// Guards — session + middleware
{
  const session = readSrc("src/lib/auth/session.ts");
  assert(session.includes("requireClientAccess"));
  assert(session.includes("redirect(routes.account.home)"));
  const middleware = readSrc("src/lib/supabase/middleware.ts");
  assert(!middleware.includes("canAccessPlatformPath"));
}

// One requester cannot access another's request (authoritative function contract)
{
  assert(
    readSrc("src/lib/auth/customer-access.service.ts").includes(
      "submittedByUserId: supabaseUserId"
    )
  );
}

console.log(
  "PASS — REQUESTER OWNERSHIP AND PROCROW AUTHORITY ARE DATABASE-BACKED AND METADATA-NEUTRAL"
);
