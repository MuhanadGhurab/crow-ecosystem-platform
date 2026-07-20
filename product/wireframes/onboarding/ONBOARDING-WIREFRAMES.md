# Onboarding Wireframes (ONB-001 … ONB-011)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-FAM-ONB-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [NEST-INTERACTION-FLOW.md](./NEST-INTERACTION-FLOW.md) · [HORIZON-FUTURE-PREVIEW.md](./HORIZON-FUTURE-PREVIEW.md) · [CROW-PERSONALIZATION-FLOW.md](../identity/CROW-PERSONALIZATION-FLOW.md) · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · [CRITICAL-FLOWS.md](../../interactions/CRITICAL-FLOWS.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Exact Route names — **PENDING GHV.LEARNING.1** · Merit criteria — PENDING PROGRESSION.1 / LEARNING.1 · Legal privacy wording |
| **Change history** | 1.0.0 — PD.3 |

**Notation:** Markdown + ASCII. Not final UI. Shell: Guided Onboarding. Wireframe ID = `GHV-WF-ONB-00N` for screen `ONB-00N`.

Interrupted onboarding resumes at last incomplete ONB/ACT/IDN step (no separate screen ID).

---

## Sequence overview

```text
ACT-007 (mobile now/later)
  → ONB-001 Personalize Entry
  → IDN-001..003 (Crow setup)
  → ONB-002 Set Origin
  → ONB-003 Nest Intro
  → ONB-004 Nest Assessment (if Test / Review check)
  → ONB-005 Nest Result
  → ONB-006 Nest Learning Path (if Nest path)
  → ONB-007 Choose Horizon
  → ONB-008 Preview Possible Future
  → ONB-009 Choose Route
  → ONB-010 Eligibility Decision
  → ONB-011 Flight Plan Review
  → LRN-001 First Mission
```

---

## GHV-WF-ONB-001 — Personalize Entry (ONB-001)

**Purpose:** Enter Crow setup; choose guided vs quick-start.

```text
┌────────────────────────────────────────────────────────────┐
│ Welcome · Create your Crow presence                        │
│ Visual Identity ≠ Knowledge                                │
├────────────────────────────────────────────────────────────┤
│ [ Start guided personalization ]  ← primary                │
│ [ Quick start with defaults ]                              │
│ [ Why a Crow? ]  tertiary info sheet                       │
├────────────────────────────────────────────────────────────┤
│ Soft time hint (optional) — no fake urgency                │
│ [Back]                                                     │
└────────────────────────────────────────────────────────────┘
```

| Exit | Target |
|------|--------|
| Start guided / Quick start | IDN-001 |
| Back | ACT-007 / activation result |

---

## GHV-WF-ONB-002 — Set Origin (ONB-002)

**Purpose:** Record Origin after Crow basics.

```text
┌────────────────────────────────────────────────────────────┐
│ Set Your Origin · Step indicator                           │
├────────────────────────────┬───────────────────────────────┤
│ Origin fields              │ RAVEN: Origin helps           │
│ (region / context / goals  │ recommend Horizons — you      │
│  — exact fields pending    │ remain in control.            │
│  content Gate)             │                               │
│                            │ Soft default allowed with     │
│ □ Review later reminder    │ review prompt (journey).      │
├────────────────────────────┴───────────────────────────────┤
│ [Back · Crow]  [Save draft]              [Continue · Nest] │
└────────────────────────────────────────────────────────────┘
```

**Exit:** ONB-003. Soft default + review prompt if deferred details.

---

## GHV-WF-ONB-003 — Nest Intro (ONB-003)

See also [NEST-INTERACTION-FLOW.md](./NEST-INTERACTION-FLOW.md).

```text
┌────────────────────────────────────────────────────────────┐
│ The Nest · Digital Foundations                             │
├────────────────────────────────────────────────────────────┤
│ What the Nest is · Why readiness bands exist               │
│                                                            │
│ [ Start The Nest ]                                         │
│ [ Review The Nest ]                                        │
│ [ Test Your Readiness ]                                    │
├────────────────────────────────────────────────────────────┤
│ [Back · Origin]                                            │
└────────────────────────────────────────────────────────────┘
```

| Choice | Next |
|--------|------|
| Start | ONB-006 (or LRN-001 Nest Mission) |
| Review | Content / optional ONB-004 |
| Test | ONB-004 |

---

## GHV-WF-ONB-004 — Nest Assessment (ONB-004)

```text
┌────────────────────────────────────────────────────────────┐
│ Readiness check · item i of n · Saved                      │
├────────────────────────────────────────────────────────────┤
│ Question / task canvas                                     │
│ Progress bar (readiness only — not Rank)                   │
├────────────────────────────────────────────────────────────┤
│ [Save & exit]                              [Continue]      │
│ Final item: [Submit check] requires sync                   │
└────────────────────────────────────────────────────────────┘
```

**Exit:** ONB-005 on complete submit.

---

## GHV-WF-ONB-005 — Nest Result (ONB-005)

Bands from Scope §3.5:

```text
┌────────────────────────────────────────────────────────────┐
│ Result label: Ready to Fly | Guided Skip | Nest Recommended│
│ Supportive explanation (no-shame)                          │
│ Band rule summary                                          │
│ Optional weakness reviews / Micro-Mission note             │
├────────────────────────────────────────────────────────────┤
│ Primary CTA depends on band:                               │
│  ≥70% → Choose Horizon   (+ optional Nest)                 │
│  50–69% → Horizon or Strengthen Nest                       │
│  <50% → Enter Nest path  (+ Explore World Map)             │
└────────────────────────────────────────────────────────────┘
```

**Exits:** ONB-006 · ONB-007 · WLD-001 (explore).

---

## GHV-WF-ONB-006 — Nest Learning Path (ONB-006)

```text
┌────────────────────────────────────────────────────────────┐
│ Nest Learning Path                                         │
│ Mission list (titles PENDING GHV.LEARNING.1)               │
│ ○ …  ● current  ○ …                                        │
├────────────────────────────────────────────────────────────┤
│ [Start / Resume Mission → LRN-001]                         │
│ [Retest readiness → ONB-004] when eligible                 │
└────────────────────────────────────────────────────────────┘
```

---

## GHV-WF-ONB-007 — Choose Horizon (ONB-007)

Horizons: OPERATE · BUILD · ANALYZE · PROTECT · LEAD.

```text
┌────────────────────────────────────────────────────────────┐
│ Choose Your Horizon                                        │
│ ★ Recommended · Alternative · Explore all five             │
│ Detail: identity + immediate Route slots (unnamed)         │
│ [World Map → WLD-001]                                      │
├────────────────────────────────────────────────────────────┤
│ [Back]                                    [Continue]       │
└────────────────────────────────────────────────────────────┘
```

Detail interaction: [HORIZON-FUTURE-PREVIEW.md](./HORIZON-FUTURE-PREVIEW.md).

**Exit:** ONB-008.

---

## GHV-WF-ONB-008 — Preview Possible Future (ONB-008)

```text
┌────────────────────────────────────────────────────────────┐
│ Possible future · [Horizon]                                │
│ Learning sections (primary): Routes slots · advanced ·     │
│   professional · Cross-Wing · Secure Extension · Evidence  │
│ Access context (secondary, collapsed): entitlement ·       │
│   Merit · Plans → PAY-001                                  │
├────────────────────────────────────────────────────────────┤
│ [Skip deep preview]                 [Continue to Routes]   │
└────────────────────────────────────────────────────────────┘
```

**Exit:** ONB-009. Plans/Merit never dominate.

---

## GHV-WF-ONB-009 — Choose Route (ONB-009)

**Do not invent Route names.** Show Horizon-scoped slots and status only.

```text
┌────────────────────────────────────────────────────────────┐
│ Choose Your Route · Horizon: [NAME]                        │
├────────────────────────────┬───────────────────────────────┤
│ Route slots                │ Detail panel                  │
│ ● Slot 1 — available       │ Purpose (generic)             │
│   (catalogue PENDING       │ Stages: summary count         │
│    GHV.LEARNING.1)         │ Evidence: expected types      │
│ ○ Slot 2 — prerequisite    │ Entitlement: capacity hint    │
│   lock visible             │                               │
│ ○ Slot 3 — entitlement     │ Open Flight example: free     │
│   lock visible             │ capacity path (plan name OK;  │
│ ○ Cross-Wing slot          │ Route title still pending)    │
│   (formula teaser)         │                               │
├────────────────────────────┴───────────────────────────────┤
│ [Back]  [Save for later]              [Select Route]       │
└────────────────────────────────────────────────────────────┘
```

Visible locks use Explainable Lock types (full decision on ONB-010). Selecting a locked Route still allowed to open ONB-010 with reason — Hidden UI ≠ Authorization.

**Exit:** ONB-010.

---

## GHV-WF-ONB-010 — Eligibility Decision (ONB-010)

**Purpose:** Separate **learning eligibility** from **commercial entitlement** before Flight Plan. Must use Explainable Locks patterns.

### Frame

```text
┌────────────────────────────────────────────────────────────┐
│ Eligibility & access · Route slot (unnamed)                │
│ Learning eligibility and commercial entitlement are        │
│ evaluated separately. Payment never substitutes for        │
│ readiness or Evidence.                                     │
├────────────────────────────────────────────────────────────┤
│ Checklist (each row → lock type or Clear):                 │
│  [ ] Learning prerequisites                                │
│  [ ] Nest / readiness                                      │
│  [ ] Commercial entitlement / plan capacity                │
│  [ ] Merit alternative (if applicable)                     │
│  [ ] Trust / assurance (if applicable)                     │
├────────────────────────────────────────────────────────────┤
│ Active lock sheet (one primary at a time)                  │
│ … pattern below …                                          │
├────────────────────────────────────────────────────────────┤
│ [Cancel / pick another Route]     [Primary resolve CTA]    │
└────────────────────────────────────────────────────────────┘
```

### Lock patterns (required)

Shared structure from [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md):

```text
┌────────────────────────────────────────────┐
│ Lock type label                            │
│ What is missing                            │
│ Why it matters                             │
│ Exact path / options                       │
│ [Primary resolve]  [Secondary]  [Cancel]   │
└────────────────────────────────────────────┘
```

#### 1) Learning Prerequisite

| Field | Content |
|-------|---------|
| Type | Learning Prerequisite |
| Missing | Named prerequisite Route/Stage/Mission/Evidence (**names PENDING LEARNING.1** — use slot IDs until then) |
| Why | Readiness for advanced work |
| Path | Open Learning Graph (WLD-003) / prerequisite slot |
| Primary | Start prerequisite |
| Forbidden | Payment CTA dominance |

#### 2) Readiness Requirement (Nest)

| Field | Content |
|-------|---------|
| Type | Readiness Requirement |
| Missing | Gap vs Nest bands (Scope §3.5) |
| Why | Foundations before gated advanced content |
| Path | Nest path (ONB-006) · Micro-Mission · Retest (ONB-004) |
| Language | No shame; low result ≠ lower human value |

#### 3) Commercial Entitlement

| Field | Content |
|-------|---------|
| Type | Commercial Entitlement |
| Missing | Access / plan feature for this Route slot |
| Why | Capacity and catalogue access — **not** Skill |
| Path | Smallest eligible plan (PAY-001/002) · Save for later |
| Secondary | Merit alternative when available |
| Forbidden | Implication of Skill purchase |

#### 4) Capacity Lock

| Field | Content |
|-------|---------|
| Type | Capacity Lock |
| Missing | Concurrent Route room vs plan (Scope §3.19) |
| Why | Plan concurrency limit |
| Options | Pause Route · Upgrade plan · Merit Grant · Cancel |

#### 5) Merit Eligible

| Field | Content |
|-------|---------|
| Type | Merit Eligible |
| Missing | Merit requirement (criteria **placeholder — PENDING**) |
| Why | Opportunity path without pay-to-win |
| Path | Required Evidence/achievement progress · PAY-006 |
| Secondary | Commercial alternative (never primary over Evidence) |

#### 6) Trust / Assurance (when applicable)

| Field | Content |
|-------|---------|
| Type | Trust Requirement or Assurance Requirement |
| Path | Moderation-positive path / TRU-003/004 improve assurance |
| Forbidden | Pay-to-trust |

### Clear state → continue

```text
┌────────────────────────────────────────────────────────────┐
│ Eligible to launch                                         │
│ Learning: clear · Entitlement: clear · Capacity: clear     │
│ [Review Flight Plan → ONB-011]                             │
└────────────────────────────────────────────────────────────┘
```

If entitlement missing but learning clear → PAY-002 / Merit path; return here after resolve (FLOW-004/005).

**Exits:** ONB-011 · PAY-002 · PAY-006 · WLD-003 · ONB-006 · ONB-009.

---

## GHV-WF-ONB-011 — Flight Plan Review (ONB-011)

```text
┌────────────────────────────────────────────────────────────┐
│ Review Your Flight Plan                                    │
├────────────────────────────────────────────────────────────┤
│ Horizon: [NAME]                                            │
│ Route: [slot — name PENDING GHV.LEARNING.1]                │
│ Nest decision: [band] · Micro-Missions: [yes/no]           │
│ First Mission: [slot]                                      │
│ Evidence expectation: [types]                              │
│ Plan capacity used: e.g. Open Flight 1/1                   │
├────────────────────────────────────────────────────────────┤
│ Reminder: Completion ≠ Mastery · Payment ≠ Prestige        │
├────────────────────────────────────────────────────────────┤
│ [Back]  [Change Route]              [Launch first Mission] │
└────────────────────────────────────────────────────────────┘
```

**Exit:** LRN-001. Launch is primary; Change Route returns ONB-009.

---

## Mobile / RTL / a11y (family)

| Concern | Behavior |
|---------|----------|
| Mobile | Single column; sticky primary CTA; locks as full-height sheet |
| RTL | Mirrored chrome; Horizon chips wrap naturally |
| Reduced motion | No required motion for Nest/Horizon understanding |
| Focus | Lock sheets trap focus until dismiss/resolve |
| Contrast | Primary CTA and lock labels meet a11y practice |

---

## Review status

| Wireframe ID | Screen | Review |
|--------------|--------|--------|
| GHV-WF-ONB-001 | ONB-001 | LOCKED AT LOW FIDELITY |
| GHV-WF-ONB-002 | ONB-002 | LOCKED AT LOW FIDELITY |
| GHV-WF-ONB-003 | ONB-003 | LOCKED AT LOW FIDELITY |
| GHV-WF-ONB-004 | ONB-004 | LOCKED AT LOW FIDELITY |
| GHV-WF-ONB-005 | ONB-005 | LOCKED AT LOW FIDELITY |
| GHV-WF-ONB-006 | ONB-006 | LOCKED AT LOW FIDELITY |
| GHV-WF-ONB-007 | ONB-007 | LOCKED AT LOW FIDELITY |
| GHV-WF-ONB-008 | ONB-008 | LOCKED AT LOW FIDELITY |
| GHV-WF-ONB-009 | ONB-009 | LOCKED AT LOW FIDELITY |
| GHV-WF-ONB-010 | ONB-010 | LOCKED AT LOW FIDELITY |
| GHV-WF-ONB-011 | ONB-011 | LOCKED AT LOW FIDELITY |
