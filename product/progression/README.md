# Progression Domain — Index

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-IDX-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-SYSTEM-SEPARATION.md](./architecture/PROGRESSION-SYSTEM-SEPARATION.md) · [PROGRESSION-INVARIANTS.md](./architecture/PROGRESSION-INVARIANTS.md) · [product/learning/README.md](../learning/README.md) · [LEARNING-PORTFOLIO-MANIFEST.md](../learning/governance/LEARNING-PORTFOLIO-MANIFEST.md) · [SCOPE-BASELINE.md](../../governance/scope/SCOPE-BASELINE.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: replace placeholder; establish architecture index |

---

## Purpose

This directory holds the **conceptual architecture** of the GHURAVIA progression ecosystem: how Activity, consistency, maturity, demonstrated capability, breadth, integrity, professional titles, achievements, Prestige, and standings are represented as **separate systems** that must not silently replace one another.

**GHV.PROGRESSION.1A** defines architecture, inputs, outputs, state boundaries, event semantics, reversals, and governance.

**GHV.PROGRESSION.1B** (and later subgates) owns formulas, thresholds, season durations, and simulation. No final numeric progression formula is locked in 1A.

---

## Gate program

```text
GHV.PROGRESSION.1A — Progression System Architecture → PASS (this baseline)
GHV.PROGRESSION.1B — Formulas, Thresholds and Simulation → NEXT
GHV.PROGRESSION.1C — Integrity, Fairness and Calibration
GHV.PROGRESSION.1D — Final Progression Baseline Lock
```

---

## Status summary

| Concern | Status |
|---------|--------|
| System separation architecture | ARCHITECTURE RECOMMENDED |
| Identifiers, sources, ledgers, unlock/Merit boundaries | ARCHITECTURE RECOMMENDED |
| Formulas / XP values / Rank thresholds / season durations | FORMULA PENDING (deferred to **1B**) |
| Simulation | NOT RUN |
| Calibration | NOT RUN |
| Technical validation | NOT RUN |
| Expert review (architecture) | N/A |
| Product Code | BLOCKED |
| Publication / Implementation | BLOCKED |

---

## Learning Design Baseline (unchanged)

Progression architecture **consumes** the locked Learning Design Baseline and must not rewrite it:

| Item | Authority |
|------|-----------|
| Learning Design Baseline | **v1.0.0** — ACTIVE — LOCKED AS DESIGN BASELINE ([learning/README.md](../learning/README.md)) |
| Authoritative portfolio | [LEARNING-PORTFOLIO-MANIFEST.md](../learning/governance/LEARNING-PORTFOLIO-MANIFEST.md) |
| Handoff inputs | [LEARNING-HANDOFF-PACKAGE.md](../learning/governance/LEARNING-HANDOFF-PACKAGE.md) |
| Route-Proven (qualitative) | [ROUTE-PROVEN-STANDARD.md](../learning/proven/ROUTE-PROVEN-STANDARD.md) |
| Horizon-Proven (foundation; awarding deferred) | [HORIZON-PROVEN-STANDARD.md](../learning/proven/HORIZON-PROVEN-STANDARD.md) |

Learning inventory totals remain as locked under GHV.LEARNING.1D (nodes, edges, Missions, assessments, Evidence anchors, capstones, rubrics). Progression docs do not restate or alter those totals as progression formulas.

---

## Directory index

| Directory | Role |
|-----------|------|
| [architecture/](./architecture/) | Separation, invariants, identifiers, source authority, ledgers, unlock/Merit boundaries, state/decision registries |
| [events/](./events/) | Progression event registry and validity |
| [xp/](./xp/) | Flight XP architecture |
| [momentum/](./momentum/) | Momentum League architecture |
| [maturity/](./maturity/) | Maturity Rank architecture |
| [mastery/](./mastery/) | Route/Capability Mastery and freshness |
| [breadth/](./breadth/) | Breadth architecture |
| [trust/](./trust/) | Trust Standing architecture |
| [titles/](./titles/) | Professional Title architecture |
| [prestige/](./prestige/) | Prestige Class architecture |
| [achievements/](./achievements/) | Achievements and Crests |
| [leaderboards/](./leaderboards/) | Leaderboards and standings |
| [integrity/](./integrity/) | Anti-gaming architecture |
| [fairness/](./fairness/) | Fairness, age, and privacy |
| [experience/](./experience/) | Explainability, Skyboard composition, screen state |
| [scenarios/](./scenarios/) | Architecture-level scenarios |
| [governance/](./governance/) | Corrections/appeals, automation/human authority, data minimization, scorecards, handoffs |

Exact file: **17** domain directories under `product/progression/` (excluding this README).

---

## Architecture entry points (1A)

| Document | Document ID | Topic |
|----------|-------------|-------|
| [architecture/PROGRESSION-SYSTEM-SEPARATION.md](./architecture/PROGRESSION-SYSTEM-SEPARATION.md) | GHV-PRG-SEP-001 | Eleven systems and commercial boundary |
| [architecture/PROGRESSION-INVARIANTS.md](./architecture/PROGRESSION-INVARIANTS.md) | GHV-PRG-INV-001 | Permanent separation rules |
| [architecture/PROGRESSION-IDENTIFIER-STANDARD.md](./architecture/PROGRESSION-IDENTIFIER-STANDARD.md) | GHV-PRG-ID-001 | Canonical IDs |
| [architecture/PROGRESSION-SOURCE-AUTHORITY.md](./architecture/PROGRESSION-SOURCE-AUTHORITY.md) | GHV-PRG-SRC-001 | Source classes and permitted effects |
| [architecture/PROGRESSION-LEDGER-MODEL.md](./architecture/PROGRESSION-LEDGER-MODEL.md) | GHV-PRG-LDG-001 | Conceptual ledgers |
| [architecture/PROGRESSION-UNLOCK-BOUNDARY.md](./architecture/PROGRESSION-UNLOCK-BOUNDARY.md) | GHV-PRG-ULK-001 | Eligibility vs grants |
| [architecture/MERIT-PROGRESSION-BOUNDARY.md](./architecture/MERIT-PROGRESSION-BOUNDARY.md) | GHV-PRG-MRT-001 | Merit as entitlement outcome |

---

## Exact architectural totals used in 1A

| Construct | Exact total |
|-----------|------------:|
| Ecosystem systems (incl. Access Plan commercial) | **11** |
| Progression system IDs (`PGS-*`) | **10** |
| Maturity Rank IDs (`MAT-*`) | **7** |
| Momentum League IDs (`MOM-*`) | **6** |
| Prestige Class IDs (`PRS-*`) | **3** |
| Source authority classes | **10** |
| Conceptual ledgers | **11** |
| Crest ID families (`CRS-*`) | **6** |
| Domain directories indexed above | **17** |

No XP values, Rank thresholds, Mastery percentages, or season durations are defined here.

---

## Explicit non-goals of this index

- Do not invent formulas or numeric thresholds.
- Do not treat Access Plan as a progression score.
- Do not claim Learning Design Baseline changed.
- Do not claim Product Code, simulation, calibration, or technical validation complete.

```text
ARCHITECTURE RECOMMENDED
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED · Expert review N/A for architecture
```
