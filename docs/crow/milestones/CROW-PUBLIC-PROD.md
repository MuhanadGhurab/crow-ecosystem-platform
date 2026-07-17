# CROW.PUBLIC.PROD — Production Public Experience Deployment

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.PROD |
| **Status** | **DEPLOYED** |
| **Date** | 2026-07-07 |
| **Branch** | `feat/first-tenant-golden-path` |
| **PR #10** | OPEN, DRAFT, unmerged (unchanged) |
| **Post-deploy** | Owner live review — [`CROW-PUBLIC-POSTPROD-1.md`](CROW-PUBLIC-POSTPROD-1.md) |

## Owner authorization

> **AUTHORIZE CROW.PUBLIC.PROD — deploy accepted public experience to Production**

Recorded verbatim in owner request (2026-07-07).

## Accepted candidate

| Item | Value |
|------|-------|
| Milestone | CROW.PUBLIC.9 |
| Visual deploy commit | `c51a60e` |
| Acceptance record | CROW.PUBLIC.10 (`e349449`) |
| Preflight HEAD | `33e48f5` |
| Certification URL | https://crow-ftgp-certification-iipjrwhxd-muhanadghurabs-projects.vercel.app/ |

**Pre-deploy note:** Uncommitted post-acceptance hero redesign edits were **discarded** (`git restore`) — not part of accepted candidate.

## Pre-deploy verification

| Check | Result |
|-------|--------|
| Repository | `D:/CYBERCROW` |
| Branch | `feat/first-tenant-golden-path` |
| HEAD | `33e48f5afb2790e8d77b81588254f0e870c96d99` |
| Working tree | Clean (after discarding unauthorized redesign; `.gitignore` restored after Vercel CLI link) |
| `c51a60e` ancestor of HEAD | Yes |
| PR #10 | OPEN, DRAFT, MERGEABLE — not merged |
| `main` | `a5620c3` — unchanged |
| Stashes | Not applied (3 remain) |
| Migrations authorized | **No** |
| Hosted business writes | **None** |

### Pre-deploy gates

| Gate | Result |
|------|--------|
| `git diff --check` | PASS |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS |
| `npm run public-access-policy:test` | PASS |
| `npm run public-route-architecture:test` | PASS |
| `npm run public-v2-preview-readiness:test` | PASS |

```
FAILED_REQUIRED_GATE_COUNT=0
SKIPPED_REQUIRED_GATE_COUNT=0
LINT_WARNING_COUNT=0
LOCAL_PRODUCTION_BUILD=PASS
UNAUTHORIZED_DOMAIN_BEHAVIOR_CHANGE_COUNT=0
UNAUTHORIZED_MIGRATION_COUNT=0
HOSTED_BUSINESS_WRITE_COUNT=0
```

## Deployment

| Item | Value |
|------|-------|
| Method | Vercel CLI production deploy from feature branch (no PR #10 merge, no `main` push) |
| Project | `crow-ecosystem-platform` |
| Source commit | `33e48f5afb2790e8d77b81588254f0e870c96d99` |
| Build command | `vercel-build-guard` + `db:generate` + `build` — **no** `db:migrate:deploy` |
| Deployment ID | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` |
| Deployment URL | https://crow-ecosystem-platform-mlrlaicp6-muhanadghurabs-projects.vercel.app |
| Production URL | https://crow-ecosystem-platform.vercel.app |
| Inspector | https://vercel.com/muhanadghurabs-projects/crow-ecosystem-platform/QeDhnxzp9eowKNxAg5XmJW8vuhsz |

**Alias promotion:** CLI deploy did not initially attach `crow-ecosystem-platform.vercel.app`. Post-deploy:

```bash
npx vercel alias set crow-ecosystem-platform-mlrlaicp6-muhanadghurabs-projects.vercel.app crow-ecosystem-platform.vercel.app
```

**Rollback target (pre-promotion):** `dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4` (`main` @ `a5620c3`, legacy public UI)

```bash
npx vercel alias set crow-ecosystem-platform-frtn6o2u4-muhanadghurabs-projects.vercel.app crow-ecosystem-platform.vercel.app
```

(Use deployment URL from `vercel inspect dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4` if rollback required.)

## Post-deploy smoke

Script: `npx tsx scripts/smoke-crow-public-prod.ts`

### Public routes (17/17)

All returned **HTTP 200** on Production after alias promotion.

### Legacy redirects

| Legacy path | Expected | Observed |
|-------------|----------|----------|
| `/architecture` | → `/how-crow-works` | HTTP **200** at legacy path (no 307) |
| `/modules` | → `/platform/cem` | HTTP **200** at legacy path |
| `/services` | → `/how-crow-works` | HTTP **200** at legacy path |
| `/clients` | → `/industries` | HTTP **200** at legacy path |
| `/loyalty-programs` | → `/how-crow-works` | HTTP **200** at legacy path |
| `/experience/architects-map` | → `/how-crow-works` | HTTP **200** at legacy path |
| `/experience/architects-map/article` | → `/how-crow-works` | HTTP **200** at legacy path |

**Note:** Accepted codebase uses `redirect()` in App Router pages statically prerendered as `○`. HTTP 307 redirects were not observed on Production; this matches pre-deploy static behavior on the accepted branch — **not introduced by PROD deploy**. Nav/footer use canonical routes.

### Public access model

| Check | Result |
|-------|--------|
| `/client/requests` unauthenticated | **307** → `/login?next=%2Fclient%2Frequests` |
| `/request` public browse | **200** with sign-in gating copy |
| Public browse routes | **200** without session |

### Visual smoke (homepage `/`)

| Marker | Present |
|--------|---------|
| `pv2-signature-hero` | Yes |
| `pv2-btn-journey` (amber Build New) | Yes |
| `pv2-btn-transform` (purple Transform) | Yes |
| `data-pv2-locked-design` | Yes |
| Legacy Architect's Map hero | **No** |
| `/login` semi-dark auth frame | Yes |

## Deltas (authorized scope only)

| Delta | Value |
|-------|-------|
| Hosted business data | **No change** — no writes performed |
| Migrations | **No change** — build did not invoke `db:migrate:deploy` |
| Domain behavior | **No intentional change** — UI/route promotion only |
| Environment variables | **Not modified** on Vercel (local `.env.local` touched by CLI link only) |

## GAP-004

**Unchanged — still BLOCKED.** Preview/Production shared Postgres fingerprint. This UI promotion did not resolve isolation and did not run migrations or hosted writes.

## Known limitations (carried forward)

- Legacy URL HTTP redirects return 200 at source path (see smoke table)
- `/register` not visually aligned with locked public identity
- Auth form controls retain some legacy `cc-` styling inside semi-dark frame
- PR #10 remains unmerged — Production runs feature-branch build, not `main`
- Very narrow mobile widths (<360px) — owner spot-check recommended

## PR #10 and main

| Item | State |
|------|-------|
| PR #10 | OPEN, DRAFT — https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/10 |
| `main` | `a5620c3` — not updated |

## Related documents

- [`CROW-PUBLIC-PROD-PLAN.md`](CROW-PUBLIC-PROD-PLAN.md)
- [`CROW-PUBLIC-PROD-PREFLIGHT.md`](CROW-PUBLIC-PROD-PREFLIGHT.md)
- [`CROW-PUBLIC-10.md`](CROW-PUBLIC-10.md)
- [`CROW-PUBLIC-9.md`](CROW-PUBLIC-9.md)
