# Account Recovery Security Boundary

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-ID-RCV-001 |
| **Version** | 1.0.0 |
| **Status** | **DOMAIN ARCHITECTURE ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **Screen** | ACT-012 Activation Recovery |

## 1. Purpose

Define security boundaries for account and activation recovery without weakening server authority or enabling account takeover.

## 2. Recovery classes

| Class | Channel | Resets |
|-------|---------|--------|
| Activation recovery | Verified email (primary) | Pending activation steps |
| Credential recovery | Verified email + rate limits | Password / session revoke |
| Support-assisted | Ticket + identity checks | Manual, audited, dual control |

Mobile SMS recovery: **DEFERRED WITH ADAPTER LOCKED** (ADR-ARC-016).

## 3. Security boundaries

```text
Recovery token ──► single use ──► short TTL ──► bound to account id ──► invalidates sessions on credential reset
```

| Control | Requirement |
|---------|-------------|
| Token entropy | Cryptographically random |
| TTL | **15 minutes** (CANDIDATE SECURITY VALUE PENDING USABILITY) |
| Rate limiting | Per email + IP (architecture requirement) |
| Enumeration resistance | Generic responses for unknown emails |
| Audit | All recovery attempts logged without secrets |

## 4. Activation recovery (ACT-012)

- Does not bypass `account_risk_status` or terms acceptance.
- Re-issues email verification if expired; preserves server history.
- Cannot set `activation_complete` without full formula.

## 5. Threat considerations

| Threat | Mitigation |
|--------|------------|
| Token replay | Single-use + hash-at-rest |
| Support social engineering | Dual control + reason codes |
| Email takeover | Step-up for sensitive changes post-recovery |

## 6. Non-claims

```text
Production email provider not selected
Support playbooks not operational
No compliance claims
```
