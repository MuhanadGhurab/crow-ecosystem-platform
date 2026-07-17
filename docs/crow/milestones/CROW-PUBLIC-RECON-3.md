# CROW.PUBLIC.RECON.3 — Open Draft Public-Only Reconciliation PR and Preview Smoke

| Field | Value |
|-------|-------|
| **Status** | Complete — draft PR open; Preview smoke passed; merge/Production **not** authorized |
| **Date** | 2026-07-17 |
| **Docs branch** | `feat/first-tenant-golden-path` |
| **Recon branch** | `reconcile/public-experience-from-ftgp` @ `67d6ff1` |
| **PR** | [#14](https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/14) — OPEN, **DRAFT**, MERGEABLE |
| **Base** | `main` @ `18237d1` (advanced from `a5620c3` via docs-only #11) |
| **PR #10** | Untouched — OPEN DRAFT |

## Constraints honored

- Draft PR only — **not merged**
- No Production deploy
- No direct `main` push
- No migrations / hosted business writes
- No auth/runtime/domain behavior changes beyond public recon scope
- PR #10 untouched

## Pre-PR notes

- Expected `main` at start of RECON.2 was `a5620c3`. Before opening PR #14, `origin/main` had advanced to `18237d1` (`docs(sdlc): ENGINEERING.1` via #11) — docs-only.
- Recon branch merged `origin/main` (commit `ea9182a`) then fixed CI mock mismatch (`67d6ff1`).
- CI `verify` initially failed because RECON.2 had temporarily included FTGP-era mock schema fields incompatible with `main` Prisma client. Fixed by restoring `main` mock files.

## Draft PR

| Item | Value |
|------|-------|
| URL | https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/14 |
| Title | feat(public): reconcile accepted Production public experience onto main |
| State | OPEN · DRAFT · MERGEABLE |
| Head | `reconcile/public-experience-from-ftgp` @ `67d6ff1` |
| Base | `main` |

## Checks (latest head)

| Check | Result |
|-------|--------|
| verify | **pass** |
| production-gate | **pass** |
| postgres-smoke | **pass** |
| Vercel | **pass** |
| Vercel Preview Comments | **pass** |

## Preview

| Item | Value |
|------|-------|
| Preview URL | https://crow-ecosystem-platform-git-reco-370f0e-muhanadghurabs-projects.vercel.app |
| Protection | Vercel Deployment Protection (SSO) — smoke used temporary `_vercel_share` access |
| Accepted Production source | `33e48f5` / visual `c51a60e` |
| Production deployment (live) | Still serves accepted public markers at https://crow-ecosystem-platform.vercel.app (`dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` alias evidence) |

## Preview smoke results

### Public routes — HTTP 200

`/` · `/how-crow-works` · `/new-organization` · `/transform-existing` · `/enterprise-blueprint` · `/platform` · `/platform/cem` · `/platform/cybercrow` · `/platform/sarea` · `/platform/procrow` · `/security` · `/industries` · `/pricing` · `/start` · `/request` · `/login` · `/signup`

### Gated routes — HTTP 307 → login

| Route | Result |
|-------|--------|
| `/client/requests` | 307 → `/login?next=%2Fclient%2Frequests` |
| `/admin/overview` | 307 → `/login?next=%2Fadmin%2Foverview` |
| `/discovery/test` | 307 → `/login?next=%2Fdiscovery%2Ftest` |

### Homepage markers

| Marker | Present |
|--------|---------|
| `pv2-signature-hero` | Yes |
| `pv2-btn-journey` (amber) | Yes |
| `pv2-btn-transform` (purple) | Yes |
| `data-pv2-locked-design` | Yes |
| "Build a New Organization" | Yes |
| Legacy `HeroSection` / Architect's Map homepage | No |

### Safety

| Item | Result |
|------|--------|
| `vercel.json` has `db:migrate:deploy` | **No** |
| Migrations applied | **None** |
| Hosted writes | **None** |
| Unsafe domain files in PR | **Excluded** (confirmed pre-PR scan) |

## Authorization holds (still active)

- Merge of PR #14 is **NOT** authorized
- Production deploy is **NOT** authorized
- Keep PR #14 as **DRAFT** until owner review
- Do not merge PR #10

## GAP status

| Gap | Status |
|-----|--------|
| GAP-004 | Open / blocked |
| GAP-012 | Open — draft PR + Preview smoke green; not closed until merge + Production from `main` verified |

## Owner decision required

1. Review Preview visually (SSO-protected)
2. Authorize merge of draft PR #14 (or request changes)
3. Separate authorization for Production promotion after merge
4. Confirm Production remains pinned until then

## Recommended next milestone

Owner Preview UAT → merge authorization for PR #14 → Preview-from-`main` verification → separate Production promotion decision. Parallel: CROW.PM.2 or CROW.REQUEST.1.

## Final verdict

**READY — DRAFT PUBLIC-ONLY RECONCILIATION PR OPENED AND PREVIEW SMOKE PASSED**
