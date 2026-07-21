# Notification Architecture Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-NTF-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §27 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-018 · SPK-ARC-003 |
| **Related** | TRANSACTION-CONSISTENCY-MAP · Identity activation (email) |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
FAILED NOTIFICATION ≠ BUSINESS STATE CHANGE
NO Product Code · NO ESP brand lock without evidence
```

## 1. Hard rule

```text
Authoritative business event commits first.
Notification is a delivery projection.
Provider failure / bounce / delay must not roll back or invent activation,
entitlement, Evidence approval, or progression standing.
```

Exception clarity: **transactional email for verification** delivers a token, but **verification result** is still the server consume of that token (ACT-011) — not “email opened.”

## 2. Channels to assess

| Channel | Launch relevance |
|---------|------------------|
| In-app | High |
| Email | High (activation + security) |
| Future mobile / push | Post-launch / conditional |

## 3. Notification classes

| Class | Examples | Mandatory? |
|-------|----------|------------|
| Activation | Verify email, recovery | Transactional |
| Evidence review | Submitted / decision | Preference-aware |
| Mission reminders | Abandoned progress | Opt-in / preference |
| Live Sky | Starting soon | Preference-aware |
| Commercial | Receipts, renewals | Transactional subset |
| Moderation / Trust / appeals | Safety | Often mandatory |
| Correction | Standing changed | Mandatory where material |
| Security alerts | New login, compromise | Mandatory |

## 4. Architecture dimensions

| Dimension | Requirement | Spike |
|-----------|-------------|-------|
| Authoritative event | Business ID referenced | SPK-ARC-018 |
| Delivery preference / consent | Stored separately | SPK-ARC-018 |
| Quiet hours | Non-security | SPK-ARC-018 |
| Localization | AR/EN templates | SPK-ARC-002 · 018 |
| Retry / provider failure | Dead-letter; no state mutate | SPK-ARC-018 |
| Duplicate prevention | Dedupe key per event+channel | SPK-ARC-018 |
| Unsubscribe | Non-transactional only | SPK-ARC-018 |
| Sensitive-content protection | No secrets in body | SPK-ARC-018 |

## 5. QAS alignment

QAS-018 Notification Failure — business state unchanged; user can discover status in-app.

## 6. Limitations

```text
VALIDATION PLAN ONLY · SPIKES NOT RUN · DECISION PENDING
```

## 7. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §27 — notification architecture validation plan |
