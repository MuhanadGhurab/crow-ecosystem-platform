# Persistent Blueprint Engine Boundary

> **Status:** PROPOSED — NOT APPLIED — OWNER REVIEW REQUIRED  
> **Milestone:** CROW.BLUEPRINT.1A  
> **Baseline:** `396a47cc5547448936fc2a6b544df5e349f5ffcd`

## Purpose

Define the platform boundary between **ephemeral Blueprint Preview** (MODEL.4 / Blueprint Studio) and **persistent governed Blueprint versions** with exact-version client review and platform finalization.

## Current state (verified)

| Layer | Location | Role |
| ----- | -------- | ---- |
| Ephemeral compiler | `src/lib/model-forge/blueprint/` | `compileEnterpriseBlueprintPreview()` — advisory, non-authoritative |
| Ephemeral studio | `/admin/blueprint-studio` | Design, scenario lab, human-review readiness |
| Legacy persistence | `prisma/schema.prisma` — `EnterpriseBlueprint`, `EnterpriseBlueprintVersion` | C1/C2 runtime — partially used |
| Legacy runtime | `src/lib/crow-core/blueprint-runtime/`, `blueprint-persistence/` | Version transitions, Prisma reads |
| Design contracts (1A) | `src/lib/crow-core/blueprint-engine/` | Pure domain — no DB I/O |

## Target boundary

```text
Tenant composition → Operating Graph → governed rules → provenance
  → ephemeral Blueprint Preview (Blueprint Studio)
  → compile + server hash validation
  → immutable EnterpriseBlueprintVersion snapshot
  → internal review cycle
  → share exact version with request owner
  → client exact-version decision
  → platform finalization (no provisioning)
```

## Non-goals (explicit)

- Blueprint approval does **not** grant authority
- Blueprint approval does **not** create memberships
- Blueprint approval does **not** provision a tenant
- Blueprint approval does **not** compile runtime workflows

## Cardinality

**One `EnterpriseBlueprint` root per `ImplementationRequest`** — enforced by existing `requestId @unique`.

Versions are append-only under that root.

## Reconciliation with existing schema

BLUEPRINT.1A does **not** introduce a parallel Blueprint aggregate. It **extends** existing tables:

- `EnterpriseBlueprint` — add lifecycle + concurrency columns
- `EnterpriseBlueprintVersion` — add MODEL.4 compiler artifact columns
- New `BlueprintReviewCycle` — formal exact-version review binding
- Reuse `BlueprintTraceEvent` for audit evidence
- Retain normalized C1 child tables for legacy paths; new MODEL.4 snapshots live in `contentSnapshot` JSON

## Owner decisions required

1. **Pre-tenant `tenantId` on versions** — current schema requires `tenantId` on `EnterpriseBlueprintVersion`; request-phase blueprints may need a sentinel/platform tenant or nullable column (see risk register).
2. **Legacy normalized tables vs JSON-only** — dual-read period vs deprecation timeline.
3. **Mapping `BlueprintApproval` to review cycles** — extend vs parallel `BlueprintReviewCycle`.

## Route contract

| Route | Purpose |
| ----- | ------- |
| `/admin/blueprint-studio` | Ephemeral preview (unchanged) |
| `/admin/blueprints` | Persistent Blueprint list (future 1B) |
| `/admin/blueprints/[blueprintId]` | Root lifecycle (future 1B) |
| `/client/requests/[requestId]/blueprint` | Client-safe projection (future 1B) |

## Certification

No deployment required for 1A. Migration count remains **23 applied / 0 pending**.
