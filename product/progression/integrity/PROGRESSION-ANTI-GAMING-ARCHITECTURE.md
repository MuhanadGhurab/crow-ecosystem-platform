# Progression Anti-Gaming Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-AGM-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [../governance/PROGRESSION-CORRECTION-AND-APPEAL.md](../governance/PROGRESSION-CORRECTION-AND-APPEAL.md) · [../events/PROGRESSION-EVENT-VALIDITY.md](../events/PROGRESSION-EVENT-VALIDITY.md) · [../architecture/PROGRESSION-INVARIANTS.md](../architecture/PROGRESSION-INVARIANTS.md) · [../architecture/PROGRESSION-SOURCE-AUTHORITY.md](../architecture/PROGRESSION-SOURCE-AUTHORITY.md) · [../fairness/PROGRESSION-FAIRNESS-ARCHITECTURE.md](../fairness/PROGRESSION-FAIRNESS-ARCHITECTURE.md) · [../README.md](../README.md) |
| **Authoritative inputs** | GHV.PROGRESSION.1A §28 · Event Validity · Source Authority · Trust / Evidence learning baselines |
| **Unresolved formula dependencies** | Caps, cooldowns, diminishing curves, anomaly thresholds → **GHV.PROGRESSION.1B / 1C** |
| **Unresolved technical dependencies** | Detection implementation, account-assurance tooling → later technical / integrity gates |
| **Privacy classification** | Restricted integrity; minimize user-visible detection detail |
| **Decision sensitivity** | HIGH when leading to Trust, Prestige, Title, or Evidence actions |
| **Appealability** | YES — false-positive protection and appeals required |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Anti-Gaming Architecture |

---

## Purpose

Define conceptual **integrity controls** that protect progression systems from gaming, collusion, and artificial activity — without invasive surveillance and without locking production detection algorithms in 1A.

```text
STATUS: ARCHITECTURE RECOMMENDED
No invasive surveillance
No production detection algorithms
FORMULA PENDING · Product Code BLOCKED
```

---

## Threat classes addressed

Exact total locked in this section: **17** threat classes.

| ID | Threat | Progression risk |
|----|--------|------------------|
| `AGM-01` | Mission farming | Inflates XP / Momentum without meaningful learning |
| `AGM-02` | Rapid repeated submissions | Bypasses intended pacing; stresses review fairness |
| `AGM-03` | Low-value repetition | Volume without skill signal |
| `AGM-04` | Collusive peer feedback | Distorts contribution / Trust inputs |
| `AGM-05` | Reaction farming | Popularity mistaken for Mastery or Prestige |
| `AGM-06` | Artificial Team contribution | Team success without individual capability |
| `AGM-07` | Duplicate accounts | Multiplies rewards / circumvents limits |
| `AGM-08` | Account sharing | Misattributes Evidence and Trust |
| `AGM-09` | Automated activity | Non-human progression inflation |
| `AGM-10` | Copied Evidence | False Mastery / Route-Proven |
| `AGM-11` | AI-generated spam | Noise in Evidence / community channels |
| `AGM-12` | Fake Live Sky participation | False presence or contribution |
| `AGM-13` | Season timing manipulation | Unfair Momentum / leaderboard advantage |
| `AGM-14` | Reviewer collusion | Compromised Evidence / Title / Prestige review |
| `AGM-15` | Moderator abuse | Unjust Trust / standing harm or favor |
| `AGM-16` | Merit farming | Entitlement abuse without learning intent |
| `AGM-17` | Intentional failure for remediation rewards | Exploits remediation recognition paths |

---

## Control principles (conceptual)

Exact total locked in this section: **13** control families.

Controls below are **architectural obligations**. Magnitudes, timers, and detection models remain **FORMULA PENDING** and must not be invented here as production algorithms.

### C1 — Event idempotency

The same authoritative source event must not apply more than once to the same subject and system. Duplicate application is a correction cause (`COR-CAUSE-DUP`).

### C2 — Source validation

Only events with valid source authority classes may influence standing. Commercial events never create Skill Mastery. Community popularity never creates technical Mastery.

### C3 — Diminishing recognition

Repeated low-value or same-category activity may receive diminishing recognition over time so volume cannot dominate standing narratives. Exact curves → 1B/1C.

### C4 — Category caps

Category-level recognition caps (conceptual) prevent a single farming pattern from overwhelming XP or Momentum interpretation. Caps are not Mastery substitutes.

### C5 — Cooldown where justified

Where rapid repetition harms fairness or review quality, cooldowns may apply to submission or recognition paths. Cooldowns must not punish accessibility needs or reduced-motion / AT use (see Fairness Architecture).

### C6 — Human review

Sensitive Evidence, contested integrity, Title, and Prestige paths require human review. Automation may surface anomalies; it must not independently finalize high-impact integrity outcomes.

### C7 — Anomaly detection (conceptual)

The architecture permits anomaly **surfacing** (patterns inconsistent with normal learning). This gate does **not** define production detection algorithms, scoring models, or surveillance pipelines.

### C8 — Evidence authenticity

Evidence pathways must support authenticity review (originality, attribution, capability alignment). Copied or spam Evidence must not harden into Mastery or Route-Proven.

### C9 — Account-assurance requirements

Higher-assurance identity / session / device signals may be required for high-impact pathways (Titles, Prestige, sensitive Trust restoration). Assurance is not a paid Rank shortcut.

### C10 — Conflict-of-interest controls

Reviewers, moderators, and nominators must be constrained against reviewing themselves, close collaborators in collusive patterns, or cases where they have a material conflict. Separation of duties applies for high-impact corrections.

### C11 — Reversible provisional standings

Leaderboards and some seasonal outcomes may be **provisional** and reversible pending integrity review. Provisional must be explainable to the user.

### C12 — Appeals

Integrity actions affecting Trust, Evidence, Prestige, Titles, or standing eligibility must be appealable with tracked status (see Correction and Appeal).

### C13 — False-positive protection

Controls must prefer reversible, reviewable actions over irreversible punishment when confidence is incomplete. Learners must not be permanently harmed by unexplained hidden scores.

---

## Threat → control mapping (summary)

| Threat cluster | Primary conceptual controls |
|----------------|----------------------------|
| Farming / repetition / remediation abuse | Idempotency, diminishing recognition, category caps, cooldown, source validation |
| Collusion / popularity / fake contribution | Human review, conflict-of-interest, Evidence authenticity, source validation |
| Identity abuse (duplicate / sharing / bots) | Account-assurance, source validation, anomaly surfacing, appeals |
| Live Sky / season manipulation | Source validation, provisional standings, human review, correction records |
| Reviewer / moderator abuse | Separation of duties, appeals, audit history, conflict-of-interest |
| Merit farming | Merit / unlock boundary (entitlement ≠ progression), source validation |

---

## Hard prohibitions

### No invasive surveillance

Anti-gaming must not require continuous invasive monitoring of personal devices, private communications, or biometric surveillance as a condition of ordinary learning. Controls stay proportionate to progression integrity.

### No production detection algorithms in 1A

This document must not lock:

* numeric anomaly thresholds
* ML model specifications
* keystroke / webcam proctoring designs
* secret scoring formulas used as unexplained sanctions

Those belong to later integrity / technical gates after fairness and legal review.

### No collapsing system boundaries

Anti-gaming responses must identify the affected system. XP farming responses must not auto-erase unrelated Mastery. Trust actions must not invent Mastery awards when reversed.

---

## Relationship to fairness

Integrity controls must coexist with fairness:

* reduced motion and assistive technology are not gaming signals
* slower pace is not farming
* absence is not an integrity violation by itself
* language quality is not Evidence fraud unless authenticity is in question

See [PROGRESSION-FAIRNESS-ARCHITECTURE.md](../fairness/PROGRESSION-FAIRNESS-ARCHITECTURE.md).

---

## Explicit non-goals

* No Product Code detectors or rule engines
* No numeric caps, cooldowns, or strike counts
* No claim of calibrated false-positive rates
* No behaviorally targeted advertising justified as “integrity”

```text
ARCHITECTURE RECOMMENDED
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED · Expert review N/A for architecture
```
