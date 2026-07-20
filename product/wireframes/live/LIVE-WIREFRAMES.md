# Live Sky Wireframes (LIV-001 … LIV-006)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-FAM-LIV-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [LIVE-SKY-INTERACTION.md](./LIVE-SKY-INTERACTION.md) · [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · [CRITICAL-FLOWS.md](../../interactions/CRITICAL-FLOWS.md) · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · [PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md) Live Sky Shell |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Event catalogue content · Host Console full control set · realtime SLA |
| **Change history** | 1.0.0 — PD.3 |

**Notation:** Markdown + ASCII. Not final UI. Shell: Live Sky Shell. Wireframe ID = `GHV-WF-LIV-00N` for screen `LIV-00N`.

**Host Console:** LIV-006 is in launch foundation but may ship **CONTROLLED LAUNCH limited** (reduced host tools; feature-flagged). Large-scale tournament ops remain POST-LAUNCH PLANNED.

---

## Sequence overview

```text
LIV-001 Directory
  → LIV-002 Event Detail
       → Boarding → LIV-003 Participant → LIV-005 Results
       → Spectate → LIV-004 Spectator → public-safe result / LIV-001
  Host path → LIV-006 (limited) ↔ session
  Report → TRU-006
```

---

## GHV-WF-LIV-001 — Live Sky Directory (LIV-001)

**Purpose:** Browse upcoming/live/past events; filters include workshops / controlled tournaments slice.

```text
┌────────────────────────────────────────────────────────────┐
│ Live Sky · Directory                                       │
│ Filters: [Upcoming] [Live now] [Workshops] [Tournaments*]  │
│          [Spectate OK]   * controlled slice only           │
├────────────────────────────────────────────────────────────┤
│ ┌ Event card ────────────────────────────────────────────┐ │
│ │ Title · type · schedule · capacity · Spectate: Yes/No  │ │
│ │ Learning outcome line (required)                       │ │
│ │ [Open detail]                                          │ │
│ └────────────────────────────────────────────────────────┘ │
│ Empty: No events — watch World / Rookery; next window …    │
├────────────────────────────────────────────────────────────┤
│ Nav: Flight · World · Live · Rookery · …                   │
└────────────────────────────────────────────────────────────┘
```

| State | UI |
|-------|-----|
| loading | Skeleton cards |
| empty | Honest empty + alternate paths |
| offline | Cached list if any; join blocked with sync reason |
| ineligible region | Policy note |

**Exit:** LIV-002.

---

## GHV-WF-LIV-002 — Event Detail (LIV-002)

**Purpose:** Event info, eligibility, Join vs Spectate, boarding entry.

```text
┌────────────────────────────────────────────────────────────┐
│ ← Directory · Event Detail                                 │
│ Title · type · schedule (honest) · host Crow               │
├────────────────────────────┬───────────────────────────────┤
│ What you’ll learn          │ Eligibility                   │
│ Format · duration          │ Entitlement · Trust ·         │
│ Participant vs spectator   │ Assurance · Capacity          │
│   separation explained     │ Status: Eligible / Locked     │
│ Rules · integrity notes    │                               │
├────────────────────────────┴───────────────────────────────┤
│ [Join as Participant]  [Spectate]  [Report]  [Remind me]   │
│ Boarding panel when Join/Spectate confirmed                │
└────────────────────────────────────────────────────────────┘
```

| Exit | Target |
|------|--------|
| Join (eligible) | Boarding → LIV-003 |
| Spectate (allowed) | LIV-004 |
| Locked Join | Event Lock sheet; Spectate if allowed |
| Report | TRU-006 |
| Host (role) | LIV-006 |

Boarding checklist: see [LIVE-SKY-INTERACTION.md](./LIVE-SKY-INTERACTION.md).

---

## GHV-WF-LIV-003 — Participant Session (LIV-003)

**Purpose:** Active participation workspace inside Live Sky Shell.

```text
┌────────────────────────────────────────────────────────────┐
│ LIVE · Event title · role: Participant · Save/Sync chip    │
│ Connection: Connected | Reconnecting | Paused              │
├──────────────┬─────────────────────────────┬───────────────┤
│ Stage /      │ PARTICIPANT WORKSPACE       │ Team / brief  │
│ host video   │ Private brief · tasks       │ (if event)    │
│ or prompts   │ Solution area (private)     │ Never shown   │
│ (shared)     │                             │ to spectators │
├──────────────┴─────────────────────────────┴───────────────┤
│ Moderated event controls · [Safe Exit] [Submit*] [Report]  │
│ * Submit only when Evidence/assessment step requires sync  │
└────────────────────────────────────────────────────────────┘
```

| State | UI |
|-------|-----|
| reconnecting | Banner; workspace read-only until reseated |
| paused (host) | Paused overlay; timers honest |
| integrity hold | Explainable; limited actions |
| offline | Block competitive submit; preserve Offline Draft if Mission-linked |

**Hard:** Participant plane must not leak into spectator clients.

**Exits:** LIV-005 on session end · Safe Exit → LIV-001/002 per rules · TRU-006.

---

## GHV-WF-LIV-004 — Spectator View (LIV-004)

**Purpose:** Watch public-safe Live; never private competitive or Evidence data.

```text
┌────────────────────────────────────────────────────────────┐
│ LIVE · Event title · role: Spectator (public-safe)         │
│ Connection: Connected | Reconnecting | Paused              │
├────────────────────────────────────────────────────────────┤
│ Public stage / host broadcast                              │
│ Public prompts only                                        │
│ Chat: public-safe / read-only as policy                    │
├────────────────────────────────────────────────────────────┤
│ Banner: You are spectating — private solutions, Team       │
│ channels, unreleased Evidence, and unfair competitive      │
│ data are not available.                                    │
├────────────────────────────────────────────────────────────┤
│ [Leave] [Report] [Notify when replay public-safe]          │
└────────────────────────────────────────────────────────────┘
```

**Forbidden UI:** teaser panels of locked solutions, “upgrade to see answers,” Team channel previews, live private scores.

**Exits:** LIV-001 · public-safe result crumb · TRU-006.

---

## GHV-WF-LIV-005 — Session Results (LIV-005)

**Purpose:** Role-appropriate outcomes after session.

```text
┌────────────────────────────────────────────────────────────┐
│ Results · Event title                                      │
│ Role chip: Participant | Spectator summary                 │
├────────────────────────────────────────────────────────────┤
│ Participant: outcome · feedback · Evidence handoff link?   │
│   Completion ≠ Mastery reminder                            │
│ Spectator: public-safe summary only                        │
│ Limited leaderboard link if policy allows → PRG-005 family │
│ Replay: [Public-safe replay] or Unavailable (honest)       │
├────────────────────────────────────────────────────────────┤
│ [Back to Directory] [Continue Flight] [Report]             │
└────────────────────────────────────────────────────────────┘
```

No pay-to-improve result. Watching alone never grants Mastery.

---

## GHV-WF-LIV-006 — Live Host Console (LIV-006)

**Purpose:** Host controls for the controlled experience.  
**Scope note:** **CONTROLLED LAUNCH limited** — subset of controls; full tournament ops POST-LAUNCH PLANNED.

```text
┌────────────────────────────────────────────────────────────┐
│ Host Console · Event title · LIMITED LAUNCH TOOLSET        │
├──────────────┬─────────────────────────────────────────────┤
│ Roster       │ Stage controls                              │
│ Participant  │ [Start] [Pause] [Resume] [End]              │
│ / Spectator  │ Broadcast public prompt                     │
│ counts       │                                             │
│              │ Moderation: mute / remove from chat         │
│ Alerts       │ Integrity flag → escalate Trust/Ops         │
│              │                                             │
│              │ NOT IN LIMITED SET (examples): mass bracket │
│              │ editors, unlimited range spin-up, …         │
├──────────────┴─────────────────────────────────────────────┤
│ [Open participant preview] [Spectate public-safe] [Report] │
└────────────────────────────────────────────────────────────┘
```

Host preview of participant private regions is **role-authorized** and audited; never mirror that into spectator feed.

| State | UI |
|-------|-----|
| not host | Entry blocked |
| limited flag off | Explainable: Host tools unavailable |
| degraded realtime | Status + safe End path |

**Exits:** LIV-003 oversight · LIV-002 · LIV-005 · TRU-006 / ADM Live Ops when escalated.

---

## Shared Live rules

1. Spectator firewall absolute for private solutions, Team channels, unreleased Evidence, unfair competitive data.
2. Reconnect / pause preserve fairness; no secret catch-up via spectate.
3. Report → TRU-006 from all Live surfaces.
4. Wireframe IDs stable: `GHV-WF-LIV-00N`.
5. Host Console may remain limited at CONTROLLED LAUNCH.

---

## Lock status table

| Wireframe | Screen | Status |
|-----------|--------|--------|
| GHV-WF-LIV-001 | LIV-001 | LOCKED AT LOW FIDELITY |
| GHV-WF-LIV-002 | LIV-002 | LOCKED AT LOW FIDELITY |
| GHV-WF-LIV-003 | LIV-003 | LOCKED AT LOW FIDELITY |
| GHV-WF-LIV-004 | LIV-004 | LOCKED AT LOW FIDELITY |
| GHV-WF-LIV-005 | LIV-005 | LOCKED AT LOW FIDELITY |
| GHV-WF-LIV-006 | LIV-006 | LOCKED AT LOW FIDELITY (CONTROLLED LAUNCH limited) |
