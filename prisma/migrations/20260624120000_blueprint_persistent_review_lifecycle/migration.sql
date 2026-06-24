-- BLUEPRINT.1B — persistent Blueprint review lifecycle (certification apply)
-- Additive only. No backfill. No sentinel tenant.

-- CreateEnum
CREATE TYPE "BlueprintRootLifecycleState" AS ENUM (
  'DRAFT_INTERNAL',
  'READY_FOR_INTERNAL_REVIEW',
  'CHANGES_REQUESTED_INTERNAL',
  'READY_TO_SHARE',
  'SHARED_WITH_CLIENT',
  'CLIENT_REVIEWING',
  'CLIENT_CHANGES_REQUESTED',
  'CLIENT_ACCEPTED',
  'PLATFORM_FINALIZED',
  'SUPERSEDED',
  'WITHDRAWN'
);

-- CreateEnum
CREATE TYPE "BlueprintClientVisibilityState" AS ENUM (
  'NOT_SHARED',
  'SHARED_EXACT_VERSION',
  'CLIENT_REVIEW_CLOSED'
);

-- CreateEnum
CREATE TYPE "BlueprintReviewAudience" AS ENUM ('INTERNAL', 'CLIENT');

-- CreateEnum
CREATE TYPE "BlueprintReviewCycleState" AS ENUM (
  'OPEN',
  'CHANGES_REQUESTED',
  'ACCEPTED',
  'CLOSED',
  'SUPERSEDED'
);

-- AlterTable enterprise_blueprints
ALTER TABLE "enterprise_blueprints"
  ADD COLUMN "lifecycleState" "BlueprintRootLifecycleState" NOT NULL DEFAULT 'DRAFT_INTERNAL',
  ADD COLUMN "clientVisibilityState" "BlueprintClientVisibilityState" NOT NULL DEFAULT 'NOT_SHARED',
  ADD COLUMN "currentVersionId" TEXT,
  ADD COLUMN "platformFinalizedVersionId" TEXT,
  ADD COLUMN "sharedWithClientVersionNumber" INTEGER,
  ADD COLUMN "rowVersion" INTEGER NOT NULL DEFAULT 1;

-- AlterTable enterprise_blueprint_versions — nullable tenant + MODEL.4 artifacts
ALTER TABLE "enterprise_blueprint_versions" ALTER COLUMN "tenantId" DROP NOT NULL;

ALTER TABLE "enterprise_blueprint_versions"
  ADD COLUMN "sourceModelKey" TEXT,
  ADD COLUMN "sourceModelHash" TEXT,
  ADD COLUMN "compilerVersion" TEXT,
  ADD COLUMN "validationJson" JSONB,
  ADD COLUMN "decisionRegisterJson" JSONB,
  ADD COLUMN "provenanceJson" JSONB,
  ADD COLUMN "scenarioProfileJson" JSONB,
  ADD COLUMN "reviewReadinessJson" JSONB,
  ADD COLUMN "createdByPlatformAccountId" TEXT;

CREATE INDEX "enterprise_blueprint_versions_blueprintId_versionNumber_idx"
  ON "enterprise_blueprint_versions"("blueprintId", "versionNumber");

CREATE INDEX "enterprise_blueprint_versions_contentHash_idx"
  ON "enterprise_blueprint_versions"("contentHash");

CREATE INDEX "enterprise_blueprint_versions_createdByPlatformAccountId_idx"
  ON "enterprise_blueprint_versions"("createdByPlatformAccountId");

-- AlterTable blueprint_trace_events — nullable tenant pre-provision
ALTER TABLE "blueprint_trace_events" ALTER COLUMN "tenantId" DROP NOT NULL;

-- CreateTable blueprint_review_cycles
CREATE TABLE "blueprint_review_cycles" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "blueprintVersionId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "cycleNumber" INTEGER NOT NULL,
    "audience" "BlueprintReviewAudience" NOT NULL,
    "state" "BlueprintReviewCycleState" NOT NULL DEFAULT 'OPEN',
    "initiatedByPlatformAccountId" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "supersededByCycleId" TEXT,

    CONSTRAINT "blueprint_review_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable blueprint_review_actions
CREATE TABLE "blueprint_review_actions" (
    "id" TEXT NOT NULL,
    "reviewCycleId" TEXT NOT NULL,
    "blueprintVersionId" TEXT NOT NULL,
    "actorPlatformAccountId" TEXT NOT NULL,
    "actorAuthorityClass" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "contentHashAtAction" TEXT NOT NULL,
    "reasonCode" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blueprint_review_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "enterprise_blueprints_currentVersionId_key" ON "enterprise_blueprints"("currentVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "enterprise_blueprints_platformFinalizedVersionId_key" ON "enterprise_blueprints"("platformFinalizedVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "blueprint_review_cycles_blueprintId_cycleNumber_key" ON "blueprint_review_cycles"("blueprintId", "cycleNumber");

-- CreateIndex
CREATE INDEX "blueprint_review_cycles_blueprintId_versionNumber_idx" ON "blueprint_review_cycles"("blueprintId", "versionNumber");

-- CreateIndex
CREATE INDEX "blueprint_review_actions_reviewCycleId_createdAt_idx" ON "blueprint_review_actions"("reviewCycleId", "createdAt");

-- CreateIndex
CREATE INDEX "blueprint_review_actions_blueprintVersionId_idx" ON "blueprint_review_actions"("blueprintVersionId");

-- AddForeignKey
ALTER TABLE "enterprise_blueprints" ADD CONSTRAINT "enterprise_blueprints_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "enterprise_blueprint_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_blueprints" ADD CONSTRAINT "enterprise_blueprints_platformFinalizedVersionId_fkey" FOREIGN KEY ("platformFinalizedVersionId") REFERENCES "enterprise_blueprint_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_review_cycles" ADD CONSTRAINT "blueprint_review_cycles_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "enterprise_blueprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_review_cycles" ADD CONSTRAINT "blueprint_review_cycles_blueprintVersionId_fkey" FOREIGN KEY ("blueprintVersionId") REFERENCES "enterprise_blueprint_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_review_actions" ADD CONSTRAINT "blueprint_review_actions_reviewCycleId_fkey" FOREIGN KEY ("reviewCycleId") REFERENCES "blueprint_review_cycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_review_actions" ADD CONSTRAINT "blueprint_review_actions_blueprintVersionId_fkey" FOREIGN KEY ("blueprintVersionId") REFERENCES "enterprise_blueprint_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Immutability: append-only enterprise_blueprint_versions (no UPDATE/DELETE)
CREATE OR REPLACE FUNCTION blueprint_version_immutable_guard()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'enterprise_blueprint_versions is append-only; UPDATE and DELETE are forbidden';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blueprint_version_no_update ON "enterprise_blueprint_versions";
CREATE TRIGGER blueprint_version_no_update
  BEFORE UPDATE OR DELETE ON "enterprise_blueprint_versions"
  FOR EACH ROW EXECUTE FUNCTION blueprint_version_immutable_guard();
