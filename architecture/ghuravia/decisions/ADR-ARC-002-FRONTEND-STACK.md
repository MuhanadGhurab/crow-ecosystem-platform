# ADR-ARC-002 - Frontend Stack

| Field | Value |
|-------|-------|
| Decision ID | ADR-ARC-002 |
| Title | Frontend Stack |
| Status | ACCEPTED WITH CONDITIONS |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Context
GHURAVIA needs a public-facing web surface with Arabic-first presentation, SEO/public discoverability, server-side control points, and an application shell that can later host authenticated and mission-critical workflows. The compatibility spike confirmed modern Next.js and React versions are workable inside the governed repo without introducing Product Code.

## Options Considered
- Next.js App Router with React 19 and TypeScript.
- Vite SPA-only frontend as the sole web stack.
- Hybrid static/SSR mix assembled from separate tools.
- Other React meta-frameworks for launch.

## Constraints
- Versions baseline: `next@16.2.10`, `react@19.2.8`, `typescript@7.0.2`, `Node 24.15.0`.
- Product Code remains BLOCKED.
- Public pages and SEO/public needs cannot be treated as secondary.
- RTL, accessibility, and public-shell evidence are not fully closed in 1B.

## Quality Attributes
Primary drivers are SEO/public reach, server-rendering flexibility, typed routing, maintainability, and future secure integration with application APIs.

## Security
Server components and route handlers provide a controlled place for sensitive logic and secret-backed integration when product implementation begins. Client-only trust assumptions remain disallowed.

## Privacy
Server-side rendering and server-side data access help minimize accidental exposure of internal-only data to browser bundles.

## Accessibility
ACCEPTED WITH CONDITIONS because full RTL and a11y spikes remain required. Stack acceptance does not claim complete accessibility validation.

## Localization
Next.js App Router supports Arabic-first routing, metadata, and SSR/streaming patterns without forcing SPA-only compromises.

## Cost
A unified React plus Next stack keeps hiring, tooling, and build complexity lower than split-framework alternatives.

## Operability
One frontend framework with integrated routing, rendering modes, metadata, and server endpoints is simpler for founder operation than multiple stitched tools.

## Evidence
- `spikes/ghuravia/architecture-1b/SPK-ARC-001/RESULT.md`
- `architecture/ghuravia/options/FRONTEND-STACK-COMPARISON.md`

## Decision
ACCEPTED WITH CONDITIONS: Next.js App Router (`next@16.x`) plus React 19 and TypeScript is the controlled-launch frontend baseline.

Conditions:
- SPK-ARC-002 and later accessibility/RTL validation remain required.
- Product Code remains BLOCKED.
- Public metadata, Arabic-first shells, and route governance must stay explicit.
- Vite SPA-only is REJECTED FOR CONTROLLED LAUNCH as the sole frontend because it weakens the SEO/public shell requirement.

## Consequences
- App Router conventions become the default web composition model.
- Shared UI and contracts should stay framework-light where practical.
- Browser-only architecture decisions remain deferred until later validation closes public-shell and a11y gaps.

## Reversal Cost
Medium. A future migration is possible because the core domain logic will remain outside UI components, but route conventions and rendering assumptions would need rework.

## Validation Status
ACCEPTED WITH CONDITIONS from P0 compatibility evidence only. Full RTL, a11y, and broader shell behavior remain open.

## Related Spike
SPK-ARC-001 with P1 follow-through from SPK-ARC-002 and SPK-ARC-017

## Revision History
| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B decision accepted with conditions |
