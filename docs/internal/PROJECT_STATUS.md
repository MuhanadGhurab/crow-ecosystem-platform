# Project status

**Last updated:** 25 May 2026 (F11 organic browser E2E sign-off)  
**Audience:** Internal delivery / engineering

**Checkpoint detail:** [`RC1_STAGING_VALIDATION.md`](RC1_STAGING_VALIDATION.md) · **Milestone map:** [`MILESTONES.md`](MILESTONES.md)

---

## Current milestone

**RC1 — passed.**

Staging deployment on Vercel with Supabase pooler + Auth is **validated**: login, CEM Command Center, admin surfaces, MEEM tenant runtime, blueprint/go-live paths, CyberCrow advisory views, notifications, and controlled client portal preview.

RC1 is **advisory-first** — no hard billing enforcement, no usage blocking, no SCIM/Entra group sync.

---

## Current delivery track

**Phase F11 — organic browser E2E closure & operator sign-off** (25 May 2026).

Staging organic intake for **Najm Aviation Services** (aviation): reference **`CROW-2026-ARAX9K`**, discovery + draft blueprint on staging (no tenant provision). Full regression suite and `onboarding:verify --expect-blueprint --expect-sector=aviation` pass. Detail: [`F11_ORGANIC_BROWSER_E2E_SIGNOFF.md`](F11_ORGANIC_BROWSER_E2E_SIGNOFF.md).

**F11 acceptance (25 May 2026):** **PASSED WITH WARNINGS** — automation + verify complete; Platform Admin browser walkthrough (F8 §18) still pending (browse MCP unavailable in agent run).

**Completed prior:** F10 operator console — [`F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md`](F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md) · F9 — [`F9_BLUEPRINT_GO_LIVE_BRIDGE.md`](F9_BLUEPRINT_GO_LIVE_BRIDGE.md) · F8 — [`F8_ORGANIC_REQUEST_E2E.md`](F8_ORGANIC_REQUEST_E2E.md) · F7 — [`F7_PUBLIC_DISCOVERY_PIPELINE.md`](F7_PUBLIC_DISCOVERY_PIPELINE.md) · F6 Rimal — [`F6_SECOND_TENANT_ONBOARDING.md`](F6_SECOND_TENANT_ONBOARDING.md).

**Scripts:** `npm run onboarding:verify` · `scripts/f11-discovery-blueprint-staging.ts` (F11 staging helper, no provision) · `npm run request:e2e:dry` · `npm run request:pipeline:verify`.

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
