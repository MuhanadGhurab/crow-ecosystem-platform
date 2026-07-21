# Critical End-to-End Interaction Flows

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IX-FLOW-001 |
| **Version** | 1.1.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 · amended **GHV.BASELINE-CORRECTION.1** |
| **Last updated** | 2026-07-21 |
| **Related** | [WIREFRAME-REGISTRY.md](../wireframes/WIREFRAME-REGISTRY.md) · [MASTER-USER-JOURNEY.md](../journeys/MASTER-USER-JOURNEY.md) · [SCREEN-BASELINE-REFERENCE-AUDIT.md](../../governance/corrections/SCREEN-BASELINE-REFERENCE-AUDIT.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Exact Route IDs — GHV.LEARNING.1 |
| **Change history** | 1.0.0 — PD.3 · **1.1.0 — BASELINE-CORRECTION.1** (activation ACT-003 → ACT-011; ACT-012 recovery; ACT-004 superseded alias) |

Screen IDs use the locked Master Screen Registry (reconciling to **92** under GHV.BASELINE-CORRECTION.1). Wireframe IDs: `GHV-WF-<same>`.

### Amendment note (v1.1.0)

Activation result handling uses **ACT-011 (Email Verification Result)**, not ACT-004. **ACT-004** remains documented only as **SUPERSEDED_ALIAS → ACT-011**. Pending UX is **ACT-003 (Email Verification Pending)**. Interrupted activation uses **ACT-012 (Activation Recovery)** without mandatory-step bypass. Other critical flows (FLOW-002…016) are unchanged.

---

## FLOW-001 — First Free Flight

| Field | Value |
|-------|-------|
| **User** | Visitor → A1 |
| **Start** | PUB-001 |
| **Steps** | PUB-001 → ACT-001 → ACT-002 → ACT-003 → ACT-011 → ACT-005 → ACT-006 → ACT-007 → ONB-001 → IDN-001 → ONB-002 → ONB-003 → ONB-007 → ONB-008 → ONB-009 (Open Flight Route) → ONB-010 → ONB-011 → LRN-001 |
| **Decisions** | Nest path vs skip bands; Horizon; Route within free capacity |
| **State changes** | A0→A1 (email result success + terms + acceptable risk); Origin set; Nest decision; Route entitlement Open Flight |
| **Failures** | ACT-009 blocked; ACT-011 failure/expired; email invalid; risk deny; interrupt → ACT-012 |
| **Complete** | First Mission canvas open |
| **Analytics** | account_created, email_verified, terms_accepted, nest_decision, route_selected, mission_started |
| **Audit** | Terms acceptance, activation, email verification result |
| **Acceptance** | User reaches Mission without paying; Open Flight visible; no ACT-004 in live path |

### ID note — ACT-004

| Field | Value |
|-------|-------|
| **ACT-004** | **SUPERSEDED_ALIAS** of **ACT-011** (former “Email Verified”). Do not route new flows to ACT-004. Historical PD.3 refs mean ACT-011. |

---

## Activation email and recovery paths (FLOW-001 extensions)

These paths refine FLOW-001; they do not replace FLOW-002…016.

### FLOW-001-P — Email Verification Pending

| Field | Value |
|-------|-------|
| **Start** | ACT-002 success (or ACT-012 resume → pending) |
| **Screen** | **ACT-003** Email Verification Pending |
| **Steps** | Show masked destination email → wait / poll / magic-link expected → optional Resend (cooldown) → optional Change email (policy) |
| **Complete** | Deep-link or confirmed verify attempt → **ACT-011** |
| **Failures** | Send fail (retry); rate limit; offline; risk → ACT-009 |
| **Acceptance** | No fake urgency shorter than real token policy; product limited until verified |

### FLOW-001-R-OK — Email Verification Result (success)

| Field | Value |
|-------|-------|
| **Start** | Valid one-time token / provider confirm |
| **Screen** | **ACT-011** success state |
| **Steps** | Validate token → consume → success copy → Continue |
| **Complete** | **ACT-005** Accept Mandatory Terms |
| **Acceptance** | Success does not equal A1 alone; terms + risk still required. Verified email ≠ tenant auth ≠ elevated assurance |

### FLOW-001-R-FAIL — Email Verification Result (failure)

| Field | Value |
|-------|-------|
| **Start** | Invalid, expired, reused, or mismatched token |
| **Screen** | **ACT-011** failure state |
| **Steps** | Explain reason class → Resend / return pending → or ACT-012 if session interrupted |
| **Complete** | Back to **ACT-003** or **ACT-012** resume |
| **Acceptance** | No silent A1; no mandatory-step skip |

### FLOW-001-RESEND — Resend verification email

| Field | Value |
|-------|-------|
| **Start** | ACT-003 (or ACT-011 failure with resend) |
| **Steps** | Request resend → cooldown → confirmation live region |
| **Complete** | Remain on ACT-003 pending; new token invalidates prior per policy |
| **Acceptance** | Rate-limited; honest cooldown only |

### FLOW-001-EXP — Expired verification

| Field | Value |
|-------|-------|
| **Start** | User opens expired link or pending past expiry |
| **Steps** | ACT-011 expired/failure **or** ACT-003 expired banner → Resend → ACT-003 |
| **Complete** | Fresh pending state |
| **Acceptance** | Expired never treated as verified |

### FLOW-001-CHG — Email change during activation

| Field | Value |
|-------|-------|
| **Start** | ACT-003 change-email (policy-allowed) |
| **Steps** | Authenticate / confirm change → update destination → send new mail → ACT-003 pending for new address |
| **Complete** | Pending on new email; prior tokens void |
| **Acceptance** | Change audited; no bypass of verification |

### FLOW-001-INT — Interrupted activation

| Field | Value |
|-------|-------|
| **Start** | Browser close, session loss, soft risk interrupt, or abandon mid A0→A1 |
| **Steps** | Return (ACT-010 or deep link) → **ACT-012** Activation Recovery → compute next incomplete mandatory step |
| **Complete** | Resume ACT-003 / ACT-011 / ACT-005 / ACT-006 as required |
| **Acceptance** | **No mandatory step bypass**; progress preserved where policy allows |

### FLOW-001-REC — Activation Recovery (ACT-012)

| Field | Value |
|-------|-------|
| **Start** | Governed failure/interruption points (see Journey) |
| **Screen** | **ACT-012** |
| **Steps** | Explain where user stopped → list remaining mandatory steps → Resume primary → Support secondary |
| **Complete** | Enter correct next ACT screen |
| **Acceptance** | Recovery ≠ shortcut; verified email ≠ tenant auth ≠ elevated assurance |

### FLOW-001-RET — Return to activation

| Field | Value |
|-------|-------|
| **Start** | ACT-010 Sign In with incomplete activation **or** support return |
| **Steps** | Auth OK → trust/session checks as applicable → ACT-012 or direct incomplete screen |
| **Complete** | Back on activation happy path |
| **Acceptance** | Does not dump unfinished users onto Skyboard |

### FLOW-001-DONE — Activation completion handoff

| Field | Value |
|-------|-------|
| **Start** | ACT-005 accepted + risk acceptable → ACT-006 |
| **Steps** | ACT-006 → ACT-007 (mobile now/later) → ONB-001 |
| **Complete** | Leave Activation Shell into onboarding |
| **Acceptance** | A1 recorded; optional mobile skippable for ordinary learning |

---

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
If activation incomplete: ACT-010 → **ACT-012** (or ACT-003/011/005) before Skyboard.

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
Distinct from **ACT-012** (activation-path recovery only).

## FLOW-016 — Data Export or Deletion

IDN-005 / privacy → export or delete → step-up → consequence review → confirm → status tracking. Pending legal wording labeled.

---

## Flow status summary

| Flow | Status |
|------|--------|
| FLOW-001 (+ activation extensions) | **Complete** (low-fidelity) — amended BASELINE-CORRECTION.1 |
| FLOW-002 … FLOW-016 | **Complete** (low-fidelity interaction) |
