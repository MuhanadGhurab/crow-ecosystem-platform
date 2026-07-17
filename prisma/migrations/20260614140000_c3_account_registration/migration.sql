-- C3 — Universal account registration, email verification, platform account state

CREATE TYPE "PlatformAccountStatus" AS ENUM (
  'PENDING_EMAIL_VERIFICATION',
  'ACTIVE',
  'SUSPENDED',
  'LOCKED',
  'DEACTIVATED'
);

CREATE TYPE "EmailVerificationChallengeStatus" AS ENUM (
  'pending',
  'consumed',
  'expired',
  'revoked'
);

CREATE TYPE "EmailVerificationPurpose" AS ENUM (
  'registration',
  'email_change',
  'reactivation'
);

CREATE TYPE "PlatformAccountAuditEventType" AS ENUM (
  'registration_started',
  'verification_code_sent',
  'verification_succeeded',
  'verification_failed',
  'account_activated',
  'profile_updated',
  'invitation_linked',
  'account_locked'
);

CREATE TABLE "platform_accounts" (
  "id" TEXT NOT NULL,
  "supabaseUserId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "emailNormalized" TEXT NOT NULL,
  "publicAccountId" TEXT NOT NULL,
  "status" "PlatformAccountStatus" NOT NULL DEFAULT 'PENDING_EMAIL_VERIFICATION',
  "registrationSource" TEXT,
  "activatedAt" TIMESTAMP(3),
  "lastVerifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "platform_accounts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "platform_accounts_supabaseUserId_key" ON "platform_accounts"("supabaseUserId");
CREATE UNIQUE INDEX "platform_accounts_emailNormalized_key" ON "platform_accounts"("emailNormalized");
CREATE UNIQUE INDEX "platform_accounts_publicAccountId_key" ON "platform_accounts"("publicAccountId");
CREATE INDEX "platform_accounts_email_idx" ON "platform_accounts"("email");
CREATE INDEX "platform_accounts_status_idx" ON "platform_accounts"("status");

CREATE TABLE "platform_account_profiles" (
  "id" TEXT NOT NULL,
  "platformAccountId" TEXT NOT NULL,
  "displayName" TEXT,
  "handle" TEXT,
  "jobTitle" TEXT,
  "phone" TEXT,
  "preferredLanguage" TEXT,
  "bio" TEXT,
  "isPrivate" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "platform_account_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "platform_account_profiles_platformAccountId_key" ON "platform_account_profiles"("platformAccountId");
CREATE UNIQUE INDEX "platform_account_profiles_handle_key" ON "platform_account_profiles"("handle");

CREATE TABLE "email_verification_challenges" (
  "id" TEXT NOT NULL,
  "platformAccountId" TEXT NOT NULL,
  "emailNormalized" TEXT NOT NULL,
  "purpose" "EmailVerificationPurpose" NOT NULL DEFAULT 'registration',
  "codeHash" TEXT NOT NULL,
  "status" "EmailVerificationChallengeStatus" NOT NULL DEFAULT 'pending',
  "attemptCount" INTEGER NOT NULL DEFAULT 0,
  "maxAttempts" INTEGER NOT NULL DEFAULT 5,
  "sendCount" INTEGER NOT NULL DEFAULT 0,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "consumedAt" TIMESTAMP(3),
  "invalidatedAt" TIMESTAMP(3),
  "lastSentAt" TIMESTAMP(3),
  "deliveryChannel" TEXT NOT NULL DEFAULT 'email',
  "deliveryStatus" TEXT,
  "providerMessageId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "email_verification_challenges_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "email_verification_challenges_platformAccountId_status_idx" ON "email_verification_challenges"("platformAccountId", "status");
CREATE INDEX "email_verification_challenges_emailNormalized_purpose_status_idx" ON "email_verification_challenges"("emailNormalized", "purpose", "status");
CREATE INDEX "email_verification_challenges_expiresAt_idx" ON "email_verification_challenges"("expiresAt");

CREATE TABLE "platform_account_audit_events" (
  "id" TEXT NOT NULL,
  "platformAccountId" TEXT NOT NULL,
  "eventType" "PlatformAccountAuditEventType" NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "platform_account_audit_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "platform_account_audit_events_platformAccountId_createdAt_idx" ON "platform_account_audit_events"("platformAccountId", "createdAt");

ALTER TABLE "platform_account_profiles" ADD CONSTRAINT "platform_account_profiles_platformAccountId_fkey" FOREIGN KEY ("platformAccountId") REFERENCES "platform_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "email_verification_challenges" ADD CONSTRAINT "email_verification_challenges_platformAccountId_fkey" FOREIGN KEY ("platformAccountId") REFERENCES "platform_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "platform_account_audit_events" ADD CONSTRAINT "platform_account_audit_events_platformAccountId_fkey" FOREIGN KEY ("platformAccountId") REFERENCES "platform_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
