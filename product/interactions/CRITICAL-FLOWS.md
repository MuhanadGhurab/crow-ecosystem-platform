# Critical End-to-End Interaction Flows

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IX-FLOW-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [WIREFRAME-REGISTRY.md](../wireframes/WIREFRAME-REGISTRY.md) · [MASTER-USER-JOURNEY.md](../journeys/MASTER-USER-JOURNEY.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Exact Route IDs — GHV.LEARNING.1 |
| **Change history** | 1.0.0 — PD.3 |

Screen IDs use the locked Master Screen Registry. Wireframe IDs: `GHV-WF-<same>`.

---

## FLOW-001 — First Free Flight

| Field | Value |
|-------|-------|
| **User** | Visitor → A1 |
| **Start** | PUB-001 |
| **Steps** | PUB-001 → ACT-001 → ACT-002 → ACT-003 → ACT-004 → ACT-005 → ACT-006 → ACT-007 → ONB-001 → IDN-001 → ONB-002 → ONB-003 → ONB-007 → ONB-008 → ONB-009 (Open Flight Route) → ONB-010 → ONB-011 → LRN-001 |
| **Decisions** | Nest path vs skip bands; Horizon; Route within free capacity |
| **State changes** | A0→A1; Origin set; Nest decision; Route entitlement Open Flight |
| **Failures** | ACT-009 blocked; email invalid; risk deny |
| **Complete** | First Mission canvas open |
| **Analytics** | account_created, email_verified, terms_accepted, nest_decision, route_selected, mission_started |
| **Audit** | Terms acceptance, activation |
| **Acceptance** | User reaches Mission without paying; Open Flight visible |

## FLOW-002 — First Evidence and Wings Claimed

| Field | Value |
|-------|-------|
| **User** | Learner |
| **Start** | LRN-001 |
| **Steps** | LRN-001 → practical → LRN-003 → LRN-004 → LRN-005 → Mastery surface → LRN-010 → SKY-001 |
| **Failures** | Upload fail; integrity reject; revision (FLOW-008) |
| **Complete** | Wings Claimed + Skyboard Continue Flight |
| **Analytics** | evidence_submitted, evidence_approved, wings_claimed |
| **Audit** | Evidence submit/approve |
| **Acceptance** | XP≠Mastery messaging visible; Evidence before Mastery |

## FLOW-003 — Missing Prerequisite

ONB-009/LRN-008 → Learning Prerequisite Lock → WLD-003 path → start prerequisite. No payment dominance.

## FLOW-004 — Premium Route with Merit Alternative

Route select → Commercial Entitlement lock → PAY-001 + PAY-006 Merit → Choose plan / Merit path / Save for later.

## FLOW-005 — Route Capacity Reached

Route select → Capacity Lock → Pause Route / Upgrade / Cancel. Concurrency per Scope §3.19.

## FLOW-006 — Returning User

ACT-010 → TRU-001 → TRU-002 if needed → SKY-001 → resume Mission position.

## FLOW-007 — Stalled User Recovery

Return → SKY-001 Stalled variant → smaller Mission or Resume → updated Flight Plan (ONB-011 refresh).

## FLOW-008 — Evidence Revision

LRN-005 revision → feedback → LRN-003 edit → LRN-004 resubmit.

## FLOW-009 — Join Live Sky

LIV-001 → LIV-002 → eligibility → Boarding (LIV-002/003 gate) → LIV-003 → LIV-005.

## FLOW-010 — Spectate Live Sky

Public-safe or auth LIV-001/002 → Spectate → LIV-004 (no private solutions/Team channels) → Result public-safe.

## FLOW-011 — Community Collaboration

COM-005 → collaboration request → eligibility → COM-006 → project/Mission work. No DMs.

## FLOW-012 — Report and Appeal

Content action → report (COM-003/TRU-006) → confirmation → case status → decision → appeal if allowed.

## FLOW-013 — Subscription Purchase

Contextual upgrade → PAY-001 → PAY-002 → PAY-003 → entitlement update → return to Route. Ethical plan rules apply.

## FLOW-014 — Failed Renewal and Grace

Renewal fail → Grace banner → update payment → retry success **or** downgrade Open Flight; preserve completed work.

## FLOW-015 — Account Recovery

TRU-005 → method → verification → cooling → session revoke → restricted recovery → full restore. Toast alone insufficient.

## FLOW-016 — Data Export or Deletion

IDN-005 / privacy → export or delete → step-up → consequence review → confirm → status tracking. Pending legal wording labeled.

---

## Flow status summary

| Flow | Status |
|------|--------|
| FLOW-001 … FLOW-016 | **Complete** (low-fidelity interaction) |
