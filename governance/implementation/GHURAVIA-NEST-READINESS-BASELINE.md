# GHURAVIA Nest Intro and Readiness Decision Baseline

| Field | Value |
|-------|-------|
| **Baseline** | **GHURAVIA Nest Intro and Readiness Decision Baseline v0.5.0** |
| **Status** | **ACTIVE WITH CONDITIONS — NEST INTRO AND READINESS DECISION VERTICAL SLICE COMPLETE** |
| **Gate** | GHV.IMPLEMENTATION.0E |
| **Authorization** | GHV-IMP-AUTH-005 (consumed for completed 0E scope only) |
| **Date** | 2026-07-22 |

## Conditions (non-blocking for Gate PARTIAL)

```text
Synthetic fixture catalogue only
No production assessment validity claim
No expert review
No learner pilot
No earned identity
No Mastery
No Trust
No Prestige
No deployment
Native Arabic expert validation: NOT RUN
Public-launch Arabic approval: NOT GRANTED
ONB-006 Missions: NOT IMPLEMENTED
ONB-007 Horizon selection: NOT IMPLEMENTED
```

## Locked thresholds (unchanged)

| Score | Band | Label |
|-------|------|-------|
| ≥ 70 | READY_TO_FLY | Ready to Fly |
| ≥ 50 and &lt; 70 | GUIDED_SKIP | Guided Skip |
| &lt; 50 | NEST_RECOMMENDED | Nest Recommended |

Rounding: `Math.round((correctAnswers / totalItems) * 100)`.

## Fixture

Catalogue **v0.1.0** — TECHNICAL FIXTURE ONLY · LOCAL / AUTOMATED TEST ONLY.

## Identity / progression

```text
nestReadinessProgressionImpact = { xp:0, mastery:0, rank:0, prestige:0, trust:0 }
lineageAwarded: false · crossWingMajorCreated: false
evidenceSealIssued: false · fusionSignatureIssued: false
paymentEntitlementChanged: false
```
