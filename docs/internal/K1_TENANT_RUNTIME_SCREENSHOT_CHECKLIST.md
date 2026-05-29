# K1 — Tenant Runtime screenshot checklist

**Purpose:** Capture portfolio screenshots after a successful demo rehearsal. **Do not** generate images in K1 unless explicitly requested.

**Recommended tenant:** `meem-global` · **Viewport:** 1440×900 or 1280×800 · **Theme:** Default dark staging

---

## Required captures

| # | Route | Purpose | Ideal state | Do not show | Caption suggestion |
|---|-------|---------|-------------|-------------|-------------------|
| 1 | `/meem-global/dashboard` | Tenant command center | Cohesion panel + next actions visible | SAREA preview banner unless explaining preview | “Tenant Runtime dashboard — modules, cohesion, and next actions” |
| 2 | `/meem-global/modules` | Enabled modules grid | ≥4 module cards with readiness | Empty module list | “CEM modules enabled from blueprint” |
| 3 | `/meem-global/departments` | Org structure | Department list with counts | Error states | “Departments — structure foundation for workflows” |
| 4 | `/meem-global/tasks` | Coordination | Open tasks or readiness panel | Misleading “automation” copy cropped | “Tasks — cross-module coordination” |
| 5 | `/meem-global/workflows` | Workflow definitions | Active workflows (MEEM mock strong) | Empty with no fallback note | “Workflows — operator-guided templates” |
| 6 | `/meem-global/reports` | Visibility layer | KPI strip or BI readiness panel | Fake chart widgets if empty | “Reports — advisory roll-ups across modules” |
| 7 | `/meem-global/hr` | Workforce module | Readiness panel + employee list | PII beyond demo policy | “HR readiness hub” |
| 8 | `/meem-global/finance` | Finance module | Readiness hub + cross-links | “Pay now” or checkout UI | “Finance operations readiness” |
| 9 | `/meem-global/procurement` **or** `/logistics` | Supply chain | Strongest of the two for tenant | Thin empty hub only | “Procurement / Logistics — operational depth” |
| 10 | `/meem-global/inventory` **or** `/warehouse` | Stock ops | If data visible | Skip if empty | “Inventory / Warehouse readiness” |
| 11 | `/meem-global/cybercrow/dashboard` | Trust posture | Metrics or trust strip | Overclaim “certified” in crop | “CyberCrow — advisory trust layer on tenant” |
| 12 | `/sarea/overview` or `/role-mapping` | Experience | Studio overview or mapping table | Implying RBAC override | “SAREA — experience orchestration” |

---

## Optional captures

| Route | When useful |
|-------|-------------|
| `/meem-global/roles` | RBAC-focused audience |
| `/meem-global/users` | Identity / invite story |
| `/meem-global/cybercrow/evidence` | GRC-heavy audience |
| `/meem-global/crm` | Commercial module emphasis |

---

## Capture discipline

- Hide browser devtools and personal bookmarks.  
- Prefer **full page** above-the-fold plus one scroll for cohesion panel.  
- File naming: `k1-tenant-{slug}-{surface}.png` under `docs/public/screenshots/` when committed.  
- Re-run `npm run tenant-demo:verify` before publishing screenshots in README.
