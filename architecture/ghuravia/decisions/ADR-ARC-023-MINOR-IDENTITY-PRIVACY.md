# ADR-ARC-023 — Minor Identity Privacy

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-023 |
| **Title** | Minor Identity Privacy |
| **Status** | **ACCEPTED WITH LEGAL CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Context

GHURAVIA may serve minors. Public Crow profiles must not leak private legal identity, contact data, Trust, or raw Evidence. Age category used internally; not exposed on minor public profiles.

## Options Considered

- **A.** Same public profile shape for all ages.
- **B.** Stricter projection for minors with leak assertion.
- **C.** No minor accounts at launch.

## Quality Attributes

Privacy-by-design vs product inclusivity.

## Security

Projection layer enforces banned fields; automated leak assertion in CI (future).

## Privacy

**LEGAL VALIDATION REQUIRED** for age threshold and parental consent.

## Accessibility

Public profile pages remain accessible without exposing prohibited fields via AT tree.

## Localization

Arabic public copy for minor-safe display names moderation.

## Cost

Projection compute negligible.

## Operability

Manual review path for sanitized public Evidence on minors.

## Spike Evidence

- **SPK-ARC-025 PASS WITH LEGAL CONDITIONS** — leak assertion; prohibited fields undefined on public view

## Decision

**ACCEPTED WITH LEGAL CONDITIONS:** Option B — stricter minor public projection.

## Consequences

- Dual projection paths (minor vs adult) in public read layer.
- Legal review before enabling minor registration flows.

## Conditions

- Legal definition of minor age for target jurisdictions.
- Parental consent UX — **NOT DESIGNED IN 1C**.
- No compliance certification claimed.

## Migration

If age category reclassified, re-project public profile on next read.

## Exit

Disable minor registration flag; existing accounts handled per legal advice.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | 1C accepted with legal conditions per SPK-ARC-025 |
