# CYBERCROW delivery phases — roadmap to production

**Purpose:** Single forward-looking execution plan from docs cleanup → lighthouse demo → database → cloud → go-live.

**Status snapshot:** [`PROJECT_STATUS.md`](PROJECT_STATUS.md) (~55% production-ready, ~80% UI/mock demo).

**Milestones (M1–M8):** [`MILESTONES.md`](MILESTONES.md)

**North star:** Request → Discovery → Blueprint (pricing) → Proposal → Go-live → CEM tenant (+ CyberCrow + SAREA).

**Dev modes:** UI-only → `AUTH_DISABLED=true` + `USE_MOCK_DATA=true` ([`DEV_WITHOUT_DB.md`](DEV_WITHOUT_DB.md)). Production → Postgres + Supabase Auth + Entra.

**Historical backend phases:** [`docs/archive/PHASE1_PIPELINE.md`](archive/PHASE1_PIPELINE.md) … [`PHASE8.md`](archive/PHASE8.md).

---

## Phase index

| Phase | Focus | Est. | Depends on | Completion |
|-------|--------|------|------------|------------|
| [0](#phase-0--docs--baseline) | Docs & baseline | S | — | **100%** |
| [1](#phase-1--design-system--public) | Design system & public | M | 0 | **96%** |
| [1b](#phase-1b--product-narrative) | Product narrative | S | 1 | **75%** |
| [2](#phase-2--commercial-pipeline-ui) | Commercial pipeline UI | M | 0, 1 | **95%** |
| [**MEEM**](#phase-meem--lighthouse-customer-demo) | **Lighthouse customer demo** | M | 2 | **78%** |
| [3](#phase-3--discovery--blueprint-data) | Discovery & blueprint data | L | 2 | **85%** |
| [4](#phase-4--go-live--tenant-seed) | Go-live & tenant seed | M | 3, MEEM | **78%** |
| [5](#phase-5--cem-tenant-runtime) | CEM tenant runtime | L | 4 | **88%** |
| [6](#phase-6--cybercrow-dept-console) | CyberCrow dept console | L | 4, 5 | **100%** |
| [7](#phase-7--sarea-dept-meem-customer) | SAREA (MEEM customer acceptance) | M | 4, 5 | **25%** |
| [7b](#phase-7b--unified-identity--client-portal) | Identity & client portal | M | 2 | **88%** |
| [8](#phase-8--auth--roles) | Auth & roles | L | 5–7 | **55%** |
| [9](#phase-9--postgres--demo-hardening) | Postgres & demo hardening | M | 3–8 | **35%** |
| [10](#phase-10--go-live-marketing) | Marketing & launch | L | 1, 9 | **35%** |
| [**Cloud**](#phase-cloud--vercel-supabase-entra-production) | **Cloud & production** | L | 9 | **5%** |

---

## Phase 0 — Docs & baseline

**Goal:** Clear repo layout, verification gates, UI-only path documented.

**Exit criteria**

- [x] Repo structure: `src/STRUCTURE.md`, `docs/README.md`, `archive/HTML_proc/`
- [x] `npm run typecheck`, `lint`, `build` documented in [`BASELINE.md`](BASELINE.md)
- [x] `GET /api/health` — `{ ok, db, auth, mockData }`
- [x] `USE_MOCK_DATA` + `AUTH_DISABLED` documented
- [x] [`PROJECT_STATUS.md`](PROJECT_STATUS.md) — % complete, blockers, next actions

---

## Phase 1 — Design system & public

**Goal:** Public marketing matches [`PAGE_DESIGNS.md`](PAGE_DESIGNS.md) and [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md).

**Exit criteria**

- [x] Homepage bento, engine cards, stats strip
- [x] `/request` wizard, `/security`, `/pricing`
- [x] `PublicPageHeader` + `cc-public-section` on marketing routes
- [ ] Case studies / clients — production copy or CMS plan

---

## Phase 1b — Product narrative

**Goal:** Customer story = 3 engines + pipeline; internal 10-layer stays in docs.

**Exit criteria**

- [x] [`PRODUCT_NARRATIVE.md`](PRODUCT_NARRATIVE.md)
- [x] Public `/`, `/about`, `/modules`, `/architecture` aligned
- [ ] RES-01–RES-05 research backlog (extra-services SKUs in live pricing)

---

## Phase 2 — Commercial pipeline UI

**Goal:** Admin queue + blueprint pricing control room demo-ready (mock or live).

**Exit criteria**

- [x] `/admin/requests`, `/admin/requests/[id]` — lifecycle, dept chips, SAR
- [x] `/blueprints/[id]/overview` + `/pricing` — pricing rail
- [x] `/proposal/[token]` — entity blocks
- [x] Mock path: `mock-req-001` → `mock-bp-001` → `mock-proposal-demo` ([`BASELINE.md`](BASELINE.md))

---

## Phase MEEM — Lighthouse customer demo

**Goal:** First enterprise customer narrative — **MEEM Holding Logistics / MEEM Global** (50–250 users, logistics + AI) — **blueprint → provision → live CEM tenant** `meem-global`.

**Doc:** [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md)  
**Code:** `src/lib/mock/meem-global.ts`

### Demo checklist

| Step | Route | Mock ID |
|------|-------|---------|
| Admin queue | `/admin/requests/mock-req-meem` | `mock-req-meem` |
| Discovery (optional) | `/discovery/mock-req-meem-discovery/*` | `mock-req-meem-discovery` |
| Blueprint overview | `/blueprints/mock-bp-meem/overview` | `mock-bp-meem` |
| Blueprint pricing | `/blueprints/mock-bp-meem/pricing` | |
| Proposal | `/proposal/mock-proposal-meem` | `mock-proposal-meem` |
| Go-live / readiness | `/blueprints/mock-bp-meem/go-live` | |
| **CEM tenant** | `/meem-global/dashboard` | slug `meem-global` |
| Logistics module | `/meem-global/logistics` | |
| Client portal | `/portal/requests/mock-req-meem` | `AUTH_DEV_ROLE=client` |
| Microsoft identity | `/login` → Entra | [`ENTRA_SSO.md`](ENTRA_SSO.md) |

**Launch:** `npm run demo:meem` (or `DEMO_CUSTOMER=meem npm run demo`).

**Exit criteria**

- [x] Customer doc + mock IDs wired in pipeline/blueprint/discovery
- [x] Mock tenant `meem-global` resolves under `USE_MOCK_DATA`
- [x] Live DB seed — `prisma/seed-meem.ts` full pipeline + `db:seed:meem:ops`
- [ ] Homepage / case-study mention MEEM (minimal — optional)
- [ ] Recorded demo script in [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) § MEEM

---

## Phase 3 — Discovery & blueprint data

**Goal:** Discovery outputs feed blueprint pricing including SAREA package; live persist.

**Exit criteria**

- [x] All discovery steps save/load with Postgres (read-only after blueprint build / go-live)
- [x] Summary handoff CTA → blueprint pricing
- [x] Blueprint tabs entity-tinted
- [x] SAREA package persisted on `PricingEstimate` via discovery `experience.sareaPackageKey`

---

## Phase 4 — Go-live & tenant seed

**Goal:** Governed provision blueprint → `/{slug}/dashboard` — operational realism, reusable pipeline, MEEM as lighthouse validation.

**Team:** [`TEAM_OWNERSHIP.md`](TEAM_OWNERSHIP.md) — **Muhanad** (platform/pipeline); **MEEM (Omar)** (customer SAREA acceptance only, item 4 — not Crow dev).

**Pricing (2026-05):** Commercial catalog verified — [`PRICING.md`](PRICING.md), MEEM ~24k SAR/mo illustrative total.

**Pipeline doc:** [`GO_LIVE_PIPELINE.md`](GO_LIVE_PIPELINE.md)

### Implementation priorities

| # | Priority | Owner | Status |
|---|----------|-------|--------|
| 1 | **Blueprint Readiness System** — grouped checks: modules, workflows, RBAC, CyberCrow baseline, SAREA mappings, integrations, org structure | **Muhanad** | [x] `readiness.service` + `/blueprints/:id/readiness` |
| 2 | **Go-Live Provisioning Pipeline** — validate blueprint, org + tenant, seed CEM → CyberCrow → SAREA, lifecycle LIVE (real Prisma) | **Muhanad** | [x] `pipeline.service` + `/go-live` + docs |
| 3 | **Tenant operationalization** — `/{slug}/dashboard` with real post-provision data | **Muhanad** | [x] MEEM `meem-global`; dashboard + workflows + ops seed |
| 4 | **SAREA operational experience** — executive, ops, HR, logistics, analyst, mobile on real mappings | **MEEM (Omar)** validates · **Muhanad** ships runtime | [ ] See [`SAREA_OMAR_SCOPE.md`](SAREA_OMAR_SCOPE.md) |
| 5 | **MEEM Global Phase 4 demo** — validate full commercial → go-live → tenant story | **Muhanad** (demo) + **MEEM (Omar)** (SAREA acceptance) | [~] RBAC + E2E script ready; **live rehearsal deferred** until M4/M6/M7 polish |
| 5b | **RBAC matrix** — `crow_role`, permissions, route guards, MEEM role seed | **Muhanad** | [x] [`RBAC.md`](RBAC.md), `src/lib/auth/permissions.ts` |
| 6 | **Notification pipeline** — log to DB + `/admin/audit`; Resend deferred to Phase Cloud | **Muhanad** | [~] Events log; `skipped` expected without `RESEND_API_KEY` |

**Exit criteria**

- [x] Grouped readiness UI + blockers before go-live CTA
- [x] Readiness server gate when `GO_LIVE_READINESS_GATE=true`
- [x] Provision order verified: org/tenant → CEM seed → CyberCrow → SAREA → `GO_LIVE`
- [x] MEEM live path: `meem-global` (seed + dashboard + `db:seed:meem:ops`)
- [x] MEEM tenant workflows (4 logistics workflows + WorkflowStep rows)
- [x] MEEM OCR/AI — discovery `doc_intelligence` + logistics hub UI
- [~] MEEM Phase 4 validation table — RBAC + [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md); **E2E rehearsal deferred** (platform milestones first)
- [~] Notification pipeline operational — `platformNotification` + `/admin/audit`; Resend **deferred** until Phase Cloud ([`BASELINE.md`](BASELINE.md) § Notifications)
- [x] RBAC — platform/tenant permission matrix, middleware + nav guards, MEEM Hub Manager / Dispatcher seed
- [~] MEEM audit page rehearsal — `/admin/audit` (checklist #12; bundled in deferred [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md))
- [ ] MEEM (Omar) SAREA persona acceptance on MEEM dashboard (priority 4 — customer-side)
- [ ] Backfill scripts in [`BASELINE.md`](BASELINE.md) (if pre–Phase 4 tenants exist)

---

## Phase 5 — CEM tenant runtime

**Goal:** Post-launch CEM workspace — **modular ERP chain** per blueprint modules; MEEM proves logistics at enterprise demo quality.

**ERP plan:** [`ERP_ROADMAP.md`](ERP_ROADMAP.md) — registry, blueprint-driven ops seed, finance/reports/procurement, cross-module links.

**Exit criteria**

- [x] `/{slug}/dashboard` — load/risk/OCR-AI hints, open tasks (MEEM)
- [x] `/users`, `/hr`, `/crm` styled
- [x] MEEM `/meem-global/tasks` — DB task list linked to workflows (ops seed)
- [x] **Sales** · **inventory** · **warehouse** — tenant models + services + MEEM ops seed (see roadmap §2)
- [x] ERP chain UX — registry nav in tenant layout + `ErpChainLinks` (module-driven, not MEEM-only)
- [x] MEEM logistics page — OCR/AI feature cards + shipment pipeline (`/meem-global/logistics`)
- [x] MEEM `/meem-global/workflows` — step count, module tags, logistics links for OCR/AI
- [x] Finance v1 — model + page (replace shell) — **E4**
- [x] Reports v1 — ERP KPI strip on `/[tenant]/reports` — **E6**
- [x] `tenant-ops-seed.service` + industry pack (refactor `meem-ops-catalog`) — **E2, E7**
- [x] De-MEEM-gate sales/inventory/warehouse pages — **E3**
- [x] MEEM `sales` + `finance` on blueprint + tenant modules — **E8**
- [x] Procurement v1 — `TenantPurchaseRequest` + `/[tenant]/procurement` (module-gated) — **E9**

---

## Phase 6 — CyberCrow dept console

**Goal:** NCA-aware tenant CyberCrow + auditor read-only story; **logistics tenants** see ops events (OCR/anomaly/dispatch) in audit trail.

**ERP plan:** [`ERP_ROADMAP.md`](ERP_ROADMAP.md) § Phase 6 — shipment/OCR ↔ `cybercrowAuditLog`, tenant audit filters.

**Exit criteria**

- [x] Platform admin audit feed — `/admin/audit` (CyberCrow cross-tenant log + notification log + summary strip)
- [x] Platform admin overview — `/admin/overview` cross-tenant CyberCrow posture strip (events, incidents, controls, logistics audit)
- [x] Compliance / GRC — `/[tenant]/cybercrow/grc` NCA ECC labels + evidence preview (2–3 rows per control)
- [x] Auditor read-only UI — `auditor_readonly` nav + banner + tenant CyberCrow audit paths
- [x] Entra ops narrative on settings + login + CyberCrow identity (`/help/entra-sso` → `docs/ENTRA_SSO.md`)
- [x] Logistics workflow events → tenant CyberCrow audit (MEEM dispatch/OCR) — **E10**
- [x] Dashboard risk card from real incident / security-event counts (not static mock)
- [x] M4 rehearsal — [`M4_CYBERCROW_REHEARSAL.md`](M4_CYBERCROW_REHEARSAL.md) + `npm run rehearsal:m4`

---

## Phase 7 — SAREA dept (MEEM customer)

**Goal:** `/sarea/*` studio + blueprint SAREA tab + runtime on tenant dashboard; **ERP nav group** per enabled modules and persona. **Muhanad** implements platform hooks; **MEEM (Omar)** validates personas and nav for MEEM Global.

**ERP plan:** [`ERP_ROADMAP.md`](ERP_ROADMAP.md) § Cross-module UX — **E11**: MEEM validates executive/ops/frontline ERP nav keys; Muhanad exposes keys in registry/runtime.

**Exit criteria**

- [ ] Studio routes polished per PAGE_DESIGNS (Muhanad)
- [ ] `/sarea/preview` complete (Muhanad)
- [ ] MEEM personas from discovery on blueprint SAREA tab (Muhanad seeds; Omar accepts)
- [ ] SAREA navigation profiles include ERP chain keys when modules enabled — **E11** (Muhanad config; MEEM acceptance)
- [ ] Executive dashboard: finance/reports widgets when modules on — MEEM (Omar) acceptance on Muhanad data

---

## Phase 7b — Unified identity & client portal

**Goal:** One Microsoft identity — client portal → tenant promotion.

**Exit criteria**

- [x] `client` role + `/portal/requests`
- [x] Entra + email-linked requests
- [x] Staff promote client → tenant
- [ ] E2E checklist with live Entra + Postgres

---

## Phase 8 — Auth & roles

**Goal:** Auditor read-only, dept on requests, route guards. **Note:** `auditor_readonly` + CyberCrow read-only UI shipped in Phase 6 (M4); remaining items are production hardening (M6).

**Exit criteria**

- [x] `auditor_readonly` crow_role + CyberCrow read-only policy (tenant + `/admin/audit`)
- [ ] Dept chips from DB on all request surfaces
- [x] `AUTH_DISABLED` blocked when `NODE_ENV=production` — [`M6_AUTH_SAAS.md`](M6_AUTH_SAAS.md)

---

## Phase 9 — Postgres & demo hardening

**Goal:** Repeatable live demo without mock flags.

**Exit criteria**

- [ ] `GET /api/health` → `db: "ok"`
- [~] `npm run smoke:phase1` on clean DB — script + optional `SMOKE_CHECK_HEALTH=1`; CI run open
- [ ] MEEM path without `USE_MOCK_DATA`
- [x] `prisma migrate` baseline — ordered folder + `migrate deploy` in [`M6_AUTH_SAAS.md`](M6_AUTH_SAAS.md)

---

## Phase 10 — Go-live marketing

**Goal:** Public launch surfaces + notifications.

**Exit criteria**

- [ ] Marketing copy on `/about`, `/clients`, `/industries`
- [x] Client portal for request tracking
- [ ] Stripe from approved proposal
- [ ] Pipeline notification emails via Resend — production-ready send (logging + audit UI done; `skipped` OK in dev)

---

## Phase Cloud — Vercel, Supabase, Entra production

**Goal:** Production deployment ready for first paying customer.

### Infrastructure checklist

| Item | Status |
|------|--------|
| Vercel project + `NEXT_PUBLIC_SITE_URL` | [~] `vercel.json` + M7 doc |
| Supabase production Postgres (`DATABASE_URL` pooler + `DIRECT_URL`) | [ ] |
| `npx prisma migrate deploy` in CI/CD | [x] CI `postgres-smoke` + Vercel buildCommand |
| Supabase Auth production keys (anon + service role server-only) | [ ] |
| Entra app registration — prod redirect URIs | [ ] |
| `AZURE_SSO_ENABLED=true` on production | [ ] |
| Secrets: Stripe, **Resend** (`RESEND_API_KEY`, `NOTIFICATION_FROM_EMAIL`) — Vercel env; required for real email send | [ ] |
| `AUTH_DISABLED` unset / false in production | [ ] |
| Health + smoke in deploy pipeline | [ ] |

**Docs:** [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md), [`ENTRA_SSO.md`](ENTRA_SSO.md), [`DEV_WITHOUT_DB.md`](DEV_WITHOUT_DB.md) § production.

---

## Milestones (M1–M8)

See [`MILESTONES.md`](MILESTONES.md) for the executive map. Summary:

| Milestone | % | Owner |
|-----------|---|--------|
| M1 Platform foundation | 100% | Muhanad |
| M2 MEEM lighthouse + RBAC | ~88% | Muhanad · MEEM E2E sign-off |
| M3 Modular ERP (E1–E9) | ~92% | Muhanad |
| M4 CyberCrow ops (E10 + dashboard/GRC/auditor) | 100% | Muhanad |
| M5 MEEM SAREA acceptance | ~25% | MEEM (Omar) |
| M6 Auth & SaaS prep | ~65% | Muhanad |
| M7 Cloud & production | ~20% | [`M7_CLOUD_DEPLOY.md`](M7_CLOUD_DEPLOY.md) |
| M8 Paid / full MEEM ERP | deferred | Product |

---

## Current sprint recommendation

| Priority | Action | Milestone |
|----------|--------|-----------|
| 1 | MEEM E2E — [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md) **after** M6/M7 polish | M2 |
| 2 | `smoke:phase1` on clean Postgres + CI | M6 |
| 3 | M4 done — [`M4_CYBERCROW_REHEARSAL.md`](M4_CYBERCROW_REHEARSAL.md) | M4 |
| 4 | Hand off SAREA persona checklist to MEEM (Omar) | M5 |
| 5 | Phase Cloud env matrix when go-live date set | M7 |

**Env this sprint:** `AUTH_DISABLED=false`, `USE_MOCK_DATA=false` (live Postgres + Supabase Auth). Verification: typecheck, build, seeds, `verify-logistics-audit`.

---

## Cross-references

| Topic | Document |
|-------|----------|
| Milestones M1–M8 | [`MILESTONES.md`](MILESTONES.md) |
| Progress % | [`PROJECT_STATUS.md`](PROJECT_STATUS.md) |
| Engineering baseline | [`BASELINE.md`](BASELINE.md) |
| MEEM demo | [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) |
| CEM ERP roadmap | [`ERP_ROADMAP.md`](ERP_ROADMAP.md) |
| Go-live pipeline | [`GO_LIVE_PIPELINE.md`](GO_LIVE_PIPELINE.md) |
| RBAC matrix | [`RBAC.md`](RBAC.md) |
| MEEM Phase 4 E2E | [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md) |
| M4 CyberCrow rehearsal | [`M4_CYBERCROW_REHEARSAL.md`](M4_CYBERCROW_REHEARSAL.md) |
| M6 Auth & SaaS prep | [`M6_AUTH_SAAS.md`](M6_AUTH_SAAS.md) |
| Team ownership | [`TEAM_OWNERSHIP.md`](TEAM_OWNERSHIP.md) |
| Omar SAREA scope | [`SAREA_OMAR_SCOPE.md`](SAREA_OMAR_SCOPE.md) |
| Built routes | [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md) |
| Identity & portal | [`IDENTITY_AND_PORTALS.md`](IDENTITY_AND_PORTALS.md) |
| Source layout | [`../src/STRUCTURE.md`](../src/STRUCTURE.md) |

---

*Update checkboxes as work completes. Restructure + MEEM lighthouse: May 2026.*
