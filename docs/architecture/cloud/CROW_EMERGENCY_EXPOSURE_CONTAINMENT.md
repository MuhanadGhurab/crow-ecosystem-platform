# Crow Emergency Data API Exposure Containment

**Phase:** CLOUD.1B (runbook) → **CLOUD.1C (applied + verified)**  
**Classification:** `DATA_API_EXPOSURE_CONTROL` | **Path A applied** (Dashboard)  
**Project:** `wbwnsndcxrgyqwppurms`  
**Applied path:** **Path A** — remove `public` from PostgREST exposed schemas

---

## CLOUD.1C post-change status (2026-06-21)

| Item | Result |
|------|--------|
| Operator change | Removed `public` from **Data API → Exposed schemas** only; saved |
| Auth / keys / RLS / grants / migrations / rows | **Unchanged** |
| Env file for verification | `.env.staging.runtime` (hosted; fingerprint `0355c17692e2a90d`) |
| `npm run cloud-data-api-containment:verify` | `PUBLIC_SCHEMA_DATA_API_EXPOSURE_BLOCKED=PASS` |
| `npm run cloud-containment-smoke:verify` | `SUPABASE_AUTH_UNAFFECTED=PASS`, `PRISMA_SERVER_ROUTES_UNAFFECTED=PASS` |
| GraphQL introspection | `PUBLIC_SCHEMA_GRAPHQL_EXPOSURE_BLOCKED=PASS` |
| Pending migrations | Exactly 2 unapplied (see §6) |
| Production deployment | **Unchanged** (Dashboard-only containment) |

**Verdict:** `PASSED — PUBLIC DATA API EXPOSURE CONTAINED; AUTH AND PRISMA RUNTIME UNAFFECTED`

### Post-change REST probe (8 tables — no bodies or count headers logged)

| Table | HTTP | Blocked |
|-------|------|---------|
| `implementation_requests` | 404 | yes |
| `tenant_memberships` | 404 | yes |
| `tenant_finance_entries` | 404 | yes |
| `cybercrow_audit_logs` | 404 | yes |
| `security_events` | 404 | yes |
| `api_keys` | 404 | yes |
| `webhook_events` | 404 | yes |
| `platform_accounts` | 404 | yes |

### Hosted read-only database checks (Supabase MCP)

| Check | Post-change |
|-------|-------------|
| Direct fingerprint | `0355c17692e2a90d` |
| `platform_internal_role_assignments` | **Absent** (no DDL) |
| Pending migration rows | **Absent** from `_prisma_migrations` |
| Sample row counts | `implementation_requests=7`, `tenant_memberships=3` (unchanged) |
| Applied migration count | 21 |

### Remaining security posture (honest)

```text
IMMEDIATE_DATA_API_EXPOSURE=CONTAINED
PUBLIC_SCHEMA_GRANTS=STILL_UNSAFE
DEFAULT_PRIVILEGES=STILL_UNSAFE
RLS_ROLLOUT=STILL_REQUIRED
CLOUD_EXPANSION=STILL_BLOCKED
DUAL_MIGRATION=STILL_BLOCKED_ON_RECOVERY_EVIDENCE
```

---

## 1. Why containment is authorized (engineering)

| Check | Result |
|-------|--------|
| Production business PostgREST dependencies | **0** |
| Auth-only Supabase usage | **Yes** |
| External probe confirms sensitive table reads | **Yes** (`DATA_API_PUBLIC_EXPOSURE_CONFIRMED`) |
| Prisma is authoritative data path | **Yes** |

Full Data API disable is broader than necessary. **Removing `public` from exposed schemas** blocks anonymous/authenticated table access while leaving Supabase Auth operational.

---

## 2. Pre-change checklist (operator)

- [x] Record completed automatic backup or PITR window (`MIGRATION_BACKUP_*` operator env — gitignored)
- [x] Capture logical dump outside repository; record SHA-256 in operator notes only
- [x] Document current **API → Exposed schemas** list from Dashboard (expect `public`)
- [x] Run baseline probe: `npm run cloud-data-api-exposure:probe` — save status table (no keys)
- [x] Run Production smoke baseline: `/`, `/login`, `/account` (authenticated requester), one Prisma-backed admin read
- [x] Confirm no in-flight controlled migration apply window
- [x] **Rollback decision point:** if Auth or `/account` fails post-change, revert exposed schemas before any migration apply

---

## 3. Change procedure (Dashboard — operator only)

**Preferred (Path A):**

1. Supabase Dashboard → **Project Settings → API**
2. Under **Exposed schemas**, remove `public` (leave no business schema exposed until RLS batch rollout defines a dedicated `api` schema if needed)
3. Save configuration

**Alternative (broader):** disable Data API entirely — use only if Path A insufficient; re-verify Auth immediately.

**Not authorized in CLOUD.1B:** RLS policy batch apply, default-privilege migration, or FTGP dual migration.

---

## 4. Post-change verification

| Check | Expected | CLOUD.1C result |
|-------|----------|-----------------|
| `npm run cloud-data-api-containment:verify` | Sensitive tables **denied** (401/404) | **PASS** (404, no count headers) |
| `npm run cloud-containment-smoke:verify` | Auth + server routes OK | **PASS** |
| `/login` email/password | Functional | 200 |
| Password recovery | Functional | 200 (`/login?recovery=1`) |
| `/account` (role-neutral requester) | Functional | 200 |
| `/api/health` | Functional | 200 |
| Prisma server routes | Functional | Parity + migrate status OK |
| Production deployment | **Not required** for this change | Unchanged |
| Customer/tenant data | **Unchanged** | Row counts stable |

---

## 5. Rollback

1. Restore `public` to exposed schemas (or re-enable Data API)
2. Re-run probe — expect prior exposure baseline
3. Re-run Auth + `/account` smoke tests
4. Do **not** proceed with controlled migration apply until containment stable

---

## 6. Coordination with pending migrations

Dual migration remains blocked until:

```text
RECOVERY_EVIDENCE_VERIFIED=false
DATA_API_CONTAINMENT_PATH_APPROVED=true
FTGP_MIGRATION_FAIL_CLOSED=true
MIGRATION_HASHES_REPINNED=true
CONTROLLED_WRAPPER_TESTS_PASS=true
```

Containment (Dashboard) is **complete**. SQL migration apply remains blocked on recovery evidence.

**Pending (unapplied) as of CLOUD.1C verification:**

1. `20260618120000_c3_legal_publication_lifecycle`
2. `20260621120000_ftgp_platform_internal_role_assignment`

---

## 7. Execution record

CLOUD.1B prepared this runbook. **CLOUD.1C (2026-06-21):** operator applied Path A on project `wbwnsndcxrgyqwppurms`; post-change verification passed via `cloud-data-api-containment:verify` and `cloud-containment-smoke:verify` using `.env.staging.runtime`.

---

## Related documents

- `CROW_DATA_API_DEPENDENCY_AUDIT.md`
- `CROW_SUPABASE_PRO_FOUNDATION.md`
- `proposed/cloud_public_schema_default_privileges_hardening.sql`
