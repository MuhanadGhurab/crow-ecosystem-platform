-- GHURAVIA VALIDATION ONLY NOT PRODUCT MIGRATION
UPDATE ghv_migration_validation.item
SET canonical_label = legacy_label
WHERE canonical_label IS NULL;
INSERT INTO ghv_migration_validation.migration_audit(migration_name,action)
VALUES ('backfill','scoped-repeatable');
