# Authentication and Session Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-ID-AUTH-001 |
| **Version** | 1.0.0 |
| **Status** | **ACCEPTED WITH CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **ADR** | ADR-ARC-014 |

```text
CANDIDATE SECURITY VALUE PENDING USABILITY
Timeouts below are architectural candidates — not production locks
Product Code: BLOCKED
```

## 1. Purpose

Define authentication patterns and session lifecycle separate from Activation and Authorization.

## 2. Pattern

**Hybrid:** App-owned session records + replaceable IdP adapter for primary authentication (ADR-ARC-013).

| Layer | Owner | Notes |
|-------|-------|-------|
| IdP adapter | External (sandbox required) | OIDC/passwordless options deferred |
| Session store | Application | Authoritative for request auth |
| Refresh rotation | Application | Detect reuse; revoke family |

## 3. Session lifecycle

```text
authenticate → issue session + refresh → validate per request → rotate refresh → revoke on logout/compromise
```

| Event | Server behavior |
|-------|-----------------|
| Login success | Create session; bind device fingerprint (optional); audit |
| Request | Validate session; check revocation; load account id only |
| Refresh | Rotate refresh token; invalidate prior refresh |
| Logout | Revoke session family |
| Password change / risk signal | Revoke all sessions |

## 4. Candidate timeout values (pending usability)

| Parameter | Candidate | Rationale |
|-----------|-----------|-----------|
| Access/session token TTL | **15 minutes** | Limit exposure window |
| Idle session timeout | **30 minutes** | Balance UX vs shared device risk |
| Absolute session max | **24 hours** | Force re-auth daily on sensitive accounts |
| Refresh token TTL | **30 days** | Convenience with rotation |
| Step-up validity | **5 minutes** | Sensitive action window |
| Upload/evidence presign TTL | **15 minutes** | Align with SPK-ARC-007 |

```text
CANDIDATE SECURITY VALUE PENDING USABILITY
Final values require usability validation and threat-model sign-off
```

## 5. Security controls

- Deny by default on missing/invalid session.
- HttpOnly, Secure, SameSite cookies for browser sessions (when cookie mode used).
- Binding optional claims: user-agent hash, IP subnet (soft signal only).
- No activation or entitlement flags embedded in session JWT beyond account id + session id.
- Rate limit authentication endpoints (architecture requirement; provider TBD).

## 6. Separation

| Concern | Not in session token |
|---------|------------------------|
| `activation_complete` | Loaded server-side per request |
| Authorization roles | Loaded from policy engine |
| Trust state | Separate restricted read |
| Learning/progression | Separate domains |

## 7. Arabic-first / a11y

- Login and session-expired screens: RTL-safe, clear session-expired messaging in Arabic.
- Do not rely on timed modal alone; provide visible expiry notice for assistive tech.

## 8. Conditions

- Production IdP not accepted without sandbox validation (ADR-ARC-013).
- Session store technology follows primary datastore ADR; no separate cache required at launch.

## 9. Non-claims

```text
No specific IdP selected
Timeout values not production-locked
No compliance certification implied
```
