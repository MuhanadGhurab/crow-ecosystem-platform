# ADR-ARC-038 — Integration Adapter and Webhook Model

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-038 |
| **Title** | Integration Adapter and Webhook Model |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

External integrations via gateway with signed webhooks and idempotent handlers.

## Options Considered

- **A.** Ad-hoc endpoints
- **B.** Integration gateway + adapter ports
- **C.** iPaaS only

## Quality Attributes

Consistent security for payment, identity, Saudi future ports.

## Security

HMAC verification; replay protection.

## Privacy

Webhook payloads minimized.

## Accessibility

N/A

## Arabic-first / Localization

Arabic error responses where user-visible.

## Cost

Gateway thin; vendor fees external.

## Operability

PROVIDER-OUTAGE runbook.

## Spike Evidence

- **SPK-ARC-012 PASS** — payment webhook idempotency

## Decision

**ACCEPTED:** Option B — Saudi **PLANNED CAPABILITY / OFFICIAL ACCESS NOT VERIFIED**.

## Consequences

- All inbound webhooks idempotent

## Conditions

Saudi identity integration not verified.

## Migration

Register adapter via config + gateway route.

## Exit

Disable adapter on sustained failure.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
