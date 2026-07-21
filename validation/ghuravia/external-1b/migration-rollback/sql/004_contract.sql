-- GHURAVIA VALIDATION ONLY NOT PRODUCT MIGRATION
ALTER TABLE ghv_migration_validation.item
  ALTER COLUMN canonical_label SET NOT NULL;
INSERT INTO ghv_migration_validation.migration_audit(migration_name,action)
VALUES ('004_contract','enforce-new-shape');
