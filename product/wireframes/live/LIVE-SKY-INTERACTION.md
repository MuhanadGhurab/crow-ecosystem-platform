# Live Sky Interaction Flow

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-FLOW-LIV-SKY-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [LIVE-WIREFRAMES.md](./LIVE-WIREFRAMES.md) · [CRITICAL-FLOWS.md](../../interactions/CRITICAL-FLOWS.md) FLOW-009/010/012 · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · [SAVE-SYNC-OFFLINE-INTERACTION.md](../../interactions/SAVE-SYNC-OFFLINE-INTERACTION.md) · Scope §3.17 |
| **Scope** | CONTROLLED LAUNCH (one controlled experience; Host Console may be limited) |
| **Unresolved** | Exact event catalogue · realtime stack validation · Host Console depth |
| **Change history** | 1.0.0 — PD.3 |

Screens: LIV-001 Directory · LIV-002 Event Detail · LIV-003 Participant · LIV-004 Spectator · LIV-005 Results · LIV-006 Host Console. Wireframes: `GHV-WF-LIV-00N`.

---

## Purpose

Live Sky delivers scheduled learning events (workshops / controlled tournaments slice) with clear **participant vs spectator** separation, fair reconnect/pause, honest results, optional replay of **public-safe** material, and reporting into Trust (TRU-006).

Learning Before Entertainment (Constitution): Live serves outcomes — not metaverse entertainment without learning value.

---

## Hard rules (Live Sky)

1. **Spectators never receive:** private solutions, Team channels, unreleased Evidence, or unfair competitive data (live keys, opponent private boards, grading rubrics under embargo, participant-only briefs).
2. **Participant session** may include competitive or collaborative private regions; those regions are role-gated and audit-sensitive.
3. **One controlled Live experience** at CONTROLLED LAUNCH; large tournament platform = POST-LAUNCH PLANNED (Scope §3.17).
4. **Host Console (LIV-006)** may be **CONTROLLED LAUNCH limited** (feature-flagged / reduced controls).
5. Money never buys Live ranking, Evidence approval, or Trust.
6. Event Lock Explainable pattern for capacity/eligibility; Spectate when allowed.

---

## Entry & boarding (FLOW-009 / FLOW-010)

```text
Nav Live / SKY-001 Live Sky
  → LIV-001 Directory
  → LIV-002 Event Detail
       ├─ [Join as Participant] → eligibility → Boarding → LIV-003
       └─ [Spectate] → eligibility → LIV-004
  Session end → LIV-005 Results (role-appropriate)
  Host → LIV-006 (limited) ↔ LIV-003 oversight
  Any → Report → TRU-006
```

### Boarding gate

```text
┌────────────────────────────────────────────────────────────┐
│ Boarding · Event title · starts in mm:ss (honest clock)    │
│ Checklist: entitlement · Trust · assurance · device sync   │
│ Role: Participant | Spectator (chosen / assigned)          │
│ Reminder: Spectator view cannot access private solutions.  │
├────────────────────────────────────────────────────────────┤
│ [Cancel]                         [Enter session]           │
└────────────────────────────────────────────────────────────┘
```

- Fail any check → Explainable Lock (Event / Trust / Assurance / Capacity) + Spectate option if allowed.
- No fake “hurry upgrade” countdown for payment; schedule clock is informational.

---

## Participant vs spectator separation

| Region | Participant (LIV-003) | Spectator (LIV-004) |
|--------|----------------------|---------------------|
| Public stage / host broadcast | Yes | Yes (public-safe) |
| Private brief / solution workspace | Yes | **Never** |
| Team channels | Yes if Team event | **Never** |
| Unreleased Evidence / draft submit | Yes when in flow | **Never** |
| Competitive private scores mid-event | Per fairness rules | **Never** (only public-safe aggregates if any) |
| Report | Yes | Yes |
| Chat | Moderated event chat if enabled | Public-safe chat only / read-only as policy |

```text
Information firewall (conceptual)
┌──────────────────┐     ┌──────────────────┐
│ Participant plane│     │ Spectator plane  │
│ private + public │ ╳── │ public-safe only │
└──────────────────┘     └──────────────────┘
```

UI must not imply spectators “almost” see private panels (no teaser paywalls of solutions).

---

## Reconnect

| Case | Behavior |
|------|----------|
| Brief disconnect | Auto-resume to last authorized state; show Reconnecting |
| Long disconnect (participant) | Re-board with integrity check; may enter late/observer mode per event rules |
| Spectator reconnect | Resume public-safe stream/state; no catch-up of private data |
| Conflict / dual device | Session policy: one active participant seat; explain |

Reconnect never grants missed private answers via spectator path.

---

## Pause

| Who | Pause meaning |
|-----|---------------|
| Host (LIV-006) | Event pause: timers honest; participants see Paused; spectators see Paused public stage |
| Participant | Soft pause / Safe Exit from Live workspace ≠ submit Evidence; may lose competitive eligibility per rules (Explainable) |
| System | Degraded realtime: show status; do not fabricate progress |

Paused ≠ completed. No XP/Mastery grant for watching pause screen.

---

## Result (LIV-005)

```text
Participant result          Spectator / public-safe result
┌─────────────────────┐     ┌─────────────────────┐
│ Outcome · feedback  │     │ Public summary      │
│ Evidence handoff?   │     │ No private keys     │
│ Rank only if policy │     │ Limited board link  │
│   allows limited    │     │   if policy allows  │
└─────────────────────┘     └─────────────────────┘
```

- Completion ≠ Mastery; watching ≠ Evidence.
- Leaderboard slices follow limited-board policy (PRG-005 family) — no pay-to-rank.

---

## Replay

- Replay = **public-safe** recording or reconstructable public timeline when offered.
- Replay never unlocks private solutions, Team logs, or unreleased Evidence.
- If replay unavailable: honest empty state — not a paywall for secrets.

---

## Report

From LIV-002 / LIV-003 / LIV-004 / LIV-005 / LIV-006:

```text
[Report] → TRU-006 (harassment, cheating, spoilers, safety)
```

Cheating reports may trigger Live Ops / integrity holds — details Trust/Admin; wireframe only shows entry + confirmation.

---

## What Live Sky interaction must never do

- Mix spectator UI with participant private regions.
- Sell solutions, ranks, or Trust mid-event.
- Run engagement-max “watch longer for XP” dark patterns that equate watch time with Mastery.
- Launch unbounded cyber ranges or large tournament platform inside CONTROLLED LAUNCH scope.

---

## Traceability

| Journey | Screens | Outcome |
|---------|---------|---------|
| FLOW-009 Join | LIV-001..003 → LIV-005 | Participant session + result |
| FLOW-010 Spectate | LIV-001..002 → LIV-004 | Public-safe watch |
| FLOW-012 Report | Live → TRU-006 | Safety case |
| CAP-SOC-005 Live Sky | LIV-* | Controlled experience |
| Scope §3.17 | — | Large tournament POST-LAUNCH |
