/**
 * M4B — Tenant membership invite / onboarding flow verifier.
 *
 *   npm run tenant-invite:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED = [
  "src/lib/tenant/tenant-membership-invite-contract.ts",
  "src/lib/services/tenant-membership-invite.service.ts",
  "src/lib/actions/tenant-membership-invite.ts",
  "src/components/admin/admin-tenant-membership-invite-panel.tsx",
  "docs/internal/M4B_TENANT_MEMBERSHIP_INVITE_ONBOARDING_FLOW.md",
] as const;

const FORBIDDEN_IN_IMPLEMENTATION = [
  "automatic tenant provisioning",
  "production launch approved",
  "live checkout",
  "activate subscription",
  "email domain match",
  "email-domain auto-membership",
  "self-join",
  "RBAC bypass",
  "auth weakening",
] as const;

const FALSE_EMAIL_CLAIMS = [
  "Invitation sent to",
  "email was sent",
  "we sent an email",
  "email has been sent",
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

  console.log("\n=== M4B Tenant membership invite / onboarding ===\n");

  for (const rel of REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"tenant-invite:verify"')) {
    pass = fail("package.json missing tenant-invite:verify") && pass;
  } else {
    pass = ok("npm script tenant-invite:verify") && pass;
  }

  const contract = fileText("src/lib/tenant/tenant-membership-invite-contract.ts");
  for (const sym of [
    "TenantInviteStatus",
    "TenantInviteRole",
    "TenantInviteSource",
    "TenantMembershipInviteDraft",
    "TenantMembershipInviteSnapshot",
    "TENANT_MEMBERSHIP_INVITE_DISCLAIMERS",
    "TENANT_INVITE_ROLE_ALLOWLIST",
  ]) {
    if (!contract.includes(sym)) pass = fail(`Contract missing ${sym}`) && pass;
  }
  if (!contract.includes("tenant_user") || !contract.includes("tenant_admin")) {
    pass = fail("Role allowlist must include tenant_user and tenant_admin") && pass;
  }
  pass = ok("Tenant membership invite contract") && pass;

  const service = fileText("src/lib/services/tenant-membership-invite.service.ts");
  if (!service.includes("buildTenantMembershipInviteSnapshot")) {
    pass = fail("Invite service must build snapshot") && pass;
  }
  if (!service.includes("createTenantMembershipInvite")) {
    pass = fail("Invite service must create invite/membership") && pass;
  }
  if (!service.includes("grantTenantAccess")) {
    pass = fail("Invite service must use existing grantTenantAccess helper") && pass;
  }
  if (!service.includes("lookupSupabaseUserByEmail")) {
    pass = fail("Invite service must lookup auth user by email") && pass;
  }
  if (!service.includes("tenant_membership_invite")) {
    pass = fail("Invite service should log platform notification audit") && pass;
  }
  if (service.includes('role === "platform_admin"') || service.includes("platform_admin,")) {
    pass = fail("Invite service must not assign platform_admin") && pass;
  }
  pass = ok("Tenant membership invite service") && pass;

  const action = fileText("src/lib/actions/tenant-membership-invite.ts");
  if (!action.includes("createTenantMembershipInviteAction")) {
    pass = fail("createTenantMembershipInviteAction required") && pass;
  }
  if (
    !action.includes("requireActionPlatformStaff") &&
    !action.includes("isPlatformStaff")
  ) {
    pass = fail("Invite action must guard platform staff path") && pass;
  }
  if (!action.includes("requireActionTenantPolicy")) {
    pass = fail("Invite action must support tenant_admin via tenant policy") && pass;
  }
  if (!action.includes("cem.users.invite")) {
    pass = fail("Tenant admin path must use cem.users.invite policy") && pass;
  }
  pass = ok("Guarded tenant membership invite action") && pass;

  const panel = fileText("src/components/admin/admin-tenant-membership-invite-panel.tsx");
  const workforce = fileText("src/lib/constants/crow-workforce-activation.ts");
  if (!panel.includes("Business Portal access only")) {
    pass = fail("Invite panel must state Business Portal only") && pass;
  }
  if (!panel.includes("inviteEmailConfigured")) {
    pass = fail("Invite panel must gate email UX on inviteEmailConfigured (M4D)") && pass;
  }
  if (
    !workforce.includes("emailUnconfiguredHint") ||
    !workforce.includes("emailConfiguredHint") ||
    !workforce.includes("copyLinkLabel")
  ) {
    pass = fail("Workforce copy must document email config + copy-link fallback (M4D)") && pass;
  }
  if (!panel.includes("tenant_user") || !panel.includes("tenant_admin")) {
    pass = fail("Invite panel role select required") && pass;
  }
  pass = ok("ProCrow tenant invite panel") && pass;

  const adminTenant = fileText("src/app/admin/tenants/[tenantId]/page.tsx");
  if (!adminTenant.includes("AdminTenantMembershipInvitePanel")) {
    pass = fail("ProCrow tenant page must include invite panel") && pass;
  }
  pass = ok("Admin tenant page wired") && pass;

  const membership = fileText("src/lib/services/membership.service.ts");
  if (!membership.includes("lookupSupabaseUserByEmail")) {
    pass = fail("membership.service must export lookupSupabaseUserByEmail") && pass;
  }
  if (!membership.includes("syncTenantSlugsMetadata") && !membership.includes("tenant_slugs")) {
    pass = fail("Membership grant must sync tenant_slugs metadata") && pass;
  }
  pass = ok("Metadata sync via existing membership helpers") && pass;

  const signup = fileText("src/app/signup/page.tsx");
  if (signup.toLowerCase().includes("domain") && signup.toLowerCase().includes("auto")) {
    pass = fail("/signup must not auto-join by email domain") && pass;
  }
  pass = ok("No signup domain auto-join surface") && pass;

  const implementationSurfaces = [service, action, panel, membership].join("\n").toLowerCase();

  for (const phrase of FORBIDDEN_IN_IMPLEMENTATION) {
    if (implementationSurfaces.includes(phrase.toLowerCase())) {
      pass = fail(`Forbidden phrase in M4B implementation: ${phrase}`) && pass;
    }
  }
  pass = ok("No forbidden provisioning/auth claims in invite implementation") && pass;

  const honestSurfaces = [service, action, panel, fileText("src/lib/actions/membership.ts")].join(
    "\n"
  );
  for (const phrase of FALSE_EMAIL_CLAIMS) {
    if (honestSurfaces.includes(phrase)) {
      pass = fail(`False email-sent claim: ${phrase}`) && pass;
    }
  }
  pass = ok("No false email-sent claims in invite surfaces") && pass;

  if (existsSync(join(ROOT, "docs/internal/M4B_TENANT_MEMBERSHIP_INVITE_SCHEMA_PROPOSAL.md"))) {
    pass = fail("M4B schema proposal should not exist when PATH A chosen") && pass;
  } else {
    pass = ok("PATH A — no schema proposal file (expected)") && pass;
  }

  if (pass) console.log("\nPASS: M4B tenant membership invite / onboarding");
  else console.error("\nFAIL: M4B checks failed");
  return pass;
}

process.exit(main() ? 0 : 1);
