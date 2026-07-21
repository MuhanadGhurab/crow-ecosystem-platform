# Progression Fairness and Accessibility Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-FRN-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [AGE-PRIVACY-PROGRESSION.md](./AGE-PRIVACY-PROGRESSION.md) · [../integrity/PROGRESSION-ANTI-GAMING-ARCHITECTURE.md](../integrity/PROGRESSION-ANTI-GAMING-ARCHITECTURE.md) · [../experience/PROGRESSION-EXPLAINABILITY.md](../experience/PROGRESSION-EXPLAINABILITY.md) · [../architecture/PROGRESSION-INVARIANTS.md](../architecture/PROGRESSION-INVARIANTS.md) · [../momentum/MOMENTUM-LEAGUE-ARCHITECTURE.md](../momentum/MOMENTUM-LEAGUE-ARCHITECTURE.md) · [../README.md](../README.md) |
| **Authoritative inputs** | GHV.PROGRESSION.1A §29 · Learning Design Baseline · Product Constitution accessibility principles |
| **Unresolved formula dependencies** | Momentum recovery windows, accommodation recognition rules → **GHV.PROGRESSION.1B / 1C** |
| **Unresolved technical dependencies** | AT certification matrix, offline/low-bandwidth modes → later UX / technical gates |
| **Privacy classification** | User-facing fair-play; accommodation data may be sensitive |
| **Decision sensitivity** | MEDIUM–HIGH when accommodations intersect Trust or Evidence |
| **Appealability** | YES where standing is denied due to accessibility or participation constraints |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Fairness and Accessibility Architecture |

---

## Purpose

Ensure progression architecture recognizes **diverse learners** without treating speed, realtime presence, language surface quality, paid hardware, or engagement streaks as substitutes for Evidence-backed capability.

```text
STATUS: ARCHITECTURE RECOMMENDED
speed ≠ Mastery
Live Sky ≠ mandatory for all core progression
leaderboard participation ≠ mandatory
No manipulative FOMO
```

---

## Learner situations addressed

Exact total locked in this section: **13** situations.

| ID | Situation | Fairness risk if ignored |
|----|-----------|--------------------------|
| `FRN-01` | Different learning speeds | Slow learners denied Mastery despite Evidence |
| `FRN-02` | Accessibility accommodations | AT users punished or blocked |
| `FRN-03` | Interrupted attendance | Absence treated as skill loss |
| `FRN-04` | Limited hardware | Hidden Rank / Mission barriers |
| `FRN-05` | Limited internet access | Realtime-only progression traps |
| `FRN-06` | Arabic-first users | Language surface quality over-penalized |
| `FRN-07` | English-first users | Assumed default; RTL / bilingual neglect |
| `FRN-08` | Career changers | Prior path bias; unfair beginner framing |
| `FRN-09` | Beginners | Volume pressure mistaken for Mastery path |
| `FRN-10` | Experienced learners | Activity-volume penalty despite strong Evidence |
| `FRN-11` | Minors | Adult social / Prestige pathways unsafe |
| `FRN-12` | Caregiving or work commitments | Unhealthy streak / FOMO pressure |
| `FRN-13` | Cannot join realtime events | Live Sky mandatory for core standing |

---

## Fairness rules

Exact total locked in this section: **12** binding rules.

### F1 — Speed alone must not determine Mastery

Mastery and Route-Proven arise from approved Evidence and assessments, not from completion velocity, streak length, or XP rate.

### F2 — Live Sky is not mandatory for all core progression

Live Sky may enrich learning and contribution recognition, but core progression pathways must remain achievable without mandatory realtime attendance for every learner.

### F3 — Accessible Evidence alternatives

Where Evidence is required, accessible alternatives must exist for the required capability demonstration (format, timing, or modality), without lowering authenticity standards.

### F4 — Absence must not erase learning

Long inactivity may affect Momentum seasonally and may recommend freshness review; it must not silently erase XP history or valid Mastery / Evidence records.

### F5 — Leaderboard participation is not mandatory

Learners may decline public competitive standings. Opting out must not block non-leaderboard progression systems.

### F6 — No punishment for reduced motion

Using reduced-motion settings must not reduce XP, Momentum, Mastery, Trust, Title, or Prestige eligibility.

### F7 — No punishment for assistive technology

Screen readers, captions, keyboard-only navigation, and related AT must not be treated as gaming signals or eligibility penalties.

### F8 — Language quality ≠ technical correctness (unless assessed)

Writing polish or accent must not overshadow technical correctness unless **communication** is the explicitly assessed capability. Arabic-first and English-first learners are equal under technical Evidence review.

### F9 — Paid hardware is not a hidden Rank requirement

Maturity Rank and core progression must not secretly require purchased specialized hardware. Where desktop or hardware is practically needed, it must be **stated**.

### F10 — Practical desktop requirements must be stated

If a Mission, lab, or Evidence path needs desktop-class capability, the requirement is disclosed up front — not discovered as a silent fail.

### F11 — Momentum avoids unhealthy streak pressure

Momentum League recognizes recent consistency; it must not coerce harmful daily pressure, guilt copy, or punishment framing for caregiving / work interruptions.

### F12 — Avoid manipulative FOMO

Progression design must avoid manipulative fear-of-missing-out patterns that pressure purchases, unhealthy hours, or mandatory realtime presence for core standing.

---

## Design implications by system

| System | Fairness implication |
|--------|----------------------|
| Flight XP | Recognizes validated activity; pace variance allowed; no speed tax as Mastery proxy |
| Momentum | Seasonal; recoverable; not a moral judgment of worth |
| Maturity | Journey maturity ≠ hardware ownership |
| Mastery / Route-Proven | Evidence and assessment only; alternatives for access |
| Breadth | Must not require unavailable or inaccessible content |
| Trust | Conduct and integrity — not popularity or AT use |
| Titles / Prestige | Review outcomes; not streak or FOMO theater |
| Leaderboards | Optional; privacy-respecting; provisional where needed |

---

## Relationship to anti-gaming

Fairness and integrity are complementary:

* farming controls may limit empty volume
* fairness protects genuine slow, interrupted, or AT-mediated learning from being misclassified as abuse

See [PROGRESSION-ANTI-GAMING-ARCHITECTURE.md](../integrity/PROGRESSION-ANTI-GAMING-ARCHITECTURE.md) and [AGE-PRIVACY-PROGRESSION.md](./AGE-PRIVACY-PROGRESSION.md).

---

## Explicit non-goals

* No numeric accommodation formulas
* No claim that all AT surfaces are already implemented
* No Product Code UI
* No lowering of Evidence authenticity standards under the banner of fairness

```text
ARCHITECTURE RECOMMENDED
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED · Expert review N/A for architecture
```
