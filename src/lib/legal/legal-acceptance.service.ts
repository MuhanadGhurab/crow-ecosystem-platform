import type {
  AccountLegalAcceptance,
  LegalAcceptanceMethod,
  LegalAudience,
  LegalDocumentType,
  Prisma,
} from "@prisma/client";
import { randomUUID } from "crypto";
import { assertC2DatabaseEnvironmentSafe } from "@/lib/crow-core/c2-database-mutation-guard";
import { prisma } from "@/lib/db";
import { hashLegalDocumentContent } from "@/lib/legal/legal-document-hash";
import {
  getCurrentPublishedMandatoryVersions,
  getPublishedVersionById,
} from "@/lib/legal/legal-document.service";
import { LegalAcceptanceValidationError } from "@/lib/legal/legal-errors";
import { verifyVersionContentHash } from "@/lib/legal/legal-document-validation";
import { recordPlatformAccountAudit } from "@/lib/account/platform-account.service";

export { LegalAcceptanceValidationError } from "@/lib/legal/legal-errors";

export type AcceptanceSubmission = {
  documentType: LegalDocumentType;
  versionId: string;
  contentHash: string;
};

export type RecordAcceptancesInput = {
  platformAccountId: string;
  locale: string;
  audience?: LegalAudience;
  acceptances: AcceptanceSubmission[];
  registrationCorrelationId?: string;
  userAgentSummary?: string | null;
  acceptanceMethod?: LegalAcceptanceMethod;
};

export async function hasMandatoryLegalAcceptanceComplete(
  platformAccountId: string,
  locale = "en-US"
): Promise<boolean> {
  const mandatory = await getCurrentPublishedMandatoryVersions({ locale });
  if (mandatory.length === 0) return false;

  const accepted = await prisma.accountLegalAcceptance.findMany({
    where: { platformAccountId },
    select: { legalDocumentVersionId: true },
  });
  const acceptedIds = new Set(accepted.map((a) => a.legalDocumentVersionId));
  return mandatory.every((v) => acceptedIds.has(v.id));
}

export async function getAcceptanceHistory(
  platformAccountId: string
): Promise<
  (AccountLegalAcceptance & {
    legalDocumentVersion: {
      title: string;
      locale: string;
      versionNumber: number;
      legalDocument: { documentType: LegalDocumentType };
    };
  })[]
> {
  return prisma.accountLegalAcceptance.findMany({
    where: { platformAccountId },
    include: {
      legalDocumentVersion: {
        select: {
          title: true,
          locale: true,
          versionNumber: true,
          legalDocument: { select: { documentType: true } },
        },
      },
    },
    orderBy: { acceptedAt: "desc" },
  });
}

export type PendingReacceptance = {
  documentType: LegalDocumentType;
  currentVersionId: string;
  acceptedVersionId: string | null;
  title: string;
  versionNumber: number;
};

export async function getPendingReacceptanceForAccount(
  platformAccountId: string,
  locale = "en-US"
): Promise<PendingReacceptance[]> {
  const published = await prisma.legalDocumentVersion.findMany({
    where: {
      status: "published",
      locale,
      reacceptancePolicy: "required_before_protected_activity",
    },
    include: { legalDocument: true },
    orderBy: { versionNumber: "desc" },
  });

  const latestByType = new Map<LegalDocumentType, (typeof published)[0]>();
  for (const v of published) {
    const existing = latestByType.get(v.legalDocument.documentType);
    if (!existing || v.versionNumber > existing.versionNumber) {
      latestByType.set(v.legalDocument.documentType, v);
    }
  }

  const acceptances = await prisma.accountLegalAcceptance.findMany({
    where: { platformAccountId },
    include: { legalDocumentVersion: { include: { legalDocument: true } } },
    orderBy: { acceptedAt: "desc" },
  });

  const latestAcceptedByType = new Map<LegalDocumentType, string>();
  for (const a of acceptances) {
    const type = a.legalDocumentVersion.legalDocument.documentType;
    if (!latestAcceptedByType.has(type)) {
      latestAcceptedByType.set(type, a.legalDocumentVersionId);
    }
  }

  const pending: PendingReacceptance[] = [];
  for (const [type, current] of latestByType) {
    const acceptedId = latestAcceptedByType.get(type) ?? null;
    if (acceptedId !== current.id) {
      pending.push({
        documentType: type,
        currentVersionId: current.id,
        acceptedVersionId: acceptedId,
        title: current.title,
        versionNumber: current.versionNumber,
      });
    }
  }
  return pending;
}

export async function validateAcceptanceSubmissions(input: {
  locale: string;
  audience?: LegalAudience;
  acceptances: AcceptanceSubmission[];
}): Promise<void> {
  const mandatory = await getCurrentPublishedMandatoryVersions({
    locale: input.locale,
    audience: input.audience,
  });
  if (mandatory.length === 0) {
    throw new LegalAcceptanceValidationError(
      "No published mandatory legal documents for this locale."
    );
  }

  const submittedByType = new Map(input.acceptances.map((a) => [a.documentType, a]));

  for (const required of mandatory) {
    const submitted = submittedByType.get(required.legalDocument.documentType);
    if (!submitted) {
      throw new LegalAcceptanceValidationError(
        `Missing acceptance for ${required.legalDocument.documentType}.`
      );
    }
    if (submitted.versionId !== required.id) {
      throw new LegalAcceptanceValidationError(
        `Stale legal document version for ${required.legalDocument.documentType}.`
      );
    }
    const serverHash = hashLegalDocumentContent(required.contentBody);
    if (submitted.contentHash !== serverHash) {
      throw new LegalAcceptanceValidationError(
        `Content hash mismatch for ${required.legalDocument.documentType}.`
      );
    }
    if (!verifyVersionContentHash(required)) {
      throw new LegalAcceptanceValidationError(
        `Stored hash invalid for ${required.legalDocument.documentType}.`
      );
    }
  }

  for (const submitted of input.acceptances) {
    const version = await getPublishedVersionById(submitted.versionId);
    if (!version || version.legalDocument.documentType !== submitted.documentType) {
      throw new LegalAcceptanceValidationError("Invalid legal document version.");
    }
    if (version.locale !== input.locale) {
      throw new LegalAcceptanceValidationError("Legal document locale mismatch.");
    }
    const serverHash = hashLegalDocumentContent(version.contentBody);
    if (submitted.contentHash !== serverHash) {
      throw new LegalAcceptanceValidationError("Submitted hash does not match server.");
    }
  }
}

export async function recordLegalAcceptances(
  input: RecordAcceptancesInput
): Promise<AccountLegalAcceptance[]> {
  await validateAcceptanceSubmissions({
    locale: input.locale,
    audience: input.audience,
    acceptances: input.acceptances,
  });

  await assertC2DatabaseEnvironmentSafe();
  const correlationId = input.registrationCorrelationId ?? randomUUID();
  const method = input.acceptanceMethod ?? "registration_web";
  const now = new Date();
  const created: AccountLegalAcceptance[] = [];

  for (const submission of input.acceptances) {
    const version = await getPublishedVersionById(submission.versionId);
    if (!version) {
      throw new LegalAcceptanceValidationError("Legal document version not found.");
    }

    const existing = await prisma.accountLegalAcceptance.findUnique({
      where: {
        platformAccountId_legalDocumentVersionId: {
          platformAccountId: input.platformAccountId,
          legalDocumentVersionId: submission.versionId,
        },
      },
    });

    if (existing) {
      created.push(existing);
      continue;
    }

    const row = await prisma.accountLegalAcceptance.create({
      data: {
        platformAccountId: input.platformAccountId,
        legalDocumentVersionId: submission.versionId,
        documentHashAtAcceptance: hashLegalDocumentContent(version.contentBody),
        acceptedLocale: input.locale,
        acceptedAt: now,
        acceptanceMethod: method,
        affirmativeActionType: "checkbox_submit",
        registrationCorrelationId: correlationId,
        userAgentSummary: input.userAgentSummary ?? undefined,
      },
    });
    created.push(row);

    await recordPlatformAccountAudit(input.platformAccountId, "legal_acceptance_recorded", {
      legalDocumentVersionId: submission.versionId,
      documentType: submission.documentType,
      registrationCorrelationId: correlationId,
    } satisfies Prisma.InputJsonValue);
  }

  return created;
}

export async function recordReacceptanceForVersion(input: {
  platformAccountId: string;
  versionId: string;
  locale: string;
  userAgentSummary?: string | null;
}): Promise<void> {
  const version = await getPublishedVersionById(input.versionId);
  if (!version) {
    throw new LegalAcceptanceValidationError("Legal document version not found.");
  }
  if (version.locale !== input.locale) {
    throw new LegalAcceptanceValidationError("Legal document locale mismatch.");
  }
  if (version.reacceptancePolicy !== "required_before_protected_activity") {
    throw new LegalAcceptanceValidationError("Reacceptance is not required for this document.");
  }

  const mandatory = await getCurrentPublishedMandatoryVersions({ locale: input.locale });
  const current = mandatory.find(
    (v) => v.legalDocument.documentType === version.legalDocument.documentType
  );
  if (!current || current.id !== version.id) {
    throw new LegalAcceptanceValidationError("Stale legal document version.");
  }

  const prior = await prisma.accountLegalAcceptance.findFirst({
    where: {
      platformAccountId: input.platformAccountId,
      legalDocumentVersion: {
        legalDocument: { documentType: version.legalDocument.documentType },
      },
    },
    orderBy: { acceptedAt: "desc" },
  });

  if (prior?.legalDocumentVersionId === version.id) {
    return;
  }

  await assertC2DatabaseEnvironmentSafe();
  const correlationId = randomUUID();
  const now = new Date();
  const contentHash = hashLegalDocumentContent(version.contentBody);

  await prisma.accountLegalAcceptance.create({
    data: {
      platformAccountId: input.platformAccountId,
      legalDocumentVersionId: version.id,
      documentHashAtAcceptance: contentHash,
      acceptedLocale: input.locale,
      acceptedAt: now,
      acceptanceMethod: "reacceptance_web",
      affirmativeActionType: "checkbox_submit",
      registrationCorrelationId: correlationId,
      userAgentSummary: input.userAgentSummary ?? undefined,
      supersedesAcceptanceId: prior?.id,
    },
  });

  await recordPlatformAccountAudit(input.platformAccountId, "legal_acceptance_recorded", {
    legalDocumentVersionId: version.id,
    documentType: version.legalDocument.documentType,
    registrationCorrelationId: correlationId,
    reacceptance: true,
  } satisfies Prisma.InputJsonValue);
}
