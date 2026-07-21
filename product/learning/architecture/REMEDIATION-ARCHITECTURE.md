# Remediation Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-RMD-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Review date** | Before GHV.LEARNING.1D |
| **Related** | [LEARNING-ELIGIBILITY-OVERLAY.md](./LEARNING-ELIGIBILITY-OVERLAY.md) · [LEARNING-UNLOCK-REGISTRY.md](./LEARNING-UNLOCK-REGISTRY.md) · [NEST-TO-ROUTE-BRIDGE-MAP.md](../nest/NEST-TO-ROUTE-BRIDGE-MAP.md) · [SHARED-CAPABILITY-REGISTRY.md](./SHARED-CAPABILITY-REGISTRY.md) · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · [NEST-INTERACTION-FLOW.md](../../wireframes/onboarding/NEST-INTERACTION-FLOW.md) |
| **Limitations** | Architecture only — no Mission scripts; remediation IDs `RMD-*` are patterns pending 1C instances |
| **Unresolved** | Mentor-review staffing · exact inactivity timers · content-change remapping automation |
| **Change history** | 1.0.0 (2026-07-21) — Remediation Architecture for GHV.LEARNING.1B |

## Purpose

Define how learning gaps become **targeted, explainable remediation** that preserves valid completed work and returns the learner to the correct graph position.

Graph edge: `REMEDIATES`.

Eligibility outcome when active: `REMEDIATION_REQUIRED` (or `BRIDGE_AVAILABLE` when a Bridge is the form).

Unlock on success: **ULK-RMD-001** (remediation exit).

## Design principles

1. **Target a specific gap** — name the capability / assessment / Evidence issue.
2. **Preserve completed valid work** — do not wipe Stages, approved Evidence, or Nest bands without integrity or revocation cause.
3. **Avoid unnecessary full-Route repetition** — remediate the gap, not the whole catalogue.
4. **Explain why it is required** — Explainable Lock: what is missing, why it matters, exact path.
5. **Return to the correct graph position** — after exit, re-evaluate Learning Eligibility on the original target.

Tone: supportive; Nest/remediation is a **path**, not a verdict on human value.

---

## Remediation sources

| Source | Description | Typical gate / trigger |
|--------|-------------|------------------------|
| **Nest weakness** | Assessment shows weak `NST-CAP-*` under Guided Skip or Nest Recommended | Nest result · Route entry · Micro-Mission insert |
| **Assessment gap** | Stage / Mission assessment below governed standard | Stage exit · Assessment Mission |
| **Practical failure** | Lab / practice outcome does not meet safety or competence bar | Laboratory / Independent practice |
| **Evidence revision** | Evidence submitted but needs revision (rubric / privacy / completeness) | Evidence review |
| **Integrity concern** | Authorship, secrets in artifacts, policy violation under review | Integrity pipeline → may escalate to `INTEGRITY_REVIEW` |
| **Long inactivity** | Skills / lab environment stale relative to resume policy | Resume / Skyboard recovery |
| **Changed content** | Content UPDATE REQUIRED / major version after learner mid-flight | Content lifecycle |
| **Missing shared capability** | Required `SHC-*` not yet demonstrated | Shared Capability Registry checks |

---

## Remediation forms

| Form | Use when | Notes |
|------|----------|-------|
| **Micro-Mission** | Nest weakness; short foundations refresh on Guided Skip | Inserted into Flight Plan; clearly labeled |
| **Guided practice** | Practical failure needing scaffolded retry | Preserve prior valid attempts as history |
| **Bridge** | Gap closable via `BRG-*` / `BRG-NEST-*` without full Route | Eligibility: `BRIDGE_AVAILABLE` |
| **Knowledge review** | Assessment gap on concepts | Optional light check; no shame language |
| **Evidence revision** | Evidence revision source | Keep prior draft versions; submit new revision |
| **Retest** | Nest readiness or assessment re-check after remediation | Does not auto-grant Mastery |
| **Mentor review** | Where available — integrity edge cases, stuck remediation, Live Sky facilitation | Not required for every gap at launch |

Identifier pattern for remediation nodes: `RMD-{DOMAIN}-NNN` (e.g. `RMD-NEST-001`).

---

## Sources × forms (per gate)

| Source | Primary forms | Secondary forms | Preserve valid work |
|--------|---------------|-----------------|---------------------|
| Nest weakness | Micro-Mission · Bridge (`BRG-NEST-*`) | Knowledge review · Retest | Nest band & completed Nest Missions remain; only weak caps remediated |
| Assessment gap | Knowledge review · Guided practice · Retest | Micro-Mission if Nest-rooted | Prior Stage completions remain; failed assessment attempt retained as history |
| Practical failure | Guided practice · Laboratory retry | Mentor review | Lab drafts / notes retained; unsafe labs reset environment only |
| Evidence revision | Evidence revision | Knowledge review (rubric) | Prior drafts versioned; approval only on new revision |
| Integrity concern | Mentor / integrity review · Evidence revision | Retest if required after clear | Non-implicated Evidence remains; implicated artifacts quarantined per policy |
| Long inactivity | Knowledge review · Guided practice · Micro-Mission | Retest · Bridge | Progress preserved; refresh tasks additive |
| Changed content | Knowledge review · Bridge · targeted Stage delta | Retest if safety-critical | Historical Evidence retained; forward requirements for new Unlocks (freshness policy) |
| Missing shared capability | Bridge to authoritative SHC location · Micro-Mission | Knowledge review | No duplicate full SHC course; recognize prior SHC Evidence when present |

---

## Explainability template

Every remediation must surface:

```text
┌────────────────────────────────────────────┐
│ Remediation required                       │
│ Gap: [named NST-CAP / SHC / Stage / Evidence] │
│ Why it matters: [readiness / safety / integrity] │
│ Path: [Micro-Mission | Bridge | revision | …] │
│ What stays complete: [preserved work]      │
│ [Start remediation]  [Save & exit]  [Cancel] │
└────────────────────────────────────────────┘
```

No payment CTA as primary resolution for learning remediation.

---

## Flow (conceptual)

```text
Gap detected (source)
    → Eligibility = REMEDIATION_REQUIRED or BRIDGE_AVAILABLE
    → Explainable Lock
    → Learner completes form(s)
    → ULK-RMD-001 (remediation exit)
    → Re-evaluate Final Access Decision components
       (Learning Eligibility on original target)
    → Return to correct graph position
```

## Integrity escalation

If remediation source is **integrity concern**:

- Prefer `INTEGRITY_REVIEW` eligibility while review is open.
- Do not offer pay-to-clear.
- After clear, remediation forms may still apply before return.

## Explicit non-goals

- No full-Route reset as default punishment.
- No XP penalties invented here.
- No Product Codes.
- No Nest threshold changes (70 / 50 locked).

## Next Gates

| Gate | Expected work |
|------|----------------|
| GHV.LEARNING.1C | `RMD-*` instances + Micro-Mission blueprints |
| GHV.LEARNING.1D | Lock remediation catalogue bindings |
| GHV.PROGRESSION.1 | Any Mastery / Trust interaction with remediation (if any) |
