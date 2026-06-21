/**
 * C3.10X — Controlled reconciliation of stale non-authoritative crow_role=client
 * on the retained Google proof requester (operator-only).
 */
import { PrismaClient } from "@prisma/client";
import { reconcileStaleNonAuthoritativeClientMetadata } from "./lib/c3-google-proof-role-reconciliation";
import { requireGoogleProofOperatorEnv } from "./lib/c3-google-proof-identity-resolution";

function fail(reason: string): never {
  console.error(`\nFAILED — STALE METADATA RECONCILIATION UNSAFE`);
  console.error(`  reason: ${reason}\n`);
  process.exit(1);
}

async function main() {
  const { emailNormalized } = requireGoogleProofOperatorEnv();
  const expectedFingerprint =
    process.env.C3_EXPECTED_PROOF_IDENTITY_FINGERPRINT?.trim() || "1e94ebdcf2293cd3";

  const prisma = new PrismaClient();
  try {
    const result = await reconcileStaleNonAuthoritativeClientMetadata(prisma, {
      proofEmailNormalized: emailNormalized,
      expectedFingerprint,
    });

    if (!result.ok) {
      fail(result.reason);
    }

    console.log(`\n  identityFingerprint: ${result.fingerprint}`);
    console.log(`  metadataAction: ${result.action}\n`);
    console.log("PASS — STALE NON-AUTHORITATIVE CLIENT METADATA REMOVED FROM PROOF REQUESTER\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  fail(err instanceof Error ? err.message : String(err));
});
