# GAP-015 — Production Deploy Guard

| Field | Value |
|-------|-------|
| **Status** | Repository package prepared — Vercel Ignored Build Step **not** configured |
| **Date** | 2026-07-18 |
| **Milestone** | [`../milestones/CROW-GAP015-2.md`](../milestones/CROW-GAP015-2.md) |
| **Script** | `scripts/safety/vercel-production-deploy-guard.mjs` |
| **Tests** | `npm run vercel-production-deploy-guard:test` |
| **Setup** | [`GAP-015-VERCEL-GUARD-SETUP-CHECKLIST.md`](GAP-015-VERCEL-GUARD-SETUP-CHECKLIST.md) |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) |

## Purpose

Provide a no-cost, repository-owned Production deployment guard for Option E (layer D): **block Production builds by default** unless the owner sets an explicit SHA-bound authorization. Preview and local builds continue.

## Vercel Ignored Build Step semantics

| Script exit | Vercel meaning |
|-------------|----------------|
| `0` | **Ignore / skip** the build |
| `1` | **Do not ignore** — allow the build |

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
| Guard script + tests in repo | **Done** (this milestone) |
| Vercel Ignored Build Step wired | **Not applied** — see setup checklist |
| GitHub `main` protection | **Not applied** — see GitHub checklist |
| Live Production | Unchanged |

Until the Ignored Build Step is configured in Vercel, `main` merges remain Production-risk under Option A/C process control.
