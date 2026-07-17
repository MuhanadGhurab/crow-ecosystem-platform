-- C3 post-migration RLS and grant verification (read-only).
-- Run against the shared Supabase database AFTER controlled migration apply and BEFORE enabling registration.

-- 1) RLS enabled on all eight C3 tables
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'platform_accounts',
    'platform_account_profiles',
    'platform_account_audit_events',
    'email_verification_challenges',
    'legal_documents',
    'legal_document_versions',
    'account_legal_acceptances',
    'account_consent_preferences'
  )
ORDER BY c.relname;

-- 2) No broad policies for anon/authenticated (expect zero permissive policies)
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'platform_accounts',
    'platform_account_profiles',
    'platform_account_audit_events',
    'email_verification_challenges',
    'legal_documents',
    'legal_document_versions',
    'account_legal_acceptances',
    'account_consent_preferences'
  )
ORDER BY tablename, policyname;

-- 3) Table privileges for anon/authenticated (expect empty result sets after REVOKE hardening)
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated')
  AND table_name IN (
    'platform_accounts',
    'platform_account_profiles',
    'platform_account_audit_events',
    'email_verification_challenges',
    'legal_documents',
    'legal_document_versions',
    'account_legal_acceptances',
    'account_consent_preferences'
  )
ORDER BY table_name, grantee, privilege_type;

-- 4) Pending migration inventory
SELECT migration_name, finished_at, rolled_back_at, logs
FROM "_prisma_migrations"
WHERE migration_name LIKE '%c3%'
ORDER BY finished_at NULLS LAST, migration_name;
