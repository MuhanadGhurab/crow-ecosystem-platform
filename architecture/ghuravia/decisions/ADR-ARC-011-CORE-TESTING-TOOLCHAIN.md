# ADR-ARC-011 - Core Testing Toolchain

| Field | Value |
|-------|-------|
| Decision ID | ADR-ARC-011 |
| Title | Core Testing Toolchain |
| Status | ACCEPTED |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Context
Architecture validation requires a test toolchain that can prove P0 hypotheses now and expand cleanly into unit, integration, browser, RTL, and accessibility testing later. The 1B spikes already used `node:test` successfully under a synthetic harness.

## Options Considered
- `node:test` for spikes, Vitest for future unit/integration, Playwright later for browser and RTL/a11y automation.
- Vitest for everything immediately.
- Jest-centered stack.
- Browser-only confidence without strong invariant tests.

## Constraints
- Versions baseline includes `vitest@4.1.10`.
- Product Code remains BLOCKED.
- P0 evidence is synthetic and architecture-focused, not full product verification.
- Accessibility and security validation are not complete.

## Quality Attributes
Primary drivers are reproducibility, fast local evidence loops, invariant coverage, and future browser automation readiness.

## Security
Test harnesses must avoid real secrets and external calls during architecture validation.

## Privacy
Synthetic fixtures remain the default; no real user data is required for the current spike set.

## Accessibility
Playwright is reserved for later browser, RTL, and accessibility automation. This ADR does not claim complete accessibility validation.

## Localization
Future automation must include Arabic-first and mixed-direction scenarios, but that remains subsequent work.

## Cost
Starting lightweight with `node:test` avoids unnecessary framework overhead while preserving a clear future path to broader automation.

## Operability
Founder operation benefits from simple local test commands, deterministic fixtures, and high-signal invariant suites.

## Evidence
- `spikes/ghuravia/architecture-1b/SPIKE-EVIDENCE-INDEX.md`
- `architecture/ghuravia/options/TESTING-TOOLCHAIN-COMPARISON.md`

## Decision
ACCEPTED:
- `node:test` for spikes.
- Vitest for future unit and integration testing.
- Playwright for later browser, RTL, and accessibility automation.
- Invariant tests are required for learning graph and progression behavior.

This decision is not a claim of complete accessibility or security validation.

## Consequences
- Architecture spikes can remain lightweight and reproducible.
- Future product implementation should preserve invariant-first testing discipline.
- Browser-level validation remains on the roadmap rather than inside current closure.

## Reversal Cost
Low. Testing tools can evolve if contracts and invariant suites remain portable.

## Validation Status
ACCEPTED based on successful P0 reproducibility across six spikes.

## Related Spike
SPK-ARC-001, SPK-ARC-005, SPK-ARC-010, SPK-ARC-011, SPK-ARC-021

## Revision History
| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B decision accepted |
