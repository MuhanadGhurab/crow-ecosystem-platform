# Professional Title Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-TTL-PRO-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related** | [PROGRESSION-SYSTEM-SEPARATION.md](../architecture/PROGRESSION-SYSTEM-SEPARATION.md) · [ROUTE-MASTERY-ARCHITECTURE.md](../mastery/ROUTE-MASTERY-ARCHITECTURE.md) · [BREADTH-ARCHITECTURE.md](../breadth/BREADTH-ARCHITECTURE.md) · [TRUST-STANDING-ARCHITECTURE.md](../trust/TRUST-STANDING-ARCHITECTURE.md) · [MASTERY-FRESHNESS-ARCHITECTURE.md](../mastery/MASTERY-FRESHNESS-ARCHITECTURE.md) · [ROUTE-PROVEN-STANDARD.md](../../learning/proven/ROUTE-PROVEN-STANDARD.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Unresolved** | Title catalogue, capability bundles, review quorum → **GHV.PROGRESSION.1B** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Professional Title Architecture |

## Purpose

Define **Professional Titles** as **governed capability bundles** reviewed and awarded under progression architecture — **not** as job offers, employment guarantees, regulated licenses, or purchasable credentials.

```text
STATUS: ARCHITECTURE RECOMMENDED
Titles = governed capability bundles
Titles ≠ job offers · ≠ employment guarantees
Catalogue and bundles pending GHV.PROGRESSION.1B
No Product Code · No numeric formulas
```

## Binding definition

| Principle | Statement |
|-----------|-----------|
| **What a Title is** | A governed recognition that a reviewed bundle of demonstrated capability (and related eligibility conditions) has been met for a defined professional scope. |
| **What a Title is not** | An employment contract, job offer, regulated professional license, Access Plan benefit, XP reward, or popularity prize. |
| **System ID** | `PGS-TTL` |
| **Definition / award IDs** | `TTL-<DOMAIN>-<NUMBER>` (catalogue deferred). |
| **Values** | Bundle composition, freshness intervals, and review thresholds are **FORMULA PENDING** (1B). This Gate defines eligibility classes, states, rules, and a design **TEMPLATE** only. |

---

## Possible eligibility requirements

A Title definition may require one or more of the following (exact bundles pending 1B):

| Requirement class | Role |
|-------------------|------|
| **Capability Mastery** | Demonstrated capability standing for scoped capabilities in the Title bundle. |
| **Route-Proven** | Route-Proven under Learning Design Baseline qualitative conditions where the Title scope depends on that Route. |
| **Breadth** | Meaningful Breadth where the Title claims multidisciplinary or multi-path scope. |
| **Capstone Evidence** | Approved capstone Evidence aligned to the Title’s scope. |
| **Trust Standing** | Trust eligibility appropriate to the Title’s sensitivity. |
| **Refreshed Evidence** | Current Demonstration / freshness where historical Achievement alone is insufficient. |
| **Human review** | Required for sensitive Titles; automation may assist summarization but does not final-decide sensitive awards. |

Not every Title requires every class. Misleading senior Titles must not be grantable from a single foundation Route alone (see binding rules).

---

## Title states

Exact totals for Title states in this Gate: **9**.

| State | Meaning |
|-------|---------|
| **NOT_ELIGIBLE** | Bundle conditions not met; no Title progress claim for this definition. |
| **PROGRESS_VISIBLE** | Partial progress toward the governed bundle is visible to the learner. |
| **ELIGIBLE_FOR_REVIEW** | Bundle eligibility met; awaiting or ready for governed review. |
| **UNDER_REVIEW** | Human (and any permitted assistive) review is in progress. |
| **GRANTED** | Title awarded for the defined scope under current policy. |
| **REFRESH_RECOMMENDED** | Historical grant remains, but refreshed Evidence / Current Demonstration is recommended. |
| **SUSPENDED** | Title display or authority paused pending integrity, Evidence, or Trust process. |
| **REVOKED** | Prior grant revoked for governed cause; history retained for audit. |
| **RETIRED** | Title definition retired from new awards; historical grants handled under retirement policy (display/annotation rules PENDING). |

---

## Binding rules

| ID | Rule |
|----|------|
| TTL-R1 | **Titles cannot be purchased.** Payment and Access Plan never grant Titles. |
| TTL-R2 | **Titles are not awarded from XP, Momentum, or popularity alone.** |
| TTL-R3 | **One foundation Route ≠ a misleading senior Title.** Senior or advanced Title scopes require honest bundle depth (exact bundles pending 1B). |
| TTL-R4 | **Honest scope.** Display and claims must match the Title’s governed scope — no silent overclaim of adjacent domains. |
| TTL-R5 | **External certifications may support Evidence** as inputs to review — they do **not** auto-grant a GHURAVIA Title. |
| TTL-R6 | **Display distinguishes GHURAVIA Titles from employer job titles.** UI and copy must not present Titles as employment status. |
| TTL-R7 | **Title catalogue is deferred.** No final Title list is locked in this Gate. |
| TTL-R8 | **Capability bundles pending GHV.PROGRESSION.1B.** |
| TTL-R9 | **Sensitive Titles require human review** in addition to automated eligibility checks. |
| TTL-R10 | **Evidence revocation, Trust sanctions, or freshness failure may move a Title** to REFRESH_RECOMMENDED, SUSPENDED, or REVOKED as governed — without inventing numeric thresholds here. |

---

## Title-design TEMPLATE (fields only)

This TEMPLATE is for designing future Title definitions. It is **not** a catalogue of final Titles.

| Field | Purpose |
|-------|---------|
| `title_id` | Stable ID (`TTL-<DOMAIN>-<NUMBER>`). |
| `display_name` | Learner-facing Title name (GHURAVIA-scoped wording). |
| `domain_scope` | Domain / Horizon / Route scopes covered. |
| `capability_bundle` | Listed capabilities / Mastery scopes required (detail PENDING 1B). |
| `proven_requirements` | Route-Proven or other Proven conditions, if any. |
| `breadth_requirements` | Breadth dimensions or markers required, if any. |
| `capstone_evidence` | Capstone / Evidence anchors required, if any. |
| `trust_requirements` | Minimum Trust state / assurance notes (no public numeric score required). |
| `freshness_requirements` | Refresh / Current Demonstration expectations. |
| `review_class` | Whether human review is mandatory; sensitivity class. |
| `prohibited_claims` | Explicit overclaim boundaries (what this Title must not imply). |
| `display_rules` | How the Title is labeled vs employer job titles. |
| `suspension_revocation_hooks` | Which Evidence / Trust / integrity events may suspend or revoke. |
| `retirement_policy` | What happens if the definition is retired. |
| `status` | Draft / candidate / deferred — **no final catalogue in 1A**. |

---

## Relationship to other systems

| System | Boundary |
|--------|----------|
| **Mastery / Route-Proven** | Primary demonstration inputs; Titles do not replace Proven standards. |
| **Breadth** | Optional eligibility input for multidisciplinary Titles. |
| **Trust Standing** | Gate for sensitive Titles; Trust is not a Title. |
| **Prestige** | Prestige is rare exceptional distinction; Titles are capability bundles — distinct systems. |
| **Flight XP / Momentum / Leaderboards** | Never sole Title sources. |
| **Access Plan** | Commercial access only; never Title purchase. |

---

## Visibility and explainability

| Concept | Architecture |
|---------|--------------|
| **Learner-facing copy** | “A Professional Title is a reviewed capability bundle — not a job offer.” |
| **Portfolio** | Titles display with GHURAVIA labeling distinct from employer job titles. |
| **Public** | Optional under privacy policy; must not claim regulated licensure unless a future Gate explicitly governs that (out of scope for 1A). |
| **Audit** | Award, denial, suspension, and revocation are auditable and appealable. |

---

## Explicit non-goals

- No final Title catalogue in this Gate.
- No locked capability-bundle formulas or numeric cutoffs.
- No employment guarantees or job-placement claims.
- No purchasable Titles.
- No Product Code, simulation, calibration, or technical validation claims.

## Handoff

| Gate | Receives |
|------|----------|
| **GHV.PROGRESSION.1B** | States + rules + design TEMPLATE; must supply catalogue candidates, bundles, and review parameters under simulation discipline |
| **Calibration / simulation** | Must run before any numeric or catalogue lock that requires it |
| **Product Code / implementation** | BLOCKED until later governed gates |

```text
FORMULA PENDING
SIMULATION NOT RUN
CALIBRATION NOT RUN
TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
```
