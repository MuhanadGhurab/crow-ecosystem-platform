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
  onboardingGeneration: number | null;
  emailVerificationSource: string | null;
  phoneVerifiedAt: boolean;
  mandatoryLegalAcceptanceCount: number;
  pendingEmailChallenges: number;
  consumedEmailChallenges: number;
  phoneVerificationChallengeCount: number;
  providerIdentityCount: number;
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
    ? await prisma.accountLegalAcceptance.count({
        where: {
          platformAccountId: account.id,
          legalDocumentVersion: {
            mandatoryClassification: {
              in: ["mandatory_contractual", "mandatory_notice"],
            },
          },
        },
      })
    : 0;

  const tenantMembershipCount = account
    ? await prisma.tenantMembership.count({
        where: { supabaseUserId: account.supabaseUserId },
      })
    : 0;

  const implementationRequestCount = account
    ? await prisma.implementationRequest.count({
        where: { submittedByUserId: account.supabaseUserId },
      })
    : 0;

  const phoneVerificationChallengeCount = account
    ? await prisma.phoneVerificationChallenge.count({
        where: { platformAccountId: account.id },
      })
    : 0;

  const providerIdentityCount = account
    ? await prisma.platformProviderIdentity.count({
        where: { platformAccountId: account.id },
      })
    : 0;

  const challenges = account?.verificationChallenges ?? [];
  const pendingEmailChallenges = challenges.filter((c) => c.status === "pending").length;
  const consumedEmailChallenges = challenges.filter((c) => c.status === "consumed").length;

  const latest = challenges[0];
  /** Plaintext OTP is exactly six digits; HMAC-SHA256 hex is 64 chars and may contain digit runs. */
  const looksLikePlaintextOtp = (hash: string) => /^\d{6}$/.test(hash);
  const otpStoredAsHashOnly = latest
    ? Boolean(latest.codeHash) && !looksLikePlaintextOtp(latest.codeHash)
    : true;
  const challengeHasPlaintextCode = challenges.some(
    (c) => "code" in (c as object) || looksLikePlaintextOtp(c.codeHash)
  );

  const snapshot: C3EvidenceSnapshot = {
    phase,
    supabaseEmailConfirmed,
    platformAccountStatus: account?.status ?? null,
    onboardingGeneration: account?.onboardingGeneration ?? null,
    emailVerificationSource: account?.emailVerificationSource ?? null,
    phoneVerifiedAt: Boolean(account?.phoneVerifiedAt),
    mandatoryLegalAcceptanceCount,
    pendingEmailChallenges,
    consumedEmailChallenges,
    phoneVerificationChallengeCount,
    providerIdentityCount,
    challengeHasPlaintextCode,
    otpStoredAsHashOnly,
    crowRole,
    tenantSlugCount,
    tenantMembershipCount,
    implementationRequestCount,
  };

  console.log(
    `  [evidence:${phase}] account=${redactId(account?.id)} status=${snapshot.platformAccountStatus} ` +
      `gen=${snapshot.onboardingGeneration} supabaseConfirmed=${snapshot.supabaseEmailConfirmed} ` +
      `legal=${snapshot.mandatoryLegalAcceptanceCount} emailChallenges pending=${snapshot.pendingEmailChallenges} ` +
      `phoneChallenges=${snapshot.phoneVerificationChallengeCount} role=${snapshot.crowRole ?? "none"} ` +
      `memberships=${snapshot.tenantMembershipCount}`
  );

  return snapshot;
}

export function assertPreOtpEvidence(snapshot: C3EvidenceSnapshot): void {
  if (snapshot.platformAccountStatus === "ACTIVE") {
    throw new Error("PlatformAccount must not be ACTIVE before OTP");
  }
  if (snapshot.onboardingGeneration !== 2) {
    throw new Error(`Expected onboarding generation 2, got ${snapshot.onboardingGeneration}`);
  }
  if (snapshot.mandatoryLegalAcceptanceCount < 3) {
    throw new Error(`Expected legal=3, got ${snapshot.mandatoryLegalAcceptanceCount}`);
  }
  if (snapshot.pendingEmailChallenges < 1) {
    throw new Error("Expected one pending email challenge before OTP");
  }
  if (!snapshot.otpStoredAsHashOnly) {
    throw new Error("OTP must be stored as hash only");
  }
  if (snapshot.phoneVerificationChallengeCount !== 0) {
    throw new Error(`Expected zero phone challenges, got ${snapshot.phoneVerificationChallengeCount}`);
  }
  if (snapshot.crowRole && snapshot.crowRole !== "requester") {
    throw new Error("Unexpected Crow role before activation");
  }
  if (snapshot.tenantMembershipCount > 0) {
    throw new Error("Tenant membership must not exist before activation");
  }
}

export function assertPostOtpEvidence(snapshot: C3EvidenceSnapshot): void {
  if (!snapshot.supabaseEmailConfirmed) {
    throw new Error("Supabase email must be confirmed after OTP");
  }
  if (snapshot.platformAccountStatus !== "ACTIVE") {
    throw new Error(`PlatformAccount must be ACTIVE after OTP, got ${snapshot.platformAccountStatus}`);
  }
  if (snapshot.onboardingGeneration !== 2) {
    throw new Error(`Expected generation 2 after OTP, got ${snapshot.onboardingGeneration}`);
  }
  if (snapshot.emailVerificationSource !== "CROW_EMAIL_OTP") {
    throw new Error(
      `Expected email source CROW_EMAIL_OTP, got ${snapshot.emailVerificationSource ?? "null"}`
    );
  }
  if (snapshot.mandatoryLegalAcceptanceCount < 3) {
    throw new Error(`Legal evidence incomplete after OTP (${snapshot.mandatoryLegalAcceptanceCount})`);
  }
  if (snapshot.phoneVerifiedAt) {
    throw new Error("Phone must remain unverified in email-only proof");
  }
  if (snapshot.phoneVerificationChallengeCount !== 0) {
    throw new Error(`Phone challenges must remain zero (${snapshot.phoneVerificationChallengeCount})`);
  }
  if (snapshot.tenantMembershipCount > 0) {
    throw new Error("No tenant membership after activation");
  }
  if (snapshot.crowRole && !["requester", null].includes(snapshot.crowRole)) {
    throw new Error(`Unexpected role after activation: ${snapshot.crowRole}`);
  }
}
