# IMPLEMENTATION-0D — Screen and Journey Preflight

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0D-PREFLIGHT-SCREEN-JOURNEY |
| **Gate** | GHV.IMPLEMENTATION.0D |
| **Date** | 2026-07-22 |
| **Branch** | `feat/ghuravia-foundation` |
| **Starting HEAD** | `0416e8f23fee4dd8efaacaa6a6ab5b64295ae66b` |
| **Predecessor** | GHV.IMPLEMENTATION.0C-CLOSURE-02 — PASS |

## Purpose

Reconcile Master Screen Registry, Crow Personalization Flow, Onboarding Wireframes, and Critical Flows for the authorized Personalize → Origin → Nest-Intro-handoff slice before Product Code.

## Authoritative sequence

```text
ONB-001 — Personalize Entry
→ IDN-001 — Crow Personalize
→ IDN-002 — Habitat Select
→ IDN-003 — Character Select
→ IDN-001 — Review
→ ONB-002 — Set Origin
→ ONB-003 — Nest Intro handoff only
```

Paths A (guided) and B (quick-start) from `CROW-PERSONALIZATION-FLOW.md` are both authorized. Path C (later-edit via IDN-004) is **compatibility-preserved only** — Wingprint Home is **not** implemented in 0D.

## Authorized screens

| Screen ID | Name | 0D Product Code role |
|-----------|------|----------------------|
| ONB-001 | Personalize Entry | Full entry: guided / quick-start / Why a Crow? (upgrades 0C handoff stub) |
| IDN-001 | Crow Personalize | Base Crow, colors, style, optional accessories, review |
| IDN-002 | Habitat Select | Habitat backdrop selection |
| IDN-003 | Character Select | Character archetype selection |
| ONB-002 | Set Origin | Origin draft / review-later / complete |
| ONB-003 | Nest Intro | **HANDOFF ONLY** — thin Nest entry; no assessment |

## Explicitly out of scope

```text
ONB-004 Nest Assessment
ONB-005 Nest Result
ONB-006 Nest Learning Path
ONB-007 Choose Horizon
ONB-008 Future Preview
ONB-009 Choose Route
ONB-010 Eligibility Decision
ONB-011 Flight Plan Review
IDN-004 Wingprint Home
IDN-005 Privacy Settings
IDN-006 Titles and Crests
```

No new screen IDs. No alias activation.

## Journey gate conditions (server-authoritative)

| Screen | Required precondition |
|--------|------------------------|
| ONB-001 | Activated account (`state = ACTIVATED`) |
| IDN-001 | Guided or quick-start begun |
| IDN-002 | Valid Crow basics or quick-start defaults |
| IDN-003 | Valid habitat or quick-start defaults |
| ONB-002 | Minimum personalization complete |
| ONB-003 | Origin `COMPLETE` **or** governed `REVIEW_LATER` |

Unauthorized content must not render before redirect. Client redirects remain convenience only. Resume state is server-authoritative.

## Source reconciliation notes

1. **ONB-001 dual meaning:** 0C Product Code was handoff-only; wireframes define full Personalize Entry. 0D upgrades ONB-001 in place — same screen ID.
2. **IDN exit maps:** Registry lists IDN-001 → ONB-002; personalization flow interleaves IDN-002/003 then review. Prefer Crow Personalization Flow Paths A/B.
3. **ONB-003:** Registry exit ONB-004; wireframes offer Start/Review/Test. 0D implements Nest Intro **handoff only** — CTAs that would enter Nest assessment remain deferred/disabled with clear copy.
4. **FLOW-001** omits IDN-002/003 in the abbreviated step list — not a prohibition; Crow Personalization Flow is authoritative for those steps.

## Invariants retained

```text
Visual Identity ≠ Knowledge
Personalization ≠ Skill
Origin ≠ Trust
Origin ≠ Readiness
Payment ≠ Progression
No XP / Mastery / Rank / Prestige / Trust from personalization
No Horizon / Route / eligibility inference from Origin
```

## Preflight verdict

```text
PASS — PERSONALIZATION AND ORIGIN JOURNEY AUTHORITY RECONCILED
```
