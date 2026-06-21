-- C3.8 — dual-channel onboarding, phone verification, enrollment generation

-- AlterEnum
ALTER TYPE "PlatformAccountStatus" ADD VALUE IF NOT EXISTS 'PENDING_LEGAL_ACCEPTANCE';
ALTER TYPE "PlatformAccountStatus" ADD VALUE IF NOT EXISTS 'PENDING_PHONE_VERIFICATION';

-- AlterTable
ALTER TABLE "platform_accounts" ADD COLUMN IF NOT EXISTS "onboardingGeneration" INTEGER NOT NULL DEFAULT 2;
ALTER TABLE "platform_accounts" ADD COLUMN IF NOT EXISTS "emailVerifiedAt" TIMESTAMP(3);
ALTER TABLE "platform_accounts" ADD COLUMN IF NOT EXISTS "emailVerificationSource" TEXT;
ALTER TABLE "platform_accounts" ADD COLUMN IF NOT EXISTS "phoneNormalized" TEXT;
ALTER TABLE "platform_accounts" ADD COLUMN IF NOT EXISTS "phoneMasked" TEXT;
ALTER TABLE "platform_accounts" ADD COLUMN IF NOT EXISTS "phoneVerifiedAt" TIMESTAMP(3);
ALTER TABLE "platform_accounts" ADD COLUMN IF NOT EXISTS "phoneVerificationSource" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "platform_accounts_phoneNormalized_key" ON "platform_accounts"("phoneNormalized");

-- CreateEnum
CREATE TYPE "PhoneVerificationChallengeStatus" AS ENUM ('pending', 'consumed', 'expired', 'revoked');
CREATE TYPE "PhoneVerificationPurpose" AS ENUM ('registration', 'phone_change', 'reactivation');
CREATE TYPE "PlatformAuthProvider" AS ENUM ('google', 'microsoft', 'apple', 'email_password');

-- AlterEnum PlatformAccountAuditEventType
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE IF NOT EXISTS 'phone_verification_code_sent';
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE IF NOT EXISTS 'phone_verification_succeeded';
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE IF NOT EXISTS 'phone_verification_failed';
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE IF NOT EXISTS 'email_verification_recorded';
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE IF NOT EXISTS 'provider_identity_linked';

-- CreateTable
CREATE TABLE "phone_verification_challenges" (
    "id" TEXT NOT NULL,
    "platformAccountId" TEXT NOT NULL,
    "phoneNormalized" TEXT NOT NULL,
    "purpose" "PhoneVerificationPurpose" NOT NULL DEFAULT 'registration',
    "codeHash" TEXT NOT NULL,
    "status" "PhoneVerificationChallengeStatus" NOT NULL DEFAULT 'pending',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "sendCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "invalidatedAt" TIMESTAMP(3),
    "lastSentAt" TIMESTAMP(3),
    "deliveryChannel" TEXT NOT NULL DEFAULT 'sms',
    "deliveryStatus" TEXT,
    "providerMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phone_verification_challenges_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "platform_provider_identities" (
    "id" TEXT NOT NULL,
    "platformAccountId" TEXT NOT NULL,
    "provider" "PlatformAuthProvider" NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "emailNormalized" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_provider_identities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "phone_verification_challenges_platformAccountId_status_idx" ON "phone_verification_challenges"("platformAccountId", "status");
CREATE INDEX "phone_verification_challenges_phoneNormalized_purpose_status_idx" ON "phone_verification_challenges"("phoneNormalized", "purpose", "status");
CREATE INDEX "phone_verification_challenges_expiresAt_idx" ON "phone_verification_challenges"("expiresAt");

CREATE INDEX "platform_provider_identities_platformAccountId_idx" ON "platform_provider_identities"("platformAccountId");
CREATE INDEX "platform_provider_identities_emailNormalized_idx" ON "platform_provider_identities"("emailNormalized");
CREATE UNIQUE INDEX "platform_provider_identities_provider_providerUserId_key" ON "platform_provider_identities"("provider", "providerUserId");

ALTER TABLE "phone_verification_challenges" ADD CONSTRAINT "phone_verification_challenges_platformAccountId_fkey" FOREIGN KEY ("platformAccountId") REFERENCES "platform_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "platform_provider_identities" ADD CONSTRAINT "platform_provider_identities_platformAccountId_fkey" FOREIGN KEY ("platformAccountId") REFERENCES "platform_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Legacy accounts: generation 1 (pre C3.8 dual-channel)
UPDATE "platform_accounts" SET "onboardingGeneration" = 1 WHERE "onboardingGeneration" = 2 AND "status" = 'ACTIVE';

-- C3.8 — deny PostgREST client access to new dual-channel tables (server-side Prisma only)
ALTER TABLE "phone_verification_challenges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "platform_provider_identities" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "phone_verification_challenges" FROM anon, authenticated;
REVOKE ALL ON TABLE "platform_provider_identities" FROM anon, authenticated;
