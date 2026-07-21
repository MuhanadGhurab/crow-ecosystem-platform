# CR-002 — Active Screen Inventory Validation

| Field | Value |
|-------|-------|
| **Document ID** | GHV-CR-002-ACTIVE-SCREEN-VALIDATION |
| **Version** | 1.0.0 |
| **Status** | **PASS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1A-AMENDMENT-01 |
| **Related** | CR-002 · DEC-153 · MASTER-SCREEN-REGISTRY v1.2.0 · SCREEN-BASELINE-ARCHITECTURE-PREFLIGHT |

## Verdict

```text
PASS — CR-002 PRODUCES 92 GOVERNED SCREENS WITHOUT ALIAS INFLATION
```

## Inventory invariants

| Check | Result |
|-------|--------|
| Interface shells | **7** |
| Active governed screen IDs | **92** |
| Superseded aliases counted as active | **0** |
| Historical references counted as active | **0** |
| State overlays counted as standalone (ungoverned) | **0** |
| Duplicate active canonical IDs | **0** |

## Named ID treatment

| ID | Classification | Counted in active 92 |
|----|----------------|----------------------|
| **ACT-004** | HISTORICAL_REFERENCE / SUPERSEDED_ALIAS (appendix → ACT-011) | **NO** |
| **ACT-013** | ACTIVE_SCREEN — Accept Account Risk | **YES** |

## Shell roll-up

| Shell | Count |
|-------|------:|
| Public | 8 |
| Activation | 12 |
| Onboarding | 14 |
| Core | 39 |
| Commercial | 6 |
| Trust | 6 |
| Admin | 7 |
| **Total** | **92** |

```text
8 + 12 + 14 + 39 + 6 + 6 + 7 = 92
```

## Activation ACTIVE set (12)

ACT-001, ACT-002, ACT-003, ACT-005, ACT-006, ACT-007, ACT-008, ACT-009, ACT-010, ACT-011, ACT-012, **ACT-013**.

ACT-004 is **not** in this set.

## Mapping completeness (ACT-013)

| Mapping | Evidence |
|---------|----------|
| Current purpose | Capture `account_risk_status = acceptable` |
| Shell | Activation |
| Journey | MASTER-USER-JOURNEY (ACT-005 → ACT-013 → ACT-006) |
| Capability | CAP-ONB-014 |
| Flow | FLOW-001 / FLOW-001-DONE |
| Wireframe | GHV-WF-ACT-013 · ACTIVATION-WIREFRAMES |
| Launch classification | CONTROLLED LAUNCH · DETAILED · P0 |
| Auth / assurance | Server-authoritative risk state; does not alone grant A1 / entitlement / XP |

## Non-claims

- Does not authorize Product Code.
- Does not change Learning or Progression design baselines.
- Does not invent a second email-verification screen.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | Initial validation for Amendment-01 |
