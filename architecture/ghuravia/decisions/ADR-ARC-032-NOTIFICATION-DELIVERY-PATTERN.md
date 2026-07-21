# ADR-ARC-032 — Notification Delivery Pattern

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-032 |
| **Title** | Notification Delivery Pattern |
| **Status** | **ACCEPTED; provider DEFERRED WITH ADAPTER** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

Notifications deliver async without coupling failure to business state.

## Options Considered

- **A.** Inline send
- **B.** Outbox + worker + adapter
- **C.** No notifications

## Quality Attributes

**Notification Failure ↛ Business-State / Progression / Entitlement** locked.

## Security

Payloads exclude secrets.

## Privacy

PII minimized; Trust never in push body.

## Accessibility

Templates include text alternatives.

## Arabic-first / Localization

RTL HTML email when provider supports.

## Cost

Per-message provider fees.

## Operability

NOTIFICATION-DELIVERY-FAILURE runbook.

## Spike Evidence

- **SPK-ARC-018 PASS**

## Decision

**ACCEPTED; provider DEFERRED WITH ADAPTER:** Option B — provider **DEFERRED WITH ADAPTER LOCKED**.

## Consequences

- Mission complete succeeds if notifier down

## Conditions

Email/SMS/push vendor not selected.

## Migration

Template versioning independent of migrations.

## Exit

In-app inbox fallback on sustained failure.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
