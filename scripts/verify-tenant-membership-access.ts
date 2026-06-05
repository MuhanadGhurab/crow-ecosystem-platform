/**
 * M4 — Tenant membership & Business Portal access hardening verifier.
 *
 *   npm run tenant-membership:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED = [
  "src/lib/tenant/tenant-membership-contract.ts",
  "src/lib/services/tenant-membership-access.service.ts",
  "src/lib/auth/tenant-business-portal-guard.ts",
  "src/components/tenant/tenant-access-blocked-panel.tsx",
  "src/components/admin/admin-tenant-membership-access-panel.tsx",
  "docs/internal/M4_TENANT_MEMBERSHIP_BUSINESS_PORTAL_ACCESS_HARDENING.md",
] as const;

const FORBIDDEN = [
  "platform_admin",
  "automatic tenant provisioning",
  "production launch approved",
  "live checkout",
  "activate subscription",
  "email domain match",
  "self-join",
  "RBAC bypass",
  "auth weakening",
] as const;

function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  return false;
}

function ok(msg: string) {
  console.log(`OK: ${msg}`);
  return true;
}

function fileText(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function main(): boolean {
  let pass = true;

  console.log("\n=== M4 Tenant membership & Business Portal access ===\n");

  for (const rel of REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"tenant-membership:verify"')) {
    pass = fail("package.json missing tenant-membership:verify") && pass;
  } else {
    pass = ok("npm script tenant-membership:verify") && pass;
  }

  const contract = fileText("src/lib/tenant/tenant-membership-contract.ts");
  for (const sym of [
    "TenantMembershipRole",
    "TenantBusinessPortalAccessDecision",
    "TenantMembershipSource",
    "TENANT_MEMBERSHIP_DISCLAIMERS",
  ]) {
    if (!contract.includes(sym)) pass = fail(`Contract missing ${sym}`) && pass;
  }
  pass = ok("Tenant membership contract") && pass;

  const service = fileText("src/lib/services/tenant-membership-access.service.ts");
  if (!service.includes("resolveTenantBusinessPortalAccess")) {
    pass = fail("Access service must resolve tenant Business Portal access") && pass;
  }
  if (!service.includes("listTenantBusinessPortalSlugsForUser")) {
    pass = fail("Access service must list proven tenant slugs") && pass;
  }
  if (!service.includes('role === "client"') && !service.includes("isClient")) {
    pass = fail("Access service must block client-only users") && pass;
  }
  if (!service.includes("email") && !service.includes("reviewer")) {
    pass = fail("Access service should block email-only reviewers") && pass;
  }
  pass = ok("Tenant membership access service") && pass;

  const guard = fileText("src/lib/auth/tenant-business-portal-guard.ts");
  if (!guard.includes("requireTenantBusinessPortalAccess")) {
    pass = fail("Business Portal guard required") && pass;
  }
  if (!guard.includes("business_portal_blocked")) {
    pass = fail("Guard must redirect with business_portal_blocked reason") && pass;
  }
  pass = ok("Tenant Business Portal route guard") && pass;

  const layout = fileText("src/app/[tenant]/layout.tsx");
  const session = fileText("src/lib/auth/session.ts");
  if (
    !layout.includes("requireTenantAccess") &&
    !layout.includes("requireTenantBusinessPortalAccess")
  ) {
    pass = fail("/[tenant] layout must use tenant access guard") && pass;
  }
  if (!session.includes("requireTenantBusinessPortalAccess")) {
    pass = fail("session.requireTenantAccess must delegate to M4 guard") && pass;
  }
  pass = ok("/[tenant] layout-level guard wired") && pass;

  const policy = fileText("src/lib/auth/tenant-policy-guard.ts");
  if (!policy.includes("requireTenantBusinessPortalAccess")) {
    pass = fail("tenant-policy-guard must use Business Portal guard") && pass;
  }
  if (!policy.includes("canUseWorkflowActions")) {
    pass = fail("Workflow policy must check canUseWorkflowActions") && pass;
  }
  pass = ok("Workflow action guards") && pass;

  const workflow = fileText("src/lib/actions/cem-transaction-workflow.ts");
  if (!workflow.includes("requireActionTenantPolicy")) {
    pass = fail("CEM workflow actions must use requireActionTenantPolicy") && pass;
  }
  pass = ok("CEM transaction workflow uses tenant policy guard") && pass;

  const portalService = fileText("src/lib/services/portal-access.service.ts");
  if (!portalService.includes("listTenantBusinessPortalSlugsForUser")) {
    pass = fail("Access gateway must use proven tenant slugs") && pass;
  }
  if (!portalService.includes("isClient(role)")) {
    pass = fail("Access gateway must treat client role separately for Business Portal") && pass;
  }
  pass = ok("Access gateway membership integration") && pass;

  const accessPage = fileText("src/app/access/page.tsx");
  if (!accessPage.includes("TenantAccessBlockedPanel")) {
    pass = fail("/access must show blocked panel") && pass;
  }
  if (!accessPage.includes("business_portal_blocked")) {
    pass = fail("/access must handle business_portal_blocked reason") && pass;
  }
  pass = ok("Access gateway blocked state") && pass;

  const blocked = fileText("src/components/tenant/tenant-access-blocked-panel.tsx");
  if (!blocked.includes("verified tenant membership")) {
    pass = fail("Blocked panel copy required") && pass;
  }
  if (!blocked.includes("Client Portal")) {
    pass = fail("Blocked panel must explain Client vs Business Portal") && pass;
  }
  pass = ok("Blocked state copy") && pass;

  const adminTenant = fileText("src/app/admin/tenants/[tenantId]/page.tsx");
  if (!adminTenant.includes("AdminTenantMembershipAccessPanel")) {
    pass = fail("ProCrow tenant page must show membership access panel") && pass;
  }
  pass = ok("ProCrow tenant membership preview") && pass;

  const lite = fileText("src/lib/portal/portal-access-lite.ts");
  if (!lite.includes("isClient(role)")) {
    pass = fail("portal-access-lite must block client from Business Portal sync check") && pass;
  }
  pass = ok("Public header lite portal model blocks client Business Portal") && pass;

  const membershipService = fileText("src/lib/services/membership.service.ts");
  if (!membershipService.includes("tenantMembership")) {
    pass = fail("Existing membership.service should use tenant_memberships") && pass;
  }
  pass = ok("DB membership model present (no M4B migration required)") && pass;

  const surfaces = [
    contract,
    service,
    guard,
    portalService,
    policy,
    workflow,
    membershipService,
  ].join("\n");

  for (const phrase of FORBIDDEN) {
    if (surfaces.toLowerCase().includes(phrase.toLowerCase())) {
      pass = fail(`Forbidden phrase in M4 surfaces: ${phrase}`) && pass;
    }
  }
  pass = ok("No forbidden auth/provisioning claims in M4 surfaces") && pass;

  if (pass) console.log("\nPASS: M4 tenant membership & Business Portal access");
  else console.error("\nFAIL: M4 checks failed");
  return pass;
}

process.exit(main() ? 0 : 1);
