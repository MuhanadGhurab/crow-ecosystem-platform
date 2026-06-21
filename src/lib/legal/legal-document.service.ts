import type {
  LegalAudience,
  LegalDocumentType,
  LegalDocumentVersion,
  MandatoryClassification,
} from "@prisma/client";
import { assertC2DatabaseEnvironmentSafe } from "@/lib/crow-core/c2-database-mutation-guard";
import { prisma } from "@/lib/db";
import { hashLegalDocumentContent } from "@/lib/legal/legal-document-hash";
import {
  assertPublishedVersionImmutable,
  verifyVersionContentHash,
} from "@/lib/legal/legal-document-validation";

export { assertPublishedVersionImmutable, verifyVersionContentHash };

export type PublishedLegalVersion = LegalDocumentVersion & {
  legalDocument: { documentType: LegalDocumentType };
};

/** Published versions return immutable stored contentBody — never re-interpolate env at render time. */

const MANDATORY_CLASSIFICATIONS: MandatoryClassification[] = [
  "mandatory_contractual",
  "mandatory_notice",
];

export async function getCurrentPublishedMandatoryVersions(input: {
  locale: string;
  audience?: LegalAudience;
}): Promise<PublishedLegalVersion[]> {
  const audience = input.audience ?? "platform_requester";
  const versions = await prisma.legalDocumentVersion.findMany({
    where: {
      status: "published",
      locale: input.locale,
      audience,
      mandatoryClassification: { in: MANDATORY_CLASSIFICATIONS },
    },
    include: { legalDocument: true },
    orderBy: [{ legalDocument: { documentType: "asc" } }, { versionNumber: "desc" }],
  });

  const byType = new Map<LegalDocumentType, PublishedLegalVersion>();
  for (const v of versions) {
    const existing = byType.get(v.legalDocument.documentType);
    if (!existing || v.versionNumber > existing.versionNumber) {
      byType.set(v.legalDocument.documentType, v);
    }
  }
  return [...byType.values()];
}

export async function getPublishedVersionById(
  versionId: string
): Promise<PublishedLegalVersion | null> {
  return prisma.legalDocumentVersion.findFirst({
    where: { id: versionId, status: "published" },
    include: { legalDocument: true },
  });
}

export async function getPublishedVersionByType(input: {
  type: LegalDocumentType;
  locale: string;
  audience?: LegalAudience;
}): Promise<PublishedLegalVersion | null> {
  const audience = input.audience ?? "platform_requester";
  return prisma.legalDocumentVersion.findFirst({
    where: {
      status: "published",
      locale: input.locale,
      audience,
      legalDocument: { documentType: input.type },
    },
    include: { legalDocument: true },
    orderBy: { versionNumber: "desc" },
  });
}

export async function publishLegalDocumentVersion(versionId: string): Promise<LegalDocumentVersion> {
  await assertC2DatabaseEnvironmentSafe();
  const existing = await prisma.legalDocumentVersion.findUnique({
    where: { id: versionId },
  });
  if (!existing) {
    throw new Error("Legal document version not found.");
  }
  if (existing.status === "published") {
    return existing;
  }
  const hash = hashLegalDocumentContent(existing.contentBody);
  if (hash !== existing.contentSha256) {
    throw new Error("Content hash mismatch; cannot publish.");
  }
  const now = new Date();
  return prisma.legalDocumentVersion.update({
    where: { id: versionId },
    data: {
      status: "published",
      publishedAt: now,
      effectiveAt: existing.effectiveAt ?? now,
    },
  });
}
