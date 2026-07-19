# CROW.DEVFLOW.5B — Resume Preview Demo Feedback E2E After Preview DB Env Authorization

| Field | Value |
|-------|-------|
| **Status** | **Blocked** — Preview DB URLs still not visible for FTGP |
| **Date** | 2026-07-19 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Starting HEAD** | `a86d6c1` (CROW.DEVFLOW.5A tip) |
| **Final HEAD** | `d341703` |
| **Owner authorization** | Resume 5A as 5B after owner-claimed Preview `DATABASE_URL` / `DIRECT_URL` |
| **Prior** | CROW.DEVFLOW.5A (flags set; E2E blocked on missing Preview DB URL) |
| **Tracking** | Issue [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) |
| **main** | `f97a835` (unchanged) |
| **PR #10** | OPEN · DRAFT · CONFLICTING · archive only |
| **Production live** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |

## Verified env inspection (names/scopes only — no secrets)

CLI: `vercel env ls` and `vercel env ls preview feat/first-tenant-golden-path --format json`

| Variable | Production | Preview (`feat/first-tenant-golden-path`) |
|----------|------------|-------------------------------------------|
| `CROW_RUNTIME_MODE` | absent | **present** |
| `CROW_DATA_CLASSIFICATION` | absent | **present** |
| `ALLOW_SHARED_DEMO_BACKEND` | absent | **present** |
| `DATABASE_URL` | present | **absent** |
| `DIRECT_URL` | present | **absent** |
| `CROW_ALLOW_REAL_CUSTOMER_DATA` | absent | absent |

**Production env was not modified by this milestone.**

Owner stated Preview DB URLs were set before 5B. **Repository/Vercel CLI truth disagrees:** branch-scoped Preview list for FTGP returns only the three alpha flags (3 rows). No Preview-scoped `DATABASE_URL` / `DIRECT_URL` for this branch.

## Preview deployment evidence

| Item | Value |
|------|-------|
| Latest FTGP tip deploy | `dpl_9Yqg3VLLX7scJcaFUhwPANkyCz1t` @ `a86d6c1` |
| Target | Preview (`target: null` / not Production) |
| State | **ERROR** |
| Build error | `DATABASE_URL is not set` (`vercel-build-guard`) |
| Branch alias | `crow-ecosystem-platform-git-feat-2491ce-muhanadghurabs-projects.vercel.app` |

No READY Preview URL for `/alpha-feedback` E2E. No new Production deploy. No Instant Promote.

## E2E status

| Check | Result |
|-------|--------|
| Preview READY | **No** |
| Alpha banner | Not verified (no READY Preview) |
| `/alpha-feedback` submit | Not verified |
| `PlatformNotification` `alpha_demo_feedback` | Not verified |
| ProCrow inbox exclusion | Not verified on Preview |
| Request/Discovery/Blueprint/tenant/payment/CroAI | Not triggered |

## Owner action required (exact Vercel UI)

Confirm you are on project **`crow-ecosystem-platform`** (team **muhanadghurabs-projects**).

1. Open [Vercel Dashboard](https://vercel.com) → **crow-ecosystem-platform** → **Settings** → **Environment Variables**
2. Find or **Add** `DATABASE_URL`:
   - Environment: **Preview**
   - Git Branch: **`feat/first-tenant-golden-path`** (custom branch — not “All Preview Environments” alone unless you also intend all Preview branches)
   - Value: paste from your local `.env.staging` / demo sandbox pooler URL (**do not paste into chat**)
3. Find or **Add** `DIRECT_URL` the same way (Preview + `feat/first-tenant-golden-path`)
4. Confirm Production rows for `DATABASE_URL` / `DIRECT_URL` are **unchanged** (do not edit Production)
5. Confirm `CROW_ALLOW_REAL_CUSTOMER_DATA` is **not** set to `true`
6. Confirm the three alpha flags remain on Preview FTGP
7. After save, open **Deployments** → select latest FTGP Preview → **Redeploy** (or push a no-op docs commit on FTGP)
8. Wait until state is **Ready** (not Error)
9. Open Preview URL → `/alpha-feedback` → submit fake feedback (see below) → tell Cursor “submitted”

### Fake feedback (when READY)

- Reviewer name: `Alpha Tester`
- Reviewer type: `tester`
- Feedback type: `idea`
- Page or area: `/alpha-feedback`
- Message: `Demo feedback test from CROW.DEVFLOW.5B. This is fake alpha review data only.`
- Severity: `low`

### Common mistakes

- Added vars to a **different** Vercel project
- Added to **Production** only (already present) and assumed Preview inherits them — Preview does **not** inherit Production secrets
- Added to **All Preview** but CLI/branch filter still missing — re-check with Git Branch = `feat/first-tenant-golden-path`
- Typo in branch name (`feat/first-tenant-golden-path`)

## Counters (this attempt)

```
PREVIEW_DATABASE_URL_CONFIGURED_COUNT=0
PREVIEW_DIRECT_URL_CONFIGURED_COUNT=0
PREVIEW_ENV_FLAGS_CONFIGURED_COUNT=1
PRODUCTION_ENV_CHANGED_COUNT=0
PREVIEW_DEPLOYMENT_TRIGGERED_COUNT=0
PREVIEW_DEPLOYMENT_READY_COUNT=0
DEMO_FEEDBACK_PREVIEW_VERIFIED_COUNT=0
DEMO_FEEDBACK_TEST_RECORD_CREATED_COUNT=0
SECRET_PRINTED_COUNT=0
MAIN_PUSH_COUNT=0
PR10_MERGED_COUNT=0
PRODUCTION_DEPLOYMENT_COUNT=0
```

## Final verdict

**BLOCKED — PREVIEW DEMO FEEDBACK STILL REQUIRES OWNER OR VERCEL ACTION**
