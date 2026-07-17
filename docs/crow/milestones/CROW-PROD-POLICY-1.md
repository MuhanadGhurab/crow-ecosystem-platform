# CROW.PROD-POLICY.1 — Main Production Deployment Policy and Auto-Deploy Gate Plan

| Field | Value |
|-------|-------|
| **Status** | Complete — policy documented; Vercel settings **not** changed |
| **Date** | 2026-07-18 |
| **Docs branch** | `feat/first-tenant-golden-path` |
| **Canonical policy** | [`docs/crow/16-PRODUCTION-DEPLOYMENT-POLICY.md`](../16-PRODUCTION-DEPLOYMENT-POLICY.md) |
| **main HEAD** | `e8cb812` |
| **PR #10** | OPEN · DRAFT · unmerged · untouched |
| **PR #14** | MERGED |

## Purpose

Define Production release authority and auto-deploy handling now that `main` contains the accepted public experience, without Instant-Promoting `dpl_8xT92…` or changing Vercel settings.

## Owner decisions for this milestone

| Decision | Value |
|----------|-------|
| Instant Promote `dpl_8xT92…` | **Not authorized** |
| Deploy Production | **Not authorized** |
| Merge PR #10 | **Not authorized** |
| Change Vercel settings | **Not authorized** (plan only) |
| Migrations / hosted writes | **None** |

## Pre-policy verification

| Check | Result |
|-------|--------|
| Live URL accepted public markers | Pass |
| Live domain deployment | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` |
| Auto deploy `dpl_8xT92…` | READY · accepted (RECON.5) · not serving public domain |
| `main` | `e8cb812` |
| PR #10 | OPEN DRAFT unmerged |
| `vercel.json` on `main` | No `db:migrate:deploy` |
| Migrations / hosted writes this milestone | None |

## Auto-deploy behavior assessment

| Question | Assessment |
|----------|------------|
| Does merge to `main` create Production-target deployment? | **Yes** (observed #11, #14) |
| Does it always assign the public domain? | **No** — public domain remained on `dpl_QeDhnxz…` after #14; team/git-main aliases moved to auto deploy |
| Can auto-deploys be disabled/gated? | **Yes, via Vercel project Git/Production settings** — requires owner authorization (not done here) |
| Can production branch change? | Possible in Vercel settings — owner-only |
| Ignored build step? | Possible mitigation — owner-only; not applied |
| Are GitHub checks enough alone? | **No** — necessary but not sufficient while auto Production-target creation is on |
| Safest while GAP-004 open | No migrate in build; no hosted writes; Option C process now; Option B settings when authorized |

## Policy summary

See [`16-PRODUCTION-DEPLOYMENT-POLICY.md`](../16-PRODUCTION-DEPLOYMENT-POLICY.md) for full rules.

**Interim (active):** Option C — every `main` merge is a potential Production event → owner authorization required before merge; Instant Promote remains separate.

**Preferred settings (pending owner):** Option B — disable/gate main→Production auto-deploys.

## Recommended Vercel setting decision (owner)

1. Disable or gate Production auto-deploys from `main` (Option B), **or**
2. Keep auto-deploy and continue Option C process discipline, **and**
3. Keep Instant Promote of `dpl_8xT92…` as a separate explicit decision (currently declined)

## GAP impact

| Gap | Status after this milestone |
|-----|----------------------------|
| GAP-004 | **Open / blocked** — release restrictions unchanged |
| GAP-012 | **Mitigated** — policy residual documented; settings gate remains owner decision |
| GAP-015 | **Open** — Production auto-deploy settings not yet applied (tracking) |

## Constraints honored

- No Instant Promote
- No Production deploy
- No PR #10 merge/modify
- No migrations / hosted writes
- No Vercel settings changes
- No product behavior changes

## Final verdict

**READY — PRODUCTION DEPLOYMENT POLICY CREATED FOR MAIN-ALIGNED CROW RELEASES**
