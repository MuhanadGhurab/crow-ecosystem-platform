# Enterprise Blueprint & Commercial Intelligence

An **Enterprise Blueprint** is the approved, versioned description of what will be built, for whom, under what commercial terms, and how it deploys to tenant runtime.

## Blueprint slices

| Slice | Contents |
|-------|----------|
| Organizational | Units, roles, reporting lines |
| Operational | Processes, departments, SLAs |
| Security / Trust | Controls, signals, evidence expectations |
| Experience | SAREA mappings, personas, density |
| Integration | External systems, Saudi capability assessment |
| Commercial | ROI model, SOW sections, pricing linkage |

Contracts: `BlueprintVersion`, `BlueprintSlice`, `DeploymentBinding` in `src/lib/crow-core/blueprint/`.

## ROI model

Every commercial blueprint includes a **RoiModel** with sourced assumptions:

- `RoiAssumption`: source, value, unit, confidence, owner, approvalStatus, formulaRef
- Formulas are advisory until finance approval
- No autonomous approval of ROI figures

## SOW generator

**SowDraft** and **SowSection** types support advisory statement-of-work generation from blueprint + discovery evidence. Published SOW requires explicit approval gate (see doc 05).

## Versioning

- Blueprint versions are immutable once approved
- Material changes require new version + traceability record
- Align conceptually with existing Prisma `Blueprint*` / `Discovery*` models without coupling C0 contracts to ORM

## Transition note

Current routes split blueprint UX across `/blueprints`, `/client/blueprints`, and `/admin/blueprints` — target is unified Blueprint Workspace pattern (doc 13).
