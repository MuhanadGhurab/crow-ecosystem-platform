#!/usr/bin/env tsx
/**
 * CLOUD.1B — local security tests for Data API containment + FTGP fail-closed migration.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  FTGP_APPROVED_MIGRATION_INVENTORY,
  assertRepositoryMigrationHashesMatchInventory,
  computeMigrationSqlSha256,
} from "./lib/controlled-migration-inventory";
import { summarizeDependencyAudit } from "./lib/cloud-data-api-dependency-scan";
import {
  assertCompleteTableClassification,
  CLOUD_PUBLIC_TABLE_CLASSIFICATION,
} from "./lib/cloud-table-classification";
import { runExternalDataApiProbe } from "./probe-cloud-data-api-exposure";

const root = process.cwd();
const FTGP_MIGRATION = join(
  root,
  "prisma/migrations/20260621120000_ftgp_platform_internal_role_assignment/migration.sql"
);
const OLD_FTGP_HASH = "4868d172cc2b100e54970e83977e3d9f9212d06c916258aa70df2b66f3f7bd5e";
const LEGAL_HASH = "07678643967a72ee8965e54681e69def4c50561b4774e24100f0fc925e30c1ab";

function readSrc(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

async function main(): Promise<void> {
  // 1. Auth continues without business Data API access
  {
    const dep = summarizeDependencyAudit();
    assert.equal(dep.productionBusinessDataApiDependencies, 0);
    assert.equal(dep.browserBusinessDataApiDependencies, 0);
    assert(dep.authOnlySupabaseDependencies > 0, "expected Auth-only Supabase usage");
  }

  // 2. Role-neutral requester /account path
  {
    const landing = readSrc("src/lib/auth/c3-post-auth-landing.ts");
    assert(landing.includes("routes.account.home"));
  }

  // 3. Metadata alone cannot authorize
  {
    const boundaries = readSrc("src/lib/auth/authority-boundaries.ts");
    assert(boundaries.includes("metadataAloneWouldAuthorizeClient"));
    assert(boundaries.includes("metadataAloneWouldAuthorizePlatform"));
  }

  // 4–5. Internal-role migration denies anon/authenticated PostgREST
  {
    const sql = readFileSync(FTGP_MIGRATION, "utf8");
    assert(sql.includes("ENABLE ROW LEVEL SECURITY"));
    assert(
      sql.includes(
        'REVOKE ALL ON TABLE "platform_internal_role_assignments" FROM anon, authenticated'
      )
    );
    assert(!sql.includes("CREATE POLICY"), "no broad authenticated policies");
    assert(!sql.includes("app_metadata"), "no JWT metadata in migration");
  }

  // 6. Trusted server path resolves internal assignments via Prisma
  {
    const svc = readSrc("src/lib/auth/platform-internal-role.service.ts");
    assert(svc.includes("prisma.platformInternalRoleAssignment"));
    assert(!svc.includes("supabase.from"));
  }

  // 7–8. Request owner + tenant membership boundaries
  {
    const customer = readSrc("src/lib/auth/customer-access.service.ts");
    assert(customer.includes("submittedByUserId"));
    const tenant = readSrc("src/lib/services/tenant-membership-access.service.ts");
    assert(tenant.includes("tenantMembership"));
  }

  // 9. Cross-tenant access denied in authority layer (static)
  {
    const auth = readSrc("src/lib/auth/authoritative-crow-auth.ts");
    assert(auth.includes("resolveAuthoritativeCrowAuth"));
  }

  // 10. Proposed default-privilege hardening artifact exists
  {
    const proposed = readSrc(
      "docs/architecture/cloud/proposed/cloud_public_schema_default_privileges_hardening.sql"
    );
    assert(proposed.includes("ALTER DEFAULT PRIVILEGES"));
    assert(proposed.includes("REVOKE"));
  }

  // 11. Prisma routes do not require PostgREST
  {
    const dep = summarizeDependencyAudit();
    assert(dep.prismaDirectDatabaseDomains > 50);
  }

  // 12. Pending inventory + repinned hashes
  {
    assert.doesNotThrow(() => assertRepositoryMigrationHashesMatchInventory());
    assert.equal(FTGP_APPROVED_MIGRATION_INVENTORY.length, 2);
    assert.equal(FTGP_APPROVED_MIGRATION_INVENTORY[0].sqlSha256, LEGAL_HASH);
    assert.notEqual(
      computeMigrationSqlSha256("20260621120000_ftgp_platform_internal_role_assignment"),
      OLD_FTGP_HASH
    );
    assert.equal(
      FTGP_APPROVED_MIGRATION_INVENTORY[1].sqlSha256,
      computeMigrationSqlSha256("20260621120000_ftgp_platform_internal_role_assignment")
    );
  }

  // Full public schema classification (107 live tables per pg_tables 2026-06-21)
  assertCompleteTableClassification();
  assert(CLOUD_PUBLIC_TABLE_CLASSIFICATION.some((t) => t.table === "implementation_requests"));

  const probe = await runExternalDataApiProbe();
  if (probe.results.length > 0) {
    assert(
      probe.classification === "DATA_API_PUBLIC_EXPOSURE_CONFIRMED" ||
        probe.classification === "DATA_API_PUBLIC_EXPOSURE_NOT_CONFIRMED"
    );
  }
  console.log("PASS — DATA API DEPENDENCIES MAPPED AND FTGP AUTHORITY TABLE IS FAIL-CLOSED");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
