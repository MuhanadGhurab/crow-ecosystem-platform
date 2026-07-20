# Nest Interaction Flow

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-FLOW-ONB-NEST-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [ONBOARDING-WIREFRAMES.md](./ONBOARDING-WIREFRAMES.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.5 · [MASTER-USER-JOURNEY.md](../../journeys/MASTER-USER-JOURNEY.md) · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · [SAVE-SYNC-OFFLINE-INTERACTION.md](../../interactions/SAVE-SYNC-OFFLINE-INTERACTION.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Exact Nest Mission catalogue content — GHV.LEARNING.1 |
| **Change history** | 1.0.0 — PD.3 |

Screens: ONB-003 Nest Intro · ONB-004 Nest Assessment · ONB-005 Nest Result · ONB-006 Nest Learning Path. Wireframes: `GHV-WF-ONB-003` … `GHV-WF-ONB-006`.

---

## Purpose

Digital Foundations readiness: help learners choose **Start**, **Review**, or **Test**, understand results without shame, and continue into Horizon selection or Nest Missions. Low readiness is a **path**, not a judgment of human value.

---

## Entry choices (ONB-003)

```text
┌────────────────────────────────────────────────────────────┐
│ The Nest · Digital Foundations                             │
│ Build readiness for your first Routes — at your pace.      │
├────────────────────────────────────────────────────────────┤
│ [ Start The Nest ]     Begin Nest learning path            │
│ [ Review The Nest ]    Browse topics; optional light check │
│ [ Test Your Readiness ] Assessment → banded result         │
├────────────────────────────────────────────────────────────┤
│ RAVEN: You can change path later within rules.             │
│ [Back · Origin]                                            │
└────────────────────────────────────────────────────────────┘
```

| Choice | Meaning | Next |
|--------|---------|------|
| Start The Nest | Enter Nest Missions without requiring a full test first | ONB-006 (or first Nest Mission LRN-001) |
| Review The Nest | Explore foundations content; may take a lighter check | ONB-004 optional / content then ONB-005 if assessed |
| Test Your Readiness | Formal readiness assessment | ONB-004 → ONB-005 |

User Choice principle: present options; do not silently auto-enroll into paid capacity.

---

## Assessment progress (ONB-004)

```text
┌────────────────────────────────────────────────────────────┐
│ Readiness check · Step 4 of N · Saved                      │
├────────────────────────────────────────────────────────────┤
│ Prompt / task area                                         │
│ Progress ████░░░░  not a public rank                       │
├────────────────────────────────────────────────────────────┤
│ [Save & exit]                         [Continue]           │
└────────────────────────────────────────────────────────────┘
```

Rules:

- Save and resume per sync spec; **Submit assessment** requires confirmed sync.
- Progress is readiness toward Nest bands — **not** XP, Mastery, Rank, or Prestige.
- No countdown fake urgency.
- Exit ≠ abandon forever; draft retained.

---

## Readiness bands (authoritative — Scope §3.5)

| Result | Label | Rule |
|--------|-------|------|
| ≥ 70% | Ready to Fly | May skip Nest; weaknesses → recommended reviews; **no advanced Mastery from skip alone** |
| 50%–69% | Guided Skip | May continue; **Micro-Missions** inserted; advanced Routes keep prerequisites |
| < 50% | Nest Recommended | Nest recommended active journey; advanced gated content unavailable until Nest done or readiness ≥ 50%; **public exploration allowed** |

---

## Result explanation (ONB-005) — no-shame language

**Required tone:** supportive, specific, forward-looking. Never: fail, weak, behind, “you are not good enough.”

### Ready to Fly (≥ 70%)

```text
┌────────────────────────────────────────────────────────────┐
│ Ready to Fly                                               │
│ You’re cleared to choose a Horizon.                        │
│ Suggested reviews (optional): topic A, topic B             │
│ Note: Skipping Nest does not grant advanced Mastery.       │
│ [Choose Horizon → ONB-007]  [Still take Nest → ONB-006]    │
└────────────────────────────────────────────────────────────┘
```

### Guided Skip (50%–69%)

```text
┌────────────────────────────────────────────────────────────┐
│ Guided Skip                                                │
│ You may continue. We’ll insert short Micro-Missions        │
│ where they help — prerequisites still apply to advanced    │
│ Routes.                                                    │
│ [Continue to Horizon → ONB-007]  [Strengthen in Nest]      │
└────────────────────────────────────────────────────────────┘
```

### Nest Recommended (< 50%)

```text
┌────────────────────────────────────────────────────────────┐
│ Nest Recommended                                           │
│ The Nest is the best next flight for a strong foundation.  │
│ You can still explore the public World Map.                │
│ Advanced gated Routes stay closed until Nest complete or   │
│ readiness reaches 50%+. This is a path — not a verdict.    │
│ [Enter Nest path → ONB-006]  [Explore World Map → WLD-001] │
└────────────────────────────────────────────────────────────┘
```

Readiness Requirement locks elsewhere reuse [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md): gap vs Nest bands; options Nest path, Micro-Mission, retest.

---

## Micro-Mission insertion (Guided Skip)

```text
Flight Plan / Route overview
  … Mission …
  … [Micro-Mission: Foundations refresh — topic] …
  … Mission …
```

- Short, clearly labeled **Micro-Mission**.
- Does not replace Evidence requirements for Mastery.
- Skip of Micro-Mission only where policy allows; if required, Explainable Lock (Readiness) with path to complete.
- Inserted into active journey when Guided Skip continues to Horizon/Route — not as punishment UI.

---

## Nest Learning Path (ONB-006)

```text
┌────────────────────────────────────────────────────────────┐
│ Nest Learning Path                                         │
│ Digital Foundations · Missions                             │
├────────────────────────────────────────────────────────────┤
│ ○ Mission 1 …                                              │
│ ● Mission 2 … (current)                                    │
│ ○ Mission 3 …                                              │
│ … catalogue detail PENDING GHV.LEARNING.1                  │
├────────────────────────────────────────────────────────────┤
│ [Start / Resume Mission → LRN-001]                         │
│ [Retest readiness → ONB-004] when eligible                 │
└────────────────────────────────────────────────────────────┘
```

Do **not** invent Nest Mission titles beyond generic placeholders. Exact Nest curriculum: CONTROLLED LAUNCH content pending LEARNING.1 lock.

---

## Retest

| When | Behavior |
|------|----------|
| After Nest Missions progress | Offer **Retest Your Readiness** |
| After recommended reviews (Ready to Fly) | Optional retest — not required to proceed |
| Band improves | Update Nest decision; unlock per Scope rules |
| Band still < 50% | Keep Nest Recommended messaging; no shame |

Retest uses ONB-004 → ONB-005 again. Prior learning progress preserved.

---

## Save, resume, interruption

- Nest Intro / Assessment / Path drafts resume at last incomplete ONB/LRN step.
- Offline: assessment **final submit** blocked until sync (sync spec).
- Returning stalled users: Skyboard may recommend Nest Micro-Mission or Resume (FLOW-007).

---

## What Nest interaction must never do

- Present low result as moral or intellectual failure.
- Sell Mastery, Rank, or Prestige to skip Nest.
- Hide advanced gates (Hidden UI ≠ Authorization).
- Auto-start paid plan capacity.
- Invent Route names for “advanced” examples (use Horizon names OPERATE / BUILD / ANALYZE / PROTECT / LEAD only).

---

## Traceability

| Journey phase | Screens | Outcome |
|---------------|---------|---------|
| Nest decision | ONB-003..006 | Ready to Fly / Guided Skip / Nest Recommended |
| CAP-ONB-008 | Nest | Scope §3.5 bands |
