/**
 * Sanitized hosted DB / auth evidence for C3 Preview controlled E2E.
 * Never logs emails, OTPs, passwords, or raw row IDs in reports.
 */
import { createClient } from "@supabase/supabase-js";
import type { PrismaClient } from "@prisma/client";
import { normalizeEmail } from "../../src/lib/account/email-normalize";
import { getCrowAuth } from "../../src/lib/auth/roles";

export type C3EvidenceSnapshot = {
  phase: string;
  supabaseEmailConfirmed: boolean | null;
  platformAccountStatus: string | null;
  mandatoryLegalAcceptanceCount: number;
  pendingChallenges: number;
  consumedChallenges: number;
  challengeHasPlaintextCode: boolean;
  otpStoredAsHashOnly: boolean;
  crowRole: string | null;
  tenantSlugCount: number;
  tenantMembershipCount: number;
  implementationRequestCount: number;
};

function redactId(id: string | null | undefined): string {
  if (!id) return "(none)";
  if (id.length <= 8) return "***";
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
}

export async function collectC3Evidence(
  prisma: PrismaClient,
  email: string,
  phase: string
): Promise<C3EvidenceSnapshot> {
  const emailNormalized = normalizeEmail(email);
  const account = await prisma.platformAccount.findFirst({
    where: { emailNormalized },
    include: {
      verificationChallenges: {
        where: { purpose: "registration" },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  let supabaseEmailConfirmed: boolean | null = null;
  let crowRole: string | null = null;
  let tenantSlugCount = 0;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (account && supabaseUrl && serviceKey) {
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data } = await admin.auth.admin.getUserById(account.supabaseUserId);
    const user = data.user;
    if (user) {
      supabaseEmailConfirmed = Boolean(user.email_confirmed_at);
      const auth = getCrowAuth(user);
      crowRole = auth.role;
      tenantSlugCount = auth.tenantSlugs.length;
    }
  }

  const mandatoryLegalAcceptanceCount = account
    ? await prisma.legalAcceptance.count({
        where: {
          platformAccountId: account.id,
          legalDocumentVersion: {
            legalDocument: { mandatoryClassification: "mandatory_contractual" },
          },
        },
      })
    : 0;

  const tenantMembershipCount = account
    ? await prisma.tenantMembership.count({
        where: { userId: account.supabaseUserId },
      })
    : 0;

  const implementationRequestCount = account
    ? await prisma.implementationRequest.count({
        where: { submittedByUserId: account.supabaseUserId },
      })
    : 0;

  const challenges = account?.verificationChallenges ?? [];
  const pendingChallenges = challenges.filter((c) => c.status === "pending").length;
  const consumedChallenges = challenges.filter((c) => c.status === "consumed").length;

  const latest = challenges[0];
  const otpStoredAsHashOnly = latest
    ? Boolean(latest.codeHash) && !/\d{6}/.test(latest.codeHash)
    : true;
  const challengeHasPlaintextCode = challenges.some(
    (c) => "code" in (c as object) || /\b\d{6}\b/.test(c.codeHash)
  );

  const snapshot: C3EvidenceSnapshot = {
    phase,
    supabaseEmailConfirmed,
    platformAccountStatus: account?.status ?? null,
    mandatoryLegalAcceptanceCount,
    pendingChallenges,
    consumedChallenges,
    challengeHasPlaintextCode,
    otpStoredAsHashOnly,
    crowRole,
    tenantSlugCount,
    tenantMembershipCount,
    implementationRequestCount,
  };

  console.log(
    `  [evidence:${phase}] account=${redactId(account?.id)} status=${snapshot.platformAccountStatus} ` +
      `supabaseConfirmed=${snapshot.supabaseEmailConfirmed} legal=${snapshot.mandatoryLegalAcceptanceCount} ` +
      `challenges pending=${snapshot.pendingChallenges} consumed=${snapshot.consumedChallenges} ` +
      `role=${snapshot.crowRole ?? "none"} memberships=${snapshot.tenantMembershipCount} erp=${snapshot.implementationRequestCount}`
  );

  return snapshot;
}
