# Community / Rookery Wireframes (COM-001 … COM-008)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-FAM-COM-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [ROOKERY-INTERACTION.md](./ROOKERY-INTERACTION.md) · [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · [CRITICAL-FLOWS.md](../../interactions/CRITICAL-FLOWS.md) · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · [PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md) · identity [IDENTITY-WIREFRAMES.md](../identity/IDENTITY-WIREFRAMES.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Exact post-type field schemas · Repository catalogue titles · Trust thresholds — Trust / PROGRESSION depth |
| **Change history** | 1.0.0 — PD.3 |

**Notation:** Markdown + ASCII. Not final UI. Shell: Adaptive World / Rookery. Wireframe ID = `GHV-WF-COM-00N` for screen `COM-00N`.

**Community Profile note:** There is **no separate COM Community Profile screen ID**. Viewing another Crow from Rookery uses the **IDN-004 Wingprint family** (privacy-respecting Rookery/public projection). Edit self → IDN-004 Wingprint Home.

Report / Appeal from any community surface → **TRU-006** (Trust family; linked below, not re-owned here).

---

## Sequence overview

```text
Nav Rookery / SKY-001
  → COM-001 Rookery Home
  → COM-002 Structured Feed ↔ COM-003 Post Detail
  → COM-004 Create Post → COM-002
  → COM-005 Route Space
  → COM-007 Teams Directory → COM-006 Team Space
  → COM-008 Repository Space
  → Report → TRU-006
```

---

## GHV-WF-COM-001 — Rookery Home (COM-001)

**Purpose:** Community home: orient, pick space class, open feed, respect Trust banner.

```text
┌────────────────────────────────────────────────────────────┐
│ The Rookery                                [Trust: Good]   │
│ Learning-serving community · No unrestricted DMs           │
├────────────────────────────┬───────────────────────────────┤
│ PRIMARY                    │ GUIDANCE                      │
│ [ Open Structured Feed ]   │ RAVEN: Spaces keep work       │
│ [ Route Spaces ]           │ visible and accountable.      │
│ [ Teams Directory ]        │ Collaboration happens in      │
│ [ Repository Space ]       │ Team / Route / Repository —   │
│   (if eligible)            │ not private inbox.            │
│                            │                               │
│ Recent pulse (3 cards max) │ Guidelines · Report help      │
├────────────────────────────┴───────────────────────────────┤
│ Bottom / side nav: Flight · World · Live · Rookery · …     │
└────────────────────────────────────────────────────────────┘
```

| State | UI |
|-------|-----|
| loading | Skeleton home; actions disabled until Trust/eligibility known |
| empty pulse | First-action: join Route Space or open Feed |
| Trust restricted | Banner + Explainable Lock on Create / Join |
| offline | Browse cached pulse if any; Create/Join need sync |

| Exit | Target |
|------|--------|
| Structured Feed | COM-002 |
| Route Spaces | COM-005 (picker → space) |
| Teams | COM-007 |
| Repository | COM-008 |
| Crow on pulse | IDN-004 family view |
| Report help | TRU-006 info / report |

---

## GHV-WF-COM-002 — Structured Feed (COM-002)

**Purpose:** Browse structured posts; react; open detail; create when allowed.

```text
┌────────────────────────────────────────────────────────────┐
│ Structured Feed · [All] [Help] [Collab] [Route] [Tips]     │
│ Context: Rookery / selected Space crumb                    │
├────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────┐ │
│ │ HELP · Route Space: [Horizon] Route slot               │ │
│ │ Crow display · time · [··· Report]                     │ │
│ │ Title                                                  │ │
│ │ Body excerpt (structured fields collapsed)             │ │
│ │ [Support] [Clarify] [Thanks] [Useful]   [Open]         │ │
│ └────────────────────────────────────────────────────────┘ │
│ ┌ Collab request card … ─────────────────────────────────┐ │
│ └────────────────────────────────────────────────────────┘ │
│ [ Load more ]                                              │
├────────────────────────────────────────────────────────────┤
│ [Create Post → COM-004]                                    │
└────────────────────────────────────────────────────────────┘
```

**Rules:** No engagement-max “For You” as sole opaque sort; label sort mode. Paginate explicitly. Reactions bounded.

| Exit | Target |
|------|--------|
| Open | COM-003 |
| Create | COM-004 |
| Space crumb | COM-005 / COM-006 / COM-008 |
| Crow | IDN-004 family |
| Report | TRU-006 |

---

## GHV-WF-COM-003 — Post Detail (COM-003)

**Purpose:** Full structured post; react; report; optional thread replies if policy allows (structured, moderated — not DM).

```text
┌────────────────────────────────────────────────────────────┐
│ ← Feed · Post Detail                                       │
│ Type · Space · Crow (→ IDN-004 family)                     │
├────────────────────────────────────────────────────────────┤
│ Title                                                      │
│ Structured sections (problem · context · ask · links)      │
│ Attachments: policy-safe only                              │
├────────────────────────────────────────────────────────────┤
│ Reactions: [Support] [Clarify] [Thanks] [Useful]           │
│ Replies (if enabled): structured reply cards               │
├────────────────────────────────────────────────────────────┤
│ [Report → TRU-006]  [Request collab]  [Back to Feed]       │
└────────────────────────────────────────────────────────────┘
```

| State | UI |
|-------|-----|
| removed / moderated | Tombstone + policy note; no body |
| Trust lock on react | Explainable Lock sheet |
| offline | Read cache; react queues or blocks per sync spec |

**Primary:** Read + react. **Report** always visible (not buried).

---

## GHV-WF-COM-004 — Create Post (COM-004)

**Purpose:** Type-first structured compose; publish to Rookery or selected space.

```text
┌────────────────────────────────────────────────────────────┐
│ Create Post · Trust OK                    Save: Draft      │
├────────────────────────────────────────────────────────────┤
│ Post type: ( ) Help  ( ) Tip  ( ) Discussion               │
│            ( ) Collaboration request  ( ) Announcement*    │
│ * Announcement: space-role gated                           │
│ Space: [ Rookery / Route Space / Team / Repository ]       │
├────────────────────────────────────────────────────────────┤
│ Title *                                                    │
│ Required fields for type …                                 │
│ □ I will not share private solutions or unreleased         │
│   Evidence.                                                │
├────────────────────────────────────────────────────────────┤
│ [Cancel]  [Save draft]                    [Publish]        │
└────────────────────────────────────────────────────────────┘
```

| Exit | Target |
|------|--------|
| Publish success | COM-002 / space feed |
| Trust fail | Explainable Lock; stay on form |
| Cancel | Prior feed/home |

No boost / pin purchase UI.

---

## GHV-WF-COM-005 — Route Space (COM-005)

**Purpose:** Entitled Route community: feed, guidelines, collab requests (FLOW-011).

```text
┌────────────────────────────────────────────────────────────┐
│ Route Space · [Horizon] · Route slot (name PENDING LRN.1)  │
│ Entitlement: Active · Trust: Good                          │
│ Tabs: [Feed] [Members] [Collab requests] [Guidelines]      │
├────────────────────────────────────────────────────────────┤
│ Pinned guidelines (learning-first, no solution dumps)      │
│ Space structured feed …                                    │
├────────────────────────────────────────────────────────────┤
│ [Create Post] [Request collaboration] [Report space]       │
└────────────────────────────────────────────────────────────┘
```

| Lock | Behavior |
|------|----------|
| Not entitled | Explainable Lock: Access / Capacity; Spectate-like browse only if policy allows public crumbs |
| Trust restricted | Compose/collab locked with path |

**Exits:** COM-002 · COM-004 · COM-006 (after accepted collab/Team) · TRU-006 · LRN-008 Route overview.

---

## Family — GHV-WF-COM-006 Team Space (COM-006)

**Purpose:** Team collaboration surface for project/Mission work. **Family lock** (shared shell; density may vary by Team size). Mobile may require assurance/trust per registry.

```text
┌────────────────────────────────────────────────────────────┐
│ Team Space · Team name · members (bounded list)            │
│ Tabs: [Work] [Feed] [Files*] [Members] [Guidelines]        │
│ * Files = policy-safe shared artefacts — not DM attachments│
├────────────────────────────────────────────────────────────┤
│ Work: Mission/project links · tasks (no private keys)      │
│ Feed: structured Team posts                                │
├────────────────────────────────────────────────────────────┤
│ [Invite via directory rules] [Leave Team] [Report]         │
└────────────────────────────────────────────────────────────┘
```

Family states: loading · member · pending invite · removed · Trust lock · offline (work links may open Offline Draft Missions separately).

**Hard:** No sideloaded unrestricted DM thread inside Team Space.

---

## GHV-WF-COM-007 — Teams Directory (COM-007)

**Purpose:** Find, request join, or create Team under policy.

```text
┌────────────────────────────────────────────────────────────┐
│ Teams Directory                                            │
│ Search · filters: Route · open/request · language          │
├────────────────────────────────────────────────────────────┤
│ ┌ Team card ─────────────────────────────────────────────┐ │
│ │ Name · size · Route context · Trust bar for Team       │ │
│ │ [View] [Request join]                                  │ │
│ └────────────────────────────────────────────────────────┘ │
│ [Create Team] — structured form; capacity rules apply      │
├────────────────────────────────────────────────────────────┤
│ Note: Messaging stays in Team Space after join — no DMs.   │
└────────────────────────────────────────────────────────────┘
```

| Exit | Target |
|------|--------|
| View / Join success | COM-006 |
| Create | COM-006 (new) or pending review |
| Crow on card | IDN-004 family |

---

## Family — GHV-WF-COM-008 Repository Space (COM-008)

**Purpose:** Controlled Repository space from launch catalogue. **Family lock** with COM-006-like space shell; content is catalogue-defined.

```text
┌────────────────────────────────────────────────────────────┐
│ Repository Space · [Catalogue entry]                       │
│ Eligibility · sensitivity banner                           │
│ Tabs: [Overview] [Feed] [Artefacts] [Members] [Rules]      │
├────────────────────────────────────────────────────────────┤
│ Artefacts list (versioned, policy-tagged)                  │
│ What must not be uploaded (solutions under embargo, PII)   │
├────────────────────────────────────────────────────────────┤
│ [Enter / Contribute] [Report] [Back Rookery]               │
└────────────────────────────────────────────────────────────┘
```

Family states: ineligible · entitled · read-only · Trust lock · offline browse limited.

---

## Report link — TRU-006

Community wireframes do not redefine Trust UI. From COM-003 / cards / spaces:

```text
[Report] → TRU-006 Report / Appeal
           category · details · confirm → case status → appeal?
```

Return: COM-001 or originating surface.

---

## Shared community rules

1. No unrestricted DMs.
2. No engagement-max patterns.
3. Trust locks are Explainable; no pay-to-trust.
4. Community Profile = IDN-004 family (not a COM ID).
5. Wireframe IDs stable: `GHV-WF-COM-00N`.

---

## Lock status table

| Wireframe | Screen | Status |
|-----------|--------|--------|
| GHV-WF-COM-001 | COM-001 | LOCKED AT LOW FIDELITY |
| GHV-WF-COM-002 | COM-002 | LOCKED AT LOW FIDELITY |
| GHV-WF-COM-003 | COM-003 | LOCKED AT LOW FIDELITY |
| GHV-WF-COM-004 | COM-004 | LOCKED AT LOW FIDELITY |
| GHV-WF-COM-005 | COM-005 | LOCKED AT LOW FIDELITY |
| GHV-WF-COM-006 | COM-006 | LOCKED AT LOW FIDELITY (family) |
| GHV-WF-COM-007 | COM-007 | LOCKED AT LOW FIDELITY |
| GHV-WF-COM-008 | COM-008 | LOCKED AT LOW FIDELITY (family) |
| Report | TRU-006 | Linked (Trust family) |
