# Mission Modality Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-MOD-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [MISSION-BLUEPRINT-STANDARD.md](./MISSION-BLUEPRINT-STANDARD.md) · [LEARNING-INTENSITY-MODEL.md](./LEARNING-INTENSITY-MODEL.md) · [MISSION-CATEGORY-REGISTRY.md](../architecture/MISSION-CATEGORY-REGISTRY.md) · [ARABIC-FIRST-LEARNING-FEASIBILITY.md](../research/ARABIC-FIRST-LEARNING-FEASIBILITY.md) |
| **Scope classification** | CONTROLLED LAUNCH |
| **Supporting sources** | SRC-003 · SRC-010 · SRC-011 · SRC-015 |
| **Expert review** | NOT RUN |
| **Pilot status** | NOT RUN |
| **Unresolved dependencies** | Live Sky facilitation staffing; container / cloud-sandbox Spike outcomes; bilingual technical glossary freeze |
| **Limitations** | Modality guidance only — no UI implementation; no forced learning-style quiz; no Product Code |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Mission Modality Matrix |

## Purpose

Define **supported learning modalities** and the **columns every Mission Blueprint must fill** for primary delivery, accessible alternatives, mobile limits, offline suitability, and device assumptions.

```text
Do not require one learning-style declaration from the user.
Expert review: NOT RUN. Pilot: NOT RUN.
```

---

## Supported modalities (§12)

| Modality ID | Description |
|-------------|-------------|
| **ARABIC_FIRST_WRITTEN** | Arabic-first written explanation with clear structure |
| **BILINGUAL_TECH_REF** | Bilingual technical reference (terms preserved where needed) |
| **VISUALIZATION** | Diagrams / charts with text alternatives |
| **GUIDED_DEMONSTRATION** | Step-along demo (captioned where media) |
| **INTERACTIVE_SCENARIO** | Bounded narrative with decisions |
| **BROWSER_SAFE_PRACTICE** | Practice in browser-safe / sandbox UI |
| **LOCAL_SAFE_PRACTICE** | Local-safe practice on learner device |
| **CONTAINERIZED_LAB_CONCEPT** | Conceptual containerized lab (blueprint; not executable product code in 1C) |
| **CLOUD_SANDBOX_CONCEPT** | Conceptual cloud sandbox with quotas / egress controls |
| **PEER_DISCUSSION** | Structured peer discussion |
| **TEAM_MISSION** | Coordinated Team Mission |
| **LIVE_SKY_MISSION** | Facilitated Live Sky Mission |
| **PROJECT_WORK** | Multi-step project toward an artifact |
| **EVIDENCE_REVIEW** | Review / self-check / portfolio preparation |

---

## Required Blueprint columns

For **every** Mission Blueprint, identify:

| Column | Guidance |
|--------|----------|
| **Primary modality** | One primary modality ID (may note secondary) |
| **Alternative accessible modality** | Equivalent path for a11y / device limits (must preserve capability claim where feasible) |
| **Mobile limitations** | What fails or degrades on phone / small tablet |
| **Offline suitability** | High · Med · Low — and what pack must be downloadable |
| **Required device assumptions** | Keyboard, storage, browser class, OS notes — no premium hardware mandate without fallback |

Optional notes: bandwidth sensitivity; RTL layout; caption / transcript needs.

---

## Matrix guidance by Mission category (summary)

| Category | Primary (typical) | Alt accessible | Mobile | Offline |
|----------|-------------------|----------------|--------|---------|
| ORIENTATION | ARABIC_FIRST_WRITTEN | BILINGUAL_TECH_REF | Low limit | High |
| KNOWLEDGE | ARABIC_FIRST_WRITTEN / VISUALIZATION | Text + glossary | Low–Med | High |
| SCENARIO | INTERACTIVE_SCENARIO | Written scenario pack | Med | Med–High |
| GUIDED_PRACTICE | GUIDED_DEMONSTRATION + BROWSER_SAFE | Text checklist | Med–High limits | Med |
| INDEPENDENT_PRACTICE | PROJECT_WORK / LOCAL_SAFE | Written lab sheet | High limits | Med |
| LABORATORY | CONTAINERIZED / CLOUD_SANDBOX concept | LOCAL_SAFE fallback | High limits | Low–Med |
| ANALYSIS | PROJECT_WORK + VISUALIZATION | Tabular + text interpretation | Med | Med–High |
| TROUBLESHOOTING | INTERACTIVE_SCENARIO + PROJECT_WORK | Structured RCA form | Med | Med |
| DESIGN | PROJECT_WORK | Template + written rationale | Low–Med | High |
| DOCUMENTATION | ARABIC_FIRST_WRITTEN | BILINGUAL_TECH_REF | Low | High |
| ASSESSMENT | Scenario / practical form | Oral/recorded **with** accessible alternative | Varies | Varies |
| EVIDENCE_PREPARATION | EVIDENCE_REVIEW | Checklist + redaction guide | Low–Med | High |
| TEAM_MISSION | TEAM_MISSION | Documented async contribution path | Med | Low–Med |
| LIVE_SKY_MISSION | LIVE_SKY_MISSION | Recorded / async equivalent where policy allows | High limits | Low |
| REMEDIATION | Targeted practice modality | Same as primary with more scaffolding | As primary | As primary |
| INTEGRATION | PROJECT_WORK + EVIDENCE_REVIEW | Split contribution packs | Med–High | Med |
| CAPSTONE | PROJECT_WORK | Phased checkpoints + written brief | High limits | Med |

---

## Binding rules

1. **No single learning-style declaration** is required from the learner.
2. Primary modality must not be the only path when an accessible alternative is feasible.
3. Cloud / container modalities remain **concepts** in 1C — no executable lab Product Code.
4. PROTECT / security scenarios stay **defensive and synthetic**.
5. Live Sky and Team modalities must link contribution Evidence rules ([TEAM-CONTRIBUTION-EVIDENCE.md](../evidence/TEAM-CONTRIBUTION-EVIDENCE.md)).

## Explicit non-goals

* No forced VARK / learning-style quiz.
* No UI wireframes as modality locks.
* No claim that offline equals equal lab fidelity.
