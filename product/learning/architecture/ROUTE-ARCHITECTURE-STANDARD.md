# Route Architecture Standard

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-RT-ARCH-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [STAGE-ARCHITECTURE-STANDARD.md](./STAGE-ARCHITECTURE-STANDARD.md) · [MISSION-CATEGORY-REGISTRY.md](./MISSION-CATEGORY-REGISTRY.md) · [LEARNING-IDENTIFIER-STANDARD.md](./LEARNING-IDENTIFIER-STANDARD.md) · [LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md](../routes/LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) |
| **Source research** | GHV.LEARNING.1A portfolio (RC-* → RT-* mapping) |
| **Limitations** | Working titles only; no Product Codes; no XP / Mastery / Prestige formulas; Route status must never be written as final `LOCKED` in this Gate |
| **Unresolved** | Final display names (1D); Mission expansion (1C); PROGRESSION.1 thresholds |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1B |

## Purpose

Define the **required fields**, **status vocabulary**, and **review gates** for every launch Route architecture document under GHV.LEARNING.1B. Architecture files bind Horizon capability into Stages, Evidence anchors, and Capstone eligibility — without writing lesson content or inventing progression formulas.

```text
STATUS RULE (binding): Never use final LOCKED for Routes in LEARNING.1B.
Final catalogue lock → GHV.LEARNING.1D only.
```

## ID mapping (1A → 1B)

| 1A Candidate | Canonical Route ID | Working title |
|--------------|--------------------|---------------|
| RC-OPR-001 | **RT-OPR-001** | Cloud Systems Operations Foundations |
| RC-BLD-001 | **RT-BLD-001** | Web Application Delivery Foundations |
| RC-PRT-001 | **RT-PRT-001** | Defensive Security Operations Foundations |
| RC-LED-001 | **RT-LED-001** | Technology Delivery & Risk Foundations |
| RC-ANL-001 | **RT-ANL-001** | Practical Data Analysis Foundations (reserve) |

IDs follow [LEARNING-IDENTIFIER-STANDARD.md](./LEARNING-IDENTIFIER-STANDARD.md). Display-name changes must not change IDs.

## Allowed Route status values (LEARNING.1B)

| Status | Meaning |
|--------|---------|
| **ARCHITECTURE RECOMMENDED — PENDING 1D LOCK** | Architecture complete enough for 1B; catalogue not locked |
| **ARCHITECTURE RECOMMENDED — LAUNCH RESERVE** | Architecture drafted; launch inclusion capacity-conditional |
| **LAUNCH RESERVE — CAPACITY CONDITIONAL** | Must not ship as committed launch without capacity + Change Control |
| **DEFERRED** | Architecture paused; not in launch set |
| **REJECTED** | Do not pursue |

Forbidden in Route architecture headers: `LOCKED`, `PUBLISHED`, Product Codes, XP formulas, employment guarantees.

## Required Route architecture fields

Every file under `product/learning/routes/architecture/` MUST include the following sections (order preferred as listed).

### 1. Document header

| Field | Requirement |
|-------|-------------|
| Document ID | `GHV-LRN-RT-{HRZ}-NNN` |
| Version | Semver |
| Status | One of allowed values above — **never** final LOCKED |
| Owner | Founder (RAVEN) for launch set |
| Source Gate | GHV.LEARNING.1B |
| Last updated | ISO date |
| Related | Standards + 1A research links |
| Limitations | Explicit: no Product Code; no XP formulas; working title |
| Unresolved | Open questions for 1C / 1D / PROGRESSION.1 |
| Change history | Version notes |

### 2. Identity block

| Field | Requirement |
|-------|-------------|
| **Canonical ID** | `RT-{HRZ}-NNN` |
| **Working title** | Non-final display name |
| **Prior candidate ID** | `RC-*` mapping (traceability) |
| **Horizon** | `HRZ-OPR` \| `HRZ-BLD` \| `HRZ-ANL` \| `HRZ-PRT` \| `HRZ-LED` |
| **Route type** | e.g. FOUNDATIONAL · OPERATIONAL |
| **Capability statement** | One paragraph: what the learner can do after Route completion (observable, non-employment) |
| **Target learner** | Who the Route is designed for |

### 3. Entry and exit

| Field | Requirement |
|-------|-------------|
| **Entry** | Nest readiness rule — **do not change Scope §3.5 thresholds**: ≥50% path (Guided Skip with Micro-Missions) **or** Nest complete / Ready to Fly per Scope bands |
| **Exit** | Stages complete + required Evidence accepted + Capstone eligible (qualitative; no XP formula) |
| **Prerequisites** | Hard gates (`PREREQUISITE`) |
| **Corequisites** | Parallel requirements (`COREQUISITE`) |
| **Recommended** | Soft graph edges (`RECOMMENDED`) |

### 4. Stage table

One row per Stage (`{ROUTE}-STG-NN`). Columns required:

| Column | Content |
|--------|---------|
| Stage ID | Canonical |
| Title | Working Stage title |
| Outcomes | Observable learner outcomes |
| Mission categories | From [MISSION-CATEGORY-REGISTRY.md](./MISSION-CATEGORY-REGISTRY.md) |
| Evidence contribution | Which EVD anchors this Stage feeds |
| Remediation | Failure / gap path (`REMEDIATES` / RMD-*) |
| Next Unlock | What this Stage unlocks (`ULK-*` or next Stage) |

Stage design rules: [STAGE-ARCHITECTURE-STANDARD.md](./STAGE-ARCHITECTURE-STANDARD.md).

### 5. Evidence anchors

| Field | Requirement |
|-------|-------------|
| EVD IDs | `{ROUTE}-EVD-NN` |
| Artifact class | Config, report, repo, etc. |
| Stage contribution | Which Stages feed the anchor |
| Integrity notes | Seed, disclosure, redaction |
| Review pattern | Human / checklist (no score formula) |

### 6. Capstone

| Field | Requirement |
|-------|-------------|
| Capstone ID | `{ROUTE}-CAP-01` (launch default) |
| Eligibility | All Stages done + required EVD accepted |
| Concept link | Capstone concept from 1A (no full Mission instructions) |
| Output shape | Artifacts expected |

### 7. Graph attachments

| Field | Requirement |
|-------|-------------|
| Cross-Wing links | e.g. CXW-001 source / bridge notes |
| Secure Extension links | e.g. SEX-001 attachment — **do not duplicate** full Extension content |
| Bridges | `BRG-*` conceptual notes |

### 8. Delivery constraints

| Field | Requirement |
|-------|-------------|
| Tooling classes | From tooling research (CLOUD-SANDBOX, LOCAL-SAFE, etc.) |
| Vendor posture | Prefer vendor-neutral foundations |
| Safety | Lab, ethics, harm constraints |
| Arabic-first | Feasibility posture + bidi notes |
| Freshness | Stable / Slow / Fast content classes |
| Expert review | Required review types before 1D |
| Route-Proven (qualitative) | What would make the Route “proven” — qualitative only, no XP |
| Unresolved | Open items |

### 9. Stage review table (Gate §33)

**Required by gate §33.** Every Route architecture file MUST include a Stage review table assessing each Stage against architecture readiness criteria. This is a **design review** artifact — not a learner assessment and not a LOCKED verdict.

| Column | Meaning |
|--------|---------|
| Stage ID | `{ROUTE}-STG-NN` |
| Outcomes clarity | Clear / Needs work |
| Category fit | Categories appropriate per registry |
| Evidence contribution | Anchors mapped |
| Remediation path | Defined |
| Unlock coherence | Next Unlock sensible |
| Safety | Pass / Watch |
| Accessibility | Pass / Watch |
| Integrity | Pass / Watch |
| Offline / tooling notes | Notes |
| Reviewer | Role (Founder / SME placeholder) |
| Verdict | **ARCHITECTURE OK** \| **REVISE** — never LOCKED |

Aggregate Route verdict for §33: list Stage counts and whether all Stages are ARCHITECTURE OK.

## Nest readiness (authoritative — do not redesign)

Source: Scope Baseline §3.5 / Nest Dependency Map.

| Result | Label | Rule (unchanged) |
|--------|-------|------------------|
| ≥ 70% | Ready to Fly | May skip Nest; weaknesses → recommended reviews; no advanced Mastery from skip alone |
| 50%–69% | Guided Skip | May continue; Micro-Missions inserted; advanced Routes keep prerequisites |
| < 50% | Nest Recommended | Nest recommended; advanced gated content unavailable until Nest done or readiness ≥ 50% |

Route **Entry** may cite “Nest readiness ≥ 50% path or Nest complete per Scope bands” — thresholds are not modified here.

## Forbidden content in Route architecture

- Product Codes  
- XP, Prestige point, or Mastery **formulas** (thresholds stay PENDING PROGRESSION.1)  
- Employment / certification / placement promises  
- Full Mission step-by-step instructions (defer to LEARNING.1C)  
- Status `LOCKED` as final Route lock  
- Duplicating full Cross-Wing or Secure Extension curricula inside the host Route  

## File naming

```text
product/learning/routes/architecture/RT-{HRZ}-NNN-{SLUG}.md
```

Example: `RT-OPR-001-CLOUD-SYSTEMS-OPERATIONS.md`

## Relationship to later Gates

| Gate | Role |
|------|------|
| GHV.LEARNING.1B | This standard + Stage standard + Mission categories + Route architecture files |
| GHV.LEARNING.1C | Mission, Evidence schema, Capstone blueprint expansion |
| GHV.LEARNING.1D | Catalogue final review and lock |

## Checklist (author)

- [ ] Canonical ID is `RT-*` with RC-* mapping stated  
- [ ] Status is never final LOCKED  
- [ ] Entry respects Nest Scope bands without changing thresholds  
- [ ] Stage table complete (ID, outcomes, categories, Evidence, remediation, Unlock)  
- [ ] Evidence anchors + Capstone present  
- [ ] CW / SEX links non-duplicative  
- [ ] Tooling, safety, Arabic, freshness, expert review, Route-Proven qualitative, unresolved present  
- [ ] §33 Stage review table present with per-Stage verdicts  
- [ ] No Product Codes; no XP formulas  
