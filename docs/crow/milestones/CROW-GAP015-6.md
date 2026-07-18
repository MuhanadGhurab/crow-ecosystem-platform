# CROW.GAP015.6 — GitHub main protection configuration and verification

| Field | Value |
|-------|-------|
| **Status** | Complete — classic branch protection applied and verified |
| **Date** | 2026-07-18 |
| **Target** | `main` @ `f97a835` |
| **Mechanism** | Classic GitHub branch protection (ruleset POST rejected; classic PUT succeeded) |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) |

## Purpose

Apply Option C GitHub `main` protection so future `main` changes require a pull request and stable required CI checks, without owner lockout.

## Owner authorization

Configure GitHub main protection / rulesets and verification only. Does **not** authorize Production deploy, Instant Promote, PR #10, migrations, hosted writes, Vercel settings/env changes.

## Pre-apply state

| Item | Value |
|------|-------|
| Branch protection | Absent (HTTP 404) |
| Rulesets | `[]` |
| Stable checks (PR #25) | `verify`, `production-gate`, `postgres-smoke` |
| Noisy checks excluded | `Vercel` (status FAILURE on PR #25) |

## Exact changes applied

Classic protection via `PUT /repos/.../branches/main/protection`:

| Setting | Value |
|---------|-------|
| Require pull request reviews | **On** (`required_approving_review_count=0` — PR required; no forced second reviewer for solo owner) |
| Require conversation resolution | **On** |
| Required status checks | `verify`, `production-gate`, `postgres-smoke` |
| Require branches up to date | **On** (`strict=true`) |
| Enforce for admins | **Off** (`enforce_admins=false` — emergency owner bypass) |
| Allow force pushes | **Off** |
| Allow deletions | **Off** |
| Require linear history | **Off** |
| Require signed commits | **Off** |
| Restrictions / deployments | **Not set** |
| Vercel Preview / `Vercel` status | **Not required** |

## Verification

- Re-read protection API: settings match above
- `main` still `f97a835` (`MAIN_PUSH_COUNT=0`)
- Production still `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz`
- Ignored Build Step unchanged
- PR #10 untouched (OPEN · DRAFT · CONFLICTING)

## Lockout risk assessment

| Risk | Mitigation |
|------|------------|
| Solo owner blocked by approval count | Approvals required = **0** |
| Admin cannot recover | `enforce_admins=false` |
| Flaky Vercel blocks merges | Vercel **not** required |
| Checks renamed / missing | Used exact names from PR #25 CI (`verify`, `production-gate`, `postgres-smoke`) |

## GAP-015 status after this milestone

| Layer | Status |
|-------|--------|
| Guard script on `main` | Done (GAP015.5) |
| Vercel Ignored Build Step + skip proven | Done (GAP015.3–5) |
| GitHub `main` protection | **Done** (this milestone) |
| Formal authorized Production deploy procedure | **Remaining** |

GAP-015 remains **open (partially mitigated)** until authorized Production deploy procedure is documented and accepted.

## Owner decisions still required

1. Document/accept formal authorized Production deploy operator procedure (env window + clear after)
2. Optional merge of docs PR #26 for evidence files on `main`
3. Intentional Production deploy only when separately authorized

## Final verdict

**READY — GAP-015 GITHUB MAIN PROTECTION CONFIGURED AND VERIFIED**
