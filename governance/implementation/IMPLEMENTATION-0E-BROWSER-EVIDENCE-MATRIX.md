# IMPLEMENTATION-0E — Browser Evidence Matrix

| Field | Value |
|-------|-------|
| **Gate** | GHV.IMPLEMENTATION.0E |
| **Date** | 2026-07-22 |

## Required scenarios

| # | Scenario | Status |
|---|----------|--------|
| 1 | Origin COMPLETE → ONB-003 | PENDING |
| 2 | Origin REVIEW_LATER → ONB-003 | PENDING |
| 3 | Origin incomplete direct ONB-003 denied | PENDING |
| 4 | Intro → readiness check | PENDING |
| 5 | Intro → Nest path handoff | PENDING |
| 6 | ONB-004 loads ten items | PENDING |
| 7 | Answer saves | PENDING |
| 8 | Reload resumes | PENDING |
| 9 | Previous/next works | PENDING |
| 10 | Incomplete submission blocked | PENDING |
| 11 | Low score → Nest Recommended | PENDING |
| 12 | 50 score → Guided Skip | PENDING |
| 13 | 60 score → Guided Skip | PENDING |
| 14 | 70 score → Ready to Fly | PENDING |
| 15 | 100 score → Ready to Fly | PENDING |
| 16 | Ready result weak areas safe | PENDING |
| 17 | Guided result support areas safe | PENDING |
| 18 | Recommended → only ONB-006 | PENDING |
| 19 | Ready/Guided → ONB-007 handoff | PENDING |
| 20 | Direct ONB-005 before submit denied | PENDING |
| 21 | Direct ONB-007 for Nest Recommended denied | PENDING |
| 22 | Idempotent answer replay | PENDING |
| 23 | Idempotent submit replay | PENDING |
| 24 | Stale version conflict recovery | PENDING |
| 25 | Catalogue conflict recovery | PENDING |
| 26 | Offline save warning | PENDING |
| 27 | Resume after sign-in | PENDING |
| 28 | Score does not change Wingprint/progression/Trust | PENDING |

## Accessibility

| # | Scenario | Status |
|---|----------|--------|
| A1 | Headings and landmarks | PENDING |
| A2 | Keyboard-only intro | PENDING |
| A3 | Keyboard radio selection | PENDING |
| A4 | Question fieldset/legend | PENDING |
| A5 | Progress announcement | PENDING |
| A6 | Error association | PENDING |
| A7 | Focus after next | PENDING |
| A8 | Focus on result heading | PENDING |
| A9 | Non-color band distinction | PENDING |
| A10 | Reduced-motion behavior | PENDING |
| A11 | Arabic RTL order | PENDING |
| A12 | Offline/error live-region | PENDING |

## Regression baseline (pre-0E)

```text
Activation: 25 / 25 PASS
0D onboarding: 22 / 22 PASS
0D accessibility: 12 / 12 PASS
Existing Playwright: 47 PASS before new 0E additions
```

## 0E Playwright additions (local)

| Scenario title | Status |
|----------------|--------|
| take readiness check reaches assessment and result Ready to Fly | COVERED |
| Nest Recommended blocks ONB-007 and unlocks Nest learning handoff | COVERED |
| start with The Nest from intro reaches ONB-006 handoff | COVERED |
| ONB-004 nest assessment (axe) | COVERED |
| ONB-005 nest result ready (axe) | COVERED |
| ONB-006 nest learning handoff (axe) | COVERED |
| ONB-007 horizon handoff (axe) | COVERED |

Threshold band matrix rows 12–15 are covered by domain unit tests (`nest-readiness.test.ts`) with e2e covering 0 and 100 endpoints.

```text
Final Playwright (local CI): 50 / 50 PASS
npm run ci: PASS (local)
```
