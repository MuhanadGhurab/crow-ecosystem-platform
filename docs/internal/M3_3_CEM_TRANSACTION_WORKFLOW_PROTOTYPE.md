# M3.3 — CEM Transaction Workflow Prototype (Purchase-to-stock)

## Transaction model audit (Part 1)

### What persistence already exists (no migration for prototype)

The prototype uses existing tenant-scoped operational persistence (Prisma models) that already support coordination and evidence hooks:

- **TenantPurchaseRequest** (procurement anchoring row)
  - Stores `status` for the procurement request lifecycle.
  - Supports advisory cross-module linkage fields:
    - `linkedFinanceRef` (finance approval readiness marker)
    - `linkedInventoryRef` (inventory visibility readiness marker)
  - Supports `referenceCode`, `vendorName`, `amountSar` and core request metadata (`title`, timestamps).
- **Workflow / WorkflowStep**
  - Stores a tenant workflow definition and ordered steps.
  - Steps are used for stage timeline display (advisory).
- **Task**
  - Provides a place to surface workflow-related operational items and their `status`.
  - The prototype creates a single **Purchase-to-stock** coordination task and updates its `status` as the workflow advances.
- **Approval**
  - Stores finance approval readiness evidence without activating payments or posting accounting entries.
- **Report**
  - Stores workflow metadata in `configJson`.
  - The prototype writes a purchase-to-stock report config under the `cem_transaction_workflow_v1` key so report output can be derived safely.
- **CybercrowAuditLog**
  - Provides an evidence/audit readiness hook for stage transitions and inventory visibility posture.

### Can tasks/workflows store module context?

Yes, safely and without schema changes:

- Tasks are linked to a tenant workflow (`workflowId`) and their title provides a stable link to the purchase request (`Purchase-to-stock: <title>`).
- The stage timeline derives module routing from the CEM transaction workflow service (read-only snapshot generation).

### Can workflows store status/stages?

Workflows themselves do not store per-step execution status in the schema.

For the prototype we treat:
- **Purchase request `status` + evidence linkage fields** as the single source of truth for stage derivation.
- **Task `status`** as an operational display of “workflow tracking”.

### Can reports derive from task/workflow status?

Yes:

- Report output is derived from the transaction workflow snapshot.
- When a tenant-backed request exists, report metadata is also stored in `Report.configJson` for stable workflow linkage.

## Persistence strategy (Part 3)

The snapshot builder follows a two-mode approach:

1. **Tenant-backed mode** (`purchaseRows.length > 0`)
   - Derive the stage timeline from existing `TenantPurchaseRequest.status` and evidence markers:
     - `draft` → `department_request`
     - `submitted` → `procurement_review`
     - `approved` + missing `linkedFinanceRef` → `finance_approval`
     - `approved` + present `linkedFinanceRef` → `warehouse_receiving`
     - `received` + missing `linkedInventoryRef` → `inventory_visibility`
     - `received` + present `linkedInventoryRef` → `completed` / `report_output`
2. **Advisory-only mode** (no purchase requests)
   - Render a staging workflow prototype snapshot with safe next-action copy disabled.
   - The UI remains operational for demo walkthroughs without fabricating “real stock movement”.

### No schema migrations

No migrations are introduced for M3.3.

The prototype only writes to existing tenant operational tables when stage actions are invoked:
- `TenantPurchaseRequest`
- `Task`
- `Approval`
- `Report`
- `CybercrowAuditLog`

## Contract (Part 2)

Implemented in:
- `src/lib/cem/cem-transaction-workflow-contract.ts`

Defines:
- `CemTransactionWorkflowKey` (`purchase_to_stock`)
- Transaction statuses and stage names
- Actor roles
- Snapshot shape (request, steps, related tasks/reports, evidence hooks, SAREA role experience, blockers/warnings, next actions, disclaimers)

## Service (Part 3)

Implemented in:
- `src/lib/services/cem-transaction-workflow.service.ts`

Responsibilities:
- Build a purchase-to-stock workflow snapshot for a tenant slug (read-only).
- Load existing tenant purchase requests.
- Derive stage status from existing evidence linkage fields.
- Connect each stage to module routes (procurement, finance, warehouse, inventory, reports).
- Provide:
  - Evidence hook routing (CyberCrow audit/readiness readiness)
  - SAREA role experience descriptors (copy and widget list)
  - Advisory next actions

## Actions (Part 4 — implemented and guarded)

Implemented in:
- `src/lib/actions/cem-transaction-workflow.ts`

Stage actions are guarded by:
- `requireActionTenantPolicy(slug, "cem.workflows.manage")`
- module availability checks (procurement/finance/warehouse/inventory)

No payments, no accounting posting, no legal purchase order issuance.
No real stock mutation is performed.

What “advancing” does (safe writes only):
- Update `TenantPurchaseRequest.status`
- Create `Approval` rows for finance evidence readiness
- Update `Task.status` for operational workflow tracking
- Update `TenantPurchaseRequest.linkedInventoryRef` as an advisory “visibility” marker
- Create `CybercrowAuditLog` evidence hook entries

## Workflow UI (Part 5)

Implemented in:
- `src/app/[tenant]/workflows/purchase-to-stock/page.tsx`

UI includes:
- Title + safe disclaimers
- Stage timeline
- Current stage + persistence mode
- Next actions (when tenant-backed persistence exists and modules are enabled)
- Related tasks panel
- Report output panel
- CyberCrow evidence readiness panel
- SAREA role experience panel
- Module impact deep links

## Module integration (Part 6)

Deep links from module pages to:
- `/[tenant]/workflows/purchase-to-stock`

Integrated into:
- `src/app/[tenant]/procurement/page.tsx`
- `src/app/[tenant]/finance/page.tsx`
- `src/app/[tenant]/warehouse/page.tsx`
- `src/app/[tenant]/inventory/page.tsx`
- `src/app/[tenant]/reports/page.tsx`
- `src/app/[tenant]/tasks/page.tsx`
- `src/app/[tenant]/workflows/page.tsx`

Each module page renders `TenantCemPurchaseToStockLink` as a compact card so pages stay uncluttered.

## Report output (Part 7)

Report output is displayed through:
- `CemTransactionReportPanel`

In tenant-backed mode, related reports are derived and the UI shows advisory stage roll-ups.
In advisory-only mode, the prototype renders an advisory report output placeholder.

No accounting posting and no supplier payment claims are introduced.

## CyberCrow evidence hook (Part 8)

Evidence readiness is displayed through:
- `CemTransactionEvidencePanel`

Evidence hooks are provided by:
- snapshot service `buildCyberCrowEvidence()`

The UI labels these as evidence readiness / audit posture readiness (not certified compliance).

## SAREA role experience hook (Part 9)

Role experience is displayed through:
- `CemTransactionSareaPanel`

The snapshot service provides role-specific copy descriptors and widget lists.

This is advisory and does not grant permissions or bypass RBAC.

## ProCrow / Go-No-Go alignment (Part 10)

Tenant workbench surface:
- `src/app/admin/tenants/[tenantId]/page.tsx`
- `AdminCemTransactionWorkflowPanel`

Global go/no-go surface:
- `src/app/admin/go-no-go/page.tsx`
- `ProCrowCemTransactionWorkflowGoNoGoPanel`

Dependency gate key:
- `cem-transaction-workflow-m33`
  - Added to `src/lib/services/procrow-go-no-go.service.ts`

## Verification result (Part 11)

Pending. Run:

```sh
npm run cem-transaction:verify
```

Then run the full validation suite specified for M3.3:

```sh
npm run cem-transaction:verify
npm run cem-module-depth:verify
npm run cem-operating-model:verify
npm run cem-handoff:verify
npm run tenant-demo:verify
npm run runtime:verify
npm run erp:verify
npm run cybercrow-trust:verify
npm run sarea-blueprint:verify
npm run access-gateway:verify
npm run procrow-workbench:verify
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
```

## Remaining gaps

This is still staging/demo-safe:

- Inventory visibility is a readiness marker only (advisory, not certified stock mutation).
- The prototype demonstrates the end-to-end workflow “shape” across modules.
- Deep ERP transaction semantics (legal PO issuance, accounting posting, payment settlement, and real stock movement mutation) are intentionally out of scope for M3.3.

## Recommended next phase

M3.4 — CEM Workflow Persistence / Transaction Schema (narrow, explicit persistence model improvements for:
- stable workflow step tracking
- request-to-task linkage without title matching
- report generation metadata contract hardening
).

