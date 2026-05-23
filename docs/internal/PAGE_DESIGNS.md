# Crow Ecosystem — Page design briefs (wireframe level)

**Audience:** Design and engineering — layout zones, actors, components, data mode. **No React implementation** in this doc.

**Tokens:** [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) — `cc-glass-card`, `AreaShell`, entity colors (CEM cyan · CyberCrow violet · SAREA rose).

**Flow context:** [`CORE_PRODUCT_FLOW.md`](CORE_PRODUCT_FLOW.md)

**Legend — data mode**

| Tag | Meaning |
|-----|---------|
| **LIVE** | DB-backed today per `PLATFORM_STATUS.md` |
| **PARTIAL** | Some widgets live, some placeholder |
| **MOCK** | Static/demo content only |
| **GREENFIELD** | Not built; spec for next UI pass |

---

## Global patterns

### AreaShell layouts

| Shell | Used on | Sidebar tone |
|-------|---------|--------------|
| Public | `/`, `/request`, marketing | No sidebar; `PublicHeader` + starfield |
| Admin | `/admin/*` | Platform cobalt; Crow mark |
| Discovery | `/discovery/:id/*` | Request-scoped step nav |
| Blueprint | `/blueprints/:id/*` | Blueprint tabs + **pricing rail** (target) |
| SAREA Studio | `/sarea/*` | Rose-tinted `cc-entity-sarea` |
| Tenant | `/:slug/*` | Cyan default; CyberCrow subnav on `/cybercrow` |

### EntityHub (post-login)

**Component:** `entity-hub.tsx` — shown when ≥2 engine links apply.

| Context | Links | Active detection |
|---------|-------|------------------|
| Tenant workspace | CEM dashboard · CyberCrow dashboard · (optional) SAREA preview | Path prefix `/{slug}`, `/{slug}/cybercrow` |
| Blueprint | Overview · CEM tab · CyberCrow · SAREA | `/blueprints/:id/*` |
| Discovery | — (hide hub; use step wizard) | — |

**Behavior:** Pill switcher with entity dot + `cc-entity-hub-link--{entity}`; preserves slug/blueprint id in hrefs. Mobile: horizontal scroll chips (`cc-scroll-chips`).

---

## Public

### Homepage `/`

| Field | Spec |
|-------|------|
| **Purpose** | Position Crow as implementation platform; route to request |
| **Actor** | Anonymous visitor |
| **Layout** | Hero (north-star gradient) → engine **bento** (3 cards) → stats strip → CTA band |
| **Zones** | Hero: headline + dual CTA (`/request`, `/security`). Bento: `cc-engine-card--cem/cybercrow/sarea`. Stats: modules count, security package count (LIVE constants). Footer: public links |
| **Key components** | `PublicPageHeader`, engine cards, `cc-btn-primary` |
| **Entity colors** | Bento: cyan / violet / rose per card |
| **Data** | **PARTIAL** — stats from constants; case studies **MOCK** |

---

### Request wizard `/request`

| Field | Spec |
|-------|------|
| **Purpose** | Customer submits **Implementation Request** (step 1 of core flow) |
| **Actor** | Client sponsor / customer |
| **Layout** | Centered column (max ~720px); **stepper** top; one step per viewport height on mobile |
| **Zones** | Step 1: Org (name AR/EN, industry, employee band). Step 2: Plan tier cards. Step 3: Module chips (CEM). Step 4: Security tier cards (CyberCrow). Step 5: Contact + notes. Footer: submit + link to `/pricing` |
| **Key components** | Multi-step form, `cc-form-section`, tier cards, module toggles |
| **Entity colors** | Plan/modules: cyan accents; security step: violet border on selected package |
| **Data** | **LIVE** — `POST /api/implementation-requests`; tiers from `SUBSCRIPTION_TIERS`, modules `CEM_MODULES`, security `SECURITY_PACKAGES` |

**Wireframe (desktop)**

```
[ Stepper: Org | Plan | Modules | Security | Contact ]
┌─────────────────────────────────────┐
│ cc-glass-card                       │
│  (current step fields)              │
│           [ Back ]  [ Continue ]    │
└─────────────────────────────────────┘
```

---

### Pricing `/pricing` (marketing)

| Field | Spec |
|-------|------|
| **Purpose** | Catalog reference — **not** deal pricing (Blueprint owns deals) |
| **Actor** | Visitor |
| **Layout** | `PublicPageHeader` → 3-column tier grid → CTA to `/request` |
| **Data** | **LIVE** display, **MOCK** for deal-specific totals |

---

### Security `/security`

| Field | Spec |
|-------|------|
| **Purpose** | NCA-aware CyberCrow package storytelling |
| **Actor** | Visitor |
| **Layout** | Hero → package cards (Shield / Sentinel / Fortress) → link `/request` |
| **Entity color** | Violet throughout |
| **Data** | **LIVE** — `SECURITY_PACKAGES` |

---

## Pipeline (platform staff)

### Admin request list `/admin/requests`

| Field | Spec |
|-------|------|
| **Purpose** | Queue of implementation requests |
| **Actor** | You (product owner) / implementer |
| **Layout** | `AreaShell` → `PageHeader` → filter chips → `cc-list-card` rows |
| **Zones** | Table: ref code, org, status badge, plan, est. SAR (if set), assigned dept chips (**GREENFIELD**), actions |
| **Data** | **LIVE** |

---

### Request detail `/admin/requests/[id]`

| Field | Spec |
|-------|------|
| **Purpose** | Approve, reject, start discovery |
| **Actor** | Platform staff (CyberCrow dept often owns security columns) |
| **Layout** | 2-column: left meta + contacts; right action card + timeline |
| **Zones** | Header: org name + `RequestStatusBadge`. Bento: plan, modules, security pkgs, **estimated SAR** (from request). Actions: Approve · Start discovery · Reject. **GREENFIELD:** dept assignment (CyberCrow / SAREA) |
| **Entity colors** | Security block: violet tint |
| **Data** | **LIVE** |

---

### Discovery hub `/discovery/[requestId]/*`

| Field | Spec |
|-------|------|
| **Purpose** | Structured discovery → feeds blueprint pricing inputs |
| **Actor** | Implementer; Omar on **experience** step; you on **security** / identity |
| **Layout** | Left **step sidebar** (lg+); content `cc-glass-card`; bottom bar: Save · Next |
| **Steps** | organization → departments → branches → roles → workflows → modules → **security** (violet) → identity → integrations → **experience** (rose) → summary |
| **Key components** | Step nav, forms per step, `discovery-complete-button` on summary |
| **Data** | **LIVE** per step (see `PLATFORM_STATUS.md`) |

**Summary step wireframe**

```
┌──────────────────────────────────────────┐
│ Discovery complete checklist             │
│  ✓ Org  ✓ Modules  ✓ Security  ✓ SAREA  │
│                                          │
│  [ Complete discovery → Blueprint ]      │
│       (creates/updates EnterpriseBlueprint)│
└──────────────────────────────────────────┘
```

---

### Blueprint overview `/blueprints/[id]/overview`

| Field | Spec |
|-------|------|
| **Purpose** | **Pricing control room** + status + provision entry |
| **Actor** | Implementer (you); Omar consults on SAREA rows |
| **Layout** | **Target:** 60/40 split — left timeline/status; **right sticky pricing panel** (primary) |
| **Zones** | Left: blueprint + request status, module list, readiness link, provision form. **Right (hero):** Pricing panel — line items, total SAR, proposal status, send/link. Below: proposal history |
| **Key components** | `BlueprintProposalPanel` (enhance), `BlueprintProvisionForm`, readiness gate banner |
| **Entity colors** | Total: cyan; security lines: violet; SAREA lines: rose (**GREENFIELD**) |
| **Data** | **PARTIAL** — estimate **LIVE** via `getRequestPricingEstimate`; SAREA lines **GREENFIELD** |

**Wireframe (target desktop)**

```
┌────────────────────────────┬─────────────────────┐
│ Status · Modules · Links   │ PRICING PANEL       │
│                            │ Base plan      SAR  │
│ [ Readiness ] [ Go-live ]  │ Modules        SAR  │
│                            │ Security       SAR  │
│                            │ SAREA pkg      SAR  │
│                            │ ───────────────     │
│                            │ TOTAL   ★ SAR/mo  │
│                            │ [ Send proposal ] │
└────────────────────────────┴─────────────────────┘
```

---

### Blueprint pricing tab **GREENFIELD** `/blueprints/[id]/pricing`

| Field | Spec |
|-------|------|
| **Purpose** | Full-screen commercial workspace if overview is crowded |
| **Layout** | Editable line items table + scenario toggles (plan upgrade) + recalc + export PDF (**GREENFIELD**) |
| **Data** | **GREENFIELD** UI; backend uses existing `pricing.service.ts` |

---

### Blueprint engine tabs

| Route | Purpose | Actor | Entity tint | Data |
|-------|---------|-------|-------------|------|
| `/cem` | Modules, structure preview | Implementer | Cyan | **LIVE** |
| `/cybercrow` | Security package, baseline preview | CyberCrow dept | Violet | **LIVE** |
| `/sarea` | Personas, layout preview from discovery | Omar / SAREA dept | Rose | **LIVE** |
| `/readiness` | Go-live checklist | Implementer | Neutral | **LIVE** |
| `/go-live` | Provision CTA | Implementer | Cyan CTA | **LIVE** |

---

### Client portal `/portal/requests`

| Field | Spec |
|-------|------|
| **Purpose** | Signed-in customers track implementation requests linked by contact email |
| **Actor** | `client` role or Microsoft sign-in matching request contact email |
| **Layout** | Light public-adjacent shell (`portal/layout.tsx`); list + detail with lifecycle strip |
| **Zones** | List: org name, reference code, status badge, estimate. Detail: lifecycle strip, contact, commercial summary, proposal link when token exists |
| **Data** | **LIVE** — `listClientRequests()`; mock `mock-req-001` when `USE_MOCK_DATA=true` |

Sign-in CTA from `/request` confirmation → `/login?next=/portal/requests`. See [`IDENTITY_AND_PORTALS.md`](IDENTITY_AND_PORTALS.md).

---

### Proposal (client) `/proposal/[token]`

| Field | Spec |
|-------|------|
| **Purpose** | Client approves commercial package without Crow login |
| **Actor** | Customer sponsor |
| **Layout** | Narrow public column; no sidebar; Crow mark header |
| **Zones** | Hero: org name + total SAR. Body: plan, module list, security packages. Footer: Approve · Decline (`ProposalClientActions`) |
| **Entity colors** | Security section violet; total cyan |
| **Data** | **LIVE** — `getProposalByToken()` |

---

### Go-live `/blueprints/[id]/go-live`

| Field | Spec |
|-------|------|
| **Purpose** | Launch tenant into CEM; seed CyberCrow + SAREA |
| **Actor** | Implementer (you) |
| **Layout** | Single column; checklist link → provision form |
| **Zones** | Status badge → readiness link → slug preview → **Provision** button → post-success link to `/{slug}/dashboard` |
| **Data** | **LIVE** — `pipeline.service.ts` |

---

## Post-launch — CEM tenant

### Tenant dashboard `/{slug}/dashboard`

| Field | Spec |
|-------|------|
| **Purpose** | CEM home; **SAREA-adaptive** by persona |
| **Actor** | Tenant users; **you as CyberAdmin** post go-live |
| **Layout** | `AreaShell` + **EntityHub** (CEM · CyberCrow · SAREA). Bento stats → widget grid (density from persona) |
| **Zones** | Hero: welcome + persona badge (rose). Stats: open tasks, modules, alerts. Widgets: role-filtered (**LIVE** runtime) |
| **Entity color** | Cyan shell; hub shows all three engines |
| **Data** | **PARTIAL** — `sarea-runtime.service` **LIVE**; some widgets **MOCK** |

---

### CEM module pages `/{slug}/hr`, `crm`, `users`, …

| Field | Spec |
|-------|------|
| **Purpose** | Operational modules |
| **Actor** | Tenant admin / users |
| **Layout** | Standard `PageHeader` + list/table `cc-glass-card` |
| **Data** | HR/CRM/users **LIVE**; sales/inventory/etc. **MOCK** shell |

---

### Tenant settings `/{slug}/settings`

| Field | Spec |
|-------|------|
| **Purpose** | MFA/IdP from discovery; tenant config |
| **Actor** | CyberAdmin (`tenant_admin`) |
| **Data** | **PARTIAL** |

---

## Post-launch — CyberCrow dept console (tenant engine)

Routes under `/{slug}/cybercrow/*` — **violet** subnav (`cc-subnav-panel`).

### CyberCrow dashboard `/{slug}/cybercrow/dashboard`

| Field | Spec |
|-------|------|
| **Purpose** | Security posture summary for customer + your dept's runtime deliverable |
| **Actor** | Tenant admin, auditor, platform staff |
| **Layout** | EntityHub active on CyberCrow. Stat cards (incidents, compliance %, audit events) → recent events list |
| **Data** | **PARTIAL** — counts **LIVE**; some charts **MOCK** |

### Compliance / audit / GRC / evidence

| Field | Spec |
|-------|------|
| **Purpose** | NCA-aligned controls, evidence, audit trail |
| **Actor** | Auditor persona, CyberCrow dept support |
| **Layout** | Filter bar + `cc-table` + detail drawer |
| **Data** | Compliance/GRC/audit **LIVE**; evidence **PARTIAL** |

---

## SAREA studio (Omar dept) — platform routes

Base: `/sarea/*` — rose shell, platform staff only.

### SAREA overview `/sarea/overview`

| Field | Spec |
|-------|------|
| **Purpose** | Studio home — cross-tenant experience ops (not customer-facing) |
| **Actor** | Omar / SAREA dept |
| **Layout** | Stats bento (profiles, layouts, tenants with SAREA) → quick links grid |
| **Entity color** | Rose / amber |
| **Data** | **LIVE** studio metrics |

### Profiles `/sarea/profiles`

| Field | Spec |
|-------|------|
| **Purpose** | Manage persona profiles (executive / manager / frontline) |
| **Layout** | List + inline edit panels |
| **Data** | **LIVE** |

### Layouts, role-mapping, widgets, rules, navigation, device-rules, preview

| Route | Purpose | Layout pattern | Data |
|-------|---------|----------------|------|
| `/layouts` | Layout templates per persona | Card grid + editor | **LIVE** |
| `/role-mapping` | CEM role → persona | Table | **LIVE** |
| `/widgets` | Widget catalog | List + toggles | **LIVE** |
| `/rules` | Adaptation rules | List + inline edit | **LIVE** |
| `/navigation` | Nav density configs | Read-focused table | **LIVE** |
| `/device-rules` | Device breakpoints | Form sections | **LIVE** |
| `/preview` | Aggregate preview | Split preview pane | **PARTIAL** |

**Note:** Studio is **Crow SAREA department** tool. Tenant **runtime** adaptation happens on `/{slug}/dashboard` without visiting `/sarea`.

---

## Admin (platform owner)

### Admin overview `/admin/overview`

| Field | Spec |
|-------|------|
| **Purpose** | Platform identity; pipeline health |
| **Actor** | You (product owner) |
| **Layout** | Engine cards + pipeline counts (requests, discovery, blueprints, tenants) |
| **GREENFIELD** | Dept ownership chips on pipeline cards |

---

## Page inventory — existing vs greenfield

| Page | Route | UI status |
|------|-------|-----------|
| Homepage | `/` | **EXISTING** — enhance bento |
| Request wizard | `/request` | **EXISTING** |
| Request detail | `/admin/requests/[id]` | **EXISTING** — dept chips **GREENFIELD** |
| Discovery hub | `/discovery/:id/*` | **EXISTING** |
| Blueprint overview + pricing rail | `/blueprints/:id/overview` | **EXISTING** — pricing prominence **GREENFIELD** |
| Blueprint pricing tab | `/blueprints/:id/pricing` | **GREENFIELD** |
| Proposal client | `/proposal/:token` | **EXISTING** |
| Go-live | `/blueprints/:id/go-live` | **EXISTING** |
| CEM dashboard | `/:slug/dashboard` | **EXISTING** |
| CyberCrow console | `/:slug/cybercrow/*` | **PARTIAL** |
| SAREA studio | `/sarea/*` | **EXISTING** |
| EntityHub on tenant | header | **EXISTING** — ensure 3 links |

---

## Responsive notes (all pages)

| Breakpoint | Pattern |
|------------|---------|
| Mobile | Drawer nav; pricing panel **below** status on blueprint overview |
| Tablet | 2-column meta grids |
| Desktop | Sticky pricing rail; persistent sidebars |

Test routes: `npm run test:routes` after new paths are added.

---

## Customer narrative constraints

Public copy must follow **[`PRODUCT_NARRATIVE.md`](PRODUCT_NARRATIVE.md)** — not the ten-layer founder diagram.

| Rule | Applies to |
|------|------------|
| **Three engines only** on customer architecture — CEM · CyberCrow · SAREA | `/`, `/architecture`, `/about` hero sections |
| **Pipeline story:** Request → Discovery → Blueprint → Proposal → Go-live | `/architecture`, lifecycle strips, `/about` delivery section |
| **No 10-layer / 01–10 engine grid** on public pages | Homepage platform map removed; internal ref: `ARCHITECTURE_DIAGRAM.md` |
| **Talent profile chips** on module cards | `/modules` — from `module-talent-profiles.ts` |
| **AI & add-ons** = secondary band, not hero overload | `/`, `/modules` — `extra-services.ts` |
| **Stable module keys** in forms (`CEM_MODULES[].key`) — marketing names are display only | `/request`, discovery `modules` step |

When wireframing Phase 3 discovery or blueprint tabs, keep customer labels plain; bind data to catalog keys.
