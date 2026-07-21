# RT-BLD-001 — Mission Blueprint Pack

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-MSN-BLD-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE BLUEPRINT / BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Date** | 2026-07-21 |
| **Route** | [RT-BLD-001-WEB-APPLICATION-DELIVERY.md](../../routes/architecture/RT-BLD-001-WEB-APPLICATION-DELIVERY.md) |
| **Related** | [MISSION-CATEGORY-REGISTRY.md](../../architecture/MISSION-CATEGORY-REGISTRY.md) · [EVIDENCE-ANCHOR-REGISTRY.md](../../evidence/EVIDENCE-ANCHOR-REGISTRY.md) · [RT-BLD-001-EVIDENCE-RUBRICS.md](../../evidence/rubrics/RT-BLD-001-EVIDENCE-RUBRICS.md) · [RT-BLD-001-CAPSTONE-BLUEPRINT.md](../../capstones/RT-BLD-001-CAPSTONE-BLUEPRINT.md) |
| **Limitations** | Blueprints only — **no full lesson scripts**; **no XP**; **framework-neutral**; not catalogue-LOCKED |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Mission blueprint pack |

```text
STATUS: BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW
Expert review: NOT RUN · Pilot: NOT RUN
No XP · No full lessons · No LOCKED · No offensive content
Framework-neutral · Exact Mission count: 14
```

## Purpose

Expand RT-BLD-001 Stage architecture into **14 Mission Blueprints** covering the delivery lifecycle from git hygiene through accessible UI, client/server & API, testing, config/deps, deploy, monitoring/feedback, and documentation — without duplicating CXW-001 secure SDLC.

## AI policy (pack default)

| Policy category | Use |
|-----------------|-----|
| **PERMITTED_WITH_DISCLOSURE** | Drafts of README, a11y notes, delivery docs; mandatory AI disclosure on code Evidence |
| **PERMITTED_WITH_OUTPUT_VERIFICATION** | Suggested code/commands; learner verifies by running locally/lab |
| **Learner execution required** | All GUIDED · LABORATORY · INDEPENDENT · Capstone practical work |

Assessments: clarification allowed; submissions must be learner-owned with unique feature seed.

## Route Mission Map

| # | Mission ID | Title | Stage / Cap | Category | Intensity | Evidence |
|---|------------|-------|-------------|----------|-----------|----------|
| 1 | RT-BLD-001-STG-01-MSN-01 | Delivery map & workspace orient | STG-01 | ORIENTATION | LIGHT | → EVD-01 |
| 2 | RT-BLD-001-STG-01-MSN-02 | Git hygiene walkthrough | STG-01 | GUIDED_PRACTICE | STANDARD | → **EVD-01** |
| 3 | RT-BLD-001-STG-01-ASM-01 | Stage 01 assessment | STG-01 | ASSESSMENT | LIGHT | Stage gate |
| 4 | RT-BLD-001-STG-02-MSN-01 | Semantic accessible UI design | STG-02 | DESIGN | STANDARD | → **EVD-02** |
| 5 | RT-BLD-001-STG-02-MSN-02 | Apply & document a11y patterns | STG-02 | LABORATORY | STANDARD | **EVD-02** |
| 6 | RT-BLD-001-STG-02-ASM-01 | Stage 02 assessment | STG-02 | ASSESSMENT | LIGHT | Stage gate |
| 7 | RT-BLD-001-STG-03-MSN-01 | Client, server & safe API call | STG-03 | LABORATORY | DEEP | → EVD-01 |
| 8 | RT-BLD-001-STG-03-MSN-02 | Config, deps & error scenario | STG-03 | SCENARIO | STANDARD | → EVD-01 |
| 9 | RT-BLD-001-STG-03-ASM-01 | Stage 03 assessment | STG-03 | ASSESSMENT | LIGHT | Stage gate |
| 10 | RT-BLD-001-STG-04-MSN-01 | Basic tests across environments | STG-04 | LABORATORY | STANDARD | **EVD-03** |
| 11 | RT-BLD-001-STG-04-ASM-01 | Stage 04 assessment | STG-04 | ASSESSMENT | LIGHT | Stage gate |
| 12 | RT-BLD-001-STG-05-MSN-01 | Ship preview & delivery docs | STG-05 | DOCUMENTATION | STANDARD | **EVD-04** |
| 13 | RT-BLD-001-STG-05-EPM-01 | Evidence pack & AI disclosure | STG-05 | EVIDENCE_PREPARATION | STANDARD | EVD-01…04 |
| 14 | RT-BLD-001-CAP-01-MSN-01 | Ship the small accessible feature | CAP-01 | CAPSTONE | DEEP | **CAP-01** |

**Exact Mission count: 14.**

## Stage-by-Stage table

| Stage | Missions | Outcomes focus | Evidence contribution |
|-------|----------|----------------|----------------------|
| **STG-01** | MSN-01 · MSN-02 · ASM-01 | Delivery map; init/clone; commits; no secret commits | Feeds **EVD-01** |
| **STG-02** | MSN-01 · MSN-02 · ASM-01 | Semantic UI; accessible patterns; a11y notes | **EVD-02** |
| **STG-03** | MSN-01 · MSN-02 · ASM-01 | Client/server; API; config/deps; basic errors | Supports EVD-01 + tests path |
| **STG-04** | MSN-01 · ASM-01 | Basic tests; local vs preview; test Evidence | **EVD-03** |
| **STG-05** | MSN-01 · EPM-01 | Sandbox deploy; monitoring/feedback note; README; Evidence pack | **EVD-04**; Cap eligibility |
| **CAP-01** | CAP-01-MSN-01 | Deliver small accessible web product with PR/MR Evidence | Capstone pack |

---

## Mission Blueprints

### 1) RT-BLD-001-STG-01-MSN-01 — Delivery map & workspace orient

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-STG-01-MSN-01 |
| **Title** | Delivery map & workspace orient |
| **Stage** | RT-BLD-001-STG-01 |
| **Category** | ORIENTATION |
| **Capability outcomes** | Explain the delivery map (repo → build → preview → Evidence); state secret-hygiene and AI-disclosure norms |
| **Brief** | Orient to LOCAL-SAFE / container / browser-preview tooling and Route safety rules before git practice |
| **Actions** | Read delivery map; complete orientation checklist; note workspace setup |
| **Output** | Orientation checklist + delivery-map sketch |
| **Evidence** | Feeds EVD-01 habits |
| **Assessment** | Checklist complete; secret-hygiene acknowledged |
| **Remediation** | Retry ORIENTATION; N-FIL Micro-Mission if needed |
| **AI policy** | PERMITTED_WITH_DISCLOSURE |
| **Intensity** | LIGHT |
| **Modality** | Browser/docs |
| **Safety / privacy** | No real PII; no credential commits |
| **Arabic-first** | Arabic narrative; English tool/git terms retained |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-BLD pending |

### 2) RT-BLD-001-STG-01-MSN-02 — Git hygiene walkthrough

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-STG-01-MSN-02 |
| **Title** | Git hygiene walkthrough |
| **Stage** | RT-BLD-001-STG-01 |
| **Category** | GUIDED_PRACTICE |
| **Capability outcomes** | Init/clone safely; commit with clear messages; avoid secret commits; produce inspectable history |
| **Brief** | Guided git workflow on a framework-neutral starter seed; unique lab feature seed assigned |
| **Actions** | Clone/init; make seeded change; commit with clear message; verify no secrets; learner executes |
| **Output** | Repo snapshot / history excerpt with seed ID |
| **Evidence** | Feeds **RT-BLD-001-EVD-01** |
| **Assessment** | Clear commits; no secrets; seed present |
| **Remediation** | Git hygiene remediation Mission |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION — **learner must execute** |
| **Intensity** | STANDARD |
| **Modality** | LOCAL-SAFE git |
| **Safety / privacy** | Secret scan mindset; no production remotes required |
| **Arabic-first** | Arabic coaching; English git commands |
| **Reviewer** | Founder (RAVEN) — blueprint |

### 3) RT-BLD-001-STG-01-ASM-01 — Stage 01 assessment

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-STG-01-ASM-01 |
| **Title** | Stage 01 assessment |
| **Stage** | RT-BLD-001-STG-01 |
| **Category** | ASSESSMENT |
| **Capability outcomes** | Confirm delivery-context and git hygiene outcomes |
| **Brief** | Stage gate with artifact citation to repo history |
| **Actions** | Complete items; cite commit IDs / seed |
| **Output** | Assessment record |
| **Evidence** | Stage gate |
| **Assessment** | Pass on hygiene + delivery-map literacy |
| **Remediation** | GUIDED git retry |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION |
| **Intensity** | LIGHT |
| **Modality** | Form |
| **Safety / privacy** | Reject secret-bearing pastes |
| **Arabic-first** | Arabic items |
| **Reviewer** | Founder (RAVEN) — blueprint |

### 4) RT-BLD-001-STG-02-MSN-01 — Semantic accessible UI design

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-STG-02-MSN-01 |
| **Title** | Semantic accessible UI design |
| **Stage** | RT-BLD-001-STG-02 |
| **Category** | DESIGN |
| **Capability outcomes** | Structure semantic UI; choose basic accessible patterns under constraints; note RTL awareness |
| **Brief** | Design Mission: plan page structure (landmarks, headings, labels) for a small feature — framework-neutral |
| **Actions** | Produce structure plan; list a11y patterns to apply; note rejected alternatives |
| **Output** | UI structure / a11y design note |
| **Evidence** | Feeds **EVD-02** |
| **Assessment** | Semantic intent + practical pattern list |
| **Remediation** | Guided UI refresh |
| **AI policy** | PERMITTED_WITH_DISCLOSURE |
| **Intensity** | STANDARD |
| **Modality** | Docs / wire-text (offline-capable) |
| **Safety / privacy** | No real user data in mock content |
| **Arabic-first** | RTL patterns as learning content; Arabic design note |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-A11Y pending |

### 5) RT-BLD-001-STG-02-MSN-02 — Apply & document a11y patterns

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-STG-02-MSN-02 |
| **Title** | Apply & document a11y patterns |
| **Stage** | RT-BLD-001-STG-02 |
| **Category** | LABORATORY |
| **Capability outcomes** | Apply basic accessible patterns in the lab UI; document observations and fixes |
| **Brief** | Hands-on lab producing **RT-BLD-001-EVD-02** Accessibility note tied to learner UI (not generic paste) |
| **Actions** | Implement planned structure; run basic a11y checklist; document fixes; learner executes |
| **Output** | Accessibility note + before/after observations (**EVD-02**) |
| **Evidence** | **RT-BLD-001-EVD-02** |
| **Assessment** | Rubric: semantic + practical fixes |
| **Remediation** | A11y checklist retry |
| **AI policy** | PERMITTED_WITH_DISCLOSURE + OUTPUT_VERIFICATION — **learner must execute** |
| **Intensity** | STANDARD |
| **Modality** | LOCAL-SAFE UI lab |
| **Safety / privacy** | Synthetic content only |
| **Arabic-first** | Arabic a11y note template; code in English |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-A11Y pending |

### 6) RT-BLD-001-STG-02-ASM-01 — Stage 02 assessment

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-STG-02-ASM-01 |
| **Title** | Stage 02 assessment |
| **Stage** | RT-BLD-001-STG-02 |
| **Category** | ASSESSMENT |
| **Capability outcomes** | Confirm accessible UI foundation outcomes |
| **Brief** | Stage gate citing EVD-02 draft |
| **Actions** | Complete items; cite a11y note |
| **Output** | Assessment record |
| **Evidence** | Stage gate |
| **Assessment** | Pass on semantic + practical literacy |
| **Remediation** | DESIGN + LAB retry |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION |
| **Intensity** | LIGHT |
| **Modality** | Form |
| **Safety / privacy** | N/A beyond lab norms |
| **Arabic-first** | Arabic items |
| **Reviewer** | Founder (RAVEN) — blueprint |

### 7) RT-BLD-001-STG-03-MSN-01 — Client, server & safe API call

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-STG-03-MSN-01 |
| **Title** | Client, server & safe API call |
| **Stage** | RT-BLD-001-STG-03 |
| **Category** | LABORATORY |
| **Capability outcomes** | Separate client/server concerns; call a simple API safely; handle basic errors |
| **Brief** | Framework-neutral lab: wire a minimal client to a lab API; show error handling; extend EVD-01 repo |
| **Actions** | Implement call path; handle basic failure; commit with clear message; learner executes |
| **Output** | Working lab delta + short client/server note |
| **Evidence** | Supports **EVD-01** |
| **Assessment** | Separation clarity + safe error handling |
| **Remediation** | LOCAL-SAFE reset; guided API drill |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION — **learner must execute** |
| **Intensity** | DEEP |
| **Modality** | LOCAL-SAFE / CONTAINERIZED |
| **Safety / privacy** | Lab API only; no real secrets in client |
| **Arabic-first** | Arabic explanation note; English APIs/code |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-BLD pending |

### 8) RT-BLD-001-STG-03-MSN-02 — Config, deps & error scenario

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-STG-03-MSN-02 |
| **Title** | Config, deps & error scenario |
| **Stage** | RT-BLD-001-STG-03 |
| **Category** | SCENARIO |
| **Capability outcomes** | Reason about config vs code; dependency allowlist mindset; choose safe response to a seeded error/config fault |
| **Brief** | Scenario pack: misconfig / dependency risk / API error — decide fix approach without CXW AppSec depth |
| **Actions** | Read seed; choose response; document trade-offs; note what belongs in config vs code |
| **Output** | Scenario decision note (seed ID) |
| **Evidence** | Supports EVD-01 integrity narrative |
| **Assessment** | Constraint fidelity + safety of chosen fix |
| **Remediation** | New seed retry |
| **AI policy** | PERMITTED_WITH_DISCLOSURE |
| **Intensity** | STANDARD |
| **Modality** | Scenario packet |
| **Safety / privacy** | Synthetic; no live exploit targets |
| **Arabic-first** | Arabic decision form |
| **Reviewer** | Founder (RAVEN) — blueprint |

### 9) RT-BLD-001-STG-03-ASM-01 — Stage 03 assessment

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-STG-03-ASM-01 |
| **Title** | Stage 03 assessment |
| **Stage** | RT-BLD-001-STG-03 |
| **Category** | ASSESSMENT |
| **Capability outcomes** | Confirm client/server/API and config/deps literacy |
| **Brief** | Stage gate with lab + scenario citations |
| **Actions** | Complete items; cite commits / scenario note |
| **Output** | Assessment record |
| **Evidence** | Stage gate |
| **Assessment** | Pass on separation + safe API handling |
| **Remediation** | Guided API drill |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION |
| **Intensity** | LIGHT |
| **Modality** | Form |
| **Safety / privacy** | Lab-only references |
| **Arabic-first** | Arabic items |
| **Reviewer** | Founder (RAVEN) — blueprint |

### 10) RT-BLD-001-STG-04-MSN-01 — Basic tests across environments

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-STG-04-MSN-01 |
| **Title** | Basic tests across environments |
| **Stage** | RT-BLD-001-STG-04 |
| **Category** | LABORATORY |
| **Capability outcomes** | Run basic tests; distinguish local vs preview env; record re-runnable test Evidence |
| **Brief** | Lab producing **RT-BLD-001-EVD-03** Tests Evidence — framework-neutral test runner / checklist path |
| **Actions** | Run tests locally; note env differences; capture output/checklist; learner executes |
| **Output** | Test output / checklist results (**EVD-03**) |
| **Evidence** | **RT-BLD-001-EVD-03** |
| **Assessment** | Re-runnable; pass criteria clear |
| **Remediation** | Test-failure remediation Mission |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION — **learner must execute** |
| **Intensity** | STANDARD |
| **Modality** | LOCAL-SAFE; optional preview |
| **Safety / privacy** | No production deploy |
| **Arabic-first** | Arabic test Evidence cover note |
| **Reviewer** | Founder (RAVEN) — blueprint |

### 11) RT-BLD-001-STG-04-ASM-01 — Stage 04 assessment

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-STG-04-ASM-01 |
| **Title** | Stage 04 assessment |
| **Stage** | RT-BLD-001-STG-04 |
| **Category** | ASSESSMENT |
| **Capability outcomes** | Confirm testing & environment outcomes |
| **Brief** | Stage gate citing EVD-03 |
| **Actions** | Complete items; cite test Evidence |
| **Output** | Assessment record |
| **Evidence** | Stage gate |
| **Assessment** | Pass on env literacy + test Evidence presence |
| **Remediation** | LAB retry |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION |
| **Intensity** | LIGHT |
| **Modality** | Form |
| **Safety / privacy** | N/A beyond lab norms |
| **Arabic-first** | Arabic items |
| **Reviewer** | Founder (RAVEN) — blueprint |

### 12) RT-BLD-001-STG-05-MSN-01 — Ship preview & delivery docs

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-STG-05-MSN-01 |
| **Title** | Ship preview & delivery docs |
| **Stage** | RT-BLD-001-STG-05 |
| **Category** | DOCUMENTATION |
| **Capability outcomes** | Ship to sandbox/preview; write README/delivery note; note basic monitoring/feedback signals for the preview |
| **Brief** | Produce **RT-BLD-001-EVD-04** Delivery documentation with preview link (sandbox) and short feedback/monitoring note — no CXW release gate |
| **Actions** | Deploy to allowed preview; write README/delivery note; record how you'd notice breakage (basic feedback); disclose AI |
| **Output** | README / delivery note / preview link (**EVD-04**) |
| **Evidence** | **RT-BLD-001-EVD-04** |
| **Assessment** | Completeness + safety (no PII/secrets) |
| **Remediation** | Pack revision cycle |
| **AI policy** | PERMITTED_WITH_DISCLOSURE |
| **Intensity** | STANDARD |
| **Modality** | BROWSER-ONLY preview + docs |
| **Safety / privacy** | Sandbox only; no real PII |
| **Arabic-first** | Arabic delivery note; English README sections allowed |
| **Reviewer** | Founder (RAVEN) — blueprint |

### 13) RT-BLD-001-STG-05-EPM-01 — Evidence pack & AI disclosure

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-STG-05-EPM-01 |
| **Title** | Evidence pack & AI disclosure |
| **Stage** | RT-BLD-001-STG-05 |
| **Category** | EVIDENCE_PREPARATION |
| **Capability outcomes** | Package EVD-01…04; complete AI disclosure; prepare Capstone eligibility pack |
| **Brief** | Evidence prep: assemble repo · a11y · tests · delivery docs; verify integrity checklist |
| **Actions** | Assemble pack; redaction/secret scan; AI disclosure; Capstone readiness checklist |
| **Output** | Linked Evidence pack (EVD-01…04) + disclosure |
| **Evidence** | EVD-01 · EVD-02 · EVD-03 · EVD-04 |
| **Assessment** | Pack completeness + disclosure present |
| **Remediation** | Pack revision cycle |
| **AI policy** | PERMITTED_WITH_DISCLOSURE |
| **Intensity** | STANDARD |
| **Modality** | Templates / checklists |
| **Safety / privacy** | Exclude `node_modules`; strip secrets |
| **Arabic-first** | Arabic pack cover sheet |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-INT pending |

### 14) RT-BLD-001-CAP-01-MSN-01 — Ship the small accessible feature

| Field | Content |
|-------|---------|
| **ID** | RT-BLD-001-CAP-01-MSN-01 |
| **Title** | Ship the small accessible feature |
| **Stage / Capstone** | Linked to **RT-BLD-001-CAP-01** |
| **Category** | CAPSTONE |
| **Capability outcomes** | Deliver a small accessible web product/feature end-to-end with inspectable Evidence |
| **Brief** | Capstone Mission: ship scoped feature with PR/MR Evidence, tests, README, delivery note, AI disclosure. Full blueprint: [RT-BLD-001-CAPSTONE-BLUEPRINT.md](../../capstones/RT-BLD-001-CAPSTONE-BLUEPRINT.md) |
| **Actions** | Confirm eligibility (STG-01…05 + EVD-01…04); implement unique seed feature; open PR/MR equivalent; assemble Capstone pack; learner executes |
| **Output** | Working feature · repo history · PR Evidence · README · delivery note · AI disclosure |
| **Evidence** | **RT-BLD-001-CAP-01** |
| **Assessment** | Capstone rubric (completeness, clarity, basic quality, a11y) — expert review pending |
| **Remediation** | Capstone resubmit with new seed if integrity fail |
| **AI policy** | PERMITTED_WITH_DISCLOSURE + OUTPUT_VERIFICATION — **learner must execute** |
| **Intensity** | DEEP |
| **Modality** | LOCAL-SAFE + sandbox preview |
| **Safety / privacy** | No real PII; no credential commits; dependency allowlist mindset |
| **Arabic-first** | Arabic Capstone narrative; code English; RTL demo encouraged |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-BLD · EXP-A11Y · EXP-INT · Pilot **NOT RUN** |

---

## Category coverage check

| Required | Present |
|----------|---------|
| ORIENTATION | STG-01-MSN-01 |
| SCENARIO | STG-03-MSN-02 |
| ≥2 practical (GUIDED/INDEPENDENT/LAB) | STG-01-MSN-02 · STG-02-MSN-02 · STG-03-MSN-01 · STG-04-MSN-01 |
| TROUBLESHOOTING / ANALYSIS / DESIGN | STG-02-MSN-01 (DESIGN) |
| DOCUMENTATION | STG-05-MSN-01 |
| Stage ASSESSMENT (`*-ASM-01`) | STG-01…04 ASM-01 |
| EVIDENCE_PREPARATION | STG-05-EPM-01 |
| CAPSTONE | CAP-01-MSN-01 |

## Topic coverage check

Delivery lifecycle · git · a11y UI · client/server · API · testing · config · deps · deploy · monitoring/feedback · docs — **covered** across Missions 1–14.

## Explicit non-goals

- No XP / Mastery formulas  
- No full lesson scripts  
- No single-framework lock (framework-neutral)  
- No CXW-001 secure SDLC duplication  
- No LOCKED / PUBLISHED claim  
- No offensive content  

## Unresolved (handoff)

1. Starter stack pin (versions)  
2. Exact Mission scripts / bilingual banks  
3. Expert review (EXP-BLD · EXP-A11Y · EXP-ID · EXP-INT · EXP-AR)  
4. Pilot run  
5. Preview hosting cost caps  
6. GHV.LEARNING.1D catalogue lock  
