/**
 * C3.10V — Non-destructive authoritative evidence for Google proof checkpoints (no PII).
 */
import { createClient, type User } from "@supabase/supabase-js";
import type { LegalDocumentType, PrismaClient } from "@prisma/client";
import { normalizeEmail } from "../../src/lib/account/email-normalize";
import { computeC3ProofIdentityFingerprint } from "../../src/lib/account/c3-proof-identity-fingerprint";
import { EMAIL_VERIFICATION_SOURCES } from "../../src/lib/account/verification-sources";
import { requireGoogleProofOperatorEnv } from "./c3-google-proof-identity-resolution";

const MANDATORY_CLASSIFICATIONS = ["mandatory_contractual", "mandatory_notice"] as const;

type CurrentMandatoryVersion = {
  id: string;
  documentType: LegalDocumentType;
};

async function listCurrentMandatoryVersions(
  prisma: PrismaClient,
  locale: string
): Promise<CurrentMandatoryVersion[]> {
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

  const latestByType = new Map<LegalDocumentType, CurrentMandatoryVersion>();
  for (const version of versions) {
    const documentType = version.legalDocument.documentType;
    if (!latestByType.has(documentType)) {
      latestByType.set(documentType, { id: version.id, documentType });
    }
  }
  return [...latestByType.values()];
}

export type GoogleProofCheckpointEvidence = {
  identityFingerprint: string;
  googleIdentityPresent: boolean;
  platformAccountCount: number;
  profileCount: number;
  platformAccountStatus: string | null;
  onboardingGeneration: number | null;
  emailVerificationSource: string | null;
  currentMandatoryLegalCount: number;
  mandatoryLegalTotal: number;
  currentTermsAccepted: boolean;
  currentPrivacyAccepted: boolean;
  currentAupAccepted: boolean;
  crowRolePresent: boolean;
  tenantMembershipCount: number;
  emailChallengeCount: number;
  phoneChallengeCount: number;
};

function optionalFingerprintBindingCheck(computed: string): void {
  const expected = process.env.C3_EXPECTED_PROOF_IDENTITY_FINGERPRINT?.trim();
  if (expected && expected !== computed) {
    throw new Error(
      `Browser/verifier fingerprint binding mismatch (expected ${expected}, computed ${computed})`
    );
  }
}

async function listAuthUsersByEmail(
  admin: ReturnType<typeof createClient>,
  emailNormalized: string
): Promise<User[]> {
  const matches: User[] = [];
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data.users.length) break;
    for (const user of data.users) {
      if (user.email && normalizeEmail(user.email) === emailNormalized) {
        matches.push(user);
      }
    }
    if (data.users.length < 200) break;
  }
  return matches;
}

function hasGoogleIdentity(user: User): boolean {
  return user.identities?.some((identity) => identity.provider === "google") ?? false;
}

async function countCurrentMandatoryLegal(
  prisma: PrismaClient,
  platformAccountId: string,
  locale: string
): Promise<number> {
  const mandatory = await listCurrentMandatoryVersions(prisma, locale);
  if (mandatory.length === 0) return 0;
  const accepted = await prisma.accountLegalAcceptance.findMany({
    where: { platformAccountId },
    select: { legalDocumentVersionId: true },
  });
  const acceptedIds = new Set(accepted.map((row) => row.legalDocumentVersionId));
  return mandatory.filter((version) => acceptedIds.has(version.id)).length;
}

async function hasCurrentAcceptanceForType(
  prisma: PrismaClient,
  platformAccountId: string,
  locale: string,
  documentType: LegalDocumentType
): Promise<boolean> {
  const mandatory = await listCurrentMandatoryVersions(prisma, locale);
  const current = mandatory.find((version) => version.documentType === documentType);
  if (!current) return false;
  const row = await prisma.accountLegalAcceptance.findFirst({
    where: {
      platformAccountId,
      legalDocumentVersionId: current.id,
    },
  });
  return Boolean(row);
}

export function isPendingLegalCheckpointStatus(
  status: string | null,
  legalCount: number,
  emailVerificationSource: string | null
): boolean {
  if (status === "PENDING_LEGAL_ACCEPTANCE") return true;
  if (legalCount > 0) return false;
  if (status === "ACTIVE" || status === "SUSPENDED" || status === "LOCKED") return false;
  if (
    status === "PENDING_EMAIL_VERIFICATION" &&
    emailVerificationSource === EMAIL_VERIFICATION_SOURCES.GOOGLE_OAUTH_VERIFIED
  ) {
    return true;
  }
  return legalCount === 0 && status !== null && status !== "ACTIVE";
}

export async function collectGoogleProofCheckpointEvidence(
  prisma: PrismaClient
): Promise<GoogleProofCheckpointEvidence> {
  const { emailNormalized } = requireGoogleProofOperatorEnv();
  const locale = process.env.CROW_REGISTRATION_LOCALE?.trim() || "en-US";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase admin credentials required");
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const authUsers = await listAuthUsersByEmail(admin, emailNormalized);
  if (authUsers.length !== 1) {
    throw new Error(
      `Expected exactly one Supabase Auth user for proof email, found ${authUsers.length}`
    );
  }

  const authUser = authUsers[0]!;
  const identityFingerprint = computeC3ProofIdentityFingerprint(authUser.id);
  optionalFingerprintBindingCheck(identityFingerprint);

  const accounts = await prisma.platformAccount.findMany({
    where: { emailNormalized },
  });

  const account = accounts.length === 1 ? accounts[0]! : null;
  const mandatoryVersions = await listCurrentMandatoryVersions(prisma, locale);
  const mandatoryTotal = mandatoryVersions.length;
  const legalCount = account
    ? await countCurrentMandatoryLegal(prisma, account.id, locale)
    : 0;

  const googleProviders = account
    ? await prisma.platformProviderIdentity.count({
        where: { platformAccountId: account.id, provider: "google" },
      })
    : 0;

  const tenantMembershipCount = account
    ? await prisma.tenantMembership.count({
        where: { supabaseUserId: account.supabaseUserId },
      })
    : 0;

  const emailChallengeCount = account
    ? await prisma.emailVerificationChallenge.count({
        where: { platformAccountId: account.id },
      })
    : 0;

  const phoneChallengeCount = account
    ? await prisma.phoneVerificationChallenge.count({
        where: { platformAccountId: account.id },
      })
    : 0;

  const profileCount = account
    ? await prisma.platformAccountProfile.count({
        where: { platformAccountId: account.id },
      })
    : 0;

  const crowRole =
    typeof authUser.app_metadata?.crow_role === "string"
      ? authUser.app_metadata.crow_role
      : null;

  return {
    identityFingerprint,
    googleIdentityPresent: hasGoogleIdentity(authUser) || googleProviders > 0,
    platformAccountCount: accounts.length,
    profileCount,
    platformAccountStatus: account?.status ?? null,
    onboardingGeneration: account?.onboardingGeneration ?? null,
    emailVerificationSource: account?.emailVerificationSource ?? null,
    currentMandatoryLegalCount: legalCount,
    mandatoryLegalTotal: mandatoryTotal,
    currentTermsAccepted: account
      ? await hasCurrentAcceptanceForType(prisma, account.id, locale, "TERMS_OF_SERVICE")
      : false,
    currentPrivacyAccepted: account
      ? await hasCurrentAcceptanceForType(prisma, account.id, locale, "PRIVACY_NOTICE")
      : false,
    currentAupAccepted: account
      ? await hasCurrentAcceptanceForType(prisma, account.id, locale, "ACCEPTABLE_USE_POLICY")
      : false,
    crowRolePresent: Boolean(crowRole),
    tenantMembershipCount,
    emailChallengeCount,
    phoneChallengeCount,
  };
}

export function printCheckpointEvidence(
  label: string,
  evidence: GoogleProofCheckpointEvidence
): void {
  console.log(`\n=== ${label} ===\n`);
  console.log(`  identityFingerprint: ${evidence.identityFingerprint}`);
  console.log(`  googleIdentityPresent: ${evidence.googleIdentityPresent}`);
  console.log(`  platformAccountCount: ${evidence.platformAccountCount}`);
  console.log(`  profileCount: ${evidence.profileCount}`);
  console.log(`  platformAccountStatus: ${evidence.platformAccountStatus ?? "(none)"}`);
  console.log(`  onboardingGeneration: ${evidence.onboardingGeneration ?? "(none)"}`);
  console.log(`  emailVerificationSource: ${evidence.emailVerificationSource ?? "(none)"}`);
  console.log(
    `  currentMandatoryLegal: ${evidence.currentMandatoryLegalCount}/${evidence.mandatoryLegalTotal}`
  );
  console.log(`  currentTermsAccepted: ${evidence.currentTermsAccepted}`);
  console.log(`  currentPrivacyAccepted: ${evidence.currentPrivacyAccepted}`);
  console.log(`  currentAupAccepted: ${evidence.currentAupAccepted}`);
  console.log(`  crowRolePresent: ${evidence.crowRolePresent}`);
  console.log(`  tenantMembershipCount: ${evidence.tenantMembershipCount}`);
  console.log(`  emailChallengeCount: ${evidence.emailChallengeCount}`);
  console.log(`  phoneChallengeCount: ${evidence.phoneChallengeCount}`);
  console.log("");
}
