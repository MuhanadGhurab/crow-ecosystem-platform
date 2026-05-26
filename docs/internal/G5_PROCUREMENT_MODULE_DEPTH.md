# G5 — Procurement module depth (no paid infra)

**Status:** Passed (26 May 2026)  
**Constraint:** Supplier and purchase operations readiness only — no live supplier payments, vendor marketplace, AI supplier scoring, contract signing, or compliance certification claims.

---

## Part 1 — Procurement module audit

### Routes inspected

| Route | Role | Data |
|-------|------|------|
| `/[tenant]/procurement` | Procurement readiness hub + PR list | `procurement.service`, readiness snapshot |
| `/[tenant]/finance` | Cost/billing handoff | G3 finance readiness, `finance-linkage-banner` variant procurement |
| `/[tenant]/inventory` | Stock/material receiving readiness | Inventory module flags |
| `/[tenant]/warehouse` | Inbound receiving handoff | Warehouse module flags |
| `/[tenant]/tasks` · `/workflows` | Purchase review coordination | Real tasks/workflows |
| `/[tenant]/reports` | KPI roll-ups | Reports module |
| `/[tenant]/cybercrow/*` | Evidence/audit/GRC posture | Advisory when CyberCrow initialized |
| `/sarea/*` | Role experience mapping | SAREA profiles/role-mapping |

### Real vs placeholder

- **Real:** Purchase requests via `procurement.service` (`listPurchaseRequests`, `getProcurementSummary`); tenant workflow/task keyword matches; module enable flags from workspace summary; MEEM mock samples when `USE_MOCK_DATA`.
- **Advisory:** Recommended procurement workflows when not matched in DB; sector notes; CyberCrow evidence examples; readiness level and recommended actions.
- **Not in scope:** Live supplier payments, bank integration, vendor marketplace, contract signing, automated PO as legal document, external supplier APIs, AI supplier scoring, fraud detection.

### Connections

- **Finance:** PR `linkedFinanceRef` counts; finance module flag; handoff section in readiness panel; `FinanceLinkageBanner` variant `procurement`.
- **Inventory/Warehouse:** `linkedInventoryRef` counts; module flags; supply linkage banner cross-links.
- **Tasks/Workflows:** Keyword-matched workflows and open procurement-related tasks.
- **Reports:** KPI signal lists in readiness panel (no fake charts).
- **CyberCrow:** Supplier/procurement risks and evidence examples; links when CyberCrow initialized.
- **SAREA:** Persona-specific procurement experience density.

---

## Part 2 — Catalog refinement

Updated `erp-module-catalog.ts` Procurement entry:

- Purpose: supplier coordination and purchase request readiness.
- Dependencies: `finance`, `inventory`, `warehouse`, `tasks`, `workflows`, `reports`, `cybercrow`.
- Expanded workflows, CyberCrow risks, evidence examples, SAREA hints, sector relevance.
- `futureOnlyCapabilities`: vendor marketplace, live payments, AI supplier scoring, contract automation, external supplier APIs.

---

## Part 3 — Procurement page UX

`src/app/[tenant]/procurement/page.tsx`:

- Always-on readiness (not gated on MEEM hub only).
- Stat strip (readiness level, PR counts, vendors, tasks, finance/inventory links).
- `ProcurementSupplyLinkageBanner` + `FinanceLinkageBanner` (procurement).
- `ProcurementOperationsReadinessPanel`.
- `TenantRuntimeCrossLinks` (`current="procurement"`).
- PR list when procurement module enabled; honest empty states.
- MEEM hubs preserved when applicable below readiness content.

---

## Part 4 — Finance / Inventory / Warehouse linkage

`ProcurementSupplyLinkageBanner` + finance linkage + catalog dependencies:

- Procurement → purchase request and supplier coordination readiness.
- Finance → cost/billing/payment readiness review (G3, no live payments).
- Inventory/Warehouse → receiving and stock/material handoff readiness.
- Tasks/Workflows/Reports → coordination and KPI readiness.

No finance logic changes; no payment activation.

---

## Part 5 — Workflow/task readiness

`PROCUREMENT_RECOMMENDED_WORKFLOWS` in `procurement-module-depth.ts` (10 items); merged with tenant workflows in `procurement-readiness.service.ts` (`found` | `recommended` | `partial`).

Examples: purchase request intake, supplier approval readiness, purchase approval, procurement-to-finance handoff, procurement-to-inventory handoff, receiving readiness, supplier issue escalation, exception review, monthly procurement review, procurement access review.

---

## Part 6 — CyberCrow posture

Procurement risks: unauthorized purchase request, supplier approval abuse, stale supplier records, approval bypass, finance/inventory handoff gaps, overprivileged users, missing approval trail, exception audit gaps.

Evidence examples: purchase approval trail, supplier approval evidence, exception review, finance/inventory handoff records, receiving readiness, escalation, monthly report, role/access review — advisory only.

---

## Part 7 — SAREA experience model

`PROCUREMENT_SAREA_PERSONAS` — executive/owner, procurement manager, buyer, inventory controller, warehouse supervisor, finance manager, department manager, analyst, tenant admin, CyberCrow reviewer. RBAC controls access; SAREA controls experience density.

---

## Part 8 — Reports/KPI readiness

`PROCUREMENT_REPORT_KPI_SIGNALS` rendered as readiness lists in panel — no fabricated charts.

---

## Part 9 — Sector relevance

`PROCUREMENT_SECTOR_NOTES` for logistics, retail, construction, aviation, healthcare — advisory, public-safe.

---

## Part 10 — Verification

- `npm run procurement:verify` — catalog, route, services, panels, banners, cross-links, forbidden-claim negation checks.
- `npm run erp:verify` — module catalog integrity.

---

## Remaining gaps

- No external supplier or E-procurement integrations.
- Contract management and automated legal PO issuance remain future-only.
- MEEM deepest demo for logistics procurement samples.
- Supplier master data depth limited to PR vendor names in current model.

---

## Recommended next

**G6 — Inventory + Warehouse module depth** (per G1 roadmap).
