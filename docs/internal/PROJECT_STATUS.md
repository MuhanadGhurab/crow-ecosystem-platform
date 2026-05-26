# Project status

**Last updated:** 26 May 2026 (v0.30 portfolio baseline — safe to pause)  
**Audience:** Internal delivery / engineering

**Checkpoint detail:** [`RC1_STAGING_VALIDATION.md`](RC1_STAGING_VALIDATION.md) · **Milestone map:** [`MILESTONES.md`](MILESTONES.md)

---

## Current milestone

**RC1 — passed.**

Staging deployment on Vercel with Supabase pooler + Auth is **validated**: login, CEM Command Center, admin surfaces, MEEM tenant runtime, blueprint/go-live paths, CyberCrow advisory views, notifications, and controlled client portal preview.

RC1 is **advisory-first** — no hard billing enforcement, no usage blocking, no SCIM/Entra group sync.

---

## Current delivery track

**v0.30 portfolio baseline — safe to pause** (26 May 2026).

**Wrap-up:** F30 tag `v0.30.0-portfolio` at `f6fcc40`; F31 hygiene complete; post-F30 straggler commits on `main` (`a47af1b`); working tree clean; production launch **deferred** (F23). See [`PROJECT_WRAP_UP_V0_30.md`](PROJECT_WRAP_UP_V0_30.md).

| Deliverable | Doc |
|-------------|-----|
| v0.30 portfolio wrap-up (pause) | [`PROJECT_WRAP_UP_V0_30.md`](PROJECT_WRAP_UP_V0_30.md) |
| Workspace hygiene & release cleanliness | [`F31_WORKSPACE_HYGIENE_RELEASE_CLEANLINESS.md`](F31_WORKSPACE_HYGIENE_RELEASE_CLEANLINESS.md) |
| Final portfolio release tag | [`F30_FINAL_PORTFOLIO_RELEASE_TAG.md`](F30_FINAL_PORTFOLIO_RELEASE_TAG.md) |
| Public release notes | [`docs/public/RELEASE_NOTES.md`](../public/RELEASE_NOTES.md) |
| Documentation & developer experience pass | [`F29_DOCUMENTATION_DEVELOPER_EXPERIENCE_PASS.md`](F29_DOCUMENTATION_DEVELOPER_EXPERIENCE_PASS.md) |
| Demo data / mock mode excellence | [`F28_DEMO_DATA_MOCK_MODE_EXCELLENCE.md`](F28_DEMO_DATA_MOCK_MODE_EXCELLENCE.md) |
| Admin quality & reliability pass | [`F27_ADMIN_QUALITY_RELIABILITY_PASS.md`](F27_ADMIN_QUALITY_RELIABILITY_PASS.md) |
| CEM workflow operations depth | [`F26_CEM_WORKFLOW_OPERATIONS_DEPTH.md`](F26_CEM_WORKFLOW_OPERATIONS_DEPTH.md) |
| Discovery intelligence refinement | [`F25_DISCOVERY_INTELLIGENCE_REFINEMENT.md`](F25_DISCOVERY_INTELLIGENCE_REFINEMENT.md) |
| Tenant runtime UX | [`F24_TENANT_RUNTIME_UX_DEPTH.md`](F24_TENANT_RUNTIME_UX_DEPTH.md) |
| Launch deferred gate (F23) | [`F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md`](F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md) |

**Roadmap:** **Paused** at v0.30 portfolio baseline. Resume only with explicit plan — F23 production launch when client + budget approve, **or** F32 reliability automation, **or** customer tracks (M5).

**F31 acceptance:** **PASSED** — [`F31_WORKSPACE_HYGIENE_RELEASE_CLEANLINESS.md`](F31_WORKSPACE_HYGIENE_RELEASE_CLEANLINESS.md).  
Straggler commits landed on `main`; working tree **clean**; `main` at `a47af1b`.

**F30 acceptance:** **PASSED** — [`F30_FINAL_PORTFOLIO_RELEASE_TAG.md`](F30_FINAL_PORTFOLIO_RELEASE_TAG.md).  
Portfolio/demo/staging checkpoint validated; git tag **`v0.30.0-portfolio`** at `f6fcc40`.

**F29 acceptance:** **PASSED** — [`F29_DOCUMENTATION_DEVELOPER_EXPERIENCE_PASS.md`](F29_DOCUMENTATION_DEVELOPER_EXPERIENCE_PASS.md).  
Current safe operating mode: **staging/demo/portfolio** (F23 production deferred gate remains active).

**F28 acceptance:** **PASSED** — [`F28_DEMO_DATA_MOCK_MODE_EXCELLENCE.md`](F28_DEMO_DATA_MOCK_MODE_EXCELLENCE.md).  
Preflight guard: `npm run mock:verify`.

**F27 acceptance:** **PASSED** — [`F27_ADMIN_QUALITY_RELIABILITY_PASS.md`](F27_ADMIN_QUALITY_RELIABILITY_PASS.md).

**F26 acceptance:** **PASSED** — [`F26_CEM_WORKFLOW_OPERATIONS_DEPTH.md`](F26_CEM_WORKFLOW_OPERATIONS_DEPTH.md).

**F25 acceptance:** **PASSED** — [`F25_DISCOVERY_INTELLIGENCE_REFINEMENT.md`](F25_DISCOVERY_INTELLIGENCE_REFINEMENT.md).

**F24 acceptance:** **PASSED** — [`F24_TENANT_RUNTIME_UX_DEPTH.md`](F24_TENANT_RUNTIME_UX_DEPTH.md).

**F23 acceptance:** **PASSED AS A DECISION GATE** — production launch **deferred**; engineering not blocked.

**F22 acceptance:** **PASSED** — [`F22_PORTFOLIO_PUBLIC_DEMO_POLISH.md`](F22_PORTFOLIO_PUBLIC_DEMO_POLISH.md).

**F21 acceptance:** **PASSED** — evidence/GRC surfaces deepened; MEEM/Rimal verify scripts green.

**F20 acceptance:** **PASSED** — [`F20_SAREA_ADVANCED_CONTROLS.md`](F20_SAREA_ADVANCED_CONTROLS.md).

**F19 acceptance:** **PASSED** (docs + advisory pricing line) — billing remains internal/advisory until budget approval.

**F18 acceptance:** **PASSED** — [`F18_GOOGLE_SIGNIN_SETUP.md`](F18_GOOGLE_SIGNIN_SETUP.md) · enable Google in Supabase/Google Cloud for live Google login.

**F17 acceptance:** **PASSED** — [`F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md`](F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md).

**Completed prior:** **F16 — Production launch readiness** — F16_* governance docs (**passed**).

**Completed prior:** **F15.6 — Public surface security regression audit** — [`F15_6_PUBLIC_SECURITY_REGRESSION_AUDIT.md`](F15_6_PUBLIC_SECURITY_REGRESSION_AUDIT.md) (**passed**).

**Completed prior:** **F15.5 — Homepage usability & public story clarity** — [`F15_5_HOMEPAGE_USABILITY.md`](F15_5_HOMEPAGE_USABILITY.md) (**passed**).

**Completed prior:** **F15 — CyberCrow SOC workflow depth** — [`F15_CYBERCROW_SOC_WORKFLOW_DEPTH.md`](F15_CYBERCROW_SOC_WORKFLOW_DEPTH.md) (**passed**).

**Completed prior:** **F14 — SAREA Studio visibility & safe controls** — [`F14_SAREA_STUDIO_VISIBILITY_SAFE_CONTROLS.md`](F14_SAREA_STUDIO_VISIBILITY_SAFE_CONTROLS.md) (**passed**).

**Completed prior:** **F13** — demo rehearsal & 12 public screenshots — [`F13_DEMO_REHEARSAL_NOTES.md`](F13_DEMO_REHEARSAL_NOTES.md) (**passed**).

**Completed prior:** **F12** — [`F12_DEMO_STORYBOARD.md`](F12_DEMO_STORYBOARD.md) · [`F12_OPERATOR_DEMO_PLAYBOOK.md`](F12_OPERATOR_DEMO_PLAYBOOK.md) (**passed**).

**Completed prior:** **F11** organic browser E2E — [`F11_ORGANIC_BROWSER_E2E_SIGNOFF.md`](F11_ORGANIC_BROWSER_E2E_SIGNOFF.md) · F10 — [`F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md`](F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md) · F9 · F8 · F7 · F6 Rimal.

**Demo scripts:** `npm run meem:ids:staging` · `npm run tenant:verify:rimal` · `npm run request:pipeline:verify` · `npm run onboarding:verify` · `npm run public:mirror-manifest`.

RC1 remains the staging health baseline; F7 does not replace production-readiness planning.

---

## Recommended Phase F options (not selected)

Pick **one primary track** after planning; others can run in parallel only if resourced.

| # | Option | Summary |
|---|--------|---------|
| 1 | **Production readiness** | Azure or Vercel prod, domain, Entra prod redirects, migrate deploy in release, health smoke |
| 2 | **Public portfolio polish** | README/screenshots, sanitized public docs, contributor onboarding |
| 3 | **Tenant onboarding hardening** | **F6** Rimal · **F7** pipeline · **F8** five-sector templates + organic E2E |
| 4 | **Package UX** | Startup / Growth / Enterprise surfaces — still advisory unless billing chosen |
| 5 | **Security hardening** | Rate limiting, Turnstile on public request API, extended audit |
| 6 | **Stripe live alignment** | Live checkout, webhook reconciliation, enforcement policy decision |
| 7 | **Entra / SCIM planning** | Group sync and provisioning design only — no implementation commitment |

---

## Honest backlog context (M1–M8)

Long-running milestone percentages remain in [`MILESTONES.md`](MILESTONES.md). RC1 does not mark M7/M8 as 100%; it confirms **staging health** for the integrated platform slice.

| Area | Note |
|------|------|
| M2 MEEM E2E | Lighthouse pipeline live on staging; customer SAREA acceptance (M5) still separate |
| M7 Cloud | Staging on Vercel validated; Azure primary path still open |
| M8 SaaS | Stripe scaffold; live charges not RC1 scope |

---

## What not to do immediately after RC1

- No new features without Phase F plan
- No schema changes without migration review
- No auth routing churn without security review
- No secrets or `.env` content in git or public docs

---

*Concise status pointer — operational detail lives in RC1 checkpoint and milestone entries.*
