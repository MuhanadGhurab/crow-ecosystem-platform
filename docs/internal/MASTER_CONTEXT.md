# CYBERCROW — Master context document (share with GPT)

> **Location:** `docs/internal/MASTER_CONTEXT.md` — internal only, not for public GitHub.

**Purpose:** One file with everything an external AI (ChatGPT, etc.) needs to understand **CYBERCROW / Crow Ecosystem**, **Muhanad’s role**, the **MEEM Holding CEO presentation**, and how this project fits a **personal life vision**.  
**Last updated:** May 2026  
**Repo:** `d:\CYBERCROW` (Next.js 15, Prisma, PostgreSQL, Supabase Auth, Microsoft Entra)

---

## How to use this with GPT

Paste this entire document into a new GPT chat and say something like:

> “This is my master context for Crow Ecosystem / CYBERCROW. Help me with [presentations / strategy / copy / career / MEEM follow-up / Azure planning]. Muhanad is the builder; MEEM is the lighthouse customer.”

GPT should treat **facts in this doc as canonical** unless you correct them. For live IDs after re-seed, run `npm run meem:ids` in the repo.

---

## 1. Who is Muhanad (you) — role & job

**Muhanad** is the **primary architect and full-stack owner** of the Crow Ecosystem Platform in this repository. This is not a side experiment; it is the core professional build toward a **sovereign Saudi/GCC enterprise operating platform**.

| Area | Ownership |
|------|-----------|
| Overall platform architecture | ● |
| Prisma schema & PostgreSQL (~74 models) | ● |
| APIs, server actions, services | ● |
| Discovery Engine | ● |
| Enterprise Blueprint Engine + commercial pricing | ● |
| **CEM** runtime (tenant ops, ERP modules, HR/CRM, workflows) | ● |
| **CyberCrow** security orchestration, NCA framing, audit/GRC | ● |
| Provisioning pipeline & go-live lifecycle | ● |
| Platform admin (`/admin/*`), client portal, Entra integration | ● |
| Infrastructure direction (local Postgres, Supabase Auth, Azure target, Vercel optional) | ● |
| MEEM lighthouse demo (seed, E2E, logistics + AI story) | ● |

**Crow departments (how Muhanad organizes delivery):**

- **CyberCrow department** — Muhanad’s security/cyber delivery lane at Crow (NCA-aligned, Microsoft Entra, tenant posture, auditor paths).
- **Platform / pipeline** — Muhanad drives Request → Discovery → Blueprint → Go-live.
- **CEM CyberAdmin** — After go-live on flagship tenant `meem-global`, Muhanad operates as tenant admin for demos and customer success.

**Not Muhanad’s dev scope:** **Omar** works **inside MEEM Holding** as customer-side **SAREA experience liaison** (persona/layout acceptance). Omar is not a CYBERCROW repo engineer.

---

## 2. Personal vision & life direction (for GPT coaching)

Use this section so GPT understands *why* the product exists, not only *what* it does.

### North star

Turn **Crow Ecosystem** from a built platform into a **life-defining venture**: an enterprise-grade product company where Muhanad owns the **technical and product truth** end-to-end — architecture, security narrative, commercial pipeline, and lighthouse customer proof (MEEM).

### What “success” looks like (personal + professional)

1. **Proof** — MEEM Holding CEO and leadership see a credible **live demo**: blueprint → provision → `meem-global` tenant with logistics, workflows, CyberCrow, and SAREA story (not slides only).
2. **Revenue path** — Commercial package (~24k SAR/mo excl. VAT band for 50–250 employees) is transparent in blueprint pricing; proposal and go-live are governed, not ad hoc.
3. **Sovereignty** — Saudi/GCC customer data and identity story (Microsoft Entra, NCA-aware CyberCrow) without depending on foreign ERP lock-in for the *operating model*.
4. **Sustainable build** — **Local-first finish** before cloud spend: Postgres + seeds + E2E + Resend on laptop; **Azure when the product earned it**, not before.
5. **Team leverage** — Omar (MEEM) validates SAREA personas; Muhanad ships runtime. Future: Hasheer and others on SAREA studio; auditors and Microsoft ops on CyberCrow roles.

### Principles Muhanad already follows

- **Discovery understands → Blueprint defines → CEM runs → CyberCrow protects → SAREA adapts** (golden rule).
- **Don’t rush cloud spend before the product earns it** — Vercel/Azure are wiring later, not a rebuild.
- **One Microsoft identity** from client portal through tenant operations (Entra SSO story).
- **Honest demo** — Mock surfaces labeled; live Postgres path is the executive truth.

### GPT can help with

- CEO/board follow-up emails and workshop agendas for MEEM  
- Positioning vs Odoo/Zoho in Saudi logistics  
- Career narrative (platform architect → founder/CTO path)  
- Azure cutover checklists when Muhanad says “go cloud”  
- SAREA/Omar acceptance scripts without blurring customer vs Crow engineering  

---

## 3. What is CYBERCROW / Crow Ecosystem?

**Brand:** Crow Ecosystem Platform  
**Tagline:** *Where Organizations Become Intelligent.*  

**One-sentence definition:**  
An adaptive enterprise orchestration ecosystem spanning implementation requests, discovery, blueprint, pricing, provisioning, security, adaptive experience, and governed go-live.

**What it is NOT:** A single-module ERP clone or “AI-first chatbot app.” It is a **B2B implementation factory** that produces a **live multi-tenant workspace** with three engines on one slug.

**Repository name:** `CYBERCROW` (folder) — product brand **Crow Ecosystem**; security engine brand **CyberCrow**.

---

## 4. Three engines (customer-facing architecture)

Customers see **three engines** and **one delivery pipeline** — not internal 10-layer technical diagrams.

| Engine | Customer promise | Color |
|--------|------------------|-------|
| **CEM** (Crow Enterprise Manager) | Runs the organization — HR, CRM, finance, logistics, inventory, warehouse, workflows | Cyan / teal |
| **CyberCrow** | Protects the organization — NCA-aware security, compliance, audit, identity (Microsoft Entra) | Violet |
| **SAREA** | Adapts the experience — role-appropriate dashboards and navigation per persona | Rose |

**Customer pipeline (one sentence):**  
Submit a **Request** → Crow runs **Discovery** and builds your **Blueprint** (transparent pricing) → you approve the **Proposal** → **Go-live** activates CEM, CyberCrow, and SAREA on your tenant (`/{slug}/...`).

---

## 5. System heart — commercial + technical flow

```text
Customer                    Crow delivery                    After go-live
────────                    ─────────────                    ─────────────
/request          →    /discovery/{id}/*          →    /{slug}/dashboard (CEM)
                       /blueprints/{id}/*              /{slug}/cybercrow/*
                       /proposal/{token}               SAREA on dashboard
                       /go-live
```

| Step | Label | Primary actor | Artifact |
|------|-------|---------------|----------|
| 1 | Request | Customer sponsor | `ImplementationRequest` |
| 2 | Discovery | Crow implementer | Discovery profile, modules, security, Entra, experience |
| 3 | Blueprint + pricing | Crow commercial | `EnterpriseBlueprint`, SAR estimate |
| 4 | Proposal | Client approves | `proposalToken`, status |
| 5 | Go-live | Crow provision | Tenant org, CEM seed → CyberCrow → SAREA |
| 6 | Operations | Tenant users + CyberAdmin | ERP modules, workflows, tasks |
| 7 | Ongoing | Security + experience | CyberCrow console, SAREA runtime |

---

## 6. Application areas (7 surfaces in the app)

1. **Public** — `/`, `/about`, `/modules`, `/architecture`, `/security`, `/pricing`, `/request`, `/clients`, `/industries`, `/case-studies`, `/loyalty-programs`
2. **Crow Admin** — `/admin/*` (requests, discovery queue, blueprints, tenants, audit)
3. **Discovery workspace** — `/discovery/[requestId]/*`
4. **Enterprise Blueprint** — `/blueprints/[blueprintId]/*` (overview, pricing, CEM, CyberCrow, SAREA, identity, integrations, readiness, go-live)
5. **CEM tenant** — `/[tenant]/*` (dashboard, logistics, sales, inventory, warehouse, HR, CRM, …)
6. **CyberCrow console** — `/[tenant]/cybercrow/*`
7. **SAREA studio** — `/sarea/*` (platform); runtime on tenant dashboard

**Client portal:** `/portal/requests` — same Microsoft identity can track request before tenant promotion.

---

## 7. Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (CyberCrow brand tokens, entity themes) |
| Database | PostgreSQL — local `crow_ecosystem` and/or Supabase pooler |
| ORM | Prisma (~74 models) |
| Auth | Supabase Auth + Microsoft Entra SSO |
| Email | Resend (pipeline notifications) |
| Target production cloud | **Azure primary** (App Service + Postgres + Entra prod URLs) |
| Optional interim | Vercel + Supabase (guarded; no localhost DB on Vercel build) |

**Hybrid dev (Option B):** Local Postgres for organizational memory; Supabase project for Auth (`qnujbwfztmrmsvkugvot` in dev).

---

## 8. Lighthouse customer — MEEM Holding Logistics / MEEM Global

**Why MEEM:** First enterprise proof for Saudi logistics — CEO presentation and commercial credibility.

| Field | Value |
|-------|--------|
| Legal / display | MEEM Holding Logistics (MEEM Global) |
| Industry | Logistics & fulfillment |
| Employees | 50–250 |
| Plan | Enterprise |
| Modules | Sales, logistics, warehouse, inventory, finance, CRM, HR |
| Security | Crow Sentinel + Crow Fortress |
| AI extras (positioning) | Route optimization, demand forecast, anomaly detection, **OCR document intelligence** |
| Tenant slug | `meem-global` |
| Reference code | `CROW-2026-MEEM` |
| Primary contact (demo) | Faisal Al-Meem · `faisal@meem-logistics.demo` |

### Commercial indicative (MEEM band)

| | SAR |
|--|-----|
| Monthly **excl. VAT** | **~23,956** |
| VAT 15% | ~3,593 |
| Monthly **incl. VAT** | **~27,549** |

Package includes **CEM + CyberCrow + SAREA + AI extras** — band-priced, not per-seat multiplication like Odoo/Zoho at same headcount (positioning: typically 20–40% below comparable stack with security uplift — illustrative, not legal quote).

### Live demo IDs (Postgres seeded)

| Artifact | ID |
|----------|-----|
| Implementation request | `cmpge193x0000vhws8nclouoi` |
| Blueprint | `cmpge196o0015vhws2r7akekx` |
| Tenant slug | `meem-global` |

### Mock demo IDs (UI-only, no DB)

| Artifact | ID |
|----------|-----|
| Request | `mock-req-meem` |
| Blueprint | `mock-bp-meem` |
| Proposal token | `mock-proposal-meem` |

**Launch mock demo:** `npm run demo:meem` → opens MEEM admin request.

---

## 9. MEEM Holding CEO / executive presentation

This is the narrative Muhanad used (or should use) for **CEO-level demo** — structured as acts, ~20–45 minutes with live app on `localhost:3000` or deployed URL.

### Opening (2 min) — the promise

> “MEEM does not buy three disconnected products. You get **one intelligent organization** on one tenant: **CEM** runs logistics and operations, **CyberCrow** protects with NCA-aligned security and Microsoft identity, **SAREA** gives each role the right dashboard — hub manager, dispatcher, executive — without fragmenting the platform. Crow delivers that through a **governed path**: request, discovery, blueprint with transparent Saudi pricing, approval, then go-live.”

### Act 1 — Commercial seriousness (5 min)

**Show:** `/admin/requests` → MEEM Holding Logistics row.

**Highlight:**

- Enterprise plan selected  
- Lifecycle status and department chips (CyberCrow + SAREA delivery)  
- **~23,956 SAR/month excl. VAT** visible on request detail (~27,549 incl. VAT)  
- Link to blueprint — this is a **priced deal**, not a prototype  

**CEO line:** “You see the commercial truth before go-live — no surprise scope.”

### Act 2 — Discovery discipline (optional, 5 min)

**Show:** `/discovery/{requestId}/organization` → modules → security → identity (**Entra ID**) → experience (AI extras).

**Highlight:**

- Logistics module stack confirmed  
- Security packages and NCA framing  
- AI extras: OCR, route optimization, anomaly detection — **optional line items**, not vaporware  

**CEO line:** “We captured your operating model before we configured the tenant.”

### Act 3 — Blueprint & proposal (5 min)

**Show:** `/blueprints/{blueprintId}/overview` and `/pricing`.

**Highlight:**

- Line items: modules, security, SAREA, AI  
- Readiness checklist — grouped gates before go-live  
- Client proposal `/proposal/{token}` if showing sponsor view  

**CEO line:** “Blueprint is your digital DNA and commercial control room.”

### Act 4 — Go-live → live CEM tenant (10 min) — **hero act**

**Show:** `/blueprints/{blueprintId}/go-live` → **Already live** → `/meem-global/dashboard`.

**Highlight:**

- Real tenant slug `meem-global`  
- Dashboard: load/risk hints, open tasks, **≥4 workflows**, SAREA persona  
- **Logistics:** `/meem-global/logistics` — OCR/AI feature cards, shipment pipeline  
- **ERP chain:** sales → inventory → warehouse (linked ops seed)  
- **Workflows:** `/meem-global/workflows` — OCR capture, dispatch approval, etc.  

**CEO line:** “This is your operating home — not a slide. Logistics-first for MEEM.”

### Act 5 — CyberCrow trust (5 min)

**Show:** `/meem-global/cybercrow/dashboard` → audit logs (logistics filter).

**Highlight:**

- `CYBERCROW_INITIALIZED` in platform audit  
- Security events and compliance narrative  
- **One Microsoft identity** from portal to tenant (`/meem-global/cybercrow/identity`, `/help/entra-sso`)  
- Auditor role: read-only CyberCrow, no silent CEM writes  

**CEO line:** “Security is visible and governed — aligned to Saudi expectations, not bolted on later.”

### Act 6 — SAREA + people (5 min) — Omar’s lane

**Show:** `/meem-global/dashboard` as **executive vs frontline** user (different layout/nav if seeded).

**Highlight:**

- Hub Manager / Dispatcher roles from discovery (logistics permissions)  
- SAREA adapts UI; **Omar (MEEM)** validates persona fit — Crow ships runtime  

**CEO line:** “Your teams see what they need — executives see risk and KPIs, dispatchers see lanes and tasks.”

### Act 7 — Notifications & governance (2 min)

**Show:** `/admin/audit` — pipeline events: `request_received`, `discovery_started`, `blueprint_ready`, `tenant_provisioned` with status **`sent`** (Resend configured).

**CEO line:** “Every milestone is logged and emailable — audit trail for enterprise buyers.”

### Closing — three talking points (memorize)

1. **One Microsoft identity** from client portal through tenant operations.  
2. **Three engines on one slug:** CEM operations, CyberCrow protection, SAREA adaptive experience.  
3. **Logistics-first** with AI as **commercial extras** (OCR, routing, anomalies) — integrated, not a separate AI product.

### What to avoid in CEO room

- Deep 10-layer internal architecture diagrams  
- Promising full SAP replacement day one  
- Hiding mock/demo data — label demo metrics on CyberCrow if not live Entra session store  
- Claiming cloud production URL if still local — say “production path ready; go-live environment when MEEM approves timing”

---

## 10. Roles & permissions (demo matrix)

| Role | How to test | Expect |
|------|-------------|--------|
| Platform admin | Supabase `crow_role=platform_admin` | Full admin, go-live, audit |
| Sales | `AUTH_DEV_ROLE=sales` | Requests/blueprint read; no go-live |
| Implementer | `implementer` | Pipeline like admin |
| Client | `AUTH_DEV_ROLE=client` | `/portal/requests/{id}` |
| Tenant user | `tenant_user` + `meem-global` | Logistics yes; admin users denied |
| Auditor | `auditor_readonly` + `meem-global` | CyberCrow read-only; platform audit |
| Hub Manager / Dispatcher | MEEM ops seed | Logistics workflows |

---

## 11. Current status (May 2026) — honest snapshot

| Metric | ~% | Notes |
|--------|-----|-------|
| UI + demo readiness | **80%** | Strong MEEM path, consistent pages |
| Production-ready (overall) | **55%** | Azure, M5 SAREA sign-off, some ERP depth open |
| CEM tenant runtime (Phase 5) | **88%** | E1–E9 on MEEM |
| CyberCrow ops (M4) | **100%** | Rehearsal doc exists |
| MEEM live E2E | **Done** (Muhanad signed off in session) | Resend emails received |
| Cloud (M7) | **Deferred** | Intentionally — product earned local proof first |

### What works today

- Full pipeline UI with product process guide on admin request  
- Live MEEM seed: `npm run db:seed:meem` + `db:seed:meem:ops`  
- `npm run typecheck` + `npm run build` green  
- Resend notifications with override inbox for demo  
- Modular ERP chain on MEEM (logistics, sales, inventory, warehouse, workflows, tasks)  
- Client portal + Entra dev path  

### Not required for “stop and celebrate” but still open

- Omar M5 SAREA persona acceptance (customer-side)  
- M4 CyberCrow rehearsal formal sign-off  
- `smoke:phase1` + CI green on pushed `main`  
- Azure production (Postgres + App Service + Entra prod redirect)  
- Second paying customer (M8 SaaS)  
- Stripe billing  

---

## 12. Commands cheat sheet

```bash
# Dev
cd D:\CYBERCROW
npm run dev                    # http://localhost:3000

# Real data
npm run db:seed
npm run db:seed:meem
npm run db:seed:meem:ops

# Env for real demo
AUTH_DISABLED=false
USE_MOCK_DATA=false

# UI-only MEEM
AUTH_DISABLED=true
USE_MOCK_DATA=true
npm run demo:meem

# Verify
npm run typecheck
npm run build
npm run test:resend
npm run smoke:phase1
npm run meem:ids
```

---

## 13. Key routes (localhost:3000)

| Purpose | URL |
|---------|-----|
| Admin MEEM request (live) | `/admin/requests/cmpge193x0000vhws8nclouoi` |
| Blueprint pricing (live) | `/blueprints/cmpge196o0015vhws2r7akekx/pricing` |
| Go-live (live) | `/blueprints/cmpge196o0015vhws2r7akekx/go-live` |
| MEEM dashboard | `/meem-global/dashboard` |
| MEEM logistics | `/meem-global/logistics` |
| MEEM CyberCrow | `/meem-global/cybercrow/dashboard` |
| Platform audit | `/admin/audit?category=logistics&tenant=meem-global` |
| Public request | `/request` |
| Admin queue (mock) | `/admin/requests/mock-req-meem` |

---

## 14. Milestones map (M1–M8)

| ID | Name | Owner | Status |
|----|------|-------|--------|
| M1 | Platform foundation | Muhanad | Done |
| M2 | MEEM lighthouse pipeline | Muhanad | ~88–95% (E2E done) |
| M3 | Modular ERP E1–E9 | Muhanad | ~92% |
| M4 | CyberCrow operations | Muhanad | Done |
| M5 | MEEM SAREA acceptance | **Omar (MEEM)** | ~25% |
| M6 | Auth & SaaS prep | Muhanad | ~65% |
| M7 | Cloud & production | Muhanad | ~45% (deferred) |
| M8 | Paid / second customer | Muhanad | ~35% |

---

## 15. Competitive positioning (short)

- **vs Odoo / Zoho:** Band-based SAR bundle with security + adaptive UI included; discovery → blueprint → single total; not per-user multiplication at 150+ employees.  
- **vs custom dev:** Governed provision pipeline and three engines pre-integrated.  
- **Saudi fit:** NCA-aware CyberCrow, SAR pricing with VAT policy, GCC logistics lighthouse (MEEM).

---

## 16. Related docs in repo (deeper dives)

| Doc | Topic |
|-----|--------|
| `docs/customers/MEEM_GLOBAL.md` | Full MEEM demo script & checklist |
| `docs/PHASE4_MEEM_E2E.md` | 20-min live rehearsal |
| `docs/TEAM_OWNERSHIP.md` | Muhanad vs Omar |
| `docs/PRODUCT_NARRATIVE.md` | Customer vs internal copy |
| `docs/CORE_PRODUCT_FLOW.md` | Pipeline heart |
| `docs/PRICING.md` | SAR catalog |
| `docs/FINISH_PLATFORM.md` | Local-first gates |
| `docs/AZURE_DEPLOY.md` | When cloud is chosen |
| `docs/PROJECT_STATUS.md` | Percentages |

---

## 17. Glossary

| Term | Meaning |
|------|---------|
| **Request** | Customer implementation intake (`/request`) |
| **Discovery** | Crow learns org truth (`/discovery/...`) |
| **Blueprint** | Digital DNA + pricing (`/blueprints/...`) |
| **Proposal** | Client approval token (`/proposal/...`) |
| **Go-live** | Provision tenant (`/go-live`) |
| **CEM** | Crow Enterprise Manager — tenant operations |
| **CyberCrow** | Security engine on tenant |
| **SAREA** | Adaptive experience engine |
| **CyberAdmin** | Tenant admin role (Muhanad on demos) |
| **Lighthouse** | MEEM — reference customer |

---

*End of master context — share as-is with GPT. Update MEEM IDs after re-seed; update status when M7/M8 progress.*
