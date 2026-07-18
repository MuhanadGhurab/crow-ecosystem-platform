# GAP-004 — Isolation Evidence Log

| Field | Value |
|-------|-------|
| **Title** | Preview vs Production database isolation evidence |
| **Status** | **INCOMPLETE — isolation not proven** (CROW.GAP004.3 recheck) |
| **Authority** | CROW.GAP004.3 · [`GAP-004-OWNER-EXECUTION-CHECKLIST.md`](GAP-004-OWNER-EXECUTION-CHECKLIST.md) |
| **Date** | 2026-07-18 |
| **Branch / start HEAD** | `feat/first-tenant-golden-path` @ `2713701` |
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

## 3. Local operator env comparison (redacted) — 2026-07-18 (GAP004.2 + GAP004.3)

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

**Interpretation:** Local operator Preview credentials still target Production.

---

## 4. Vercel dashboard / CLI binding evidence — CROW.GAP004.3 recheck (2026-07-18)

Owner stated Preview Supabase was provisioned and Vercel Preview was rebound. Agent recheck (read-only):

### 4.1 Env variable scope (`vercel env ls`)

| Variable | Environments (CLI) | Created |
|----------|--------------------|---------|
| `DATABASE_URL` | **Production, Preview** (shared binding) | 54d ago |
| `DIRECT_URL` | **Production, Preview** (shared binding) | 54d ago |
| `NEXT_PUBLIC_SUPABASE_URL` | **Production, Preview** (shared binding) | 54d ago |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **Production, Preview** | 54d ago |
| `SUPABASE_SERVICE_ROLE_KEY` | **Production, Preview** | 54d ago |
| `DATABASE_ENVIRONMENT` | Production only (+ old branch Preview override) | — |
| `BACKEND_ISOLATION` | Production only (+ old branch Preview override) | — |

**Finding:** There is **no** Preview-only `DATABASE_URL` / `DIRECT_URL` override. Shared Production+Preview scope remains.

### 4.2 Non-secret metadata from `vercel env pull` (Sensitive URL values masked by Vercel)

| Field | Production | Preview |
|-------|------------|---------|
| Supabase ref (from URL) | **Unavailable** — Vercel pull returns Sensitive placeholders for DB URLs | **Unavailable** (same) |
| `DATABASE_ENVIRONMENT` | `production` | *(absent on default Preview pull)* |
| `BACKEND_ISOLATION` | **`shared`** | *(absent on default Preview pull)* |
| `EXPECTED_DATABASE_FINGERPRINT` | `b7f801cfe5e30009` (matches known Production) | *(absent)* |
| `EXPECTED_DIRECT_DATABASE_FINGERPRINT` | `0355c17692e2a90d` (matches known Production) | *(absent)* |
| Confirmed different refs? | **No** | |

Pulled temp files were deleted after inspection; never committed.

### 4.3 Isolation check on Vercel pulls

```bash
npm run db-isolation-env:check -- --production-env-file=.env.vercel.production.gap0043.tmp --preview-env-file=.env.vercel.preview.gap0043.tmp
```

Result: `PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=0` (URLs unparseable / Sensitive placeholders — not usable as positive isolation proof). Combined with §4.1 shared scope → isolation **not proven**.

---

## 5. Owner manual actions status

| Action | Status |
|--------|--------|
| Provision dedicated Preview Supabase | **Claimed by owner — not evidenced in Vercel Preview DB binding** |
| Preview ref ≠ Production | **Not proven** |
| Bind Vercel Preview env to Preview DB only | **Not evidenced** — `DATABASE_URL` still Production+Preview shared |
| Keep Production env unchanged | **Honored this milestone** (no agent changes; Production still `wbwnsndcxrgyqwppurms` fingerprints / `BACKEND_ISOLATION=shared`) |
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
| Owner migrate authorization | **Not granted** |
| Rollback strategy documented | Deferred until isolation proven |

**Do not run Preview migrate until isolation proven and owner authorizes.**

---

## 8. Missing evidence (exact)

1. Vercel Preview **separate** `DATABASE_URL` / `DIRECT_URL` (Preview-only scope, not shared with Production)  
2. Preview Supabase project ref ≠ `wbwnsndcxrgyqwppurms` (redacted dashboard or parseable pull)  
3. Preview `DATABASE_ENVIRONMENT=preview` and `BACKEND_ISOLATION=isolated`  
4. Production `BACKEND_ISOLATION` updated to `isolated` only after Preview is truly separate (optional label cleanup — must not imply false isolation)  
5. `npm run db-isolation-env:check` with parseable Preview ≠ Production refs → `PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=1`  

---

## 9. Update rule

When owner completes Phase 1–3 for real:

1. Split Vercel env: Production-only vs Preview-only DB URLs  
2. Fill §4 with redacted differing refs  
3. Re-run isolation check  
4. If proven, status → **PROVEN** · GAP-LEDGER → **mitigated** (not closed until hosted persistence policy revisited)  
5. Comment Issue #16 with redacted summary only  
