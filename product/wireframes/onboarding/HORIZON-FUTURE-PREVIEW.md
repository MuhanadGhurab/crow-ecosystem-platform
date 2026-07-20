# Horizon and Future Preview Interaction

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-FLOW-ONB-HZN-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [ONBOARDING-WIREFRAMES.md](./ONBOARDING-WIREFRAMES.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.6–3.10 · [MASTER-USER-JOURNEY.md](../../journeys/MASTER-USER-JOURNEY.md) · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · [INTERACTION-GRAMMAR.md](../../interactions/INTERACTION-GRAMMAR.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Exact Route catalogue names — **PENDING GHV.LEARNING.1** · Merit criteria — PENDING PROGRESSION.1 / LEARNING.1 |
| **Change history** | 1.0.0 — PD.3 |

Screens: ONB-007 Choose Horizon · ONB-008 Preview Possible Future. Related later: ONB-009 Choose Route. Wireframes: `GHV-WF-ONB-007`, `GHV-WF-ONB-008`.

**Do not invent Route names.** Refer to Horizons and generic slots only until LEARNING.1.

---

## Purpose

Help the learner pick a Horizon and glimpse a motivating possible future — learning-first. Access Plans and Merit appear only as **secondary** context so entitlement never overshadows possibility.

---

## Horizons (locked framework)

OPERATE · BUILD · ANALYZE · PROTECT · LEAD

Five-Horizon World Map at launch: CONTROLLED LAUNCH.

---

## ONB-007 — Choose Horizon

### Layout

```text
┌────────────────────────────────────────────────────────────┐
│ Choose Your Horizon                                        │
│ Nest decision: [Ready to Fly | Guided Skip | Nest Rec…]    │
├────────────────────────────┬───────────────────────────────┤
│ RECOMMENDED                │ Horizon identity              │
│ ★ [Horizon name]           │ Short purpose statement       │
│   Why recommended (Origin, │                               │
│   Nest signals, goals)     │ Immediate Routes (slots):     │
│                            │  · Route slot A — PENDING     │
│ ALTERNATIVE                │    GHV.LEARNING.1             │
│ ○ [Other Horizon]          │  · Route slot B — PENDING     │
│                            │                               │
│ EXPLORE                    │ Advanced possibilities:       │
│ ○ OPERATE ○ BUILD          │  · Later Stages (unnamed)     │
│ ○ ANALYZE ○ PROTECT        │  · Capstone (generic)         │
│ ○ LEAD                     │                               │
│                            │ [Open World Map → WLD-001]    │
├────────────────────────────┴───────────────────────────────┤
│ [Back]                                      [Continue]     │
└────────────────────────────────────────────────────────────┘
```

### Modes

| Mode | Behavior |
|------|----------|
| Recommended | One primary Horizon with plain-language why; still changeable |
| Relevant alternative | One secondary suggestion (not forced) |
| Open exploration | All five Horizons selectable; World Map exit for spatial browse |

Rules:

- Recommendation ≠ Final Authority (Constitution).
- Nest Recommended users may explore public World; gated advanced content still locked (Scope §3.5).
- Selection saves; Continue → ONB-008.

---

## ONB-008 — Preview Possible Future

Motivational preview after Horizon chosen. Continue without deep preview allowed (journey deferral).

```text
┌────────────────────────────────────────────────────────────┐
│ Your possible future · [Selected Horizon]                  │
├────────────────────────────────────────────────────────────┤
│ 1. Horizon identity (recap)                                │
│ 2. Immediate Routes — generic slots only (PENDING L.1)     │
│ 3. Advanced possibilities within Horizon                   │
│ 4. Professional directions (Flight Log / Evidence value)   │
│ 5. Cross-Wing preview (one launch Cross-Wing — unnamed)    │
│ 6. Secure Extension preview (one launch SE — unnamed)      │
│ 7. Evidence examples (types, not fake scores)              │
├────────────────────────────────────────────────────────────┤
│ SECONDARY — Access context (collapsed by default)          │
│  Entitlement status: Open Flight capacity reminder         │
│  Merit path: visible when eligible (criteria pending)      │
│  Access Plans: link to PAY-001 — does not grant Skill      │
├────────────────────────────────────────────────────────────┤
│ [Skip deep preview]              [Continue to Routes]      │
└────────────────────────────────────────────────────────────┘
```

### Section rules

| Section | Must | Must not |
|---------|------|----------|
| Immediate Routes | Show count/slots + Horizon | Invent Route titles |
| Advanced possibilities | Aspirational Stages/Missions language | Promise Mastery without Evidence |
| Professional directions | Evidence → portfolio / Flight Log | Claim accredited credentials at launch |
| Cross-Wing preview | Model + access formula summary | Name unpublished Routes |
| Secure Extension preview | Model + trust/readiness note | Imply pay-to-trust |
| Evidence examples | Rubric/types illustrative | Fake approved scores |
| Entitlement status | Concurrent Route capacity (Scope §3.19) | Imply payment = Rank |
| Merit path | Secondary; Explainable Lock pattern | Hide when entitled path exists without alternative |
| Access Plans | Secondary CTA to compare plans | Interrupt or dominate canvas |

### Cross-Wing access formula (display summary)

```text
Cross-Wing Access =
  Commercial Entitlement or Merit Grant
  AND Required Mastery
  AND Required Evidence
  AND Integration Readiness
  AND Applicable Trust Requirement
```

Preview shows formula as education; locks evaluate later at Route/eligibility (ONB-009/010).

### Secure Extension preview

- One launch Secure Extension in Scope; name PENDING LEARNING.1.
- Emphasize trust / assurance / readiness — not purchase of Prestige.

---

## Merit and plans — secondary only

```text
┌─ Access context (secondary) ───────────────────────────────┐
│ Learning possibility is primary on this screen.            │
│                                                            │
│ Plan capacity (e.g. Open Flight: 1 concurrent Route)       │
│ [Compare Access Plans → PAY-001]  quiet style              │
│                                                            │
│ Merit Access (if signaled eligible)                        │
│ [View Merit path → PAY-006]  never replaces Evidence       │
└────────────────────────────────────────────────────────────┘
```

Interaction Grammar: Payment ≠ Skill; subscription prompts do not interrupt learning canvas; Merit visible when entitlement missing and eligible.

---

## Flow continuity

```text
Nest decision complete
  → ONB-007 Choose Horizon
  → ONB-008 Preview Possible Future
  → ONB-009 Choose Route (slots; names PENDING LEARNING.1)
  → ONB-010 Eligibility Decision (Explainable Locks)
  → ONB-011 Flight Plan Review
```

---

## Mobile

- Recommended / Alternative / Explore as stacked sections.
- Future preview as vertical scroll; Access context accordion at bottom.
- Sticky Continue; Skip deep preview as text secondary.

---

## Acceptance (low-fi)

- User can select any of five Horizons.
- Preview remains understandable without animation.
- Plans/Merit never visually dominate learning possibility.
- No invented Route names appear as product truth.
