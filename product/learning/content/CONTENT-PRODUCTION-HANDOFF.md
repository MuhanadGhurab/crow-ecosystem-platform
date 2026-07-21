# Content Production Handoff

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-CNT-HOF-001 |
| **Version** | 1.0.0 |
| **Status** | HANDOFF DEFINED — NO MISSION PUBLICATION-READY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | Gate §44 · [MISSION-BLUEPRINT-REGISTRY.md](../missions/MISSION-BLUEPRINT-REGISTRY.md) · [CONTENT-FRESHNESS-AND-LIFECYCLE.md](./CONTENT-FRESHNESS-AND-LIFECYCLE.md) · [LEARNING-PILOT-REQUIREMENTS.md](./LEARNING-PILOT-REQUIREMENTS.md) · [EXPERT-REVIEW-REQUIREMENTS.md](../architecture/EXPERT-REVIEW-REQUIREMENTS.md) |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Content Production Handoff |

## Purpose

Hand off Mission Blueprint packs to future content production with required asset classes and a governed state machine — **without** marking any Mission publication-ready.

```text
No Mission is APPROVED_FOR_PUBLICATION in this Gate.
Expert: NOT RUN · Pilot: NOT RUN · No XP · No LOCKED
```

---

## Production needs (per Mission Blueprint)

Every future production unit derived from a 1C Mission Blueprint must identify:

| Need | Description |
|------|-------------|
| **Learning objectives** | Observable, non-employment objectives from the blueprint |
| **Research sources** | `SRC-*` / citations to refresh |
| **Arabic content** | Arabic-first narrative / UI strings |
| **English technical terms** | Retained terms glossary |
| **Diagrams** | Architecture / flow / boundary diagrams |
| **Demonstrations** | Captioned walkthroughs where used |
| **Practice environment** | Browser-safe / local-safe / sandbox class |
| **Assessment assets** | Linked `*-ASM-*` prompts / checklists (no answer keys in public packs) |
| **Evidence instructions** | How to produce / sanitize / submit linked EVD |
| **Reviewer guide** | Rubric application notes for reviewers |
| **Accessibility assets** | Alternatives, captions, keyboard paths, a11y notes |
| **Localization review** | Bilingual QA checklist |
| **Expert review** | Domain IDs from Expert Review Requirements |
| **Content freshness date** | Review-due / freshness class |
| **Legal or IP review** | Third-party content / seed licensing check |

### Pack-level coverage (all require the full need list)

| Pack | Mission count | Publication-ready? |
|------|--------------:|--------------------|
| RT-OPR-001 | 14 | **No** |
| RT-BLD-001 | 14 | **No** |
| RT-PRT-001 | 14 | **No** |
| RT-LED-001 | 14 | **No** |
| RT-ANL-001 reserve | 8 | **No** (activation-gated) |
| BRG-PRT-BLD-01 | 4 | **No** |
| CXW-001 | 10 | **No** |
| SEX-001 | 8 | **No** |
| LIV-MSN-001 | 1 | **No** (realtime not in 1C) |

---

## Content production state machine (gate §44)

Exact future states:

```text
BLUEPRINT_APPROVED
RESEARCH_READY
DRAFTING
TECHNICAL_REVIEW
INSTRUCTIONAL_REVIEW
ARABIC_REVIEW
ACCESSIBILITY_REVIEW
PILOT_READY
PILOTED
APPROVED_FOR_PUBLICATION
```

| State | Meaning |
|-------|---------|
| **BLUEPRINT_APPROVED** | 1C blueprint accepted for production intake (architecture) |
| **RESEARCH_READY** | Sources and seed constraints prepared |
| **DRAFTING** | Lesson / asset drafting underway |
| **TECHNICAL_REVIEW** | Domain technical accuracy check |
| **INSTRUCTIONAL_REVIEW** | Instructional design check |
| **ARABIC_REVIEW** | Arabic technical / bilingual QA |
| **ACCESSIBILITY_REVIEW** | A11y assets and alternatives verified |
| **PILOT_READY** | Eligible for learner pilot (not yet piloted) |
| **PILOTED** | Learner pilot executed and findings addressed |
| **APPROVED_FOR_PUBLICATION** | Allowed to enter PUBLISHED catalogue path (post-1D / ops) |

### Current 1C posture

| Item | State |
|------|-------|
| All Mission Blueprints | At or before **BLUEPRINT_APPROVED** intake candidate |
| Any Mission **PILOT_READY** | **No** |
| Any Mission **PILOTED** | **No** |
| Any Mission **APPROVED_FOR_PUBLICATION** | **No** |

Document review alone does **not** advance a Mission to PILOTED or APPROVED_FOR_PUBLICATION.

---

## Explicit non-goals

* No CMS implementation in this Gate.
* No Product Code Mission engine.
* No silent skip of Arabic / a11y / expert / pilot gates.
