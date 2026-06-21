-- C3 — Deny PostgREST client access to sensitive account/legal tables by default.
-- Prisma server routes use the service-role/direct connection and bypass RLS.

ALTER TABLE "platform_accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "platform_account_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "email_verification_challenges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "platform_account_audit_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "legal_documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "legal_document_versions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account_legal_acceptances" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account_consent_preferences" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "platform_accounts" FROM anon, authenticated;
REVOKE ALL ON TABLE "platform_account_profiles" FROM anon, authenticated;
REVOKE ALL ON TABLE "email_verification_challenges" FROM anon, authenticated;
REVOKE ALL ON TABLE "platform_account_audit_events" FROM anon, authenticated;
REVOKE ALL ON TABLE "legal_documents" FROM anon, authenticated;
REVOKE ALL ON TABLE "legal_document_versions" FROM anon, authenticated;
REVOKE ALL ON TABLE "account_legal_acceptances" FROM anon, authenticated;
REVOKE ALL ON TABLE "account_consent_preferences" FROM anon, authenticated;
