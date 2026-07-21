# ADR-ARC-001 - Platform Architecture Shape

| Field | Value |
|-------|-------|
| Decision ID | ADR-ARC-001 |
| Title | Platform Architecture Shape |
| Status | ACCEPTED |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Context
GHURAVIA needs a launch architecture that preserves transactional integrity for activation, learning, evidence, and progression while remaining founder-operable and compatible with a single governed web delivery path. The 1B P0 spikes validated compatibility, environment isolation, activation authority, learning graph feasibility, and progression ledger behavior without introducing Product Code.

## Options Considered
- Option A: Single deployable monolith with minimal internal boundaries.
- Option B: Modular monolith with explicit domain packages and one primary deployable.
- Option C: Frontend plus separate modular backend deployables from day one.
- Option D: Early distributed services.

## Constraints
- Product Code remains BLOCKED.
- Controlled launch must be operable by the founder.
- Activation, evidence, and progression decisions must preserve clear authority boundaries.
- P0 evidence must be satisfied before stack lock.
- Deployable count should stay minimal unless an extraction trigger is met.

## Quality Attributes
Primary drivers are integrity, operability, change isolation, testability, and low launch complexity. Secondary drivers are future extractability and scale path clarity.

## Security
In-process module boundaries are acceptable for controlled launch only if authority checks remain explicit at application boundaries. Sensitive state changes must stay server-authoritative and auditable.

## Privacy
A single primary deployable reduces accidental data-copy surfaces early. Internal boundaries must still separate public profile reads, trust-sensitive decisions, and evidence-handling flows.

## Accessibility
This decision must not block later shell-level RTL and accessibility hardening. Frontend delivery remains able to host Arabic-first and mixed LTR islands.

## Localization
The chosen shape must support Arabic-first UI delivery without forcing duplicated services for localized routing or rendering.

## Cost
One primary deployable minimizes infra, observability, and operations overhead. Early services would multiply cost before validated demand exists.

## Operability
Founder-operable architecture strongly favors one primary web app, one release train, one main runtime boundary, and controlled later extraction rather than pre-emptive service sprawl.

## Evidence
- `spikes/ghuravia/architecture-1b/SPK-ARC-001/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-021/RESULT.md`
- `architecture/ghuravia/options/PLATFORM-ARCHITECTURE-SHAPE-OPTIONS.md`

## Decision
ACCEPTED: Option B, modular monolith with explicit domain packages.

Controlled-launch deployment shape:
- 1 primary web application initially.
- Worker extraction is allowed later if asynchronous load or operational isolation requires it.
- Option A and Option C remain documented alternatives.
- Option D is REJECTED FOR CONTROLLED LAUNCH.

Extraction triggers:
- Background job throughput or retry isolation materially degrades primary request handling.
- Realtime or long-running async workloads require independent scaling.
- Evidence or media processing requires separate runtime/security posture.
- Deployment cadence between domains becomes meaningfully different.
- Fault isolation requirements exceed in-process containment.

## Consequences
- Domain packages must be explicit even inside one deployable.
- Shared contracts and architecture linting become important governance tools.
- The team avoids premature network boundaries while preserving a migration path.
- Async capability should be designed through outbox and worker-friendly contracts from the start.

## Reversal Cost
Medium. Package boundaries, transaction rules, and contracts can be preserved during extraction, but deployment, observability, and runtime ownership would need refactoring.

## Validation Status
ACCEPTED based on P0 PASS evidence for compatibility and environment isolation. Domain-specific validation continues in later gates.

## Related Spike
SPK-ARC-001, SPK-ARC-021

## Revision History
| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B decision accepted |
