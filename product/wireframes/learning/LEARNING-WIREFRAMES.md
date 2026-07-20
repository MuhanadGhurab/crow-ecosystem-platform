# Learning Wireframes — LRN-001..012

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-LRN-INDEX |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [MISSION-WORKSPACE.md](./MISSION-WORKSPACE.md) · [EVIDENCE-LIFECYCLE.md](./EVIDENCE-LIFECYCLE.md) · [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Change history** | 1.0.0 — PD.3 |

Wireframe IDs follow `GHV-WF-<SCREEN-ID>` (e.g. `GHV-WF-LRN-001`). ASCII only; low fidelity locked.

---

## Index

| Wireframe ID | Screen | Detail level |
|--------------|--------|--------------|
| GHV-WF-LRN-001 | Mission Player | Detailed |
| GHV-WF-LRN-002 | Mission Complete | Detailed |
| GHV-WF-LRN-003 | Evidence Capture | Detailed (see Evidence Lifecycle) |
| GHV-WF-LRN-004 | Evidence Submit | Detailed |
| GHV-WF-LRN-005 | Evidence Status | Detailed |
| GHV-WF-LRN-006 | Assessment Runner | Detailed |
| GHV-WF-LRN-007 | Stage Overview | Detailed |
| GHV-WF-LRN-008 | Route Overview | Detailed |
| GHV-WF-LRN-009 | Unlock Celebration | Detailed |
| GHV-WF-LRN-010 | Wings Claimed | Detailed |
| GHV-WF-LRN-011 | Cross-Wing Hub | Family |
| GHV-WF-LRN-012 | Secure Extension Hub | Family |

---

## GHV-WF-LRN-001 — Mission Player

**Purpose:** Complete Mission steps in Mission Focus shell.  
**Entry:** Continue Flight, Stage, Route, Flight Plan.  
**Exit:** LRN-002 · Safe Exit · LRN-003 when Evidence prompted · LRN-006 when assessment gate.

```text
┌──────────────────────────────────────────────────────────────────┐
│ Mission · progress · [Save chip]                                 │
├──────────────────────────────────────────────────────────────────┤
│ Variant canvas (written|video|visualization|scenario|practical|  │
│ laboratory|assessment|collaborative|remediation)                 │
│ See MISSION-WORKSPACE.md                                         │
├──────────────────────────────────────────────────────────────────┤
│ [Safe Exit]                              [Continue / Submit]     │
└──────────────────────────────────────────────────────────────────┘
```

**Locks:** Prerequisite / readiness / trust before canvas; no mid-Mission subscription interrupt.  
**Micro-Mission / prereq block:** overlay or inline state — not a new screen ID.

---

## GHV-WF-LRN-002 — Mission Complete

**Purpose:** Confirm success; route next learning or Evidence.  
**Entry:** All required Mission steps done (server ack).  
**Primary:** Next Mission / Stage · Start Evidence · Skyboard.

```text
┌──────────────────────────────────────────────────────────────────┐
│ Mission complete                                                 │
│ XP / progress note (XP ≠ Mastery copy if relevant)               │
│ What unlocked (if any) — soft; full celebration may be LRN-009   │
├──────────────────────────────────────────────────────────────────┤
│ Next steps:                                                      │
│  [Continue next Mission]                                         │
│  [Capture Evidence]  (if required/offered)                       │
│  [Return to Stage]                                               │
│  [Skyboard]                                                      │
└──────────────────────────────────────────────────────────────────┘
```

**States:** loading outcome · partial credit policy message · offline delayed confirm.

---

## GHV-WF-LRN-003 — Evidence Capture

See [EVIDENCE-LIFECYCLE.md](./EVIDENCE-LIFECYCLE.md). Wireframe ID **GHV-WF-LRN-003**.

Draft artifact + visibility (Private|Public) + Safe Exit vs continue-to-submit.

---

## GHV-WF-LRN-004 — Evidence Submit

See Evidence Lifecycle. Wireframe ID **GHV-WF-LRN-004**.

Confirm visibility, review path, sync-gated **Submit**.

---

## GHV-WF-LRN-005 — Evidence Status

See Evidence Lifecycle. Wireframe ID **GHV-WF-LRN-005**.

Timeline + outcomes: approved · revision · rejected · revoked. Exit to Log / edit / Skyboard.

---

## GHV-WF-LRN-006 — Assessment Runner

**Purpose:** Formal assessment inside Mission Focus (assessment variant).  
**Entry:** Assessment-gated Mission step; entitlement already resolved.  
**Primary:** Submit answers (final). **Safe Exit:** per assessment policy (warn if attempt voided).

```text
┌──────────────────────────────────────────────────────────────────┐
│ Assessment · integrity notice · [Save/attempt state]             │
├──────────────────────────────────────────────────────────────────┤
│ Question N / M                                                   │
│ Stem                                                             │
│ Answer controls                                                  │
├──────────────────────────────────────────────────────────────────┤
│ [Safe Exit]  [Previous]                         [Next / Submit]  │
└──────────────────────────────────────────────────────────────────┘
```

On final Submit success → LRN-002 (or fail feedback then remediation path). No paywall.

---

## GHV-WF-LRN-007 — Stage Overview

**Purpose:** Stage progress and Mission entry.  
**Entry:** Route Overview, Continue Flight deep-link, unlock.  
**Primary:** Enter Mission (LRN-001).

```text
┌──────────────────────────────────────────────────────────────────┐
│ Stage name · Route crumb                                         │
│ Progress: Missions done / total · Stage mastery hint             │
├──────────────────────────────────────────────────────────────────┤
│ Mission list:                                                    │
│  ● Mission A — Complete                                          │
│  ▶ Mission B — In progress · Continue                            │
│  ○ Mission C — Available                                         │
│  🔒 Mission D — Locked · Why + path                              │
├──────────────────────────────────────────────────────────────────┤
│ [Back to Route]                              [Continue Mission]  │
└──────────────────────────────────────────────────────────────────┘
```

Locks use Explainable Lock pattern (prerequisite / readiness / entitlement — entitlement not dominant over learning path).

---

## GHV-WF-LRN-008 — Route Overview

**Purpose:** Route map of Stages; enter Stage; see Bridges/prereqs.  
**Entry:** Horizon Detail, entitlement success, Cross-Wing/SE hubs.  
**Primary:** Enter Stage (LRN-007).

```text
┌──────────────────────────────────────────────────────────────────┐
│ Route name · Horizon · entitlement badge                         │
│ Overall progress                                                 │
├──────────────────────────────────────────────────────────────────┤
│ Stage map (linear or graph-lite):                                │
│  [Stage 1 ✓]──[Stage 2 ▶]──[Stage 3 🔒]──[Stage 4 ○]             │
│ Bridge out / Bridge in markers (if any)                          │
│ Prerequisites → open WLD-003                                     │
├──────────────────────────────────────────────────────────────────┤
│ [World / Horizon]  [Learning Graph]           [Enter Stage]      │
└──────────────────────────────────────────────────────────────────┘
```

Capacity / commercial locks: sheet before entry, not inside Mission Focus.

---

## GHV-WF-LRN-009 — Unlock Celebration

**Purpose:** Acknowledge unlock (Stage, Route feature, Live eligibility, etc.).  
**Entry:** Unlock event after Mission/Evidence/eligibility.  
**Primary:** Continue (SKY-001 or unlocked destination).  
**Motion:** Preferable; **reduced motion** = static success panel, same content.

```text
┌──────────────────────────────────────────────────────────────────┐
│ Unlocked: [name]                                                 │
│ What this means (one sentence)                                   │
│ What you can do now                                              │
├──────────────────────────────────────────────────────────────────┤
│ [Continue to unlocked place]              [Go to Skyboard]       │
└──────────────────────────────────────────────────────────────────┘
```

No upsell as primary. Secondary commercial only if unlock is entitlement-gated and user asked for path — never hijack celebration.

---

## GHV-WF-LRN-010 — Wings Claimed

**Purpose:** First Wings moment after Evidence-backed path (FLOW-002).  
**Entry:** First qualifying Evidence approval / Mastery surface handoff.  
**Primary:** Go to Skyboard (Your Wings module reflects claim).  
**Related:** Your Wings module on SKY-001.

```text
┌──────────────────────────────────────────────────────────────────┐
│ Wings Claimed                                                    │
│ You earned your first Wings through Evidence — not XP alone.     │
│ Crest / Wings mark (low-fi placeholder)                          │
├──────────────────────────────────────────────────────────────────┤
│ [View Your Wings on Skyboard]                                    │
│ [Continue Flight]                                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## Family — GHV-WF-LRN-011 Cross-Wing Hub

**Purpose:** Atlas-published Cross-Wing entry; not a full Mission Player.  
**Entry:** Eligible learner from World / catalogue / recommendation.  
**Primary:** Enter Route (LRN-008) for the Cross-Wing Route.

```text
┌──────────────────────────────────────────────────────────────────┐
│ Cross-Wing Hub                                                   │
│ Atlas summary: capabilities joined · value statement             │
│ Access formula status: met / missing (Explainable)               │
├──────────────────────────────────────────────────────────────────┤
│ Launch Cross-Wing Route card(s)                                  │
│ Prerequisites · Evidence expectations · trust notes              │
├──────────────────────────────────────────────────────────────────┤
│ [Back to World]                              [Enter Route]       │
└──────────────────────────────────────────────────────────────────┘
```

Family states: loading Atlas · ineligible (path to close gaps) · entitled · degraded Atlas fetch (retry + support).

---

## Family — GHV-WF-LRN-012 Secure Extension Hub

**Purpose:** Atlas-published Secure Extension entry.  
**Entry:** Eligible + assurance/trust as required.  
**Primary:** Enter Extension Route / controlled experience (→ LRN-008 or extension-specific Stage).

```text
┌──────────────────────────────────────────────────────────────────┐
│ Secure Extension Hub                                             │
│ Sensitivity / assurance banner                                   │
│ Atlas summary · required skills · trust bar                      │
├──────────────────────────────────────────────────────────────────┤
│ Extension card(s) · eligibility checklist                        │
│ What is sandboxed / monitored (plain language)                   │
├──────────────────────────────────────────────────────────────────┤
│ [Back]  [Improve assurance]                    [Enter Extension] │
└──────────────────────────────────────────────────────────────────┘
```

Family states: assurance gap · trust gap · entitled · unavailable in region · offline (entry blocked with reason).

---

## Shared learning rules

1. Mission Focus: no subscription interrupt (MISSION-WORKSPACE).
2. Safe Exit ≠ Submit.
3. XP ≠ Mastery messaging at Evidence/Wings moments.
4. Wireframe IDs stable: `GHV-WF-LRN-00N`.
