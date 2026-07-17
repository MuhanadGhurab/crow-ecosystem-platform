# BLUEPRINT.1A — Existing Persistence Audit

> **Status:** AUDIT COMPLETE — DESIGN INPUT FOR 1A  
> **EXISTING_BLUEPRINT_PERSISTENCE_AUDITED=PASS**

## Summary

Blueprint persistence is **not greenfield**. C1/C2 introduced `EnterpriseBlueprint`, versioned snapshots, approvals, trace events, and normalized child tables. MODEL.4 added ephemeral preview only. BLUEPRINT.1A **extends** existing schema rather than replacing it.

## Audit table

| Concept | Existing source | Runtime use | Authoritative | Compatibility impact | Recommended action |
| ------- | --------------- | ----------: | ------------: | -------------------- | ------------------ |
| EnterpriseBlueprint root | `prisma/schema.prisma` | `blueprint.repository.ts`, admin/client routes | Yes (when persisted) | High — 1:1 `requestId` | **Extend** with lifecycle columns |
| EnterpriseBlueprintVersion | `prisma/schema.prisma` | `blueprint-version.service.ts`, lifecycle-transitions | Yes | High — requires `tenantId` today | **Extend** with MODEL.4 JSON columns; resolve pre-tenant tenantId |
| BlueprintStatus / ProposalStatus | Enums on root | Legacy C1 flows | Partial | Medium | Map to new `lifecycleState` in 1B |
| BlueprintVersionStatus | Enum on version | `lifecycle-transitions.ts` | Yes | Medium | Coexist with review cycles during transition |
| BlueprintApproval | `blueprint_approvals` | C2 approval runtime | Yes | Medium | Map client accept → approval or parallel cycle |
| BlueprintChangeRequest | `blueprint_change_requests` | Client change requests | Yes | Low | Align with `BlueprintReviewAction` |
| BlueprintTraceEvent | `blueprint_trace_events` | Traceability runtime | Yes (append-only) | Low | **Reuse** for lifecycle audit |
| Normalized child tables (Module, Workflow, Role…) | C1 tables | Legacy dual-read | Declining | Medium | Keep; new snapshots in JSON |
| Ephemeral preview | `model-forge/blueprint/` | Blueprint Studio | No (advisory) | None | Unchanged — compile → persist handoff in 1B |
| Blueprint Studio route | `/admin/blueprint-studio` | MODEL.3/4 UI | N/A | None | Keep separate from `/admin/blueprints` |
| blueprint-action-guard | `auth/blueprint-action-guard.ts` | Staff permission checks | Partial | Medium | Align with PLATFORM_ADMIN matrix in 1B |
| contentHash | On version row | Hash on save | Yes | Low | Server recompute via `hashBlueprintContent` |
| currentApprovedVersionId / activeDraftVersionId | Root pointers | Version selection | Yes | Medium | Add `platformFinalizedVersionId`; avoid circular FK issues |
| Discovery relation | `discoveryProfileId @unique` | Request pipeline | Yes | Low | Preserve 1:1 |
| Proposal token / clientApprovedAt | Root columns | Legacy proposal flow | Partial | Medium | Deprecate gradually vs new lifecycle |

## Fixture-only / conceptual

- C1 schema design previews in `docs/architecture/crow-core/c1/` — reference only
- `blueprint-engine/` memory repositories — test-only, no production I/O

## Conflicts reconciled

- **No duplicate EnterpriseBlueprint** — extend in place
- **No new CLIENT platform role** — request ownership suffices
- **No automatic provisioning** — explicit in lifecycle design
