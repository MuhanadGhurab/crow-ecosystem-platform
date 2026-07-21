# ADR-ARC-016 — Contact Verification Boundary

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-016 |
| **Title** | Contact Verification Boundary |
| **Status** | **DEFERRED WITH ADAPTER LOCKED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Context

Activation requires email verification (ACT-003/011). Mobile verification deferred from baseline formula. Providers must be swappable.

## Options Considered

- **A.** Hard-code single email vendor SDK in domain.
- **B.** `ContactVerificationPort` with email + SMS adapters.
- **C.** IdP handles all verification (delegated).

## Quality Attributes

Adapter swap without changing activation aggregate (SPK-ARC-003).

## Security

Hashed tokens; rate limits; no verification bypass on adapter failure.

## Privacy

Minimize message content in logs; no plaintext tokens in audit.

## Accessibility

ACT-011 outcomes accessible in Arabic; not color-only.

## Localization

Arabic-primary verification emails required from chosen provider templates.

## Cost

Email per-send pricing deferred to EMAIL-MOBILE-PROVIDER-COMPARISON.md.

## Operability

Bounce/complaint webhooks required before production email adapter acceptance.

## Spike Evidence

- SPK-ARC-003 (email_verified in formula)
- CONTACT-VERIFICATION-ARCHITECTURE.md

## Decision

**DEFERRED WITH ADAPTER LOCKED:** Option B. Email in scope; SMS adapter locked but not required for activation completion.

## Consequences

- Two adapter implementations eventually (email now, SMS later).
- Provider selection gate remains open.

## Conditions

- Sandbox send/receive test for email vendor.
- Mobile remains out of activation formula until explicit gate change.

## Migration

Swap adapter implementation; verification state remains in app DB.

## Exit

Port interface documented; templates exportable from provider.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | 1C adapter locked, vendors deferred |
