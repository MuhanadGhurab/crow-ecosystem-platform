# GAP-015 — Vercel Ignored Build Step Setup Checklist

| Field | Value |
|-------|-------|
| **Status** | **Configured** (CROW.GAP015.3) — verify residual about `main` lacking guard script |
| **Date** | 2026-07-18 |
| **Guard script** | `node scripts/safety/vercel-production-deploy-guard.mjs` |
| **Prerequisite** | Guard package on FTGP (CROW.GAP015.2) |

## Preconditions

- [x] Owner authorizes: CROW.GAP015.3 Ignored Build Step configuration
- [x] Guard script exists at `scripts/safety/vercel-production-deploy-guard.mjs` (on FTGP)
- [x] `npm run vercel-production-deploy-guard:test` PASS
- [x] Settings-only — not Instant Promote
- [x] Instant Promote of `dpl_8xT92…` remains **not** authorized

## Exact Vercel setting

| Field | Value |
|-------|-------|
| Project | `crow-ecosystem-platform` (`prj_lsHQMiMZskg8CzRVd4EHfiAo8o7h`) |
| Path | Settings → Git → Ignored Build Step |
| Command | `node scripts/safety/vercel-production-deploy-guard.mjs` |
| Applied via | `PATCH /v9/projects/...` body `{ "commandForIgnoringBuildStep": "..." }` only |
| Confirmed | **Yes** (re-GET after PATCH) |

## Verification after configuration

| Step | Expected | Result |
|------|----------|--------|
| Local Preview (`VERCEL_ENV=preview`) | Allow exit 1 | **Pass** |
| Local unauthorized Production | Skip exit 0 | **Pass** |
| Live public domain | Still `dpl_QeDhnxz…` | **Pass** |
| Instant Promote | None | **Pass** |
| Env vars changed | None | **Pass** |
| Migrations / hosted writes | None | **Pass** |
| Real Production deploy | Not triggered | **Pass** |

## Residual: guard script not on `main`

`main` @ `e8cb812` does **not** contain the guard script. Missing-script → Node non-zero exit → Vercel **allows** build. Full Production fail-closed for `main` commits requires owner-authorized follow-up (bring script to `main` or fail-closed wrapper).

## Authorizing a Production build later (separate owner action)

1. Ensure the commit includes the guard script
2. Set temporary Production env: `CROW_PRODUCTION_DEPLOY_AUTHORIZED=true`, `CROW_PRODUCTION_DEPLOY_SHA=<sha>`, `CROW_PRODUCTION_DEPLOY_REASON=<reason>`
3. Trigger authorized deploy for that SHA only
4. Clear the three auth vars after
5. Instant Promote remains separate

## Rollback of Ignored Build Step

1. Owner authorizes settings rollback
2. `PATCH` `commandForIgnoringBuildStep` to `null` / clear in UI
3. Record in Issue #15

## Milestone status

| Action | Done? |
|--------|-------|
| Document checklist | Yes |
| Apply Ignored Build Step in Vercel | **Yes** (`VERCEL_IGNORED_BUILD_STEP_CONFIGURED_COUNT=1`) |
| Change Production env | **No** |
| Deploy Production | **No** |
| Fix residual (script on `main`) | **No** — pending owner |
