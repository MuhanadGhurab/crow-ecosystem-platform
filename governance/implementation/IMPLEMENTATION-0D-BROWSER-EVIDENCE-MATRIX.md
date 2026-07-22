# IMPLEMENTATION-0D — Browser Evidence Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0D-BROWSER-EVIDENCE |
| **Gate** | GHV.IMPLEMENTATION.0D |
| **Spec** | `apps/web/e2e/onboarding-flow.spec.ts` |
| **Validator** | `scripts/validation/validate-onboarding-browser-evidence.mjs` |

## Roll-up

| Metric | Count |
|--------|------:|
| Mandatory scenarios defined | 18 |
| Required accessibility states | 12 |

Mandatory scenarios defined: 18  
Required accessibility states: 12

## Mandatory scenarios (18)

| # | Scenario title (must appear in spec + this matrix) | Evidence intent |
|---|----------------------------------------------------|-----------------|
| 1 | guided keyboard personalization to nest handoff | Full guided path via keyboard-only actions |
| 2 | quick-start keyboard path to origin and nest | Quick-start defaults via keyboard |
| 3 | refresh resume returns to authorized screen | Server-authoritative resume after reload |
| 4 | stale personalization write requires resubmission | Optimistic version conflict on crow/habitat write |
| 5 | stale origin write requires resubmission | Optimistic version conflict on origin write |
| 6 | identical onboarding command idempotent replay | Same Idempotency-Key + payload → replayed |
| 7 | same idempotency key with different onboarding payload | IDEMPOTENCY_CONFLICT |
| 8 | cross-user isolation via session-bound aggregate | API-backed: second session cannot mutate first aggregate |
| 9 | catalogue-version conflict on personalization | CATALOGUE_VERSION_CONFLICT |
| 10 | origin-schema conflict on invalid goal | ORIGIN_SCHEMA_CONFLICT |
| 11 | ONB-002 guard before minimum personalization | Server redirect away from Origin |
| 12 | ONB-003 guard before origin complete or review-later | Server redirect away from Nest intro |
| 13 | review-later path reaches nest handoff | MARK_ORIGIN_REVIEW_LATER → ONB-003 |
| 14 | locked cosmetic explanation is preview only | Locked accessory/habitat/character note visible |
| 15 | contrast adjustment acknowledgment required | Contrast checkbox gates crow continue |
| 16 | privacy preview acknowledgment on review | Privacy checkbox gates save review |
| 17 | Arabic and English locale parity on entry | Language switch updates ONB-001 copy |
| 18 | actual-state accessibility states | Axe on listed major states |

## Required accessibility states (12)

| Label | Screen / condition |
|-------|--------------------|
| ONB-001 entry handoff | Entry before path chosen |
| ONB-001 guided begun | After begin-guided |
| IDN-001 crow personalize | Crow form ready |
| IDN-001 locked accessory | Locked cosmetic explanation |
| IDN-002 habitat | Habitat select |
| IDN-003 character | Character select |
| IDN-001 personalization review | Review + privacy |
| ONB-002 origin ready | Origin form |
| ONB-002 origin review-later | After review-later |
| ONB-003 nest handoff | Nest intro handoff |
| onboarding stale-conflict error state | Stale version alert |
| onboarding catalogue-conflict error state | Catalogue version alert |

## Local execution record (2026-07-22)

| Suite | Result |
|-------|--------|
| `apps/web/e2e/onboarding-flow.spec.ts` | **18 / 18 PASS** |
| `apps/web/e2e/activation-flow.spec.ts` (regression) | **25 / 25 PASS** |
| Combined Playwright | **43 / 43 PASS** |
| Axe Critical/Serious on required 0D states | **0** |

Mandatory scenarios executed: 18  
Required accessibility states executed: 12  

## Notes

- Keyboard-only user actions for governed CTAs (mirror 0C helpers).
- Cross-user isolation is API-backed when dual-browser session setup is impractical; still listed as a mandatory scenario.
- Keep IMPLEMENTATION-0C browser evidence validator unchanged and passing.
- Remote CI for the exact pushed HEAD must still succeed before Gate formal closure.
