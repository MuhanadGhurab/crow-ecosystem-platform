-- BLUEPRINT.1A — VERIFICATION QUERIES (read-only)
-- Run after migration apply in 1B staging. Do not execute mutations here.

-- 1. Table existence
SELECT to_regclass('public.enterprise_blueprints') AS enterprise_blueprints;
SELECT to_regclass('public.enterprise_blueprint_versions') AS enterprise_blueprint_versions;
SELECT to_regclass('public.blueprint_review_cycles') AS blueprint_review_cycles;
SELECT to_regclass('public.blueprint_review_actions') AS blueprint_review_actions;

-- 2. New columns on enterprise_blueprints
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'enterprise_blueprints'
  AND column_name IN ('lifecycleState', 'clientVisibilityState', 'rowVersion', 'platformFinalizedVersionId');

-- 3. New columns on enterprise_blueprint_versions
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'enterprise_blueprint_versions'
  AND column_name IN ('sourceModelHash', 'compilerVersion', 'validationJson', 'createdByPlatformAccountId');

-- 4. Version uniqueness
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'enterprise_blueprint_versions'
  AND indexdef LIKE '%blueprintId%versionNumber%';

-- 5. Review cycle uniqueness
SELECT indexname FROM pg_indexes WHERE tablename = 'blueprint_review_cycles';

-- 6. Foreign keys
SELECT conname, conrelid::regclass, confrelid::regclass
FROM pg_constraint
WHERE conname LIKE '%blueprint_review%' OR conname LIKE '%platformFinalizedVersionId%';

-- 7. Immutability trigger
SELECT tgname FROM pg_trigger WHERE tgname = 'blueprint_version_no_update';

-- 8. Public Data API containment — tables must not be exposed to anon/authenticated
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('blueprint_review_cycles', 'blueprint_review_actions', 'enterprise_blueprints', 'enterprise_blueprint_versions')
  AND grantee IN ('anon', 'authenticated');

-- Expected: zero rows for new tables

-- 9. Zero unexpected row count after apply (no backfill in 1A)
SELECT COUNT(*) AS review_cycle_count FROM blueprint_review_cycles;
SELECT COUNT(*) AS review_action_count FROM blueprint_review_actions;

-- 10. Enum existence
SELECT typname FROM pg_type WHERE typname LIKE 'Blueprint%';
