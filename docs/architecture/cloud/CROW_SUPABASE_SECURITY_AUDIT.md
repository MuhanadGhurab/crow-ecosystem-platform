# Crow Supabase Security Audit

**Phase:** CLOUD.0  
**Project ref:** `wbwnsndcxrgyqwppurms`  
**Audit date:** 2026-06-18  
**Mode:** Read-only — findings classified only; **no remediation applied**.

---

## 1. Executive summary

| Severity | Count | Primary theme |
|----------|-------|---------------|
| CRITICAL | 0 | — |
| HIGH | 97 | RLS disabled on public schema tables exposed via PostgREST |
| MEDIUM | 1 | Leaked password protection disabled |
| LOW | 0 | — |
| INFORMATIONAL | 10 | RLS enabled without policies (C3 intentional pattern) |

**Architecture note:** Crow's primary access path is **Next.js server + Prisma with direct/service connection**, not anonymous PostgREST. RLS gaps are still **HIGH** because Supabase exposes `public` tables to the Data API when the anon key is used.

**Overall classification:** **HIGH exposure on PostgREST surface** — not a targeting defect (fingerprints agree), but requires staged RLS rollout before widening client-side Supabase SDK usage.

---

## 2. Security Advisor findings (automated)

Source: Supabase Security Advisor via MCP `get_advisors` (2026-06-18).

### HIGH — `rls_disabled_in_public` (97 tables)

**Level:** ERROR in advisor (treated as **HIGH** for Crow classification)

Row Level Security is **not enabled** on public tables including, among others:

- `tenants`, `implementation_requests`, `discovery_*`, `blueprint_*`
- HR/CRM tables (`hr_employees`, `crm_accounts`, …)
- Tenant runtime tables across ERP module scaffolds
- Legacy platform tables predating C3

**Security implication:** Any client using the anon key against PostgREST could read/write rows unless blocked elsewhere (Crow app does not rely on this today).

**Recommendation:** `ENABLE_AFTER_STAGING` — design tenant-scoped policies; validate on staging branch; enable table-by-table with regression tests.

### MEDIUM — `auth_leaked_password_protection` (1)

**Detail:** HaveIBeenPwned leaked password protection is **disabled**.

**Recommendation:** Enable on staging first after SMTP/auth flows verified.

### INFORMATIONAL — `rls_enabled_no_policy` (10 tables)

Tables include C3 account/legal tables:

- `account_consent_preferences`, `account_legal_acceptances`, `legal_document_versions`, etc.

**Context:** C3 migrations enable RLS and **REVOKE** default grants — intentional **deny-by-default** for PostgREST while server uses service role. Documented in C3 legal engine; not a vulnerability for current server-only access pattern.

**Recommendation:** INFORMATIONAL — add explicit policies if anon/authenticated client access is ever required.

---

## 3. Production checklist audit (manual + SQL)

| Check | Finding | Severity |
|-------|---------|----------|
| RLS on exposed tables | 97 without RLS | **HIGH** |
| Service-role usage | App uses Prisma direct/pooler — service role equivalent | **INFORMATIONAL** — protect server env |
| API keys in repo | `.gitignore` excludes env files; no keys in docs | **PASS** |
| Leaked-secret risk | Operator env files gitignored | **INFORMATIONAL** — rotate on staff change |
| Auth redirect allowlist | Management API token not configured locally | **UNKNOWN** — operator Dashboard review |
| Custom SMTP | Not verified | **UNKNOWN** |
| Password policy | Leaked password protection off | **MEDIUM** |
| CAPTCHA | Not verified | **UNKNOWN** |
| Auth rate limits | Not verified | **UNKNOWN** |
| Session controls | Not verified | **UNKNOWN** |
| Storage policies | No buckets | **INFORMATIONAL** |
| Database roles | Supabase-managed | **INFORMATIONAL** |
| Exposed schemas | `public` exposed via API by default | **HIGH** (with RLS gaps) |
| Security definer functions | Not fully audited | **UNKNOWN** |
| Extensions | `pgcrypto`, `vault`, `pg_stat_statements` active | **INFORMATIONAL** |
| Backups | Not verified via API | **UNKNOWN** — operator Dashboard |
| PITR | Not verified | **UNKNOWN** |
| Log retention | Not verified | **UNKNOWN** |
| Project access control | Members not enumerated | **UNKNOWN** |

Sample SQL verification:

| Table | RLS enabled |
|-------|-------------|
| `tenants` | false |
| `implementation_requests` | false |
| `platform_accounts` | true |

---

## 4. Performance Advisor (security-relevant)

Source: Performance Advisor (2026-06-18).

| Lint | Count | Level | Crow classification |
|------|-------|-------|---------------------|
| `unindexed_foreign_keys` | 62 | INFO | **INFORMATIONAL** — review before scale |
| `unused_index` | 35 | INFO | **INFORMATIONAL** — cleanup after metrics |
| `auth_db_connections_absolute` | 1 | INFO | **INFORMATIONAL** — monitor Auth pool |

No performance advisor ERROR-level items observed in this audit.

---

## 5. Crow application security posture (context)

| Control | Status |
|---------|--------|
| Controlled migration wrapper | Enforced exact inventory + backup gate |
| C2 mutation guards | Blueprint mutations blocked off Production Vercel builds |
| FTGP authority | Code present; **migration not applied** — no DB assignments |
| Auth metadata | Not modified in CLOUD.0 |
| Shared Preview → Production DB | **HIGH operational risk** — separation planned Wave 2 |

---

## 6. Remediation priority (plan only — not executed)

| Priority | Item | Wave |
|----------|------|------|
| P0 | Verify backups + record recovery gate | Wave 1 |
| P0 | Complete environment DB separation | Wave 2 |
| P1 | Enable leaked password protection | Wave 3 |
| P1 | Auth CAPTCHA + rate limits on registration | Wave 3 |
| P2 | RLS policies for tenant-scoped tables | Wave 3 |
| P2 | Storage bucket policies when buckets created | Wave 3 |
| P3 | Index FK recommendations from Performance Advisor | Wave 3+ |

---

## 7. Explicit no-remediation statement

CLOUD.0 **did not** alter RLS, Auth settings, Storage, or database roles. All findings are documented for Wave 3 implementation after staging isolation.

---

## 8. CLOUD.1B update (2026-06-21)

**Mode:** Read-only repository audit + safe external probe — **no hosted remediation**.

### Confirmed Supabase-side exposure

| Finding | Value |
|---------|------:|
| `public` tables (live `pg_tables`) | 107 |
| RLS disabled | 97 |
| RLS enabled, zero policies (C3) | 10 |
| anon/authenticated CRUD on RLS-disabled tables | 97 |
| Repository business PostgREST dependencies | **0** |
| External probe | `DATA_API_PUBLIC_EXPOSURE_CONFIRMED` |

Aggregate reads succeeded under publishable key for: `implementation_requests`, `tenant_memberships`, `tenant_finance_entries`, `cybercrow_audit_logs`, `security_events`. `platform_accounts` denied (401) — C3 REVOKE pattern.

### FTGP migration hardening (unapplied)

Pre-fix classification: `SECURITY_INCOMPATIBLE_UNDER_CURRENT_DEFAULT_PRIVILEGES`. Migration updated with `ENABLE ROW LEVEL SECURITY` + `REVOKE ALL … FROM anon, authenticated` on `platform_internal_role_assignments`. New SHA-256: `8f66dcd89ca5d353864630d088a0dfb2af415e039c472cd54f5bc4e4c58191ed`.

### Recommended containment

**Path A:** remove `public` from Data API exposed schemas (see `CROW_EMERGENCY_EXPOSURE_CONTAINMENT.md`).

---

## Related documents

- `CROW_DATA_API_DEPENDENCY_AUDIT.md`
- `CROW_EMERGENCY_EXPOSURE_CONTAINMENT.md`
- `CROW_RLS_ACCESS_MODEL.md`
- `CROW_RLS_ROLLOUT_PLAN.md`
- `CROW_SUPABASE_PRO_FOUNDATION.md`
- `CROW_CLOUD_FEATURE_ENABLEMENT_MATRIX.md`
- `docs/architecture/crow-core/c2/C2_2_SHARED_DATABASE_INCIDENT_RECORD.md`
