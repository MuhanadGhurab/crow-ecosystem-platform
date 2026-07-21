-- GHURAVIA VALIDATION ONLY NOT PRODUCT MIGRATION
CREATE INDEX IF NOT EXISTS item_canonical_label_idx
  ON ghv_migration_validation.item(canonical_label);
INSERT INTO ghv_migration_validation.migration_audit(migration_name,action)
VALUES ('003_expand','prepare-contract');
