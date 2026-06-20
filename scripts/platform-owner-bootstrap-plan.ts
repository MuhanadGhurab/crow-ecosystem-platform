#!/usr/bin/env npx tsx
/**
 * C3.10A — Platform owner bootstrap dry-run plan (operator-only).
 */
import { planPlatformOwnerBootstrap } from "@/lib/platform/platform-owner-bootstrap.service";

async function countExistingPlatformOwners(): Promise<number> {
  // Future: dedicated platform_owner role table. For now count platform_admin metadata via audit placeholder.
  return 0;
}

async function main() {
  const accountId = process.env.PLATFORM_OWNER_ACCOUNT_ID?.trim();
  if (!accountId) {
    console.error("Set PLATFORM_OWNER_ACCOUNT_ID to the verified ACTIVE generation-2 platform account id.");
    process.exit(1);
  }

  const result = await planPlatformOwnerBootstrap(
    {
      platformAccountId: accountId,
      dryRun: true,
      allowMultipleOwners: process.env.PLATFORM_OWNER_ALLOW_MULTIPLE === "true",
      operatorConfirmationToken: process.env.PLATFORM_OWNER_CONFIRM_TOKEN?.trim(),
    },
    { countExistingPlatformOwners }
  );

  console.log(JSON.stringify(result, null, 2));
  if (!result.allowed) process.exit(2);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
