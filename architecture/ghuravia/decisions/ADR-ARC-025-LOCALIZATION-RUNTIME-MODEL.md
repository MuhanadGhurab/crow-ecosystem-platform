# ADR-ARC-025 — Localization Runtime Model

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-025 |
| **Title** | Localization Runtime Model |
| **Status** | **ACCEPTED WITH CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

Arabic-first UX requires RTL shells with LTR technical islands without breaking routing or accessibility.

## Options Considered

- **A.** English-primary with Arabic overlay
- **B.** Arabic-primary RTL + explicit LTR islands
- **C.** Per-screen direction without global locale

## Quality Attributes

Arabic-first aligns with product mission; explicit islands reduce layout bugs.

## Security

Locale preference stored server-side.

## Privacy

No locale-based data exposure.

## Accessibility

Direction changes must not trap focus.

## Arabic-first / Localization

Default `ar` locale; `dir=rtl` on document with `dir=ltr` islands.

## Cost

Static locale bundles; CDN cache keys must include locale.

## Operability

Locale misconfiguration via missing-key fallbacks in non-prod.

## Spike Evidence

- **SPK-ARC-002 PASS WITH CONDITIONS**

## Decision

**ACCEPTED WITH CONDITIONS:** Option B — Arabic-first with contained LTR islands.

## Consequences

- Locale bundle strategy locked

## Conditions

- Real-device typography validation NOT RUN

## Migration

Add locales via bundle files.

## Exit

Fallback to Arabic-only if English bundle incomplete.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
