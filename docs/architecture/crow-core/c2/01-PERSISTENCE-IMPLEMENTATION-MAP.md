# C2 — Persistence implementation map

| Approved concept (C1.1) | Implementation location |
|-------------------------|-------------------------|
| Blueprint identity | `prisma/schema.prisma` → `EnterpriseBlueprint` (+ `tenantId`, version pointers) |
| Version snapshots | `EnterpriseBlueprintVersion` + `snapshot-validation.ts` / `snapshot-hash.ts` |
| Lifecycle transitions | `blueprint-lifecycle.ts` + `blueprint-versioning.service.ts` |
| Approval evidence | `BlueprintApproval` + `blueprint-approval.service.ts` |
| Trace events | `BlueprintTraceEvent` + `blueprint-trace.repository.ts` |
| ROI reproducibility | `RoiAssumption`, `RoiAssumptionRevision`, `RoiSnapshot` + `roi.repository.ts` |
| SOW provenance | `SowDocument`, `SowVersion`, `SowSection` + `sow.repository.ts` |
| Tenant isolation | `blueprint-scope.ts`, `blueprint.repository.ts`, `blueprint.service.ts` |
| Action authorization | `blueprint-actions.ts`, `blueprint-action-guard.ts` |
| Client projection | `blueprint-projection.service.ts` |
| Dual-read | `blueprint-dual-read.service.ts`, `blueprint-studio-load.ts` |
| Backfill | `blueprint-backfill.service.ts`, `scripts/backfill-blueprint-persistence.ts` |
| Studio wiring | `src/lib/actions/blueprint-studio.ts`, studio pages |

Repositories live under `src/lib/crow-core/blueprint-persistence/`; orchestration under `src/lib/crow-core/blueprint-runtime/`.
