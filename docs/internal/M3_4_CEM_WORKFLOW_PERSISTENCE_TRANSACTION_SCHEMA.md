# M3.4 — CEM Workflow Persistence / Transaction Schema (Purchase-to-stock)

## Persistence audit (Part 1)

### What can persist safely today (no migration)

| Model | Role in purchase-to-stock | Linkage quality |
|-------|---------------------------|-----------------|
| `TenantPurchaseRequest` | Anchor row for the transaction | **Linked** — primary source of stage truth |
| `Workflow` / `WorkflowStep` | Template definition for timeline | **Inferred** — no per-request `workflowId` FK on purchase request |
| `Task` | Operational tracking | **Linked/Inferred** — `workflowId` optional; matched by title + lineage metadata |
| `Approval` | Finance approval readiness | **Linked** — `entityType` + `entityId` when finance stage completes |
| `Report` | Workflow output + lineage store | **Linked** — `configJson` holds `cem_workflow_lineage_v1` metadata |
| `CybercrowAuditLog` | Evidence hook | **Linked/Inferred** — audit rows keyed by entity; stage transitions logged |
| `linkedFinanceRef` / `linkedInventoryRef` on purchase request | Receiving + inventory visibility markers | **Linked** — advisory markers, not stock mutation |

### What is inferred or advisory

- Workflow **instance** per purchase request (template is tenant-scoped; instance IDs live in report lineage JSON).
- Workflow **stage execution status** on `WorkflowStep` rows (derived from purchase request status).
- SAREA role experience context (experience mapping advisory; no permission grants).
- Inventory visibility when no tenant inventory rows exist (marker only).

### Missing for “full ERP” lineage (future M3.4B — not blocking M3.4)

- `TenantPurchaseRequest.workflowId` FK (nullable).
- `TenantPurchaseRequest.primaryTaskId` FK (nullable).
- Dedicated `WorkflowInstance` table (optional; not required for staging prototype).

## Decision gate (Part 2) — **PATH A: existing_schema**

**No migration applied in M3.4.**

Rationale:

1. M3.3 already writes safely to existing operational tables.
2. Report `configJson` lineage (`cem_workflow_lineage_v1`) can store stable cross-entity IDs without DDL.
3. Purchase request status + linkage fields remain the stage source of truth.
4. Operator constraint: schema changes require explicit approval.

`migrationProposalRequired: false` in persistence audit.

Optional future hardening documented in [`M3_4_WORKFLOW_PERSISTENCE_MIGRATION_PROPOSAL.md`](M3_4_WORKFLOW_PERSISTENCE_MIGRATION_PROPOSAL.md) for **M3.4B** only.

## Persistence contract (Part 3)

`src/lib/cem/cem-workflow-persistence-contract.ts`

- `CemWorkflowPersistenceMode`: `existing_schema` | `migration_required` | `advisory_only`
- `CemWorkflowLinkType`: nine link types across purchase request → workflow → stages → tasks → approvals → receiving → inventory → report → CyberCrow → SAREA
- `CemWorkflowPersistenceLink`, `CemWorkflowPersistenceAudit`, `CemWorkflowPersistenceSnapshot`
- Go/No-Go dependency type for M3.4 panel

Lineage helper: `src/lib/cem/cem-workflow-lineage.ts` (`parseWorkflowLineage`, `mergeWorkflowLineage`).

## Persistence service (Part 4)

`src/lib/services/cem-workflow-persistence.service.ts`

- Read-only audit: `auditCemWorkflowPersistenceForTenantSlug`
- ProCrow summary: `buildCemWorkflowPersistenceSummaryForTenantId`
- Maps each link as `linked` | `inferred` | `missing` | `proposed`
- No DB writes, payments, stock mutation, or accounting posting

## Action hardening (Part 5 — PATH A)

`src/lib/actions/cem-transaction-workflow.ts` + `updatePurchaseToStockLineage` in transaction workflow service:

- On request creation: merge lineage into report `configJson` (workflowId, taskId, reportId, step IDs).
- On stage advance: update lineage (approvalId, receiving markers, inventory visibility markers).
- Stage guards unchanged: no skip, finance before receiving, inventory after receiving.

## ProCrow persistence panel (Part 6)

- `src/components/admin/admin-cem-workflow-persistence-panel.tsx`
- Wired on `src/app/admin/tenants/[tenantId]/page.tsx` overview tab

## Go/No-Go dependency (Part 7)

- Gate key: `cem-workflow-persistence-m34` in `procrow-go-no-go.service.ts`
- Panel: `src/components/procrow/procrow-cem-workflow-persistence-go-no-go-panel.tsx`
- Global page: `src/app/admin/go-no-go/page.tsx`
- Helper: `src/lib/cem/cem-workflow-persistence-go-no-go.ts`

## Business Portal workflow UI (Part 8)

- `src/components/tenant/cem-workflow-persistence-panel.tsx` on `/[tenant]/workflows/purchase-to-stock`
- Shows tenant-backed vs inferred vs missing links per relationship

## Reports / CyberCrow alignment (Part 9)

- `CemTransactionReportPanel` — report output lineage label (persisted / inferred / advisory)
- `CemTransactionEvidencePanel` — evidence hook lineage label; explicit non-certification copy

## Verification (Part 10)

```bash
npm run cem-workflow-persistence:verify
```

Script: `scripts/verify-cem-workflow-persistence.ts`

## Remaining gaps

- FK-level workflow instance on `TenantPurchaseRequest` (M3.4B migration proposal only).
- Workflow step runtime status table (out of scope — ERP engine).
- Automated persistence audit in CI against seeded tenant DB (operator-run verifiers today).

## Recommended next phase

- **M3.4B — Approved Workflow Persistence Migration** (if operator approves nullable FK proposal), or
- **M4 — Tenant Membership & Business Portal Access Hardening**

## M3.4 acceptance

**PASSED** when:

1. Audit documented (this file).
2. PATH A decision recorded — no migration file added.
3. Contract + lineage + service + verifier exist.
4. ProCrow tenant + Go/No-Go surfaces show persistence readiness.
5. Purchase-to-stock UI shows link status.
6. Reports/CyberCrow panels show lineage state.
7. Full validation suite green (operator-run).
