# CROW.DEVFLOW.5A — Preview Demo Feedback Activation and End-to-End Verification

| Field | Value |
|-------|-------|
| **Status** | **Blocked** — Preview demo flags configured; Preview build/DB path incomplete |
| **Date** | 2026-07-19 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Starting HEAD** | `b96e27f` (CROW.DEVFLOW.5 tip) |
| **Final HEAD** | _(docs commit on FTGP — pin after push)_ |
| **Owner authorization** | CROW.DEVFLOW.5A — Preview-scoped demo flags + Preview verification only |
| **Prior** | CROW.DEVFLOW.5 (demo feedback pilot implemented) |
| **Tracking** | Issue [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) |
| **main** | `f97a835` (unchanged) |
| **PR #10** | OPEN · DRAFT · CONFLICTING · archive only |
| **Production live** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |

## What was completed

### Preview env inspection (names/scopes only — no secrets)

| Variable | Production | Preview (this branch) | Notes |
|----------|------------|------------------------|-------|
| `CROW_RUNTIME_MODE` | absent | **added** `feat/first-tenant-golden-path` = `alpha_development` | Non-sensitive |
| `CROW_DATA_CLASSIFICATION` | absent | **added** `feat/first-tenant-golden-path` = `demo_only` | Non-sensitive |
| `ALLOW_SHARED_DEMO_BACKEND` | absent | **added** `feat/first-tenant-golden-path` = `true` | Non-sensitive |
| `CROW_ALLOW_REAL_CUSTOMER_DATA` | absent | absent | Correct — must stay unset |
| `DATABASE_URL` | present | **absent** | Blocks Preview build + Prisma write |
| `DIRECT_URL` | present | **absent** | Needed for some Prisma paths |

**Production env was not modified.**

### Blocker

Latest GitHub Preview deployments for `feat/first-tenant-golden-path` are **ERROR**, including tip `b96e27f` (`dpl_GmdPruM92ZyabekfYcFjC4FwTaAQ`).

Build log (redacted):

```
✗ Cloud build: DATABASE_URL is not set.
Error: Command "node scripts/vercel-build-guard.mjs && npm run db:generate && npm run build" exited with 1
```

Therefore:

- No healthy Preview URL for banner / `/alpha-feedback` verification
- No successful `demo_feedback_save` hosted write on Preview
- PlatformNotification E2E verification **not** performed

Copying Production `DATABASE_URL` onto Preview was **not** done: not in the authorized flag list, and it would share the Production Postgres ref while GAP-004 isolation remains unproven (GAP-004A / Alpha Mode trade-off requires explicit owner choice).

## Owner action required (exact)

### Option A — Shared demo sandbox on Preview (Alpha Mode path)

1. Open Vercel → project `crow-ecosystem-platform` → **Settings** → **Environment Variables**
2. Confirm Production vars are untouched
3. Add **Preview** (Git Branch: `feat/first-tenant-golden-path`) variables by pasting values yourself (do not paste into chat):
   - `DATABASE_URL` = shared demo/dev pooler URL (owner decision that Preview may use the same sandbox DB under Alpha Mode)
   - `DIRECT_URL` = matching direct URL if required by Prisma
4. Optionally set `DATABASE_ENVIRONMENT=preview` and `BACKEND_ISOLATION=shared` for honesty (isolation still unproven)
5. Redeploy Preview for `feat/first-tenant-golden-path` (push empty commit or Redeploy from Vercel)
6. Re-run **CROW.DEVFLOW.5A** verification: open Preview `/alpha-feedback`, submit fake tester feedback, confirm `alpha_demo_feedback` row + inbox exclusion

### Option B — True Preview DB (commercial path later)

Provision an isolated Preview database, set Preview `DATABASE_URL`/`DIRECT_URL` to that DB, prove isolation (GAP-004). Out of scope for Alpha Mode demo unless owner chooses.

### Do not

- Set these on **Production**
- Set `CROW_ALLOW_REAL_CUSTOMER_DATA=true`
- Instant Promote / Production deploy / `main` push / PR #10 merge
- Store real customer or sensitive data in the test feedback

## Counters (this attempt)

```
PREVIEW_ENV_FLAGS_CONFIGURED_COUNT=1
PREVIEW_DEPLOYMENT_TRIGGERED_COUNT=0
PRODUCTION_ENV_CHANGED_COUNT=0
PRODUCTION_DEPLOYMENT_COUNT=0
DEMO_FEEDBACK_PREVIEW_VERIFIED_COUNT=0
DEMO_FEEDBACK_TEST_RECORD_CREATED_COUNT=0
DEMO_ONLY_HOSTED_WRITE_COUNT=0
HOSTED_BUSINESS_WRITE_COUNT=0
SECRET_PRINTED_COUNT=0
MAIN_PUSH_COUNT=0
PR10_MERGED_COUNT=0
```

## Final verdict

**BLOCKED — PREVIEW DEMO FEEDBACK ACTIVATION REQUIRES OWNER OR VERCEL ACTION**
