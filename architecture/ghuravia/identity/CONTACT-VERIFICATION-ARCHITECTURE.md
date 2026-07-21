# Contact Verification Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-ID-CTV-001 |
| **Version** | 1.0.0 |
| **Status** | **DEFERRED WITH ADAPTER LOCKED** (providers) |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **ADR** | ADR-ARC-016 |

## 1. Purpose

Define contact verification boundaries for email (in scope for activation) and mobile (deferred).

## 2. Scope (controlled launch)

| Channel | Status | Activation role |
|---------|--------|-----------------|
| Email | **In scope** | Required (`email_verified`) |
| Mobile/SMS | **Deferred** | Not in baseline formula |

## 3. Email verification flow

```text
issue challenge → deliver via adapter → user completes → server validates token → set email_verified → audit
```

| Property | Rule |
|----------|------|
| Token storage | Hashed; never log plaintext |
| Screens | ACT-003 pending, ACT-011 result |
| Outcome authority | Server only |

## 4. Adapter boundary (ADR-ARC-016)

```text
[Identity module] ──► ContactVerificationPort ──► [EmailAdapter | SMSAdapter]
```

- Adapters swappable without changing activation aggregate.
- No production provider without sandbox send/receive validation.
- See EMAIL-MOBILE-PROVIDER-COMPARISON.md.

## 5. Mobile deferral rationale

Baseline inventory (92 screens) does not require mobile verification for activation completion. Mobile adapter remains locked for future gates (2FA, high-assurance flows).

## 6. Security

- Rate limit send and verify endpoints.
- Cooldown between resends.
- Do not expose whether email exists on verify endpoint (use recovery-specific handling).

## 7. Non-claims

```text
Email/SMS vendor not selected
Deliverability and regional compliance not validated
```
