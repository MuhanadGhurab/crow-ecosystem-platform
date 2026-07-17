#!/usr/bin/env tsx
/**
 * C3.10K — Resolve pending/active proof requester (no PII).
 * Run: npm run c3-10k:pending-requester:verify
 */
import { PrismaClient } from "@prisma/client";
import {
  printProofResolution,
  resolveProofRequester,
} from "./lib/c3-proof-requester-resolution";

async function main() {
  const prisma = new PrismaClient();
  try {
    const resolution = await resolveProofRequester(prisma);
    printProofResolution(resolution);

    if (
      resolution.classification !== "CONTROLLED_PENDING_REQUESTER" &&
      resolution.classification !== "CONTROLLED_ACTIVE_REQUESTER"
    ) {
      console.error(`STOP — classification ${resolution.classification}`);
      process.exit(1);
    }

    if (resolution.classification === "CONTROLLED_PENDING_REQUESTER") {
      console.log("NEXT — continue existing verification (no new signup):");
      console.log("  /login or continuation route → resend code → /verify-email");
      console.log("  Operator enters newest hosted OTP in browser only.");
    } else {
      console.log("SKIP — account already ACTIVE; proceed to password-recovery proof.");
    }

    console.log("\nc3-10k:pending-requester:verify PASSED\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
