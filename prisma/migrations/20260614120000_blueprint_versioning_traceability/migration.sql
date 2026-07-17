-- CreateEnum
CREATE TYPE "BlueprintVersionStatus" AS ENUM ('DISCOVERY_DRAFT', 'BLUEPRINT_DRAFT', 'INTERNAL_REVIEW', 'CLIENT_REVIEW', 'CHANGES_REQUESTED', 'APPROVAL_PENDING', 'APPROVED', 'CONFIGURATION_PROPOSED', 'SUPERSEDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BlueprintVersionProvenance" AS ENUM ('LEGACY_IMPORT', 'STUDIO_CAPTURE', 'NEXT_VERSION', 'BACKFILL', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "BlueprintTraceActorType" AS ENUM ('HUMAN', 'AI_ASSISTANT', 'AUTOMATION', 'SERVICE_ACCOUNT', 'INTEGRATION', 'SYSTEM_PROCESS');

-- CreateEnum
CREATE TYPE "BlueprintApprovalDecision" AS ENUM ('APPROVED', 'REJECTED', 'CHANGES_REQUESTED');

-- CreateEnum
CREATE TYPE "BlueprintChangeRequestScope" AS ENUM ('CLIENT', 'INTERNAL');

-- CreateEnum
CREATE TYPE "BlueprintChangeRequestStatus" AS ENUM ('OPEN', 'RESOLVED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "BlueprintConfigurationProposalStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "RoiAssumptionApprovalState" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RoiSourceType" AS ENUM ('OPERATOR_ESTIMATE', 'BENCHMARK', 'CLIENT_INPUT', 'DISCOVERY', 'SYSTEM_DEFAULT');

-- CreateEnum
CREATE TYPE "SowVersionStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'SUPERSEDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SowSectionProvenance" AS ENUM ('GENERATED', 'MANUAL', 'GENERATED_EDITED', 'LOCKED');

-- AlterTable
ALTER TABLE "enterprise_blueprints" ADD COLUMN     "activeDraftVersionId" TEXT,
ADD COLUMN     "currentApprovedVersionId" TEXT,
ADD COLUMN     "tenantId" TEXT,
ADD COLUMN     "title" TEXT;

-- CreateTable
CREATE TABLE "enterprise_blueprint_versions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "parentVersionId" TEXT,
    "status" "BlueprintVersionStatus" NOT NULL DEFAULT 'BLUEPRINT_DRAFT',
    "schemaVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "contentSnapshot" JSONB NOT NULL,
    "contentHash" TEXT NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "isActiveDraft" BOOLEAN NOT NULL DEFAULT false,
    "isCurrentApproved" BOOLEAN NOT NULL DEFAULT false,
    "provenance" "BlueprintVersionProvenance" NOT NULL DEFAULT 'STUDIO_CAPTURE',
    "authorUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "supersededAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "enterprise_blueprint_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blueprint_approvals" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "blueprintVersionId" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "decision" "BlueprintApprovalDecision" NOT NULL,
    "approverUserId" TEXT NOT NULL,
    "approverRole" TEXT NOT NULL,
    "rationale" TEXT,
    "policyReference" TEXT,
    "evidenceRefs" JSONB,
    "aiAssistanceDisclosed" BOOLEAN NOT NULL DEFAULT false,
    "externalSignatureRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blueprint_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blueprint_trace_events" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "blueprintVersionId" TEXT,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "actorType" "BlueprintTraceActorType" NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "previousState" TEXT,
    "newState" TEXT,
    "impact" TEXT,
    "evidenceRefs" JSONB,
    "aiInvolved" BOOLEAN NOT NULL DEFAULT false,
    "correlationId" TEXT,
    "requestId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blueprint_trace_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blueprint_change_requests" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "blueprintVersionId" TEXT NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "scope" "BlueprintChangeRequestScope" NOT NULL,
    "comments" JSONB NOT NULL,
    "status" "BlueprintChangeRequestStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "blueprint_change_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blueprint_configuration_proposals" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "blueprintVersionId" TEXT NOT NULL,
    "targetTenantId" TEXT NOT NULL,
    "requestedScope" JSONB NOT NULL,
    "status" "BlueprintConfigurationProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "proposerUserId" TEXT NOT NULL,
    "reviewerUserId" TEXT,
    "riskRefs" JSONB,
    "evidenceRefs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blueprint_configuration_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roi_assumptions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roi_assumptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roi_assumption_revisions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "assumptionId" TEXT NOT NULL,
    "revisionNumber" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'SAR',
    "frequency" TEXT,
    "annualizedValue" DOUBLE PRECISION,
    "source" TEXT,
    "sourceType" "RoiSourceType" NOT NULL DEFAULT 'OPERATOR_ESTIMATE',
    "confidence" TEXT,
    "ownerUserId" TEXT,
    "approvalState" "RoiAssumptionApprovalState" NOT NULL DEFAULT 'DRAFT',
    "scenarioTags" TEXT[],
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roi_assumption_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roi_snapshots" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "blueprintVersionId" TEXT NOT NULL,
    "assumptionRevisionIds" TEXT[],
    "engineName" TEXT NOT NULL,
    "engineVersion" TEXT NOT NULL,
    "formulaVersion" TEXT NOT NULL,
    "scenarioInputs" JSONB NOT NULL,
    "results" JSONB NOT NULL,
    "warnings" JSONB,
    "unsupportedInputs" JSONB,
    "currency" TEXT NOT NULL DEFAULT 'SAR',
    "advisoryLabel" TEXT NOT NULL DEFAULT 'advisory_only',
    "contentHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roi_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sow_documents" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "commercialPackageRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sow_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sow_versions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sowDocumentId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "status" "SowVersionStatus" NOT NULL DEFAULT 'DRAFT',
    "blueprintVersionId" TEXT NOT NULL,
    "roiSnapshotId" TEXT,
    "contentHash" TEXT NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "sow_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sow_sections" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sowVersionId" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "provenance" "SowSectionProvenance" NOT NULL DEFAULT 'GENERATED',
    "generatedContent" TEXT,
    "manualContent" TEXT,
    "sourceRefs" JSONB,
    "manuallyEdited" BOOLEAN NOT NULL DEFAULT false,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "completeness" TEXT,
    "warnings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sow_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "enterprise_blueprint_versions_tenantId_blueprintId_createdA_idx" ON "enterprise_blueprint_versions"("tenantId", "blueprintId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "enterprise_blueprint_versions_blueprintId_status_idx" ON "enterprise_blueprint_versions"("blueprintId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "enterprise_blueprint_versions_blueprintId_versionNumber_key" ON "enterprise_blueprint_versions"("blueprintId", "versionNumber");

-- CreateIndex
CREATE INDEX "blueprint_approvals_tenantId_blueprintId_createdAt_idx" ON "blueprint_approvals"("tenantId", "blueprintId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "blueprint_approvals_blueprintVersionId_idx" ON "blueprint_approvals"("blueprintVersionId");

-- CreateIndex
CREATE INDEX "blueprint_trace_events_tenantId_blueprintId_createdAt_idx" ON "blueprint_trace_events"("tenantId", "blueprintId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "blueprint_trace_events_blueprintVersionId_createdAt_idx" ON "blueprint_trace_events"("blueprintVersionId", "createdAt");

-- CreateIndex
CREATE INDEX "blueprint_change_requests_tenantId_blueprintId_idx" ON "blueprint_change_requests"("tenantId", "blueprintId");

-- CreateIndex
CREATE INDEX "blueprint_configuration_proposals_tenantId_blueprintId_idx" ON "blueprint_configuration_proposals"("tenantId", "blueprintId");

-- CreateIndex
CREATE INDEX "roi_assumptions_tenantId_blueprintId_idx" ON "roi_assumptions"("tenantId", "blueprintId");

-- CreateIndex
CREATE UNIQUE INDEX "roi_assumptions_blueprintId_key_key" ON "roi_assumptions"("blueprintId", "key");

-- CreateIndex
CREATE INDEX "roi_assumption_revisions_tenantId_assumptionId_idx" ON "roi_assumption_revisions"("tenantId", "assumptionId");

-- CreateIndex
CREATE UNIQUE INDEX "roi_assumption_revisions_assumptionId_revisionNumber_key" ON "roi_assumption_revisions"("assumptionId", "revisionNumber");

-- CreateIndex
CREATE INDEX "roi_snapshots_blueprintVersionId_createdAt_idx" ON "roi_snapshots"("blueprintVersionId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "roi_snapshots_tenantId_idx" ON "roi_snapshots"("tenantId");

-- CreateIndex
CREATE INDEX "sow_documents_tenantId_blueprintId_idx" ON "sow_documents"("tenantId", "blueprintId");

-- CreateIndex
CREATE INDEX "sow_versions_tenantId_sowDocumentId_idx" ON "sow_versions"("tenantId", "sowDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "sow_versions_sowDocumentId_versionNumber_key" ON "sow_versions"("sowDocumentId", "versionNumber");

-- CreateIndex
CREATE INDEX "sow_sections_tenantId_sowVersionId_orderIndex_idx" ON "sow_sections"("tenantId", "sowVersionId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "sow_sections_sowVersionId_sectionKey_key" ON "sow_sections"("sowVersionId", "sectionKey");

-- CreateIndex
CREATE UNIQUE INDEX "enterprise_blueprints_currentApprovedVersionId_key" ON "enterprise_blueprints"("currentApprovedVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "enterprise_blueprints_activeDraftVersionId_key" ON "enterprise_blueprints"("activeDraftVersionId");

-- CreateIndex
CREATE INDEX "enterprise_blueprints_tenantId_idx" ON "enterprise_blueprints"("tenantId");

-- AddForeignKey
ALTER TABLE "enterprise_blueprints" ADD CONSTRAINT "enterprise_blueprints_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_blueprints" ADD CONSTRAINT "enterprise_blueprints_currentApprovedVersionId_fkey" FOREIGN KEY ("currentApprovedVersionId") REFERENCES "enterprise_blueprint_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_blueprints" ADD CONSTRAINT "enterprise_blueprints_activeDraftVersionId_fkey" FOREIGN KEY ("activeDraftVersionId") REFERENCES "enterprise_blueprint_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_blueprint_versions" ADD CONSTRAINT "enterprise_blueprint_versions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_blueprint_versions" ADD CONSTRAINT "enterprise_blueprint_versions_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "enterprise_blueprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_blueprint_versions" ADD CONSTRAINT "enterprise_blueprint_versions_parentVersionId_fkey" FOREIGN KEY ("parentVersionId") REFERENCES "enterprise_blueprint_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_approvals" ADD CONSTRAINT "blueprint_approvals_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_approvals" ADD CONSTRAINT "blueprint_approvals_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "enterprise_blueprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_approvals" ADD CONSTRAINT "blueprint_approvals_blueprintVersionId_fkey" FOREIGN KEY ("blueprintVersionId") REFERENCES "enterprise_blueprint_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_trace_events" ADD CONSTRAINT "blueprint_trace_events_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_trace_events" ADD CONSTRAINT "blueprint_trace_events_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "enterprise_blueprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_trace_events" ADD CONSTRAINT "blueprint_trace_events_blueprintVersionId_fkey" FOREIGN KEY ("blueprintVersionId") REFERENCES "enterprise_blueprint_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_change_requests" ADD CONSTRAINT "blueprint_change_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_change_requests" ADD CONSTRAINT "blueprint_change_requests_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "enterprise_blueprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_change_requests" ADD CONSTRAINT "blueprint_change_requests_blueprintVersionId_fkey" FOREIGN KEY ("blueprintVersionId") REFERENCES "enterprise_blueprint_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_configuration_proposals" ADD CONSTRAINT "blueprint_configuration_proposals_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_configuration_proposals" ADD CONSTRAINT "blueprint_configuration_proposals_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "enterprise_blueprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_configuration_proposals" ADD CONSTRAINT "blueprint_configuration_proposals_blueprintVersionId_fkey" FOREIGN KEY ("blueprintVersionId") REFERENCES "enterprise_blueprint_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_configuration_proposals" ADD CONSTRAINT "blueprint_configuration_proposals_targetTenantId_fkey" FOREIGN KEY ("targetTenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roi_assumptions" ADD CONSTRAINT "roi_assumptions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roi_assumptions" ADD CONSTRAINT "roi_assumptions_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "enterprise_blueprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roi_assumption_revisions" ADD CONSTRAINT "roi_assumption_revisions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roi_assumption_revisions" ADD CONSTRAINT "roi_assumption_revisions_assumptionId_fkey" FOREIGN KEY ("assumptionId") REFERENCES "roi_assumptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roi_snapshots" ADD CONSTRAINT "roi_snapshots_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roi_snapshots" ADD CONSTRAINT "roi_snapshots_blueprintVersionId_fkey" FOREIGN KEY ("blueprintVersionId") REFERENCES "enterprise_blueprint_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sow_documents" ADD CONSTRAINT "sow_documents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sow_documents" ADD CONSTRAINT "sow_documents_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "enterprise_blueprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sow_versions" ADD CONSTRAINT "sow_versions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sow_versions" ADD CONSTRAINT "sow_versions_sowDocumentId_fkey" FOREIGN KEY ("sowDocumentId") REFERENCES "sow_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sow_versions" ADD CONSTRAINT "sow_versions_blueprintVersionId_fkey" FOREIGN KEY ("blueprintVersionId") REFERENCES "enterprise_blueprint_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sow_versions" ADD CONSTRAINT "sow_versions_roiSnapshotId_fkey" FOREIGN KEY ("roiSnapshotId") REFERENCES "roi_snapshots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sow_sections" ADD CONSTRAINT "sow_sections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sow_sections" ADD CONSTRAINT "sow_sections_sowVersionId_fkey" FOREIGN KEY ("sowVersionId") REFERENCES "sow_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- C2 partial unique indexes (one active draft / one current approved per blueprint)
CREATE UNIQUE INDEX "enterprise_blueprint_versions_one_active_draft"
  ON "enterprise_blueprint_versions" ("blueprintId")
  WHERE "isActiveDraft" = true;

CREATE UNIQUE INDEX "enterprise_blueprint_versions_one_current_approved"
  ON "enterprise_blueprint_versions" ("blueprintId")
  WHERE "isCurrentApproved" = true;
