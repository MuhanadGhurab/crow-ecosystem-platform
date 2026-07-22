# Implementation 0C — Browser Evidence Matrix (CLOSURE-01)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0C-BROWSER-EV-001 |
| **Gate** | GHV.IMPLEMENTATION.0C-CLOSURE-01 |
| **Date** | 2026-07-22 |
| **Spec** | `apps/web/e2e/activation-flow.spec.ts` |

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
| ER-SESS | session expiry clears private route access | session-expire | terms redirected | n/a | REQUIRED |
| AX-ALL | authorized and major states | progressive states | Critical/Serious 0 | YES | REQUIRED |

## Roll-up

```text
Mandatory scenarios defined: 19
Mandatory scenarios automated: 19
Mandatory scenarios passing: 19
Mandatory scenarios NOT RUN: 0
```

Idempotency replay/conflict covered by unit tests in `apps/web/test/idempotency.test.ts` (mandatory Closure evidence retained).
Local Playwright: **19 passed** (2026-07-22 Closure run).