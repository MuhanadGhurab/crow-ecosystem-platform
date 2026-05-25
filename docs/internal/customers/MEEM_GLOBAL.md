# MEEM Holding Logistics / MEEM Global — lighthouse demo

**Profile:** Saudi logistics group, **50–250 employees**, multi-hub operations.  
**Narrative:** Blueprint → provision → live **CEM tenant** with **CyberCrow** (NCA-aligned) and **SAREA** (role-adaptive UI).  
**Identity:** Microsoft Entra ID SSO (discovery + tenant settings + `/meem-global/cybercrow/identity` + `/help/entra-sso`).

> **Phase 4 E2E (local):** Passed May 2026 — real login + Postgres (P1). Staging repeat: [`P2_STAGING_PREP.md`](../P2_STAGING_PREP.md).

### SAREA — Crow ships, MEEM validates

| Layer | Owner | Deliverable |
|-------|--------|-------------|
| Runtime & studio | **Muhanad** (Crow repo) | `/sarea/*`, blueprint SAREA tab, `sarea-runtime.service`, seeded personas at go-live |
| Persona acceptance | **MEEM (Omar)** | Validates executive / ops / logistics / frontline layouts on `/meem-global/dashboard` — not CYBERCROW implementation |
| CyberCrow | **Muhanad** | `/meem-global/cybercrow/*` data-backed dashboard, audit logs, GRC summary; platform `/admin/audit` for auditors |

**ERP plan (all tenants):** Modular CEM ERP chain (E1–E9 **done** on MEEM), blueprint-driven ops seed — see **[`ERP_ROADMAP.md`](../ERP_ROADMAP.md)** · milestones **[`MILESTONES.md`](../MILESTONES.md)** (M3 demo, M4 CyberCrow ~82%, M5 Omar SAREA acceptance).

---

## Company snapshot

| Field | Value |
|-------|--------|
| Legal / display | MEEM Holding Logistics (MEEM Global) |
| Industry | Logistics & fulfillment |
| Employee band | 50–250 |
| Plan | Enterprise |
| Modules | Sales, logistics, warehouse, inventory, finance, CRM, HR |
| Security | Crow Sentinel + Crow Fortress |
| AI extras (positioning) | Route optimization, demand forecast, anomaly detection, **OCR document intelligence** |
| **Indicative monthly (excl. VAT)** | **~23,956 SAR** (band 50–250, ×1.05 complexity) |
| **VAT 15%** | **~3,593.40 SAR** |
| **Indicative monthly (incl. VAT)** | **~27,549.40 SAR** |

---

## Live IDs (`USE_MOCK_DATA=false`, local Postgres)

| Artifact | ID / slug |
|----------|-----------|
| Implementation request | `cmpge193x0000vhws8nclouoi` |
| Blueprint | `cmpge196o0015vhws2r7akekx` |
| Tenant slug | `meem-global` |
| Reference code | `CROW-2026-MEEM` |
| Primary contact | Faisal Al-Meem · **faisal@meem-logistics.demo** |

**URLs (localhost:3000):**

| Step | URL |
|------|-----|
| Admin request | `/admin/requests/cmpge193x0000vhws8nclouoi` |
| Discovery (read-only at go-live) | `/discovery/cmpge193x0000vhws8nclouoi/organization` |
| Blueprint overview | `/blueprints/cmpge196o0015vhws2r7akekx/overview` |
| Blueprint pricing | `/blueprints/cmpge196o0015vhws2r7akekx/pricing` |
| Tenant dashboard | `/meem-global/dashboard` |
| Tenant logistics | `/meem-global/logistics` |
| Tenant sales | `/meem-global/sales` |
| Tenant inventory | `/meem-global/inventory` |
| Tenant warehouse | `/meem-global/warehouse` |
| Tenant finance | `/meem-global/finance` |
| Tenant workflows | `/meem-global/workflows` |
| Tenant tasks | `/meem-global/tasks` |
| CyberCrow console | `/meem-global/cybercrow/dashboard` |
| CyberCrow audit (logistics filter) | `/meem-global/cybercrow/audit-logs?category=logistics` |
| CyberCrow security events (logistics) | `/meem-global/cybercrow/security-events?logistics=1` |
| Blueprint readiness | `/blueprints/cmpge196o0015vhws2r7akekx/readiness` |
| Blueprint go-live | `/blueprints/cmpge196o0015vhws2r7akekx/go-live` |
| Admin audit & notifications | `/admin/audit` |
| Admin MEEM logistics audit | `/admin/audit?category=logistics&tenant=meem-global` |

Re-seed: `npx tsx --env-file=.env prisma/seed-meem.ts` (idempotent).  
Operational enrich (workflows + steps, OCR/AI discovery, HR/CRM samples, **logistics CyberCrow audit samples**): `npm run db:seed:meem:ops`.

---

## Mock IDs (`USE_MOCK_DATA=true`)

| Artifact | ID / slug |
|----------|-----------|
| Implementation request (blueprint stage) | `mock-req-meem` |
| Discovery-only request | `mock-req-meem-discovery` |
| Blueprint | `mock-bp-meem` |
| Proposal token | `mock-proposal-meem` |
| Live tenant slug | `meem-global` |

Code: [`src/lib/mock/meem-global.ts`](../../src/lib/mock/meem-global.ts)

---

## Demo walkthrough (UI-only)

**Env:** `AUTH_DISABLED=true`, `USE_MOCK_DATA=true` — see [`BASELINE.md`](../BASELINE.md) § A.

**Launch:** `npm run demo:meem` or `DEMO_CUSTOMER=meem npm run demo` (opens MEEM queue).

### Act 1 — Commercial queue

1. `/admin/requests` — **MEEM Holding Logistics** (`mock-req-meem`), enterprise plan, **~23,956 SAR/mo excl. VAT** (~27,549 incl. VAT; CEM + CyberCrow + SAREA + AI; see [`PRICING.md`](../PRICING.md)).
2. `/admin/requests/mock-req-meem` — lifecycle, dept chips, pricing estimate, links to blueprint.

### Act 2 — Discovery (optional branch)

3. `/discovery/mock-req-meem-discovery/organization` → modules (logistics stack) → security → identity (**Entra ID**) → experience (AI extras) → **summary** → handoff to blueprint pricing.

### Act 3 — Blueprint & proposal

4. `/blueprints/mock-bp-meem/overview` — pricing rail (logistics modules + security + SAREA).
5. `/blueprints/mock-bp-meem/pricing` — full commercial workspace.
6. `/proposal/mock-proposal-meem` — client-facing proposal (approved state in mock).

### Act 4 — Go-live → CEM tenant

7. `/blueprints/mock-bp-meem/go-live` — provision narrative (live DB required for real provision).
8. `/blueprints/mock-bp-meem/readiness` — checklist.
9. **`/meem-global/dashboard`** — live CEM tenant (mock org when DB paused).
10. `/meem-global/logistics` — logistics module shell.
11. `/meem-global/sales` — freight quotes, B2B deals, pipeline SAR (ops seed).
12. `/meem-global/inventory` — pallets, cold-chain, fleet spares, packaging (ops seed).
13. `/meem-global/warehouse` — Riyadh DC, Jeddah cold room, inbound/outbound lanes (ops seed).
14. `/meem-global/cybercrow/dashboard` — security posture story.

### Act 5 — Client portal (Microsoft identity)

15. `AUTH_DEV_ROLE=client` + `/portal/requests/mock-req-meem` — sponsor tracks request (same Entra account promotes to tenant user per [`IDENTITY_AND_PORTALS.md`](../IDENTITY_AND_PORTALS.md)).

---

## OCR & AI requirements (logistics)

| Capability | AI extra key | CEM workflow | Surface |
|------------|--------------|--------------|---------|
| OCR document capture (POD/BOL) | `doc_intelligence` | OCR document capture | `/meem-global/logistics`, `/meem-global/workflows` |
| AI route optimization | `route_optimization` | AI route optimization | Logistics hub + dispatch approval |
| Demand forecast | `demand_forecast` | — (inventory signals) | Logistics feature card |
| Shipment anomaly detection | `anomaly_detection` | Shipment dispatch approval | CyberCrow + logistics pipeline |

Discovery `experience.aiExtras` and blueprint pricing include all four keys after `db:seed:meem:ops`. Tenant workflows are real `Workflow` + `WorkflowStep` rows (not placeholders).

**Owner:** Muhanad (seed/ops, logistics page, CyberCrow runtime). **MEEM (Omar)** validates SAREA widgets referencing fleet KPIs later (customer acceptance — not Crow repo implementation).

---

## Audit & notifications baseline

Captured after MEEM seed / go-live rehearsal (`USE_MOCK_DATA=false`, local Postgres). Pipeline events are **always logged** to `platformNotification`; `/admin/audit` lists them. For **`sent`** (not `skipped`), configure Resend — [`RESEND_SETUP.md`](../RESEND_SETUP.md).

**Notification target:** `faisal@meem-logistics.demo` (seed contact). Optional platform copy: `PLATFORM_NOTIFY_EMAIL` on `request_received` only.

| Subject (logged) | Event | Recipient | Status (dev) |
|------------------|-------|-----------|--------------|
| Tenant live — /meem-global | `tenant_provisioned` | faisal@meem-logistics.demo | skipped — `RESEND_API_KEY not configured` |
| Blueprint ready — MEEM Holding Logistics | `blueprint_ready` | faisal@meem-logistics.demo | skipped |
| Discovery started — CROW-2026-MEEM | `discovery_started` | faisal@meem-logistics.demo | skipped |
| Request received — CROW-2026-MEEM | `request_received` | faisal@meem-logistics.demo | skipped |

**Demo recipient:** seed contact `faisal@meem-logistics.demo` is not deliverable. Set `PIPELINE_NOTIFY_EMAIL_OVERRIDE=your@email.com` in `.env` so Resend reaches your inbox while audit rows keep the demo address.

**Platform finish (M2–M3):** configure `RESEND_API_KEY` and run `npm run test:resend` before E2E step 12.

**CyberCrow audit log (platform admin):**

| Action | Tenant | Slug |
|--------|--------|------|
| `CYBERCROW_INITIALIZED` | MEEM Holding Logistics | `meem-global` |

**Enable real email:** set in `.env` — see [`RESEND_SETUP.md`](../RESEND_SETUP.md):

```env
RESEND_API_KEY=re_...
NOTIFICATION_FROM_EMAIL=Crow Ecosystem <onboarding@resend.dev>
PIPELINE_NOTIFY_EMAIL_OVERRIDE=you@yourcompany.com
# PLATFORM_NOTIFY_EMAIL=ops@yourcompany.com
```

Re-seed does not re-send notifications when tenant already exists; trigger new events via a fresh request or manual pipeline steps.

---

## Phase 4 — demo validation checklist

**Owners:** Muhanad (flows 1–3, 5–7, 11–12 platform + CyberCrow); **MEEM (Omar)** (flow 8 SAREA acceptance). See [`TEAM_OWNERSHIP.md`](../TEAM_OWNERSHIP.md), [`GO_LIVE_PIPELINE.md`](../GO_LIVE_PIPELINE.md).

**Env:** `USE_MOCK_DATA=false`, `AUTH_DISABLED=false`, local Postgres + Supabase login.

| # | Flow | Live URL (replace IDs if re-seeded) | Pass criteria | Code | Owner |
|---|------|-------------------------------------|---------------|------|-------|
| 1 | Request / admin queue | `/admin/requests/cmpge193x0000vhws8nclouoi` | MEEM row, lifecycle, dept chips, ~23,956 SAR/mo excl. VAT | [x] | Muhanad |
| 2 | Discovery (spot-check) | `/discovery/cmpge193x0000vhws8nclouoi/organization` | Read-only or editable per status; modules, security, Entra, experience saved | [x] | Muhanad |
| 3 | Blueprint + pricing | `/blueprints/cmpge196o0015vhws2r7akekx/pricing` | Estimate, SAREA line, logistics modules | [x] | Muhanad |
| 4 | Readiness (grouped) | `/blueprints/cmpge196o0015vhws2r7akekx/readiness` | All required groups green; tenant-live banner when seeded | [x] | Muhanad |
| 5 | Go-live / provision | `/blueprints/cmpge196o0015vhws2r7akekx/go-live` | **Already live** + dashboard link when tenant exists; provision form when not | [x] | Muhanad |
| 6 | Tenant dashboard | `/meem-global/dashboard` | Load/risk/OCR-AI hints, open tasks, **≥4 workflows**, SAREA persona | [x] | Muhanad |
| 7 | CyberCrow visibility | `/meem-global/cybercrow/dashboard` | `CYBERCROW_INITIALIZED` banner + posture when seeded | [x] | Muhanad |
| 8 | SAREA adaptation | `/meem-global/dashboard` (exec vs frontline user) | Layout/nav/widgets differ by persona | [x] platform · [ ] Omar sign-off | Muhanad ships · MEEM (Omar) validates — **[`OMAR_SIGNOFF_DISCOVERY_BLUEPRINT_SAREA.md`](OMAR_SIGNOFF_DISCOVERY_BLUEPRINT_SAREA.md)** |
| 9 | Logistics module | `/meem-global/logistics` | OCR/AI feature cards + shipment pipeline | [x] | Muhanad |
| — | Tenant sales | `/meem-global/sales` | Stat row + 5 freight/B2B lines; workflow + logistics links | [x] | Muhanad |
| — | Tenant inventory | `/meem-global/inventory` | Stat row + 6 SKUs; warehouse + logistics + sales links | [x] | Muhanad |
| — | Tenant warehouse | `/meem-global/warehouse` | Stat row + 5 zones/bins; inventory + logistics + workflow links | [x] | Muhanad |
| 11 | Tenant workflows | `/meem-global/workflows` | ≥4 workflows, step count, module tags, logistics link for OCR/AI | [x] | Muhanad |
| — | Tenant tasks | `/meem-global/tasks` | DB task list linked to workflows (ops seed) | [x] | Muhanad |
| 10 | Client portal (optional) | `/portal/requests/cmpge193x0000vhws8nclouoi` | `AUTH_DEV_ROLE=client` tracks request | [x] | Muhanad |
| 12 | Admin audit & notifications | `/admin/audit?category=logistics&tenant=meem-global` | ≥4 pipeline events; `CYBERCROW_INITIALIZED`; skipped Resend reason | [x] local P1 | Muhanad |

**Code [x]** = UI/routes implemented; **rehearse** = run once on live Postgres with seeded IDs.

**Mock path (`USE_MOCK_DATA=true`):** use `mock-req-meem`, `mock-bp-meem`, `/blueprints/mock-bp-meem/readiness` — provision requires live DB.

---

## URL quick reference (localhost:3000)

| Step | URL |
|------|-----|
| Admin queue entry | `/admin/requests/mock-req-meem` |
| Blueprint overview | `/blueprints/mock-bp-meem/overview` |
| Blueprint pricing | `/blueprints/mock-bp-meem/pricing` |
| Blueprint readiness | `/blueprints/mock-bp-meem/readiness` |
| Blueprint go-live | `/blueprints/mock-bp-meem/go-live` |
| Proposal | `/proposal/mock-proposal-meem` |
| Tenant dashboard | `/meem-global/dashboard` |
| Tenant logistics | `/meem-global/logistics` |
| Tenant sales | `/meem-global/sales` |
| Tenant inventory | `/meem-global/inventory` |
| Tenant warehouse | `/meem-global/warehouse` |
| Tenant tasks | `/meem-global/tasks` |
| Tenant workflows | `/meem-global/workflows` |
| CyberCrow | `/meem-global/cybercrow/dashboard` |

---

## Continue here (Muhanad — next 5 clicks)

**Env:** `USE_MOCK_DATA=false`, local Postgres, `npm run db:seed:meem` then `npm run db:seed:meem:ops`. Full script: [`PHASE4_MEEM_E2E.md`](../PHASE4_MEEM_E2E.md) (M2 sign-off — **deferred** until M4/M6/M7 polish).

1. **Live E2E** — *Postponed* — run PHASE4 script when platform milestones are complete.
2. **CyberCrow logistics audit** — [`/meem-global/cybercrow/audit-logs?category=logistics`](http://localhost:3000/meem-global/cybercrow/audit-logs?category=logistics) — E10 events after ops seed.
3. **Platform audit** — [`/admin/audit?category=logistics&tenant=meem-global`](http://localhost:3000/admin/audit?category=logistics&tenant=meem-global) — ≥4 notifications + `CYBERCROW_INITIALIZED` (`skipped` Resend OK).
4. **Auditor role** — `auditor_readonly` + `meem-global` — read-only banner on CyberCrow; no CEM writes.
5. **Hand off SAREA** — Share [`OMAR_SIGNOFF_DISCOVERY_BLUEPRINT_SAREA.md`](OMAR_SIGNOFF_DISCOVERY_BLUEPRINT_SAREA.md) with Omar (M5); scope context in [`SAREA_OMAR_SCOPE.md`](../SAREA_OMAR_SCOPE.md).

### RBAC rehearsal (Phase 4)

| Role | How to test locally | Expect |
|------|---------------------|--------|
| Platform admin | Supabase `crow_role=platform_admin` | Full admin + go-live + audit |
| Sales | `AUTH_DEV_ROLE=sales` (auth bypass only) | Requests/blueprint read; no audit or go-live |
| Implementation | `implementer` | Same as admin for pipeline |
| Client | `AUTH_DEV_ROLE=client` | `/portal/requests/{requestId}` |
| Tenant user | `tenant_user` + `AUTH_DEV_TENANT_SLUG=meem-global` | Logistics yes; `/meem-global/users` denied |
| Auditor | `auditor_readonly` + `tenant_slugs: [meem-global]` | `/admin/audit` + `/meem-global/cybercrow/*` (read-only banner; no CEM writes) |

See [`RBAC.md`](../RBAC.md) for the full matrix. Discovery roles **Hub Manager** / **Dispatcher** map to `hub-manager` / `dispatcher` slugs with logistics permissions after `db:seed:meem:ops`.

---

## Database seed (when Postgres live)

**Schema:** `npm run db:push` (or `npx prisma migrate deploy`) — includes `20260522150000_phase5_tenant_inventory` (`tenant_inventory_items`), `20260522160000_phase5_tenant_warehouse` (`tenant_warehouse_locations`).

```bash
npm run db:seed          # catalog
npm run db:seed:meem     # pipeline + tenant (idempotent)
npm run db:seed:meem:ops # workflows/steps, OCR/AI extras, branches, HR/CRM/sales/inventory/warehouse samples
```

Creates MEEM request → discovery → blueprint → tenant `meem-global` (requires Supabase Auth bootstrap for real users). Re-running `db:seed:meem` on an existing tenant also calls ops enrichment.

---

## Talking points for enterprise buyers

- **One Microsoft identity** from client portal through tenant operations.
- **Three engines** on one slug: CEM operations, CyberCrow protection, SAREA adaptive experience.
- **Logistics-first** module set with AI extras as optional commercial line items (not a separate product).
- **NCA ECC** framing on CyberCrow compliance and audit surfaces.
