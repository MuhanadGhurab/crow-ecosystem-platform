# Screen Baseline — Architecture 1B Preflight

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1B-SCR-PREFLIGHT |
| **Version** | 1.0.0 |
| **Status** | **PASS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1B (technical spike preflight) |
| **Related** | CR-002 · DEC-153 · MASTER-SCREEN-REGISTRY v1.2.0 · [SCREEN-BASELINE-ARCHITECTURE-PREFLIGHT.md](./SCREEN-BASELINE-ARCHITECTURE-PREFLIGHT.md) |

## Verdict

```text
PASS — 92 ACTIVE GOVERNED SCREENS AVAILABLE FOR TECHNICAL SPIKES
```

## Preflight checks

| Check | Result |
|-------|--------|
| Interface shells | **7** |
| Active governed screen IDs | **92** |
| **ACT-004** counted as active | **NO** (HISTORICAL_REFERENCE / SUPERSEDED_ALIAS) |
| **ACT-013** Accept Account Risk active | **YES** |
| Aliases in inventory table | **0** |
| Duplicate active canonical IDs | **0** |

## Seven-shell roll-up

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

## CR-002 validation links

| Document | Role |
|----------|------|
| [CR-002-SCREEN-ALIAS-INFLATION-REMEDIATION.md](../../../governance/changes/CR-002-SCREEN-ALIAS-INFLATION-REMEDIATION.md) | Remediation change record |
| [CR-002-ACTIVE-SCREEN-VALIDATION.md](../../../governance/corrections/CR-002-ACTIVE-SCREEN-VALIDATION.md) | Post-CR-002 inventory PASS |
| [GHV.ARCHITECTURE.1A-AMENDMENT-01.md](../../../governance/gates/GHV.ARCHITECTURE.1A-AMENDMENT-01.md) | Gate amendment tying preflight to CR-002 |
| [ARCHITECTURE-1A-CR002-IMPACT-REVIEW.md](../governance/ARCHITECTURE-1A-CR002-IMPACT-REVIEW.md) | Architecture impact review |

## Non-claims

- This preflight authorizes **spike harness fixtures** referencing the 92 ACTIVE IDs — not Product Code.
- Learning and Progression design baselines are **unchanged**.
- P1 spikes SPK-ARC-002 / SPK-ARC-004 may consume this baseline as input; passing this preflight is not spike PASS.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B — spike-ready screen baseline PASS |
