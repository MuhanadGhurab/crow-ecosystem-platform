#!/usr/bin/env tsx
/**
 * C3.10K — List pending gen-2 proof candidates (opaque refs only, no PII).
 * Run: npm run c3-10k:pending-candidates:list
 */
import { PrismaClient } from "@prisma/client";
import { normalizeEmail } from "../src/lib/account/email-normalize";
import { opaqueManifestRef } from "./lib/identity-manifest";

async function main() {
  const platformAdminNorm = process.env.PLATFORM_ADMIN_EMAIL?.trim()
    ? normalizeEmail(process.env.PLATFORM_ADMIN_EMAIL.trim())
    : null;

  const prisma = new PrismaClient();
  try {
    const rows = await prisma.platformAccount.findMany({
      where: {
        status: "PENDING_EMAIL_VERIFICATION",
        onboardingGeneration: 2,
        ...(platformAdminNorm ? { emailNormalized: { not: platformAdminNorm } } : {}),
      },
      include: { legalAcceptances: true, providerIdentities: true },
      orderBy: { createdAt: "asc" },
    });

    const candidates = rows.filter((r) => r.legalAcceptances.length === 3);

    console.log("\n=== C3.10K pending proof candidates (opaque only) ===\n");
    console.log(`  count: ${candidates.length}`);
    for (const r of candidates) {
      console.log(
        JSON.stringify({
          accountOpaque: opaqueManifestRef("platform-account", r.id),
          accountIdPrefix: r.id.slice(0, 12),
          legal: r.legalAcceptances.length,
          providers: r.providerIdentities.length,
          createdAt: r.createdAt.toISOString(),
        })
      );
    }
    console.log(
      "\nSet C3_PRESERVED_DISPOSABLE_ACCOUNT_ID to full cuid or C3_SESSION_REQUESTER_FIXTURE_EMAIL in gitignored env.\n"
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
