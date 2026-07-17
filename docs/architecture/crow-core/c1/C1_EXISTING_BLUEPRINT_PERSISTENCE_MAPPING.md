# C1 — Existing Blueprint Persistence Mapping

**Gate decision:** **PATH A** (read via adapter) + **PATH C** required for production persistence.  
**Path B rejected:** `EnterpriseBlueprint` has no dedicated metadata JSON; scattering C1 snapshots across child `configJson` fields would duplicate sources of truth.

| Path | Scope | C1 status |
|------|-------|-----------|
| **PATH A** | Read existing `Discovery*` + `Blueprint*` tables via `blueprint-adapter.ts` | **Active** — adapter boundary |
| **PATH B** | Store C1 snapshots in scattered `configJson` on child rows | **Rejected** |
| **PATH C** | Immutable version history, trace events, commercial snapshots | **Required** for production writes — see migration proposal |

## Canonical locations (do not duplicate)

| Surface | Path | Actor |
|---------|------|-------|
| Discovery (ProCrow) | `src/app/discovery/[requestId]/` | Implementer |
| Discovery (client) | `src/app/client/requests/[id]/discovery` | Client |
| Blueprint implementer | `src/app/blueprints/[blueprintId]/` | ProCrow |
| Blueprint Studio (C1) | `src/app/blueprints/[blueprintId]/studio/` | ProCrow / commercial / audit |
| Blueprint admin list | `src/app/admin/blueprints/page.tsx` | Admin |
| Client review | `src/app/client/blueprints/[blueprintId]/` | Client |
| Public proposal | `/proposal/[token]` | Client approver |

## Prisma model mapping

| Existing model / field | Responsibility | C0 contract | C1 action |
|------------------------|----------------|-------------|-----------|
| `DiscoveryProfile` + children | Org/ops/security/integration/experience evidence | Organizational, Operational, Integration, Experience slices | **keep** — adapter input |
| `EnterpriseBlueprint` | 1:1 blueprint row, `version` Int, status | `BlueprintVersionRef` (partial) | **adapt** — current version pointer only |
| `BlueprintModule` | Enabled modules | Commercial slice `modules` | **keep** |
| `BlueprintWorkflow` | Workflow configs | Operational slice | **keep** |
| `BlueprintRole` / `BlueprintPermission` | RBAC intent | Organizational + Security slices | **keep** |
| `BlueprintSecurityBaseline` | Security controls | Security & Trust slice | **keep** |
| `BlueprintSareaProfile` | Experience personas | Experience slice | **keep** |
| `BlueprintIntegration` | Integration providers | Integration slice | **keep** |
| `BlueprintGoLiveChecklist` | Go-live items | Readiness (separate from version diff) | **keep** |
| `BlueprintStatus` (DRAFT, IN_REVIEW, APPROVED, ARCHIVED) | DB lifecycle | C1 composite view model | **adapt** — no enum migration in C1 |
| `ProposalStatus` | Client commercial gate | Commercial approval | **keep** |
| `blueprint-plan-diff.service` | Subscription tier advisory | N/A | **keep** — not version diff |
| *(none)* | Immutable version history | `BlueprintVersionSnapshot` | **extend later** (Path C) |
| *(none)* | ROI / SOW persistence | `RoiModel`, `SowDraft` | **prototype** — fixtures + in-memory |

## C1 lifecycle → existing fields (view model only)

| C1 lifecycle state | Mapped from |
|--------------------|-------------|
| `DISCOVERY_DRAFT` | Request `UNDER_DISCOVERY`, no blueprint or `DRAFT` |
| `BLUEPRINT_DRAFT` | `BlueprintStatus.DRAFT` |
| `INTERNAL_REVIEW` | `IN_REVIEW` + `ProposalStatus.DRAFT` |
| `CLIENT_REVIEW` | `IN_REVIEW` + `ProposalStatus.SENT` |
| `CHANGES_REQUESTED` | Client review notes; proposal not approved |
| `APPROVAL_PENDING` | Pre-`APPROVED` gate (view model) |
| `APPROVED` | `APPROVED` + `approvedAt` |
| `CONFIGURATION_PROPOSED` | C0 `ConfigurationReleaseBinding` (advisory) |
| `SUPERSEDED` / `ARCHIVED` | Snapshot chain / `ARCHIVED` |

## Adapter boundary

- **Read:** `getEnterpriseBlueprint` → `blueprint-adapter.ts` → `EnterpriseBlueprintDocument`
- **Write (C1 prototype):** In-memory / fixture snapshots only — no Prisma mutations for version history
- **Write (production):** Requires Path C migration approval

## Risks

| Risk | Mitigation |
|------|------------|
| Duplicate Blueprint UX families | Single Studio route under `routes.blueprint(id).studio` |
| Plan diff vs version diff | Separate labels in UI |
| `blueprint-status.ts` missing `IN_REVIEW` | Align constants with Prisma enum in C1 |
| No DB version history | Migration proposal + fixture-backed prototype |

**C1 outcome:** `CONDITIONAL PASS — MIGRATION APPROVAL REQUIRED` for production-grade version persistence.
