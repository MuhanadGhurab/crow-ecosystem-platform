# Discovery MVP — Owner Acceptance Checklist (D0–D6 Local-First)

| Field | Value |
|-------|-------|
| **Title** | Owner-facing UX and boundary checklist |
| **Status** | Checklist for manual owner review — **not auto-accepted** |
| **Date** | 2026-07-18 |
| **Certification** | [`DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md`](DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md) |
| **Milestone** | [`../milestones/CROW-DISCOVERY-MVP-CERT-1.md`](../milestones/CROW-DISCOVERY-MVP-CERT-1.md) |
| **Issue** | [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) |

---

## How to use

1. Review a qualified Discovery workspace on `feat/first-tenant-golden-path` (client and/or operator surface).  
2. Check each item below during manual review.  
3. Only after review, if satisfied, record the **acceptance phrase** (bottom).  
4. Do **not** treat agent/docs completion as owner acceptance.

---

## A. Context and shell

| # | Check | Pass? |
|---|-------|-------|
| A1 | Linked **request context** is visible (org name / reference) | ☐ |
| A2 | **JourneyKind** is visible (Build New / Transform Existing) | ☐ |
| A3 | **OrganizationContext** is visible when present on brief | ☐ |
| A4 | **Stages 1–7** overview is visible | ☐ |
| A5 | Product Discovery status language is clear (not tenant/Blueprint approval) | ☐ |

---

## B. Adaptive fields (Stages 1–3)

| # | Check | Pass? |
|---|-------|-------|
| B1 | Adaptive **Stage 1–3** fields are visible when JourneyKind is set | ☐ |
| B2 | **NEW vs TRANSFORM** differences are visible (required / shown fields) | ☐ |
| B3 | Answers feel like learning / draft capture — not runtime configuration | ☐ |
| B4 | Local draft behavior is acceptable (browser-local; no claim of hosted save) | ☐ |

---

## C. Operating Model preview (D4)

| # | Check | Pass? |
|---|-------|-------|
| C1 | **Operating Model input draft** preview is visible | ☐ |
| C2 | Draft is labeled as draft / pre-Blueprint (not approved OM) | ☐ |
| C3 | Missing information / readiness cues are understandable | ☐ |

---

## D. ProCrow modeling review (D5)

| # | Check | Pass? |
|---|-------|-------|
| D1 | **ProCrow modeling review** panel is visible | ☐ |
| D2 | Ready-for-modeling (when shown) does **not** imply Blueprint approval | ☐ |
| D3 | Risk / missing / clarification messaging is clear | ☐ |
| D4 | Messaging states this is **not** approval, tenant build, or authority | ☐ |

---

## E. Blueprint handoff boundary (D6)

| # | Check | Pass? |
|---|-------|-------|
| E1 | **Blueprint handoff boundary** panel is visible after review | ☐ |
| E2 | **Blueprint generation remains blocked** messaging is visible | ☐ |
| E3 | Owner / ProCrow gates are called out as still required | ☐ |
| E4 | Package reads as **pre-Blueprint**, not an approved Enterprise Blueprint | ☐ |
| E5 | No “tenant runtime created” language | ☐ |

---

## F. Language / non-claims

| # | Check | Pass? |
|---|-------|-------|
| F1 | No misleading **“approved Blueprint”** language | ☐ |
| F2 | No **tenant runtime** / go-live implication from Discovery alone | ☐ |
| F3 | No **payment** / subscription language as Discovery outcome | ☐ |
| F4 | No **AI automation / CroAI** language as Discovery authority | ☐ |

---

## G. Safety understanding (owner confirms)

| # | Statement | Agree? |
|---|-----------|--------|
| G1 | D0–D6 is **local-first complete only** | ☐ |
| G2 | Not hosted certified | ☐ |
| G3 | Not Production deployed as Discovery MVP accept | ☐ |
| G4 | Does not authorize Blueprint generation | ☐ |
| G5 | Does not authorize tenant provisioning / membership / roles | ☐ |
| G6 | Does not authorize payment or CroAI | ☐ |
| G7 | Does not authorize `main` merge or PR #10 merge | ☐ |
| G8 | GAP-004 / GAP-015 remain open and block hosted/Production movement | ☐ |

---

## Owner acceptance wording

Use **exactly** (or equivalent explicit wording) when accepting:

> **OWNER ACCEPTS CROW.DISCOVERY.MVP-CERT.1 — Discovery D0–D6 is accepted as local-first complete only. No hosted certification, Production deployment, Blueprint generation, tenant provisioning, payment, CroAI, or main merge is authorized.**

| Field | Value |
|-------|-------|
| Accepted by | _(owner)_ |
| Date | _(ISO date)_ |
| Evidence reviewed | Checklist A–G · certification doc · Issue #18 |
| Next authorized work | _(e.g. GAP-004 / GAP-015)_ |

**Do not** close Issue #18 solely because D0–D6 implementation finished. Close or retarget only under explicit owner criteria after acceptance.
