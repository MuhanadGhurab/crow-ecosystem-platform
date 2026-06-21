/**
 * C3.10X — Controlled reconciliation for retained Google proof requester (script-safe; no server-only).
 */
import { createClient } from "@supabase/supabase-js";
import type { PrismaClient } from "@prisma/client";

import { computeC3ProofIdentityFingerprint } from "../../src/lib/account/c3-proof-identity-fingerprint";
import { normalizeEmail } from "../../src/lib/account/email-normalize";

const MANDATORY_CLASSIFICATIONS = ["mandatory_contractual", "mandatory_notice"] as const;

const PLATFORM_CONSOLE_ROLES = new Set([
  "platform_admin",
  "implementer",
  "sales",
  "auditor_readonly",
]);

export type StaleMetadataReconcileResult =
  | { ok: true; fingerprint: string; action: "removed" | "already_absent" }
  | { ok: false; reason: string };

type CrowAppMetadata = {
  crow_role?: string;
  tenant_slugs?: string[];
  linked_request_ids?: string[];
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase admin credentials required");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function countCurrentMandatoryLegal(
  prisma: PrismaClient,
  platformAccountId: string,
  locale: string
): Promise<number> {
  const versions = await prisma.legalDocumentVersion.findMany({
    where: {
      status: "published",
      locale,
      audience: "platform_requester",
      mandatoryClassification: { in: [...MANDATORY_CLASSIFICATIONS] },
    },
    include: { legalDocument: true },
    orderBy: [{ legalDocument: { documentType: "asc" } }, { versionNumber: "desc" }],
  });

  const latestByType = new Map<string, string>();
  for (const version of versions) {
    const documentType = version.legalDocument.documentType;
    if (!latestByType.has(documentType)) {
      latestByType.set(documentType, version.id);
    }
  }

  const mandatoryIds = [...latestByType.values()];
  if (mandatoryIds.length === 0) return 0;

  const accepted = await prisma.accountLegalAcceptance.findMany({
    where: { platformAccountId },
    select: { legalDocumentVersionId: true },
  });
  const acceptedIds = new Set(accepted.map((row) => row.legalDocumentVersionId));
  return mandatoryIds.filter((id) => acceptedIds.has(id)).length;
}

async function countContactRequestsForEmail(
  prisma: PrismaClient,
  email: string
): Promise<number> {
  const normalized = normalizeEmail(email);
  return prisma.requestContact.count({
    where: {
      isPrimary: true,
      email: { equals: normalized, mode: "insensitive" },
    },
  });
}

async function recordReconcileAudit(
  prisma: PrismaClient,
  platformAccountId: string,
  metadata: Record<string, unknown>
): Promise<void> {
  await prisma.platformAccountAuditEvent.create({
    data: {
      platformAccountId,
      eventType: "profile_updated",
      metadata,
    },
  });
}

export async function reconcileStaleNonAuthoritativeClientMetadata(
  prisma: PrismaClient,
  input: {
    proofEmailNormalized: string;
    expectedFingerprint: string;
  }
): Promise<StaleMetadataReconcileResult> {
  const admin = getSupabaseAdmin();
  const locale = process.env.CROW_REGISTRATION_LOCALE?.trim() || "en-US";

  const authUsers: { id: string; app_metadata?: Record<string, unknown> }[] = [];
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data.users.length) break;
    for (const user of data.users) {
      if (user.email && normalizeEmail(user.email) === input.proofEmailNormalized) {
        authUsers.push(user);
      }
    }
    if (data.users.length < 200) break;
  }

  if (authUsers.length !== 1) {
    return {
      ok: false,
      reason: `Expected exactly one Supabase Auth user for proof email, found ${authUsers.length}`,
    };
  }

  const authUser = authUsers[0]!;
  const fingerprint = computeC3ProofIdentityFingerprint(authUser.id);
  if (fingerprint !== input.expectedFingerprint) {
    return {
      ok: false,
      reason: `Fingerprint mismatch (expected ${input.expectedFingerprint}, computed ${fingerprint})`,
    };
  }

  const accounts = await prisma.platformAccount.findMany({
    where: { emailNormalized: input.proofEmailNormalized },
  });
  if (accounts.length !== 1) {
    return {
      ok: false,
      reason: `Expected PlatformAccounts=1, found ${accounts.length}`,
    };
  }

  const account = accounts[0]!;
  if (account.supabaseUserId !== authUser.id) {
    return { ok: false, reason: "PlatformAccount not linked to proof Auth user" };
  }

  const legalCount = await countCurrentMandatoryLegal(prisma, account.id, locale);
  if (legalCount !== 0) {
    return {
      ok: false,
      reason: `Expected current mandatory legal=0, found ${legalCount}`,
    };
  }

  const tenantMembershipCount = await prisma.tenantMembership.count({
    where: { supabaseUserId: authUser.id },
  });
  if (tenantMembershipCount !== 0) {
    return {
      ok: false,
      reason: `Expected TenantMemberships=0, found ${tenantMembershipCount}`,
    };
  }

  const submittedRequests = await prisma.implementationRequest.count({
    where: { submittedByUserId: authUser.id },
  });
  const contactRequests = await countContactRequestsForEmail(prisma, account.email);
  if (submittedRequests > 0 || contactRequests > 0) {
    return {
      ok: false,
      reason: "Authoritative client/request-owner relationship exists",
    };
  }

  const meta = (authUser.app_metadata ?? {}) as CrowAppMetadata;
  const crowRole = typeof meta.crow_role === "string" ? meta.crow_role : null;

  if (
    account.emailVerifiedAt &&
    account.status === "PENDING_EMAIL_VERIFICATION" &&
    legalCount === 0
  ) {
    await prisma.platformAccount.update({
      where: { id: account.id },
      data: { status: "PENDING_LEGAL_ACCEPTANCE" },
    });
    await recordReconcileAudit(prisma, account.id, {
      reconciliation: "google_email_verified_pending_legal_status_converged",
      identityFingerprint: fingerprint,
      priorStatus: "PENDING_EMAIL_VERIFICATION",
      nextStatus: "PENDING_LEGAL_ACCEPTANCE",
    });
  }

  if (!crowRole) {
    return { ok: true, fingerprint, action: "already_absent" };
  }

  if (crowRole !== "client") {
    if (
      PLATFORM_CONSOLE_ROLES.has(crowRole) ||
      crowRole === "tenant_admin" ||
      crowRole === "tenant_user"
    ) {
      return { ok: false, reason: `Privileged or authoritative crow_role=${crowRole}` };
    }
    return { ok: false, reason: `Unexpected crow_role=${crowRole}` };
  }

  const nextMeta: Record<string, unknown> = { ...meta };
  delete nextMeta.crow_role;

  const { error: updateError } = await admin.auth.admin.updateUserById(authUser.id, {
    app_metadata: {
      ...nextMeta,
      crow_role: null,
    },
  });
  if (updateError) {
    return { ok: false, reason: `Supabase metadata update failed: ${updateError.message}` };
  }

  await recordReconcileAudit(prisma, account.id, {
    reconciliation: "stale_non_authoritative_client_metadata_removed",
    identityFingerprint: fingerprint,
    priorCrowRole: "client",
  });

  return { ok: true, fingerprint, action: "removed" };
}
