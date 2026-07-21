# Prestige Formula

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-FRM-PRS-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **IDs** | FRM-PRS-001 · POL-PRS-001 |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

## IDs

```text
FRM-PRS-001     Prestige Eligibility Index
POL-PRS-001     Prestige hard-gate and quorum policy
```

## Purpose

Define an **internal nomination index only**. It must not be displayed as a public Prestige score. A score may open review eligibility; it cannot automatically grant Prestige.

---

# FRM-PRS-001 — Prestige Eligibility Index

### Candidate dimensions

| Dimension                       |  Weight |
| ------------------------------- | ------: |
| Mastery depth                   |      30 |
| Breadth                         |      20 |
| Evidence quality                |      20 |
| Trust and integrity             |      15 |
| Verified impact or contribution |      10 |
| Sustained responsibility        |       5 |
| **Total**                       | **100** |

### Exact equation

```text
Prestige Eligibility Index =
Σ(Normalized Dimension Score × Dimension Weight)
```

Normalized Dimension Score is 0–1 (or 0–100 scaled equivalently before weighting). Output PEI on 0–100 scale.

---

# POL-PRS-001 — Hard gates and quorums

### Ascendant Raven

```text
PEI ≥ 72
at least 2 Route-Proven records
Strong capability demonstration in at least 2 capability domains
Trust ≥ POSITIVE_STANDING
at least 1 verified impact or contribution artifact
3-person panel
at least 2 approvals
```

### Apex Raven

```text
PEI ≥ 84
at least 3 Route-Proven records or governed equivalent
one Cross-Wing or integrated capability record
Breadth Index ≥ 65
Trust = ELEVATED_RESPONSIBILITY_ELIGIBLE
4-person panel
at least 3 approvals
```

### Obsidian Raven

```text
PEI ≥ 94
advanced or exceptional Evidence across multiple domains
Breadth Index ≥ 80
verified integrated capability
sustained impact across at least 2 review periods
Trust = ELEVATED_RESPONSIBILITY_ELIGIBLE
5-person panel
at least 4 approvals
```

### Founder-conflict rule

* Founder status does not grant Prestige.
* The founder cannot approve their own Prestige.
* The founder must recuse where a material conflict exists.
* No one person may independently grant Obsidian Raven.

All thresholds and panel rules remain candidates pending `1C`.

## Prohibited inputs

* Payment.
* Public popularity alone.
* Automatic grant from PEI without panel.

## Explainability text

“Meeting the eligibility threshold opens a human review. It does not automatically grant Prestige.”

## Simulation scenarios

PER-015; RUN-001

## Known risks

Founder conflict; PEI treated as public score; panel capture.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial PEI + hard-gate candidates under GHV.PROGRESSION.1B |
