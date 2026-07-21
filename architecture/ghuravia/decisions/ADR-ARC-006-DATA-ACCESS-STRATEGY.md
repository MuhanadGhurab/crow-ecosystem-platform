# ADR-ARC-006 - Data Access Strategy

| Field | Value |
|-------|-------|
| Decision ID | ADR-ARC-006 |
| Title | Data Access Strategy |
| Status | ACCEPTED WITH CONDITIONS |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Context
The data access layer must preserve typed SQL discipline while still allowing explicit control over graph traversal and progression recalculation paths. The decision needs to align with a relational primary store and a modular monolith that favors explicit contracts over opaque magic.

## Options Considered
- Drizzle ORM as the default typed SQL layer.
- Prisma Client as the default data access layer.
- Raw SQL everywhere.
- Mixed ad hoc ORM choices per module.

## Constraints
- Versions baseline includes `drizzle-orm@0.45.2` and `prisma client@7.9.0` as evaluated candidates.
- Product Code remains BLOCKED.
- Learning graph traversal and progression recalculation may need SQL control that exceeds generic ORM convenience.
- Data access should remain compatible with one relational primary store.

## Quality Attributes
Primary drivers are type safety, explicitness, SQL control, migration discipline, and low hidden coupling.

## Security
Explicit query construction and runtime validation at application boundaries reduce accidental overfetch or under-scoped writes.

## Privacy
Typed query composition should encourage minimal-field access patterns and predictable read/write boundaries.

## Accessibility
No direct a11y impact. Indirect benefit is more predictable data contracts for user-visible flows.

## Localization
No direct localization constraint beyond supporting Unicode content and localized metadata fields.

## Cost
Drizzle keeps runtime footprint and generated-client overhead lower than heavier alternatives. Raw SQL remains available without switching stacks.

## Operability
A lighter typed SQL approach is easier to reason about during founder-led validation than a more coupled generated-client workflow.

## Evidence
- `spikes/ghuravia/architecture-1b/SPK-ARC-005/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-010/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-011/RESULT.md`
- `architecture/ghuravia/options/DATA-ACCESS-COMPARISON.md`

## Decision
ACCEPTED WITH CONDITIONS: Drizzle ORM (`drizzle-orm@0.45.x`) is the default typed SQL layer.

Conditions:
- Raw SQL is allowed for Learning Graph traversal and progression recalculation.
- Query ownership stays inside domain-oriented repositories/modules.
- Schema validators remain required at API boundaries.
- Prisma was evaluated and is not selected for controlled launch because generated client and migration coupling are heavier than required for this phase.

## Consequences
- Teams must be comfortable with SQL-oriented patterns.
- Data access conventions should distinguish default typed SQL from justified raw SQL exceptions.
- Migration governance remains important even with a lighter ORM.

## Reversal Cost
Medium. Replacing the default ORM later is feasible if repository boundaries stay clean, but query rewrites and migration workflows would be non-trivial.

## Validation Status
ACCEPTED WITH CONDITIONS based on relational and progression spike evidence; implementation discipline remains required.

## Related Spike
SPK-ARC-005, SPK-ARC-010, SPK-ARC-011

## Revision History
| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B decision accepted with conditions |
