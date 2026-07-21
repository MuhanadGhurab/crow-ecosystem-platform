# Progression Engine Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-PRG-ENG-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §21 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-009 · SPK-ARC-010 · SPK-ARC-011 · SPK-ARC-024 |
| **Related baselines** | **Progression Design Baseline v1.0.0** (GHV.PROGRESSION.1D) · product/progression/governance/PROGRESSION-BASELINE-MANIFEST.md · product/progression/governance/PROGRESSION-TECHNICAL-VALIDATION-PLAN.md · **Learning Design Baseline v1.0.0** |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
NO runtime engine in 1A
NO schema · NO Product Code
TECHNICAL VALIDATION remains NOT RUN at product baseline
```

## 1. Purpose

Define architecture-level validation for implementing (later) the locked Progression Design Baseline without altering Learning educational truth or accepting commercial pay-to-win.

## 2. Authoritative inventory (must be representable)

| Construct | Count | Source |
|-----------|------:|--------|
| Progression event types | **53** | PROGRESSION-EVENT-REGISTRY / Baseline Manifest |
| Event-validity states | **7** | PROGRESSION-EVENT-VALIDITY |
| Conceptual ledgers | **11** | PROGRESSION-LEDGER-MODEL |
| Progression states | **78** | PROGRESSION-STATE-REGISTRY |
| Progression decisions | **21** | PROGRESSION-DECISION-REGISTRY |
| Locked formulas / policies / templates | **24** | FINAL-FORMULA-VERSION-REGISTRY (FRM/POL/TPL IDs) |

Link product baselines — do not duplicate equations here.

## 3. Engine properties to validate

| Property | Requirement | Spike |
|----------|-------------|-------|
| Idempotency | Duplicate keys must not double-apply standing | SPK-ARC-010 |
| Event ordering | Deterministic application rules | SPK-ARC-010 |
| Effective vs recorded timestamps | Separated where required | SPK-ARC-010 |
| Formula-version storage | Persist FRM/POL version with standing writes | SPK-ARC-011 |
| Deterministic rounding | Same inputs → same outputs | SPK-ARC-011 |
| Local recalculation | Recompute from events matches stored standing | SPK-ARC-010 |
| Reversals / supersede | Governed compensating events | SPK-ARC-010 |
| Appeal effects | POL-COR cascade mathematics | SPK-ARC-019 |
| Provisional standings | Marked until confirmation | SPK-ARC-010 |
| Historical reproduction | Old formula versions reproduce past standing | SPK-ARC-011 |
| Trust privacy | Trust non-public per policy | SPK-ARC-013 |
| Human Prestige decisions | Quorum path; no payment grant | SPK-ARC-019 |
| Leaderboard snapshots | Population thresholds POL-POP-001 | SPK-ARC-024 |
| Merit referral boundary | Merit ≠ progression value | SPK-ARC-012 |

## 4. Required later spikes (scenarios)

| Scenario | Intent |
|----------|--------|
| Duplicate events | Idempotent apply |
| Late events | Ordering / effective time |
| Reversed Evidence | Targeted cascade (SPK-ARC-009) |
| Formula migration | Versioned migration without silent rewrite |
| Partial recalculation | Performance + correctness |
| Concurrent updates | Conflict policy |
| Correction reversal | Audit + compensating events |

## 5. Cross-baseline links

| Baseline | Relationship |
|----------|--------------|
| Learning Design Baseline v1.0.0 | Evidence / Route-Proven inputs; graph eligibility unchanged by XP |
| Progression Design Baseline v1.0.0 | Authoritative formulas, events, ledgers, decisions |
| Product screen baseline (92) | Progression UX screens; ACT-013 not a progression grant |

Conditional locks retained from 1D: FRM-MOM-002 · POL-TRU-001 · FRM/POL-PRS · POL-POP-001 — must remain visible to engine validation.

## 6. Hard prohibitions

* No runtime progression engine created in 1A.
* Commercial events must not write progression value.
* Analytics must not become progression authority.

## 7. Limitations

```text
VALIDATION PLAN ONLY · SPIKES NOT RUN · DECISION PENDING
Real-user calibration NOT RUN · Usability NOT RUN
```

## 8. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §21 — progression engine validation plan |
