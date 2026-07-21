# Progression Formula Standard

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-FRM-STD-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

## Purpose

Define the governance fields required for every progression formula, policy, and eligibility template under `GHV.PROGRESSION.1B`.

## Required status wording

Every formula document **must** use exactly:

```text
SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION
```

Do **not** use:

```text
FINAL
CALIBRATED
PRODUCTION READY
```

## Required fields (every formula)

| Field | Requirement |
|-------|-------------|
| Formula ID | Canonical `FRM-*`, `POL-*`, or `TPL-*` identifier |
| version | Semantic version; launch candidates start at `0.1.0` |
| progression system | Flight XP, Level, Momentum, Maturity, Mastery, Breadth, Trust, Titles, Prestige, Achievements, Leaderboards, Correction, Freshness |
| purpose | What decision or standing the formula supports |
| inputs | Authoritative source inputs only |
| prohibited inputs | Explicit exclusions (payment, popularity, idle time, etc.) |
| input ranges | Valid numeric / categorical ranges |
| exact equation or rule set | Candidate equation or deterministic rules |
| output range | Output bounds |
| rounding method | Deterministic rounding rule |
| caps | Upper bounds / volume caps |
| floors | Minimum thresholds |
| hard gates | Non-compensable requirements |
| missing-data behavior | How absent inputs are handled |
| provisional-data behavior | How provisional / pending inputs are handled |
| reversal behavior | Exact correction / negation rules |
| freshness behavior | Overlay behavior (does not silently rewrite history) |
| explainability text | User-facing explanation without jargon |
| simulation scenarios | Linked persona / run IDs |
| sensitivity range | Parameters eligible for sensitivity testing |
| known risks | Documented gaming / fairness / calibration risks |
| owner | `Founder (RAVEN)` |
| source Gate | `GHV.PROGRESSION.1B` |
| status | Exact status string above |
| change history | Versioned revisions (see FORMULA-REVISION-LOG) |

## Authority

* Architecture from GHV.PROGRESSION.1A remains authoritative for system separation.
* Numeric candidates in this Gate are **not** locked as calibrated values.
* Revisions after simulation must be logged before any status change.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial formula governance standard under GHV.PROGRESSION.1B |
