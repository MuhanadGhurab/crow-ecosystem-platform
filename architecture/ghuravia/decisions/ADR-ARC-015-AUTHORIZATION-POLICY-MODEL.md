# ADR-ARC-015 — Authorization Policy Model

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-015 |
| **Title** | Authorization Policy Model |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Context

Platform requires fine-grained access across Evidence, Trust, progression corrections, and learner self-service without conflating roles with entitlements.

## Options Considered

- **A.** Pure RBAC.
- **B.** Pure ABAC/reBAC.
- **C.** Hybrid RBAC + contextual policy.

## Quality Attributes

Clarity for founder-operable roles plus context for ownership and SoD.

## Security

Deny by default. SoD: no self-approval of Evidence; dual control for break-glass.

## Privacy

Moderator roles receive minimum identity exposure (SPK-ARC-013).

## Accessibility

Access-denied errors human-readable in Arabic.

## Localization

Policy reason codes mapped to localized messages — not raw role names to users.

## Cost

In-process policy evaluation — no external policy engine at launch.

## Operability

Role matrix documentable for support; policy changes audited.

## Spike Evidence

- SPK-ARC-007, 013, 019 (access patterns)
- AUTHORIZATION-ARCHITECTURE.md

## Decision

**ACCEPTED:** Option C — Hybrid RBAC + contextual policy.

## Consequences

- Policy module required; tests for denial cases mandatory.
- Future external policy engine optional if rules explode.

## Conditions

None blocking architecture acceptance.

## Migration

N/A — greenfield.

## Exit

Policy rules exportable as versioned configuration.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | 1C accepted |
