#!/usr/bin/env npx tsx
/**
 * Platform owner bootstrap execute — separately gated; does not grant authority in current phase.
 */
import { mergeStagingSupabaseEnvIfMissing } from "./lib/merge-staging-supabase-env";
import {
  countExistingPlatformOwners,
  findAuthUsersByNormalizedEmail,
} from "./lib/platform-owner-bootstrap-deps";
import {
  PLATFORM_OWNER_ACCOUNT_ID_ENV,
  PLATFORM_OWNER_DESIGNATED_EMAIL_ENV,
} from "@/lib/platform/platform-owner-bootstrap.constants";
import {
  planPlatformOwnerBootstrapByAccountId,
  resolutionManifestDigest,
  resolveDesignatedPlatformOwnerByEmail,
} from "@/lib/platform/platform-owner-bootstrap.service";
import { validatePlatformOwnerExecuteGates } from "./lib/platform-owner-execute-gates";

process.env.ALLOW_HOSTED_IDENTITY_CENSUS = "true";
mergeStagingSupabaseEnvIfMissing();

async function main() {
  const accountId = process.env[PLATFORM_OWNER_ACCOUNT_ID_ENV]?.trim();
  if (!accountId) {
    console.error("Set PLATFORM_OWNER_ACCOUNT_ID to the resolved internal PlatformAccount ID.");
    process.exit(1);
  }

  const deps = {
    findAuthUsersByEmail: findAuthUsersByNormalizedEmail,
    countExistingPlatformOwners,
    locale: process.env.PLATFORM_OWNER_LEGAL_LOCALE?.trim() || "en-US",
  };

  const designatedEmail = process.env[PLATFORM_OWNER_DESIGNATED_EMAIL_ENV]?.trim();
  const planResult = designatedEmail
    ? await resolveDesignatedPlatformOwnerByEmail(designatedEmail, deps)
    : await planPlatformOwnerBootstrapByAccountId(accountId, deps);

  if (planResult.platformAccountId && planResult.platformAccountId !== accountId) {
    console.error("PLATFORM_OWNER_ACCOUNT_ID does not match designated email resolution.");
    process.exit(1);
  }

  const planDigest = resolutionManifestDigest(planResult);
  const gate = validatePlatformOwnerExecuteGates({
    platformAccountId: accountId,
    planDigest,
    expectedPlanDigest: planResult.allowed ? planDigest : null,
  });

  const output = {
    phase: "platform-owner-bootstrap-execute",
    dryRun: false,
    executeAuthorized: false,
    gate,
    planAllowed: planResult.allowed,
    platformAccountId: accountId,
    planDigest,
    auditEventType: "platform_owner_bootstrap_execute_blocked",
  };

  console.log(JSON.stringify(output, null, 2));

  if (!gate.allowed && gate.refusal !== "execute_disabled") {
    process.exit(2);
  }

  console.error(gate.message);
  process.exit(1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
