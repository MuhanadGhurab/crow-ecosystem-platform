# ADR-ARC-036 — Environment and Deployment Topology

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-036 |
| **Title** | Environment and Deployment Topology |
| **Status** | **ACCEPTED CONCEPTUALLY** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

Preview and production isolated with clear modular monolith topology.

## Options Considered

- **A.** Shared DB
- **B.** Isolated envs + single web deployable
- **C.** Multi-region day one

## Quality Attributes

SPK-ARC-021 PASS mandates isolation.

## Security

Secrets per environment.

## Privacy

Preview synthetic data policy.

## Accessibility

N/A

## Arabic-first / Localization

N/A

## Cost

Single region at launch.

## Operability

ENVIRONMENT-ISOLATION-ARCHITECTURE.md operationalizes.

## Spike Evidence

- **SPK-ARC-021 PASS (1B reviewed)**

## Decision

**ACCEPTED CONCEPTUALLY:** Option B — **ACCEPTED CONCEPTUALLY**; external infra validation remains.

## Consequences

- Preview ≠ Production credentials

## Conditions

- Hosting vendor not locked; Product Code BLOCKED

## Migration

Add staging without topology change.

## Exit

Disable preview if isolation breach detected.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
