#!/usr/bin/env npx tsx
/**
 * Platform owner bootstrap dry-run plan (operator-only).
 *
 * Usage (designated email at runtime — never commit to repo):
 *   PLATFORM_OWNER_DESIGNATED_EMAIL=<product-owner-email> npm run platform-owner:bootstrap-plan
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

process.env.ALLOW_HOSTED_IDENTITY_CENSUS = "true";
mergeStagingSupabaseEnvIfMissing();

async function main() {
  const deps = {
    findAuthUsersByEmail: findAuthUsersByNormalizedEmail,
    countExistingPlatformOwners,
    locale: process.env.PLATFORM_OWNER_LEGAL_LOCALE?.trim() || "en-US",
  };

  const accountIdOverride = process.env[PLATFORM_OWNER_ACCOUNT_ID_ENV]?.trim();
  const designatedEmail = process.env[PLATFORM_OWNER_DESIGNATED_EMAIL_ENV]?.trim();

  if (!designatedEmail && !accountIdOverride) {
    console.error(
      `Set ${PLATFORM_OWNER_DESIGNATED_EMAIL_ENV} to the product-owner designated email (runtime only — do not commit).`
    );
    process.exit(1);
  }

  const result = accountIdOverride
    ? await planPlatformOwnerBootstrapByAccountId(accountIdOverride, deps)
    : await resolveDesignatedPlatformOwnerByEmail(designatedEmail!, deps);

  const manifest = {
    phase: "platform-owner-bootstrap-plan",
    dryRun: true,
    executeAuthorized: false,
    platformAccountId: result.platformAccountId,
    planDigest: resolutionManifestDigest(result),
    ...result,
  };

  console.log(JSON.stringify(manifest, null, 2));
  console.error(`\nplan_digest=${manifest.planDigest}`);
  if (result.platformAccountId) {
    console.error(
      `resolved_platform_account_id=${result.platformAccountId} (use for execute after authorization)`
    );
  }

  if (!result.allowed) process.exit(2);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
