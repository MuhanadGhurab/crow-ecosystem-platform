# C2.1 — Preview apply runbook (prepare only)

**Status:** Prepared in C2.1 — **not executed**.  
**Authorization:** Requires explicit product-owner message containing: **`APPLY C2 MIGRATION TO PREVIEW`**.  
General C2 or C2.1 gate approval is **not** sufficient.  
**Production:** Separate gate later; this runbook is Preview-only.

---

## Current state (2026-06-15)

On the hosted target bound to `.env.staging`:

- C2 migration **already applied** (`C2_ALREADY_APPLIED`).
- Database **shared** with documented production Supabase ref `wbwnsndcxrgyqwppurms`.

If isolation is not fixed, **do not proceed** with any apply framed as Preview-only.

---

## Phase A — Change record

| Field | Value |
|-------|--------|
| migration | `20260614120000_blueprint_versioning_traceability` |
| PR | #6 |
| commit | `48e372f` (C2 branch) |
| target environment | Preview (intended) |
| target fingerprint | `0355c17692e2a90d` / ref `wbwnsndcxrgyqwppurms` |
| operator | _TBD at apply time_ |
| approval | _Explicit PO phrase required_ |
| observation window | 24h post-apply minimum |

---

## Phase B — Backup and recovery

| Item | Preview (Supabase) |
|------|-------------------|
| PITR | Confirm in Supabase dashboard for project ref (provider capability) |
| Logical backup | `pg_dump` before apply if isolated Preview DB exists |
| Recovery owner | Platform / DBA |
| Limitation | Shared DB apply affects Production if URLs are not isolated |

**Do not claim backup exists without operator verification.**

---

## Phase C — Migration (future authorized)

```bash
# ONLY after explicit PO authorization AND isolated Preview DATABASE_URL
npx prisma migrate deploy
```

**Forbidden without separate reviewed authorization:**

- Prisma schema push (non-migration DDL)
- `prisma migrate resolve`
- `prisma migrate reset`

**Note:** If C2 is already applied, Phase C is **no-op**; proceed to Phase D validation and backfill planning only.

---

## Phase D — Validation (future)

1. `npx prisma migrate status` (read-only check)
2. Confirm C2 tables/indexes exist
3. App health: `/api/health` or equivalent
4. Auth login (staging user)
5. Tenant-scoped Blueprint list
6. Studio load `/blueprints/[id]/studio`
7. Legacy dual-read path
8. Create draft version (non-destructive)
9. Conflict handling smoke
10. Trace event write/read
11. ROI snapshot read
12. SOW version read
13. Client-safe projection (no internal fields)

---

## Phase E — Observation

Monitor for 24h:

- Vercel function errors
- Prisma connection pool exhaustion
- Migration lock duration (if apply re-run)
- Unauthorized cross-tenant access attempts
- Backfill diagnostics

---

## Post-migration backfill (separate authorization)

```bash
# Dry-run first (default)
npm run blueprint-persistence:backfill

# Apply mode ONLY with explicit PO authorization — never in C2.1
```

---

## Rollback / forward-fix

| Scenario | Action |
|----------|--------|
| DDL already applied, data bad | Forward-fix data; **do not drop** C2 tables in shared DB without Production outage plan |
| Partial backfill | Re-run dry-run; idempotent skip for existing versions |
| Tenant mis-association | Stop apply; manual `tenantId` correction |
| App regression | Revert Vercel deployment; schema remains (additive) |

Additive migration: rollback is **forward-fix preferred** over destructive DDL.
