# Activation State Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-ID-ACT-001 |
| **Version** | 1.0.0 |
| **Status** | **DOMAIN ARCHITECTURE ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **Evidence** | SPK-ARC-003 (1B), SCREEN-BASELINE-1C-ACTIVATION-PREFLIGHT |

```text
SERVER-AUTHORITATIVE
Client cannot declare activation complete
Product Code: BLOCKED
```

## 1. Purpose

Define activation states, transitions, and screen mapping. Activation gates platform access; it is distinct from Authentication and Authorization.

## 2. State model

| State field | Type | Meaning |
|-------------|------|---------|
| `email_verified` | boolean | Primary contact verified |
| `current_terms_accepted` | boolean | Active terms version accepted |
| `account_risk_status` | enum | `unknown` → `acceptable` \| `blocked` |
| `activation_complete` | boolean | Derived; set only by server formula |

**Completion formula:**

```text
activation_complete =
  email_verified
  AND current_terms_accepted
  AND account_risk_status = acceptable
```

Mobile verification is **not** in the controlled-launch formula. Adapter remains locked for future gates unless baseline changes.

## 3. Governed screens

| Screen | Server source | Client role |
|--------|---------------|-------------|
| ACT-003 | `email_verification_pending` | Poll/display; no forge |
| ACT-011 | `email_verification_result` | Display outcome from server |
| ACT-012 | `activation_recovery` | Guided recovery; server transitions |
| ACT-013 | `account_risk_status` | Risk acceptance; server records |
| ACT-005 | `terms_acceptance` | Terms UI; server records acceptance |
| ACT-006 | `activation_complete` | Read-only success from server |
| ACT-004 | HISTORICAL_ONLY | **Not counted** in active inventory |

## 4. Transition rules

| Transition | Preconditions | Server action |
|------------|---------------|---------------|
| Email verified | Valid verification token/challenge | Set `email_verified = true` |
| Terms accepted | `email_verified` | Set `current_terms_accepted = true` |
| Risk accepted | Email + terms | Set `account_risk_status = acceptable` |
| Activation complete | Full formula | Set `activation_complete = true`, audit |
| Recovery | Authenticated or verified channel | Reset pending fields per policy |

**Reject:** Client-side DTO patches claiming activation flags (SPK-ARC-003 `tryClientForge`).

## 5. Separation from other concerns

| Concern | Relationship to activation |
|---------|---------------------------|
| Authentication | Required to reach activation flows; does not imply activation |
| Authorization | Evaluated after session; activation is a separate gate |
| Learning eligibility | Requires activation + catalogue rules |
| Trust eligibility | Separate domain; moderation may restrict post-activation |
| Entitlement | Commercial; independent of activation formula |

## 6. Audit

All activation transitions append immutable audit events: actor, prior state ref, resulting state ref, reason code. No raw email bodies in audit.

## 7. Failure modes

| Failure | Behavior |
|---------|----------|
| Incomplete formula | Deny activation_complete; route to appropriate ACT screen |
| Risk blocked | Remain on ACT-013 or support path; no bypass |
| Stale verification | ACT-012 recovery; re-issue challenge |

## 8. Non-claims

```text
Does not mandate production email provider
Does not include mobile in launch formula
Does not claim regulatory compliance for terms/risk copy
```
