# GAP-015 — Production Deploy Guard

| Field | Value |
|-------|-------|
| **Status** | Guard on `main` + unauthorized Production skip **proven** (CROW.GAP015.5) |
| **Date** | 2026-07-18 |
| **Milestone** | [`../milestones/CROW-GAP015-5.md`](../milestones/CROW-GAP015-5.md) |
| **Script** | `scripts/safety/vercel-production-deploy-guard.mjs` |
| **Tests** | `npm run vercel-production-deploy-guard:test` |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) |
| **main HEAD** | `f97a835` (PR [#25](https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/25)) |

## Purpose

Provide a no-cost, repository-owned Production deployment guard for Option E (layer D): **block Production builds by default** unless the owner sets an explicit SHA-bound authorization. Preview and local builds continue.

This file lands on `main` so Vercel’s configured Ignored Build Step can resolve the script on Production-target commits.

## Vercel Ignored Build Step semantics

| Script exit | Vercel meaning |
|-------------|----------------|
| `0` | **Ignore / skip** the build |
| `1` | **Do not ignore** — allow the build |

Configured project command (already set in Vercel):

```text
node scripts/safety/vercel-production-deploy-guard.mjs
```

Guard decisions:

| Decision | When | Exit |
|----------|------|------|
| `ALLOW_NON_PRODUCTION_BUILD` | `VERCEL_ENV` ≠ `production` (or unset) | `1` |
| `ALLOW_AUTHORIZED_PRODUCTION_BUILD` | Production + all auth conditions | `1` |
| `BLOCK_UNAUTHORIZED_PRODUCTION_BUILD` | Production without full auth | `0` |

## Authorization conditions (all required for Production)

| Variable | Requirement |
|----------|-------------|
| `CROW_PRODUCTION_DEPLOY_AUTHORIZED` | Truthy (`true` / `1` / `yes`) |
| `CROW_PRODUCTION_DEPLOY_SHA` | Exact match to `VERCEL_GIT_COMMIT_SHA` |
| `CROW_PRODUCTION_DEPLOY_REASON` | Non-empty owner reason string |

Set these only for an authorized Production deploy window, then **clear/reset** them.

## Safety properties

- No secrets printed (SHA prefix only)
- No raw env dump
- No database access
- No migrations / hosted writes
- No Vercel deploy trigger
- No GitHub mutation

## Configuration status

| Control | Status |
|---------|--------|
| Guard script + tests on `main` | **Present** @ `f97a835` |
| Vercel Ignored Build Step | **Configured** (CROW.GAP015.3) |
| Unauthorized Production skip | **Proven** — `BLOCK_UNAUTHORIZED_PRODUCTION_BUILD` / exit `0` / Canceled by Ignored Build Step |
| Live Production domain | Still `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (no Instant Promote) |
| GitHub `main` protection | **Not applied** (remaining GAP-015 residual) |

## Remaining residuals (GAP-015 not fully closed)

1. GitHub `main` branch protection (require PR + checks)
2. Formal authorized Production deploy operator procedure (env window + clear after)
3. Dashboard `buildCommand` still includes `db:migrate:deploy` (separate concern from Ignored Build Step)
