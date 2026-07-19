# CROW.DEVFLOW.5B — Resume Preview Demo Feedback E2E After Preview DB Env Authorization

| Field | Value |
|-------|-------|
| **Status** | **Blocked** — Preview READY + form OK; DB credentials invalid |
| **Date** | 2026-07-19 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Starting HEAD** | `a86d6c1` (CROW.DEVFLOW.5A tip) |
| **Final HEAD** | _(pin after docs)_ |
| **Owner authorization** | Resume 5A as 5B after Preview `DATABASE_URL` / `DIRECT_URL` |
| **Prior** | CROW.DEVFLOW.5A (flags set; E2E blocked on missing Preview DB URL) |
| **Tracking** | Issue [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) |
| **main** | `f97a835` (unchanged) |
| **PR #10** | OPEN · DRAFT · CONFLICTING · archive only |
| **Production live** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |

## Retry verification (same day)

### Env (names/scopes only — no secrets)

| Variable | Production | Preview (`feat/first-tenant-golden-path`) |
|----------|------------|-------------------------------------------|
| `CROW_RUNTIME_MODE` | absent | **present** |
| `CROW_DATA_CLASSIFICATION` | absent | **present** |
| `ALLOW_SHARED_DEMO_BACKEND` | absent | **present** |
| `DATABASE_URL` | present | **present** (owner-added) |
| `DIRECT_URL` | present | **present** (owner-added) |
| `CROW_ALLOW_REAL_CUSTOMER_DATA` | absent | absent |

**Production env was not modified.**

### Preview deployment

| Item | Value |
|------|-------|
| Deployment | `dpl_2Rt7fnwbbMkDUttphGtZa4WBxoQR` @ `12b27a5` |
| Target | Preview (not Production) |
| State | **READY** |
| URL | `https://crow-ecosystem-platform-76g2zef3s-muhanadghurabs-projects.vercel.app` |
| Branch alias | `crow-ecosystem-platform-git-feat-2491ce-muhanadghurabs-projects.vercel.app` |

Deployment Protection is on (anonymous fetch hits Vercel auth gate). Access used temporary Vercel share link for automated check only — tokens not committed.

### E2E results

| Check | Result |
|-------|--------|
| Preview READY | **Yes** |
| Alpha banner in rendered UI | **Yes** (“Crow Alpha Development Environment…”, “Send demo feedback”) |
| `/alpha-feedback` reachable | **Yes** (title `Alpha Demo Feedback · Crow`, form present) |
| Fake feedback submit | **Attempted** — UI returned persist error |
| `PlatformNotification` created | **No** |
| Root cause (runtime log, redacted) | Prisma `platformNotification.create` → **Authentication failed against database server** (invalid Preview DB credentials) |
| ProCrow inbox exclusion | N/A (no row created) |
| Request/Discovery/Blueprint/tenant/payment/CroAI | Not triggered |

Alpha demo write-guard **passed** (error was `persist_failed`, not `alpha_demo_write_blocked`). Failure is credential/connectivity to the DB URL configured on Preview FTGP.

## Owner action required (exact)

1. Vercel → **crow-ecosystem-platform** → **Settings** → **Environment Variables**
2. Edit Preview (Git Branch **`feat/first-tenant-golden-path`**) **`DATABASE_URL`**:
   - Re-paste the **full** pooler connection string from local `.env.staging` (or known-good demo sandbox)
   - Common failures: truncated password, missing `?pgbouncer=true`, wrong project ref, extra whitespace/quotes
3. Edit Preview FTGP **`DIRECT_URL`** the same way (direct/non-pooler URL if that is what Prisma expects)
4. Do **not** change Production `DATABASE_URL` / `DIRECT_URL`
5. Do **not** set `CROW_ALLOW_REAL_CUSTOMER_DATA=true`
6. **Redeploy** FTGP Preview (Deployments → Redeploy, or empty push)
7. Open Preview `/alpha-feedback` (Vercel login / share if protection on)
8. Submit fake feedback below → tell Cursor “submitted” so PlatformNotification can be verified

### Fake feedback

- Reviewer name: `Alpha Tester`
- Reviewer type: `tester`
- Feedback type: `idea`
- Page or area: `/alpha-feedback`
- Message: `Demo feedback test from CROW.DEVFLOW.5B. This is fake alpha review data only.`
- Severity: `low`

## Counters (this retry)

```
PREVIEW_DATABASE_URL_CONFIGURED_COUNT=1
PREVIEW_DIRECT_URL_CONFIGURED_COUNT=1
PREVIEW_ENV_FLAGS_CONFIGURED_COUNT=1
PRODUCTION_ENV_CHANGED_COUNT=0
PREVIEW_DEPLOYMENT_TRIGGERED_COUNT=1
PREVIEW_DEPLOYMENT_READY_COUNT=1
DEMO_FEEDBACK_PREVIEW_VERIFIED_COUNT=0
DEMO_FEEDBACK_TEST_RECORD_CREATED_COUNT=0
DEMO_ONLY_HOSTED_WRITE_COUNT=0
SECRET_PRINTED_COUNT=0
MAIN_PUSH_COUNT=0
PR10_MERGED_COUNT=0
PRODUCTION_DEPLOYMENT_COUNT=0
```

## Final verdict

**BLOCKED — PREVIEW DEMO FEEDBACK STILL REQUIRES OWNER OR VERCEL ACTION**
