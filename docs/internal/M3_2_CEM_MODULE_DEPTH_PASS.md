# M3.2 — CEM Module Depth Pass

**Date:** 5 Jun 2026  
**Mode:** Read-only derived module depth — staging/demo operational areas; production remains F23 / ProCrow Go/No-Go gated.

---

## Part 1 — Module audit (pre-M3.2)

| Module route | Pre-M3.2 state | Gap |
|--------------|----------------|-----|
| `/[tenant]/hr` | G2 workforce hub + M3.1 `TenantModuleOperatingContext` | Thin linkage to tasks/workflows/reports/CyberCrow/SAREA as one depth panel |
| `/[tenant]/finance` | G3 finance readiness hub + M3.1 context | No purchase-to-approval cross-module story on page |
| `/[tenant]/procurement` | G5 procurement hub + M3.1 context | PR entities not tied to finance/warehouse flow on page |
| `/[tenant]/inventory` | G6 inventory hub + M3.1 context | Stock/receiving links advisory only |
| `/[tenant]/warehouse` | G6 warehouse hub + M3.1 context | Dispatch/receiving not unified with logistics |
| `/[tenant]/logistics` | G7 logistics hub + M3.1 context | Shipment/dispatch depth scattered |
| `/[tenant]/crm` | G4 CRM hub + M3.1 context | Customer→sales pipeline not surfaced as depth |
| `/[tenant]/sales` | G4 sales hub + M3.1 context | Quote-to-cash dependencies not on one panel |
| `/[tenant]/reports` | G9 BI hub + M3.1 context | Not yet explicit summary layer for all modules + trust/experience |

**Shared finding:** Module readiness panels (G-series) were strong per domain; M3.1 added operating-model context; M3.2 adds **uniform depth sections** with records, flows, reports, trust/experience, and next actions.

**Remain future/deep ERP:** payroll, GL, live PO issuance, stock mutation engine, carrier TMS, payment activation, legal HR compliance, certified audit claims.

---

## Part 2 — Module depth contract

| Item | Path |
|------|------|
| Contract | `src/lib/cem/cem-module-depth-contract.ts` |
| Go/No-Go helper | `src/lib/cem/cem-module-depth-go-no-go.ts` |

**Types:** `CemModuleDepthStatus`, `CemModuleRecordType`, `CemModuleOperationalRecord`, `CemModuleDepthSnapshot`, disclaimers (`CEM_MODULE_DEPTH_DISCLAIMERS`).

---

## Part 3 — Module depth service

| Item | Path |
|------|------|
| Service | `src/lib/services/cem-module-depth.service.ts` |

**Exports:**

- `buildCemModuleDepthSnapshotForTenantId` / `ForTenantSlug`
- `buildCemModuleDepthSummaryForTenantId`

**Rules:** read-only derived; tenant-backed records when data exists; advisory/inferred when missing; connects to operating model, readiness snapshots, CyberCrow trust, SAREA mapping; **no DB mutation**, payments, or stock mutation.

---

## Part 4 — Shared components

| Component | Role |
|-----------|------|
| `cem-module-depth-header.tsx` | Purpose, status, disclaimers |
| `cem-module-records-panel.tsx` | Operational entities + source labels |
| `cem-module-flow-panel.tsx` | Workflows, tasks, **cross-module flows** |
| `cem-module-reporting-panel.tsx` | Report outputs |
| `cem-module-trust-experience-panel.tsx` | CyberCrow + SAREA hooks |
| `cem-module-next-actions.tsx` | Next actions, blockers, demo limits |
| `tenant-cem-module-depth-section.tsx` | Composes all six on tenant routes |

---

## Parts 5–11 — Module results

| Module | Depth story | Safe limits |
|--------|-------------|-------------|
| **HR** | Employees, onboarding reports, access-review hook, SAREA persona | No payroll/legal HRMS |
| **Finance** | Invoices/entries, approval warnings, procurement link, trust evidence | No payment activation |
| **Procurement** | Purchase requests, finance/warehouse handoff | No live PO/payments |
| **Inventory** | SKU items, stock visibility, procurement/sales links | No stock mutation |
| **Warehouse** | Locations/receipts, receiving/dispatch reports | Not full WMS |
| **Logistics** | Shipments/dispatch advisory, open logistics tasks | No TMS/GPS |
| **CRM** | Customer accounts, sales relationship, follow-up copy | Not full CRM suite |
| **Sales** | Opportunities, inventory/logistics/finance dependencies | No subscription activation |
| **Reports** | Module-fed KPIs, task/workflow, CyberCrow + SAREA roll-ups | Advisory BI only |

All nine routes render `TenantCemModuleDepthSection` after `TenantModuleOperatingContext`.

---

## Part 12 — Cross-module flow visibility

`cem-module-flow-panel.tsx` renders `crossModuleLinks` from M3.1 core flows (`employee-onboarding`, `purchase-to-stock`, `sales-to-delivery`, `task-workflow-execution`, `incident-exception`) filtered per module via `cem-module-depth.service.ts` → `crossLinksFromFlows`.

---

## Part 13 — ProCrow / Go-No-Go alignment

| Surface | Addition |
|---------|----------|
| `/admin/tenants/[tenantId]` | `AdminCemModuleDepthPanel` — per-module depth summary |
| `/admin/go-no-go` | `ProCrowCemModuleDepthGoNoGoPanel` + gate `cem-module-depth-m32` (`needs_review`) |
| `procrow-go-no-go.service.ts` | M3.2 dependency row; does **not** auto-pass Go/No-Go |

---

## Part 14 — Verification

```bash
npm run cem-module-depth:verify
```

Script: `scripts/verify-cem-module-depth.ts` — contract, service, components, nine module pages, ProCrow panels, forbidden overclaims.

Full suite (M3.2 acceptance): run with other M3/M2 verifiers + `typecheck`, `lint`, `build`, `public:mirror-manifest`.

---

## Remaining gaps

- Explicit task→workflow FK in UI (still inferred/advisory)
- Department/role ownership on individual records
- Report lineage table
- Transaction workflow prototype (PO receipt, stock move) — candidate **M3.3**
- Tenant membership / portal access hardening — candidate **M4**

---

## Recommended next phase

**M4 — Tenant Membership & Business Portal Access Hardening** (membership boundaries, portal role model)  
or  
**M3.3 — CEM Transaction Workflow Prototype** (safe read-only or staged write paths for purchase-to-stock).

---

## Acceptance

M3.2 **PASSED** when verifier + full validation suite green; no migrations, payments, auth weakening, or production launch claims.
