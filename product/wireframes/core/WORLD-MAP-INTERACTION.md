# World Map Interaction — Wireframe Spec

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-WLD-INTERACT |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Screens** | WLD-001 · WLD-002 · WLD-003 (+ exits to LRN-007/008) |
| **Related** | [CORE-WIREFRAMES.md](./CORE-WIREFRAMES.md) · [NAVIGATION-INTERACTION-SPEC.md](../../interactions/NAVIGATION-INTERACTION-SPEC.md) · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · [MOTION-ACCESSIBILITY-SPEC.md](../../screens/MOTION-ACCESSIBILITY-SPEC.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Change history** | 1.0.0 — PD.3 |

---

## Purpose

Define spatial navigation of the learning world: zoom stack, pan, keyboard, mobile list alternative, locks, Bridges, and reduced-motion behavior. Low-fidelity structure only.

---

## Zoom stack (authoritative)

```text
World (WLD-001)
  └─ Horizon (WLD-002)
       └─ Route (LRN-008)
            └─ Stage (LRN-007)
                 └─ Mission (LRN-001)
```

Breadcrumb mirrors the stack: **World → Horizon → Route → Stage → Mission**. Mission Focus may hide deep crumbs (noise rule).

| Level | Screen | Select does |
|-------|--------|-------------|
| World | WLD-001 | Focus / open Horizon; Nest entry |
| Horizon | WLD-002 | Open Route (or ONB choose Route) |
| Route | LRN-008 | Open Stage |
| Stage | LRN-007 | Open Mission |
| Mission | LRN-001 | Enter Mission Focus |

Zoom out: Mission Safe Exit → Stage → Route → Horizon → World (or jump via nav World).

---

## WLD-001 — World Map canvas

```text
┌──────────────────────────────────────────────────────────────────┐
│ World · [Search/filter] · Nest entry                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│        [Horizon A]     [Horizon B]     [Horizon C]               │
│              \ Bridge /         \ Bridge /                       │
│        [Horizon D]                 [Horizon E]                   │
│                                                                  │
│   Nest node (onboarding / remediation entry)                     │
│                                                                  │
│   Pan surface · zoom controls (+/−) · fit-all                    │
├──────────────────────────────────────────────────────────────────┤
│ Selected: Horizon B — short blurb         [Open Horizon]         │
└──────────────────────────────────────────────────────────────────┘
```

### Pan

- Drag / touch drag pans the map.
- Edge affordances optional; content never trapped off-screen without “Fit all”.
- Pan does not change selection alone; click/tap selects.

### Zoom

- Pinch / wheel / buttons zoom within World level (overview ↔ readable labels).
- **Semantic zoom** (enter Horizon) is a deliberate Open / double-activate — not accidental wheel past a threshold without confirm on mobile.

---

## Keyboard

| Key | Action |
|-----|--------|
| Tab / Shift+Tab | Move among Horizons, Nest, Bridges, chrome |
| Enter / Space | Open focused node (Horizon / Nest / Bridge detail) |
| Arrow keys | Move focus between neighboring nodes (logical graph order) |
| + / − | Visual zoom in/out at current level |
| Escape | Clear selection · or zoom out one semantic level if inside Horizon detail overlay |
| Home | Fit all / return focus to Nest or last Horizon |

Focus rings mandatory; map is not mouse-only.

---

## Mobile list alternative

When map viewport is too small or user prefers list (setting or automatic compact):

```text
┌────────────────────────────────────────────┐
│ World · Map | List toggle                  │
├────────────────────────────────────────────┤
│ Nest — Continue / Start                    │
│ Horizon A — status                         │
│ Horizon B — status · Bridges: 1            │
│ ...                                        │
│ [Open] on row                              │
└────────────────────────────────────────────┘
```

List and map share the same data and locks; switching preserves selection.

---

## Locks on map / list

Locked Horizons/Routes show **lock glyph + short reason type** (prerequisite · readiness · entitlement · trust · capacity · regional). Activate → Explainable Lock sheet (full path). Hidden nodes ≠ authorized absence: if discoverable in catalogue, show locked; if unpublished, omit.

Commercial entitlement locks must not dominate Learning Prerequisite locks visually when both apply — show learning path first.

---

## Bridges

Bridges are **cross-Horizon (or Cross-Wing) connectors** visible on World/Horizon views.

```text
┌─ Bridge: Horizon B ↔ Horizon D ────────────┐
│ Purpose (one line)                         │
│ Requirements / Atlas note if Cross-Wing    │
│ [View path]  [Open related Hub]  [Close]   │
└────────────────────────────────────────────┘
```

- Bridges are selectable targets (keyboard included).
- Crossing a Bridge never skips Explainable eligibility.
- Cross-Wing / Secure Extension: Bridge or badge may deep-link to LRN-011 / LRN-012 hubs.

---

## Horizon Detail (WLD-002) interaction

From World Open Horizon:

```text
│ Horizon title · back to World                                  │
│ Routes list/map: available · in progress · locked              │
│ Bridges touching this Horizon                                  │
│ [Open Route] / [Learning Graph]                                │
```

Zoom metaphor: Horizon is one level down from World; Routes are listed/spatially arranged, not yet Stage zoom.

---

## Learning Graph (WLD-003) interaction

Graph is the prerequisite visualization companion — not a replacement for Route Overview.

```text
│ Graph: nodes = Routes/Stages/Missions as scoped                │
│ Edges = prerequisites                                          │
│ Highlight: missing path · recommended next                     │
│ [Start prerequisite]  [Return to blocked Route]                │
```

Pan/zoom/keyboard same principles; mobile may default to ordered prerequisite list.

---

## Reduced motion

| Preference | Behavior |
|------------|----------|
| Full motion | Smooth pan/zoom; brief focus transitions |
| **Reduced motion** | Instant pan/zoom cuts; no parallax; Bridges appear/disappear without flight animation; unlock pulses replaced by static badge |

Understanding must not depend on motion. Fit-all and list alternative always available.

---

## States

| State | Behavior |
|-------|----------|
| Loading | Skeleton map/list |
| Empty (no Horizons entitled) | Nest + first Horizon guidance |
| Error | Retry; last known map if safe |
| Offline | Cached world structure if available; entitlement actions disabled with reason |
| Degraded graph service | Route Overview list still works |

---

## Acceptance (wireframe)

- [ ] Zoom stack World→…→Mission documented
- [ ] Pan + keyboard + mobile list specified
- [ ] Locks + Bridges + reduced motion covered
- [ ] No paywall as primary map interaction
