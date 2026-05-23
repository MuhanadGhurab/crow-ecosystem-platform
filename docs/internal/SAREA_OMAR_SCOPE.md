# SAREA — MEEM customer liaison scope (Omar)

**Role:** Omar — **MEEM Holding**, **SAREA admin** for **MEEM Global** (and future tenants). Same integration pattern as **Muhanad (Crow)** as **CyberCrow admin** — both embedded inside each tenant slug, not separate apps.

| Admin | Engine | Primary tenant routes |
|-------|--------|------------------------|
| **Omar** | SAREA | `/{slug}/dashboard`, `/sarea/*`, blueprint SAREA tab, discovery experience |
| **Muhanad** | CyberCrow | `/{slug}/cybercrow/*`, platform `/admin/audit` |

**Lighthouse:** **MEEM Global** (`meem-global`) — first and largest customer; Omar’s sign-off here is the template for every tenant after.

**Crow platform owner:** Muhanad seeds personas, layouts, and rules at go-live; ships SAREA runtime and `/sarea/*` studio in this repo. Omar **validates and accepts** MEEM-facing SAREA against discovery and blueprint — admin parity with Muhanad’s CyberCrow acceptance on the same tenant.

**Milestone:** **M5 — MEEM SAREA acceptance** (~25%) — see [`MILESTONES.md`](MILESTONES.md). Not blocking M2 E2E or M3 ERP demo.

**Sign-off pack (share with Omar):** [`customers/OMAR_SIGNOFF_DISCOVERY_BLUEPRINT_SAREA.md`](customers/OMAR_SIGNOFF_DISCOVERY_BLUEPRINT_SAREA.md)

**Omar’s 5-step path:** discovery `/experience` → blueprint `/sarea` → `/sarea/preview` → three persona buttons → sign at bottom.

---

## What Omar validates (MEEM acceptance)

After Muhanad provisions **MEEM Global** (`meem-global`), Omar confirms **how each MEEM role should experience** CEM + CyberCrow surfaces — without changing provision order or schema.

| Experience | Persona / role | Primary surfaces | Omar validates |
|------------|----------------|------------------|----------------|
| **Executive** | `executive` | `/{slug}/dashboard`, reports nav | Layout density, KPI widgets, compliance chip placement |
| **Operations manager** | `manager` | Dashboard, workflows, logistics | Approval widgets, ops shortcuts |
| **HR** | `manager` / HR role | `/{slug}/hr`, dashboard widgets | HR-appropriate widget set, nav visibility |
| **Logistics** | domain roles on MEEM | `/{slug}/logistics`, dashboard | Logistics-first widget pack, module copy |
| **CyberCrow analyst** | security-facing roles | `/{slug}/cybercrow/*`, dashboard risk card | Read-only tone, audit emphasis (Crow ships data; Omar signs off UX) |
| **Frontline / mobile** | `frontline` | Dashboard, tasks | Compact nav, mobile-first |

Use discovery **experience** answers and blueprint **SAREA** tab as the brief; runtime resolution is `sarea-runtime.service.ts` (Muhanad maintains).

---

## Studio & runtime — acceptance checklist (not implementation tasks)

| Surface | Omar acceptance | Crow studio |
|---------|-----------------|-------------|
| `/sarea/profiles` | MEEM personas match workshop names | Rename display names |
| `/sarea/layouts` | Dashboard grid matches exec vs frontline brief | Edit layout name |
| `/sarea/role-mapping` | CEM role slugs → experience profile makes sense for MEEM | Edit role slug |
| `/sarea/widgets` | Widget visibility per profile (incl. CyberCrow posture) | Visibility select |
| `/sarea/navigation` | Nav keys appropriate for logistics tenant | Edit primary keys |
| `/sarea/rules` | Density level per persona | Edit spacious / comfortable / compact |
| `/sarea/device-rules` | Mobile compact mode for frontline | Edit device + compact |
| `/sarea/preview` | Demo-ready before customer walkthrough | Persona preview links |

**Crow implements** studio routes and runtime wiring; Omar **approves** MEEM demo behavior.

---

## Out of scope for Omar (and this repo assignment)

- `pipeline.service.ts`, go-live form, readiness gates  
- Discovery save/load, blueprint pricing engine  
- CyberCrow seed content, NCA control keys, `auditor_readonly` platform role  
- `/admin/*`, `/request`, Entra configuration  
- Phase 6 GRC bulk, Resend, Phase Cloud deploy  

---

## Suggested MEEM validation order

1. Review MEEM discovery **experience** step and blueprint **SAREA** tab (`/blueprints/{id}/sarea`).
2. Open `/sarea/profiles` — confirm **MEEM Group CIO view**, **Hub operations manager**, **Dispatcher mobile**.
3. Open `/sarea/role-mapping` — confirm `tenant-admin` → executive, `hub-manager` → manager, `dispatcher` → frontline.
4. Open `/sarea/widgets` — executive sees **Fleet KPIs** + **Reports**; frontline sees **POD mobile** only (no reports).
5. **Persona preview (platform staff):** `/sarea/preview` → **Preview executive / manager / frontline** — opens `/meem-global/dashboard` with cookie-driven SAREA runtime (nav + widgets + density).
6. **Full role simulation:** set `AUTH_DEV_ROLE=tenant_user` in `.env` and reload `/meem-global/dashboard` (frontline). Reset to platform role for exec view.
7. Mobile check for frontline persona (compact nav + smaller dashboard grid).

### Demo URLs (local)

| Surface | URL |
|---------|-----|
| Studio overview | `http://localhost:3000/sarea/overview` |
| Persona preview | `http://localhost:3000/sarea/preview` |
| MEEM dashboard | `http://localhost:3000/meem-global/dashboard` |
| Blueprint SAREA | `http://localhost:3000/blueprints/{MEEM_BLUEPRINT_ID}/sarea` |

**Upgrade existing MEEM tenant (after pull):** `npm run sarea:meem-upgrade`

---

## Handoff

| Muhanad (Crow repo) | Omar (MEEM) |
|---------------------|-------------|
| Live tenant slug, seeded `sareaExperienceProfile` rows | Persona naming and density approval |
| CEM roles, departments, CyberCrow baseline data | Whether nav/widgets match MEEM operations |
| `/sarea/*` studio + runtime config | Customer demo sign-off (Phase 7 / E11) |

---

*See [`TEAM_OWNERSHIP.md`](TEAM_OWNERSHIP.md) and [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) Phase 4 / Phase 7 validation.*
