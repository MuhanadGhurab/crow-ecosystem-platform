# Stage Architecture Standard

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-STG-ARCH-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-ARCHITECTURE-STANDARD.md](./ROUTE-ARCHITECTURE-STANDARD.md) · [MISSION-CATEGORY-REGISTRY.md](./MISSION-CATEGORY-REGISTRY.md) · [LEARNING-IDENTIFIER-STANDARD.md](./LEARNING-IDENTIFIER-STANDARD.md) · [LAUNCH-LEARNING-GRAPH-CONCEPT.md](../graph/LAUNCH-LEARNING-GRAPH-CONCEPT.md) |
| **Source research** | GHV.LEARNING.1A Nest / Graph / Evidence studies |
| **Limitations** | No Mission scripts; no Product Codes; no XP formulas; Stage “complete” is architectural — not LOCKED catalogue |
| **Unresolved** | Exact Mission counts (1C); Unlock UX copy; REMEDIATES edge instances |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1B |

## Purpose

Define how **Stages** are structured inside Routes (and, by analogy, Cross-Wing / Secure Extension hosts). A Stage is a sequenced capability block: outcomes → Missions (by category) → Evidence contribution → remediation → Unlock.

```text
Hierarchy (Scope §3.7): World → Horizon → Route → Stage → Mission → Evidence → Unlock
```

## Canonical Stage ID

```text
{ROUTE|CXW|SEX}-STG-NN
```

Examples: `RT-OPR-001-STG-01`, `CXW-001-STG-02`, `SEX-001-STG-01`.

Mission placeholders (1C expansion): `{STAGE}-MSN-NN`.

## Stage cardinality (launch Routes)

| Rule | Value |
|------|-------|
| Default launch Route Stage count | **5** (`STG-01` … `STG-05`) |
| Minimum meaningful Stage | Outcomes + ≥1 Mission category + Evidence contribution or remediation |
| Capstone Stage | Capstone is **not** a sixth Stage by default — Capstone is `{ROUTE}-CAP-01` after Stages |
| Optional Assessment / Evidence-prep Missions | Placed inside Stages via Mission categories, not as extra Stages unless justified |

Deviation from 5 Stages requires an Unresolved note and Change Control before 1D.

## Required Stage fields (in Route Stage table)

| Field | Requirement |
|-------|-------------|
| **Stage ID** | Canonical |
| **Title** | Working title; capability-focused |
| **Outcomes** | Observable “can do / can show” statements — not topic lists alone |
| **Mission categories** | One or more from Mission Category Registry; justify mix |
| **Evidence contribution** | Maps to `{ROUTE}-EVD-*` and/or Capstone eligibility |
| **Remediation** | What happens on failure / weak Evidence (Micro-Mission, RMD-*, retry, Nest refresh) |
| **Next Unlock** | Next Stage, ULK-*, Capstone eligibility flag, or graph edge note |

## Sequencing rules

1. **STG-01** should include **ORIENTATION** (and often **KNOWLEDGE**) unless a documented exception exists.  
2. Practice depth should generally progress: Guided → Independent → Laboratory / Scenario / Analysis as Horizon demands.  
3. **ASSESSMENT** and **EVIDENCE_PREPARATION** may appear mid- or late-Route; avoid quiz-only Capstone substitutes.  
4. **INTEGRATION** belongs primarily on Cross-Wing; host Routes may use light bridge Missions only.  
5. **LIVE_SKY_MISSION** / **TEAM_MISSION** are optional at launch Stage level — mark capacity risk if used.  
6. **REMEDIATION** category Missions are for recovery paths — not primary progression.  
7. **CAPSTONE** category is reserved for Capstone experiences — do not label ordinary Stage Missions as CAPSTONE.

## Unlock model (qualitative)

Stages unlock via Learning Graph concepts (`UNLOCKS`, `PREREQUISITE`) — **without** inventing XP or Mastery formulas.

| Pattern | Meaning |
|---------|---------|
| Sequential | STG-0N completion → STG-0(N+1) available |
| Evidence-gated | Named EVD anchor accepted → Capstone eligibility or Extension attach |
| Soft recommend | RECOMMENDED Stage parallel without hard block |
| Nest Micro-Mission insert | Guided Skip weakness refresh — does not rewrite Nest bands |

Exact numeric Mastery / Trust thresholds: **PENDING GHV.PROGRESSION.1**.

## Remediation model

| Trigger | Typical response |
|---------|------------------|
| Failed practice Mission | Retry with hints; optional GUIDED_PRACTICE refresh |
| Weak Evidence | Revision cycle + integrity checklist |
| Nest capability gap | Micro-Mission on required Nest caps (Scope Guided Skip) |
| Safety / ethics failure (PROTECT) | Hard stop; ethics remediation before continue |
| Tooling outage | Offline / LOCAL-SAFE alternate path where defined |

Remediation IDs use `RMD-{DOMAIN}-NNN` when named.

## Evidence contribution rules

- Every Stage MUST contribute to at least one Evidence anchor **or** explicitly prepare Capstone inputs.  
- Prefer visible artifacts over opaque scores.  
- AI-assist disclosure required where generative tools are allowed.  
- Secrets / PII never in submitted Evidence.

## Accessibility and offline

Each Stage design must note:

| Concern | Expectation |
|---------|-------------|
| **A11y** | Keyboard paths; captioned demos; structured forms; RTL-ready structure |
| **Offline** | Which Mission categories degrade gracefully (KNOWLEDGE / DOCUMENTATION high; CLOUD-SANDBOX labs low) |
| **Mobile** | Read/reflect often OK; console/coding often Watch |

## Safety by Horizon (Stage-level)

| Horizon | Stage safety emphasis |
|---------|----------------------|
| OPERATE | Quotas, no prod, redaction |
| BUILD | No real user PII; no secret commits |
| PROTECT | Scenario labs only; no offensive instructions |
| LEAD | Fictional orgs; no senior-title claims |
| ANALYZE | Synthetic data only |

## Stage review (feeds Route §33 table)

Before a Stage is marked **ARCHITECTURE OK**, reviewers confirm:

1. Outcomes are observable and scoped  
2. Mission categories fit registry use/inappropriate rules  
3. Evidence contribution is named  
4. Remediation path exists  
5. Next Unlock is coherent  
6. Safety / a11y / integrity Watch items are listed  
7. No Product Code; no XP formula; no employment promise  

## Relationship to Missions (1C)

LEARNING.1B stops at **category placement**. LEARNING.1C expands `{STAGE}-MSN-NN` blueprints, rubrics, and Evidence schemas.
