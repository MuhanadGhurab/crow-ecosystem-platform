# Breadth Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-BRD-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related** | [PROGRESSION-SYSTEM-SEPARATION.md](../architecture/PROGRESSION-SYSTEM-SEPARATION.md) · [ROUTE-MASTERY-ARCHITECTURE.md](../mastery/ROUTE-MASTERY-ARCHITECTURE.md) · [CAPABILITY-ROUTE-MASTERY-SEPARATION.md](../mastery/CAPABILITY-ROUTE-MASTERY-SEPARATION.md) · [PRESTIGE-ARCHITECTURE.md](../prestige/PRESTIGE-ARCHITECTURE.md) · [PROFESSIONAL-TITLE-ARCHITECTURE.md](../titles/PROFESSIONAL-TITLE-ARCHITECTURE.md) · [ROUTE-PROVEN-STANDARD.md](../../learning/proven/ROUTE-PROVEN-STANDARD.md) · [HORIZON-PROVEN-STANDARD.md](../../learning/proven/HORIZON-PROVEN-STANDARD.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Unresolved** | Breadth aggregation thresholds, dimension blends, and Horizon-Proven awarding → **GHV.PROGRESSION.1B** / governed Proven gates |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Breadth Architecture |

## Purpose

Define **Breadth** as **meaningful demonstrated capability across distinct areas** — not as enrollment volume, exposure time, Flight XP totals, or Momentum standing alone.

```text
STATUS: ARCHITECTURE RECOMMENDED
Breadth = meaningful demonstrated capability across distinct areas
Enrollment / XP alone ≠ Breadth
Thresholds pending GHV.PROGRESSION.1B
No Product Code · No numeric formulas
```

## Binding definition

| Principle | Statement |
|-----------|-----------|
| **What Breadth is** | A governed standing that the learner has demonstrated capability across **distinct** Routes, Horizons, Wings, Secure Extensions, team contributions, or multidisciplinary capstones — with Evidence linkage. |
| **What Breadth is not** | A count of enrollments, Mission completions, XP volume, season activity, plan capacity, or popularity. |
| **System ID** | `PGS-BRD` |
| **Record IDs** | Horizon-linked `BRD-HRZ-<HORIZON-ID>`; multi-path markers `BRD-MULTI-<NUMBER>` (catalogue expansion deferred). |
| **Values** | Aggregation thresholds and blends are **FORMULA PENDING** (1B). This Gate defines sources, dimensions, and binding rules only. |

---

## Authoritative sources

Breadth may draw only from demonstrated, governed sources:

| Source | Role in Breadth |
|--------|-----------------|
| **Capability Mastery** | Demonstrated capability standing for a scoped capability contributes when distinct from near-duplicates already counted. |
| **Route-Proven** | Route-level Proven under Learning Design Baseline qualitative conditions is a strong Breadth-eligible demonstration for that Route scope. |
| **Cross-Wing Evidence** | Evidence that spans Wings is treated as **more meaningful** Breadth signal than same-Wing near-duplicates (qualitative weighting pending 1B; no formula here). |
| **Secure Extension Evidence** | Evidence from Secure Extensions may support **focused** Breadth within the Extension scope — not automatic full Horizon Breadth. |
| **Individually verified Team contributions** | Team outcomes count only when the individual’s contribution is attributable and verified under team Evidence rules. |
| **Multidisciplinary capstones** | Capstones that intentionally integrate distinct domains contribute Integrated Breadth when approved. |

### Prohibited sole sources

| Source | Rule |
|--------|------|
| Enrollment / registration | Not Breadth. |
| Exposure / browse / preview | Not Breadth. |
| Flight XP alone | Not Breadth. |
| Momentum alone | Not Breadth. |
| Payment / Access Plan | Not Breadth. |
| Popularity / reactions | Not Breadth. |

---

## Breadth dimensions

Exact totals for dimension IDs in this Gate: **4**.

| Dimension ID | Meaning |
|--------------|---------|
| **INTRA_ROUTE_BREADTH** | Demonstrated span across distinct capabilities **within** one Route — without treating near-duplicates as additive. |
| **HORIZON_BREADTH** | Demonstrated span across Routes / domains **within** one Horizon, grounded in Evidence or Proven outcomes. |
| **MULTI_HORIZON_BREADTH** | Demonstrated span across **more than one** Horizon, each with meaningful demonstration (not mere enrollment). |
| **INTEGRATED_BREADTH** | Multidisciplinary integration shown through Cross-Wing Evidence, multidisciplinary capstones, or governed integrated work — stronger than parallel siloed enrollments. |

Dimensions may be displayed separately; no silent collapse into a single public “Breadth score” is required in 1A. Numeric blends PENDING 1B.

---

## Binding rules

| ID | Rule |
|----|------|
| BRD-R1 | **Enrollment or exposure without Evidence ≠ Breadth.** |
| BRD-R2 | **Near-duplicate capabilities do not inflate Breadth.** Distinctness is governed; cosmetic renaming or overlapping templates do not multiply standing. |
| BRD-R3 | **Cross-Wing Evidence is more meaningful** than same-Wing near-duplicate demonstrations for Breadth interpretation. |
| BRD-R4 | **Secure Extension focused Breadth ≠ full Horizon Breadth.** Extension Evidence supports scoped claims only unless Horizon-level requirements are separately met. |
| BRD-R5 | **RT-ANL-001 cannot contribute launch Breadth** until Change Control activation for that Route/content pathway. Pre-activation enrollment or drafts do not create Breadth. |
| BRD-R6 | **Horizon-Proven awarding is deferred.** Horizon-Proven foundation remains in Learning Design Baseline; progression Breadth must not invent or award Horizon-Proven in this Gate. |
| BRD-R7 | **Breadth thresholds and aggregation pending GHV.PROGRESSION.1B.** No numeric Breadth scores, percentages, or cutoffs here. |
| BRD-R8 | **Breadth does not replace Mastery depth.** Depth remains Mastery / Proven; Breadth is span of meaningful demonstration. |
| BRD-R9 | **Underlying Evidence / Mastery / Proven reversal may reverse dependent Breadth** for the affected scope — not silent mass deletion of unrelated history. |
| BRD-R10 | **Payment, XP, Momentum, and popularity never grant Breadth.** |

---

## Relationship to other systems

| System | Boundary |
|--------|----------|
| **Route Mastery / Capability Mastery** | Depth and demonstration quality; Breadth consumes distinct Mastery/Proven outcomes as sources, does not redefine them. |
| **Route-Proven** | Strong per-Route Breadth-eligible source when awarded under Learning qualitative conditions. |
| **Horizon-Proven** | Awarding deferred; Breadth architecture must not claim Horizon-Proven completion. |
| **Professional Titles / Prestige** | May require Breadth as an eligibility input; Breadth alone is not a Title or Prestige Class. |
| **Flight XP / Momentum** | Activity and season consistency only; never proxies for Breadth. |
| **Trust Standing** | Integrity may gate whether Evidence can support Breadth; Trust is not Breadth. |

---

## Visibility and explainability

| Concept | Architecture |
|---------|--------------|
| **Learner-facing copy** | Must describe Breadth as demonstrated span across distinct areas — not “courses started” or XP. |
| **Portfolio surface** | CONTROLLED LAUNCH surface for Breadth presentation; full depth POST-LAUNCH PLANNED per separation model. |
| **Public display** | Optional under privacy policy; must not imply employment readiness or Horizon-Proven. |
| **Audit** | Breadth records retain source Evidence / Proven / contribution linkages for correction and appeal. |

---

## Explicit non-goals

- No Breadth numeric score, percentage, or threshold lock in this Gate.
- No Horizon-Proven awarding.
- No RT-ANL-001 launch Breadth before Change Control activation.
- No Product Code, simulation, calibration, or technical validation claims.
- No substitution of Breadth for Mastery, Trust, Titles, or Prestige.

## Handoff

| Gate | Receives |
|------|----------|
| **GHV.PROGRESSION.1B** | Dimension model + binding rules; must supply simulation-backed aggregation thresholds and anti-inflation parameters |
| **Governed Proven / Change Control** | Horizon-Proven awarding deferral; RT-ANL-001 activation gating for launch Breadth eligibility |
| **Calibration / simulation** | Must run before any numeric lock |
| **Product Code / implementation** | BLOCKED until later governed gates |

```text
FORMULA PENDING
SIMULATION NOT RUN
CALIBRATION NOT RUN
TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
```
