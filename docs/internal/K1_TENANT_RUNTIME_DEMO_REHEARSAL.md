# K1 — Tenant Runtime / CEM Demo Rehearsal

**Date:** 29 May 2026  
**Scope:** Demo rehearsal, route audit, light UX polish, playbooks — **no** module feature sprint, migrations, payments, or auto-provisioning.

**Prerequisites:** L3 public + client portal UX · G2–G10 module depth · G10 runtime cohesion

---

## Part 1 — Tenant runtime route audit

### Demo-ready (strong)

| Route | Assessment |
|-------|------------|
| `/[tenant]/dashboard` | **Strong** — cohesion panel, next actions, CyberCrow connection, CEM ops, cross-links |
| `/[tenant]/modules` | **Strong** — operational grid, cohesion section, stat strip |
| `/[tenant]/tasks` | **Strong on MEEM** — mock task samples + approval readiness panel |
| `/[tenant]/workflows` | **Strong on MEEM** — discovery-derived workflow catalog |
| `/[tenant]/reports` | **Strong on MEEM** — KPIs + BI readiness panel + Meem hub |
| `/[tenant]/hr` | **Strong** — workforce readiness panel, employees |
| `/[tenant]/finance` | **Strong** — finance operations readiness hub |
| `/[tenant]/logistics` | **Strong (MEEM)** — lighthouse logistics depth |
| `/[tenant]/procurement` | **Good** — readiness hub + supply chain links |
| `/[tenant]/cybercrow/*` | **Strong** — trust cockpit surfaces (G10/F21 depth) |
| `/sarea/*` | **Strong** — studio overview, role mapping, preview |

### Adequate (show with honesty)

| Route | Assessment |
|-------|------------|
| `/[tenant]/departments` | **Good** — structure + HR linkage banners |
| `/[tenant]/roles` | **Good** — RBAC definitions |
| `/[tenant]/users` | **Good** — profiles + role assignment |
| `/[tenant]/inventory` | **Adequate** — G6 readiness hub |
| `/[tenant]/warehouse` | **Adequate** — G6 readiness hub |
| `/[tenant]/crm` | **Thin** — show as module hub; skip in 10-min if rushed |
| `/[tenant]/sales` | **Thin** — linked to CRM story |
| `/[tenant]/branches` | **Supporting** — skip unless structure deep-dive |
| `/[tenant]/settings` | **Skip demo** — plan advisory only; no checkout |

### Clutter / skip in demo

- Multiple SAREA preview banners on dashboard (staff only — explain once)  
- Blueprint link on dashboard (operator bridge — optional)  
- `/settings/plan` — billing posture; risks “live subscription” misread  

### Recommended 10-minute path

`meem-global` → dashboard → modules → departments → tasks → workflows → reports → hr → finance → procurement or logistics → cybercrow/dashboard → sarea/overview → dashboard (cohesion close).

### Strongest modules for demo

1. **HR** — workforce + org linkage  
2. **Finance** — cross-module advisory  
3. **Logistics** — MEEM lighthouse  
4. **Procurement** — supply chain bridge  

### Thinnest (skip or one sentence)

CRM, Sales (unless commercial story required), branches-only tour.

---

## Part 2 — Demo story

> After ProCrow prepares the tenant, the company operates inside **Tenant Runtime / CEM**. The runtime gives departments, users, workflows, tasks, reports, and modules one operational home. **CyberCrow** supervises trust posture; **SAREA** shapes role-based experience. **RBAC controls access; SAREA controls experience.**

Constants: `src/lib/constants/tenant-runtime-demo.ts`

---

## Part 3 — Dashboard result

- Badge: **Tenant Runtime / CEM**  
- `TenantRuntimeDemoHint` beat `dashboard`  
- `TENANT_RUNTIME_PROCROW_NOTE` in hero  
- Existing cohesion, next actions, cross-links retained  

---

## Part 4 — Modules result

- `TenantRuntimePageHeader` + `TenantRuntimeCohesionNote`  
- Copy: ProCrow prepared, CEM operates  

---

## Part 5 — Org structure result

- Departments, roles, users: `TenantRuntimePageHeader` beat `structure`  
- Clear tenant-runtime framing (not ProCrow admin)  

---

## Part 6 — Tasks / workflows result

- `TenantRuntimePageHeader` beat `coordination`  
- Existing approval readiness panels unchanged  
- No automation claims added  

---

## Part 7 — Reports result

- `TenantRuntimeDemoHint` beat `visibility`  
- Description emphasizes advisory BI / visibility layer  

---

## Part 8 — Core module readiness

| Module | Readiness | Demo show | Skip |
|--------|-----------|-----------|------|
| HR | High | Readiness panel, employees, org banner | Deep edit forms |
| Finance | High | Readiness hub, cross-links | Live ledger if empty |
| CRM | Medium | Hub card from modules | Full page if thin |
| Sales | Medium | As CRM adjunct | Standalone tour |
| Procurement | High | Readiness + links | — |
| Inventory | Medium | G6 hub | Empty lists |
| Warehouse | Medium | G6 hub | Empty lists |
| Logistics | High (MEEM) | Dispatch/readiness | — |

---

## Part 9 — CyberCrow / SAREA linkage

- Dashboard: `CybercrowConnectionPanel`, cohesion trust chain  
- Layout hub links: CEM · CyberCrow · SAREA  
- Demo: `/[tenant]/cybercrow/dashboard` + `/sarea/overview`  
- Safe language: advisory, not SIEM/certification  

---

## Part 10 — Playbook

[`K1_TENANT_RUNTIME_DEMO_REHEARSAL_PLAYBOOK.md`](K1_TENANT_RUNTIME_DEMO_REHEARSAL_PLAYBOOK.md) — 10-minute timed script.

---

## Part 11 — Screenshot checklist

[`K1_TENANT_RUNTIME_SCREENSHOT_CHECKLIST.md`](K1_TENANT_RUNTIME_SCREENSHOT_CHECKLIST.md)

---

## Part 12 — Runbook

[`TENANT_RUNTIME_DEMO_RUNBOOK.md`](TENANT_RUNTIME_DEMO_RUNBOOK.md)

---

## Part 13 — Light UI components

| Component | Path |
|-----------|------|
| Constants | `src/lib/constants/tenant-runtime-demo.ts` |
| Demo hint | `src/components/tenant/tenant-runtime-demo-hint.tsx` |
| Page header wrapper | `src/components/tenant/tenant-runtime-page-header.tsx` |
| Cohesion note | `src/components/tenant/tenant-runtime-cohesion-note.tsx` |

Reused: `RuntimeCohesionPanel`, `TenantRuntimeCrossLinks`, `TenantRuntimeNextActions`, module readiness panels (G-series).

---

## Part 14 — Verification

- `scripts/verify-tenant-runtime-demo.ts`  
- `npm run tenant-demo:verify`  

---

## Part 15 — Validation

Run: `mock:verify`, `typecheck`, `lint`, `build`, `public:mirror-manifest`, `runtime:verify`, `erp:verify`, `product-ux:verify`, `procrow:verify`, `procrow-workbench:verify`, `tenant-demo:verify`.

---

## Remaining gaps

- CRM/Sales pages not K1-polished (adequate via G4 hubs)  
- No screenshots captured in K1 (checklist only)  
- `rimal-construction` mock ops thinner than MEEM  
- Request form / public story — use H1/J8 bookends  

---

## Recommended next phase

| Option | Description |
|--------|-------------|
| **A** | Pause after K1 — demo docs sufficient |
| **B** | **L4** — Tenant Runtime / CEM Usability Pass (deeper UX) |
| **C** | **K2** — Manual browser smoke checklist |

---

## K1 decision

**PASSED** when validation batch is green and artifacts above are committed.
