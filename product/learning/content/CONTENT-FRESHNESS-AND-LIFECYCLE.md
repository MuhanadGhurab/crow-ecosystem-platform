# Content Freshness and Lifecycle

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-FRESH-001 |
| **Version** | 1.0.0 |
| **Status** | RESEARCH BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1A |
| **Access date** | 2026-07-21 |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [LEARNING-RESEARCH-METHODOLOGY.md](../research/LEARNING-RESEARCH-METHODOLOGY.md) · [RESEARCH-SOURCE-REGISTER.md](../research/RESEARCH-SOURCE-REGISTER.md) · [LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md](../routes/LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md) · GHV.PROGRESSION.1 (pending) |
| **Limitations** | Lifecycle states are content-governance baselines, not legal SLAs; cadences from methodology may adjust after expert review; no Product Codes; no employment promises |
| **Unresolved** | Exact notification channels; PROGRESSION.1 Mastery revocation rules; CMS implementation; Arabic reviewer workflow hooks |
| **Change history** | 1.0.0 (2026-07-21) — Initial RESEARCH BASELINE for GHV.LEARNING.1A |

## Purpose

Govern how learning content moves from research to publication and how it ages — so Routes, Missions, and Evidence guidance stay trustworthy without silent harm to learners’ historical Mastery.

Portfolio IDs referenced below remain **NOT LOCKED** in this Gate.

## Content status model

Ordered lifecycle (typical forward path). Backward moves are allowed only with documented reason.

| Status | Meaning |
|--------|---------|
| **DRAFT** | Authoring in progress; not for learner consumption |
| **RESEARCHED** | Evidence-backed outline exists; scorecard/register aware |
| **EXPERT REVIEW** | Subject-matter and/or Arabic instructional review in flight |
| **APPROVED** | Review passed; awaiting publish window / packaging |
| **PUBLISHED** | Live for entitled learners |
| **REVIEW DUE** | Cadence or trigger says re-check; still live unless escalated |
| **UPDATE REQUIRED** | Material defect or external change; remediation planned |
| **DEPRECATED** | Superseded or unsafe to present as current; may remain readable for history |
| **ARCHIVED** | Removed from active catalogue; retained for audit / historical Evidence context |

```text
RESEARCH BASELINE note: Route candidates in LEARNING.1A use research statuses
(e.g. RESEARCHED / RECOMMENDED — NOT YET LOCKED). They are not PUBLISHED product.
```

## Required metadata on every content unit

| Field | Requirement |
|-------|-------------|
| **Owner** | Named accountable author/maintainer |
| **Reviewer** | Named reviewer (may differ from owner); bilingual reviewer when Arabic-first |
| **Sources** | SRC-* / citations used; freshness class (Stable / Slow / Fast / Vendor / Regulatory) |
| **Version** | Semver or Gate-aligned version string |
| **Dates** | `created` · `last updated` · `review due` · `published` (if any) · `deprecated` / `archived` (if any) |
| **Affected Routes / Missions** | Explicit ID list (e.g. RC-OPR-001 Stages/Missions; CXW-001; SEX-001) |
| **Status** | One of the statuses above |

Optional: change rationale, lab cost impact, Evidence rubric version pin.

## Ownership and review rules

1. **Owner** proposes status transitions; cannot self-APPROVE security-critical or Arabic-first first releases without a second reviewer.  
2. **Reviewer** confirms factual accuracy, safety, and (where applicable) Arabic instructional quality.  
3. **Sources** must be re-checked when status moves to EXPERT REVIEW or when REVIEW DUE fires.  
4. **Version** increments on any learner-visible change; patch vs minor vs major aligns with Evidence impact (see Mastery rule).

## Cadence baseline (from methodology)

| Freshness class | Review cadence | Examples |
|-----------------|----------------|----------|
| Stable Foundation | 18–24 months | Networking concepts, SE fundamentals |
| Slow-Changing Practice | 12 months | Cloud patterns, IAM concepts, data eng patterns |
| Fast-Changing Technology | 3–6 months | GenAI tool UIs, threat TTPs, framework CLIs |
| Vendor-Specific Detail | On major release | Console click-paths, product names |
| Regulatory / Standards | On edition change | Framework editions, control language |

Cadences create **REVIEW DUE**; they do not auto-DEPRECATED.

## Urgent triggers → UPDATE REQUIRED (or faster)

Escalate without waiting for cadence when any of the following occur:

| Trigger | Typical action |
|---------|----------------|
| Safety / ethics defect (harmful lab, unsafe guidance) | Immediate unpublish or PATCH; status UPDATE REQUIRED or DEPRECATED |
| Broken lab / quota / credential pattern | UPDATE REQUIRED; notify active learners |
| Major vendor UI or API break in required tooling | UPDATE REQUIRED; version pin guidance |
| Regulatory / standards edition that invalidates claims | UPDATE REQUIRED; legal/compliance consult if needed |
| Source retraction or material error in SRC register | UPDATE REQUIRED for dependent Missions |
| Integrity breach in Evidence pattern | UPDATE REQUIRED + integrity bulletin |
| Arabic glossary error with safety meaning | UPDATE REQUIRED; bilingual re-review |

## Deprecation rules

- Prefer **DEPRECATED** with successor pointer over silent deletion.  
- DEPRECATED content may remain visible as “historical” where needed for Evidence context.  
- **ARCHIVED** after successor is PUBLISHED (or after explicit decision that no successor exists).  
- Deprecation reason and affected Route/Mission IDs are mandatory.

## Learner notification

When content that learners rely on changes materially:

| Change class | Notify? |
|--------------|---------|
| Cosmetic / typo (no Evidence meaning change) | Optional |
| Lab steps / tooling change | Yes — active Route enrollees |
| Evidence rubric change | Yes — enrollees + in-progress Evidence submitters |
| Safety / integrity bulletin | Yes — all affected; prominent |
| Deprecation / archive | Yes — with successor path |
| Mastery impact (rare) | Yes — governed per rule below |

Notification channel implementation: **PENDING** (product/ops). This document requires *that* notification occur, not a specific messenger.

## Mastery integrity rule (links GHV.PROGRESSION.1)

```text
Content updates MUST NOT silently revoke historical Mastery.
```

Binding research baseline:

1. Publishing a newer Mission/Route version does **not** automatically invalidate Mastery earned under a prior version.  
2. Any revocation, expiry, or forced re-Evidence of Mastery requires a **governed rule** under **GHV.PROGRESSION.1** (Merit / Mastery / Trust), with:  
   - explicit policy ID / rule reference  
   - learner notification  
   - recorded effective date  
   - appeal or remediation path where applicable  
3. Prefer **forward-only** requirements (new Unlocks need new Evidence) over rewriting the past.  
4. If a safety defect means prior Evidence was unsafe or fraudulent, handle via integrity process — still not a silent catalogue edit.

Until PROGRESSION.1 is published, treat all Mastery impacts as **blocked** except emergency integrity/safety actions logged to the founder Owner.

## Affected portfolio (tracking aid — NOT LOCKED)

| ID | Working title | Notes |
|----|---------------|-------|
| RC-OPR-001 | Cloud Systems Operations Foundations | Med maintenance; vendor detail triggers |
| RC-BLD-001 | Web Application Delivery Foundations | Fast tooling pressure |
| RC-PRT-001 | Defensive Security Operations Foundations | TTP / scenario pack freshness |
| RC-LED-001 | Technology Delivery & Risk Foundations | Low freshness pressure |
| RC-ANL-001 | Practical Data Analysis Foundations (alt) | Tool + privacy example refresh |
| CXW-001 | Secure Application Delivery | Inherits BUILD + secure-practice freshness |
| SEX-001 | Secure Cloud Operations Extension | Inherits OPR + hardening guidance |

## Explicit non-claims

- Freshness cadences are not uptime or employment guarantees.  
- No Product Codes in this Gate.  
- No endorsement of vendors or authorities by citing their docs as sources.
