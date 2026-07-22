# Implementation 0C UX Security Review

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0C-UX-SEC-001 |
| **Gate** | GHV.IMPLEMENTATION.0C |
| **Date** | 2026-07-22 |
| **Authorization** | GHV-IMP-AUTH-003 |
| **Branch** | `feat/ghuravia-foundation` |
| **Data class** | Synthetic only · disposable local PostgreSQL |

## Controls reviewed

| Control | Finding | Status |
|---------|---------|--------|
| Activation formula authority | Server-side gates unchanged; mobile not in formula | **PASS** |
| Route guards | `canAccessScreen` / `resolveAuthorizedScreen`; deep links blocked | **PASS** |
| Return-to allowlist | `ALLOWED_RETURN_TO` — governed routes only; no open redirects | **PASS** |
| Explainable Locks | No gate bypass via recovery or skip paths | **PASS** |
| Error surfacing | `ErrorCategory` → localized catalogue; no raw `Error.message` in UI | **PASS** |
| Idempotency | Replay treated as success; conflict explained; no blind retry | **PASS** |
| Stale-version | Refresh required; no silent re-accept of terms/risk | **PASS** |
| Session bootstrap | Local synthetic session only; unauthorized screens gated | **PASS** |
| ACT-007 skip | Skip/later does not block ONB-001; optional assurance only | **PASS** |
| ONB-001 boundary | Handoff-only; no IDN forms; no origin persistence | **PASS** |
| Client secret exposure | No real provider keys; mocks only | **PASS** |
| Deployment | Guard active; Preview/Staging/Production blocked | **PASS** |

## Prohibited scope confirmation

| Prohibited item | Confirmed absent |
|-----------------|------------------|
| Real auth / email / SMS | Yes |
| ACT-008 OTP | Yes |
| Origin / Nest / Horizon Product Code | Yes |
| New screen IDs | Yes |
| Alias activation routes | Yes |

## Tests

| Test | Result |
|------|--------|
| Route guard — terms before email | **PASS** (e2e) |
| Keyboard flow — no bypass | **PASS** (e2e) |
| Unit — activation routes / idempotency | **PASS** |

## Predecessor retention

| Predecessor | Verdict | Retained |
|-------------|---------|----------|
| GHV.IMPLEMENTATION.0B recovery cannot bypass gates | **PASS** | Yes |
| GHV.IMPLEMENTATION.0C onboarding preflight | **PASS WITH CONDITIONS** | Yes — handoff only |

## Verdict

```text
PASS — UX SECURITY CONTROLS FOR AUTHORIZED ACTIVATION AND ONBOARDING-ENTRY HANDOFF COMPLETE
```

Operator notes: [docs/implementation/ACTIVATION-UX.md](../../docs/implementation/ACTIVATION-UX.md) · [docs/implementation/ONBOARDING-ENTRY-HANDOFF.md](../../docs/implementation/ONBOARDING-ENTRY-HANDOFF.md)
