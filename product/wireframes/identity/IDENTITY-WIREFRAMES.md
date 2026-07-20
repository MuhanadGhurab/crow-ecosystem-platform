# Identity / Wingprint Wireframes

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-FAM-IDN-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [CROW-PERSONALIZATION-FLOW.md](./CROW-PERSONALIZATION-FLOW.md) · [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · [PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md) · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Visual tokens; exact cosmetic catalogue |
| **Change history** | 1.0.0 — PD.3 |

**Notation:** Markdown + ASCII only. Not final UI. Shell: Guided Onboarding (IDN-001..003) · Adaptive World / Wingprint (IDN-004..006).

Wireframe IDs match screens: `GHV-WF-IDN-00N`.

---

## Family model — setup (IDN-001..003)

Shared low-fi layout (desktop). Mobile: stack Preview → Options → RAVEN → sticky actions.

```text
┌────────────────────────────────────────────────────────────┐
│ Step ●●○  Personalize · Save chip: Saved                   │
│ Context: Shape your Crow · Visual Identity ≠ Knowledge     │
├──────────────────────────┬─────────────────────────────────┤
│ PRIMARY DECISION         │ PREVIEW / EXPLAIN               │
│ Category: [active]       │ ┌─────────────────────────────┐ │
│                          │ │      Crow Preview           │ │
│ ○ Option A               │ │      Habitat cue            │ │
│ ● Option B (selected)    │ │ Contrast: Readable          │ │
│ ○ Option C [Locked]      │ └─────────────────────────────┘ │
│ ○ Cultural accessory…    │ RAVEN: short guidance           │
│                          │ [Privacy preview]               │
├──────────────────────────┴─────────────────────────────────┤
│ [Back]  [Save]                    [Continue]               │
└────────────────────────────────────────────────────────────┘
```

| Element | Behavior |
|---------|----------|
| Step indicator | Personalize substeps; not Nest/Horizon yet |
| Category | One active; switch without losing draft |
| Locked option | Visible; opens Explainable Lock sheet |
| Privacy preview | Sheet: public / Rookery / private surfaces |
| Continue | Primary; one dominant action |

RTL: mirror columns; Crow preview stays understandable without relying on left/right meaning.

---

## GHV-WF-IDN-001 — Crow Personalize (IDN-001)

**Purpose:** Base Crow, colors, style; optional cultural accessories; contrast; entry to Habitat/Character.

```text
┌────────────────────────────────────────────────────────────┐
│ ●○○ Crow · Habitat · Character          [Saved 12:01]      │
├──────────────────────────┬─────────────────────────────────┤
│ Base Crow                │         .---.                   │
│ Colors                   │        / o o \   ← Crow         │
│ Style                    │        \  >  /                  │
│ Cultural accessories     │      ~~~'| |'~~~  Habitat wash  │
│                          │ Contrast: Readable              │
│ Palette: [■][■][■][■]    │                                 │
│ Style:   Soft · Bold ·   │ “Colors are yours — they do not │
│          Classic         │  change what you can learn.”    │
│                          │                                 │
│ Accessory: [None] [A][B] │ [How others see this →]         │
│            [C Locked]    │                                 │
├──────────────────────────┴─────────────────────────────────┤
│ [Back ONB-001]  [Quick defaults]     [Continue → Habitat]  │
└────────────────────────────────────────────────────────────┘
```

| State | UI |
|-------|-----|
| empty | Prompt select base; Continue disabled until minimum base |
| default | Safe defaults applied (quick-start) |
| locked cosmetic | Lock sheet; Preview on Crow allowed |
| contrast fail | Banner + Adjust / Keep anyway |
| offline draft | Offline Draft banner; Continue when policy allows local |

**Exits:** IDN-002 · IDN-003 · privacy sheet · ONB-002 (if review complete) · Wingprint later.

---

## GHV-WF-IDN-002 — Habitat Select (IDN-002)

**Purpose:** Choose habitat backdrop / nest metaphor.

```text
┌────────────────────────────────────────────────────────────┐
│ ○●○ Crow · Habitat · Character                             │
├──────────────────────────┬─────────────────────────────────┤
│ Habitats                 │ Crow Preview on selected        │
│ ● Coastal shelf          │ habitat                         │
│ ○ Mountain roost         │                                 │
│ ○ City antenna           │ Short blurb: atmosphere only    │
│ ○ Desert wadi            │                                 │
│ ○ [Locked — later]       │                                 │
├──────────────────────────┴─────────────────────────────────┤
│ [Back]                              [Continue → Character] │
└────────────────────────────────────────────────────────────┘
```

Habitat names above are **illustrative placeholders for wireframe layout only**; final habitat catalogue may be refined without inventing learning Route names. Selection does not affect Nest readiness bands.

---

## GHV-WF-IDN-003 — Character Select (IDN-003)

**Purpose:** Character archetype / posture style.

```text
┌────────────────────────────────────────────────────────────┐
│ ○○● Crow · Habitat · Character                             │
├──────────────────────────┬─────────────────────────────────┤
│ Character                │ Crow Preview                    │
│ ● Curious Scout          │                                 │
│ ○ Steady Builder         │ “Character is expression,       │
│ ○ Careful Guardian       │  not a Skill score.”            │
│ ○ [Locked]               │                                 │
├──────────────────────────┴─────────────────────────────────┤
│ [Back]                         [Continue → Review / Origin]│
└────────────────────────────────────────────────────────────┘
```

Archetype labels are low-fi placeholders for layout; they do not create progression classes or Prestige.

**After Character:** return to IDN-001 review strip or proceed ONB-002 per flow doc.

---

## Family model — ongoing Wingprint (IDN-004..006)

Core shell: rail + Wingprint canvas (desktop); bottom nav Wingprint (mobile).

```text
┌──────┬─────────────────────────────────────────────────────┐
│ Rail │ Wingprint · Sync: Saved                             │
│ Nav  ├──────────────────────┬──────────────────────────────┤
│      │ Identity summary     │ Crow Preview                 │
│      │ Display name         │ Titles pin (if any)          │
│      │ Habitat · Character  │                              │
│      │ [Edit Crow]          │ [Privacy] [Titles & Crests]  │
│      ├──────────────────────┴──────────────────────────────┤
│      │ Progression exits (PRG-*) — secondary               │
└──────┴─────────────────────────────────────────────────────┘
```

---

## GHV-WF-IDN-004 — Wingprint Home (IDN-004)

```text
┌──────┬─────────────────────────────────────────────────────┐
│Flight│ WINGPRINT                                           │
│World │ Display name ........................ @handle       │
│Live  │ ┌──────────┐  Habitat: …   Character: …             │
│Rook  │ │  Crow    │  Assurance: A1                         │
│Log   │ │ Preview  │                                        │
│Wing* │ └──────────┘  [Edit appearance]                     │
│      │              [Privacy settings]                     │
│      │              [Titles & Crests]                      │
│      │              [Progression overview → PRG-001]       │
│      │ Reminder: Visual Identity ≠ Knowledge               │
└──────┴─────────────────────────────────────────────────────┘
```

| Action | Target |
|--------|--------|
| Edit appearance | IDN-001 (later-edit path) |
| Privacy settings | IDN-005 |
| Titles & Crests | IDN-006 |
| Progression | PRG-* (not identity cosmetics) |

---

## GHV-WF-IDN-005 — Privacy Settings (IDN-005)

```text
┌────────────────────────────────────────────────────────────┐
│ Privacy · Wingprint                                        │
│ Who can see your Crow and profile surfaces                 │
├────────────────────────────────────────────────────────────┤
│ Public discovery ........ ( ) Hidden  (●) Limited  ( ) On  │
│ Rookery visibility ...... ( ) Off     (●) On               │
│ Display name ............ (●) Public  ( ) Rookery only     │
│ Titles & Crests ......... (●) Show    ( ) Hide             │
│ Evidence portfolio ...... (policy summary — PENDING LEGAL) │
├────────────────────────────────────────────────────────────┤
│ [Preview as others see]     [Export data]  [Delete…]       │
│ Export/Delete → step-up + consequence (FLOW-016)           │
├────────────────────────────────────────────────────────────┤
│ [Cancel]                                      [Save]       │
└────────────────────────────────────────────────────────────┘
```

Destructive paths: confirmation + step-up; toast alone insufficient.

---

## GHV-WF-IDN-006 — Titles & Crests (IDN-006)

```text
┌────────────────────────────────────────────────────────────┐
│ Titles & Crests · earned marks                             │
│ Display only — not Skill purchase                          │
├────────────────────────────┬───────────────────────────────┤
│ Crests                     │ Preview on Crow               │
│ ● Crest A (pinned)         │                               │
│ ○ Crest B                  │ Title pin: [Select…]          │
│ ○ Crest C [Locked earn]    │                               │
│                            │ Empty: “Complete Missions and │
│ Titles                     │  Evidence to earn marks.”     │
│ ○ Title…                   │                               │
├────────────────────────────┴───────────────────────────────┤
│ [Back to Wingprint]                                        │
└────────────────────────────────────────────────────────────┘
```

Locked Crests use progression/earn Explainable Lock — **no** commercial Skill implication. Exact Crest catalogue: PENDING GHV.PROGRESSION.1 where formulas apply.

---

## Adaptive / a11y notes

| Concern | Behavior |
|---------|----------|
| Reduced motion | Instant preview swap; no required animation |
| Contrast | Chip + override confirm |
| RTL | Mirrored chrome; preview centered |
| Keyboard | Category list and options fully focusable |
| Screen reader | Option names + selected + locked reason |

---

## Review status

| Wireframe ID | Screen | Review |
|--------------|--------|--------|
| GHV-WF-IDN-001 | IDN-001 | LOCKED AT LOW FIDELITY |
| GHV-WF-IDN-002 | IDN-002 | LOCKED AT LOW FIDELITY |
| GHV-WF-IDN-003 | IDN-003 | LOCKED AT LOW FIDELITY |
| GHV-WF-IDN-004 | IDN-004 | LOCKED AT LOW FIDELITY |
| GHV-WF-IDN-005 | IDN-005 | LOCKED AT LOW FIDELITY |
| GHV-WF-IDN-006 | IDN-006 | LOCKED AT LOW FIDELITY |
