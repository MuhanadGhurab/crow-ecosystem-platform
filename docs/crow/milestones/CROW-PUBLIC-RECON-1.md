# CROW.PUBLIC.RECON.1 — Public-Only Main Reconciliation Plan & Cherry-Pick Safety Audit

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.RECON.1 |
| **Status** | Complete — audit and planning only |
| **Date** | 2026-07-07 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Audit HEAD** | `8367d9505060676c105e1190715921aab837060c` |
| **Visual accept ref** | `c51a60e` (CROW.PUBLIC.9) |
| **Production deploy ref** | `33e48f5` (app code matches `c51a60e` visual) |

## Constraints (honored)

- No PR #10 merge
- No Production deploy
- No `main` push
- No migrations
- No hosted business writes
- No public-only branch created (read-only `git diff` analysis only)

---

## 1. Current Production / `main` divergence

| Layer | Commit / ID | Public surface |
|-------|-------------|----------------|
| **Production (live)** | `33e48f5` → `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` | Accepted semi-dark public v2 (`pv2-signature-hero`, locked design) |
| **Visual accept** | `c51a60e` | Same app code as Production deploy |
| **Documentation HEAD** | `8367d95` | POSTPROD.1 reconciliation plan |
| **`main`** | `a5620c3` | Legacy homepage (`HeroSection`, Architect's Map stack) |
| **PR #10 branch** | `8367d95` (385 commits ahead of `main`) | FTGP + public + ops — **~1,277 files** |

### Scale

| Metric | Value |
|--------|-------|
| Commits `main..feat` | **385** |
| Files changed `main..c51a60e` | **1,272** |
| **Core public-only files** `main..c51a60e` | **78** (see §4) |
| Public milestone commits (grep PUBLIC) | **24** docs + code milestones since PUBLIC.1A |

### `vercel.json` divergence (critical)

| Branch | `buildCommand` |
|--------|----------------|
| **`main`** | `… && npm run db:generate && npm run db:migrate:deploy && npm run build` |
| **Feature / Production** | `… && npm run db:generate && npm run build` (no migrate deploy) |

Accidental Production deploy from `main` would **run migrations** against hosted Postgres **and** serve legacy public UI.

---

## 2. Why PR #10 must not be merged casually

PR #10 (`feat/first-tenant-golden-path` → `main`) is **OPEN, DRAFT, MERGEABLE** but bundles:

| Risk class | Examples in delta |
|------------|-------------------|
| **Database** | Prisma schema changes, migrations, seed scripts |
| **FTGP authority** | Request review, discovery shell, platform internal roles, certification host gate |
| **C3 auth/account** | Registration, verification, onboarding gates, `c3-authenticated-entry` |
| **Domain runtime** | Discovery persistence, blueprint compiler paths, ProCrow workflow, billing scaffold |
| **Ops** | Dozens of verify scripts, hosted smoke tests, env tooling |
| **Public (desired)** | ~78 files — **~6%** of file delta |

Merging PR #10 as-is would promote **384 non-public commits** alongside the accepted public experience. Owner explicitly deferred FTGP merge (POSTPROD.1, this milestone).

---

## 3. Public-only reconciliation objective

Bring the **accepted Production public experience** onto `main` in a **small, reviewable PR** that:

1. Replaces legacy public routes/layout with bright public v2 shell
2. Preserves public browse / gated client-process policy (`public-access-policy.ts`)
3. Does **not** import FTGP domain runtime, auth behavior changes, migrations, or payment/subscription logic
4. Makes `main` safe to deploy without `db:migrate:deploy` in the Production build path
5. Keeps Production pinned on feature-branch deploy until reconciliation PR is merged and verified

**Success criterion:** Owner can merge a public-only PR to `main` and redeploy Production from `main` without regressing public UI or triggering unauthorized domain/auth/database changes.

---

## 4. Exact candidate file list (cherry-pick from `c51a60e`)

### Category A — Safe public-only files (78 paths)

Copy as-is from `c51a60e` onto `main` (new or replace). No imports from FTGP runtime, Prisma, or privileged domain modules verified by bundle-containment tests.

**`src/app/(public)/`** (24)

- `about/page.tsx`, `architecture/page.tsx`, `case-studies/page.tsx`, `clients/page.tsx`
- `enterprise-blueprint/page.tsx`, `how-crow-works/page.tsx`, `industries/page.tsx`
- `layout.tsx`, `loading.tsx`, `loyalty-programs/page.tsx`, `modules/page.tsx`
- `new-organization/page.tsx`, `page.tsx`
- `platform/page.tsx`, `platform/cem/page.tsx`, `platform/cybercrow/page.tsx`, `platform/procrow/page.tsx`, `platform/sarea/page.tsx`
- `pricing/page.tsx`, `request/loading.tsx`, `security/page.tsx`, `services/page.tsx`, `transform-existing/page.tsx`

**`src/app/preview/public-home/`** (2)

- `layout.tsx`, `page.tsx`

**`src/app/start/`** (2)

- `layout.tsx`, `page.tsx`

**`src/components/public-site/`** (11)

- `public-auth-frame.tsx`, `public-canonical-pages-part1.tsx`, `public-canonical-pages-part2.tsx`
- `public-client-journey-steps.tsx`, `public-content-page.tsx`, `public-homepage.tsx`
- `public-site-chrome.tsx`, `public-site-footer.tsx`, `public-site-layout.tsx`
- `public-site-navigation.tsx`, `public-start-page.tsx`

**`src/components/public-v2/`** (22)

- All section, preview, diagram, and shell components through `representative-preview-label.tsx`

**`src/components/public/`** (1)

- `certification-environment-label.tsx`

**`src/components/brand/`** (1)

- `crow-mark-svg.tsx`

**`src/lib/public/`** (6)

- `journey-handoff.ts`, `navigation.ts`, `public-access-policy.ts`, `public-access-policy.test.ts`
- `public-route-architecture.test.ts`, `routes.ts`

**`src/lib/public-v2/`** (10)

- `certification-gate.ts`, `journey-definitions.ts`, `motion.ts`, `navigation.ts`
- `public-lifecycle.ts`, `public-v2-preview-readiness.test.ts`, `representative-data.ts`
- `routes.ts`, `tokens.ts`, `types.ts`

**`src/styles/`** (1)

- `public-v2-bright.css`

> **Note:** `src/app/(public)/request/page.tsx` is listed in the 78-path core set but **reclassified to Category D** below due to `getSessionUser()` redirect coupling (§6).

---

## 5. Exact excluded file list

### Category E — Must not cherry-pick (representative; not exhaustive)

| Area | Pattern / examples |
|------|-------------------|
| **Database** | `prisma/schema.prisma`, `prisma/migrations/**`, `src/lib/db/**` |
| **Hosted data scripts** | `scripts/*hosted*`, `scripts/seed-*`, FTGP smoke writers |
| **Request persistence** | `src/lib/client-service-request/**`, `/api/implementation-requests` handlers beyond static policy |
| **Discovery persistence** | `src/lib/discovery/**`, `/discovery/**` route implementations |
| **Blueprint compiler** | `src/lib/blueprint/**`, blueprint studio routes |
| **Tenant provisioning** | `src/lib/tenant/**`, tenant invite provisioning |
| **Platform internal roles** | `PlatformInternalRoleAssignment`, FTGP authority modules |
| **Auth behavior (C3)** | `src/lib/auth/c3-*`, `src/lib/account/**`, onboarding gates |
| **Payment runtime** | `src/lib/billing/**`, Stripe webhook logic changes |
| **CroAI / CEM / authority runtime** | CroAI, CEM operator, CyberCrow/SAREA authority services |
| **ProCrow workflow** | ProCrow operator routes and state machines |
| **Full PR #10** | All ~1,199 non-public files in `main..HEAD` delta |
| **Full `routes.ts`** | C3 account/discovery/admin route additions (~100 lines) — surgical patch only |

### Legacy public components (replace, do not merge alongside)

On `main`, superseded by public v2 — **do not cherry-pick**; allow deletion when canonical pages land:

- `src/components/public/hero-section.tsx`, `homepage-*.tsx`, `public-header*.tsx`, etc.

---

## 6. Dependency / coupling findings

### Category B — Public visual files with minor shared dependencies

| File | Dependency | Mitigation |
|------|------------|------------|
| `src/app/globals.css` | `.public-v2-shell` + C3 crow-hero animation blocks | Cherry-pick **public-v2-shell** block; optionally defer crow-hero blocks if not needed on `main` login |
| `src/app/layout.tsx` | `CrowAppShell`, `RouteProgressBar`, `CertificationEnvironmentLabel` | Include `crow-app-shell.tsx` + `crow-loading-mark.tsx` chain (presentation only) |
| `src/components/public-site/public-auth-frame.tsx` | Imports `public-v2-bright.css` | Safe with Category A |
| `src/components/brand/crow-mark-svg.tsx` | SVG paths only | Safe (A) |

### Category C — Shared utilities requiring careful review

| File | Issue | Recommendation |
|------|-------|----------------|
| `src/lib/auth/route-protection.ts` | Imports `public-access-policy`; also adds C3 API public paths (`/api/c3/*`), verify-email, legal registration helpers | **Surgical patch:** public prefix delegation only; **exclude** C3 API path additions unless owner authorizes auth slice |
| `src/lib/public/journey-handoff.ts` | Uses `routes.client.requestNew` | Add **one line** to `main` `routes.ts`: `requestNew: "/client/requests/new"` OR hardcode in handoff for public-only PR |
| `src/lib/routes.ts` | Full file adds C3 account, onboarding, discovery URLs | **Do not** cherry-pick whole file — minimal `public.start` + `client.requestNew` only |
| `src/lib/public-v2/certification-gate.ts` | Reads `FTGP_CERTIFICATION_MODE` env | Safe for certification preview; inactive on Production canonical host |
| `vercel.json` | Removes `db:migrate:deploy` | **Required** for safe `main` Production deploy (§7) |
| `package.json` | Public test scripts | Cherry-pick script entries only |

### Category D — Unsafe / coupled (defer or separate owner-authorized slice)

| File | Coupling |
|------|----------|
| `src/middleware.ts` | Adds `applyFtgpCertificationHostGate` — file **does not exist on `main`** |
| `src/lib/ftgp/ftgp-certification-host-gate.ts` | FTGP-named certification host pin (env-gated; inactive when `FTGP_CERTIFICATION_MODE≠true`) |
| `src/app/login/page.tsx`, `signup/page.tsx`, `register/**` | C3 auth entry (`c3-authenticated-entry`), removed Entra panel — **auth behavior change** |
| `src/lib/auth/c3-authenticated-entry.ts` | **Missing on `main`** — required by login/signup on feature branch |
| `src/app/(public)/request/page.tsx` | `getSessionUser()` + `routes.client.requestNew` redirect |
| `src/components/auth/auth-back-navigation.tsx` | Used by login — missing on `main` |

### Import audit summary (public UI → domain)

| Scan | Result |
|------|--------|
| `public-site/**` → prisma, ftgp, discovery services | **None** (marketing copy mentions Blueprint/ProCrow only) |
| `public-v2/**` → prisma, crow-story, privileged imports | **None** — `public-v2-bundle-containment:verify` PASS |
| `public-route-architecture.test.ts` | Asserts no story/privileged imports in public-site/v2 |

### Middleware / access policy

Production public browse model depends on:

1. `public-access-policy.ts` (new on feature branch)
2. `route-protection.ts` delegating `PUBLIC_PATH_PREFIXES` (partial change on feature branch)
3. Supabase `updateSession` middleware (unchanged behavior on feature branch except certification host gate)

**Certification host gate** is env-inactive on `crow-ecosystem-platform.vercel.app` but couples middleware to `src/lib/ftgp/` path. For public-only PR: **either** include gate file (presentation/ops only) **or** omit middleware change and accept certification alias behavior on `main` until FTGP merge.

---

## 7. `main` build / `db:migrate:deploy` risk assessment

| Question | Answer |
|----------|--------|
| Must public-only PR remove `db:migrate:deploy`? | **Yes** — if `main` becomes Production source |
| Is removal safe? | **Yes** for public-only deploy — feature branch Production build proved `db:generate && build` succeeds; no migration required for static public UI promotion |
| Belongs in public-only PR or separate? | **Recommend separate deploy-safety PR first** (`chore/vercel-remove-migrate-deploy`) — smallest blast radius; then public UI PR |
| What proves no migration on deploy? | (1) `vercel.json` `buildCommand` string audit (2) feature Production deploy log — no `migrate deploy` step (3) add CI assertion: `grep -q db:migrate:deploy vercel.json && exit 1` optional gate |

**Risk if ignored:** `main` Production deploy runs `prisma migrate deploy` against shared Supabase (GAP-004) — schema drift and data risk without FTGP review.

---

## 8. Recommended branch strategy

```
main (a5620c3)
  │
  ├── [Optional Phase 0] chore/vercel-deploy-safety
  │     └── vercel.json: remove db:migrate:deploy only
  │
  └── reconcile/public-only-from-main
        ├── Phase 1: Category A files (78) from c51a60e
        ├── Phase 2: Category B globals/layout + brand shell chain
        ├── Phase 3: Category C surgical route-protection + minimal routes.ts + package.json scripts
        └── Phase 4 (owner decision): Category D slices — auth visual, request redirect, middleware gate
```

**Do not** branch from `feat/first-tenant-golden-path` for the reconciliation PR — branch from **`main`** and apply patches file-by-file to avoid dragging FTGP commits.

**Production pinning:** Keep `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` until reconciliation PR merges and passes Preview certification smoke.

---

## 9. Recommended PR strategy

| PR | Scope | Target | Merge order |
|----|-------|--------|-------------|
| **PR-A** (optional) | `vercel.json` migrate removal only | `main` | First |
| **PR-B** | Public-only UI + policy (A + B + C) | `main` | After PR-A or combined if owner prefers |
| **PR-C** (optional) | Auth visual shell + login/signup styling without C3 redirect logic | `main` | Owner-authorized |
| **PR-D** (deferred) | FTGP / C3 / full PR #10 | `main` | Separate milestone |

**PR title (suggested):** `feat(public): reconcile accepted Production public experience onto main`

**PR size target:** ~85–95 files, not 1,277.

**Review focus:** `route-protection.ts` diff hunk, any `middleware.ts` change, `routes.ts` surgical patch, no `prisma/` files.

---

## 10. Recommended test gates

| Gate | Command | Required for merge |
|------|---------|-------------------|
| Whitespace | `git diff --check` | Yes |
| Types | `npm run typecheck` | Yes |
| Lint | `npm run lint` | Yes |
| Build | `npm run build` | Yes |
| Public access policy | `npm run public-access-policy:test` | Yes |
| Public route architecture | `npm run public-route-architecture:test` | Yes |
| Public v2 readiness | `npm run public-v2-preview-readiness:test` | Yes |
| Bundle containment | `npm run public-v2-bundle-containment:verify` | Yes (add to PR checklist) |
| Vercel build command | Manual / CI: no `db:migrate:deploy` in `vercel.json` | Yes before Production from `main` |
| Preview smoke | `scripts/smoke-crow-public-prod.ts` against Preview URL | Yes before Production promotion |
| Production smoke | Same script against canonical URL | After merge + deploy only |

---

## 11. Required owner decisions before implementation

| # | Decision | Options |
|---|----------|---------|
| 1 | **Proceed with public-only reconciliation?** | Yes → implement PR-B · No → keep Production pinned on feature branch |
| 2 | **`vercel.json` migrate removal** | Separate PR-A first · Combined with public PR |
| 3 | **Login/signup visual refresh on `main`** | Include PR-C (may need minimal auth helpers) · Defer — legacy auth pages with new public chrome only around `(public)` routes |
| 4 | **`request/page.tsx` session redirect** | Include with `requestNew` route stub · Simplify to static public page without redirect |
| 5 | **Middleware certification host gate** | Include `ftgp-certification-host-gate.ts` (env-inactive) · Omit until FTGP merge |
| 6 | **`route-protection.ts` C3 API paths** | Exclude from public-only PR · Include (auth slice — not recommended) |
| 7 | **GAP-004 timing** | Reconcile public UI before Preview DB isolation · Block `main` Production deploy until GAP-004 resolved |
| 8 | **Production promotion after merge** | Owner authorization phrase per CROW.PUBLIC.PROD pattern |

---

## 12. Rollback / Production pinning note

| Item | Value |
|------|-------|
| **Current Production** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` |
| **Rollback** | `dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4` (`main` @ `a5620c3`) |
| **Pin policy** | Do not redeploy Production from `main` until reconciliation PR merges and Preview certification passes |
| **Safe rollback** | Vercel alias to `dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4` restores legacy public (not accepted experience) |

---

## 13. GAP-004 and GAP-012 status

| Gap | Status | Notes |
|-----|--------|-------|
| **GAP-004** | **Open — BLOCKED** | Preview/Production share Postgres fingerprint; `db:migrate:deploy` on `main` amplifies risk |
| **GAP-012** | **Open — High** | Plan prepared in RECON.1; implementation awaits owner decisions §11 |

---

## Repository gates (RECON.1)

| Gate | Result |
|------|--------|
| `git diff --check` | PASS |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS |
| `npm run public-access-policy:test` | PASS |
| `npm run public-route-architecture:test` | PASS |
| `npm run public-v2-preview-readiness:test` | PASS |

---

## Final verdict

**READY — PUBLIC-ONLY MAIN RECONCILIATION PLAN PREPARED FOR OWNER DECISION**

The accepted public experience **can** be separated from PR #10 into a ~78–95 file reconciliation PR based on `main`. Coupling exists in auth pages, middleware certification gate, and `route-protection` C3 additions — these are **explicitly classified and deferrable**. Cherry-pick is **not** zero-risk without owner decisions in §11; it is **feasible** without merging PR #10.
