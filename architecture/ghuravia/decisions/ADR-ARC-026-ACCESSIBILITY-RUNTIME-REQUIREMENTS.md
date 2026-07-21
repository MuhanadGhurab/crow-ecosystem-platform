# ADR-ARC-026 — Accessibility Runtime Requirements

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-026 |
| **Title** | Accessibility Runtime Requirements |
| **Status** | **ACCEPTED WITH USER-VALIDATION CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

Shells must honour reduced-motion and baseline accessibility without breaking Labs or Live Sky.

## Options Considered

- **A.** Best-effort client fixes
- **B.** Shell-level reduced-motion + automated checks + manual gate
- **C.** Full WCAG certification before launch

## Quality Attributes

Option B balances inclusivity with gate velocity.

## Security

No security bypass via accessibility APIs.

## Privacy

AT-visible text must not leak Trust or private identity.

## Accessibility

**AUTOMATED SPIKE EVIDENCE; MANUAL REVIEW REQUIRED; USER VALIDATION NOT RUN**

## Arabic-first / Localization

Arabic screen reader spot-check NOT RUN.

## Cost

Automated axe in CI; user testing budgeted pre-launch.

## Operability

Exception queue for known axe violations.

## Spike Evidence

- **SPK-ARC-017 PASS WITH CONDITIONS**

## Decision

**ACCEPTED WITH USER-VALIDATION CONDITIONS:** Option B with explicit user-validation gate before controlled launch.

## Consequences

- Live Sky motion announcements need dedicated review

## Conditions

- USER VALIDATION NOT RUN; ≠ WCAG 2.2 AA certification

## Migration

Progressive enhancement; feature flags for motion-heavy Labs.

## Exit

Disable motion-heavy features if reduced-motion cannot be honoured.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
