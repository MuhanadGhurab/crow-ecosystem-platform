# CYBERCROW — delivery milestones

**Purpose:** Executive milestone map aligned with [`PHASES.md`](PHASES.md) and [`ERP_ROADMAP.md`](ERP_ROADMAP.md). Percentages are **honest** — not marked 100% without rehearsal or production evidence.

**Status detail:** [`PROJECT_STATUS.md`](PROJECT_STATUS.md) · **Team:** [`TEAM_OWNERSHIP.md`](TEAM_OWNERSHIP.md)

---

## Milestone index

| ID | Milestone | Phases / backlog | Owner | % | Status |
|----|-----------|------------------|-------|---|--------|
| **F12** | Product demo & external readiness | Storyboard, routes, playbook, public polish | Muhanad | **100%** | **Passed** — [`F12_DEMO_STORYBOARD.md`](F12_DEMO_STORYBOARD.md) |
| **F11** | Organic browser E2E closure | Najm aviation intake, operator sign-off, verify | Muhanad | **100%** | **Passed** — [`F11_ORGANIC_BROWSER_E2E_SIGNOFF.md`](F11_ORGANIC_BROWSER_E2E_SIGNOFF.md) |
| **F10** | Tenant onboarding operator console | Admin UX, pipeline bridge, lifecycle labels | Muhanad | **100%** | **Passed** — [`F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md`](F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md) |
| **F9** | Blueprint & go-live bridge | Gate, idempotent blueprint, provision safety | Muhanad | **100%** | **Passed** — [`F9_BLUEPRINT_GO_LIVE_BRIDGE.md`](F9_BLUEPRINT_GO_LIVE_BRIDGE.md) |
| **F8** | Discovery templates + organic E2E | JSON packs, org-intel, verify scripts | Muhanad | **100%** | **Passed** — [`F8_DISCOVERY_TEMPLATE_EXPANSION.md`](F8_DISCOVERY_TEMPLATE_EXPANSION.md) |
| **F7** | Public → Discovery pipeline | Intake, admin, sector templates | Muhanad | **100%** | **Passed** — [`F7_PUBLIC_DISCOVERY_PIPELINE.md`](F7_PUBLIC_DISCOVERY_PIPELINE.md) |
| **F6** | Second tenant onboarding (Rimal) | Construction sector, isolation | Muhanad | **100%** | **Passed** — [`F6_SECOND_TENANT_ONBOARDING.md`](F6_SECOND_TENANT_ONBOARDING.md) |
| **RC1** | Staging deploy & health validation | Staging sign-off | Muhanad | **100%** | **Passed** — [`RC1_STAGING_VALIDATION.md`](RC1_STAGING_VALIDATION.md) |
| **M1** | Platform foundation | 0, 1, 2, 7b | Muhanad | **100%** | Done |
| **M2** | MEEM lighthouse pipeline | MEEM, 3, 4 (+ RBAC) | Muhanad · MEEM (Omar) SAREA | **~95%** | Live E2E passed (P1); staging URL pending |
| **M3** | Modular ERP chain | 5, E1–E9 | Muhanad | **~92%** | Done for MEEM demo |
| **M4** | CyberCrow operations | 6, E10 | Muhanad | **100%** | Done — [`M4_CYBERCROW_REHEARSAL.md`](M4_CYBERCROW_REHEARSAL.md) |
| **M5** | MEEM SAREA acceptance | 7, E11 | **MEEM (Omar)** · Muhanad (hooks) | **~25%** | Customer acceptance — not Crow dev |
| **M6** | Auth hardening & SaaS prep | 8, 9 | Muhanad | **~90%** | Prod auth gate + CI; dept chips DB-driven; MEEM CI path |
| **M7** | Cloud & production | Cloud, Resend | Muhanad | **~75%** | Code-complete; live Azure/Vercel + Entra prod pending |
| **M8** | Paid customer / SaaS | 10, billing | Muhanad | **~70%** | Stripe scaffold + checkout when keys set |

---

## RC1 — Staging deploy & health validation

**Scope:** Deployed **Vercel staging** build with **Supabase** pooler + Auth; confirm core pages and auth routing before Phase F planning.

| Passed | Evidence |
|--------|----------|
| Vercel deployment + pooler DB | User-confirmed staging URL |
| Auth / platform admin landing | `/admin/overview` after login |
| CEM Command Center + admin pages | Overview, notifications, tenants |
| MEEM tenant runtime | Dashboard, plan settings |
| Blueprint / go-live | Lighthouse blueprint surfaces |
| Client portal | Clients on portal; staff preview controlled |
| API security patch | [`API_SECURITY.md`](API_SECURITY.md) |

**Status:** **Passed** (25 May 2026). **Advisory platform stable** — billing enforcement, SCIM, and digest email send remain out of scope.

**Next:** Phase F production readiness or public portfolio polish — see [`PROJECT_STATUS.md`](PROJECT_STATUS.md).

---

## F12 — Product demo, showcase & external readiness

**Scope:** Make Crow easy to explain and demo externally — storyboard, safe route index, screenshot checklist, operator playbook, sanitized public/README/CV wording. No Stripe enforcement, SCIM, schema changes, or major public redesign.

**Status:** **Passed** (25 May 2026).

| Deliverable | Doc |
|-------------|-----|
| Demo storyboard (12 steps) | [`F12_DEMO_STORYBOARD.md`](F12_DEMO_STORYBOARD.md) |
| Demo route index | [`F12_DEMO_ROUTE_INDEX.md`](F12_DEMO_ROUTE_INDEX.md) |
| Screenshot checklist | [`F12_SCREENSHOT_CHECKLIST.md`](F12_SCREENSHOT_CHECKLIST.md) |
| Operator demo playbook | [`F12_OPERATOR_DEMO_PLAYBOOK.md`](F12_OPERATOR_DEMO_PLAYBOOK.md) |
| Public portfolio line | [`README.md`](../../README.md) · [`docs/public/ARCHITECTURE.md`](../public/ARCHITECTURE.md) |

**Platform proof (unchanged):** MEEM logistics lighthouse · Rimal construction second tenant · Najm organic aviation pipeline (F11) · CyberCrow · SAREA · CEM Command Center.

---

## F11 — Organic browser E2E closure & operator sign-off

**Scope:** Close F9/F10 organic-browser gap using **Najm Aviation Services** (aviation sector): live intake on staging, operator pipeline through discovery/blueprint/readiness/go-live visibility, `onboarding:verify` for organic `CROW-2026-{6-char}` ref — **no tenant provisioning**.

**Status:** **Passed** (25 May 2026). Detail: [`F11_ORGANIC_BROWSER_E2E_SIGNOFF.md`](F11_ORGANIC_BROWSER_E2E_SIGNOFF.md). Reference: `CROW-2026-ARAX9K`.

| Sub-phase | Result |
|-----------|--------|
| **F11A** | Automated regression + `onboarding:verify` — passed |
| **F11B** | Browser operator sign-off (Platform Admin) — passed |

Organic aviation request validated in browser; admin request detail, discovery/operator flow, and blueprint/readiness/go-live visibility verified. Tenant provisioning **not** performed (intentional). F11 warnings **closed**.

---

## F10 — Tenant onboarding operator console

**Scope:** Admin operator clarity — lifecycle buckets on overview, request detail next action, shared pipeline navigation on discovery/blueprint pages, human labels without schema, organic E2E checklist + `onboarding:verify`.

**Status:** **Passed** (25 May 2026). Detail: [`F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md`](F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md). Acceptance regression: [`F10_DEPLOYMENT_CHECKPOINT.md`](F10_DEPLOYMENT_CHECKPOINT.md) — **PASSED WITH WARNINGS** (25 May 2026).

---

## F9 — Blueprint generation & go-live bridge

**Scope:** Advisory discovery→blueprint gate, hardened `completeDiscoveryAndCreateBlueprint`, readiness/go-live UX, admin pipeline links, duplicate provision guards, extended `request:e2e:verify` flags.

**Status:** **Passed** (25 May 2026). Detail: [`F9_BLUEPRINT_GO_LIVE_BRIDGE.md`](F9_BLUEPRINT_GO_LIVE_BRIDGE.md). Acceptance regression: [`F9_DEPLOYMENT_CHECKPOINT.md`](F9_DEPLOYMENT_CHECKPOINT.md) — **PASSED WITH WARNINGS** (25 May 2026).

---

## F8 — Discovery template expansion & organic E2E

**Scope:** Five-sector discovery JSON packs (incl. construction + aviation), org-intelligence alignment, read-only E2E scripts, manual organic checklist.

| Done | Open |
|------|------|
| `construction.json` + `aviation.json` packs | `NEEDS_INFO` admin state (schema) |
| Org-intel construction/aviation expansion | Automated Playwright organic path |
| `request:e2e:dry` / `request:e2e:verify` | One-click organic tenant provision |
| `F8_ORGANIC_REQUEST_E2E.md` (18 steps) | Dedicated aviation lighthouse tenant |

**Verification:** `npm run request:e2e:dry` + `request:pipeline:verify` + MEEM/Rimal scripts.

---

## F7 — Public request → Discovery pipeline

**Scope:** Audit and harden public `/request` intake, admin approve/reject, discovery bootstrap, multi-sector org intelligence (not logistics-only default).

| Done | Open |
|------|------|
| Audit + fixes in F7 doc | `NEEDS_INFO` admin state (schema) |
| `request:pipeline:verify` scripts | — (superseded by F8 JSON packs) |
| Reference code + sector bootstrap | Live browser E2E → F8 checklist |

**Verification:** `npm run request:pipeline:verify` + MEEM/Rimal tenant scripts.

---

## F6 — Second tenant onboarding (Rimal Construction)

**Scope:** Repeatable non-MEEM tenant via construction sector template; staging scripts; MEEM regression preserved.

| Done | Open |
|------|------|
| Lifecycle audit in F6 doc | Live browser E2E on `/rimal-construction/*` |
| `tenant:seed:rimal`, `tenant:verify:rimal` | Construction-specific ERP industry pack |
| Construction org intelligence accept path | Optional controlled reset script |
| Isolation checks vs `meem-global` | Lighthouse card still MEEM-only |

**Verification:** `npm run tenant:verify:rimal` + `npm run sarea:meem-verify` + build gate.

---

## M1 — Platform foundation

**Scope:** Docs baseline, design system, commercial pipeline UI, unified identity + client portal.

| Evidence | |
|----------|--|
| `npm run typecheck`, `lint`, `build` | [`BASELINE.md`](BASELINE.md) |
| Public routes + `/request` wizard | Phase 1–2 exit criteria |
| `/portal/requests`, Entra story | Phase 7b |

---

## M2 — MEEM lighthouse pipeline

**Scope:** Blueprint → discovery → readiness → go-live → `meem-global` tenant; RBAC matrix + MEEM role seed.

| Done | Open |
|------|------|
| `prisma/seed-meem.ts`, `db:seed:meem:ops` | Live E2E pass — [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md) |
| Readiness + `pipeline.service` | `/admin/audit` checklist #12 rehearsed on live DB |
| [`RBAC.md`](RBAC.md), permissions + middleware | MEEM (Omar) SAREA persona acceptance (M5) |

---

## M3 — Modular ERP chain

**Scope:** Registry, tenant-ops seed, de-MEEM-gate, finance/reports, procurement, MEEM module keys (E1–E9).

| Done | Open |
|------|------|
| `erp-module-registry`, `tenant-ops-seed.service` | E11 SAREA ERP nav profiles (Muhanad config → Omar accepts) |
| Finance, reports, procurement routes + data | E12 retail/healthcare packs |
| MEEM sales/inventory/warehouse/logistics chain | E14 recorded demo in [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) |

**Verification:** typecheck, build, seeds, `verify-logistics-audit` green.

---

## M4 — CyberCrow operations

**Scope:** Logistics audit (E10), data-backed tenant dashboard, GRC summary, auditor read-only UI, platform `/admin/audit` strip.

| Done | Open |
|------|------|
| E10 logistics → `cybercrowAuditLog` | GRC bulk import / extended NCA catalog (post-M4) |
| `/[tenant]/cybercrow/grc` — NCA labels + evidence preview (2–3 rows/control) | — |
| `/admin/overview` — cross-tenant CyberCrow posture strip | — |
| `auditor_readonly` + tenant CyberCrow paths; logistics admin audit filter | — |
| Entra ops narrative — settings, login, `/cybercrow/identity`, `/help/entra-sso` | — |
| Rehearsal script — [`M4_CYBERCROW_REHEARSAL.md`](M4_CYBERCROW_REHEARSAL.md) + `npm run rehearsal:m4` | — |
| **MEEM Phase 4 E2E** | **Deferred** until M6/M7 polish ([`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md)) |

---

## M5 — MEEM SAREA acceptance

**Scope:** Persona/layout/nav validation on `meem-global` dashboard — **customer-side**.

**Owner:** MEEM (Omar). **Crow:** Muhanad ships `/sarea/*` studio + `sarea-runtime.service` seeds.

See [`SAREA_OMAR_SCOPE.md`](SAREA_OMAR_SCOPE.md) · [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) flow #8.

---

## M6 — Auth hardening & SaaS prep

**Scope:** Production auth checklist, Postgres without mocks, migrate baseline.

| Done | Open |
|------|------|
| `AUTH_DISABLED` blocked + `gate:production-auth` CI job | MEEM full seed in CI (optional) |
| Dept chips on admin + portal (discovery `sareaPackageKey`) | — |
| `postgres-smoke`: seed + smoke + `onboard:tenant` ci-acme | — |
| Client role + portal DeptChips | — |
| [`M6_AUTH_SAAS.md`](M6_AUTH_SAAS.md) — migrate deploy + RBAC | — |

---

## M7 — Cloud & production

**Scope:** **Azure primary** (App Service + Azure PostgreSQL), Entra prod redirects, `prisma migrate deploy` in release pipeline. Vercel + Supabase pooler = **optional interim** only. Resend optional.

| Done | Open |
|------|------|
| [`AZURE_DEPLOY.md`](AZURE_DEPLOY.md) — primary target checklist | Azure Postgres + App Service live |
| [`M7_CLOUD_DEPLOY.md`](M7_CLOUD_DEPLOY.md) — env matrix, shared migrate rules | Entra prod verified on Azure URL |
| `vercel.json` — generate + migrate + build (interim) | Custom domain on Azure |
| [`.env.production.example`](../.env.production.example) | `RESEND_API_KEY` when email required |
| `npm run deploy:check` + `DEPLOY_TARGET=azure` | `/api/health` `deployReady` on Azure prod |
| `/api/health` — `migrationsApplied`, `billingReady` | Optional Vercel preview (not required) |
| CI `postgres-smoke` + `production-gate` | — |
| Entra prod checklist — [`ENTRA_SSO.md`](ENTRA_SSO.md) § Production | |

**Commands:** `npm run deploy:check` · `DEPLOY_TARGET=vercel npm run deploy:check`

Notification **logging** works; **send** requires `RESEND_API_KEY`.

---

## M8 — Paid customer / SaaS

**Scope:** Repeatable paying-customer path — blueprint modules, provision, optional Stripe. MEEM “full ERP” depth remains **revenue-gated**.

| Done | Open |
|------|------|
| [`M8_SAAS_CUSTOMER.md`](M8_SAAS_CUSTOMER.md) — lifecycle + checklist | Live Stripe checkout |
| `npm run onboard:tenant` — CLI second customer | Customer #2 on staging |
| `GET /api/billing/status` (`checkoutReady`) | Live charges (Stripe keys in prod) |
| Checkout + webhook + Prisma Stripe fields | Customer #2 on staging |
| E1–E9 machinery (any tenant) | Contract-specific ERP depth |

**MEEM** stays lighthouse — [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md).

---

## Recommended track — Muhanad (implementation)

**Finish platform locally first:** [`FINISH_PLATFORM.md`](FINISH_PLATFORM.md) — then Azure (M7).

1. **Close M2** — Run [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md); confirm `/admin/audit` logistics filter + notifications.  
2. **M4** — [`M4_CYBERCROW_REHEARSAL.md`](M4_CYBERCROW_REHEARSAL.md) + `npm run rehearsal:m4`.  
3. **M6** — `smoke:phase1` + CI `postgres-smoke` green; MEEM without `USE_MOCK_DATA`.  
4. **Push** — commit tooling/docs on `main`.  
5. **M7 (later)** — [`AZURE_DEPLOY.md`](AZURE_DEPLOY.md) when platform gates pass.  
6. **M5 (parallel)** — Omar SAREA checklist; not blocking platform finish.

---

## Cross-references

| Topic | Document |
|-------|----------|
| RC1 staging checkpoint | [`RC1_STAGING_VALIDATION.md`](RC1_STAGING_VALIDATION.md) |
| Current status | [`PROJECT_STATUS.md`](PROJECT_STATUS.md) |
| Phase checkboxes | [`PHASES.md`](PHASES.md) |
| ERP backlog E1–E14 | [`ERP_ROADMAP.md`](ERP_ROADMAP.md) |
| MEEM demo | [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) |
| Go-live order | [`GO_LIVE_PIPELINE.md`](GO_LIVE_PIPELINE.md) |

---

*May 2026 — milestone map after E1–E10 ERP backlog and Phase 6 CyberCrow slice.*
