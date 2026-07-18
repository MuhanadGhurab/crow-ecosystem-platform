# GAP-015 — Production Auto-Deploy Audit

| Field | Value |
|-------|-------|
| **Status** | Audit complete — settings **not** changed |
| **Date** | 2026-07-18 |
| **Milestone** | [`../milestones/CROW-GAP015-1.md`](../milestones/CROW-GAP015-1.md) |
| **Plan** | [`GAP-015-PRODUCTION-AUTODEPLOY-PLAN.md`](GAP-015-PRODUCTION-AUTODEPLOY-PLAN.md) |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) |
| **Policy** | [`../16-PRODUCTION-DEPLOYMENT-POLICY.md`](../16-PRODUCTION-DEPLOYMENT-POLICY.md) |

## Purpose

Verify how Crow’s Vercel project creates Production-target and Preview deployments, and whether GitHub protections reduce unsafe `main` movement — **without** changing Vercel settings, deploying Production, or pushing `main`.

## Baseline (unchanged this audit)

| Item | Value |
|------|-------|
| Repo | `MuhanadGhurab/crow-ecosystem-platform` |
| Audit branch | `feat/first-tenant-golden-path` @ `4eafb26` (start) |
| `main` | `e8cb812` |
| Live Production URL | https://crow-ecosystem-platform.vercel.app |
| Live Production deployment | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` |
| Accepted main-aligned Production artifact (not Instant-Promoted) | `dpl_8xT92RFHmsNRR5tihFwkd5aLNFQS` |
| Vercel project | `crow-ecosystem-platform` · `prj_lsHQMiMZskg8CzRVd4EHfiAo8o7h` |
| Vercel team | `muhanadghurabs-projects` · `team_JsNIQlTitYCs1yjig631FnF5` |
| PR #10 | OPEN · DRAFT · CONFLICTING · archive only |

## Audit questions and findings

### 1. Current Vercel project deployment behavior

| Finding | Evidence |
|---------|----------|
| Git integration is active | Recent deployments carry `githubDeployment=1`, `githubCommitRef`, `githubCommitSha` |
| Feature-branch pushes → **Preview** | `target: null` · Environment **Preview** · e.g. commits on `feat/first-tenant-golden-path` / PR #10 |
| Production public domain still on older pin | `vercel inspect crow-ecosystem-platform.vercel.app` → `dpl_QeDhnxz…` · `target=production` · READY |
| Domain aliases include git-main | `crow-ecosystem-platform-git-main-muhanadghurabs-projects.vercel.app` listed on project domains |
| `vercel.json` | `buildCommand`: guard + `db:generate` + `build` — **no** migrate; **no** `ignoreCommand` |

### 2. Do pushes/merges to `main` trigger Production deployment automatically?

| Finding | Evidence |
|---------|----------|
| **Yes — Production-target artifacts are created from `main` Git events** | Observed historically for PR #11 and PR #14 (`target=production`, `source=git`) — documented in CROW.PROD-POLICY.1 / `16-PRODUCTION-DEPLOYMENT-POLICY.md` |
| Creating Production-target ≠ always re-pinning public domain | After PR #14, live URL stayed on `dpl_QeDhnxz…` while `dpl_8xT92…` became READY with team/git-main aliases |
| No new `main` Production deploy during this audit | `main` remained `e8cb812`; no Production-target deploy created by this milestone |

### 3. Are Preview deployments created for feature branches?

| Finding | Evidence |
|---------|----------|
| **Yes** | 2026-07-18 FTGP branch pushes created Preview deployments (`target: null`); several READY, recent docs pushes ERROR (Preview build failures — out of GAP-015 scope) |

### 4. Manual promotion vs automatic Production

| Finding | Evidence |
|---------|----------|
| Auto path | Git push/merge to production branch (`main`) → Vercel creates Production-**target** deployment |
| Live domain path | Public domain reassignment / Instant Promote is a **separate** operator action |
| Current live | Still `dpl_QeDhnxz…` — Instant Promote of `dpl_8xT92…` **not** authorized |

### 5. Ignored build step / deployment protection

| Control | Status |
|---------|--------|
| `ignoreCommand` / Ignored Build Step in `vercel.json` | **Not configured** |
| Vercel Deployment Protection (password / SSO / Vercel Authentication) | **Not audited as enabled** for Production public URL (site remains publicly reachable) |
| Repo build guard | `scripts/vercel-build-guard.mjs` runs in buildCommand — does **not** skip Production auto-create |

### 6. Can Vercel Git settings disable or gate Production auto-deploy?

| Finding | Assessment |
|---------|------------|
| Capability | **Yes** — Vercel project Git settings can disable automatic Production deploys from the production branch and/or use Ignored Build Step / production-branch controls (owner UI) |
| Applied? | **No** — this milestone did not change settings (`PRODUCTION_AUTODEPLOY_SETTINGS_CHANGED_COUNT=0`) |
| Cost | Prefer free-tier controls only; confirm in owner UI before relying on paid Deployment Protection |

### 7. Branch protection / GitHub rules

| Check | Result |
|-------|--------|
| `GET .../branches/main/protection` | **404 Branch not protected** |
| Repository rulesets | **Empty `[]`** |
| Default branch | `main` |
| Implication | Anyone with write access can push/merge to `main` without required reviews or status checks at the GitHub rules layer |

### 8. GitHub Actions / checks vs unauthorized Production-target deploys

| Check | Result |
|-------|--------|
| CI (`.github/workflows/ci.yml`) | Runs on `push`/`pull_request` to `main` — `verify`, `production-gate`, `postgres-smoke` |
| Required status checks on `main` | **Not enforced** (no branch protection) |
| Detect Production-target deploy | **No** workflow currently fails closed on unauthorized Vercel Production-target creation |
| Conclusion | CI is necessary hygiene; **insufficient alone** while auto Production-target creation remains on and branch protection is off |

### 9. Docs vs actual behavior

| Document | Match? |
|----------|--------|
| `16-PRODUCTION-DEPLOYMENT-POLICY.md` Option C interim | **Matches** observed behavior |
| CROW.PROD-POLICY.1 | **Matches** — settings not applied; Instant Promote held |
| GAP-015 ledger “open” | **Matches** — gate not yet applied |
| Drift risk | Policy correctly warns that Production-target ≠ live domain; operators may still confuse READY Production-target with live |

### 10. Current risk summary

| Risk | Level | Notes |
|------|-------|-------|
| Accidental `main` merge → Production-target artifact | **Medium** | Still automatic; human process (Option C) is only active gate |
| Accidental Instant Promote / domain move | **Lower while process holds** | Separate owner action; currently held |
| Unprotected `main` | **Medium** | No GitHub branch protection / rulesets |
| Feature-branch Preview auto-deploy | **Expected** | Preview only; GAP-004A fail-closed for unsafe DB |
| Docs-only `main` merge still Production-target | **Medium** | Observed previously; still needs owner awareness |

## Safety policy until GAP-015 mitigated (reconfirmed)

- No `main` merge unless owner accepts possible Production-target deployment
- No Production promotion unless owner explicitly authorizes
- No DB-affecting feature merge to `main`
- No hosted persistence / Blueprint generation enablement via release automation
- PR #10 remains archive/reference only

## What this audit did **not** do

- Change Vercel Git / Production / env settings
- Deploy or Instant Promote Production
- Push `main` or merge PR #10
- Run migrations or hosted business writes
- Implement Option B/C/D/E controls

## Related

- Plan: [`GAP-015-PRODUCTION-AUTODEPLOY-PLAN.md`](GAP-015-PRODUCTION-AUTODEPLOY-PLAN.md)
- Prior policy milestone: [`../milestones/CROW-PROD-POLICY-1.md`](../milestones/CROW-PROD-POLICY-1.md)
- GAP-004 / GAP-004A: isolation open/blocked; Preview DB-disabled accepted
