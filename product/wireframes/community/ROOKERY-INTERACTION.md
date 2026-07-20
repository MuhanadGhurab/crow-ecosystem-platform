# Rookery Interaction Flow

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-FLOW-COM-ROOKERY-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [COMMUNITY-WIREFRAMES.md](./COMMUNITY-WIREFRAMES.md) · [CRITICAL-FLOWS.md](../../interactions/CRITICAL-FLOWS.md) FLOW-011/012 · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · Scope §3.16 |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Exact post-type catalogue labels · moderation SLA copy — Trust Gate; scoring of Trust — PENDING PROGRESSION.1 / Trust depth |
| **Change history** | 1.0.0 — PD.3 |

Screens: COM-001 Rookery Home · COM-002 Structured Feed · COM-003 Post Detail · COM-004 Create Post · COM-005 Route Space · COM-006 Team Space · COM-007 Teams Directory · COM-008 Repository Space · TRU-006 Report/Appeal. Wireframes: `GHV-WF-COM-*` · report via `GHV-WF-TRU-006` (Trust family).

---

## Purpose

Safe, learning-serving community (The Rookery): structured posts, spaces, reactions, collaboration requests, reporting, and Trust-aware participation. Community supports Missions, Evidence integrity, and Teams — it is not an open social network.

---

## Hard rules (Rookery)

1. **No unrestricted DMs** at CONTROLLED LAUNCH (Scope §3.16 · DEC-021). Collaboration is request → eligible Team/Route/Repository space — never private inbox.
2. **No engagement-max patterns:** no infinite dark-pattern scroll compulsion, no fake urgency, no like-farming CTAs, no streak shaming, no “boost for reach,” no pay-to-amplify posts.
3. **Trust Standing gates compose/react/join** when policy requires; Explainable Lock — never silent hide of primary actions.
4. **Report is always reachable** from post/member/space surfaces → TRU-006; appeal when policy allows.
5. **Community Profile ≠ separate screen ID.** Member Crow surfaces reuse **IDN-004 Wingprint family** (privacy-respecting public/Rookery views) — see Community wireframes note.
6. Money never buys Trust, reach, or moderation outcomes.

---

## Entry map

```text
SKY-001 The Rookery module
  → COM-001 Rookery Home
       → COM-002 Structured Feed
       → COM-007 Teams Directory → COM-006 Team Space
       → COM-005 Route Space (entitled Route)
       → COM-008 Repository Space (launch catalogue eligible)
       → COM-004 Create Post (trust OK)
  Feed / Post → COM-003 Post Detail
  Any content → Report → TRU-006
```

---

## Structured Feed (COM-002)

```text
┌────────────────────────────────────────────────────────────┐
│ The Rookery · Structured Feed            [Filter · Space]  │
├────────────────────────────────────────────────────────────┤
│ Post type chips (mutually clarifying, not addictive tabs): │
│  Help · Share Evidence tip · Route discussion ·            │
│  Collaboration request · Announcement (space-scoped)       │
├────────────────────────────────────────────────────────────┤
│ ┌ Post card ─────────────────────────────────────────────┐ │
│ │ Type · Space crumb · Crow (→ IDN-004 family view)      │ │
│ │ Structured body (title + sections)                     │ │
│ │ Reactions (bounded set) · [Open] · [Report]            │ │
│ └────────────────────────────────────────────────────────┘ │
│ … more cards (paginate / Load more — no auto-infinite)   │
├────────────────────────────────────────────────────────────┤
│ [Create Post → COM-004] when Trust allows                  │
└────────────────────────────────────────────────────────────┘
```

Rules:

- Posts are **structured** (type + fields), not freeform microblog walls.
- Default sort: recency within space context or relevance-to-flight (honest label). No opaque “For You” engagement optimizer as primary.
- Pagination: explicit **Load more** / next page. Infinite scroll optional only if it does not hide exits or fabricate urgency.
- Empty: first-action guidance (join a Route Space, create Help post) — not a growth-hack empty state.

---

## Reactions

| Allowed | Behavior |
|---------|----------|
| Bounded reaction set (e.g. Support · Clarify · Thanks · Useful) | Toggle; counts visible; no public “ratio” shaming |
| Remove own reaction | Immediate; sync when online |
| React when Trust restricted | Explainable Lock (Trust Requirement) — path to restore standing |

Never: buy reactions, reaction streaks, reaction leaderboards on posts, or reactions that imply Skill/Mastery.

---

## Spaces

| Space | Screen | Who enters | Purpose |
|-------|--------|------------|---------|
| Route Space | COM-005 | Entitled to Route (or explore-safe subset) | Route-scoped discussion & collab requests |
| Team Space | COM-006 | Team member | Collaboration on project/Mission work |
| Repository Space | COM-008 | Launch-catalogue eligible | Controlled shared artefacts / repo metaphor |
| Teams Directory | COM-007 | A1+ | Find / request / create Team |

```text
Space shell (shared pattern)
┌────────────────────────────────────────────────────────────┐
│ Space name · type badge · Trust note                       │
│ [Feed] [Members] [Requests] [Guidelines]                   │
├────────────────────────────────────────────────────────────┤
│ Space feed (structured) · pinned guidelines                │
├────────────────────────────────────────────────────────────┤
│ [Create Post] [Request collab] [Leave / Report space]      │
└────────────────────────────────────────────────────────────┘
```

Hidden UI ≠ authorization: if Join is locked, show reason (Entitlement · Trust · Assurance · Event).

---

## Collaboration requests (FLOW-011)

```text
COM-005 / COM-002
  → [Request collaboration]
  → Structured form: goal · Route/Mission context · skills needed ·
      time window · Team or ad-hoc (policy)
  → Eligibility check
       ├─ OK → notify eligible members / create pending Team path → COM-006
       └─ Lock → Explainable Lock (Trust / Entitlement / Capacity)
```

```text
┌────────────────────────────────────────────────────────────┐
│ Collaboration request                                      │
│ Goal: ________________________________                     │
│ Context: Route / Mission (no private solution paste)       │
│ Looking for: roles (bounded)                               │
│ □ I understand: no unrestricted DMs — work happens in      │
│   Team / Route / Repository spaces.                        │
├────────────────────────────────────────────────────────────┤
│ [Cancel]                              [Send request]       │
└────────────────────────────────────────────────────────────┘
```

- Accept/decline happens in space UI, not DM thread.
- Declined requests leave no harassment channel; report available.

---

## Create Post (COM-004)

- Requires Trust Standing OK (and space membership where scoped).
- Type-first compose; required fields per type; optional Evidence **link** (never paste private solution keys).
- Publish requires sync when online policy demands; Offline Draft allowed for compose body only.
- No “boost,” paid pin, or reach purchase.

---

## Report & Appeal (FLOW-012 → TRU-006)

```text
COM-003 / feed card / member / space
  → [Report]
  → TRU-006 Report / Appeal
       category · description · evidence attachment policy
  → Confirmation + case ID
  → Status (pending / actioned / insufficient)
  → Appeal if policy allows (same TRU-006 appeal mode)
```

Reporter gets confirmation, not a public drama feed. Accused sees policy-safe notice when applicable — details in Trust docs.

---

## Trust restrictions

| State | Compose | React | Join Team | Collab request |
|-------|---------|-------|-----------|----------------|
| Good standing | Allowed | Allowed | Per rules | Allowed |
| Soft limit | Rate-limited / review queue | Limited | Maybe | Explainable |
| Restricted | Locked + path | Locked | Locked | Locked |
| Banned from Rookery | Entry blocked at COM-001 | — | — | — |

Locks use [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) Trust Requirement pattern. **No pay-to-trust.**

---

## What Rookery interaction must never do

- Offer unrestricted private messaging or “message Crow” inbox.
- Use engagement-max dark patterns (infinite compulsion, fake urgency, pay-to-reach, streak shame).
- Sell Mastery, Rank, Prestige, Trust, or moderation outcomes.
- Leak private Mission solutions, unreleased Evidence, or Live competitive secrets into public feed.
- Imply Community Profile is a separate progressive identity from Wingprint (IDN-004 family).

---

## Traceability

| Journey / Cap | Screens | Outcome |
|---------------|---------|---------|
| FLOW-011 Collaboration | COM-005 → COM-006 | Team work without DMs |
| FLOW-012 Report | COM-003 → TRU-006 | Case + optional appeal |
| CAP-SOC-001 Rookery | COM-001..008 | Safe structured community |
| Scope §3.16 | — | Unrestricted DMs OUT OF SCOPE |
