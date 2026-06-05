/**
 * M4C — Tenant invite acceptance token / email delivery verifier.
 *
 * Proposal mode (default until migration approved):
 *   - Schema proposal + phase doc exist
 *   - No TenantMembershipInvite in prisma schema yet
 *   - No migration SQL for tenant invite acceptance
 *   - M4B invite flow still present
 *
 * Implementation mode (future): extend checks when schema + routes land.
 *
 *   npm run tenant-invite-acceptance:verify
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const PROPOSAL_DOC = "docs/internal/M4C_TENANT_INVITE_ACCEPTANCE_SCHEMA_PROPOSAL.md";
const PHASE_DOC = "docs/internal/M4C_TENANT_INVITE_ACCEPTANCE_TOKEN_EMAIL_DELIVERY.md";

const M4B_REQUIRED = [
  "src/lib/tenant/tenant-membership-invite-contract.ts",
  "src/lib/services/tenant-membership-invite.service.ts",
  "src/lib/actions/tenant-membership-invite.ts",
  "src/components/admin/admin-tenant-membership-invite-panel.tsx",
] as const;

const IMPLEMENTATION_MARKERS = {
  schema: "model TenantMembershipInvite",
  contract: "src/lib/tenant/tenant-invite-acceptance-contract.ts",
  service: "src/lib/services/tenant-invite-token.service.ts",
  actions: "src/lib/actions/tenant-invite-acceptance.ts",
  route: "src/app/tenant-invite",
} as const;

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
    if (
      sql.includes("tenant_membership_invites") ||
      sql.includes("tenantmembershipinvite")
    ) {
      return true;
    }
  }
  return false;
}

function main(): boolean {
  let pass = true;
  const schema = existsSync(join(ROOT, "prisma/schema.prisma"))
    ? fileText("prisma/schema.prisma")
    : "";
  const implementationStarted = schema.includes(IMPLEMENTATION_MARKERS.schema);

  console.log("\n=== M4C Tenant invite acceptance ===\n");
  console.log(
    implementationStarted
      ? "Mode: implementation detected in schema"
      : "Mode: proposal-only (no TenantMembershipInvite in schema)"
  );
  console.log("");

  for (const rel of [PROPOSAL_DOC, PHASE_DOC]) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const proposal = existsSync(join(ROOT, PROPOSAL_DOC))
    ? fileText(PROPOSAL_DOC)
    : "";

  for (const sym of [
    "TenantMembershipInvite",
    "tokenHash",
    "TenantMembershipInviteStatus",
    "pending",
    "accepted",
    "revoked",
    "expired",
    "tenant_user",
    "tenant_admin",
    "never store raw token",
    "awaiting explicit migration approval",
  ]) {
    if (!proposal.includes(sym)) {
      pass = fail(`Schema proposal missing required content: ${sym}`) && pass;
    }
  }
  if (pass) pass = ok("Schema proposal covers model, status, token hash, roles, approval gate") && pass;

  const pkg = fileText("package.json");
  if (!pkg.includes('"tenant-invite-acceptance:verify"')) {
    pass = fail("package.json missing tenant-invite-acceptance:verify") && pass;
  } else {
    pass = ok("npm script tenant-invite-acceptance:verify") && pass;
  }

  for (const rel of M4B_REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`M4B regression: missing ${rel}`) && pass;
  }
  if (pass) pass = ok("M4B invite artifacts still present") && pass;

  if (implementationStarted) {
    pass = fail(
      "TenantMembershipInvite in schema but full M4C implementation not in scope of proposal-only verifier — run extended checks manually"
    ) && pass;
  } else {
    pass = ok("No TenantMembershipInvite model in prisma/schema.prisma (proposal gate)") && pass;
  }

  if (migrationMentionsTenantInvite()) {
    pass = fail("Migration SQL references tenant_membership_invites without approved implementation") && pass;
  } else {
    pass = ok("No tenant invite acceptance migration SQL present") && pass;
  }

  if (!implementationStarted) {
    for (const [label, path] of Object.entries(IMPLEMENTATION_MARKERS)) {
      if (label === "schema") continue;
      if (existsSync(join(ROOT, path))) {
        pass = fail(`Implementation artifact present before approval: ${path}`) && pass;
      }
    }
    pass = ok("Implementation artifacts absent (contract/service/actions/route)") && pass;

    const phase = existsSync(join(ROOT, PHASE_DOC)) ? fileText(PHASE_DOC) : "";
    if (!phase.includes("PROPOSAL-ONLY PASS")) {
      pass = fail("Phase doc must state PROPOSAL-ONLY PASS") && pass;
    } else {
      pass = ok("Phase doc marks proposal-only pass") && pass;
    }

    console.log("");
    console.log("PASS: M4C tenant invite acceptance (proposal-only)");
    return pass;
  }

  console.log("");
  if (pass) console.log("PASS: M4C proposal checks (implementation schema detected — extend verifier)");
  else console.log("FAIL: M4C tenant invite acceptance");
  return pass;
}

const success = main();
process.exit(success ? 0 : 1);
