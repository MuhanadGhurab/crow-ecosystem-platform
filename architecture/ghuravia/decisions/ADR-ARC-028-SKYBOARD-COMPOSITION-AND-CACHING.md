# ADR-ARC-028 — Skyboard Composition and Caching

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-028 |
| **Title** | Skyboard Composition and Caching |
| **Status** | **ACCEPTED WITH PERFORMANCE CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

Adaptive Skyboard composes tiles from progression and entitlements; cache ≠ source of truth.

## Options Considered

- **A.** Fully dynamic per request
- **B.** Cache-aside with TTL + invalidation
- **C.** Edge-only personalization

## Quality Attributes

Cache-aside balances latency and correctness.

## Security

Cached tiles must respect authZ.

## Privacy

No Trust or minor-prohibited fields in cached DTOs.

## Accessibility

Reduced-motion variants cached separately.

## Arabic-first / Localization

RTL tile layout in cache key dimension.

## Cost

Memory cost scales with MAU.

## Operability

**DRAFT PERFORMANCE TARGET LOCAL SPIKE ONLY**.

## Spike Evidence

- **SPK-ARC-023 PASS WITH CONDITIONS**

## Decision

**ACCEPTED WITH PERFORMANCE CONDITIONS:** Option B with strict invalidation on progression/entitlement change.

## Consequences

- Stale cache cannot grant entitlement

## Conditions

- No production SLO

## Migration

Cache namespace versioning on schema change.

## Exit

Bypass cache if invalidation backlog exceeds threshold.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
