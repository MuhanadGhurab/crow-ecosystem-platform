# CROW.GAP015.5 — Merge guard-on-main PR #25 and verify Production skip

| Field | Value |
|-------|-------|
| **Status** | Complete — PR #25 merged; unauthorized Production build skipped |
| **Date** | 2026-07-18 |
| **Merged PR** | [#25](https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/25) |
| **main before** | `e8cb812` |
| **main after** | `f97a835` |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) |

## Purpose

Close the GAP-015 residual where Vercel Ignored Build Step was configured but the guard script was absent on `main`. Merge the minimal guard package and prove unauthorized Production-target builds are skipped.

## Owner authorization

Merge PR #25 only. Does **not** authorize Instant Promote, Production deploy, PR #10, migrations, hosted writes, env changes, or GitHub branch protection.

## Evidence

### Merge

- PR #25 squash-merged to `main` → `f97a835`
- Diff: only guard script, test, package.json script, GAP-015 docs, CROW-GAP015-4 milestone
- `MAIN_ADVANCED_BY_PR25_ONLY_COUNT=1`

### Vercel unauthorized Production skip

Deployment for `main` @ `f97a835` (Production target):

- Command: `node scripts/safety/vercel-production-deploy-guard.mjs`
- `decision=BLOCK_UNAUTHORIZED_PRODUCTION_BUILD`
- `exit_code=0`
- Result: **Canceled by Ignored Build Step**
- GitHub status: `Canceled by Ignored Build Step` (success)

### Production domain

- Live alias still `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz`
- `PRODUCTION_DOMAIN_CHANGED_COUNT=0`
- `INSTANT_PROMOTE_COUNT=0`

### Guard on main

- `scripts/safety/vercel-production-deploy-guard.mjs` present at `f97a835`
- Ignored Build Step still: `node scripts/safety/vercel-production-deploy-guard.mjs`

## Out of scope (unchanged)

- PR #10 (OPEN · DRAFT · archive/reference)
- Instant Promote / Production env changes
- Migrations / hosted business writes
- GitHub `main` branch protection

## GAP-015 status after this milestone

| Layer | Status |
|-------|--------|
| Guard script on `main` | **Mitigated** |
| Vercel Ignored Build Step | **Configured + proven skip** |
| GitHub `main` protection | **Still open** (next residual) |
| Authorized Production deploy procedure | Documented; not exercised this milestone |

**GAP-015 overall:** partially mitigated — Production unauthorized builds from `main` now skip. Remaining: GitHub branch protection + formal authorized-deploy operator procedure / checklist.

## Owner decisions still required

1. GitHub `main` protection (require PR + required checks) — separate milestone
2. Authorized Production deploy window (set SHA-bound env vars) when intentionally promoting
3. Confirm Instant Promote remains unused unless explicitly authorized

## Final verdict

**READY — GAP-015 GUARD-ON-MAIN MERGED AND UNAUTHORIZED PRODUCTION BUILD SKIPPED**
