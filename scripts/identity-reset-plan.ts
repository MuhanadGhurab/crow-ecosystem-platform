#!/usr/bin/env npx tsx
/**
 * C3.10A — Identity reset dry-run manifest (read-only census).
 * Defaults to dry-run; never deletes data.
 *
 * Hosted census (read-only):
 *   npx tsx --env-file=.env.preview.operator scripts/identity-reset-plan.ts
 */
import { createClient } from "@supabase/supabase-js";

import { PrismaClient } from "@prisma/client";

import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./lib/database-fingerprint";
import { listAllAuthUsers, runIdentityCensus } from "./lib/identity-census";
import {
  generateManifestSalt,
  HOSTED_CENSUS_EXPECTED_FINGERPRINT,
  HOSTED_CENSUS_EXPECTED_SUPABASE_REF,
  IDENTITY_RESET_EXECUTE_PHRASE_EXPECTED,
  manifestDigest,
} from "./lib/identity-manifest";

const MODE = process.argv.includes("--execute") ? "execute" : "plan";
const BACKUP_CHECKSUM = process.env.IDENTITY_RESET_BACKUP_CHECKSUM?.trim() ?? "";
const EXECUTE_PHRASE = process.env.IDENTITY_RESET_EXECUTE_PHRASE?.trim() ?? "";
const EXPECTED_FINGERPRINT =
  process.env.IDENTITY_CENSUS_EXPECTED_FINGERPRINT?.trim() ||
  HOSTED_CENSUS_EXPECTED_FINGERPRINT;
const ALLOW_HOSTED_CENSUS = process.env.ALLOW_HOSTED_IDENTITY_CENSUS === "true";

const RESET_EXECUTION_GRAPH = [
  "1. Enter maintenance mode",
  "2. Disable registration",
  "3. Create and restore-test fresh backup",
  "4. Freeze current onboarding generation",
  "5. Deny legacy identity authorization",
  "6. Transfer or detach operational ownership",
  "7. Remove tenant memberships and account roles",
  "8. Remove invitations and request links",
  "9. Remove test ERP/account-owned records",
  "10. Remove verification challenges and provider identities",
  "11. Remove profiles and PlatformAccounts",
  "12. Resolve Storage ownership",
  "13. Delete Supabase Auth identities",
  "14. Verify zero ordinary legacy users remain",
  "15. Set required onboarding generation to 2",
  "16. Redeploy",
  "17. Register product owner through the fresh flow",
  "18. Run explicit platform-owner bootstrap",
] as const;

const PRESERVED_RECORDS = [
  "tenant records",
  "Enterprise Blueprints",
  "migration history",
  "legal document versions",
  "system configuration",
  "non-test operational records",
  "security audit evidence (pseudonymized where required)",
  "application code and architecture",
] as const;

type RefusalReason =
  | "execute_not_authorized"
  | "vercel_runtime_forbidden"
  | "hosted_census_not_explicitly_allowed"
  | "database_fingerprint_mismatch"
  | "backup_checksum_missing"
  | "execute_phrase_missing_or_invalid"
  | "unclassified_identities_remain"
  | "unresolved_ownership_dependencies"
  | "environment_classification_untruthful"
  | "storage_blockers_unresolved";

function collectRefusalReasons(input: {
  fingerprintMatch: boolean;
  backupProvided: boolean;
  executePhraseValid: boolean;
  unclassifiedTotal: number;
  ownershipRefs: number;
  storageBlockers: number;
  appEnv: string | null;
  databaseIsHosted: boolean;
}): RefusalReason[] {
  const reasons: RefusalReason[] = [];
  if (MODE === "execute") reasons.push("execute_not_authorized");
  if (!input.backupProvided) reasons.push("backup_checksum_missing");
  if (!input.executePhraseValid) reasons.push("execute_phrase_missing_or_invalid");
  if (!input.fingerprintMatch) reasons.push("database_fingerprint_mismatch");
  if (input.unclassifiedTotal > 0) reasons.push("unclassified_identities_remain");
  if (input.ownershipRefs > 0 && input.unclassifiedTotal > 0) {
    reasons.push("unresolved_ownership_dependencies");
  }
  if (input.storageBlockers > 0) reasons.push("storage_blockers_unresolved");
  if (input.databaseIsHosted && input.appEnv !== "preview") {
    reasons.push("environment_classification_untruthful");
  }
  return reasons;
}

async function main() {
  if (MODE === "execute") {
    console.error("identity-reset:execute is not authorized in C3.10A.");
    console.error(
      `Future execute requires IDENTITY_RESET_EXECUTE_PHRASE="${IDENTITY_RESET_EXECUTE_PHRASE_EXPECTED}".`
    );
    process.exit(1);
  }

  if (process.env.VERCEL === "1" && process.env.ALLOW_HOSTED_IDENTITY_CENSUS !== "true") {
    console.error("Refusing identity reset tooling on Vercel build/runtime.");
    process.exit(1);
  }

  const dbUrl = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim() || "";
  if (!dbUrl) {
    console.error("DATABASE_URL or DIRECT_URL required.");
    process.exit(1);
  }

  const fp = fingerprintDatabaseUrl(dbUrl);
  const isHostedRef = fp.supabaseProjectRef === HOSTED_CENSUS_EXPECTED_SUPABASE_REF;

  if (isHostedRef && !ALLOW_HOSTED_CENSUS) {
    console.error(
      "Hosted identity census requires ALLOW_HOSTED_IDENTITY_CENSUS=true (read-only plan mode)."
    );
    process.exit(1);
  }

  const fingerprintMatch = fp.targetHash === EXPECTED_FINGERPRINT;
  if (isHostedRef && !fingerprintMatch) {
    console.error(
      `Database fingerprint mismatch: expected ${EXPECTED_FINGERPRINT}, got ${fp.targetHash ?? "unknown"}.`
    );
    process.exit(1);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required for Auth census.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const authUsers = await listAllAuthUsers(async (page) => {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    return data.users;
  });

  const manifestSalt = generateManifestSalt();
  const prisma = new PrismaClient();

  try {
    const pendingMigrations = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM "_prisma_migrations"
      WHERE finished_at IS NULL AND rolled_back_at IS NULL
    `;
    const failedMigrations = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM "_prisma_migrations"
      WHERE finished_at IS NULL AND rolled_back_at IS NULL AND started_at IS NOT NULL
    `;

    const c3PhoneTables = await prisma.$queryRaw<{ reg: string | null }[]>`
      SELECT to_regclass('public.phone_verification_challenges')::text AS reg
      UNION ALL
      SELECT to_regclass('public.platform_provider_identities')::text
    `;

    const census = await runIdentityCensus(prisma, {
      authUsers,
      manifestSalt,
      storageBlockerCount: 0,
    });

    const executePhraseValid = EXECUTE_PHRASE === IDENTITY_RESET_EXECUTE_PHRASE_EXPECTED;
    const unclassifiedTotal =
      census.unclassifiedAuthUsers + census.unclassifiedPlatformAccounts;
    const refusalReasons = collectRefusalReasons({
      fingerprintMatch: !isHostedRef || fingerprintMatch,
      backupProvided: Boolean(BACKUP_CHECKSUM),
      executePhraseValid,
      unclassifiedTotal,
      ownershipRefs: census.ownershipDependencies.totalDistinctRefs,
      storageBlockers: census.storageBlockerCount,
      appEnv: process.env.APP_ENVIRONMENT?.trim().toLowerCase() ?? null,
      databaseIsHosted: Boolean(fp.supabaseProjectRef),
    });

    const inactiveMembershipsWithAccess = census.membershipOwnership.filter(
      (m) => !m.canAuthorizeTenantAccess
    );

    const manifest = {
      phase: "C3.10A",
      mode: "dry-run",
      decision:
        refusalReasons.length > 0
          ? "BLOCKED — controlled dry-run; operator data or authorization incomplete"
          : "PLAN_READY — dry-run manifest complete (execute still disabled)",
      database: {
        maskedTarget: maskDatabaseTarget(dbUrl),
        fingerprint: fp.targetHash,
        expectedFingerprint: isHostedRef ? EXPECTED_FINGERPRINT : null,
        supabaseProjectRef: fp.supabaseProjectRef,
        pendingMigrations: Number(pendingMigrations[0]?.count ?? 0),
        activeFailedMigrations: Number(failedMigrations[0]?.count ?? 0),
      },
      c38TablesPresent: {
        phone_verification_challenges: Boolean(c3PhoneTables[0]?.reg),
        platform_provider_identities: Boolean(c3PhoneTables[1]?.reg),
      },
      backup: {
        checksumProvided: Boolean(BACKUP_CHECKSUM),
        checksumPrefix: BACKUP_CHECKSUM ? BACKUP_CHECKSUM.slice(0, 12) : null,
        requiredForExecute: true,
      },
      authAggregate: census.auth,
      crowIdentity: {
        platformAccounts: census.platformAccounts,
        profiles: census.profiles,
        legalAcceptances: census.legalAcceptances,
        emailVerificationChallenges: census.emailChallenges,
        phoneVerificationChallenges: census.phoneChallenges,
        providerIdentities: census.providerIdentities,
        tenantMemberships: census.tenantMemberships,
        tenantInvites: census.tenantInvites,
        clientRequestLinks: census.clientRequestLinks,
      },
      tenantMembershipOwnership: {
        rows: census.membershipOwnership,
        inactiveAccountCannotAuthorize: inactiveMembershipsWithAccess.every(
          (m) => !m.canAuthorizeTenantAccess
        ),
        summary:
          "Membership rows map to platform account refs; canAuthorizeTenantAccess requires ACTIVE platform account.",
      },
      operationalOwnership: census.ownershipDependencies,
      storageBlockers: census.storageBlockerCount,
      classificationCounts: census.classificationCounts,
      unclassified: {
        authUsers: census.unclassifiedAuthUsers,
        platformAccounts: census.unclassifiedPlatformAccounts,
      },
      plannedDeletionCounts: census.plannedDeletionCounts,
      preservedRecords: PRESERVED_RECORDS,
      resetExecutionGraph: RESET_EXECUTION_GRAPH,
      refusalReasons,
      dryRun: true,
      executeAuthorized: false,
      notes: [
        "No emails, phones, Auth IDs, tokens, or OTP values included.",
        "Opaque refs use salted SHA-256 prefixes for operator comparison only.",
        "Storage ownership requires separate Supabase Storage audit (count defaults to 0).",
        "identity-reset:execute remains disabled in C3.10A.",
      ],
    };

    const serialized = JSON.stringify(manifest, null, 2);
    const digest = manifestDigest(manifest);

    console.log(serialized);
    console.error(`\nmanifest_sha256=${digest}`);
    console.error(
      `inactive_membership_gate=${inactiveMembershipsWithAccess.length}/${census.membershipOwnership.length} blocked`
    );

    if (refusalReasons.length > 0) {
      process.exitCode = 2;
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
