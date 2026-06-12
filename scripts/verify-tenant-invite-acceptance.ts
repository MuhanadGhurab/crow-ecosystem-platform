/**
 * M4C — Tenant invite acceptance token verifier.
 *
 *   npm run tenant-invite-acceptance:verify
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const PHASE_DOC = "docs/internal/M4C_TENANT_INVITE_ACCEPTANCE_TOKEN_EMAIL_DELIVERY.md";
const PROPOSAL_DOC = "docs/internal/M4C_TENANT_INVITE_ACCEPTANCE_SCHEMA_PROPOSAL.md";

const IMPLEMENTATION_REQUIRED = [
  "src/lib/tenant/tenant-invite-acceptance-contract.ts",
  "src/lib/services/tenant-invite-token.service.ts",
  "src/lib/actions/tenant-invite-acceptance.ts",
  "src/components/tenant/tenant-invite-acceptance-panel.tsx",
  "src/app/tenant-invite/[token]/page.tsx",
] as const;

const M4B_REQUIRED = [
  "src/lib/tenant/tenant-membership-invite-contract.ts",
  "src/lib/services/tenant-membership-invite.service.ts",
  "src/lib/actions/tenant-membership-invite.ts",
  "src/components/admin/admin-tenant-membership-invite-panel.tsx",
] as const;

const FORBIDDEN = [
  "platform_admin",
  "email domain match",
  "email-domain auto-membership",
  "self-join",
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

function migrationMentionsTenantInvite(): boolean {
  const dir = join(ROOT, "prisma/migrations");
  if (!existsSync(dir)) return false;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const sqlPath = join(dir, entry.name, "migration.sql");
    if (!existsSync(sqlPath)) continue;
    const sql = readFileSync(sqlPath, "utf8").toLowerCase();
    if (sql.includes("tenant_membership_invites")) return true;
  }
  return false;
}

function main(): boolean {
  let pass = true;
  const schema = existsSync(join(ROOT, "prisma/schema.prisma"))
    ? fileText("prisma/schema.prisma")
    : "";

  console.log("\n=== M4C Tenant invite acceptance (implementation) ===\n");

  if (!schema.includes("model TenantMembershipInvite")) {
    pass = fail("prisma/schema.prisma missing TenantMembershipInvite") && pass;
  } else {
    pass = ok("TenantMembershipInvite model in schema") && pass;
  }

  for (const sym of [
    "TenantMembershipInviteStatus",
    "tokenHash",
    "membershipInvites",
    "pending",
    "accepted",
    "revoked",
    "expired",
  ]) {
    if (!schema.includes(sym)) pass = fail(`Schema missing ${sym}`) && pass;
  }

  if (!migrationMentionsTenantInvite()) {
    pass = fail("Missing migration SQL for tenant_membership_invites") && pass;
  } else {
    pass = ok("Migration SQL for tenant_membership_invites") && pass;
  }

  for (const rel of IMPLEMENTATION_REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const contract = fileText("src/lib/tenant/tenant-invite-acceptance-contract.ts");
  for (const sym of [
    "TenantInviteAcceptanceViewStatus",
    "TENANT_INVITE_ACCEPTANCE_DISCLAIMERS",
    "DEFAULT_TENANT_INVITE_EXPIRY_DAYS",
    "requires_sign_in",
    "email_mismatch",
    "ready_to_accept",
  ]) {
    if (!contract.includes(sym)) pass = fail(`Contract missing ${sym}`) && pass;
  }
  pass = ok("Tenant invite acceptance contract") && pass;

  const service = fileText("src/lib/services/tenant-invite-token.service.ts");
  if (!service.includes("createHash") || !service.includes("tokenHash")) {
    pass = fail("Token service must hash tokens (never store raw)") && pass;
  }
  if (!service.includes("createTenantInviteToken")) {
    pass = fail("Token service must create invites") && pass;
  }
  if (!service.includes("acceptTenantInviteByToken")) {
    pass = fail("Token service must accept invites") && pass;
  }
  if (!service.includes("revokeTenantInvite")) {
    pass = fail("Token service must revoke invites") && pass;
  }
  if (!service.includes("grantTenantAccess")) {
    pass = fail("Accept path must use grantTenantAccess") && pass;
  }
  if (service.includes('role === "platform_admin"')) {
    pass = fail("Token service must not assign platform_admin") && pass;
  }
  pass = ok("Tenant invite token service") && pass;

  const actions = fileText("src/lib/actions/tenant-invite-acceptance.ts");
  for (const sym of [
    "createTenantInviteTokenAction",
    "acceptTenantInviteAction",
    "revokeTenantInviteAction",
    "requireActionPlatformStaff",
    "requireActionTenantPolicy",
    "cem.users.invite",
  ]) {
    if (!actions.includes(sym)) pass = fail(`Actions missing ${sym}`) && pass;
  }
  pass = ok("Tenant invite acceptance actions") && pass;

  const panel = fileText("src/components/admin/admin-tenant-membership-invite-panel.tsx");
  if (!panel.includes("createTenantInviteTokenAction")) {
    pass = fail("Admin panel must create invite links") && pass;
  }
  if (!panel.includes("inviteUrl") || !panel.includes("Copy this link")) {
    pass = fail("Admin panel must show copy-link UI") && pass;
  }
  if (!panel.includes("revokeTenantInviteAction")) {
    pass = fail("Admin panel must support revoke") && pass;
  }
  pass = ok("ProCrow copy-link UI") && pass;

  const acceptPanel = fileText("src/components/tenant/tenant-invite-acceptance-panel.tsx");
  if (!acceptPanel.includes("loginWithNext") || !acceptPanel.includes("signupWithNext")) {
    pass = fail("Accept panel must preserve invite URL through auth") && pass;
  }
  pass = ok("Public accept panel") && pass;

  const routes = fileText("src/lib/routes.ts");
  if (!routes.includes("tenantInvite")) {
    pass = fail("routes.ts missing tenantInvite builder") && pass;
  } else {
    pass = ok("routes.tenantInvite") && pass;
  }

  for (const rel of M4B_REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`M4B regression: missing ${rel}`) && pass;
  }
  pass = ok("M4B invite artifacts still present") && pass;

  const combined = [
    service,
    actions,
    panel,
    acceptPanel,
    fileText("src/app/tenant-invite/[token]/page.tsx"),
  ].join("\n");
  for (const bad of FORBIDDEN) {
    if (combined.toLowerCase().includes(bad.toLowerCase())) {
      pass = fail(`Forbidden phrase in implementation: ${bad}`) && pass;
    }
  }
  pass = ok("No forbidden claims or roles in M4C surface") && pass;

  const pkg = fileText("package.json");
  if (!pkg.includes('"tenant-invite-acceptance:verify"')) {
    pass = fail("package.json missing tenant-invite-acceptance:verify") && pass;
  } else {
    pass = ok("npm script tenant-invite-acceptance:verify") && pass;
  }

  for (const rel of [PHASE_DOC, PROPOSAL_DOC]) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
  }

  const phase = existsSync(join(ROOT, PHASE_DOC)) ? fileText(PHASE_DOC) : "";
  if (!phase.includes("IMPLEMENTATION PASSED")) {
    pass = fail("Phase doc must state IMPLEMENTATION PASSED") && pass;
  } else {
    pass = ok("Phase doc marks implementation pass") && pass;
  }

  console.log("");
  if (pass) console.log("PASS: M4C tenant invite acceptance (implementation)");
  else console.log("FAIL: M4C tenant invite acceptance");
  return pass;
}

const success = main();
process.exit(success ? 0 : 1);
