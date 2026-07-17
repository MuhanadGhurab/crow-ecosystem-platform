#!/usr/bin/env tsx
/**
 * Controlled Crow Legal v1.1 publication — operator-only, idempotent, fail-closed.
 * Requires: CROW_LEGAL_V1_1_PUBLICATION_AUTHORIZED=true, ALLOW_HOSTED_LEGAL_PUBLICATION=true,
 * all six contact/entity env vars, and PRODUCTION_LEGAL_V11_CODE_COMPATIBLE=true on shared DB.
 */
import { PrismaClient } from "@prisma/client";
import { publishCrowLegalV11Controlled, buildLegalV11PublicationPayload } from "../src/lib/legal/legal-publication.service";
import { legalContactConfigurationStatus } from "../src/lib/legal/legal-contact-config";

async function main() {
  console.log("\n=== Crow Legal v1.1 controlled publication ===\n");
  console.log("Contact configuration:", legalContactConfigurationStatus());

  const payload = buildLegalV11PublicationPayload();
  console.log("\nFinalized document hashes (exact rendered bodies):");
  for (const doc of payload.documents) {
    console.log(`  ${doc.documentType}: ${doc.contentSha256}`);
  }

  const prisma = new PrismaClient();
  try {
    const result = await publishCrowLegalV11Controlled(prisma);
    console.log("\nResult:", result.action);
    console.log("Version IDs:", result.versionIds);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
