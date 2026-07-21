-- GHURAVIA VALIDATION ONLY NOT PRODUCT MIGRATION
ALTER TABLE ghv_migration_validation.item ADD COLUMN IF NOT EXISTS canonical_label text;
INSERT INTO ghv_migration_validation.migration_audit(migration_name,action)
VALUES ('002_additive','expand');
