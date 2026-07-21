# Scope Traceability Matrix

| Field | Value |
|-------|-------|
| **Status** | REVIEWED — GHV.BASELINE-CORRECTION.1 (Master Screen Registry **7/92 CORRECTED AND LOCKED** · Progression Design Baseline v1.0.0 LOCKED · Learning Design Baseline v1.0.0 LOCKED) |
| **Version** | 1.11.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 |
| **Related** | [CAPABILITY-REGISTRY.md](./CAPABILITY-REGISTRY.md) · [MASTER-SCREEN-REGISTRY.md](./screens/MASTER-SCREEN-REGISTRY.md) · [LEARNING-PORTFOLIO-MANIFEST.md](./learning/governance/LEARNING-PORTFOLIO-MANIFEST.md) · [progression/governance/PROGRESSION-BASELINE-MANIFEST.md](./progression/governance/PROGRESSION-BASELINE-MANIFEST.md) · [progression/governance/FINAL-FORMULA-VERSION-REGISTRY.md](./progression/governance/FINAL-FORMULA-VERSION-REGISTRY.md) |

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
→ Progression Design Baseline Lock
```

Learning Design Baseline v1.0.0 remains LOCKED AS DESIGN BASELINE (unchanged by Progression 1A–1D).

Progression Design Baseline v1.0.0 is LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE (conditional locks: MOM-002 · TRU · PRS · POL-POP).

## Progression architecture links (1A)

| Capability / theme | Artifact | Status |
|--------------------|----------|--------|
| Separation | [PROGRESSION-SYSTEM-SEPARATION.md](./progression/architecture/PROGRESSION-SYSTEM-SEPARATION.md) | LOCKED AS DESIGN BASELINE |
| Invariants | [PROGRESSION-INVARIANTS.md](./progression/architecture/PROGRESSION-INVARIANTS.md) | LOCKED AS DESIGN BASELINE |
| Events | [PROGRESSION-EVENT-REGISTRY.md](./progression/events/PROGRESSION-EVENT-REGISTRY.md) | Exact **53** |
| States | [PROGRESSION-STATE-REGISTRY.md](./progression/architecture/PROGRESSION-STATE-REGISTRY.md) | Exact **78** |
| Decisions | [PROGRESSION-DECISION-REGISTRY.md](./progression/architecture/PROGRESSION-DECISION-REGISTRY.md) | Exact **21** |
| Screen presentation | [PROGRESSION-PRESENTATION.md](./wireframes/progression/PROGRESSION-PRESENTATION.md) | Low-fi locked |

## Progression formula / simulation / calibration (1B–1C) — evidence under 1D lock

| Capability / theme | Artifact | Status |
|--------------------|----------|--------|
| Final formula versions | [FINAL-FORMULA-VERSION-REGISTRY.md](./progression/governance/FINAL-FORMULA-VERSION-REGISTRY.md) | **Authoritative** · 24 IDs · one active version |
| Formula registry (supporting) | [PROGRESSION-FORMULA-REGISTRY.md](./progression/formulas/PROGRESSION-FORMULA-REGISTRY.md) | Supporting index |
| Simulation evidence | [progression/simulation/](./progression/simulation/) · [analysis/progression-simulation/](../analysis/progression-simulation/) | RUN-001…013 COMPLETE synthetic |
| Calibration package | [progression/calibration/](./progression/calibration/) | Synthetic · absorbed into design lock |
| Counterfactual fairness | [COUNTERFACTUAL-FAIRNESS-TESTS.md](./progression/calibration/COUNTERFACTUAL-FAIRNESS-TESTS.md) | **10/10 PASS** (synthetic) |
| Integrity red-team | [RED-TEAM-SIMULATION-REPORT.md](./progression/simulation/RED-TEAM-SIMULATION-REPORT.md) | **20/20 PASS** (design) |

## Progression Design Baseline (1D)

| Capability / theme | Artifact | Status |
|--------------------|----------|--------|
| Baseline manifest | [PROGRESSION-BASELINE-MANIFEST.md](./progression/governance/PROGRESSION-BASELINE-MANIFEST.md) | **v1.0.0 LOCKED** |
| Change Freeze | [PROGRESSION-CHANGE-FREEZE-POLICY.md](./progression/governance/PROGRESSION-CHANGE-FREEZE-POLICY.md) | Active after 1D |
| Calibration handoff | [PROGRESSION-CALIBRATION-HANDOFF.md](./progression/governance/PROGRESSION-CALIBRATION-HANDOFF.md) | Post-1D validation debt |
| Technical handoff | [PROGRESSION-TECHNICAL-HANDOFF.md](./progression/governance/PROGRESSION-TECHNICAL-HANDOFF.md) | Tech validation NOT RUN |

## Learning design baseline (LEARNING.1D) — unchanged authority

See [LEARNING-PORTFOLIO-MANIFEST.md](./learning/governance/LEARNING-PORTFOLIO-MANIFEST.md). Route-Proven qualitative conditions remain authoritative. Horizon-Proven awarding deferred. RT-ANL-001 remains reserve.

## Screen baseline (BASELINE-CORRECTION.1) — resolved

| Item | Status |
|------|--------|
| Authoritative shells / screens | **7 shells / 92 screens — ACTIVE** |
| MASTER-SCREEN-REGISTRY | **v1.1.0 CORRECTED AND LOCKED** |
| Correction Gate | **GHV.BASELINE-CORRECTION.1 — PASS** |
| Change / Decision | **CR-001** · **DEC-152** |
| Architecture Gate | **UNBLOCKED** for former screen-count dependency |
| Progression / Learning baselines | **Unchanged** |

### Activation capability trace

| Capability | Pillar | Scope | User type | Journey | Screen | Flow | Wireframe | State | Risk | Decision | Validation |
|------------|--------|-------|-----------|---------|--------|------|-----------|-------|------|----------|------------|
| CAP-ONB-003 | Trust | CONTROLLED LAUNCH | Learner | Activate | ACT-003 · ACT-011 | FLOW-001 | ACTIVATION-WIREFRAMES | Pending / Result | RISK-PRD-004 | DEC-152 | Doc COMPLETE · usability/tech NOT RUN |
| CAP-ONB-011 | Trust | CONTROLLED LAUNCH | Learner | Activate | ACT-011 | FLOW-001 result paths | ACTIVATION-WIREFRAMES | Outcome set | — | DEC-152 | Same |
| CAP-ONB-012 | Trust | CONTROLLED LAUNCH | Learner | Activate | ACT-012 | FLOW-001-REC / INT | ACTIVATION-WIREFRAMES | Recovery | — | DEC-152 | Same |
| CAP-ONB-013 | Trust | CONTROLLED LAUNCH | Learner | Activate | ACT-012 | Support | ACTIVATION-WIREFRAMES | Escalate | — | DEC-152 | Same |
| CAP-EBUX-009 | Trust | CORE + CONTROLLED LAUNCH | Learner | Activate+ | ACT-003/011/012 | Explainable Locks | EXPLAINABLE-LOCKS | Assurance | — | DEC-152 | Same |

No new screen lacks a capability owner. No affected capability points only to superseded ACT-004 as destination.

## Gaps intentionally open

| Item | Status |
|------|--------|
| Progression Design Baseline | **LOCKED** (design) |
| Real-user calibration / usability / technical validation | **NOT RUN** |
| Expert Review / Learning Pilot | NOT RUN |
| Publication / Implementation / Product Code | BLOCKED |
| Title catalogue | DEFERRED |
| Prestige panel operations | PENDING staffing |
| Screen registry reconciliation | **COMPLETE** (BASELINE-CORRECTION.1) |
| Runtime event/ledger implementation | PENDING ARCHITECTURE.1A |
| Treating formulas as production calibrated | **Forbidden** until real-user + tech path |
