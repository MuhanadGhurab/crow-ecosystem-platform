# Core Wireframes — Skyboard & World

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-CORE-INDEX |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Screens** | SKY-001 · WLD-001 · WLD-002 · WLD-003 |
| **Related** | [ADAPTIVE-SKYBOARD-VARIANTS.md](./ADAPTIVE-SKYBOARD-VARIANTS.md) · [WORLD-MAP-INTERACTION.md](./WORLD-MAP-INTERACTION.md) · [SKYBOARD-COMPOSITION-RULES.md](../../ebux/SKYBOARD-COMPOSITION-RULES.md) · [NAVIGATION-MAP.md](../../journeys/NAVIGATION-MAP.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Change history** | 1.0.0 — PD.3 |

Wireframe IDs: `GHV-WF-SKY-001`, `GHV-WF-WLD-001`..`003`.

---

## GHV-WF-SKY-001 — Adaptive Skyboard

**Purpose:** Home experience after auth; composes six modules per [SKYBOARD-COMPOSITION-RULES.md](../../ebux/SKYBOARD-COMPOSITION-RULES.md).  
**Entry:** Login/session validation, onboarding launch, Wings Claimed, unlocks, nav Flight.  
**Primary:** Context-dependent — usually Continue Flight (see variants doc).

### Module set (required)

| Module | Role on Skyboard |
|--------|------------------|
| Continue Your Flight | Highest priority when active Flight exists |
| Your Wings | Progression identity; reflects LRN-010 claim |
| Live Sky | Eligible/upcoming Live; not a second home |
| The Rookery | Community pulse; empty → first-action guidance |
| Flight Log | **Log nav module** — Evidence/Mission history index |
| RAVEN Guidance | Advisory next step; never authorization |

### Chrome + notifications (state-only)

Notifications are **not** a separate screen ID and **not** a seventh competing module. They appear as **state-only** on SKY-001:

```text
┌──────────────────────────────────────────────────────────────────┐
│ Flight (nav) · sync chip · [bell · state badge if unread]        │
│ Banner slots: grace · restricted · terms · offline (priority)    │
├──────────────────────────────────────────────────────────────────┤
│ Priority card region (max 3 competing — see variants)            │
│ Module stack / grid                                              │
└──────────────────────────────────────────────────────────────────┘
```

| Notification surface | Behavior |
|----------------------|----------|
| Bell / badge | Count or presence only; opens lightweight sheet listing items |
| Sheet items | Deep-link to Log, Live, Evidence Status, Account — dismissible |
| Persistent banners | Account/grace/offline — not toast-only for critical trust |

### Desktop composition (low-fi)

```text
┌──────────┬───────────────────────────────────────────────────────┐
│ Nav rail │ Header · sync · notification state                    │
│ Flight   ├───────────────────────────────────────────────────────┤
│ World    │ [Priority 1] [Priority 2] [Priority 3]  ≤3 above fold │
│ Live     ├───────────────────────────────────────────────────────┤
│ Rookery  │ Continue Your Flight                                  │
│ Log  ──► │ Your Wings                                            │
│ Wingprint│ Live Sky · Rookery                                    │
│          │ Flight Log (Log module)                               │
│          │ RAVEN Guidance                                        │
└──────────┴───────────────────────────────────────────────────────┘
```

**Log nav:** Selecting primary nav **Log** focuses/scrolls to Flight Log module on SKY-001 (and may open Evidence history list). No separate LOG-* registry family required for launch wireframes.

### Your Wings module + LRN-010

```text
┌─ Your Wings ─────────────────────────────────────────────────────┐
│ Wings state: None yet | Claimed | Growing                        │
│ Crests / marks (earned)                                          │
│ [View progression]  — first claim celebrated on LRN-010 then     │
│   this module shows Claimed on return to Skyboard                │
└──────────────────────────────────────────────────────────────────┘
```

Empty Wings: CTA toward first Evidence path — not shame, not paywall.

### RAVEN Guidance module

```text
┌─ RAVEN Guidance ─────────────────────────────────────────────────┐
│ Advisory message (variant-specific)                              │
│ Why this suggestion (short reason)                               │
│ [Accept suggestion]  [Choose myself]                             │
│ Degraded: hide advisory; Continue Flight + Log remain            │
└──────────────────────────────────────────────────────────────────┘
```

Recommendations do not override user choice (EBUX matrix).

### Degraded mode

If Live / Rookery / RAVEN advisory fail: **Continue Flight + Flight Log** remain. Show quiet degraded notes on failed modules.

### States

loading · empty (new learner) · locked modules with reasons · error · offline with saved work · success return from Mission.

Detailed priority compositions: [ADAPTIVE-SKYBOARD-VARIANTS.md](./ADAPTIVE-SKYBOARD-VARIANTS.md).

---

## GHV-WF-WLD-001 — World Map

**Purpose:** Five Horizons + Nest entry.  
**Primary:** Select Horizon / Nest.  
**Interaction:** [WORLD-MAP-INTERACTION.md](./WORLD-MAP-INTERACTION.md).

```text
┌──────────────────────────────────────────────────────────────────┐
│ World · Map|List · Nest                                          │
├──────────────────────────────────────────────────────────────────┤
│ Spatial Horizons + Bridges + Nest                                │
│ Selection summary                                                │
├──────────────────────────────────────────────────────────────────┤
│ [Open Horizon] / [Enter Nest]                                    │
└──────────────────────────────────────────────────────────────────┘
```

Exit: WLD-002 · ONB-006 Nest path · LRN-011/012 via Bridge/Hub badges.

---

## GHV-WF-WLD-002 — Horizon Detail

**Purpose:** Horizon Routes and Bridges.  
**Entry:** WLD-001.  
**Primary:** Select Route → LRN-008 or ONB-009.

```text
┌──────────────────────────────────────────────────────────────────┐
│ ← World · Horizon name                                           │
├──────────────────────────────────────────────────────────────────┤
│ Horizon story (short)                                            │
│ Routes: available · active · locked (Explainable)                │
│ Bridges to other Horizons                                        │
├──────────────────────────────────────────────────────────────────┤
│ [Open Route]  [Learning Graph]  [Back]                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## GHV-WF-WLD-003 — Learning Graph View

**Purpose:** Prerequisite visualization and path planning.  
**Entry:** From prerequisite lock, Route Overview, Horizon.  
**Primary:** Start prerequisite / return to blocked Route.

```text
┌──────────────────────────────────────────────────────────────────┐
│ Learning Graph · scope label                                     │
├──────────────────────────────────────────────────────────────────┤
│ Nodes + prerequisite edges · highlight gap                       │
│ Mobile: ordered list alternative                                 │
├──────────────────────────────────────────────────────────────────┤
│ [Start prerequisite]  [Return]  [Open Route Overview]            │
└──────────────────────────────────────────────────────────────────┘
```

No payment CTA dominance on prerequisite gaps.

---

## Cross-links

| From | To |
|------|----|
| SKY-001 Continue | LRN-001 |
| SKY-001 Wings | PRG-* / LRN-010 history |
| SKY-001 Log | LRN-005 / Evidence index |
| SKY-001 Live | LIV-001 |
| SKY-001 Rookery | COM-001 |
| WLD-001 | WLD-002 |
| WLD-002 | LRN-008 |
| WLD-003 | LRN-008 / LRN-001 prereq |

---

## Acceptance (wireframe)

- [ ] Six Skyboard modules named and placed
- [ ] Flight Log = Log nav module; RAVEN Guidance module present
- [ ] Notifications state-only on SKY-001
- [ ] Your Wings + LRN-010 relationship stated
- [ ] WLD-001..003 low-fi frames present
