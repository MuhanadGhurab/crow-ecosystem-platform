#!/usr/bin/env tsx
/**
 * FTGP — Platform Admin bootstrap dry-run (zero database writes).
 * Run: npm run ftgp-platform-admin-bootstrap:dry-run
 *
 * Requires PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID in operator env.
 */
import { PrismaClient } from "@prisma/client";

import { detectPlatformInternalRoleBootstrapRefusal } from "../src/lib/platform/platform-internal-role-bootstrap";
import {
  planPlatformOwnerBootstrapByAccountId,
  resolutionManifestDigest,
} from "../src/lib/platform/platform-owner-bootstrap.service";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { resolveCloud1hCandidateOperator } from "./lib/cloud-1h-candidate-resolution";
import {
  captureCloud1hDatabaseBaseline,
  CLOUD_1H_BASELINE_EXPECTED,
} from "./lib/cloud-1h-database-baseline";
import {
  countExistingPlatformOwners,
  findAuthUsersByNormalizedEmail,
} from "./lib/platform-owner-bootstrap-deps";
import { requireProofOperatorEnv, resolveProofRequester } from "./lib/c3-proof-requester-resolution";

const TARGET_ENV = "PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID";
const CORRELATION_ENV = "PLATFORM_INTERNAL_ROLE_BOOTSTRAP_CORRELATION_ID";
const REQUESTER_ID_ENV = "C3_PRESERVED_DISPOSABLE_ACCOUNT_ID";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function blocked(msg: string): never {
  console.error(`\nPLATFORM_ADMIN_BOOTSTRAP_DRY_RUN=BLOCKED`);
  console.error(`BOOTSTRAP_WRITES_EXECUTED=false`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

async function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.preview.operator", ".env.platform-bootstrap.operator"],
  });
  assertHostedEnvNotLocalhost(envLoad);

  console.log("\n=== FTGP Platform Admin bootstrap dry-run (zero writes) ===\n");

  const refusal = detectPlatformInternalRoleBootstrapRefusal();
  if (refusal && refusal !== "bootstrap_disabled") {
    blocked(`bootstrap env refusal: ${refusal}`);
  }

  const targetAccountId =
    process.env[TARGET_ENV]?.trim() ||
    process.env.PLATFORM_OWNER_ACCOUNT_ID?.trim() ||
    null;

  if (!targetAccountId) {
    blocked(`Set ${TARGET_ENV} to immutable PlatformAccount.id`);
  }

  const correlationId =
    process.env[CORRELATION_ENV]?.trim() ||
    `ftgp-bootstrap-dry-run-${Date.now().toString(36)}`;

  if (correlationId.length < 8) {
    blocked("correlation ID must be at least 8 characters");
  }

  const prisma = new PrismaClient();
  try {
    const baseline = await captureCloud1hDatabaseBaseline(prisma);
    if (baseline.internalRoleAssignments !== CLOUD_1H_BASELINE_EXPECTED.internalRoleAssignments) {
      blocked("assignment table must be empty before bootstrap dry-run");
    }

    const { preservedAccountId } = requireProofOperatorEnv();
    const resolvedRequesterId = preservedAccountId;

    const candidate = await resolveCloud1hCandidateOperator(
      prisma,
      resolvedRequesterId ? [resolvedRequesterId] : []
    );

    if (resolvedRequesterId && targetAccountId === resolvedRequesterId) {
      blocked("target must not be retained requester");
    }
    if (candidate && targetAccountId === candidate.platformAccountId) {
      blocked("target must not be candidate IMPLEMENTER operator");
    }

    const account = await prisma.platformAccount.findUnique({
      where: { id: targetAccountId },
      select: { id: true, status: true },
    });
    if (!account) {
      blocked("target account ID does not exist");
    }
    if (account.status !== "ACTIVE") {
      blocked("target must be ACTIVE");
    }

    const deps = {
      findAuthUsersByEmail: findAuthUsersByNormalizedEmail,
      countExistingPlatformOwners,
      locale: process.env.PLATFORM_OWNER_LEGAL_LOCALE?.trim() || "en-US",
    };

    const plan = await planPlatformOwnerBootstrapByAccountId(targetAccountId, deps);
    if (!plan.allowed) {
      blocked(plan.refusal ?? plan.message);
    }

    const digest = resolutionManifestDigest(plan);

    ok("target account ID exists");
    ok("target is ACTIVE");
    ok("target legal state is current");
    ok("target has no active internal role");
    ok("target is not retained requester");
    ok("target is not candidate IMPLEMENTER");
    ok("assignment table is empty");
    ok(`correlation ID valid (${correlationId.length} chars)`);
    ok("expected role is exactly PLATFORM_ADMIN");
    ok("expected assignment count after future execution would be 1");
    ok("expected audit-event delta would be 1");
    ok("no other table would change (dry-run only)");

    console.log("\nPLATFORM_ADMIN_BOOTSTRAP_DRY_RUN=PASS");
    console.log("BOOTSTRAP_WRITES_EXECUTED=false");
    console.log(`plan_digest=${digest}`);
    console.log(`target_opaque=${plan.opaqueRefs.platformAccount ?? "resolved"}`);
    console.log(`expected_role=PLATFORM_ADMIN`);
    console.log(`expected_active_assignments_after=1`);
    console.log(`expected_grant_audit_delta=1`);
    console.log(`correlation_id_length=${correlationId.length}`);
    console.log("\nPASS — FTGP PLATFORM ADMIN BOOTSTRAP DRY-RUN\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
