import type { LegalDocumentType, LegalDocumentVersionStatus } from "@prisma/client";

export type LegalVersionFixture = {
  id: string;
  documentType: LegalDocumentType;
  versionNumber: number;
  status: LegalDocumentVersionStatus;
  reacceptancePolicy: "none" | "notice_only" | "required_before_protected_activity";
};

export type AcceptanceFixture = {
  documentType: LegalDocumentType;
  legalDocumentVersionId: string;
};

/** Pure reacceptance logic — draft/reviewed/approved versions never trigger gates. */
export function computePendingReacceptanceFromFixtures(input: {
  publishedVersions: LegalVersionFixture[];
  acceptances: AcceptanceFixture[];
}): LegalDocumentType[] {
  const currentPublished = input.publishedVersions.filter((v) => v.status === "published");
  const latestByType = new Map<LegalDocumentType, LegalVersionFixture>();
  for (const v of currentPublished) {
    const existing = latestByType.get(v.documentType);
    if (!existing || v.versionNumber > existing.versionNumber) {
      latestByType.set(v.documentType, v);
    }
  }

  const latestAcceptedByType = new Map<LegalDocumentType, string>();
  for (const a of input.acceptances) {
    if (!latestAcceptedByType.has(a.documentType)) {
      latestAcceptedByType.set(a.documentType, a.legalDocumentVersionId);
    }
  }

  const pending: LegalDocumentType[] = [];
  for (const [type, current] of latestByType) {
    if (current.reacceptancePolicy !== "required_before_protected_activity") continue;
    const acceptedId = latestAcceptedByType.get(type);
    if (acceptedId !== current.id) {
      pending.push(type);
    }
  }
  return pending;
}
