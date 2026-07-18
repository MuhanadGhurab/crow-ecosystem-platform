# GAP-015 — GitHub `main` Protection Checklist

| Field | Value |
|-------|-------|
| **Status** | **Applied** — CROW.GAP015.6 |
| **Date** | 2026-07-18 |
| **Mechanism** | Classic branch protection on `main` |
| **Evidence** | [`../milestones/CROW-GAP015-6.md`](../milestones/CROW-GAP015-6.md) |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) |

`GITHUB_BRANCH_PROTECTION_CHANGED_COUNT=1` (CROW.GAP015.6).

## Applied settings (verified)

| Setting | Value |
|---------|-------|
| Protect branch | `main` |
| Require a pull request before merging | **On** (`required_approving_review_count=0`) |
| Require conversation resolution | **On** |
| Require status checks to pass | **On** |
| Require branches to be up to date | **On** (`strict=true`) |
| Enforce for administrators | **Off** (owner emergency bypass) |
| Block force pushes | **On** |
| Block deletions | **On** |
| Require linear history | **Off** |
| Require signed commits | **Off** |

## Required status checks (stable)

| Check name | Source | Required? |
|------------|--------|-----------|
| `verify` | GitHub Actions CI | **Yes** |
| `production-gate` | GitHub Actions CI | **Yes** |
| `postgres-smoke` | GitHub Actions CI | **Yes** |
| `Vercel` | Vercel GitHub integration | **No** — noisy/failing on PR #25; excluded |

## Not required

- Vercel Preview deployment statuses
- One-off Preview URL checks
- Signed commits / linear history / deployment environments

## PR #10 policy (unchanged)

- PR #10 remains **OPEN · DRAFT · CONFLICTING · archive/reference only**
- Do **not** mark ready for review
- Do **not** merge as monolith
- Branch protection is **not** a vehicle to force PR #10 forward

## Interaction with deploy guard

| Layer | Effect |
|-------|--------|
| GitHub protection | Reduces unsafe `main` movement |
| Vercel Ignored Build Step + guard script | Skips unauthorized Production builds even if `main` moves |
| Together (Option E) | Defense in depth |

GitHub protection alone does **not** stop Vercel Production-target creation; the deploy guard does.

## Ruleset note

Repository ruleset create API returned HTTP 422 for the `pull_request` rule payload attempted first. Classic branch protection was applied successfully and verified via GET.
