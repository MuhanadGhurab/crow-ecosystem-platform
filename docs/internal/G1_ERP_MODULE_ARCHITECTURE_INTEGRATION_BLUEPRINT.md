# G1 — ERP Module Architecture & Integration Blueprint

**Date:** 26 May 2026  
**Constraint:** No paid infrastructure, production launch, live payments, external APIs, or schema changes. Advisory intelligence only — not autonomous AI, compliance certification, or live automation.

**Code anchors:** `src/lib/constants/erp-module-catalog.ts` · `erp-module-integration-map.ts` · `erp-sector-module-matrix.ts` · `erp-module-maturity.ts` · `erp-module-ux-standard.ts`

**Verify:** `npm run erp:verify`

---

## 1. ERP module audit

### Live ERP routes (`erp-module-registry`)

| ERP key | CEM key | Route | UI maturity | Data source | Notes |
|---------|---------|-------|-------------|-------------|-------|
| sales | sales | `/[tenant]/sales` | Workflow-linked | `sales.service` | Hub on MEEM; chain links |
| inventory | inventory | `/[tenant]/inventory` | Workflow-linked | `inventory.service` | Industry packs |
| warehouse | warehouse | `/[tenant]/warehouse` | Workflow-linked | `warehouse.service` | |
| logistics | logistics | `/[tenant]/logistics` | **Fully integrated (MEEM)** | logistics + MEEM ops | Strongest; sector-critical |
| finance | finance | `/[tenant]/finance` | Workflow-linked | `finance.service` | Not full GL |
| procurement | procurement | `/[tenant]/procurement` | Workflow-linked | `procurement.service` | |
| hr | hr | `/[tenant]/hr` | Operational list | `hr.service` | Strong forms |
| crm | crm | `/[tenant]/crm` | Operational list | `crm.service` | Strong forms |
| tasks | approvals | `/[tenant]/tasks` | Workflow-linked | `tasks.service` | F26 cross-links |
| reports | bi | `/[tenant]/reports` | Evidence/report-linked | `reports.service` | Lightweight BI |

### Platform foundation routes

| Key | Route | Maturity | Role |
|-----|-------|----------|------|
| workflows | `/[tenant]/workflows` | Workflow-linked | Process templates → tasks |
| departments | `/[tenant]/departments` | Operational list | Org tree |
| roles | `/[tenant]/roles` | Operational list | RBAC |
| users | `/[tenant]/users` | Operational list | Directory |
| branches | `/[tenant]/branches` | Operational list | Sites |
| modules | `/[tenant]/modules` | Readiness grid | Enablement map |
| dashboard | `/[tenant]/dashboard` | Operational list | Command center |
| settings | `/[tenant]/settings` | Readiness | Plan (no live billing) |

### Catalog-only CEM keys (no tenant route)

| Key | Status |
|-----|--------|
| iam | CyberCrow identity link from modules grid |
| projects | Use tasks/workflows until route exists |
| documents | Evidence via CyberCrow advisory |

### Audit summary

| Category | Modules |
|----------|---------|
| **Strongest** | logistics (MEEM), hr, crm, tasks, workflows |
| **Solid workflow-linked** | sales, inventory, warehouse, finance, procurement, reports |
| **Thin but functional** | branches, settings |
| **Placeholder / catalog** | iam, projects, documents |
| **Sector-critical** | logistics, warehouse, inventory (logistics); sales, inventory (retail); procurement (construction) |
| **Unclear links** | bi → reports route (documented in registry); logistics on non-logistics tenants (advisory on modules page) |

### Deepen first (recommended G2–G4)

1. **HR** — org anchor for RBAC/SAREA  
2. **Finance** — AR/ledger depth without payment rails  
3. **CRM + Sales** — single commercial thread  
4. **Procurement** — spend intake before inventory posting  

---

## 2. Module definition standard

Each entry in `ERP_MODULE_CATALOG` includes:

- Purpose, owned data, workflows, approvals, reports  
- CyberCrow risks, evidence, audit events  
- SAREA experience hints (RBAC ≠ SAREA)  
- Sector relevance tiers  
- Dependencies, maturity, data source, future depth  
- `futureOnlyCapabilities` when not live  

`tenantModulePurpose()` prefers catalog `shortDescription` for module grid copy.

---

## 3. Cross-module integration map

**Supply chain chain:** sales → inventory → warehouse → logistics → finance → procurement (see `ERP_SUPPLY_CHAIN_CHAIN`).

**Hubs:** tasks (approvals), reports (BI), workflows, CyberCrow (advisory suite).

**Edges:** `ERP_MODULE_INTEGRATION_EDGES` in `erp-module-integration-map.ts`.

---

## 4. Module maturity model

| Level | ID | Meaning |
|-------|-----|---------|
| 1 | concept_placeholder | Catalog only |
| 2 | readiness_page | Purpose / enablement |
| 3 | operational_list | Lists or CRUD |
| 4 | workflow_linked | Workflows + tasks + chain |
| 5 | evidence_report_linked | Reports / CyberCrow hooks |
| 6 | fully_integrated_runtime | MEEM-grade hubs + ops intel |

Do not mark modules level 6 unless reference-tenant evidence exists (today: **logistics on MEEM**).

---

## 5. Module UX standard

Target sections (`ERP_MODULE_UX_STANDARD_SECTIONS`): header, purpose, stats, workflows, tasks, departments/roles, CyberCrow trust, SAREA note, reports KPI, empty states, next actions.

**Not required on every page in G1** — standard only; incremental adoption in G2+.

---

## 6. Sector-to-module matrix

`ERP_SECTOR_MODULE_MATRIX` aligns `primary` keys with `*_RECOMMENDED_ERP_MODULE_KEYS` in `sector-template-data.ts` for all five modeled sectors.

Foundation routes (all sectors): workflows, tasks, reports, departments, roles, users.

---

## 7. CyberCrow / SAREA integration standard

See `ERP_TRUST_EXPERIENCE_STANDARD` in `erp-module-ux-standard.ts`.

- **CyberCrow:** advisory audit, evidence, risk — not certified compliance or autonomous remediation.  
- **SAREA:** rule-based density and navigation — access controlled by RBAC/roles.  
- Per-module: `cyberCrowRisks`, `evidenceExamples`, `sareaExperienceHints` on every catalog row.

---

## 8. Verification

```bash
npm run erp:verify
```

Checks: live ERP keys ↔ catalog, sector matrix drift, forbidden marketing phrases, CyberCrow/SAREA fields, catalog-only flags.

---

## 9. Validation (G1 sign-off)

Run with portfolio suite:

```bash
npm run erp:verify
npm run mock:verify
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
npm run sector:verify
```

Optional sector scripts: `logistics:verify`, `retail:verify`, etc.

---

## 10. G-series roadmap (recommended)

| Phase | Focus |
|-------|--------|
| **G2** | HR module depth |
| **G3** | Finance module depth |
| **G4** | CRM + Sales module depth |
| **G5** | Procurement module depth |
| **G6** | Inventory + Warehouse module depth |
| **G7** | Logistics module runtime depth |
| **G8** | Tasks / Approvals engine depth |
| **G9** | Reports / BI readiness layer |
| **G10** | Cross-module intelligence & runtime cohesion |

---

## Acceptance

| # | Criterion | Status |
|---|-----------|--------|
| 1 | ERP module audit documented | Yes — §1 |
| 2 | Module definition standard | Yes — `erp-module-catalog.ts` |
| 3 | Integration map | Yes — `erp-module-integration-map.ts` |
| 4 | Maturity model | Yes — `erp-module-maturity.ts` |
| 5 | UX standard | Yes — `erp-module-ux-standard.ts` |
| 6 | Sector-module matrix | Yes — `erp-sector-module-matrix.ts` |
| 7 | CyberCrow/SAREA standard | Yes — `ERP_TRUST_EXPERIENCE_STANDARD` |
| 8 | Verifier | Yes — `erp:verify` |
| 9 | Validation commands | Green — see below |
| 10 | No forbidden scope | Constants + docs only |

### Validation run (26 May 2026)

| Command | Result |
|---------|--------|
| `npm run erp:verify` | PASSED |
| `npm run mock:verify` | PASSED |
| `npm run typecheck` | PASSED |
| `npm run lint` | PASSED |
| `npm run build` | PASSED |
| `npm run public:mirror-manifest` | PASSED |
| `npm run sector:verify` | PASSED |

**G1 decision:** **PASSED**
