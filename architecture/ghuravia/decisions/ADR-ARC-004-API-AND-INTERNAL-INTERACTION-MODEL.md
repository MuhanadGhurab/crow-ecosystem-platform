# ADR-ARC-004 - API and Internal Interaction Model

| Field | Value |
|-------|-------|
| Decision ID | ADR-ARC-004 |
| Title | API and Internal Interaction Model |
| Status | ACCEPTED |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Context
GHURAVIA must separate authoritative mutations from public or natural resource reads while keeping internal interactions simple inside the modular monolith. The architecture also needs a safe async model for recalculation, notifications, and later worker extraction.

## Options Considered
- Command-oriented application APIs over HTTP for mutations, with resource GET where natural.
- GraphQL for both reads and writes at launch.
- Internal module calls through in-process function boundaries.
- Service-to-service APIs from day one.

## Constraints
- Product Code remains BLOCKED.
- Mutations require explicit validation and authority checks.
- Async side effects must not rely on dual writes.
- Realtime architecture is outside 1B and belongs to later gates.

## Quality Attributes
Primary drivers are transactional integrity, clarity of mutation intent, auditability, and future async extraction.

## Security
Command-style mutation endpoints make it easier to express authority checks and reduce ambiguous write semantics. Internal calls remain in-process only and do not bypass application policies.

## Privacy
Resource GETs must expose only the minimum required public or role-approved data. Internal events must not leak private payloads into external subscribers later.

## Accessibility
No direct a11y constraint, but predictable resource and command boundaries simplify UI error handling and state feedback.

## Localization
API semantics should stay locale-neutral while allowing localized presentation on the frontend.

## Cost
Command-oriented HTTP plus in-process calls avoids the tooling and governance burden of GraphQL federation or early service meshes.

## Operability
Simpler endpoint semantics and in-process calls reduce tracing and debugging complexity for a founder-run launch.

## Evidence
- `spikes/ghuravia/architecture-1b/SPK-ARC-003/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-010/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-011/RESULT.md`

## Decision
ACCEPTED:
- Command-oriented application APIs over HTTP for mutations.
- Resource GET where natural for read paths.
- No GraphQL at launch.
- Internal module calls remain in-process.
- Async behavior uses domain events plus a transactional outbox.
- Realtime interaction is DEFERRED to 1D.

## Consequences
- Commands should describe business intent, not generic CRUD alone.
- In-process domain calls stay simpler than network calls while preserving clean boundaries.
- Event payload design becomes important because later worker extraction depends on it.

## Reversal Cost
Medium. HTTP commands and internal modules can be projected into another API style later, but rewiring consumers and observability would cost time.

## Validation Status
ACCEPTED based on P0 PASS evidence for activation authority and progression ledger behavior; realtime remains deferred.

## Related Spike
SPK-ARC-003, SPK-ARC-010, SPK-ARC-011

## Revision History
| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B decision accepted |
