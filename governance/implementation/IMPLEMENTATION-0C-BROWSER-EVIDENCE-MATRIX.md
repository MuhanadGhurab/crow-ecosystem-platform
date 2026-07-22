# Implementation 0C — Browser Evidence Matrix (CLOSURE-02)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0C-BROWSER-EV-001 |
| **Gate** | GHV.IMPLEMENTATION.0C-CLOSURE-02 |
| **Date** | 2026-07-22 |
| **Spec** | `apps/web/e2e/activation-flow.spec.ts` |
| **Predecessor** | CLOSURE-01 matrix (19 scenarios) amended — not deleted |

## Mandatory scenarios

| Scenario ID | Test name | Setup | Expected | Axe | Status |
|-------------|-----------|-------|----------|-----|--------|
| KB-001 | complete flow uses keyboard for all user actions | synthetic session | ACT-003→…→ONB-001 keyboard only | via state suite | REQUIRED |
| RG-005 | ACT-005 before email verification | session, email unverified | server redirect · no ACT-005 | n/a | REQUIRED |
| RG-013 | ACT-013 before terms acceptance | email verified | server redirect · no ACT-013 | n/a | REQUIRED |
| RG-006 | ACT-006 before activation | incomplete | server redirect · no ACT-006 | n/a | REQUIRED |
| RG-007 | ACT-007 before activation | incomplete | server redirect · no ACT-007 | n/a | REQUIRED |
| RG-ONB | ONB-001 before activation | incomplete | server redirect · no bootstrap | n/a | REQUIRED |
| RG-012 | ACT-012 without recoverable condition | incomplete | server redirect · no ACT-012 | n/a | REQUIRED |
| RG-ACT | activated account may open ACT-006 ACT-007 ONB-001 | activated | all allowed | n/a | REQUIRED |
| RF-REQ | after verification requested | delivery accepted | resume ACT-003 | n/a | REQUIRED |
| RF-EMAIL | after email verified | email verified | terms accessible | n/a | REQUIRED |
| RF-TERMS | after terms accepted | terms done | ONB blocked | n/a | REQUIRED |
| RF-DONE | after activation complete | activated | ONB allowed | n/a | REQUIRED |
| ER-PF | provider failure | provider-mode failure | error summary | n/a | REQUIRED |
| ER-TO | provider timeout | provider-mode timeout | error summary | n/a | REQUIRED |
| ER-EXP | expired challenge | challenge-expire | error summary | n/a | REQUIRED |
| ER-SUP | superseded challenge | resend | old rejected · new ok | n/a | REQUIRED |
| ER-STALE | stale version requires explicit resubmission | version bump | conflict then accept | n/a | REQUIRED |
| ER-REPLAY | identical logical command replay | fixed Idempotency-Key · RequestEmailVerification | replayed · no duplicate audit/outbox/delivery | n/a | REQUIRED |
| ER-IDEMPOTENCY-CONFLICT | same idempotency key with different payload | fixed key · different reason fingerprint | 409 IDEMPOTENCY_CONFLICT · localized UX · focus | n/a | REQUIRED |
| ER-SESS | session expiry clears private route access | session-expire | terms redirected | n/a | REQUIRED |
| AX-ALL | authorized and major states | progressive states | Critical/Serious 0 | YES | REQUIRED |

## Accessibility states under AX-ALL

| State ID | Setup control | Governed route | Expected screen | Expected major state | Expected lock/error | Axe | Critical | Serious | Result |
|----------|---------------|----------------|-----------------|----------------------|---------------------|-----|----------|---------|--------|
| ACT-003 pending | bootstrapSession | /activation/email-pending | ACT-003 | pending | — | YES | 0 | 0 | REQUIRED |
| ACT-011 invalid | invalid token confirm | /activation/email-result | ACT-011 | error summary | VALIDATION/challenge | YES | 0 | 0 | REQUIRED |
| ACT-011 expired | challenge-expire | /activation/email-result | ACT-011 | error summary | CHALLENGE_EXPIRED | YES | 0 | 0 | REQUIRED |
| ACT-011 verified | confirmEmail | /activation/email-result | ACT-011 | verified | — | YES | 0 | 0 | REQUIRED |
| ACT-005 ready | email verified | /activation/terms | ACT-005 | terms-ready | TERMS_NOT_ACCEPTED | YES | 0 | 0 | REQUIRED |
| ACT-005 validation error | submit without checkbox | /activation/terms | ACT-005 | terms-validation-error | validation | YES | 0 | 0 | REQUIRED |
| ACT-013 ready | terms accepted | /activation/account-risk | ACT-013 | risk form ready | ACCOUNT_RISK_NOT_ACCEPTED | YES | 0 | 0 | REQUIRED |
| ACT-013 locked representation | goto account-risk before terms | redirect → /activation/terms | ACT-005 (governed denial) | TERMS_NOT_ACCEPTED lock visible · no ACT-013 body | TERMS_NOT_ACCEPTED | YES | 0 | 0 | REQUIRED |
| ACT-012 recovery available | BEGIN_ACTIVATION_RECOVERY | /activation/recovery | ACT-012 | recovery | RECOVERY_REQUIRED | YES | 0 | 0 | REQUIRED |
| ACT-006 complete | activate | /activation/complete | ACT-006 | complete | — | YES | 0 | 0 | REQUIRED |
| ACT-007 optional | activated | /activation/mobile-optional | ACT-007 | optional | — | YES | 0 | 0 | REQUIRED |
| ONB-001 handoff | activated | /onboarding/entry | ONB-001 | handoff | — | YES | 0 | 0 | REQUIRED |
| session-expired safe state | session-expire then protected route | /activation/email-pending | ACT-003 | safe destination · no ACT-005 | session cleared | YES | 0 | 0 | REQUIRED |
| provider-failure error state | provider-mode failure | /activation/email-pending | ACT-003 | error summary | PROVIDER_UNAVAILABLE | YES | 0 | 0 | REQUIRED |
| stale-conflict error state | aggregate-version-bump | /activation/terms | ACT-005 | error summary | CONFLICT / stale | YES | 0 | 0 | REQUIRED |

Note: ACT-013 locked representation records the **user-visible governed denial** (redirect to ACT-005 with prerequisite Explainable Lock). It does **not** scan unauthorized ACT-013 content.

## Roll-up

```text
Mandatory scenarios defined: 21
Mandatory scenarios automated: 21
Mandatory scenarios passing: 21
Mandatory scenarios NOT RUN: 0

Required accessibility states: 15
States scanned: 15
Critical violations: 0
Serious violations: 0
Required states NOT RUN: 0
```

### Historical note (CLOSURE-01)

CLOSURE-01 automated 19 scenarios. Browser idempotency replay/conflict and full 15-state axe coverage were incomplete and are closed by CLOSURE-02. Unit-only `resolveIdempotencyKey()` tests are **not** substitutes for ER-REPLAY / ER-IDEMPOTENCY-CONFLICT.
