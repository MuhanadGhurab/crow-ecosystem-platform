# ADR-ARC-014 — Authentication and Sessions

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-014 |
| **Title** | Authentication and Sessions |
| **Status** | **ACCEPTED WITH CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Context

Authentication must be separate from Activation, Authorization, and Entitlement. Session timeouts require security/usability balance.

## Options Considered

- **A.** Stateless JWT-only (no server session).
- **B.** Server-side session with refresh rotation.
- **C.** IdP session only (no app session).

## Quality Attributes

Security (revocation, rotation) over pure statelessness.

## Security

Refresh token rotation; reuse detection; deny by default. Candidate timeouts marked **CANDIDATE SECURITY VALUE PENDING USABILITY**.

## Privacy

Session record stores account id and device metadata only — no Trust or Evidence fields.

## Accessibility

Session expiry UX must not trap assistive-tech users (visible, focusable renewal).

## Localization

Arabic session-expired messaging required.

## Cost

Server session storage uses primary DB — no extra cache required at launch.

## Operability

Founder can revoke all sessions for account from admin path (architecture requirement).

## Spike Evidence

- SPK-ARC-003 (auth distinct from activation)
- AUTHENTICATION-SESSION-ARCHITECTURE.md

## Decision

**ACCEPTED WITH CONDITIONS:** Option B — server-side sessions with refresh rotation, paired with ADR-013 adapter for primary auth.

## Consequences

- DB session table and cleanup job required.
- Slightly higher complexity than pure JWT.

## Conditions

- Final timeout values after usability testing.
- Rate limits on auth endpoints at Product Code gate.

## Migration

From JWT-only: issue server sessions on next login; deprecate long-lived JWTs.

## Exit

Session format documented; export active session count for migration tooling.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | 1C accepted with conditions |
