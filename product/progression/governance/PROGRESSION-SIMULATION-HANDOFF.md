# Progression Simulation Handoff (1A → 1B)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-SIM-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Handoff target** | GHV.PROGRESSION.1B — Formulas, Thresholds and Simulation |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-TECHNICAL-HANDOFF.md](./PROGRESSION-TECHNICAL-HANDOFF.md) · [PROGRESSION-ARCHITECTURE-REVIEW-SCORECARD.md](./PROGRESSION-ARCHITECTURE-REVIEW-SCORECARD.md) · [../architecture/PROGRESSION-DECISION-REGISTRY.md](../architecture/PROGRESSION-DECISION-REGISTRY.md) · [../architecture/PROGRESSION-STATE-REGISTRY.md](../architecture/PROGRESSION-STATE-REGISTRY.md) · [../README.md](../README.md) · [../../learning/governance/LEARNING-PORTFOLIO-MANIFEST.md](../../learning/governance/LEARNING-PORTFOLIO-MANIFEST.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: simulation handoff package for 1B |

---

## Purpose

Define what **GHV.PROGRESSION.1B** receives from the 1A architecture baseline for formula design, thresholds, and simulation. 1B owns numeric formulas; 1A does not.

```text
1A delivers architecture + registries + qualitative baselines
1B delivers formulas, thresholds, simulation
NO progression formulas in this handoff package
SIMULATION NOT RUN
```

---

## What 1B receives

| Package element | What it is | Formula status |
|-----------------|------------|----------------|
| **Systems** | Separated progression systems (Flight XP, Momentum, Maturity, Mastery, Breadth, Trust, Titles, Prestige, Achievements/Crests, Leaderboards) plus commercial Access Plan boundary | Separation locked; values PENDING |
| **Event registry** | Canonical progression event types and validity lifecycle | Semantics locked; magnitudes PENDING |
| **State registry** | Canonical states (`ST-PRG-*`) across systems | Vocabulary locked; transition thresholds PENDING |
| **Decision registry** | Canonical decisions (`DEC-PRG-*`, exact count **21**) | Decision types locked; formula dependency PENDING for all |
| **Invariants** | Permanent separation and anti-pay-to-win / Evidence / Trust rules | Locked |
| **Source authority** | Source classes and permitted effects | Locked |
| **Scenarios** | Architecture-level scenario coverage (where authored under `scenarios/`) | Qualitative; numeric outcomes PENDING |
| **Correction model** | Correction / appeal states and authority boundary | Process locked; thresholds PENDING |
| **Fairness** | Fairness / age / accessibility architectural constraints (where authored) | Constraints locked; calibration PENDING |
| **Anti-gaming** | Anti-gaming architectural constraints (where authored) | Constraints locked; detection thresholds PENDING |
| **Learning baseline counts** | Locked Learning Design Baseline inventory (below) | **Unchanged** — not progression formulas |
| **Route-Proven qualitative** | Locked qualitative Proven conditions from Learning Design Baseline | Qualitative only — no Proven shortcuts |
| **NO formulas** | Explicit: no XP values, Rank thresholds, Mastery percentages, season durations, or Prestige scores in 1A | FORMULA PENDING |

---

## Learning Design Baseline counts (unchanged)

Progression simulation must **consume** these locked learning inventory totals and must not rewrite them as progression formulas:

| Construct | Exact count |
|-----------|------------:|
| Learning Graph nodes | **166** |
| Learning Graph edges | **129** |
| Mission Blueprints | **87** |
| Assessment Anchors | **33** |
| Evidence Anchors | **24** |
| Capstone Blueprints | **7** |

Authority: [LEARNING-PORTFOLIO-MANIFEST.md](../../learning/governance/LEARNING-PORTFOLIO-MANIFEST.md) under Learning Design Baseline v1.0.0.

Route-Proven remains **qualitative** per Learning Proven standards. 1B must not invent progression shortcuts that weaken Proven conditions.

---

## Simulation personas (required coverage)

1B simulation must include at least these personas (qualitative coverage required; numeric outcomes PENDING until formulas exist):

| # | Persona | What to stress-test |
|---|---------|---------------------|
| 1 | **New learner** | Cold-start XP / Momentum / Maturity / Mastery visibility without premature Titles or Prestige |
| 2 | **Experienced learner** | High activity with genuine Evidence; separation of XP vs Mastery vs Titles |
| 3 | **High-activity, low-Evidence** | Activity volume must not invent competence or Prestige |
| 4 | **Low-activity, high-Evidence** | Strong Evidence must still drive Mastery/Title paths without requiring grind |
| 5 | **Paid / free** | Access capacity differs; payment must not create XP, Momentum, Maturity, Mastery, Breadth, Trust, Titles, or Prestige |
| 6 | **Merit** | Merit as entitlement outcome — not a progression score substitute |
| 7 | **Returning learner** | Recovery / freshness / Momentum RECOVERING without erasing history |
| 8 | **Minor** | Age-sensitive Trust, elevated authority, public profile, and Prestige/Title restrictions |
| 9 | **Integrity review** | Holds, provisional boards, Trust paths, no silent permanence |
| 10 | **Team** | Team Mission attribution without stealing individual Evidence credit |
| 11 | **Live Sky** | Live / event contexts without pay-to-win standing |
| 12 | **Reviewer / mentor** | Service ledgers separate from learner Skill XP; conflict handling |
| 13 | **Prestige candidates** | Eligibility → nomination → human review; automation must not auto-grant |

Exact persona count for this handoff list: **13**.

---

## Explicit 1B obligations

1. Propose formulas and thresholds for each system without violating 1A invariants.
2. Run simulation across the personas above (SIMULATION NOT RUN in 1A).
3. Keep Learning baseline counts and Route-Proven qualitative conditions intact.
4. Mark every decision in the Decision Registry with formula proposals while leaving final lock to later gates as required.
5. Do not ship Product Code from 1B simulation alone.

---

## Explicit non-goals of this handoff

- No numeric progression formulas in this document.
- No database schema or runtime implementation.
- No claim that simulation, calibration, or technical validation has been run.

```text
HANDOFF: GHV.PROGRESSION.1A → GHV.PROGRESSION.1B
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
```
