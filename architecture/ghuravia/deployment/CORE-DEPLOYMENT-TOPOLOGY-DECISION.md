# Core Deployment Topology Decision

| Field | Value |
|-------|-------|
| Status | ACCEPTED WITH CONDITIONS |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Decision
Controlled launch assumes one primary web application deployment aligned to the modular monolith. A separate worker may be introduced later only if documented extraction triggers fire.

## Conditions
- Preview and production isolation remains mandatory.
- Async work uses transactional outbox contracts from the start.
- Provider-specific deployment details remain deferred.
- Product Code remains BLOCKED.

## Evidence
- `spikes/ghuravia/architecture-1b/SPK-ARC-021/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-001/RESULT.md`
