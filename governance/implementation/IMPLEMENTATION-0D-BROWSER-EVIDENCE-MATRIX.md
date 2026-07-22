# IMPLEMENTATION-0D — Browser Evidence Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0D-BROWSER-EVIDENCE |
| **Gate** | GHV.IMPLEMENTATION.0D · amended by **GHV.IMPLEMENTATION.0D-CLOSURE-01** |
| **Spec** | `apps/web/e2e/onboarding-flow.spec.ts` |
| **Validator** | `scripts/validation/validate-onboarding-browser-evidence.mjs` |
| **Inventory authority** | Independent validator list (not derived from this matrix) |

## Roll-up

| Metric | Count |
|--------|------:|
| Mandatory scenarios defined | 22 |
| Automated | 22 |
| Passing | 22 |
| Mandatory NOT RUN | 0 |
| Required accessibility states | 12 |

Mandatory scenarios defined: 22  
Required accessibility states: 12

## Mandatory scenarios (22)

| ID | Scenario title (must appear in spec + this matrix) | Setup | Route | Expected screen | Expected persisted state | Keyboard | A11y | Local result | CI result |
|----|-----------------------------------------------------|-------|-------|-----------------|--------------------------|----------|------|--------------|-----------|
| OD-BR-001 | guided keyboard personalization to nest handoff | Activated synthetic session | `/onboarding/*` guided | ONB-003 | Origin COMPLETE · Nest handoff | Required | Covered in OD-BR-022 | PASS | PASS |
| OD-BR-002 | quick-start keyboard path to origin and nest | Activated | Quick-start → Origin → Review Later | ONB-003 | Origin REVIEW_LATER | Required | Covered in OD-BR-022 | PASS | PASS |
| OD-BR-003 | refresh after Crow basics | Guided · save Crow basics | Reload on Habitat | IDN-002 | Crow selections persist · version unchanged · no duplicate SAVE_CROW_BASICS | Required | — | PASS | PASS |
| OD-BR-004 | refresh after Habitat | Crow + Habitat saved | Reload on Character | IDN-003 | Habitat persists · server state authoritative | Required | — | PASS | PASS |
| OD-BR-005 | refresh after Character | Crow + Habitat + Character | Reload on Crow review | IDN-001 review | Character persists · privacy not falsely preaccepted | Required | — | PASS | PASS |
| OD-BR-006 | refresh after Origin draft | Quick-start · Origin draft saved | Reload on Origin | ONB-002 | Origin DRAFT · owner-only · no Nest inference | Required | — | PASS | PASS |
| OD-BR-007 | interrupted return resumes last incomplete governed step | Two incomplete states | Blocked advanced routes | IDN-002 then IDN-003 | Server resume via resolveResumeScreen | Required | — | PASS | PASS |
| OD-BR-008 | Quick-start duplicate retry is idempotent | Activated · fixed Idempotency-Key · `BEGIN_QUICK_START` | API + persistence | IDN-001 review | replayed · version/audit/outbox/receipt unchanged · catalogue 0.1.0 | API path | — | PASS | PASS |
| OD-BR-009 | same idempotency key with different onboarding payload | Guided then Quick-start same key | API | — | IDEMPOTENCY_CONFLICT · no extra audit/outbox | API path | — | PASS | PASS |
| OD-BR-010 | stale personalization write requires resubmission | Guided · version bump | `save-crow-basics` stale | IDN-001 | CONFLICT 409 | Mixed | Covered in OD-BR-022 | PASS | PASS |
| OD-BR-011 | stale Origin write requires resubmission | Quick-start · Origin draft | `save-origin-draft` stale | ONB-002 | CONFLICT 409 | Mixed | — | PASS | PASS |
| OD-BR-012 | cross-user isolation through session-bound aggregate | Two synthetic sessions | `/api/onboarding` | — | Second session cannot target first aggregateId | API path | — | PASS | PASS |
| OD-BR-013 | personalization catalogue-version conflict | Activated | `begin-guided` wrong catalogue | — | CATALOGUE_VERSION_CONFLICT | API path | Covered in OD-BR-022 | PASS | PASS |
| OD-BR-014 | Origin schema-version conflict | Quick-start · Origin | invalid goal option | ONB-002 | ORIGIN_SCHEMA_CONFLICT | API path | — | PASS | PASS |
| OD-BR-015 | ONB-002 blocked before minimum personalization | Activated only | `/onboarding/origin` | redirect | ONB-002 content not rendered | Required | — | PASS | PASS |
| OD-BR-016 | ONB-003 blocked before Origin completion or Review Later | Quick-start before Origin done | `/onboarding/nest-intro` | redirect | ONB-003 content not rendered | Required | — | PASS | PASS |
| OD-BR-017 | ONB-003 available after completed Origin | Guided · Origin COMPLETE | Nest + resume | ONB-003 | Nest handoff reachable | Required | Covered in OD-BR-022 | PASS | PASS |
| OD-BR-018 | Review Later reaches ONB-003 | Quick-start · Review Later | Nest intro | ONB-003 | Origin REVIEW_LATER · handoff | Required | Covered in OD-BR-022 | PASS | PASS |
| OD-BR-019 | locked cosmetic explanation remains preview-only | Guided Crow | IDN-001 | IDN-001 | Locked accessory note · preview only | Required | Covered in OD-BR-022 | PASS | PASS |
| OD-BR-020 | contrast acknowledgement gates continuation | Guided Crow | IDN-001 | IDN-001 | Continue disabled until ack | Required | — | PASS | PASS |
| OD-BR-021 | privacy preview acknowledgement gates review completion | Quick-start review | IDN-001 review | IDN-001 | Save review disabled until ack | Required | — | PASS | PASS |
| OD-BR-022 | Arabic/English parity and actual-state accessibility coverage | Activated + guided path | Entry + all major states | multiple | Locale switch parity · 12 axe states · critical/serious = 0 | Required | Required (12 states) | PASS | PASS |

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

## Historical note (pre-CLOSURE-01)

Original 0D inventory used **18** scenarios and a single generic refresh after `begin-guided`. CLOSURE-01 replaces that inventory with the independent **22**-scenario list above (state-specific refresh + Quick-start duplicate retry + corrected titles).

## Local / CI execution record

| Suite | Result |
|-------|--------|
| `apps/web/e2e/onboarding-flow.spec.ts` | **22 / 22 PASS** (recorded at Closure) |
| `apps/web/e2e/activation-flow.spec.ts` (regression) | **25 / 25 PASS** |
| Axe Critical/Serious on required 0D states | **0** |
| `validate:onboarding-browser-evidence` | PASS (22/12) |

Mandatory scenarios executed: 22  
Required accessibility states executed: 12  
Mandatory NOT RUN: 0

## Notes

- Keyboard-only user actions for governed CTAs (mirror 0C helpers).
- OD-BR-008 exercises real `BEGIN_QUICK_START` API, command receipts, audit, and outbox (not unit-only key generation).
- Cross-user isolation remains API-backed via session-bound aggregate identity.
- Keep IMPLEMENTATION-0C browser evidence validator unchanged and passing.
- Remote CI for the exact Closure HEAD must succeed before CLOSURE-01 formal PASS.
