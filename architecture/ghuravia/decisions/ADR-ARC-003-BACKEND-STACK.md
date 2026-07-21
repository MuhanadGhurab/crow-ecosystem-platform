# ADR-ARC-003 - Backend Stack

| Field | Value |
|-------|-------|
| Decision ID | ADR-ARC-003 |
| Title | Backend Stack |
| Status | ACCEPTED WITH CONDITIONS |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Context
The backend must preserve activation authority, progression integrity, and controlled launch simplicity while staying colocated with the chosen modular monolith shape. P0 spikes show server-authoritative behavior, environment isolation, and progression/event patterns without requiring a dedicated API service at launch.

## Options Considered
- TypeScript domain modules inside the modular monolith with Next.js Route Handlers at the HTTP edge.
- Dedicated Hono application as the primary API host from launch.
- NestJS application as the primary backend framework.
- Multi-service backend from day one.

## Constraints
- Product Code remains BLOCKED.
- Launch backend must stay founder-operable.
- HTTP entry points must support explicit validation and authority checks.
- Async workloads may require later extraction but are not yet sufficient to justify a second service.

## Quality Attributes
Primary drivers are integrity, simplicity, explicit boundaries, low runtime count, and easy extraction into a later worker or dedicated API surface.

## Security
Route handlers must remain thin and delegate to domain/application modules. Sensitive decisions must not depend on client-generated authority.

## Privacy
Colocation keeps sensitive joins and policy decisions server-side. Public reads and private workflows should stay separated by application modules and explicit policies.

## Accessibility
Backend stack choice must not constrain accessibility-related rendering or content delivery paths.

## Localization
Backend APIs must remain language-agnostic while supporting Arabic-first content and metadata flows from the frontend.

## Cost
Reusing the web runtime for initial HTTP edges avoids a second deployment, second logging stack, and early operational duplication.

## Operability
Founder operation favors one main runtime with explicit internal modules over an additional platform/service framework at launch.

## Evidence
- `spikes/ghuravia/architecture-1b/SPK-ARC-001/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-003/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-010/RESULT.md`
- `architecture/ghuravia/options/BACKEND-STACK-COMPARISON.md`

## Decision
ACCEPTED WITH CONDITIONS: backend logic will live in TypeScript domain modules colocated inside the modular monolith. Initial HTTP edge delivery will use Next.js Route Handlers.

Hono is reserved as an optional dedicated API host if an extraction trigger fires.
NestJS is REJECTED FOR CONTROLLED LAUNCH due to launch complexity, additional framework surface, and reduced founder operability relative to current needs.

Conditions:
- Route handlers stay thin.
- Application and domain modules stay framework-light.
- Extraction to Hono remains conditional, not assumed.

## Consequences
- Backend code structure matters more than framework ceremony.
- Domain modules should avoid tight coupling to Next.js specifics.
- Async execution and event publication must already be worker-friendly.

## Reversal Cost
Medium. Extraction to Hono is manageable if module boundaries remain clean; moving later to a larger backend framework would be more expensive.

## Validation Status
ACCEPTED WITH CONDITIONS based on P0 PASS evidence for compatibility, activation authority, and progression/event patterns.

## Related Spike
SPK-ARC-001, SPK-ARC-003, SPK-ARC-010

## Revision History
| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B decision accepted with conditions |
