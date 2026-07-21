# ADR-ARC-005 - Primary Datastore

| Field | Value |
|-------|-------|
| Decision ID | ADR-ARC-005 |
| Title | Primary Datastore |
| Status | ACCEPTED |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Context
GHURAVIA requires a source of truth for activation, learning graph structure, evidence metadata, and progression ledgers. P0 validation showed that core learning graph and progression invariants can be represented and verified without naming a graph database as the primary store.

## Options Considered
- Relational primary transactional datastore in the PostgreSQL family.
- Graph database as the primary source of truth.
- Document database as the primary source of truth.
- Multiple primary datastores at launch.

## Constraints
- Product Code remains BLOCKED.
- Authority, idempotency, and formula history require strong transactional patterns.
- Provider selection is not required to lock the architecture shape.
- Evidence binaries, cache, search, and analytics are separate concerns.

## Quality Attributes
Primary drivers are transactional consistency, query flexibility, predictable schema evolution, and operational familiarity.

## Security
A relational primary store supports explicit transaction boundaries, auditable writes, and durable separation between sensitive business records and derived data.

## Privacy
Clear schema boundaries support minimization, retention, and access-policy implementation across user, evidence, and trust-sensitive data.

## Accessibility
No direct a11y effect. Indirectly supports consistent content retrieval and audit trails for user-visible state.

## Localization
Relational storage can support localized content and metadata without constraining Arabic-first delivery choices.

## Cost
A single relational primary store keeps launch operations simpler than maintaining a graph or polyglot primary stack before evidence justifies it.

## Operability
Founder operation benefits from a well-understood transactional model and fewer primary persistence systems.

## Evidence
- `spikes/ghuravia/architecture-1b/SPK-ARC-005/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-010/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-011/RESULT.md`
- `architecture/ghuravia/options/PRIMARY-DATASTORE-COMPARISON.md`

## Decision
ACCEPTED: a relational primary transactional datastore in the PostgreSQL family.

Provider is DEFERRED.
A graph database is REJECTED FOR CONTROLLED LAUNCH as the primary source of truth.
Evidence object storage, cache, search, and analytics are explicitly separate adjunct capabilities rather than competing primaries.

## Consequences
- Learning graph source of truth will use relational adjacency structures.
- Async projections can materialize optimized read models later.
- Storage adjuncts must integrate around the relational core rather than replace it.

## Reversal Cost
High. Moving the primary source of truth later would affect schema, data access, operations, and migration planning across multiple domains.

## Validation Status
ACCEPTED based on P0 PASS evidence for relational graph representation and progression-event integrity.

## Related Spike
SPK-ARC-005, SPK-ARC-010, SPK-ARC-011

## Revision History
| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B decision accepted |
