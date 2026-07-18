# GAP-015 — Production Deploy Evidence Template

| Field | Value |
|-------|-------|
| **Status** | Template — fill per authorized attempt |
| **Procedure** | [`GAP-015-AUTHORIZED-PRODUCTION-DEPLOY-PROCEDURE.md`](GAP-015-AUTHORIZED-PRODUCTION-DEPLOY-PROCEDURE.md) |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) |

Copy this section into Issue #15 (or an operator evidence note). **Do not** paste secrets.

---

## Attempt metadata

| Field | Value |
|-------|-------|
| Date (UTC) | |
| Operator | |
| Owner phrase (verbatim) | |
| Target SHA | |
| Reason | |
| Allowed scope (summary) | |
| Migrations authorized? | No / Yes (phrase link) |
| Hosted writes authorized? | No / Yes (phrase link) |
| Instant Promote authorized? | No / Yes (phrase + `dpl_…`) |
| Blueprint generation authorized? | No |
| PR #10 touched? | No |

## Baseline

| Field | Value |
|-------|-------|
| Live Production URL | https://crow-ecosystem-platform.vercel.app |
| Previous live deployment ID | |
| Rollback target ID | |
| `main` HEAD at attempt | |
| Guard script present on target SHA? | Yes / No |
| Ignored Build Step command | `node scripts/safety/vercel-production-deploy-guard.mjs` |

## Pre-deploy checklist

| Check | Result |
|-------|--------|
| Target SHA on `main` | ☐ Pass / ☐ Fail |
| Main protection + required checks | ☐ Pass / ☐ Fail |
| Diff safety (no prohibited work) | ☐ Pass / ☐ Fail |
| GAP-004 / GAP-004A reviewed | ☐ Pass / ☐ Fail |
| Owner phrase recorded | ☐ Pass / ☐ Fail |

## Env authorization window

| Step | Timestamp | Result |
|------|-----------|--------|
| Set `CROW_PRODUCTION_DEPLOY_AUTHORIZED=true` | | ☐ |
| Set `CROW_PRODUCTION_DEPLOY_SHA=<exact>` | | ☐ |
| Set `CROW_PRODUCTION_DEPLOY_REASON=<reason>` | | ☐ |
| Cleared/reset after attempt | | ☐ |

Do not record secret values — only confirm set/cleared.

## Execution

| Field | Value |
|-------|-------|
| Path used | Option A / B / C (Instant Promote) |
| New deployment ID | |
| Guard decision logged | `ALLOW_AUTHORIZED_PRODUCTION_BUILD` / other / N/A |
| Build result | Success / Failed / Skipped / Aborted |

## Post-deploy verification

| Check | Result |
|-------|--------|
| SHA matches authorized | ☐ Pass / ☐ Fail |
| Live domain expected | ☐ Pass / ☐ Fail (record current `dpl_…`) |
| No unexpected migrations | ☐ Pass / ☐ Fail |
| No unauthorized hosted writes | ☐ Pass / ☐ Fail |
| Auth env cleared | ☐ Pass / ☐ Fail |
| Smoke / public access | ☐ Pass / ☐ Fail |
| Rollback target preserved | ☐ Pass / ☐ Fail |

## Counters (fill)

```
PRODUCTION_DEPLOYMENT_COUNT=
PRODUCTION_DOMAIN_CHANGED_COUNT=
INSTANT_PROMOTE_COUNT=
PRODUCTION_ENV_CHANGED_COUNT=
UNAUTHORIZED_MIGRATION_COUNT=
HOSTED_BUSINESS_WRITE_COUNT=
PR10_MERGED_COUNT=
```

## Abort / rollback (if any)

| Field | Value |
|-------|-------|
| Abort reason | |
| Failed deployment ID | |
| Rollback phrase used? | No / Yes |
| Restored live `dpl_…` | |

## Final verdict (pick one)

- `READY — AUTHORIZED PRODUCTION DEPLOY COMPLETE`
- `ABORTED — AUTHORIZED PRODUCTION DEPLOY STOPPED SAFELY`
- `FAILED — AUTHORIZED PRODUCTION DEPLOY REQUIRES OWNER RESPONSE`
