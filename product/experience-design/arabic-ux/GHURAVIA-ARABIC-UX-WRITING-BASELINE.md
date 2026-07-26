# GHURAVIA Arabic UX Writing Baseline

| Field | Value |
|-------|-------|
| **Status** | **FOUNDER-REQUIRED ARABIC REMEDIATION — READY FOR COPY REVIEW** |
| **Not** | LOCKED (requires explicit Founder approval) |
| **Decision** | [DEC-357](../../../governance/decisions/DECISION-REGISTER.md) |
| **Audience** | Muhannad Haitham Fuad Ghurab — GHURAVIA Founder |
| **Scope** | Static prototypes + language baseline only — no Product Code |
| **Date** | 2026-07-26 |

## Purpose

Establish clear contemporary Modern Standard Arabic as the primary authored product language for GHURAVIA learner-facing interfaces. Arabic is not a translation layer over English.

## Language standard

Write in **CLEAR CONTEMPORARY MODERN STANDARD ARABIC** that is:

- natural to native speakers;
- understandable without reading English;
- suitable for Saudi Arabia and the wider Arab world;
- appropriate for users aged 15+;
- professional but warm;
- direct and meaningful;
- concise without removing necessary explanation;
- modern without slang;
- technically accurate without sounding academic;
- consistent across all screens.

## Do not use

- Saudi dialect in the official interface;
- classical ornate Arabic;
- government-document language;
- literal English word order;
- machine-translated terminology;
- unexplained metaphor;
- vague poetic copy for functional actions;
- excessive passive voice;
- noun chains that hide the action;
- English words merely because the Arabic sentence was not solved;
- `كنسي` / `كنسيّة` / `المسار الكنسي` for “canonical”;
- unexplained `مضاد للواقع` for “counterfactual”.

## Core writing rule

For every string, ask:

1. What happened?
2. Why does it matter?
3. What can the user do?
4. Can a native Arabic speaker understand it without English context?
5. Does it sound like something a real Arabic product would say?

When a sentence fails any question, rewrite the complete sentence from intended meaning.

## Related baselines

| Document | Role |
|----------|------|
| [GHURAVIA-ARABIC-PRODUCT-TERMINOLOGY-GLOSSARY.md](./GHURAVIA-ARABIC-PRODUCT-TERMINOLOGY-GLOSSARY.md) | Controlled terms |
| [GHURAVIA-ARABIC-TONE-AND-VOICE.md](./GHURAVIA-ARABIC-TONE-AND-VOICE.md) | Tone |
| [GHURAVIA-ARABIC-CTA-AND-ACTION-LANGUAGE.md](./GHURAVIA-ARABIC-CTA-AND-ACTION-LANGUAGE.md) | Buttons and actions |
| [GHURAVIA-ARABIC-NOTIFICATION-LANGUAGE.md](./GHURAVIA-ARABIC-NOTIFICATION-LANGUAGE.md) | Signals |
| [GHURAVIA-RAVEN-ARABIC-VOICE.md](./GHURAVIA-RAVEN-ARABIC-VOICE.md) | RAVEN |
| [GHURAVIA-ARABIC-MISSION-WRITING-RULES.md](./GHURAVIA-ARABIC-MISSION-WRITING-RULES.md) | Missions / decisions |
| [GHURAVIA-ARABIC-CROWPRINT-AND-IDENTITY-LANGUAGE.md](./GHURAVIA-ARABIC-CROWPRINT-AND-IDENTITY-LANGUAGE.md) | Crowprint / lineage |
| [ARABIC-COPY-PROBLEM-INVENTORY.md](./ARABIC-COPY-PROBLEM-INVENTORY.md) | Audit |
| [ARABIC-BEFORE-AFTER-REVIEW-MATRIX.md](./ARABIC-BEFORE-AFTER-REVIEW-MATRIX.md) | QA matrix |
| [FOUNDER-ARABIC-UX-COPY-REVIEW.md](./FOUNDER-ARABIC-UX-COPY-REVIEW.md) | Founder worksheet |

## Implementation boundary

- Prototype Arabic in `hybrid-h1/` and `hybrid-h1-1/` may be rewritten under this baseline.
- Learner-facing Arabic in `apps/web/` is inventoried only — **do not change Product Code** until Founder approves this baseline.
- Design, motion, interaction structure, and scoring behavior remain unchanged.

## Approval

Cursor must not infer Founder approval. Status remains ready for review until an explicit Founder verdict is recorded.
