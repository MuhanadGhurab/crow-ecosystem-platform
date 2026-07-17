-- C3 — Legal agreement versioning and consent evidence

-- CreateEnum
CREATE TYPE "LegalDocumentType" AS ENUM ('TERMS_OF_SERVICE', 'PRIVACY_NOTICE', 'ACCEPTABLE_USE_POLICY');

-- CreateEnum
CREATE TYPE "LegalDocumentVersionStatus" AS ENUM ('draft', 'published', 'superseded');

-- CreateEnum
CREATE TYPE "LegalAudience" AS ENUM ('platform_requester');

-- CreateEnum
CREATE TYPE "MandatoryClassification" AS ENUM ('mandatory_contractual', 'mandatory_notice', 'optional_consent');

-- CreateEnum
CREATE TYPE "ReacceptancePolicy" AS ENUM ('none', 'notice_only', 'required_before_protected_activity');

-- CreateEnum
CREATE TYPE "LegalContentFormat" AS ENUM ('markdown');

-- CreateEnum
CREATE TYPE "LegalAcceptanceMethod" AS ENUM ('registration_web', 'reacceptance_web');

-- CreateEnum
CREATE TYPE "AffirmativeActionType" AS ENUM ('checkbox_submit');

-- CreateEnum
CREATE TYPE "ConsentPurpose" AS ENUM ('marketing_email');

-- CreateEnum
CREATE TYPE "ConsentPreferenceSource" AS ENUM ('registration_web', 'account_settings');

-- AlterEnum
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE 'legal_acceptance_recorded';
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE 'consent_preference_updated';
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE 'reacceptance_required';

-- CreateTable
CREATE TABLE "legal_documents" (
    "id" TEXT NOT NULL,
    "documentType" "LegalDocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legal_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_document_versions" (
    "id" TEXT NOT NULL,
    "legalDocumentId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "audience" "LegalAudience" NOT NULL DEFAULT 'platform_requester',
    "title" TEXT NOT NULL,
    "contentFormat" "LegalContentFormat" NOT NULL DEFAULT 'markdown',
    "contentBody" TEXT NOT NULL,
    "contentSchemaVersion" TEXT NOT NULL DEFAULT '1',
    "status" "LegalDocumentVersionStatus" NOT NULL DEFAULT 'draft',
    "mandatoryClassification" "MandatoryClassification" NOT NULL,
    "reacceptancePolicy" "ReacceptancePolicy" NOT NULL DEFAULT 'none',
    "effectiveAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "contentSha256" TEXT NOT NULL,
    "supersedesVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legal_document_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_legal_acceptances" (
    "id" TEXT NOT NULL,
    "platformAccountId" TEXT NOT NULL,
    "legalDocumentVersionId" TEXT NOT NULL,
    "documentHashAtAcceptance" TEXT NOT NULL,
    "acceptedLocale" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptanceMethod" "LegalAcceptanceMethod" NOT NULL DEFAULT 'registration_web',
    "affirmativeActionType" "AffirmativeActionType" NOT NULL DEFAULT 'checkbox_submit',
    "registrationCorrelationId" TEXT,
    "userAgentSummary" TEXT,
    "networkEvidence" JSONB,
    "supersedesAcceptanceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_legal_acceptances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_consent_preferences" (
    "id" TEXT NOT NULL,
    "platformAccountId" TEXT NOT NULL,
    "purpose" "ConsentPurpose" NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT false,
    "grantedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "source" "ConsentPreferenceSource" NOT NULL DEFAULT 'registration_web',
    "registrationCorrelationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_consent_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "legal_documents_documentType_key" ON "legal_documents"("documentType");

-- CreateIndex
CREATE INDEX "legal_document_versions_legalDocumentId_status_locale_audience_idx" ON "legal_document_versions"("legalDocumentId", "status", "locale", "audience");

-- CreateIndex
CREATE INDEX "legal_document_versions_status_locale_audience_idx" ON "legal_document_versions"("status", "locale", "audience");

-- CreateIndex
CREATE UNIQUE INDEX "legal_document_versions_legalDocumentId_versionNumber_locale_audience_key" ON "legal_document_versions"("legalDocumentId", "versionNumber", "locale", "audience");

-- CreateIndex
CREATE INDEX "account_legal_acceptances_platformAccountId_acceptedAt_idx" ON "account_legal_acceptances"("platformAccountId", "acceptedAt");

-- CreateIndex
CREATE INDEX "account_legal_acceptances_registrationCorrelationId_idx" ON "account_legal_acceptances"("registrationCorrelationId");

-- CreateIndex
CREATE UNIQUE INDEX "account_legal_acceptances_platformAccountId_legalDocumentVersionId_key" ON "account_legal_acceptances"("platformAccountId", "legalDocumentVersionId");

-- CreateIndex
CREATE INDEX "account_consent_preferences_platformAccountId_idx" ON "account_consent_preferences"("platformAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "account_consent_preferences_platformAccountId_purpose_key" ON "account_consent_preferences"("platformAccountId", "purpose");

-- AddForeignKey
ALTER TABLE "legal_document_versions" ADD CONSTRAINT "legal_document_versions_legalDocumentId_fkey" FOREIGN KEY ("legalDocumentId") REFERENCES "legal_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_document_versions" ADD CONSTRAINT "legal_document_versions_supersedesVersionId_fkey" FOREIGN KEY ("supersedesVersionId") REFERENCES "legal_document_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_legal_acceptances" ADD CONSTRAINT "account_legal_acceptances_platformAccountId_fkey" FOREIGN KEY ("platformAccountId") REFERENCES "platform_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_legal_acceptances" ADD CONSTRAINT "account_legal_acceptances_legalDocumentVersionId_fkey" FOREIGN KEY ("legalDocumentVersionId") REFERENCES "legal_document_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_legal_acceptances" ADD CONSTRAINT "account_legal_acceptances_supersedesAcceptanceId_fkey" FOREIGN KEY ("supersedesAcceptanceId") REFERENCES "account_legal_acceptances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_consent_preferences" ADD CONSTRAINT "account_consent_preferences_platformAccountId_fkey" FOREIGN KEY ("platformAccountId") REFERENCES "platform_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
