# ADR-ARC-029 — Payment Webhook and Entitlement Reconciliation

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-029 |
| **Title** | Payment Webhook and Entitlement Reconciliation |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

Commercial purchases reconcile entitlements idempotently without coupling to progression.

## Options Considered

- **A.** Payment success writes XP
- **B.** Entitlement ledger isolated
- **C.** Manual entitlement only

## Quality Attributes

**Commercial Event ↛ XP/Momentum/Mastery/Trust/Title/Prestige** locked.

## Security

Webhook signatures verified; idempotency keys required.

## Privacy

Receipt metadata minimized.

## Accessibility

N/A

## Arabic-first / Localization

Arabic receipt copy via deferred notification provider.

## Cost

Reconciliation job compute minimal.

## Operability

PAYMENT-RECONCILIATION runbook.

## Spike Evidence

- **SPK-ARC-012 PASS**

## Decision

**ACCEPTED:** Option B — idempotent webhook handlers update entitlement store only.

## Consequences

- Progression ledger untouched by commercial events

## Conditions

Payment provider selection deferred.

## Migration

Entitlement migrations independent of progression.

## Exit

Manual reconciliation if provider API unavailable.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
