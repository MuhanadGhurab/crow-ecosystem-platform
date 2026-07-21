# ADR-ARC-017 — Data Retention and Deletion

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-017 |
| **Title** | Data Retention and Deletion |
| **Status** | **ACCEPTED WITH LEGAL CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Context

Platform handles identity, Evidence, Trust, audit, and progression with differing sensitivity and legal hooks.

## Options Considered

- **A.** Uniform retention for all user data.
- **B.** Classification-driven retention classes.
- **C.** Indefinite retention unless user asks.

## Quality Attributes

Privacy minimization vs audit/legal needs.

## Security

Secure deletion of quarantined malware objects; crypto-shred keys on account delete where applicable.

## Privacy

**DRAFT RETENTION CLASS / LEGAL VALIDATION REQUIRED** for all durations.

## Accessibility

Deletion/export status communicated accessibly.

## Localization

Retention notices Arabic-capable when shown to users.

## Cost

Tiered storage (hot Evidence vs archive) deferred to provider selection.

## Operability

Automated purge jobs for expired quarantine and telemetry.

## Spike Evidence

- DATA-LIFECYCLE-RETENTION-ARCHITECTURE.md
- SPK-ARC-009 (revocation vs deletion separation)

## Decision

**ACCEPTED WITH LEGAL CONDITIONS:** Option B — classification-driven retention with draft durations pending legal review.

## Consequences

- Retention job infrastructure required at Product Code.
- Legal review blocking production retention claims.

## Conditions

- Legal sign-off on Evidence and audit retention.
- Cross-border transfer assessment.

## Migration

Policy version stamped on records going forward; legacy bulk purge requires legal approval.

## Exit

Export before delete; adapter data deletion runbooks per processor.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | 1C accepted with legal conditions |
