# ADR-ARC-037 — Release and Migration Governance

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-037 |
| **Title** | Release and Migration Governance |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

Migrations forward-only; rollback via redeploy and feature flags.

## Options Considered

- **A.** Destructive down migrations
- **B.** Expand-contract + flags
- **C.** Manual SQL

## Quality Attributes

Aligns with progression formula versioning.

## Security

Migration jobs least privilege; audited.

## Privacy

Deletion migrations require legal sign-off.

## Accessibility

N/A

## Arabic-first / Localization

N/A

## Cost

Migration CI time bounded.

## Operability

DEPLOYMENT-ROLLBACK runbook.

## Spike Evidence

- **SPK-ARC-021 PASS (1B)**

## Decision

**ACCEPTED:** Option B — rollback = previous deploy + flags.

## Consequences

- No automatic down migrations in prod

## Conditions

Production migration rehearsal NOT RUN.

## Migration

Feature flag kill-switch per risky release.

## Exit

Freeze migrations; restore if corrupt.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
