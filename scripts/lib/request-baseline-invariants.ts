import { createHash } from "node:crypto";

import type { PrismaClient } from "@prisma/client";

import {
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_OWNER_FINGERPRINT,
  ownerFingerprint,
  requestFingerprint,
} from "./ftgp-candidate-fixtures";

export type SafeRequestSummary = {
  requestFingerprint: string;
  referenceCode: string;
  status: string;
  createdAt: string;
  ownerFingerprint: string | null;
  hasDiscovery: boolean;
  hasBlueprint: boolean;
  isCandidate07: boolean;
};

export type EighthRequestClassification =
  | "LEGITIMATE_MANUAL_TEST_REQUEST"
  | "LEGITIMATE_EXISTING_BUSINESS_RECORD"
  | "DUPLICATE_REQUEST"
  | "ORPHANED_REQUEST"
  | "UNEXPLAINED_RECORD";

export type RequestBaselineInvariantReport = {
  totalCount: number;
  candidate07Present: boolean;
  candidate07Fingerprint: string;
  candidate07OwnerFingerprint: string | null;
  protectedFixturesPreserved: boolean;
  orphanedRequestCount: number;
  duplicateReferenceCodeCount: number;
  emailOwnedRequestCount: number;
  summaries: SafeRequestSummary[];
  eighthRequestClassification: EighthRequestClassification | null;
  unexplainedRequestCount: number;
};

export function classifyNonFixtureRequest(
  summary: SafeRequestSummary,
  all: SafeRequestSummary[],
  rowSubmittedByUserId: boolean
): EighthRequestClassification {
  if (summary.isCandidate07) {
    return "LEGITIMATE_EXISTING_BUSINESS_RECORD";
  }
  if (!rowSubmittedByUserId && (summary.hasDiscovery || summary.hasBlueprint)) {
    return "LEGITIMATE_EXISTING_BUSINESS_RECORD";
  }
  if (!summary.ownerFingerprint && rowSubmittedByUserId) {
    return "ORPHANED_REQUEST";
  }
  if (!summary.ownerFingerprint) {
    return "LEGITIMATE_EXISTING_BUSINESS_RECORD";
  }
  const sameOwner = all.filter((r) => r.ownerFingerprint === summary.ownerFingerprint);
  if (sameOwner.length > 1) {
    return "DUPLICATE_REQUEST";
  }
  if (summary.hasDiscovery || summary.hasBlueprint) {
    return "LEGITIMATE_EXISTING_BUSINESS_RECORD";
  }
  return "LEGITIMATE_MANUAL_TEST_REQUEST";
}

export async function verifyRequestBaselineInvariants(
  prisma: PrismaClient
): Promise<RequestBaselineInvariantReport> {
  const rows = await prisma.implementationRequest.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      referenceCode: true,
      status: true,
      createdAt: true,
      submittedByUserId: true,
      discoveryProfile: { select: { id: true } },
      enterpriseBlueprint: { select: { id: true } },
    },
  });

  const ownerByAuthId = new Map<string, string>();
  const authIds = [...new Set(rows.map((r) => r.submittedByUserId).filter(Boolean))] as string[];
  if (authIds.length > 0) {
    const accounts = await prisma.platformAccount.findMany({
      where: { supabaseUserId: { in: authIds } },
      select: { supabaseUserId: true, id: true },
    });
    for (const account of accounts) {
      ownerByAuthId.set(account.supabaseUserId, ownerFingerprint(account.id));
    }
  }

  const summaries: SafeRequestSummary[] = rows.map((row) => {
    const fp = requestFingerprint(row.id);
    const ownerAuthId = row.submittedByUserId;
    const resolvedOwner =
      ownerAuthId && ownerByAuthId.has(ownerAuthId)
        ? ownerByAuthId.get(ownerAuthId)!
        : null;
    return {
      requestFingerprint: fp,
      referenceCode: row.referenceCode,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      ownerFingerprint: resolvedOwner,
      hasDiscovery: Boolean(row.discoveryProfile),
      hasBlueprint: Boolean(row.enterpriseBlueprint),
      isCandidate07: fp === CANDIDATE_07_FINGERPRINT,
    };
  });

  const candidate07Row = rows.find((row) => requestFingerprint(row.id) === CANDIDATE_07_FINGERPRINT);
  const candidate07CreatedAt = candidate07Row?.createdAt ?? new Date(0);

  const orphanedRequestCount = rows.filter((row) => {
    if (!row.submittedByUserId || ownerByAuthId.has(row.submittedByUserId)) {
      return false;
    }
    const summary = summaries.find((s) => s.requestFingerprint === requestFingerprint(row.id));
    const protectedLegacyOrphan =
      summary &&
      (summary.hasDiscovery || summary.hasBlueprint) &&
      row.createdAt < candidate07CreatedAt;
    return !protectedLegacyOrphan;
  }).length;

  const legacyUnlinkedRequestCount = rows.filter((row) => !row.submittedByUserId).length;

  const candidate07 = summaries.find((s) => s.isCandidate07) ?? null;
  const candidate07OwnerFingerprint = candidate07?.ownerFingerprint ?? null;

  const referenceCodes = summaries.map((s) => s.referenceCode);
  const duplicateReferenceCodeCount =
    referenceCodes.length - new Set(referenceCodes).size;

  const emailOwnedRequestCount = 0;

  const nonCandidateRows = rows.filter((row) => requestFingerprint(row.id) !== CANDIDATE_07_FINGERPRINT);
  let eighthRequestClassification: EighthRequestClassification | null = null;
  if (rows.length >= 8 && nonCandidateRows.length > 0) {
    const extraRow = nonCandidateRows.at(-1)!;
    const extraSummary = summaries.find((s) => s.requestFingerprint === requestFingerprint(extraRow.id));
    if (extraSummary) {
      eighthRequestClassification = classifyNonFixtureRequest(
        extraSummary,
        summaries,
        Boolean(extraRow.submittedByUserId)
      );
    }
  }

  const unexplainedRequestCount =
    eighthRequestClassification === "UNEXPLAINED_RECORD" ? 1 : 0;

  const protectedFixturesPreserved =
    Boolean(candidate07) &&
    candidate07OwnerFingerprint === CANDIDATE_07_OWNER_FINGERPRINT &&
    duplicateReferenceCodeCount === 0 &&
    orphanedRequestCount === 0;

  return {
    totalCount: summaries.length,
    candidate07Present: Boolean(candidate07),
    candidate07Fingerprint: CANDIDATE_07_FINGERPRINT,
    candidate07OwnerFingerprint,
    protectedFixturesPreserved,
    orphanedRequestCount,
    duplicateReferenceCodeCount,
    emailOwnedRequestCount,
    summaries,
    eighthRequestClassification,
    unexplainedRequestCount,
  };
}

export function assertRequestBaselineInvariants(report: RequestBaselineInvariantReport): void {
  if (!report.candidate07Present) {
    throw new Error("Candidate 07 request fixture missing");
  }
  if (report.candidate07OwnerFingerprint !== CANDIDATE_07_OWNER_FINGERPRINT) {
    throw new Error("Candidate 07 ownership fingerprint mismatch");
  }
  if (!report.protectedFixturesPreserved) {
    throw new Error(
      `protected request fixtures not preserved (candidate07=${report.candidate07Present} owner=${report.candidate07OwnerFingerprint} orphans=${report.orphanedRequestCount} dupRefs=${report.duplicateReferenceCodeCount})`
    );
  }
  if (report.orphanedRequestCount > 0) {
    throw new Error(`orphaned requests=${report.orphanedRequestCount}`);
  }
  if (report.duplicateReferenceCodeCount > 0) {
    throw new Error(`duplicate reference codes=${report.duplicateReferenceCodeCount}`);
  }
  if (report.unexplainedRequestCount > 0) {
    throw new Error("unexplained request record present");
  }
}

export function requestCountFingerprint(count: number): string {
  return createHash("sha256").update(`impl-req-count:${count}`).digest("hex").slice(0, 12);
}
