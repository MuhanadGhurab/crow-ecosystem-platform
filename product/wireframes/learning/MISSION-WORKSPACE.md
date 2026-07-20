# Mission Workspace — Wireframe Spec

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-LRN-MISSION-WS |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Screens** | LRN-001 (Mission Player), LRN-006 (Assessment Runner) |
| **Related** | [LEARNING-WIREFRAMES.md](./LEARNING-WIREFRAMES.md) · [SAVE-SYNC-OFFLINE-INTERACTION.md](../../interactions/SAVE-SYNC-OFFLINE-INTERACTION.md) · [PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Change history** | 1.0.0 — PD.3 |

---

## Purpose

Define the Mission Focus shell shared by all Mission types: learning canvas, save visibility, exit vs submit, and variant canvases. Visual polish is out of scope; structure and interaction contracts are locked.

---

## Hard rules (Mission Focus)

1. **No subscription interrupt during active learning.** Commercial upgrade, grace, capacity, and plan CTAs must not modal-interrupt or replace the Mission canvas while the learner is in an active Mission session. Entitlement failures surface as Explainable Locks **before** entry or on Safe Exit return — never mid-step paywalls.
2. **Save status is always visible** in the Mission header (subtle chip). States: Saving · Saved · Offline Draft · Syncing · Sync Failed · Conflict Detected.
3. **Safe Exit ≠ Submit.** Safe Exit preserves progress and returns to prior meaningful context (usually Continue Flight / Stage). Submit finalizes assessment or Mission completion steps that require server ack.
4. Hidden UI is not authorization. Locked resources show reason, not silent absence of controls.

---

## Shared shell — GHV-WF-LRN-001 family base

```text
┌──────────────────────────────────────────────────────────────────┐
│ [<] Mission title · Stage crumb (optional)     [Save: Saved 14:02]│
│ Progress ████████░░░░  Step 3/7 · type badge                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    LEARNING CANVAS (variant)                     │
│                                                                  │
│  ┌─ Resources / Notes (collapsible) ─────────────────────────┐  │
│  │ Links · glossary · personal notes · attachments           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ [Safe Exit]                    [Secondary]      [Continue/Submit]│
└──────────────────────────────────────────────────────────────────┘
```

### Header

| Element | Behavior |
|---------|----------|
| Back / Safe Exit affordance | Same semantics as footer Safe Exit; confirm only if conflict or unsaved local-only risk |
| Progress | Step or section progress; never fake completion |
| Type badge | written · video · visualization · scenario · practical · laboratory · assessment · collaborative · remediation |
| Save chip | Per Sync spec; tap opens status detail (timestamp, device, offline limits) |

### Footer actions

| Control | Meaning |
|---------|---------|
| **Safe Exit** | Persist draft/progress → show sync state if not Saved → leave Mission Focus. Does **not** submit Evidence or final assessment. |
| **Continue** | Advance within Mission when step complete (client + server rules). |
| **Submit** | Finalizing action only (assessment end, Mission complete gate, Evidence handoff). Requires confirmed server sync. |

### Safe Exit sheet (when needed)

```text
┌────────────────────────────────────────────┐
│ Leave Mission?                             │
│ Progress: Saved · last sync 14:02          │
│ Offline Draft present: Yes / No            │
│ [Stay]              [Safe Exit]            │
└────────────────────────────────────────────┘
```

No “upgrade to continue” on this sheet.

---

## Variant canvases

Each variant replaces only the **LEARNING CANVAS** region. Shell, save chip, and Safe Exit/Submit rules stay constant.

### 1) Written

```text
│  Title / instruction                                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Reading / problem text                             │  │
│  │ ...                                                │  │
│  └────────────────────────────────────────────────────┘  │
│  Response area (short answer / structured fields)        │
│  [Check understanding] (optional formative)              │
```

Primary: Continue when fields valid. Submit only at Mission end if required.

### 2) Video

```text
│  ┌────────────────────────────────────────────────────┐  │
│  │  ▶  Video player (captions required)               │  │
│  │     progress · playback rate · transcript toggle   │  │
│  └────────────────────────────────────────────────────┘  │
│  Key checkpoints / reflection prompts                    │
```

Reduced motion: static keyframes + transcript sufficient to complete. No autoplay sound.

### 3) Visualization

```text
│  ┌──────────────────────────┬─────────────────────────┐  │
│  │ Interactive viz / diagram│ Legend · controls       │  │
│  │ (pan/zoom if applicable) │ Explainable states      │  │
│  └──────────────────────────┴─────────────────────────┘  │
│  Task: interpret / annotate / answer                     │
```

Fallback if viz fails: simplified static diagram + text path (degraded, completable).

### 4) Scenario

```text
│  Situation brief                                         │
│  Decision tree / branching prompts                       │
│  ┌─ Choice A ─┐  ┌─ Choice B ─┐  ┌─ Choice C ─┐         │
│  Consequence preview (non-punitive language)             │
│  Branch position saved on Safe Exit                      │
```

### 5) Practical

```text
│  Objective · success criteria                            │
│  Steps checklist (markable)                              │
│  Artifact upload / workspace link (draft)                │
│  → May hand off to Evidence Capture (LRN-003)            │
```

Submit on Mission complete may open Evidence prompt; not a paywall.

### 6) Laboratory

```text
│  Lab brief · safety / integrity notice                   │
│  ┌─ Environment panel ─┐  ┌─ Instructions / tasks ─┐    │
│  │ Sandbox / tools     │  │ Step list              │    │
│  └─────────────────────┘  └────────────────────────┘    │
│  Capture outputs → draft Evidence path                   │
```

Unsupported offline lab actions: disabled + reason; Safe Exit keeps notes.

### 7) Assessment (also LRN-006)

```text
│  Assessment header · integrity notice · timer if any     │
│  Question N of M                                         │
│  Answer control (MCQ / short / multi)                    │
│  [Previous]                              [Next / Submit] │
```

- **Submit** = final assessment submission (server sync required).
- **Safe Exit** mid-assessment: save progress if policy allows; otherwise warn that incomplete attempt may discard per assessment rules (explicit copy).
- No subscription interrupt; entitlement checked at runner entry.

### 8) Collaborative

```text
│  Team / project context (COM-006 link if entitled)       │
│  Shared task board (role-scoped)                         │
│  Your contribution · peer status (no DMs)                │
│  [Request review] / Continue                             │
```

Trust/eligibility locks before entry; in-session only collaboration states.

### 9) Remediation

```text
│  Why you're here (non-shaming): gap / revision / Nest    │
│  Smaller scoped Mission steps                            │
│  Link to Learning Graph (WLD-003) if prereq-related      │
│  Success returns to blocked Route/Stage                  │
```

Primary CTA: Complete remediation step. Secondary: View path on Graph.

---

## Entry / exit

| From | To |
|------|----|
| SKY-001 Continue Flight, LRN-007, LRN-008, ONB-011 | LRN-001 / LRN-006 |
| Mission complete | LRN-002 |
| Evidence required | LRN-003 |
| Safe Exit | SKY-001 / LRN-007 / last meaningful context |
| Prerequisite lock | WLD-003 (no paywall dominance) |

---

## States

| State | UI |
|-------|-----|
| Loading | Skeleton canvas; Save chip idle |
| Empty step content | Error recovery: retry / Safe Exit / support |
| Locked resource mid-Mission | Inline Explainable Lock; do not eject to checkout |
| Offline | Offline Draft banner; Submit disabled until sync (unless documented exception — none at launch) |
| Error | Retry; work retained |
| Success step | Advance Continue |

---

## Acceptance (wireframe)

- [ ] Nine variants documented; shell shared
- [ ] No subscription modal during active Mission
- [ ] Save chip present on all variants
- [ ] Safe Exit and Submit are distinct and labeled
- [ ] Assessment Submit requires sync visibility
