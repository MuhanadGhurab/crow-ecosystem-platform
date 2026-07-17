# Request Intake MVP Plan

| Field | Value |
|-------|-------|
| **Title** | Client Request Intake MVP — Delivery Plan |
| **Status** | CANONICAL plan (CROW.REQUEST.1) — **planning only** |
| **Authority** | Owner review required before implementation |
| **Date** | 2026-07-18 |
| **Issue** | [#17](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/17) |
| **Audit** | [`REQUEST-INTAKE-AUDIT.md`](REQUEST-INTAKE-AUDIT.md) |
| **Milestone** | [`milestones/CROW-REQUEST-1.md`](../milestones/CROW-REQUEST-1.md) |

**This document does not authorize coding, migrations, hosted writes, PR #10 merge, or Production deploy.**

---

## Recommended MVP scope

Close the **product-complete Client Request Intake** path against the canonical lifecycle, building on existing code:

```
Public browse → Build New | Transform → Account → Legal → Email (+ Phone per policy)
→ Authenticated Request → ProCrow qualification queue → (stop before Discovery runtime MVP)
```

### In scope (product outcomes)

1. Public `/request` remains open; continue requires auth
2. Journey kind **NEW / TRANSFORM** captured through handoff **and** persisted on the request brief (GAP-008)
3. Organization context: `NEW_BUSINESS` \| `NEW_DIVISION` \| `EXISTING_ORGANIZATION` \| `MODERNIZATION` (already in types)
4. Authenticated create / list / detail / confirmation for requests
5. Verification + legal gates before progression (policy-aligned with owner decision on phone)
6. Submit creates request record only — **no** tenant, membership, platform role, payment, or Blueprint
7. Status landing at reviewable state (today: `PENDING_REVIEW`) with clear ProCrow queue entry
8. Operator can see queue and record qualification-oriented outcome (approve→Discovery handoff / decline) **without** provisioning tenant
9. Audit evidence for legal acceptance and submission
10. Tests covering public/gated boundaries and authority non-grants

### Explicit non-goals (this MVP stream)

- Tenant provisioning / membership creation
- Blueprint generation
- Payment / commercial instruments
- CroAI / SAREA authority changes
- Merging PR #10
- Hosted Preview certification while GAP-004 open (use local DB or wait)
- Full Discovery interview MVP (that is CROW.DISCOVERY.1)
- Full ProCrow Control Tower MVP (CROW.PROCROW.1) — only intake→queue handoff quality

### Status vocabulary decision (predictive)

**Preferred interim approach (no migration until owner approves):**

| Product concept | Map to current enum / behavior |
|-----------------|--------------------------------|
| DRAFT | Client-side draft **or** future server `DRAFT` (optional Phase R2) |
| SUBMITTED / NEEDS_REVIEW | `PENDING_REVIEW` |
| QUALIFIED | Transition toward Discovery (`UNDER_DISCOVERY` start) + evidence note |
| DECLINED | `REJECTED` |
| CONVERTED_TO_DISCOVERY | `UNDER_DISCOVERY` |

A schema rename/expansion is **optional later** under Phase R1 owner approval — not required to ship intake safety.

---

## Delivery model (hybrid)

| Concern | Model | Why |
|---------|-------|-----|
| Schema, auth, verification, legal, audit, hosted-data safety | **Predictive** | Authority and data risk |
| Request form UX, journey questions, review workflow UX | **Adaptive** | Iterate with owner feedback |
| Individual screens / copy | **Iterative** | Small vertical slices |
| Bugs / polish after baseline | **Kanban** | Continuous |

DoR / DoD: [`12-PROJECT-MANAGEMENT-OPERATING-MODEL.md`](../12-PROJECT-MANAGEMENT-OPERATING-MODEL.md).

---

## Implementation phases

### Phase R0 — Request safety baseline

**Model:** Predictive · **Coding:** only after owner authorizes an implementation milestone

- Confirm public `/request` vs gated `/client/requests/*` (tests already exist — extend if gaps)
- Confirm request submit ≠ tenant / role / payment authority
- Confirm C3 gate order: legal → email → phone (per policy) → ACTIVE → wizard
- Confirm no hosted write smoke while GAP-004 open
- Document local-only validation path for implementation work

**Exit:** Written safety checklist accepted; no unauthorized hosted mutations.

### Phase R1 — Request data model design

**Model:** Predictive · **No migration in this plan milestone**

Design (docs + types proposal only until authorized):

- JourneyKind on brief
- Status mapping table (above)
- Audit events for submit / decline / qualify handoff
- Consent/terms already on account — clarify any **request-level** acknowledgements (already partially in brief)
- Optional server `DRAFT` — decide keep client-only vs persist

**Exit:** Owner-approved schema/delta plan; migration scripts **not applied**.

### Phase R2 — Request UX design / adaptive build

**Model:** Adaptive + Iterative

- Authenticated form sections (org profile, contact/role, intent/goal, context, acknowledgements)
- Progressive steps; save draft (local or server per R1)
- Submit + status/confirmation screen
- Surface journey kind from URL into wizard state

**Exit:** Certified UX on local (or isolated Preview after GAP-004).

### Phase R3 — Verification and terms gates

**Model:** Predictive

- Enforce gates per **owner phone policy decision**
- Block wizard progression / submit consistent with ACTIVE account rules
- Regression tests: email-unverified, phone-unverified (when required), terms-not-accepted

**Exit:** Behavior matches owner-approved policy; constitution gap closed or explicitly waived with documented interim.

### Phase R4 — ProCrow qualification queue

**Model:** Adaptive (UX) + Predictive (authority)

- Ensure `PENDING_REVIEW` appears clearly in admin queue
- Review decision notes / decline path
- Qualification outcome without tenant create
- Field-review path remains advisory

**Exit:** Operator can qualify or decline with evidence; Discovery start remains explicit action.

### Phase R5 — Discovery handoff

**Model:** Predictive gate

- Only after qualification decision
- No tenant provisioning
- Handoff to CROW.DISCOVERY.1 scope — do not expand Discovery MVP here

**Exit:** Qualified request can enter Discovery workspace; boundaries documented.

---

## Required future migrations (later — not now)

Possible **future** migrations (owner-authorized, controlled workflow, preferably after GAP-004):

| Candidate | Trigger |
|-----------|---------|
| Brief/JourneyKind column or structured notes version bump | If JSON-in-notes insufficient |
| Server `DRAFT` usage / indexes | If drafts must be multi-device |
| New status enum values | Only if mapping table rejected |
| Request-level audit table | If account audit insufficient |
| Phone policy default change | Config/env first; schema only if needed |

**CROW.REQUEST.1 does not apply any migration.**

---

## Test plan (implementation milestones)

| Case | Expect |
|------|--------|
| Public `/request` | Open without sign-in |
| Secure continuation | Unauthenticated → login/signup with `next` |
| Draft/create routes | Authenticated only |
| Email unverified | Blocked from ACTIVE client progression |
| Phone unverified | Per owner policy (block or allow) |
| Terms not accepted | Blocked |
| Valid submit | Creates `ImplementationRequest`; confirmation shown |
| Status transitions | Only allowed operator paths |
| ProCrow queue visibility | Submitted request visible to staff |
| No tenant membership | Assert none created |
| No platform role | Assert none assigned |
| No payment required | Submit path free of checkout |
| No Blueprint generated | Assert none |
| Audit evidence | Legal acceptance + submission trail |

Reuse and extend existing suites listed in the audit.

---

## Modules / files likely involved (implementation later)

| Area | Paths |
|------|-------|
| Public | `src/app/(public)/request/`, `start/`, journey pages, `journey-handoff.ts`, `public-access-policy.ts` |
| Wizard | `src/components/client-service-request/`, `src/lib/client-service-request/` |
| Actions | `src/lib/actions/client-service-request.ts` |
| Auth/C3 | `src/lib/auth/session.ts`, `src/lib/account/*`, phone/email/legal services |
| Admin queue | `src/app/admin/requests/`, `src/app/admin/queue/`, `src/lib/procrow/`, `admin-pipeline.ts` |
| Schema | `prisma/schema.prisma` (design only until authorized) |

---

## Owner decisions required (before coding)

1. **Phone verification:** Enforce constitution (email+phone) as default, or keep deferred interim with explicit waiver?
2. **GAP-004:** Allow local-only implementation now, or block all Request coding until Preview DB isolated?
3. **Status vocabulary:** Keep mapping to `ImplementationRequestStatus`, or authorize enum expansion migration?
4. **Server drafts:** Keep localStorage-only, or authorize persisted `DRAFT`?
5. **Approve Phase R0–R5** order and authorize a named implementation milestone (e.g. CROW.REQUEST.2)?
6. **PR #10:** Confirm remains untouched; Request implementation must not depend on merging FTGP draft.
7. **Issue #15 / #16:** Confirm Production auto-deploy and Preview DB triage remain parallel (not blockers for planning; may block hosted certify).

---

## Recommended next milestone

After owner accepts this plan:

- **CROW.REQUEST.2** (suggested name) — Phase R0–R2 implementation on **local DB**, JourneyKind persistence, UX polish — **or**
- **CROW.INFRA.GAP004** / Issue #16 first if owner requires Preview isolation before any write-path coding
- Parallel: Issue #15 Production settings (GAP-015) remains independent

Do **not** start CROW.DISCOVERY.1 implementation until Request qualification handoff is certified.
