-- GHURAVIA VALIDATION ONLY NOT PRODUCT MIGRATION
CREATE SCHEMA IF NOT EXISTS ghv_migration_validation;
CREATE TABLE IF NOT EXISTS ghv_migration_validation.item (
  id text PRIMARY KEY,
  legacy_label text NOT NULL
);
CREATE TABLE IF NOT EXISTS ghv_migration_validation.migration_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  migration_name text NOT NULL,
  action text NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
