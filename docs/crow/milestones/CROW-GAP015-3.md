# CROW.GAP015.3 — Configure Vercel Ignored Build Step and Verify Production Guard

| Field | Value |
|-------|-------|
| **Status** | Complete — Ignored Build Step configured; settings verification recorded |
| **Date** | 2026-07-18 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Start HEAD** | `0ce2b1f` |
| **Owner authorization** | OWNER AUTHORIZES CROW.GAP015.3 — Configure Vercel Ignored Build Step to use the certified guard script and verify behavior only |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) — kept OPEN |
| **main** | `e8cb812` (unchanged) |
| **Production live** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |
| **PR #10** | OPEN · DRAFT · CONFLICTING · untouched |

## Purpose

Wire Vercel Project Ignored Build Step to:

```text
node scripts/safety/vercel-production-deploy-guard.mjs
```

Verify Preview allow / unauthorized Production skip behavior without deploying Production, Instant Promoting, changing env vars, or mutating GitHub protection.

## Configuration result

| Item | Result |
|------|--------|
| API | `PATCH /v9/projects/crow-ecosystem-platform` with **only** `commandForIgnoringBuildStep` |
| Project | `prj_lsHQMiMZskg8CzRVd4EHfiAo8o7h` · team `team_JsNIQlTitYCs1yjig631FnF5` |
| Confirmed value | `node scripts/safety/vercel-production-deploy-guard.mjs` |
| Other settings changed | **No** (buildCommand left untouched) |
| `VERCEL_IGNORED_BUILD_STEP_CONFIGURED_COUNT` | **1** |

## Verification

### Preview build allowed

| Check | Result |
|-------|--------|
| Local: `VERCEL_ENV=preview` | `ALLOW_NON_PRODUCTION_BUILD` · exit `1` |
| `PREVIEW_BUILD_ALLOWED_COUNT` | **1** |
| Live Preview after FTGP docs push | Expected to run (script present on FTGP) |

### Unauthorized Production build guarded

| Check | Result |
|-------|--------|
| Local: `VERCEL_ENV=production` without auth vars | `BLOCK_UNAUTHORIZED_PRODUCTION_BUILD` · exit `0` (skip) |
| Real Production deploy triggered | **No** |
| `UNAUTHORIZED_PRODUCTION_BUILD_BLOCKED_COUNT` | **1** (local/certified semantics) |

### Production domain / Instant Promote / env / writes

| Check | Result |
|-------|--------|
| Live domain deployment | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` |
| `PRODUCTION_DOMAIN_CHANGED_COUNT` | **0** |
| `INSTANT_PROMOTE_COUNT` | **0** |
| `PRODUCTION_ENV_CHANGED_COUNT` | **0** |
| `UNAUTHORIZED_MIGRATION_COUNT` | **0** |
| `HOSTED_BUSINESS_WRITE_COUNT` | **0** |
| `GITHUB_BRANCH_PROTECTION_CHANGED_COUNT` | **0** |

## Residual risk (important)

The guard script exists on `feat/first-tenant-golden-path` but **not** on `main` @ `e8cb812`.

If a Production-target Git event occurs for a commit that lacks `scripts/safety/vercel-production-deploy-guard.mjs`, Node exits non-zero when the file is missing. Under Vercel Ignored Build Step rules, non-zero exit **allows** the build — so **Production from current `main` is not yet fail-closed by the guard file**.

Mitigation options (owner decision — not done here):

1. Owner-authorize bringing the guard script onto `main` (small safety slice; still treat merge as Production-risk), **or**
2. Owner-authorize a fail-closed wrapper command that skips Production when the script is missing (would change the Ignored Build Step string)

Until then: keep Option A/C process — no `main` merge without owner acceptance.

## Observed (unchanged) dashboard buildCommand

Project `buildCommand` still includes `db:migrate:deploy` in the Vercel dashboard setting. **Not modified** this milestone (owner forbade other settings changes). Local `vercel.json` on FTGP remains migrate-free. Track as residual ops risk for any future authorized Production build.

## Constraints honored

| Constraint | Result |
|------------|--------|
| Only Ignored Build Step changed | Yes |
| No Production deploy / Instant Promote | Yes |
| No `main` push / PR #10 merge | Yes |
| No env var changes | Yes |
| No migrations / hosted writes | Yes |
| No GitHub branch protection | Yes |

## GAP impact

| Gap | After CROW.GAP015.3 |
|-----|---------------------|
| GAP-015 | **Open** — Vercel Ignored Build Step configured; GitHub protection pending; residual until guard is on `main` |
| GAP-004 | Open / blocked |
| GAP-004A | Accepted standing mitigation |

## Owner decisions still required

1. Authorize bringing guard script to `main` (or fail-closed wrapper) so Production skips work for current production branch commits
2. Authorize GitHub `main` protection (GAP015.4)
3. Decide whether to fix dashboard `buildCommand` migrate (separate auth — GAP-004 related)
4. Instant Promote `dpl_8xT92…` remains not authorized

## Recommended next milestone

**CROW.GAP015.4** — GitHub `main` protection · **and/or** owner-authorized guard-on-main / fail-closed residual fix.

## Final verdict

**READY — GAP-015 VERCEL PRODUCTION DEPLOY GUARD CONFIGURED AND VERIFIED**
