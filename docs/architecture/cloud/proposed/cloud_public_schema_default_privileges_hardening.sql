-- CLOUD.1B proposed — public schema default privilege hardening
-- Classification:
--   SHARED_DATABASE_SECURITY_MIGRATION
--   DATA_API_EXPOSURE_CONTROL
--   CONTROLLED_APPLY_REQUIRED
--   PRODUCTION_COMPATIBILITY_REVIEW_REQUIRED
--
-- NOT in controlled pending inventory. Requires separate PO authorization.
-- Do NOT apply during FTGP dual migration apply window.

-- Observed hosted default privileges (2026-06-21):
--   postgres + supabase_admin grant arwdDxtm on tables (r), rwU on sequences (S), X on functions (f)
--   to anon, authenticated, and service_role.

-- Target: new objects in public receive NO automatic anon/authenticated CRUD.

-- Tables (postgres role objects)
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon, authenticated;

-- Sequences
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM anon, authenticated;

-- Functions
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public
  REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

-- Existing 87 RLS-disabled tables still require a separate batch REVOKE + optional RLS rollout.
-- See CROW_RLS_ROLLOUT_PLAN.md — do not rely on default-privilege change alone.
