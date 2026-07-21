# ADR-ARC-033 — Leaderboard Publication and Snapshot Model

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-033 |
| **Title** | Leaderboard Publication and Snapshot Model |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

Public leaderboards enforce population thresholds and privacy server-side.

## Options Considered

- **A.** Always public
- **B.** Threshold-gated snapshots
- **C.** No leaderboards

## Quality Attributes

Privacy for small populations and minors.

## Security

Snapshot reads public; mutation admin-only.

## Privacy

**<20 participants → no public board**.

## Accessibility

Accessible rank tables.

## Arabic-first / Localization

Arabic rank labels; RTL tables.

## Cost

Snapshot storage bounded.

## Operability

PROGRESSION-RECALCULATION-FAILURE runbook linkage.

## Spike Evidence

- **SPK-ARC-024 PASS**

## Decision

**ACCEPTED:** Option B — publish when population ≥ threshold and privacy rules pass.

## Consequences

- Server-side enforcement only

## Conditions

Legal review for minor display retained.

## Migration

Snapshot schema versioned.

## Exit

Hide boards if privacy incident runbook triggered.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
