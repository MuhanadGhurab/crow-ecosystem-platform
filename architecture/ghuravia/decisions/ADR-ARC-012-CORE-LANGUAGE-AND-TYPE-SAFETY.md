# ADR-ARC-012 - Core Language and Type Safety

| Field | Value |
|-------|-------|
| Decision ID | ADR-ARC-012 |
| Title | Core Language and Type Safety |
| Status | ACCEPTED |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Context
GHURAVIA needs a shared implementation language across frontend and backend to preserve domain contracts, reduce translation overhead, and support one modular monolith. P0 evidence already validated TypeScript-based spike harnesses across compatibility, activation, graph, and progression domains.

## Options Considered
- TypeScript across frontend and backend with shared contracts.
- Mixed-language stack with separate frontend and backend languages.
- TypeScript without shared contract packages.
- Static typing only at compile time without runtime schema validation.

## Constraints
- Versions baseline includes `typescript@7.0.2`.
- Product Code remains BLOCKED.
- Cross-boundary contracts must stay explicit.
- API boundaries still require runtime validation.

## Quality Attributes
Primary drivers are consistency, type safety, code mobility across modules, and reduced impedance between UI and backend.

## Security
Compile-time types are not sufficient at trust boundaries. Runtime schema validators remain required for request and event inputs.

## Privacy
Shared contracts help prevent accidental overexposure by keeping field intent explicit across boundaries.

## Accessibility
Consistent types improve UI-state correctness but do not replace dedicated accessibility validation.

## Localization
Shared contracts make locale-aware payloads and Arabic-first content metadata easier to model consistently.

## Cost
One primary language reduces staffing, tooling, and build complexity during founder-led validation and later implementation.

## Operability
Shared language and contracts simplify debugging and lower the chance of boundary drift across modules.

## Evidence
- `spikes/ghuravia/architecture-1b/SPK-ARC-001/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-003/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-005/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-010/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-011/RESULT.md`

## Decision
ACCEPTED:
- TypeScript is the core language for frontend and backend.
- Shared contracts package(s) are part of the architecture baseline.
- Runtime validation is required at API boundaries using schema validators.
- Validator brand choice is deferred until implementation if a concrete standard is needed.

## Consequences
- Domain contracts should be centralized and versioned.
- Runtime validation remains mandatory even with strong compile-time typing.
- Mixed-language exceptions would require explicit governance later.

## Reversal Cost
High. Changing the primary shared language later would affect frontend, backend, contracts, tooling, and hiring assumptions.

## Validation Status
ACCEPTED based on P0 PASS evidence across all core spike domains.

## Related Spike
SPK-ARC-001, SPK-ARC-003, SPK-ARC-005, SPK-ARC-010, SPK-ARC-011

## Revision History
| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B decision accepted |
