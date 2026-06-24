-- BLUEPRINT.1A — PROPOSED MIGRATION (NOT APPLIED)
-- Owner review required. Transaction-safe additive migration only.
-- Does not modify or delete existing rows.

BEGIN;

-- Lifecycle enums
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

CREATE TYPE "BlueprintClientVisibilityState" AS ENUM (
  'NOT_SHARED',
  'SHARED_EXACT_VERSION',
  'CLIENT_REVIEW_CLOSED'
);

CREATE TYPE "BlueprintReviewAudience" AS ENUM ('INTERNAL', 'CLIENT');

CREATE TYPE "BlueprintReviewCycleState" AS ENUM (
  'OPEN',
  'CHANGES_REQUESTED',
  'ACCEPTED',
  'CLOSED',
  'SUPERSEDED'
);

-- Extend enterprise_blueprints
ALTER TABLE "enterprise_blueprints"
  ADD COLUMN IF NOT EXISTS "lifecycleState" "BlueprintRootLifecycleState" NOT NULL DEFAULT 'DRAFT_INTERNAL',
  ADD COLUMN IF NOT EXISTS "clientVisibilityState" "BlueprintClientVisibilityState" NOT NULL DEFAULT 'NOT_SHARED',
  ADD COLUMN IF NOT EXISTS "sharedWithClientVersionNumber" INTEGER,
  ADD COLUMN IF NOT EXISTS "platformFinalizedVersionId" TEXT,
  ADD COLUMN IF NOT EXISTS "rowVersion" INTEGER NOT NULL DEFAULT 1;

CREATE UNIQUE INDEX IF NOT EXISTS "enterprise_blueprints_platformFinalizedVersionId_key"
  ON "enterprise_blueprints" ("platformFinalizedVersionId")
  WHERE "platformFinalizedVersionId" IS NOT NULL;

ALTER TABLE "enterprise_blueprints"
  ADD CONSTRAINT "enterprise_blueprints_platformFinalizedVersionId_fkey"
  FOREIGN KEY ("platformFinalizedVersionId")
  REFERENCES "enterprise_blueprint_versions" ("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Extend enterprise_blueprint_versions (MODEL.4 compiler artifacts)
ALTER TABLE "enterprise_blueprint_versions"
  ADD COLUMN IF NOT EXISTS "sourceModelKey" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceModelHash" TEXT,
  ADD COLUMN IF NOT EXISTS "compilerVersion" TEXT,
  ADD COLUMN IF NOT EXISTS "validationJson" JSONB,
  ADD COLUMN IF NOT EXISTS "decisionRegisterJson" JSONB,
  ADD COLUMN IF NOT EXISTS "provenanceJson" JSONB,
  ADD COLUMN IF NOT EXISTS "scenarioProfileJson" JSONB,
  ADD COLUMN IF NOT EXISTS "reviewReadinessJson" JSONB,
  ADD COLUMN IF NOT EXISTS "createdByPlatformAccountId" TEXT;

CREATE INDEX IF NOT EXISTS "enterprise_blueprint_versions_blueprintId_versionNumber_idx"
  ON "enterprise_blueprint_versions" ("blueprintId", "versionNumber");

-- Review cycles
CREATE TABLE IF NOT EXISTS "blueprint_review_cycles" (
  "id" TEXT NOT NULL,
  "blueprintId" TEXT NOT NULL,
  "blueprintVersionId" TEXT NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "cycleNumber" INTEGER NOT NULL,
  "audience" "BlueprintReviewAudience" NOT NULL,
  "state" "BlueprintReviewCycleState" NOT NULL DEFAULT 'OPEN',
  "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "closedAt" TIMESTAMP(3),
  "supersededByCycleId" TEXT,
  "initiatedByPlatformAccountId" TEXT,
  CONSTRAINT "blueprint_review_cycles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "blueprint_review_cycles_blueprintId_cycleNumber_key"
  ON "blueprint_review_cycles" ("blueprintId", "cycleNumber");

CREATE INDEX IF NOT EXISTS "blueprint_review_cycles_blueprintId_versionNumber_idx"
  ON "blueprint_review_cycles" ("blueprintId", "versionNumber");

ALTER TABLE "blueprint_review_cycles"
  ADD CONSTRAINT "blueprint_review_cycles_blueprintId_fkey"
  FOREIGN KEY ("blueprintId") REFERENCES "enterprise_blueprints" ("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "blueprint_review_cycles"
  ADD CONSTRAINT "blueprint_review_cycles_blueprintVersionId_fkey"
  FOREIGN KEY ("blueprintVersionId") REFERENCES "enterprise_blueprint_versions" ("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Review actions
CREATE TABLE IF NOT EXISTS "blueprint_review_actions" (
  "id" TEXT NOT NULL,
  "reviewCycleId" TEXT NOT NULL,
  "blueprintVersionId" TEXT NOT NULL,
  "actorPlatformAccountId" TEXT NOT NULL,
  "actorAuthorityClass" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "reason" TEXT,
  "contentHashAtAction" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "blueprint_review_actions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "blueprint_review_actions_reviewCycleId_createdAt_idx"
  ON "blueprint_review_actions" ("reviewCycleId", "createdAt");

ALTER TABLE "blueprint_review_actions"
  ADD CONSTRAINT "blueprint_review_actions_reviewCycleId_fkey"
  FOREIGN KEY ("reviewCycleId") REFERENCES "blueprint_review_cycles" ("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "blueprint_review_actions"
  ADD CONSTRAINT "blueprint_review_actions_blueprintVersionId_fkey"
  FOREIGN KEY ("blueprintVersionId") REFERENCES "enterprise_blueprint_versions" ("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Immutability triggers (append-only versions)
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

-- NOTE: Trigger blocks ALL updates including supersededAt — owner may prefer
-- narrow trigger allowing only supersededAt/archivedAt. Adjust in 1B review.

COMMIT;

-- Public Data API: ensure no GRANT to anon/authenticated (verify separately)
