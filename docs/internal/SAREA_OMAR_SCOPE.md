# SAREA — MEEM customer liaison scope (Omar)

**Role:** Omar — **MEEM Holding**, SAREA experience owner for **MEEM Global** (customer-side).  
**Not:** Crow engineer, CYBERCROW repo implementer, or owner of Prisma / provision / CyberCrow delivery.

**Crow platform owner:** Muhanad seeds personas, layouts, and rules at go-live; ships SAREA runtime and `/sarea/*` studio in this repo. Omar **validates** MEEM-facing experience against discovery and workshop briefs.

**Milestone:** **M5 — MEEM SAREA acceptance** (~25%) — see [`MILESTONES.md`](MILESTONES.md). Not blocking M2 E2E or M3 ERP demo.

**Routes Omar reviews (no code ownership):** `/sarea/*` (studio preview), `/{tenant}/dashboard` (runtime), blueprint **SAREA** tab.

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

| Surface | Omar acceptance |
|---------|-----------------|
| `/sarea/profiles` | MEEM personas match workshop names |
| `/sarea/layouts` | Dashboard grid matches exec vs frontline brief |
| `/sarea/role-mapping` | CEM role slugs → experience profile makes sense for MEEM |
| `/sarea/widgets` | Widget visibility per profile |
| `/sarea/navigation` | Nav keys appropriate for logistics tenant |
| `/sarea/preview` | Demo-ready before customer walkthrough |

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

1. Review MEEM discovery **experience** step and blueprint **SAREA** tab.  
2. With Muhanad, open `/sarea/role-mapping` — confirm `tenant-admin` → executive, `manager` → manager, `employee` → frontline.  
3. On `http://localhost:3000/meem-global/dashboard`, compare exec vs frontline (test users or `AUTH_DEV_ROLE` where applicable).  
4. Sign off logistics KPI visibility on executive dashboard (widgets/layout — Crow may adjust from feedback).  
5. Mobile check for frontline persona (compact nav).

---

## Handoff

| Muhanad (Crow repo) | Omar (MEEM) |
|---------------------|-------------|
| Live tenant slug, seeded `sareaExperienceProfile` rows | Persona naming and density approval |
| CEM roles, departments, CyberCrow baseline data | Whether nav/widgets match MEEM operations |
| `/sarea/*` studio + runtime config | Customer demo sign-off (Phase 7 / E11) |

---

*See [`TEAM_OWNERSHIP.md`](TEAM_OWNERSHIP.md) and [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) Phase 4 / Phase 7 validation.*
