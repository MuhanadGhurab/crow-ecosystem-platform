# Crow Emergency Data API Exposure Containment

**Phase:** CLOUD.1B  
**Classification:** `DATA_API_EXPOSURE_CONTROL` | `CONTROLLED_APPLY_REQUIRED` (Dashboard) | **NOT EXECUTED**  
**Recommended path:** **Path A** — remove `public` from PostgREST exposed schemas

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

- [ ] Record completed automatic backup or PITR window (`MIGRATION_BACKUP_*` operator env — gitignored)
- [ ] Capture logical dump outside repository; record SHA-256 in operator notes only
- [ ] Document current **API → Exposed schemas** list from Dashboard (expect `public`)
- [ ] Run baseline probe: `npm run cloud-data-api-exposure:probe` — save status table (no keys)
- [ ] Run Production smoke baseline: `/`, `/login`, `/account` (authenticated requester), one Prisma-backed admin read
- [ ] Confirm no in-flight controlled migration apply window
- [ ] **Rollback decision point:** if Auth or `/account` fails post-change, revert exposed schemas before any migration apply

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

| Check | Expected |
|-------|----------|
| `npm run cloud-data-api-exposure:probe` | Sensitive tables **denied** (401/404) |
| `/login` email/password | Functional |
| Google OAuth (if enabled) | Functional |
| Password recovery | Functional |
| `/account` (role-neutral requester) | Functional |
| Prisma server routes | Functional |
| Production deployment | **Not required** for this change |
| Customer/tenant data | **Unchanged** |

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
RECOVERY_EVIDENCE_VERIFIED=true
DATA_API_CONTAINMENT_PATH_APPROVED=true
FTGP_MIGRATION_FAIL_CLOSED=true
MIGRATION_HASHES_REPINNED=true
CONTROLLED_WRAPPER_TESTS_PASS=true
```

Containment (Dashboard) is **independent** of SQL migration apply but should precede or accompany FTGP authority migration on shared Production DB.

---

## 7. Explicit no-execution statement

CLOUD.1B **prepared** this runbook only. No Dashboard changes were made during the audit task.

---

## Related documents

- `CROW_DATA_API_DEPENDENCY_AUDIT.md`
- `CROW_SUPABASE_PRO_FOUNDATION.md`
- `proposed/cloud_public_schema_default_privileges_hardening.sql`
