#!/usr/bin/env tsx
/** C3.5 — Idempotent legal document seed on hosted database only. */
import { PrismaClient } from "@prisma/client";
import { seedLegalDocuments } from "../prisma/seed-legal-documents";

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log("\n=== C3 legal document seed (idempotent) ===\n");
    await seedLegalDocuments(prisma);
    const docCount = await prisma.legalDocument.count();
    const versionCount = await prisma.legalDocumentVersion.count({
      where: { status: "published" },
    });
    console.log(`\nlegal_documents: ${docCount}`);
    console.log(`published legal_document_versions: ${versionCount}\n`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
