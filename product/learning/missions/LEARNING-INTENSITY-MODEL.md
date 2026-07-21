# Learning Intensity Model

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-INT-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [MISSION-BLUEPRINT-STANDARD.md](./MISSION-BLUEPRINT-STANDARD.md) · [MISSION-MODALITY-MATRIX.md](./MISSION-MODALITY-MATRIX.md) · [CAPSTONE-BLUEPRINT-STANDARD.md](../capstones/CAPSTONE-BLUEPRINT-STANDARD.md) |
| **Scope classification** | CONTROLLED LAUNCH |
| **Supporting sources** | SRC-001 · SRC-010 · SRC-011 |
| **Expert review** | NOT RUN |
| **Pilot status** | NOT RUN |
| **Unresolved dependencies** | Configurable time ranges after content prototyping; pilot calibration of DEEP vs EXTENDED; accessibility pacing guidance |
| **Limitations** | Qualitative intensity only — no mandatory time-to-completion; not XP weight; not Mastery score |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Learning Intensity Model |

## Purpose

Provide a **qualitative intensity vocabulary** for Mission and Capstone blueprints so designers can signal cognitive and practical load without inventing clocks, XP, or Mastery formulas.

```text
No mandatory time-to-completion.
Estimated time may appear later as a configurable range after prototyping.
Expert review: NOT RUN. Pilot: NOT RUN.
```

---

## Intensity levels

```text
LIGHT
STANDARD
DEEP
EXTENDED
```

Levels are defined across five dimensions:

| Dimension | Meaning |
|-----------|---------|
| **Cognitive demand** | Concept load, judgment complexity, ambiguity |
| **Practical effort** | Hands-on steps, tooling friction, setup burden |
| **Expected artifact complexity** | Size / structure / explanation depth of outputs |
| **Concentration requirement** | Need for uninterrupted focus |
| **Multi-session need** | Likelihood that competent progress spans multiple sittings |

---

## LIGHT

| Dimension | Guidance |
|-----------|----------|
| Cognitive demand | Single concept or orientation; low ambiguity |
| Practical effort | Short checklist, reading pack, or simple form |
| Artifact complexity | Minimal (acknowledgment, short note, labeled screenshot) |
| Concentration | Low — interruptible |
| Multi-session | Usually completable in one short sitting |

**Typical use:** ORIENTATION openers; ethics attestations; Stage re-entry briefs; light DOCUMENTATION hygiene.

**Not for:** Capstones; high-integrity practical assessments; PROTECT triage packs.

---

## STANDARD

| Dimension | Guidance |
|-----------|----------|
| Cognitive demand | Core Stage concepts with guided decisions |
| Practical effort | Scaffolded practice or bounded lab steps |
| Artifact complexity | Moderate — seed-bound config, short report, checklist + notes |
| Concentration | Moderate — focused blocks helpful |
| Multi-session | Often one primary session; optional follow-up for polish |

**Typical use:** GUIDED_PRACTICE; early SCENARIO; Stage ASM anchors that are not Capstone-grade.

---

## DEEP

| Dimension | Guidance |
|-----------|----------|
| Cognitive demand | Multi-factor judgment; trade-offs; diagnosis |
| Practical effort | Independent or lab work with non-trivial tooling |
| Artifact complexity | High — troubleshooting record, analysis pack, design note |
| Concentration | High — distraction reduces quality |
| Multi-session | Common — draft → verify → explain |

**Typical use:** INDEPENDENT_PRACTICE; LABORATORY; TROUBLESHOOTING / ANALYSIS / DESIGN; Evidence preparation near EVD anchors.

---

## EXTENDED

| Dimension | Guidance |
|-----------|----------|
| Cognitive demand | Integrated capability bundle across Stages |
| Practical effort | Capstone / Integration / Live Sky orchestration |
| Artifact complexity | Bundle-level — multiple artifacts + narrative |
| Concentration | Sustained; planning required |
| Multi-session | Expected — governed checkpoints preferred |

**Typical use:** CAPSTONE; CXW Integration Mission; Team / Live Sky missions with contribution Evidence.

**Not required** merely to appear rigorous — prefer DEEP when one focused artifact suffices.

---

## Assignment rules

1. Every Mission Blueprint records **one** primary intensity level.
2. Intensity is **not** an XP multiplier and **not** a Mastery score.
3. Accessibility adjustments may reduce session length without changing the declared intensity class (pace ≠ downgrade of capability claim).
4. Remediation Missions are usually LIGHT or STANDARD even when remediating DEEP work.
5. Reserve (RT-ANL-001) blueprints use the same vocabulary; Scope remains CONDITIONAL.

## Forbidden

* Mandatory minutes / hours to complete.
* Numeric “difficulty scores” treated as progression formulas.
* Employment-duration claims (“X weeks to job ready”).

## Handoff

Configurable estimated-time ranges → after content prototyping and pilot (NOT RUN). Aggregation into Mastery → GHV.PROGRESSION.1.
