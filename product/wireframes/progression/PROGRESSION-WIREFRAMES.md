# Progression Wireframes (PRG-001 … PRG-006)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-FAM-PRG-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [PROGRESSION-PRESENTATION.md](./PROGRESSION-PRESENTATION.md) · [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · [IDENTITY-WIREFRAMES.md](../identity/IDENTITY-WIREFRAMES.md) · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · Scope §3.12 |
| **Scope** | CONTROLLED LAUNCH (surfaces) · formulas PENDING GHV.PROGRESSION.1 |
| **Unresolved** | All numeric formulas · season definitions · limited-board policy catalogue · Prestige eligibility depth |
| **Change history** | 1.0.0 — PD.3 |

**Notation:** Markdown + ASCII. Not final UI. Shell: Adaptive World / Wingprint. Wireframe ID = `GHV-WF-PRG-00N` for screen `PRG-00N`.

**Presentation law:** XP ≠ Mastery ≠ Momentum ≠ Trust ≠ subscription ≠ Prestige. Prestige names only: **Ascendant Raven · Apex Raven · Obsidian Raven**. No scoring formulas in UI.

Detailed lock: **PRG-003, PRG-004, PRG-006**. Family lock: **PRG-001, PRG-002, PRG-005**.

---

## Sequence overview

```text
Wingprint (IDN-004) / Skyboard Wings
  → PRG-001 Progression Overview (family)
       → PRG-002 Momentum League (family)
       → PRG-003 Mastery Board (detailed)
       → PRG-004 Achievements (detailed)
       → PRG-005 Leaderboards Limited (family)
       → PRG-006 Prestige View (detailed)
```

---

## Family — GHV-WF-PRG-001 Progression Overview (PRG-001)

**Purpose:** Side-by-side independent systems; navigate to depth screens. **Family lock.**

```text
┌────────────────────────────────────────────────────────────┐
│ Progression Overview                                       │
│ Systems are separate — formulas PENDING PROGRESSION.1      │
├────────────┬────────────┬────────────┬─────────────────────┤
│ Flight XP  │ Momentum   │ Maturity   │ Trust Standing      │
│ (activity) │ (season)   │ (journey)  │ (safety)            │
│ [placeholder value]                                        │
├────────────┴────────────┴────────────┴─────────────────────┤
│ Access Plan (entitlement capacity) — not a skill meter     │
│ [Mastery Board] [Achievements] [Momentum League]           │
│ [Limited Leaderboards] [Prestige]                          │
│ Separation callout: XP ≠ Mastery ≠ Momentum ≠ Trust ≠      │
│   subscription ≠ Prestige                                  │
└────────────────────────────────────────────────────────────┘
```

Family states: loading · offline cached · Trust-only degraded · empty new learner (definitions + first Mission CTA).

**Exits:** PRG-002..006 · IDN-004 · LRN-008 from Mastery cards later.

---

## Family — GHV-WF-PRG-002 Momentum League (PRG-002)

**Purpose:** Seasonal Momentum view only. **Family lock.**

```text
┌────────────────────────────────────────────────────────────┐
│ Momentum League · Season label (TBD PROGRESSION.1)         │
│ Momentum ≠ Mastery ≠ Prestige                              │
├────────────────────────────────────────────────────────────┤
│ Your Momentum: [placeholder]                               │
│ Season window · fair-play notes                            │
│ Limited cohort list (not engagement-max infinite feed)     │
├────────────────────────────────────────────────────────────┤
│ [Back to Overview] [Limited boards → PRG-005 if linked]    │
└────────────────────────────────────────────────────────────┘
```

No buy-Momentum. No claim that Momentum grants Route Mastery.

---

## GHV-WF-PRG-003 — Mastery Board (PRG-003)

**Purpose:** Route Mastery visibility; Evidence-backed; open Route when entitled.

```text
┌────────────────────────────────────────────────────────────┐
│ Mastery Board                                              │
│ Mastery follows approved Evidence — not XP or payment.     │
├────────────────────────────────────────────────────────────┤
│ Filters: Horizon · Active Routes · Completed Evidence      │
│ ┌ Route Mastery row ─────────────────────────────────────┐ │
│ │ [Horizon] Route slot (name PENDING LEARNING.1)         │ │
│ │ Mastery state: None | In progress | Mastered (surface) │ │
│ │ Evidence status crumb → LRN Evidence family            │ │
│ │ [Open Route → LRN-008] [What is Mastery?]              │ │
│ └────────────────────────────────────────────────────────┘ │
│ Empty: Start a Route Mission — Mastery is not purchased.   │
├────────────────────────────────────────────────────────────┤
│ [Back PRG-001]                                             │
└────────────────────────────────────────────────────────────┘
```

| State | UI |
|-------|-----|
| loading | Skeleton rows |
| locked Route | Explainable Lock (Entitlement / Readiness / Trust) — still show row |
| revoked Evidence | Mastery surface updates; explanation link |
| offline | Cached board; claim actions need sync |

**Primary:** Understand Mastery ≠ XP; open Route.  
**Never:** XP progress bar labeled as Mastery; upgrade CTA as “buy Mastery.”

**Exits:** LRN-008 · LRN Evidence screens · PRG-001 · Explainable Lock sheets.

---

## GHV-WF-PRG-004 — Achievements (PRG-004)

**Purpose:** Achievements / Crests list; marks of milestones — not standalone Mastery proof.

```text
┌────────────────────────────────────────────────────────────┐
│ Achievements · Crests                                      │
│ Marks of milestones · Achievement ≠ Route Mastery alone    │
├────────────────────────────────────────────────────────────┤
│ Earned                                                     │
│ ┌ Crest / Achievement card ──────────────────────────────┐ │
│ │ Name · earned date · linked context (Mission/Live/…)   │ │
│ │ Visibility: Public / Rookery / Private (→ IDN-005)     │ │
│ └────────────────────────────────────────────────────────┘ │
│ In progress / Locked (visible reasons, no shame)           │
│ ┌ Locked card · Explainable requirement ─────────────────┐ │
│ └────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────┤
│ [Back] [Titles & Crests on Wingprint → IDN-006]            │
└────────────────────────────────────────────────────────────┘
```

| State | UI |
|-------|-----|
| empty earned | Encouraging first-flight guidance |
| locked | Requirement in plain language; path CTA |
| privacy | Respect Wingprint visibility |

**Never:** Sell Crests that imply Skill; conflate Crest with Prestige Class.

**Exits:** PRG-001 · IDN-006 · IDN-005 · related Mission/Live deep links when safe.

---

## Family — GHV-WF-PRG-005 Leaderboards Limited (PRG-005)

**Purpose:** Policy-limited boards only. **Family lock.**

```text
┌────────────────────────────────────────────────────────────┐
│ Leaderboards · Limited                                     │
│ Policy boards only — not a global engagement-max rank.     │
│ Position cannot be purchased.                              │
├────────────────────────────────────────────────────────────┤
│ Board picker: [Momentum season] [Event board] [Other TBD]  │
│ Your standing: [placeholder] · cohort scope explained      │
│ List (bounded page)                                        │
├────────────────────────────────────────────────────────────┤
│ Unavailable: honest empty — board not in policy            │
│ [Back PRG-001] [Momentum League → PRG-002]                 │
└────────────────────────────────────────────────────────────┘
```

Family states: policy allows · policy denies · season ended · offline cache.

---

## GHV-WF-PRG-006 — Prestige View (PRG-006)

**Purpose:** Prestige Class **surface** — authoritative names; eligibility visibility without formulas.

```text
┌────────────────────────────────────────────────────────────┐
│ Prestige                                                   │
│ Distinction · not for sale · depth PENDING PROGRESSION.1 │
├────────────────────────────────────────────────────────────┤
│ Classes (names only):                                      │
│                                                            │
│  ○ Ascendant Raven                                         │
│  ○ Apex Raven                                              │
│  ○ Obsidian Raven                                          │
│                                                            │
│ Per class: short distinction blurb (no point formula)      │
│ Eligibility: Visible / Not yet eligible / Unknown pending  │
│   Gate — never a fake % bar with invented numbers          │
│ Merit Access note: Merit may grant Prestige Access without │
│   buying competence (when shown).                          │
├────────────────────────────────────────────────────────────┤
│ [Back PRG-001] [How Prestige differs from Mastery]         │
└────────────────────────────────────────────────────────────┘
```

| State | UI |
|-------|-----|
| surface only | Names + eligibility visibility |
| not eligible | Explainable path themes (Mastery · Trust · Impact) **without** numeric thresholds |
| Merit Access | Label clearly vs subscription |
| offline | Cached names; eligibility may be stale banner |

**Hard rules:**

- Only **Ascendant Raven**, **Apex Raven**, **Obsidian Raven**.  
- No scoring formulas, XP-to-Prestige meters, or purchase CTAs.  
- Prestige ≠ subscription tier on this screen.

**Exits:** PRG-001 · PRG-003 (Mastery context) · Trust help if standing blocks surface · commercial only if Capacity/Merit Access explained elsewhere — not “Buy Obsidian.”

---

## Shared progression rules

1. Separation copy visible on overview and Prestige.  
2. No invented formulas until GHV.PROGRESSION.1.  
3. Payment never grants XP, Mastery, Evidence approval, exam results, leaderboard position, Trust, or Prestige.  
4. Wireframe IDs stable: `GHV-WF-PRG-00N`.

---

## Lock status table

| Wireframe | Screen | Status |
|-----------|--------|--------|
| GHV-WF-PRG-001 | PRG-001 | LOCKED AT LOW FIDELITY (family) |
| GHV-WF-PRG-002 | PRG-002 | LOCKED AT LOW FIDELITY (family) |
| GHV-WF-PRG-003 | PRG-003 | LOCKED AT LOW FIDELITY |
| GHV-WF-PRG-004 | PRG-004 | LOCKED AT LOW FIDELITY |
| GHV-WF-PRG-005 | PRG-005 | LOCKED AT LOW FIDELITY (family) |
| GHV-WF-PRG-006 | PRG-006 | LOCKED AT LOW FIDELITY |
