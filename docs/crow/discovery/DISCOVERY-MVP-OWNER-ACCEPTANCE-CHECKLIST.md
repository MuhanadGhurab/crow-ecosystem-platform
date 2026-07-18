# Discovery MVP — Owner Acceptance Checklist (D0–D7 Local-First)

| Field | Value |
|-------|-------|
| **Title** | Owner-facing UX and boundary checklist |
| **Status** | **Owner-accepted** — CROW.DISCOVERY.LOCAL-FIRST.ACCEPT.1 |
| **Date** | 2026-07-18 |
| **Certification** | [`DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md`](DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md) |
| **Acceptance milestone** | [`../milestones/CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md`](../milestones/CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md) |
| **Issue** | [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) — remains OPEN for hosted / dual-track / Blueprint |

---

## How to use

1. Review a qualified Discovery workspace on `feat/first-tenant-golden-path` (client and/or operator surface).  
2. Check each item below during manual review.  
3. Only after review, if satisfied, record the **acceptance phrase** (bottom).  
4. Do **not** treat agent/docs completion as owner acceptance.

**Recorded acceptance:** Owner accepted D0–D7 local-first on 2026-07-18 (see acceptance milestone). Checklist items below are the review basis for that acceptance.

---

## A. Context and shell

| # | Check | Pass? |
|---|-------|-------|
| A1 | Linked **request context** is visible (org name / reference) | ☑ |
| A2 | **JourneyKind** is visible (Build New / Transform Existing) | ☑ |
| A3 | **OrganizationContext** is visible when present on brief | ☑ |
| A4 | **Stages 1–7** overview is visible | ☑ |
| A5 | Product Discovery status language is clear (not tenant/Blueprint approval) | ☑ |

---

## B. Adaptive fields (Stages 1–7)

| # | Check | Pass? |
|---|-------|-------|
| B1 | Adaptive **Stage 1–3** fields are visible when JourneyKind is set | ☑ |
| B2 | **NEW vs TRANSFORM** differences are visible (required / shown fields) | ☑ |
| B3 | **Stages 4–7** depth fields are visible (trust/risk, intent, evidence refs, review prep) | ☑ |
| B4 | Answers feel like learning / draft capture — not runtime configuration | ☑ |
| B5 | Local draft behavior is acceptable (browser-local; no claim of hosted save) | ☑ |
| B6 | Evidence is **references-only** (no file upload) | ☑ |
| B7 | Stage 7 is ProCrow review **preparation**, not Blueprint approval | ☑ |

---

## C. Operating Model preview (D4)

| # | Check | Pass? |
|---|-------|-------|
| C1 | **Operating Model input draft** preview is visible | ☑ |
| C2 | Draft is labeled as draft / pre-Blueprint (not approved OM) | ☑ |
| C3 | Missing information / readiness cues are understandable | ☑ |
| C4 | Stage 4–7 answers enrich trust/risk, transform intent, and evidence sections | ☑ |

---

## D. ProCrow modeling review (D5)

| # | Check | Pass? |
|---|-------|-------|
| D1 | **ProCrow modeling review** panel is visible | ☑ |
| D2 | Ready-for-modeling (when shown) does **not** imply Blueprint approval | ☑ |
| D3 | Risk / missing / clarification messaging is clear | ☑ |
| D4 | Messaging states this is **not** approval, tenant build, or authority | ☑ |

---

## E. Blueprint handoff boundary (D6)

| # | Check | Pass? |
|---|-------|-------|
| E1 | **Blueprint handoff boundary** panel is visible after review | ☑ |
| E2 | **Blueprint generation remains blocked** messaging is visible | ☑ |
| E3 | Owner / ProCrow gates are called out as still required | ☑ |
| E4 | Package reads as **pre-Blueprint**, not an approved Enterprise Blueprint | ☑ |
| E5 | No “tenant runtime created” language | ☑ |

---

## F. Language / non-claims

| # | Check | Pass? |
|---|-------|-------|
| F1 | No misleading **“approved Blueprint”** language | ☑ |
| F2 | No **tenant runtime** / go-live implication from Discovery alone | ☑ |
| F3 | No **payment** / subscription language as Discovery outcome | ☑ |
| F4 | No **AI automation / CroAI** language as Discovery authority | ☑ |

---

## G. Safety understanding (owner confirms)

| # | Statement | Agree? |
|---|-----------|--------|
| G1 | D0–D7 is **local-first complete only** for current MVP scope | ☑ |
| G2 | Not hosted certified | ☑ |
| G3 | Not Production deployed as Discovery MVP accept | ☑ |
| G4 | Does not authorize Blueprint generation | ☑ |
| G5 | Does not authorize tenant provisioning / membership / roles | ☑ |
| G6 | Does not authorize payment or CroAI | ☑ |
| G7 | Does not authorize `main` merge or PR #10 merge | ☑ |
| G8 | GAP-004 remains open and blocks hosted Persistence; GAP-015 mitigated separately | ☑ |

---

## Owner acceptance wording

**Recorded (2026-07-18):**

> **OWNER ACCEPTS CROW.DISCOVERY.LOCAL-FIRST.1 — Discovery D0–D7 is accepted as local-first complete for the current MVP scope. This acceptance includes D0–D6 certification plus D7 Stages 4–7 depth. It does not authorize hosted persistence, migrations, Production deployment, main merge, Blueprint generation, tenant provisioning, payment, CroAI, PR #10 merge, or enabling completeDiscovery.**

| Field | Value |
|-------|-------|
| Accepted by | Owner |
| Date | 2026-07-18 |
| Evidence reviewed | Checklist A–G · certification doc · CROW.DISCOVERY.7 · Issue #18 |
| Acceptance milestone | [`CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md`](../milestones/CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md) |
| Next authorized work | GAP-004 (isolation) · dual-track unify · future Blueprint drafting (separate auth) |

**Do not** close Issue #18 solely because local-first D0–D7 was accepted. Original #18 criteria were design-scope; remaining work (hosted persistence, dual tracks, Blueprint drafting) keeps #18 OPEN unless the owner explicitly retargets or closes it.
