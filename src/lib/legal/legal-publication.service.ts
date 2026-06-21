/**
 * Controlled Crow Legal v1.1 publication — draft lifecycle and idempotent publish (database).
 */

import type {
  LegalDocumentType,
  LegalDocumentVersionStatus,
  PrismaClient,
} from "@prisma/client";
import { assertC2DatabaseEnvironmentSafe } from "@/lib/crow-core/c2-database-mutation-guard";
import {
  CROW_LEGAL_V1_1_DOCUMENTS,
  CROW_LEGAL_V1_1_VERSION_NUMBER,
} from "@/lib/legal/crow-legal-v1-1-content";
import { hashLegalDocumentContent } from "@/lib/legal/legal-document-hash";
import {
  buildLegalV11PublicationPayload,
  payloadsMatch,
  type PublishCrowLegalV11Result,
} from "@/lib/legal/legal-publication-payload";
import {
  assertHostedLegalPublicationSafe,
  LegalPublicationBlockedError,
} from "@/lib/legal/legal-publication-guards";

export { LegalPublicationBlockedError };
export type { PublishCrowLegalV11Result };
export { buildLegalV11PublicationPayload, payloadsMatch } from "@/lib/legal/legal-publication-payload";

const LOCALE = "en-US";
const AUDIENCE = "platform_requester" as const;

async function findVersion(
  prisma: PrismaClient,
  documentType: LegalDocumentType,
  versionNumber: number
) {
  return prisma.legalDocumentVersion.findFirst({
    where: {
      versionNumber,
      locale: LOCALE,
      audience: AUDIENCE,
      legalDocument: { documentType },
    },
    include: { legalDocument: true },
  });
}

/** Local/dev only — seed v1.1 as draft without making it current. */
export async function seedLegalV11DraftVersions(prisma: PrismaClient): Promise<void> {
  for (const doc of CROW_LEGAL_V1_1_DOCUMENTS) {
    const legalDocument = await prisma.legalDocument.upsert({
      where: { documentType: doc.documentType },
      create: { documentType: doc.documentType, title: doc.title },
      update: { title: doc.title },
    });

    const existing = await findVersion(prisma, doc.documentType, CROW_LEGAL_V1_1_VERSION_NUMBER);
    if (existing) {
      continue;
    }

    const contentBody = doc.contentBody;
    const contentSha256 = hashLegalDocumentContent(contentBody);

    await prisma.legalDocumentVersion.create({
      data: {
        legalDocumentId: legalDocument.id,
        versionNumber: CROW_LEGAL_V1_1_VERSION_NUMBER,
        locale: LOCALE,
        audience: AUDIENCE,
        title: doc.title,
        contentFormat: "markdown",
        contentBody,
        contentSchemaVersion: "1",
        status: "draft",
        mandatoryClassification: doc.mandatoryClassification,
        reacceptancePolicy: "required_before_protected_activity",
        effectiveAt: new Date(0),
        publishedAt: null,
        contentSha256,
      },
    });
  }
}

async function transitionDraftStatus(
  prisma: PrismaClient,
  versionId: string,
  status: LegalDocumentVersionStatus
): Promise<void> {
  await prisma.legalDocumentVersion.update({
    where: { id: versionId },
    data: { status },
  });
}

export async function publishCrowLegalV11Controlled(
  prisma: PrismaClient,
  options: { skipHostedGuards?: boolean } = {}
): Promise<PublishCrowLegalV11Result> {
  await assertC2DatabaseEnvironmentSafe();
  if (!options.skipHostedGuards) {
    assertHostedLegalPublicationSafe("publishCrowLegalV11Controlled");
  }

  const payload = buildLegalV11PublicationPayload();
  const now = new Date();
  const versionIds = {} as Record<LegalDocumentType, string>;
  let anyPublished = false;
  let allAlreadyPublished = true;

  for (const doc of payload.documents) {
    const template = CROW_LEGAL_V1_1_DOCUMENTS.find((d) => d.documentType === doc.documentType)!;
    const legalDocument = await prisma.legalDocument.upsert({
      where: { documentType: doc.documentType },
      create: { documentType: doc.documentType, title: template.title },
      update: { title: template.title },
    });

    const existing = await findVersion(prisma, doc.documentType, payload.versionNumber);

    if (existing?.status === "published") {
      if (!payloadsMatch(existing, doc)) {
        throw new Error("FAILED — EXISTING LEGAL VERSION CONTENT OR HASH MISMATCH");
      }
      versionIds[doc.documentType] = existing.id;
      continue;
    }

    allAlreadyPublished = false;

    if (
      existing &&
      (existing.contentBody !== doc.contentBody || existing.contentSha256 !== doc.contentSha256)
    ) {
      throw new Error("FAILED — EXISTING LEGAL VERSION CONTENT OR HASH MISMATCH");
    }

    const priorPublished = await prisma.legalDocumentVersion.findFirst({
      where: {
        legalDocumentId: legalDocument.id,
        locale: LOCALE,
        audience: AUDIENCE,
        status: "published",
        versionNumber: { lt: payload.versionNumber },
      },
      orderBy: { versionNumber: "desc" },
    });

    if (priorPublished) {
      await prisma.legalDocumentVersion.updateMany({
        where: { id: priorPublished.id, status: "published" },
        data: { status: "superseded" },
      });
    }

    if (existing) {
      const published = await prisma.legalDocumentVersion.update({
        where: { id: existing.id },
        data: {
          contentBody: doc.contentBody,
          contentSha256: doc.contentSha256,
          title: doc.title,
          status: "published",
          publishedAt: existing.publishedAt ?? now,
          effectiveAt: existing.effectiveAt.getTime() === 0 ? now : existing.effectiveAt,
          supersedesVersionId: priorPublished?.id ?? null,
          reacceptancePolicy: "required_before_protected_activity",
        },
      });
      versionIds[doc.documentType] = published.id;
    } else {
      const published = await prisma.legalDocumentVersion.create({
        data: {
          legalDocumentId: legalDocument.id,
          versionNumber: payload.versionNumber,
          locale: LOCALE,
          audience: AUDIENCE,
          title: doc.title,
          contentFormat: "markdown",
          contentBody: doc.contentBody,
          contentSchemaVersion: "1",
          status: "published",
          mandatoryClassification: template.mandatoryClassification,
          reacceptancePolicy: "required_before_protected_activity",
          effectiveAt: now,
          publishedAt: now,
          contentSha256: doc.contentSha256,
          supersedesVersionId: priorPublished?.id ?? null,
        },
      });
      versionIds[doc.documentType] = published.id;
    }
    anyPublished = true;
  }

  if (allAlreadyPublished) {
    return { action: "already_published", versionIds };
  }
  return { action: anyPublished ? "published" : "draft_seeded", versionIds };
}

export async function advanceLegalV11ReviewStatus(
  prisma: PrismaClient,
  targetStatus: "reviewed" | "approved_for_publication"
): Promise<void> {
  for (const doc of CROW_LEGAL_V1_1_DOCUMENTS) {
    const version = await findVersion(prisma, doc.documentType, CROW_LEGAL_V1_1_VERSION_NUMBER);
    if (!version || version.status === "published" || version.status === "superseded") {
      continue;
    }
    await transitionDraftStatus(prisma, version.id, targetStatus);
  }
}
