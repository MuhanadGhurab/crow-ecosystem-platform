# Leaderboard Formulas

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-FRM-LDB-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **Formula IDs** | FRM-LDB-001…FRM-LDB-006 |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

## Formula IDs

```text
FRM-LDB-001     Route Mastery leaderboard
FRM-LDB-002     Momentum leaderboard
FRM-LDB-003     Community contribution leaderboard
FRM-LDB-004     Team and Live event leaderboard
FRM-LDB-005     Cross-Wing leaderboard
FRM-LDB-006     Evidence Excellence leaderboard
```

## Purpose

Separate leaderboard standings by system. Population display rules are in `POL-POP-001`.

---

## FRM-LDB-001 — Route Mastery Board

Eligibility:

```text
Route-Proven
opt-in
current valid Route Mastery record
```

Standing:

```text
Route Mastery Index
```

Ties:

```text
Shared position
```

Do not use XP as a tie-breaker.

---

## FRM-LDB-002 — Momentum Board

Standing:

```text
Current Season Momentum Score
```

Provisional placement remains visibly provisional.

---

## FRM-LDB-003 — Community Contribution Board

Candidate formula:

```text
Community Contribution Score =
Σ(Qualified Contribution Rating × Contribution Type Weight)
```

Rules:

* Contribution rating range: 1–5.
* Maximum three scored contributions per week.
* Raw post volume contributes zero.
* Raw reaction count contributes zero.
* Repeated low-value comments contribute zero.
* Season maximum: 60 candidate points.
* Reviewer and conflict controls required.

---

## FRM-LDB-004 — Team and Live Event Boards

Use event-specific normalized scores:

```text
0–100
```

Scores from different events are not automatically comparable.

---

## FRM-LDB-005 — Cross-Wing Board

Eligibility:

```text
CXW-001 Route-Proven
opt-in
valid integrated capstone
```

Standing:

```text
Integrated Capstone Index
```

---

## FRM-LDB-006 — Evidence Excellence Board

Eligibility:

* Opt-in.
* Sanitized public artifact where required.
* Valid Capstone or equivalent Evidence.
* No sensitive restricted Evidence.

Standing:

```text
Approved Evidence Item Index
```

Do not use popularity.

## Prohibited inputs (all boards)

* Paid-plan multipliers.
* Popularity as Excellence standing.
* XP as Mastery tie-breaker.

## Explainability text

“Each board measures one kind of standing. Being high on Momentum does not mean you are highest in Mastery.”

## Simulation scenarios

RUN-004; PER-014; POL-POP-001 population bands

## Known risks

Low-population “top expert” claims; popularity leakage; cross-event false comparability.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial six board formulas under GHV.PROGRESSION.1B |
