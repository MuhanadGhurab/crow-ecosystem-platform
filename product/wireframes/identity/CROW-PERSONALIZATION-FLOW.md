# Crow Personalization Interaction Flow

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-FLOW-IDN-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [IDENTITY-WIREFRAMES.md](./IDENTITY-WIREFRAMES.md) · [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.4 · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · [SAVE-SYNC-OFFLINE-INTERACTION.md](../../interactions/SAVE-SYNC-OFFLINE-INTERACTION.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Exact cosmetic catalogue depth; partner packs — POST-LAUNCH PLANNED · advanced marketplace — OUT of launch |
| **Change history** | 1.0.0 — PD.3 |

**Rule:** Visual Identity ≠ Knowledge (Constitution). Personalization never implies Skill, Mastery, Rank, or Prestige.

Screens: ONB-001 → IDN-001 / IDN-002 / IDN-003 → continue ONB-002. Later edit: IDN-004 → IDN-001..003 / IDN-005 / IDN-006.

Wireframe IDs: `GHV-WF-IDN-001` … `GHV-WF-IDN-006`, `GHV-WF-ONB-001`.

---

## Purpose

Let the learner shape a Crow Wingprint that feels creative and culturally respectful **without** making first-flight onboarding unnecessarily long. Support three intentional paths: full guided, quick-start, and later-edit.

---

## Shared interaction elements

### Crow preview (always visible in setup)

```text
┌─────────────────────┐
│   Crow Preview      │
│  [live silhouette]  │
│  Display name       │
│  Habitat cue        │
│  Character cue      │
└─────────────────────┘
```

- Updates immediately when an option is selected (motion optional; reduced-motion = instant swap).
- Preview is decorative for understanding; primary labels remain text (a11y).
- Contrast chip: **Readable** / **Adjust recommended** (see Contrast validation).

### Category rail

Launch categories (Scope §3.4 — not an exhaustive marketplace):

| Category | Screen / zone | Notes |
|----------|---------------|-------|
| Base Crow / colors / style | IDN-001 | Core Wingprint basics |
| Habitat | IDN-002 | Environment backdrop / nest metaphor |
| Character | IDN-003 | Archetype / posture style |
| Cultural accessories | IDN-001 tertiary or sheet | Optional; respectful explanation required |
| Titles & Crests | IDN-006 | Earned / display only — not sold as Skill |
| Privacy visibility | IDN-005 + preview sheet | What others may see |

Category filtering: show one category at a time; options list scrolls; locked items stay visible (Explainable Lock — not hidden).

### Locked cosmetics

```text
┌──────────────────────────────────────────┐
│ Cosmetic (locked)                        │
│ Lock type: entitlement / prestige /      │
│   progression surface (as applicable)    │
│ What is missing                          │
│ Why it matters (identity, not Skill)     │
│ Path: earn · Merit (if any) · later      │
│ [Preview on Crow]  [Dismiss]             │
└──────────────────────────────────────────┘
```

- Locked items are **previewable** on the Crow without equipping.
- No pay-to-win implication; payment copy never claims Mastery or Rank.
- Broad partner packs / marketplace: **POST-LAUNCH PLANNED** — show as “Coming later” only when product policy allows tease; otherwise omit.

### Cultural accessories

- Optional. Never required to continue onboarding.
- Short explanation: cultural expression, not assessment; removable anytime.
- Respectful defaults; no stereotype forcing; user may skip category entirely.
- Privacy preview must show whether accessory is public / Rookery-visible / private.

### Contrast validation

- Continuous check of Crow + habitat + text label contrast against WCAG-oriented practice (certification not claimed).
- If fail: banner **Adjust colors for readability** + suggested safer pair; user may override with confirm (“Keep anyway”).
- High-contrast / reduced-motion preferences respected ([MOTION-ACCESSIBILITY-SPEC.md](../../screens/MOTION-ACCESSIBILITY-SPEC.md)).

### Privacy / public-visibility preview

```text
┌──────────────────────────────────────────┐
│ How others may see your Crow             │
│ Audience: Public · Rookery · Private     │
│ Shows: display name, Crow, titles…       │
│ Hides: email, assurance detail, …        │
│ [Open Privacy Settings → IDN-005]        │
└──────────────────────────────────────────┘
```

- Available from IDN-001 review step and IDN-004 Wingprint Home.
- Legal wording for export/deletion: pending external validation — label **PENDING LEGAL**.

### Save and resume

- Autosave draft Wingprint on each confirmed option ([SAVE-SYNC-OFFLINE-INTERACTION.md](../../interactions/SAVE-SYNC-OFFLINE-INTERACTION.md)).
- States: Saving · Saved · Offline Draft · Sync Failed + Retry.
- Interrupted onboarding resumes at last incomplete IDN/ONB step (registry rule).
- **Continue** requires basics minimum (see paths); cultural accessories never block.

### Final Wingprint review

Before leaving Personalize phase:

1. Crow preview (full).
2. Habitat + Character summary.
3. Privacy visibility one-liner.
4. Reminder: identity ≠ knowledge.
5. Primary: **Continue to Origin** (ONB-002) · Secondary: **Edit** · Tertiary: **Finish later** (quick-start / skip remainder).

---

## Path A — Full guided

**Intent:** First-time learner who wants a complete Wingprint before Nest.

```text
ONB-001 Personalize Entry
  → Start guided
IDN-001 Crow Personalize
  → Base Crow, colors, style
  → Optional cultural accessories (explain + skip OK)
  → Contrast check
IDN-002 Habitat Select
IDN-003 Character Select
IDN-001 (return) Wingprint review + privacy preview
  → Save
ONB-002 Set Origin
```

| Step | Primary | Secondary | Notes |
|------|---------|-----------|-------|
| ONB-001 | Start guided | Quick start · Why Crow? | Creative tone; time estimate soft, not fake urgency |
| IDN-001 | Save & continue | Skip accessories · Preview privacy | Locked cosmetics visible |
| IDN-002 | Select habitat | Back | Preview updates |
| IDN-003 | Select character | Back | Does not affect Nest bands |
| Review | Continue to Origin | Edit category · Privacy | Constitution line visible |

**Acceptance:** User can complete full path without payment; unlocked launch cosmetics only required for “complete” badge if any — incomplete cosmetics never block Origin.

---

## Path B — Quick-start

**Intent:** Reach Nest / Horizon faster; personalize later.

```text
ONB-001
  → Quick start
IDN-001
  → Apply safe defaults (base Crow + neutral habitat/character)
  → Optional: tweak one category
  → Continue
ONB-002
```

Rules:

- Defaults are readable (pass contrast).
- Banner: **You can customize anytime from Wingprint.**
- Skipped categories remain editable via Path C.
- No shame language for skipping cosmetics.

---

## Path C — Later-edit (ongoing)

**Intent:** Authenticated user (A1+) changes Wingprint after first flight.

```text
Core nav → Wingprint (IDN-004)
  → Edit Crow → IDN-001
  → Edit Habitat → IDN-002
  → Edit Character → IDN-003
  → Privacy → IDN-005
  → Titles & Crests → IDN-006
  → Save → return IDN-004
```

Rules:

- Same preview / lock / contrast / privacy patterns as setup.
- Earned Titles & Crests: display and pin preferences only; cannot purchase Mastery.
- Export / delete account actions exit to privacy flow (FLOW-016) — not cosmetics.

---

## Path comparison

| Concern | Full guided | Quick-start | Later-edit |
|---------|-------------|-------------|------------|
| Duration | Longer; category-by-category | Short; defaults | On demand |
| Crow preview | Always | Always | Always |
| Locked cosmetics | Preview + Explainable Lock | Same | Same |
| Cultural accessories | Offered with skip | Deferred | Available |
| Contrast | Enforced with override | Defaults pass | Re-check on change |
| Privacy preview | Before Origin | Soft reminder | Full IDN-005 |
| Blocks learning | Never | Never | Never |

---

## Skip and return

- **Skip category:** mark deferred; continue.
- **Finish later** from ONB-001/IDN-001: persist draft; next session → resume or Wingprint.
- **Back:** previous meaningful step; never discard unsaved without confirm if dirty.

---

## Copy principles (low-fi)

- Creative, welcoming, concise.
- No implication that a “cooler Crow” means stronger Skill.
- Locked items: clear path, no shame.
- Cultural accessories: optional expression.

---

## Traceability

| Capability | Screens | Flow |
|------------|---------|------|
| CAP-ONB-006 Crow personalization | ONB-001, IDN-001..003 | Paths A–C |
| Privacy / identity evolution | IDN-004, IDN-005, IDN-006 | Path C + FLOW-016 |

---

## Out of scope (this document)

- Product Code / visual assets / final art.
- Exact cosmetic SKUs and partner packs (POST-LAUNCH PLANNED).
- Final privacy legal text (PENDING EXTERNAL VALIDATION).
