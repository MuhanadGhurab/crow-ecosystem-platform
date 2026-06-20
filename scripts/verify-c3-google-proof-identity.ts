/**
 * C3.10L — Pre-OAuth Google identity inspection.
 * Run: npm run c3-google-proof-identity:verify
 */
import { PrismaClient } from "@prisma/client";
import {
  printGoogleProofResolution,
  resolveGoogleProofIdentity,
} from "./lib/c3-google-proof-identity-resolution";

async function main() {
  const prisma = new PrismaClient();
  try {
    const resolution = await resolveGoogleProofIdentity(prisma);
    printGoogleProofResolution(resolution);
    if (!resolution.mayProceed) {
      console.error(
        `STOP — Google proof identity classification ${resolution.classification} is not eligible for OAuth proof`
      );
      process.exit(1);
    }
    console.log("PASS — Google proof identity eligible for controlled OAuth journey\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
