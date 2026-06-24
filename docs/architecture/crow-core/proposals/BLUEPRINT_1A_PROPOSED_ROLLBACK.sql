-- BLUEPRINT.1A — PROPOSED ROLLBACK (NOT APPLIED)
-- Rolls back ONLY objects introduced by BLUEPRINT_1A_PROPOSED_MIGRATION.sql
-- WARNING: Restricted after real Blueprint review data exists — owner sign-off required.

BEGIN;

DROP TRIGGER IF EXISTS blueprint_version_no_update ON "enterprise_blueprint_versions";
DROP FUNCTION IF EXISTS blueprint_version_immutable_guard();

DROP TABLE IF EXISTS "blueprint_review_actions";
DROP TABLE IF EXISTS "blueprint_review_cycles";

ALTER TABLE "enterprise_blueprints"
  DROP CONSTRAINT IF EXISTS "enterprise_blueprints_platformFinalizedVersionId_fkey";

DROP INDEX IF EXISTS "enterprise_blueprints_platformFinalizedVersionId_key";

ALTER TABLE "enterprise_blueprints"
  DROP COLUMN IF EXISTS "lifecycleState",
  DROP COLUMN IF EXISTS "clientVisibilityState",
  DROP COLUMN IF EXISTS "sharedWithClientVersionNumber",
  DROP COLUMN IF EXISTS "platformFinalizedVersionId",
  DROP COLUMN IF EXISTS "rowVersion";

ALTER TABLE "enterprise_blueprint_versions"
  DROP COLUMN IF EXISTS "sourceModelKey",
  DROP COLUMN IF EXISTS "sourceModelHash",
  DROP COLUMN IF EXISTS "compilerVersion",
  DROP COLUMN IF EXISTS "validationJson",
  DROP COLUMN IF EXISTS "decisionRegisterJson",
  DROP COLUMN IF EXISTS "provenanceJson",
  DROP COLUMN IF EXISTS "scenarioProfileJson",
  DROP COLUMN IF EXISTS "reviewReadinessJson",
  DROP COLUMN IF EXISTS "createdByPlatformAccountId";

DROP TYPE IF EXISTS "BlueprintReviewCycleState";
DROP TYPE IF EXISTS "BlueprintReviewAudience";
DROP TYPE IF EXISTS "BlueprintClientVisibilityState";
DROP TYPE IF EXISTS "BlueprintRootLifecycleState";

COMMIT;
