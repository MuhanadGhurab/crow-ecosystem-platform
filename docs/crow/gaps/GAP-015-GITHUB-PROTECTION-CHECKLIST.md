# GAP-015 — GitHub `main` Protection Checklist

| Field | Value |
|-------|-------|
| **Status** | Instructions only — **not applied** in CROW.GAP015.2 |
| **Date** | 2026-07-18 |
| **Current state** | `main` branch protection **absent** (HTTP 404); rulesets empty |
| **Owner auth required** | `AUTHORIZE: GitHub main branch protection (GAP-015 Option C/E)` |

## Do not apply during CROW.GAP015.2

Owner authorized the **guard package and exact instructions only**.  
Branch protection mutation requires a separate explicit confirmation.

`GITHUB_BRANCH_PROTECTION_CHANGED_COUNT=0` for this milestone.

## Recommended settings (no-cost / classic protection or ruleset)

| Setting | Recommended value |
|---------|-------------------|
| Protect branch | `main` |
| Require a pull request before merging | **On** |
| Required approving reviews | ≥ 1 if a second reviewer exists; otherwise owner may use admin override carefully |
| Require status checks to pass before merging | **On** |
| Require branches to be up to date before merging | **On** if it does not lock out the owner |
| Require conversation resolution | Optional |
| Do not allow bypassing (except repository admin emergency) | Prefer on; ensure owner retains admin access |
| Block force pushes | **On** |
| Block deletions | **On** |
| Restrict who can push | Maintainers / owner only |

## Recommended required status checks

Observed on `main` @ `e8cb812` (read-only):

| Check name | Source | Include? |
|------------|--------|----------|
| `verify` | GitHub Actions CI | **Yes** — stable required |
| `production-gate` | GitHub Actions CI | **Yes** — stable required |
| `postgres-smoke` | GitHub Actions CI | **Yes** — stable required |
| `Vercel` | Vercel GitHub integration status | **Optional** — may be useful; do not require if flaky or timing-sensitive |

Do **not** require:

- One-off Preview deployment URLs as required checks
- Unpublished / renamed workflow jobs
- Checks that are not present on every PR to `main`

## PR #10 policy

- PR #10 remains **OPEN · DRAFT · CONFLICTING · archive/reference only**
- Do **not** mark ready for review
- Do **not** merge as monolith
- Branch protection must not be used as a vehicle to force PR #10 forward

## Apply procedure (future owner-authorized milestone)

1. Owner posts authorization phrase
2. Apply via GitHub UI (**Settings → Branches → Add rule**) or rulesets
3. Verify a dry-run: open a trivial docs PR cannot merge without checks
4. Confirm owner can still administer the repo
5. Record `GITHUB_BRANCH_PROTECTION_CHANGED_COUNT=1` + evidence in Issue #15
6. Keep Instant Promote / Vercel Production deploy as separate decisions

## Interaction with deploy guard

| Layer | Effect |
|-------|--------|
| GitHub protection | Reduces unsafe `main` movement |
| Vercel Ignored Build Step + guard script | Skips unauthorized Production builds even if `main` moves |
| Together (Option E) | Defense in depth |

GitHub protection alone does **not** stop Vercel Production-target creation.
