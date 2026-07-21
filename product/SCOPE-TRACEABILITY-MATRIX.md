# Scope Traceability Matrix

| Field | Value |
|-------|-------|
| **Status** | REVIEWED — GHV.PROGRESSION.1C (CALIBRATION RECOMMENDED · PENDING 1D) |
| **Version** | 1.9.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Related** | [CAPABILITY-REGISTRY.md](./CAPABILITY-REGISTRY.md) · [LEARNING-PORTFOLIO-MANIFEST.md](./learning/governance/LEARNING-PORTFOLIO-MANIFEST.md) · [progression/README.md](./progression/README.md) · [progression/formulas/PROGRESSION-FORMULA-REGISTRY.md](./progression/formulas/PROGRESSION-FORMULA-REGISTRY.md) · [progression/calibration/README.md](./progression/calibration/README.md) |

## Traceability chain (progression + calibration)

```text
Product Pillar
→ User Type
→ Journey Phase
→ Screen
→ Progression System
→ Source Event
→ Formula Version
→ Calibration Cohort
→ Test
→ Result
→ State
→ Decision
→ Explanation
→ Appeal or Correction
→ Simulation / Calibration Evidence
```

Learning Design Baseline v1.0.0 remains LOCKED AS DESIGN BASELINE (unchanged by 1C).

## Progression architecture links (1A)

| Capability / theme | Artifact | Status |
|--------------------|----------|--------|
| Separation | [PROGRESSION-SYSTEM-SEPARATION.md](./progression/architecture/PROGRESSION-SYSTEM-SEPARATION.md) | ARCHITECTURE RECOMMENDED |
| Invariants | [PROGRESSION-INVARIANTS.md](./progression/architecture/PROGRESSION-INVARIANTS.md) | ARCHITECTURE RECOMMENDED |
| Events | [PROGRESSION-EVENT-REGISTRY.md](./progression/events/PROGRESSION-EVENT-REGISTRY.md) | Exact **53** |
| States | [PROGRESSION-STATE-REGISTRY.md](./progression/architecture/PROGRESSION-STATE-REGISTRY.md) | Exact **78** |
| Decisions | [PROGRESSION-DECISION-REGISTRY.md](./progression/architecture/PROGRESSION-DECISION-REGISTRY.md) | Exact **21** |
| Flight XP | [FLIGHT-XP-ARCHITECTURE.md](./progression/xp/FLIGHT-XP-ARCHITECTURE.md) | ARCHITECTURE RECOMMENDED |
| Momentum | [MOMENTUM-LEAGUE-ARCHITECTURE.md](./progression/momentum/MOMENTUM-LEAGUE-ARCHITECTURE.md) | ARCHITECTURE RECOMMENDED |
| Maturity | [MATURITY-RANK-ARCHITECTURE.md](./progression/maturity/MATURITY-RANK-ARCHITECTURE.md) | ARCHITECTURE RECOMMENDED |
| Mastery | [ROUTE-MASTERY-ARCHITECTURE.md](./progression/mastery/ROUTE-MASTERY-ARCHITECTURE.md) | ARCHITECTURE RECOMMENDED |
| Breadth | [BREADTH-ARCHITECTURE.md](./progression/breadth/BREADTH-ARCHITECTURE.md) | ARCHITECTURE RECOMMENDED |
| Trust | [TRUST-STANDING-ARCHITECTURE.md](./progression/trust/TRUST-STANDING-ARCHITECTURE.md) | ARCHITECTURE RECOMMENDED |
| Titles | [PROFESSIONAL-TITLE-ARCHITECTURE.md](./progression/titles/PROFESSIONAL-TITLE-ARCHITECTURE.md) | CATALOGUE DEFERRED |
| Prestige | [PRESTIGE-ARCHITECTURE.md](./progression/prestige/PRESTIGE-ARCHITECTURE.md) | HUMAN REVIEW REQUIRED |
| Achievements | [ACHIEVEMENT-CREST-ARCHITECTURE.md](./progression/achievements/ACHIEVEMENT-CREST-ARCHITECTURE.md) | ARCHITECTURE RECOMMENDED |
| Leaderboards | [LEADERBOARD-ARCHITECTURE.md](./progression/leaderboards/LEADERBOARD-ARCHITECTURE.md) | No universal board |
| Scenarios | [PROGRESSION-ARCHITECTURE-SCENARIOS.md](./progression/scenarios/PROGRESSION-ARCHITECTURE-SCENARIOS.md) | SCN-001–015 PASS |
| Screen presentation | [PROGRESSION-PRESENTATION.md](./wireframes/progression/PROGRESSION-PRESENTATION.md) | Low-fi locked |

## Progression formula / simulation links (1B)

| Capability / theme | Artifact | Status |
|--------------------|----------|--------|
| Formula registry | [PROGRESSION-FORMULA-REGISTRY.md](./progression/formulas/PROGRESSION-FORMULA-REGISTRY.md) | **24** IDs · CALIBRATION RECOMMENDED · PENDING 1D |
| Simulation evidence | [progression/simulation/](./progression/simulation/) · [analysis/progression-simulation/](../analysis/progression-simulation/) | RUN-001…013 COMPLETE synthetic |

## Calibration links (1C)

| Capability / theme | Artifact | Status |
|--------------------|----------|--------|
| Calibration package | [progression/calibration/](./progression/calibration/) | CALIBRATION RECOMMENDED · PENDING 1D |
| Mandatory findings | [MANDATORY-CALIBRATION-FINDINGS.md](./progression/calibration/MANDATORY-CALIBRATION-FINDINGS.md) | CAL-FND-001…007 |
| Multi-seed population | [MULTI-SEED-POPULATION-REPORT.md](./progression/simulation/MULTI-SEED-POPULATION-REPORT.md) | 25k · seeds 20260721–20260725 |
| Launch-realistic Cohort B | [LAUNCH-REALISTIC-COHORT-REPORT.md](./progression/simulation/LAUNCH-REALISTIC-COHORT-REPORT.md) | RP 22.88% · Asc 0% |
| Counterfactual fairness | [COUNTERFACTUAL-FAIRNESS-TESTS.md](./progression/calibration/COUNTERFACTUAL-FAIRNESS-TESTS.md) | **10/10 PASS** |
| Integrity red-team | [PROGRESSION-INTEGRITY-RED-TEAM.md](./progression/calibration/PROGRESSION-INTEGRITY-RED-TEAM.md) · [RED-TEAM-SIMULATION-REPORT.md](./progression/simulation/RED-TEAM-SIMULATION-REPORT.md) | **20/20 PASS** |
| Calibration handoff | [PROGRESSION-CALIBRATION-HANDOFF.md](./progression/governance/PROGRESSION-CALIBRATION-HANDOFF.md) | → 1D |
| Acceptance matrix | [CALIBRATION-ACCEPTANCE-MATRIX.md](./progression/calibration/CALIBRATION-ACCEPTANCE-MATRIX.md) | 19 advance · 5 WITH CONDITIONS |

## Learning design baseline (1D) — unchanged authority

See [LEARNING-PORTFOLIO-MANIFEST.md](./learning/governance/LEARNING-PORTFOLIO-MANIFEST.md). Route-Proven qualitative conditions remain authoritative. Horizon-Proven awarding deferred. RT-ANL-001 remains reserve.

## Gaps intentionally open

| Item | Status |
|------|--------|
| Progression calibration | **COMPLETE AT SYNTHETIC LEVEL** — NOT production calibrated |
| Final Progression Baseline lock | PENDING GHV.PROGRESSION.1D |
| Expert Review / Learning Pilot | NOT RUN |
| Real-user calibration / usability | NOT RUN |
| Publication / Implementation / Product Code | BLOCKED |
| Title catalogue | DEFERRED |
| Prestige panel operations | PENDING staffing |
| Runtime event/ledger implementation | PENDING ARCHITECTURE.1 |
| Treating formulas as FINAL / production calibrated | **Forbidden** until 1D + real-user path |
