# GAP-004 — Isolation Evidence Log

| Field | Value |
|-------|-------|
| **Title** | Preview vs Production database isolation evidence |
| **Status** | **INCOMPLETE — isolation not proven** |
| **Authority** | CROW.GAP004.2 · [`GAP-004-OWNER-EXECUTION-CHECKLIST.md`](GAP-004-OWNER-EXECUTION-CHECKLIST.md) |
| **Date** | 2026-07-18 |
| **Branch / start HEAD** | `feat/first-tenant-golden-path` @ `3dfde99` |
| **Issue** | [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) |
| **Known Production Supabase ref** | `wbwnsndcxrgyqwppurms` |

**Secrets policy:** No full `DATABASE_URL`, passwords, or tokens in this file.

---

## 1. Decision summary

| Question | Result |
|----------|--------|
| Preview DB ≠ Production DB? | **Not proven** |
| `PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT` | **0** |
| GAP-004 status | **Open / blocked** |
| Controlled Preview migrate authorized? | **No** |
| Production env changed this milestone? | **No** (`PRODUCTION_ENV_CHANGED_COUNT=0`) |
| Production migrate / write this milestone? | **No** |

---

## 2. vercel.json migrate safety (proven in repo)

| Check | Result |
|-------|--------|
| `buildCommand` | `node scripts/vercel-build-guard.mjs && npm run db:generate && npm run build` |
| Contains `db:migrate:deploy`? | **No** |
| Contains `prisma migrate deploy`? | **No** |
| Automatic Preview-build migrate? | **No** (code) |

---

## 3. Local operator env comparison (redacted) — 2026-07-18

Command (no secrets in output):

```bash
npm run db-isolation-env:check -- --production-env-file=.env.production.runtime --preview-env-file=.env.preview.operator
```

| Source | Masked ref | Fingerprint (DATABASE_URL) | Fingerprint (DIRECT_URL) |
|--------|------------|----------------------------|--------------------------|
| `.env.production.runtime` | `wbwn…urms` (`wbwnsndcxrgyqwppurms`) | `b7f801cfe5e30009` | `0355c17692e2a90d` |
| `.env.preview.operator` | `wbwn…urms` (`wbwnsndcxrgyqwppurms`) | `b7f801cfe5e30009` | `0355c17692e2a90d` |

| Finding | Detail |
|---------|--------|
| Shared project ref | Yes — both resolve to known Production ref |
| Fingerprints match | Yes — identical pooler/direct targets |
| Script result | `RESULT=BLOCKED` · exit 1 · `PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=0` |

**Interpretation:** Current local operator Preview credentials still target Production. This is **evidence of shared backend**, not isolation. Vercel dashboard binding was **not** changed by this milestone.

---

## 4. Vercel dashboard binding evidence (owner — pending)

| Field | Production | Preview |
|-------|------------|---------|
| Supabase ref (masked) | _(owner fill)_ | _(owner fill)_ |
| `DATABASE_ENVIRONMENT` | _(owner fill)_ | _(owner fill)_ |
| `BACKEND_ISOLATION` | _(owner fill)_ | _(owner fill)_ |
| Fingerprint | _(owner fill)_ | _(owner fill)_ |
| Confirmed different? | ☐ Yes / ☐ No | |

Until filled with **differing** refs, isolation remains unproven.

---

## 5. Owner manual actions status

| Action | Status |
|--------|--------|
| Provision dedicated Preview Supabase | **Pending** |
| Preview ref ≠ Production | **Pending** |
| Bind Vercel Preview env to Preview DB | **Pending** |
| Keep Production env unchanged | **Honored this milestone** (no agent changes) |
| No Production data copy | **Honored** |
| No migrations | **Honored** |
| No hosted business writes | **Honored** |

---

## 6. Safety counters (this milestone)

| Counter | Value |
|---------|-------|
| `UNAUTHORIZED_MIGRATION_COUNT` | 0 |
| `HOSTED_BUSINESS_WRITE_COUNT` | 0 |
| `PRODUCTION_ENV_CHANGED_COUNT` | 0 |
| `PRODUCTION_DEPLOYMENT_COUNT` | 0 |
| `PRODUCTION_DATABASE_MIGRATION_COUNT` | 0 |
| `PRODUCTION_DATABASE_WRITE_COUNT` | 0 |
| `PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT` | **0** |

---

## 7. Controlled Preview migrate readiness

| Criterion | Met? |
|-----------|------|
| Isolation proven | **No** |
| Preview-only target confirmed | **No** |
| Owner migrate authorization | **Not requested / not granted** |
| Rollback strategy documented | Deferred until isolation proven |

**Do not run Preview migrate until isolation proven and owner authorizes.**

---

## 8. Missing evidence (exact)

1. Dedicated Preview Supabase project ref (≠ `wbwnsndcxrgyqwppurms`)  
2. Vercel Preview env bound to that project  
3. Redacted dashboard confirmation that Production and Preview refs differ  
4. Re-run of `db-isolation-env:check` (or equivalent) with `PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=1`  

---

## 9. Update rule

When owner completes Phase 1–3:

1. Fill §4 with redacted values  
2. Re-run isolation check  
3. If proven, update this status to **PROVEN** and GAP-LEDGER to **mitigated** (not closed until hosted persistence policy revisited)  
4. Comment Issue #16 with redacted summary only
