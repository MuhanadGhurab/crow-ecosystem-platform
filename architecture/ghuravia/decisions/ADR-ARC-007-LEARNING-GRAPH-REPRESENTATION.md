# ADR-ARC-007 - Learning Graph Representation

| Field | Value |
|-------|-------|
| Decision ID | ADR-ARC-007 |
| Title | Learning Graph Representation |
| Status | ACCEPTED |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Context
The Learning Graph needs a source-of-truth structure that can prove acyclicity, support prerequisite traversal, and integrate cleanly with a relational transactional core. The 1B spike validated that graph semantics can be modeled using relational adjacency structures without needing a graph database at launch.

## Options Considered
- Relational adjacency tables as source of truth.
- Graph database as source of truth.
- Embedded JSON graph blobs.
- Hybrid source of truth from day one.

## Constraints
- Product Code remains BLOCKED.
- Acyclicity must be enforceable.
- Traversal logic must stay explainable and testable.
- Launch architecture should avoid unnecessary primary-store plurality.

## Quality Attributes
Primary drivers are integrity, explainability, source-of-truth clarity, and compatibility with transactional updates.

## Security
Graph relationship changes must stay server-authoritative and auditable. Write control is simpler when graph structure shares the transactional system of record.

## Privacy
The graph itself is largely structural, but derived learner state against that graph may be sensitive. Source-of-truth separation helps avoid leakage through ad hoc projections.

## Accessibility
No direct a11y effect. Clear graph semantics indirectly support reliable learner guidance and prerequisite presentation.

## Localization
Structural graph storage should stay locale-neutral while supporting localized node metadata elsewhere.

## Cost
Relational adjacency avoids adding a second primary database technology before scale or traversal complexity proves the need.

## Operability
Founder operation favors one transactional platform and transparent traversal logic over separate graph infrastructure.

## Evidence
- `spikes/ghuravia/architecture-1b/SPK-ARC-005/RESULT.md`
- `architecture/ghuravia/learning/LEARNING-GRAPH-SPIKE-RESULT.md`

## Decision
ACCEPTED: relational adjacency tables are the Learning Graph source of truth.

Hybrid read projections are allowed later for specialized queries.
Graph database adoption is DEFERRED until an explicit scale or traversal trigger is met.

## Consequences
- Graph invariants should be tested at the repository/domain layer.
- Traversal SQL and raw-query exceptions remain justified for this domain.
- Future projections must derive from, not replace, the relational source of truth.

## Reversal Cost
Medium to high. Projection-based evolution is straightforward, but replacing the source of truth would require data migration and replay validation.

## Validation Status
ACCEPTED based on SPK-ARC-005 PASS evidence.

## Related Spike
SPK-ARC-005

## Revision History
| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B decision accepted |
