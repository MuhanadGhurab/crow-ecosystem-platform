# ADR-ARC-009 - Background Jobs and Event Publication

| Field | Value |
|-------|-------|
| Decision ID | ADR-ARC-009 |
| Title | Background Jobs and Event Publication |
| Status | ACCEPTED |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Context
GHURAVIA needs controlled async execution for recalculation, notifications, evidence follow-up, and future workload isolation without introducing an external broker too early. The architecture must avoid dual writes and preserve replayable consistency.

## Options Considered
- Transactional outbox with post-commit local or worker jobs.
- Fire-and-forget in-request side effects.
- External broker from day one.
- Cron-only batch handling for all async work.

## Constraints
- Product Code remains BLOCKED.
- Async execution cannot compromise transactional integrity.
- Launch complexity must stay founder-operable.
- Worker extraction is allowed later but not mandatory now.

## Quality Attributes
Primary drivers are reliability, replayability, fault isolation, and low launch complexity.

## Security
Post-commit publication reduces ambiguity about whether side effects are authorized or durable. Job payloads must stay scoped and avoid secret sprawl.

## Privacy
Outbox payloads should carry only the minimum data needed for downstream work and avoid unnecessary duplication of sensitive fields.

## Accessibility
Indirect benefit only: controlled async execution supports more predictable user feedback and retry messaging.

## Localization
Async workflows should publish locale-neutral events and let delivery layers apply locale-specific rendering.

## Cost
Transactional outbox plus local/worker execution avoids the ongoing cost and operations burden of a broker before scale justifies it.

## Operability
Founder operation benefits from a simpler async model that can still scale to a dedicated worker if extraction triggers fire.

## Evidence
- `spikes/ghuravia/architecture-1b/SPK-ARC-010/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-021/RESULT.md`
- `architecture/ghuravia/options/BACKGROUND-JOB-EVENTING-COMPARISON.md`

## Decision
ACCEPTED: use a transactional outbox with post-commit local or worker job execution for controlled launch.

External broker adoption is DEFERRED.
In-request fire-and-forget behavior is rejected for authoritative side effects.

## Consequences
- Domain events should be durable and replay-friendly.
- Worker extraction remains straightforward because job contracts exist from day one.
- Broker evaluation can wait until throughput or isolation needs become concrete.

## Reversal Cost
Medium. Adding a broker later is manageable if the outbox contract remains stable.

## Validation Status
ACCEPTED based on progression integrity evidence and launch operability constraints.

## Related Spike
SPK-ARC-010, SPK-ARC-021

## Revision History
| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B decision accepted |
