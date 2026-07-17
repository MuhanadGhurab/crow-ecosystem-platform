#!/usr/bin/env tsx
/** C3.5 — Idempotent legal document seed on hosted database. v1.0 published; v1.1 draft only. */
import { PrismaClient } from "@prisma/client";
import { seedLegalDocuments } from "../prisma/seed-legal-documents";

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log("\n=== C3 legal document seed (idempotent, v1.0 current) ===\n");
    console.log(
      "NOTE: v1.1 is NOT published by this script. Use publish-crow-legal-v1-1-controlled.ts after counsel authorization.\n"
    );
    await seedLegalDocuments(prisma);
    const docCount = await prisma.legalDocument.count();
    const publishedCount = await prisma.legalDocumentVersion.count({
      where: { status: "published" },
    });
    const draftV11Count = await prisma.legalDocumentVersion.count({
      where: { status: "draft", versionNumber: 2 },
    });
    console.log(`\nlegal_documents: ${docCount}`);
    console.log(`published legal_document_versions: ${publishedCount}`);
    console.log(`draft v1.1 legal_document_versions: ${draftV11Count}\n`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
