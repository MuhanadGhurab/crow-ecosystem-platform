import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const plan = readFileSync(join(process.cwd(), "scripts/identity-reset-plan.ts"), "utf8");

assert(plan.includes('mode: "dry-run"'), "reset plan defaults to dry-run");
assert(plan.includes("execute is not authorized"), "execute blocked");
assert(plan.includes("backup_checksum_missing"), "refuses missing backup checksum");
assert(plan.includes("unclassified_identities_remain"), "refuses unclassified identities");
assert(plan.includes("ALLOW_HOSTED_IDENTITY_CENSUS"), "hosted census requires explicit allow flag");

const tenantAccess = readFileSync(
  join(process.cwd(), "src/lib/services/tenant-membership-access.service.ts"),
  "utf8"
);
assert(
  tenantAccess.includes("resolveTenantPlatformAccountAuthorization"),
  "tenant portal checks platform account ACTIVE gate"
);

console.log("identity-reset-guards: passed");
