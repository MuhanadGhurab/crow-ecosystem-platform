# ADR-ARC-010 - Cache Boundary

| Field | Value |
|-------|-------|
| Decision ID | ADR-ARC-010 |
| Title | Cache Boundary |
| Status | ACCEPTED |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Context
The controlled-launch architecture must clarify whether caching is required as a core dependency. Activation, progression, and formula history are integrity-heavy domains that cannot tolerate cache ambiguity as a source of truth.

## Options Considered
- No shared distributed cache required at controlled launch.
- Shared distributed cache as an early platform requirement.
- Cache-backed source of truth for progression or activation reads.
- Process-local cache only for low-risk acceleration.

## Constraints
- Product Code remains BLOCKED.
- Cache must never become the source of truth for activation, progression, or formula history.
- Founder operations should avoid unnecessary infrastructure.

## Quality Attributes
Primary drivers are correctness, simplicity, and clear source-of-truth ownership. Performance optimization is secondary to integrity at this stage.

## Security
Avoiding a shared distributed cache early reduces secret distribution and cross-runtime invalidation risks.

## Privacy
Process-local caches reduce replication surfaces for sensitive data. Cached content should still be minimized and short-lived.

## Accessibility
No direct a11y effect. Indirectly supports consistent state for user-visible flows.

## Localization
Any future cache layer must honor locale scoping, but no early distributed cache is required to support Arabic-first delivery.

## Cost
Deferring a distributed cache removes a recurring service cost and its corresponding operational burden.

## Operability
Founder operation is simpler when cache invalidation is not an early distributed systems problem.

## Evidence
- `spikes/ghuravia/architecture-1b/SPK-ARC-005/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-010/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-021/RESULT.md`

## Decision
ACCEPTED:
- No shared distributed cache is required for controlled launch.
- Process-local cache is acceptable for low-risk acceleration.
- Cache is never the source of truth for activation, progression, or formula history.

## Consequences
- Performance tuning should focus first on query design and projection shape.
- If a distributed cache is introduced later, it must remain purely derivative.
- Correctness takes precedence over early latency optimization.

## Reversal Cost
Low to medium. Adding a distributed cache later is easier than removing one that became architecturally central.

## Validation Status
ACCEPTED as a boundary decision anchored in integrity priorities and founder-operability needs.

## Related Spike
SPK-ARC-005, SPK-ARC-010, SPK-ARC-021

## Revision History
| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B decision accepted |
