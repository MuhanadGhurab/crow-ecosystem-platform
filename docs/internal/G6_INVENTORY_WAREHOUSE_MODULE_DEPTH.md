# G6 — Inventory + Warehouse module depth (no paid infra)

**Status:** Passed (26 May 2026)  
**Constraint:** Stock/material and warehouse operations readiness only — no barcode/RFID/IoT, real-time stock accuracy guarantees, automated replenishment engines, full WMS, or certified audit claims.

---

## Part 1 — Inventory + Warehouse module audit

### Routes inspected

| Route | Role | Data |
|-------|------|------|
| `/[tenant]/inventory` | Inventory readiness hub + SKU list | `inventory.service`, readiness snapshot |
| `/[tenant]/warehouse` | Warehouse readiness hub + location list | `warehouse.service`, readiness snapshot |
| `/[tenant]/procurement` | Receiving / PR handoff | G5 procurement readiness, `linkedInventoryRef` |
| `/[tenant]/logistics` | Dispatch / delivery handoff | Logistics module flags |
| `/[tenant]/finance` | Cost readiness context | G3 finance module |
| `/[tenant]/tasks` · `/workflows` | Stock/warehouse coordination | Real tasks/workflows |
| `/[tenant]/reports` | KPI roll-ups | Reports module |
| `/[tenant]/cybercrow/*` | Evidence/audit/GRC posture | Advisory when CyberCrow initialized |
| `/sarea/*` | Role experience mapping | SAREA profiles/role-mapping |

### Real vs placeholder

- **Real:** `TenantInventoryItem` and `TenantWarehouseLocation` via Prisma services; purchase request inventory refs from `procurement.service`; workflow/task keyword matches; module enable flags; MEEM mock inventory samples when `USE_MOCK_DATA`.
- **Advisory:** Recommended inventory/warehouse workflows when not matched in DB; sector notes; CyberCrow evidence examples; readiness levels and recommended actions.
- **Not in scope:** Barcode scanners, RFID, IoT sensors, real-time stock sync, automated replenishment, AI demand forecasting, external warehouse APIs, WMS automation, inventory accuracy guarantees.

### Connections

- **Procurement:** PR counts with/without `linkedInventoryRef`; receiving handoff sections; supply linkage banner.
- **Logistics:** Module flag; dispatch handoff guidance; outbound lane context on warehouse hub.
- **Finance:** Module flag on inventory hub for cost/readiness review (advisory, no valuation engine).
- **Tasks/Workflows:** Keyword-matched workflows and open inventory/warehouse-related tasks.
- **Reports:** KPI signal lists in readiness panels (no fake charts).
- **CyberCrow:** Inventory and warehouse risk/evidence lists; links when initialized.
- **SAREA:** Separate persona lists for inventory vs warehouse experience density.

---

## Part 2 — Catalog refinement

Updated `erp-module-catalog.ts` entries for **Inventory** and **Warehouse**:

- Expanded purpose, users, workflows, CyberCrow risks, evidence, SAREA hints, sector relevance.
- Dependencies: `procurement`, `warehouse`/`inventory`, `logistics`, `finance`, `tasks`, `workflows`, `reports`, `cybercrow`.
- `futureOnlyCapabilities`: barcode/RFID/IoT, real-time stock guarantees, automated sync/replenishment, full WMS, external APIs.

---

## Part 3 — Inventory page UX

`src/app/[tenant]/inventory/page.tsx`:

- Always-on readiness (not gated on MEEM hub only).
- `SupplyChainOperationsLinkageBanner` variant `inventory`.
- `TenantRuntimeStatStrip` (readiness label, SKUs, low-stock, qty on hand, open tasks).
- `InventoryOperationsReadinessPanel`.
- `TenantRuntimeCrossLinks` (`current="inventory"`).
- SKU table when items exist (or MEEM samples in mock mode); honest coordination copy.
- MEEM `ErpModuleHub` + `MeemInventoryHub` preserved when applicable.

---

## Part 4 — Warehouse page UX

`src/app/[tenant]/warehouse/page.tsx`:

- Always-on readiness (not gated on MEEM hub only).
- `SupplyChainOperationsLinkageBanner` variant `warehouse`.
- Stat strip (readiness, locations, inbound/outbound lanes, open tasks).
- `WarehouseOperationsReadinessPanel`.
- `TenantRuntimeCrossLinks` (`current="warehouse"`).
- Location table when records exist; honest coordination copy.
- MEEM hubs when applicable.

---

## Part 5 — Procurement / Logistics / Finance linkage

`SupplyChainOperationsLinkageBanner` + catalog dependencies + readiness snapshots:

- Procurement → purchase/receiving readiness and PR inventory refs.
- Inventory → SKU and adjustment coordination signals.
- Warehouse → receiving, putaway, picking, movement readiness.
- Logistics → dispatch handoff from outbound lanes.
- Finance → cost/readiness review context (no live accounting).
- Reports/Tasks/Workflows → coordination and KPI readiness.

No schema changes; no external integrations.

---

## Part 6 — Workflow/task readiness

`INVENTORY_RECOMMENDED_WORKFLOWS` (9) and `WAREHOUSE_RECOMMENDED_WORKFLOWS` (8) in `inventory-warehouse-module-depth.ts`; merged in `inventory-warehouse-readiness.service.ts`.

Examples: item/catalog readiness, stock receiving, adjustment review, cycle count, replenishment request, receiving/putaway/picking readiness, warehouse-to-logistics handoff, monthly reports, access reviews.

---

## Part 7 — CyberCrow posture

**Inventory risks:** unauthorized adjustment, missing receiving trail, count gaps, stale catalog, movement abuse, overprivileged users, missing approval trail, exception audit gaps.

**Warehouse risks:** unauthorized movement, receiving/putaway gaps, picking/dispatch mismatch, access anomalies, missing handoff evidence, overprivileged users, exception audit gaps.

Evidence examples: receiving records, adjustment approvals, cycle counts, warehouse handoffs, monthly reports, access reviews — advisory only.

---

## Part 8 — SAREA experience model

`INVENTORY_SAREA_PERSONAS` and `WAREHOUSE_SAREA_PERSONAS` (8 each) — executive, operations, controllers, procurement/logistics coordinators, analysts, tenant admin, CyberCrow reviewer. RBAC controls access; SAREA controls experience density.

---

## Part 9 — Reports/KPI readiness

Readiness panels surface signal lists (module enabled, SKU/location counts, workflow readiness, handoff counts, open tasks, evidence readiness) — cards and tables only, no fabricated charts.

---

## Part 10 — Sector relevance

`INVENTORY_WAREHOUSE_SECTOR_NOTES` for logistics, retail, construction, aviation, healthcare — advisory, public-safe wording.

---

## Part 11 — Verification

- `npm run inventory-warehouse:verify` — catalog, constants, pages, panels, forbidden-phrase negation checks.
- `npm run erp:verify` — ERP catalog consistency.

---

## Remaining gaps

- No lot/serial tracking UI.
- No barcode scan workflow.
- No automated stock sync or replenishment engine.
- Logistics runtime depth deferred to **G7**.

---

## Recommended next

**G7 — Logistics Module Runtime Depth** per G1 ERP roadmap.
