# RT-BLD-001 — Web Application Delivery Foundations

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-RT-BLD-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-ARCHITECTURE-STANDARD.md](../../architecture/ROUTE-ARCHITECTURE-STANDARD.md) · [STAGE-ARCHITECTURE-STANDARD.md](../../architecture/STAGE-ARCHITECTURE-STANDARD.md) · [MISSION-CATEGORY-REGISTRY.md](../../architecture/MISSION-CATEGORY-REGISTRY.md) · [LEARNING-IDENTIFIER-STANDARD.md](../../architecture/LEARNING-IDENTIFIER-STANDARD.md) · [NEST-DEPENDENCY-MAP.md](../../nest/NEST-DEPENDENCY-MAP.md) · [LAUNCH-CROSS-WING-STUDY.md](../../cross-wing/LAUNCH-CROSS-WING-STUDY.md) |
| **Source research** | RC-BLD-001 (GHV.LEARNING.1A) |
| **Limitations** | Working title; no Product Code; no XP formulas; does **not** duplicate CXW-001 secure delivery curriculum |
| **Unresolved** | Curated starter stack pin; Mission scripts (1C); 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1B architecture |

```text
ARCHITECTURE RECOMMENDED — PENDING 1D LOCK
Never final LOCKED in this Gate.
```

---

## Identity

| Field | Content |
|-------|---------|
| **Canonical ID** | **RT-BLD-001** |
| **Prior candidate ID** | RC-BLD-001 |
| **Working title** | Web Application Delivery Foundations |
| **Horizon** | HRZ-BLD (BUILD) |
| **Route type** | FOUNDATIONAL · BUILDING |
| **Capability statement** | Deliver a simple web application end-to-end with version control hygiene: establish delivery context and git habits, build accessible UI structure, connect client/server and basic APIs, test across environments, and document delivery with Evidence suitable for Capstone and later Cross-Wing secure delivery — without teaching the full CXW secure SDLC path here. |
| **Target learner** | Nest-ready learners aiming at web/frontend or junior full-stack pathways (scenario roles only) |

---

## Entry / Exit

| Field | Content |
|-------|---------|
| **Entry** | Nest readiness **≥ 50% path** (Guided Skip + Micro-Missions) **or** Nest complete / Ready to Fly — Scope §3.5 bands **unchanged**. HTML/CSS literacy or Nest bridge module still applies where defined. |
| **Exit** | All five Stages complete **and** required Evidence accepted **and** Capstone eligible (`RT-BLD-001-CAP-01`) |
| **Prerequisites** | Nest required caps (N-FIL · N-BRW · N-PWD · N-TSH · N-COL · N-AIL); HTML/CSS literacy or Nest bridge |
| **Corequisites** | None hard-required |
| **Recommended** | Scripting Micro-Missions / RT-BLD-002 concepts; N-ACC · N-PRV · N-IDN reviews |

---

## Stage table (5 Stages)

| Stage ID | Title | Outcomes | Mission categories | Evidence contribution | Remediation | Next Unlock |
|----------|-------|----------|--------------------|----------------------|-------------|-------------|
| **RT-BLD-001-STG-01** | Delivery context & git hygiene | Explain delivery map; init/clone safe workflow; commit with clear messages; avoid secret commits | ORIENTATION · KNOWLEDGE · GUIDED_PRACTICE · DOCUMENTATION | Feeds **EVD-01** repo habits | Git hygiene remediation; N-FIL Micro-Mission | Unlocks STG-02 |
| **RT-BLD-001-STG-02** | Accessible UI foundations | Structure semantic UI; apply basic accessible patterns; document a11y notes | KNOWLEDGE · GUIDED_PRACTICE · DESIGN · LABORATORY | **EVD-02** accessibility note | A11y checklist retry; guided UI refresh | Unlocks STG-03 |
| **RT-BLD-001-STG-03** | Client, server & API basics | Separate client/server concerns; call a simple API safely; handle basic errors | KNOWLEDGE · GUIDED_PRACTICE · LABORATORY · INDEPENDENT_PRACTICE | Supports EVD-01 + tests path | LOCAL-SAFE lab reset; guided API drill | Unlocks STG-04 |
| **RT-BLD-001-STG-04** | Testing & environments | Run basic tests; distinguish local vs preview env; record test Evidence | LABORATORY · INDEPENDENT_PRACTICE · ASSESSMENT · DOCUMENTATION | **EVD-03** tests | Test-failure remediation Mission | Unlocks STG-05 |
| **RT-BLD-001-STG-05** | Delivery & documentation | Ship to sandbox/preview; write delivery doc/README; prepare Evidence pack; disclose AI-assist | DOCUMENTATION · EVIDENCE_PREPARATION · INDEPENDENT_PRACTICE · ASSESSMENT | **EVD-04** delivery doc; Capstone eligibility | Pack revision cycle | Unlocks **RT-BLD-001-CAP-01**; CXW-001 *source readiness* (not CXW complete) |

---

## Evidence anchors

| ID | Title | Artifact class | Stage contribution | Integrity | Review |
|----|-------|----------------|--------------------|-----------|--------|
| **RT-BLD-001-EVD-01** | Repository Evidence | Repo / lab project + history | STG-01 · STG-03 | Unique feature seed; original commits | Checklist + smoke path |
| **RT-BLD-001-EVD-02** | Accessibility note | A11y observations + fixes | STG-02 | Tied to learner UI; not generic paste | Rubric: semantic + practical fixes |
| **RT-BLD-001-EVD-03** | Tests Evidence | Test output / checklist results | STG-04 | Re-runnable locally or in lab | Pass criteria clarity |
| **RT-BLD-001-EVD-04** | Delivery documentation | README / delivery note / preview link | STG-05 | Sandbox only; no real PII | Completeness + safety |

---

## Capstone

| Field | Content |
|-------|---------|
| **Capstone ID** | **RT-BLD-001-CAP-01** |
| **Eligibility** | STG-01…05 complete + EVD-01…04 accepted |
| **Concept** | Ship a small feature with PR/MR Evidence (CAP-BLD-001) — no full instructions here |
| **Output shape** | Working feature · repo history · PR Evidence · README · delivery note · AI disclosure |
| **Category** | CAPSTONE |

---

## Cross-Wing / Secure Extension links

| Link | Note |
|------|------|
| **CXW-001** | Secure Application Delivery uses RT-BLD-001 as a **source Route**. This architecture covers delivery foundations only — **do not duplicate** CXW secure SDLC / seeded AppSec integration here. |
| **SEX-001** | Not attached to BUILD host; optional later SEX-002 (post-launch alt) out of scope |
| **BRG-BLD-PRT** | Conceptual Bridge toward PROTECT awareness — expanded in Graph 1C |

---

## Tooling

| Field | Content |
|-------|---------|
| **Primary classes** | **LOCAL-SAFE** · CONTAINERIZED · BROWSER-ONLY preview |
| **Vendor posture** | OSS-first; avoid proprietary IDE hard deps |
| **Avoid** | Device farms; paid IDE locks; live exploit targets |

---

## Safety

- No real user PII in demos  
- No credential commits  
- Dependency allowlist mindset  
- Sandbox previews only  
- AI-assist disclosure required on code Evidence  

---

## Arabic-first

| Field | Content |
|-------|---------|
| **Feasibility** | High |
| **Notes** | Arabic-first narratives; RTL UI patterns as learning content; English retained for code/APIs; bidi editor guidance |

---

## Freshness

| Class | Areas |
|-------|-------|
| **Stable** | Git hygiene, accessibility principles, delivery documentation |
| **Slow-changing** | Client/server separation, HTTP basics |
| **Fast** | Framework/tooling slices — keep thin; pin starter stack versions |

---

## Expert review

| Type | Need |
|------|------|
| Web engineering SME | Stage scope vs fullstack creep |
| Accessibility specialist | EVD-02 criteria |
| Arabic instructional | Builder glossary |
| Security liaison | Ensure no CXW duplication; secret-hygiene only |

---

## Route-Proven (qualitative)

Proven when learners ship sandbox features with inspectable repos, meaningful a11y notes, re-runnable basic tests, and delivery docs — without secret leaks — **qualitative only**.

---

## Unresolved

1. Exact starter stack pin (1C/1D)  
2. Preview hosting cost caps  
3. CXW Integration Readiness numeric thresholds (PROGRESSION.1)  
4. Mission scripts (1C)  
5. 1D lock  

---

## Stage review table (Gate §33)

| Stage ID | Outcomes clarity | Category fit | Evidence contribution | Remediation path | Unlock coherence | Safety | A11y | Integrity | Offline / tooling | Reviewer | Verdict |
|----------|------------------|--------------|----------------------|------------------|------------------|--------|------|-----------|-------------------|----------|---------|
| STG-01 | Clear | OK | EVD-01 | Defined | OK | Pass | Pass | Pass | High LOCAL-SAFE | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-02 | Clear | OK | EVD-02 | Defined | OK | Pass | Pass | Pass | High | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-03 | Clear | OK | Mapped | Defined | OK | Pass | Watch (DevTools) | Pass | LOCAL-SAFE | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-04 | Clear | OK | EVD-03 | Defined | OK | Pass | Pass | Pass | Med | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-05 | Clear | OK | EVD-04 | Defined | OK | Pass | Pass | Pass | Med (preview) | Founder (RAVEN) | **ARCHITECTURE OK** |

**§33 aggregate:** Stage count **5/5** · All Stages **ARCHITECTURE OK** · Route status **ARCHITECTURE RECOMMENDED — PENDING 1D LOCK** (not LOCKED).
