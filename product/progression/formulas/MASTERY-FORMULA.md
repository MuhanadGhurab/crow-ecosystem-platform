# Mastery Formula

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-FRM-MST-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **Formula IDs** | FRM-MST-001 · FRM-MST-002 · FRM-MST-003 |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

## Formula IDs

```text
FRM-MST-001     Evidence Item Score
FRM-MST-002     Capability Mastery Index (CMI)
FRM-MST-003     Route Mastery Index (RMI)
```

## Progression system

Capability Mastery / Route Mastery / Route-Proven eligibility

## Purpose

Map Evidence rubric quality into Capability and Route Mastery indices, and define numeric eligibility floors for Route-Proven consistent with the locked Learning Design Baseline.

## Prohibited inputs

* Payment / Access Plan.
* Flight XP.
* Momentum.
* Popularity.
* One exceptional artifact hiding a missing mandatory Evidence item.

---

# FRM-MST-001 — Evidence Item Score

### Evidence rubric mapping

```text
NOT_DEMONSTRATED = 0
DEVELOPING = 1
MEETS_STANDARD = 2
STRONG = 3
EXCEPTIONAL = 4
```

### Exact equations

```text
Evidence Item Score =
Weighted mean of applicable rubric dimensions
```

```text
Evidence Item Index =
Evidence Item Score ÷ 4 × 100
```

### Rules

* Critical rubric dimensions have a minimum floor.
* Missing mandatory dimensions cannot be averaged away.
* `EXCEPTIONAL` is never required for ordinary Route-Proven.
* Invalid or revoked Evidence contributes nothing to current Mastery.
* Historical records remain auditable.

---

# FRM-MST-002 — Capability Mastery Index (CMI)

### Candidate Evidence weights

```text
Formative Evidence = 1
Practical Evidence = 2
Capstone Evidence = 3
Integrated Cross-Wing Evidence = 3
```

### Exact equation

```text
Capability Mastery Index =
Σ(Valid Evidence Item Index × Evidence Weight)
÷
Σ(Evidence Weight)
```

### Output

```text
0–100
```

### Candidate state gates

#### NOT_ASSESSED

No approved valid Evidence.

#### DEVELOPING

```text
CMI < 50
or
a mandatory Evidence item is below MEETS_STANDARD
or
a critical rubric dimension is below MEETS_STANDARD
```

#### STANDARD_DEMONSTRATED

```text
CMI 50–69
all mandatory Evidence items ≥ MEETS_STANDARD
all critical dimensions ≥ MEETS_STANDARD
```

#### STRONG_DEMONSTRATION

```text
CMI 70–84
all mandatory Evidence items ≥ MEETS_STANDARD
at least two independent Evidence contexts
```

#### ADVANCED_DEMONSTRATION

```text
CMI 85–100
all critical dimensions ≥ STRONG
at least two independent Evidence contexts
capstone or integrated Evidence present
```

Freshness and integrity remain separate overlays.

---

# FRM-MST-003 — Route Mastery Index (RMI)

### Exact equation

```text
Route Mastery Index =
Weighted mean of required Capability Mastery Indices
```

The capability-weight table must be sourced from Route architecture.

Weights must sum to:

```text
100
```

### Route-Proven numeric eligibility floors

Consistent with Learning Baseline qualitative conditions:

```text
Every mandatory Capability Mastery Index ≥ 50

Every mandatory Evidence item ≥ MEETS_STANDARD

Every mandatory assessment = STANDARD_MET

Capstone Index ≥ 50

No unresolved mandatory remediation

No unresolved integrity issue

Required reviewer approval present
```

### Rules

* Route Mastery Index alone does not grant Route-Proven.
* One high capability cannot compensate for a mandatory capability below 50.
* Trust affects eligibility only where explicitly required by the Learning Baseline.
* Route-Proven conditions must remain consistent with the locked Learning Design.

## Rounding

Indices to 1 decimal; eligibility comparisons use rounded values.

## Missing / provisional / reversal / freshness

| Behavior | Rule |
|----------|------|
| Missing mandatory Evidence | Cannot meet Route-Proven floors |
| Provisional Evidence | Excluded from current Mastery |
| Reversal / revoke | Remove contribution; recalculate affected CMI/RMI |
| Freshness | Overlay via `POL-FRS-001` — do not subtract from historical Mastery |

## Explainability text

“Your Mastery is based on approved Evidence. Strong work cannot replace a missing required capability.”

## Simulation scenarios

PER-003; PER-004; PER-005; PER-013; RUN-001; RUN-003

## Sensitivity range

CMI state cut-points ±5; Evidence weights Formative 1 / Practical 1–3 / Capstone 2–4.

## Known risks

Averaging away mandatory gaps; EXCEPTIONAL inflation; payment confusion.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial Evidence/CMI/RMI candidates under GHV.PROGRESSION.1B |
