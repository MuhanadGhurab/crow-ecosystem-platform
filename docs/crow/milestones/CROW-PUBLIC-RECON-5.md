# CROW.PUBLIC.RECON.5 — Verify and Accept or Rollback Vercel Auto Production Deploy

| Field | Value |
|-------|-------|
| **Status** | Complete — auto Production deploy accepted as main-aligned; live URL remains prior pin |
| **Date** | 2026-07-18 |
| **Docs branch** | `feat/first-tenant-golden-path` |
| **main HEAD** | `e8cb812` |
| **PR #14** | MERGED |
| **PR #10** | OPEN · DRAFT · unmerged · untouched |

## Owner decision (this milestone)

**OWNER ACCEPTS AUTO PRODUCTION DEPLOYMENT `dpl_8xT92RFHmsNRR5tihFwkd5aLNFQS`**

Acceptance is **retrospective and limited** to the public-only `main` reconciliation deployment from PR #14 (`e8cb812`).

**Rollback:** Not performed — public Production URL already serves the prior accepted pin (same accepted public experience).

## Deployment verification

| Deployment | Role | State | Evidence |
|------------|------|-------|----------|
| `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` | Prior accepted Production pin (`33e48f5`) | READY · available | Still serves https://crow-ecosystem-platform.vercel.app — CSS assets tagged `?dpl=dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` |
| `dpl_8xT92RFHmsNRR5tihFwkd5aLNFQS` | Vercel Git auto Production-target after #14 | READY · `target=production` · `main`/`e8cb812` | Build completed; public routes present in build output; isRollbackCandidate |

### Does Production currently serve the auto deploy?

**No.** Live domain still resolves to **`dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz`**.

Team/git-main aliases for the auto deploy are behind Vercel Deployment Protection (SSO); agent HTML smoke of those URLs was blocked without interactive Vercel login. Acceptance therefore rests on:

1. Auto deploy SHA = `e8cb812` (merged public recon)
2. Successful Vercel build with public routes (`/`, `/how-crow-works`, journey/platform pages, `/login`, `/signup`, etc.)
3. Owner Preview UAT acceptance of the same public experience (RECON.4 / PR #14 Preview)
4. Live Production smoke still shows accepted markers on the prior pin

## Live Production smoke (https://crow-ecosystem-platform.vercel.app)

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
| Legacy `HeroSection` homepage | No |

## Safety

| Item | Result |
|------|--------|
| `main` @ `e8cb812` public homepage | `PublicHomepage` |
| `vercel.json` on `main` | No `db:migrate:deploy` |
| Migrations applied this milestone | **None** |
| Hosted business writes | **None** |
| PR #10 | Untouched |
| Vercel project settings changed | **No** |

## Future Production deploy policy assessment

**Observation:** Vercel Git integration auto-creates `target=production` deployments on pushes/merges to `main` (also observed for ENGINEERING.1 `#11`). Public domain `crow-ecosystem-platform.vercel.app` did **not** automatically re-pin away from `dpl_QeDhnxz…` in this case, but a production-target artifact is still created.

**Recommendation: Option C (interim) + evaluate Option B**

- **Option C:** Treat merges to `main` as Production authorization events requiring explicit owner approval *before* merge when Production auto-deploy is enabled.
- **Option B (preferred when settings allow):** Disable or gate automatic Production deploys from `main` so Production promote remains a separate explicit step.
- Do **not** change Vercel settings in this milestone (no owner authorization to modify project settings).

## GAP status

| Gap | Status |
|-----|--------|
| GAP-004 | **Open / blocked** — unchanged |
| GAP-012 | **Mitigated** — `main` has accepted public experience; auto Production deploy from #14 accepted as main-aligned artifact; live public domain still on prior pin `dpl_QeDhnxz…` (accepted UX). Residual: Production auto-deploy policy / domain pin process (see Option B/C). |

## Recommended next

1. Owner decide whether to Instant Promote / re-assign `crow-ecosystem-platform.vercel.app` to `dpl_8xT92…` (separate authorization) or leave domain on `dpl_QeDhnxz…`
2. Owner authorize Vercel settings change for Option B if desired
3. Parallel: CROW.PM.2 or CROW.REQUEST.1; keep PR #10 draft

## Final verdict

**READY — AUTO PRODUCTION DEPLOYMENT VERIFIED AND ACCEPTED AS MAIN-ALIGNED PUBLIC EXPERIENCE**
