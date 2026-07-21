# RT-OPR-001 — Mission Blueprint Pack

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-MSN-OPR-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE BLUEPRINT / BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Date** | 2026-07-21 |
| **Route** | [RT-OPR-001-CLOUD-SYSTEMS-OPERATIONS.md](../../routes/architecture/RT-OPR-001-CLOUD-SYSTEMS-OPERATIONS.md) |
| **Related** | [MISSION-CATEGORY-REGISTRY.md](../../architecture/MISSION-CATEGORY-REGISTRY.md) · [EVIDENCE-ANCHOR-REGISTRY.md](../../evidence/EVIDENCE-ANCHOR-REGISTRY.md) · [RT-OPR-001-EVIDENCE-RUBRICS.md](../../evidence/rubrics/RT-OPR-001-EVIDENCE-RUBRICS.md) · [RT-OPR-001-CAPSTONE-BLUEPRINT.md](../../capstones/RT-OPR-001-CAPSTONE-BLUEPRINT.md) |
| **Limitations** | Blueprints only — **no full lesson scripts**; **no XP**; **no Product Code**; not catalogue-LOCKED |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Mission blueprint pack |

```text
STATUS: BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW
Expert review: NOT RUN · Pilot: NOT RUN
No XP · No full lessons · No LOCKED · No offensive content
Exact Mission count: 14
```

## Purpose

Expand RT-OPR-001 Stage architecture into **14 Mission Blueprints** (Stages STG-01…05 + Capstone). Missions define capability outcomes, modality, Evidence links, AI policy, and safety — not step-by-step lessons.

## AI policy (pack default)

| Policy category | Use |
|-----------------|-----|
| **PERMITTED_WITH_DISCLOSURE** | Explanations, drafts of notes/runbooks; learner must disclose AI assist |
| **PERMITTED_WITH_OUTPUT_VERIFICATION** | Suggested commands/configs; learner must verify against live lab output |
| **Learner execution required** | All GUIDED_PRACTICE · LABORATORY · INDEPENDENT_PRACTICE · Capstone practical work — AI may advise, **not** substitute lab execution |

Assessments: AI may clarify terms; **answers and lab proof must be learner-owned**.

## Route Mission Map

| # | Mission ID | Title | Stage / Cap | Category | Intensity | Evidence |
|---|------------|-------|-------------|----------|-----------|----------|
| 1 | RT-OPR-001-STG-01-MSN-01 | Orient the lab & shared responsibility | STG-01 | ORIENTATION | LIGHT | → EVD-03 context |
| 2 | RT-OPR-001-STG-01-MSN-02 | Who owns the fault? | STG-01 | SCENARIO | STANDARD | → EVD-03 context |
| 3 | RT-OPR-001-STG-01-ASM-01 | Stage 01 assessment | STG-01 | ASSESSMENT | LIGHT | Stage gate |
| 4 | RT-OPR-001-STG-02-MSN-01 | CLI & OS operator walkthrough | STG-02 | GUIDED_PRACTICE | STANDARD | → EVD-01/02 method |
| 5 | RT-OPR-001-STG-02-MSN-02 | Inspect resources (read-only) | STG-02 | LABORATORY | STANDARD | → EVD-01 support |
| 6 | RT-OPR-001-STG-02-ASM-01 | Stage 02 assessment | STG-02 | ASSESSMENT | LIGHT | Stage gate |
| 7 | RT-OPR-001-STG-03-MSN-01 | Networking symptoms vs app failure | STG-03 | TROUBLESHOOTING | STANDARD | → EVD-02 |
| 8 | RT-OPR-001-STG-03-ASM-01 | Stage 03 assessment | STG-03 | ASSESSMENT | LIGHT | Stage gate |
| 9 | RT-OPR-001-STG-04-MSN-01 | Guardrailed resources & IAM hygiene | STG-04 | LABORATORY | DEEP | → EVD-01 |
| 10 | RT-OPR-001-STG-04-MSN-02 | Sanitize & snapshot config | STG-04 | DOCUMENTATION | STANDARD | **EVD-01** |
| 11 | RT-OPR-001-STG-04-ASM-01 | Stage 04 assessment | STG-04 | ASSESSMENT | LIGHT | Stage gate |
| 12 | RT-OPR-001-STG-05-MSN-01 | Degraded service: observe, change, recover | STG-05 | TROUBLESHOOTING | DEEP | **EVD-02** |
| 13 | RT-OPR-001-STG-05-EPM-01 | Runbook pack & handoff prep | STG-05 | EVIDENCE_PREPARATION | STANDARD | **EVD-02** · **EVD-03** |
| 14 | RT-OPR-001-CAP-01-MSN-01 | Stabilize the sandbox | CAP-01 | CAPSTONE | DEEP | **CAP-01** pack |

**Exact Mission count: 14.**

## Stage-by-Stage table

| Stage | Missions | Outcomes focus | Evidence contribution |
|-------|----------|----------------|----------------------|
| **STG-01** | MSN-01 · MSN-02 · ASM-01 | Shared responsibility; lab safety; environment map | Context notes toward EVD-03 |
| **STG-02** | MSN-01 · MSN-02 · ASM-01 | Safe CLI/OS; read-only inspect; command summaries | Method trails for EVD-01/02 |
| **STG-03** | MSN-01 · ASM-01 | Connectivity vs app; DNS/path literacy | Feeds EVD-02 |
| **STG-04** | MSN-01 · MSN-02 · ASM-01 | Provision within guardrails; least-privilege habits; sanitized config | **EVD-01** primary |
| **STG-05** | MSN-01 · EPM-01 | Monitoring; safe change; recovery reasoning; runbook/handoff | **EVD-02** · **EVD-03**; Cap eligibility |
| **CAP-01** | CAP-01-MSN-01 | Stabilize controlled env with documented operate-recover | Capstone Evidence pack |

---

## Mission Blueprints

### 1) RT-OPR-001-STG-01-MSN-01 — Orient the lab & shared responsibility

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-STG-01-MSN-01 |
| **Title** | Orient the lab & shared responsibility |
| **Stage** | RT-OPR-001-STG-01 |
| **Category** | ORIENTATION |
| **Capability outcomes** | State lab safety/quota rules; distinguish provider vs operator duties; map the sandbox environment at a high level |
| **Brief** | Orient to CLOUD-SANDBOX / LOCAL-SAFE tooling, idle shutdown, and shared-responsibility boundaries before any change work |
| **Actions** | Read safety brief; complete orientation checklist; sketch environment map (services/boundaries) |
| **Output** | Signed orientation checklist + 1-page environment map (no secrets) |
| **Evidence** | Feeds EVD-03 context |
| **Assessment** | Checklist complete; safety items acknowledged |
| **Remediation** | Retry ORIENTATION; Nest Micro-Mission N-ACC/N-PRV if gaps |
| **AI policy** | PERMITTED_WITH_DISCLOSURE |
| **Intensity** | LIGHT |
| **Modality** | Browser/docs; optional captioned walkthrough |
| **Safety / privacy** | Lab-only; no production; no credential paste |
| **Arabic-first** | Arabic narrative; retain English cloud/CLI terms; bidi-safe map labels |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-OPR pending |

### 2) RT-OPR-001-STG-01-MSN-02 — Who owns the fault?

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-STG-01-MSN-02 |
| **Title** | Who owns the fault? |
| **Stage** | RT-OPR-001-STG-01 |
| **Category** | SCENARIO |
| **Capability outcomes** | Classify seeded incidents as operator-owned, provider-owned, or shared; justify with shared-responsibility language |
| **Brief** | Bounded scenario pack: three synthetic incidents; decide ownership and first safe operator action |
| **Actions** | Read scenario seed; classify each case; write short rationale; note residual risk |
| **Output** | Ownership decision note (seed ID cited) |
| **Evidence** | Feeds EVD-03 framing |
| **Assessment** | Correct ownership logic + safe first action (not blame theater) |
| **Remediation** | Scenario retry with new seed |
| **AI policy** | PERMITTED_WITH_DISCLOSURE |
| **Intensity** | STANDARD |
| **Modality** | Scenario packet (offline-capable) |
| **Safety / privacy** | Synthetic only; no live targets |
| **Arabic-first** | Arabic decision form; English service names retained |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-OPR pending |

### 3) RT-OPR-001-STG-01-ASM-01 — Stage 01 assessment

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-STG-01-ASM-01 |
| **Title** | Stage 01 assessment |
| **Stage** | RT-OPR-001-STG-01 |
| **Category** | ASSESSMENT |
| **Capability outcomes** | Demonstrate STG-01 outcomes: shared responsibility, lab rules, environment literacy |
| **Brief** | Short Stage gate: concept checks + map/safety spot items tied to orientation artifacts |
| **Actions** | Complete assessment items; cite orientation checklist ID |
| **Output** | Assessment record + artifact citation |
| **Evidence** | Stage gate (not a substitute for EVD anchors) |
| **Assessment** | Pass criteria: safety acknowledgment + ownership literacy |
| **Remediation** | ORIENTATION/SCENARIO retry before re-assess |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION (clarify only; answers learner-owned) |
| **Intensity** | LIGHT |
| **Modality** | Structured form |
| **Safety / privacy** | No harmful actionable content |
| **Arabic-first** | Arabic items; bilingual glossary for key terms |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-ID pending |

### 4) RT-OPR-001-STG-02-MSN-01 — CLI & OS operator walkthrough

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-STG-02-MSN-01 |
| **Title** | CLI & OS operator walkthrough |
| **Stage** | RT-OPR-001-STG-02 |
| **Category** | GUIDED_PRACTICE |
| **Capability outcomes** | Navigate host/file basics safely; run read-only diagnostic commands; capture summaries without secrets |
| **Brief** | Guided CLI session: identity, cwd, read-only inspect patterns; LOCAL-SAFE fallback if cloud CLI unavailable |
| **Actions** | Follow guided checkpoints; execute learner-run commands; redact and summarize |
| **Output** | Command summary log (redacted) with lab seed ID |
| **Evidence** | Supports EVD-01/EVD-02 method trails |
| **Assessment** | Checkpoints met; no secrets in log |
| **Remediation** | GUIDED refresh; LOCAL-SAFE path |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION — **learner must execute** |
| **Intensity** | STANDARD |
| **Modality** | CLI lab (keyboard path preferred) |
| **Safety / privacy** | Read-mostly; deny destructive flags; redact tokens |
| **Arabic-first** | Arabic coaching notes; English commands retained; bidi code blocks |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-OPR / EXP-A11Y pending |

### 5) RT-OPR-001-STG-02-MSN-02 — Inspect resources (read-only)

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-STG-02-MSN-02 |
| **Title** | Inspect resources (read-only) |
| **Stage** | RT-OPR-001-STG-02 |
| **Category** | LABORATORY |
| **Capability outcomes** | List and describe sandbox resources; distinguish compute/network/storage identity objects at operator literacy level |
| **Brief** | Hands-on read-only inventory of the seeded lab; vendor-neutral concepts preferred over console click-paths |
| **Actions** | Inventory resources; tag by class; note observations; no create/delete |
| **Output** | Resource inventory table + observation note |
| **Evidence** | Supports EVD-01 |
| **Assessment** | Inventory matches seed expectations; read-only discipline |
| **Remediation** | Lab reset + guided inventory |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION — **learner must execute** |
| **Intensity** | STANDARD |
| **Modality** | CLOUD-SANDBOX or LOCAL-SAFE emulator |
| **Safety / privacy** | Quota caps; no outbound attack tooling; redact account IDs |
| **Arabic-first** | Arabic observation template; English resource type names |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-OPR pending |

### 6) RT-OPR-001-STG-02-ASM-01 — Stage 02 assessment

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-STG-02-ASM-01 |
| **Title** | Stage 02 assessment |
| **Stage** | RT-OPR-001-STG-02 |
| **Category** | ASSESSMENT |
| **Capability outcomes** | Confirm safe CLI habits and read-only inspection literacy |
| **Brief** | Stage gate pairing short items with citation of command summary / inventory |
| **Actions** | Answer items; attach artifact references |
| **Output** | Assessment record |
| **Evidence** | Stage gate |
| **Assessment** | Pass on safety + inspect literacy |
| **Remediation** | GUIDED_PRACTICE refresh |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION |
| **Intensity** | LIGHT |
| **Modality** | Form + artifact citation |
| **Safety / privacy** | Reject secret-bearing submissions |
| **Arabic-first** | Arabic form |
| **Reviewer** | Founder (RAVEN) — blueprint |

### 7) RT-OPR-001-STG-03-MSN-01 — Networking symptoms vs app failure

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-STG-03-MSN-01 |
| **Title** | Networking symptoms vs app failure |
| **Stage** | RT-OPR-001-STG-03 |
| **Category** | TROUBLESHOOTING |
| **Capability outcomes** | Separate connectivity/DNS/path symptoms from application failure; document network observations in lab |
| **Brief** | Seeded fault pack: diagnose whether issue is network path vs app; record timeline of checks |
| **Actions** | Run allowed diagnostics; isolate layer; document findings; propose next safe step (no prod) |
| **Output** | Troubleshooting timeline + diagnosis note (seed ID) |
| **Evidence** | Feeds **EVD-02** |
| **Assessment** | Diagnosis quality + safety of proposed next step |
| **Remediation** | New seed retry; N-NET Micro-Mission if Nest gap |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION — **learner must execute diagnostics** |
| **Intensity** | STANDARD |
| **Modality** | Lab + structured troubleshooting form |
| **Safety / privacy** | Lab-only; no scanning of unauthorized targets |
| **Arabic-first** | Arabic timeline form; English tool names |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-OPR pending |

### 8) RT-OPR-001-STG-03-ASM-01 — Stage 03 assessment

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-STG-03-ASM-01 |
| **Title** | Stage 03 assessment |
| **Stage** | RT-OPR-001-STG-03 |
| **Category** | ASSESSMENT |
| **Capability outcomes** | Confirm networking-for-operators outcomes |
| **Brief** | Stage gate with seed-linked reasoning items |
| **Actions** | Complete items; cite troubleshooting note |
| **Output** | Assessment record |
| **Evidence** | Stage gate |
| **Assessment** | Pass on symptom classification |
| **Remediation** | Scenario/TS retry with new seed |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION |
| **Intensity** | LIGHT |
| **Modality** | Form |
| **Safety / privacy** | Synthetic scenarios only |
| **Arabic-first** | Arabic items |
| **Reviewer** | Founder (RAVEN) — blueprint |

### 9) RT-OPR-001-STG-04-MSN-01 — Guardrailed resources & IAM hygiene

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-STG-04-MSN-01 |
| **Title** | Guardrailed resources & IAM hygiene |
| **Stage** | RT-OPR-001-STG-04 |
| **Category** | LABORATORY |
| **Capability outcomes** | Provision within guardrails; apply least-privilege operator habits; avoid standing admin misuse |
| **Brief** | Lab: create/adjust a small resource set under quota; apply operator IAM hygiene (no standing admin theater). Does **not** duplicate SEX-001 hardening curriculum |
| **Actions** | Provision per seed; apply least-privilege operator pattern; record before/after notes; learner executes |
| **Output** | Lab change note + IAM hygiene attestation (sanitized) |
| **Evidence** | Primary path to **EVD-01** |
| **Assessment** | Guardrail compliance; least-privilege intent; no secret leak |
| **Remediation** | Lab reset + remediation Mission; secrets redaction drill |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION — **learner must execute** |
| **Intensity** | DEEP |
| **Modality** | CLOUD-SANDBOX primary |
| **Safety / privacy** | Hard spend/quota; no production; secrets never in Evidence |
| **Arabic-first** | Arabic change-note template |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-OPR pending |

### 10) RT-OPR-001-STG-04-MSN-02 — Sanitize & snapshot config

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-STG-04-MSN-02 |
| **Title** | Sanitize & snapshot config |
| **Stage** | RT-OPR-001-STG-04 |
| **Category** | DOCUMENTATION |
| **Capability outcomes** | Produce a sanitized config snapshot / before-after suitable for Evidence review |
| **Brief** | Package **RT-OPR-001-EVD-01** Config Evidence with redaction checklist and lab seed ID |
| **Actions** | Export allowed config views; redact; complete checklist; submit snapshot |
| **Output** | Sanitized config Evidence pack (**EVD-01**) |
| **Evidence** | **RT-OPR-001-EVD-01** |
| **Assessment** | Rubric subset (see Evidence Rubrics); checklist ≤15–20 min review target |
| **Remediation** | Redaction drill + resubmit |
| **AI policy** | PERMITTED_WITH_DISCLOSURE (draft notes); verification against actual config required |
| **Intensity** | STANDARD |
| **Modality** | Docs + lab export |
| **Safety / privacy** | Mandatory redaction; no raw credentials |
| **Arabic-first** | Arabic checklist; English keys allowed in config excerpts |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-INT pending |

### 11) RT-OPR-001-STG-04-ASM-01 — Stage 04 assessment

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-STG-04-ASM-01 |
| **Title** | Stage 04 assessment |
| **Stage** | RT-OPR-001-STG-04 |
| **Category** | ASSESSMENT |
| **Capability outcomes** | Confirm resource/IAM operator outcomes and Evidence readiness for EVD-01 |
| **Brief** | Stage gate referencing lab change note and config pack |
| **Actions** | Complete items; cite EVD-01 draft |
| **Output** | Assessment record |
| **Evidence** | Stage gate |
| **Assessment** | Pass requires guardrail + redaction literacy |
| **Remediation** | Lab reset + DOC retry |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION |
| **Intensity** | LIGHT |
| **Modality** | Form |
| **Safety / privacy** | Reject unredacted packs |
| **Arabic-first** | Arabic form |
| **Reviewer** | Founder (RAVEN) — blueprint |

### 12) RT-OPR-001-STG-05-MSN-01 — Degraded service: observe, change, recover

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-STG-05-MSN-01 |
| **Title** | Degraded service: observe, change, recover |
| **Stage** | RT-OPR-001-STG-05 |
| **Category** | TROUBLESHOOTING |
| **Capability outcomes** | Read health signals; perform a safe change with note; reason about backup/recovery options; recover from seeded fault |
| **Brief** | Injected degradation: monitor → diagnose → safe change → recovery reasoning → document residual risk. Monitoring literacy without SEX-001 duplication |
| **Actions** | Read signals; isolate; apply time-boxed safe change; document rollback/backup reasoning; learner executes |
| **Output** | Incident/fault timeline + diagnosis + change note (**EVD-02** core) |
| **Evidence** | **RT-OPR-001-EVD-02** |
| **Assessment** | Diagnosis quality + safety of fix + recovery reasoning |
| **Remediation** | Fault-pack retry |
| **AI policy** | PERMITTED_WITH_OUTPUT_VERIFICATION — **learner must execute** |
| **Intensity** | DEEP |
| **Modality** | Lab + monitoring view (sandbox) |
| **Safety / privacy** | Lab-only; no destructive “fix” without rollback note |
| **Arabic-first** | Arabic timeline; English metric/CLI names |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-OPR pending |

### 13) RT-OPR-001-STG-05-EPM-01 — Runbook pack & handoff prep

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-STG-05-EPM-01 |
| **Title** | Runbook pack & handoff prep |
| **Stage** | RT-OPR-001-STG-05 |
| **Category** | EVIDENCE_PREPARATION |
| **Capability outcomes** | Update mini-runbook; package EVD-02/EVD-03; prepare handoff note for Capstone eligibility |
| **Brief** | Evidence prep Mission: assemble runbook (**EVD-03**), link troubleshooting Evidence, redact, disclose AI, draft operator handoff |
| **Actions** | Revise mini-runbook; complete redaction/AI disclosure; write handoff brief; submit pack |
| **Output** | **EVD-03** runbook + linked **EVD-02** + handoff note |
| **Evidence** | **RT-OPR-001-EVD-02** · **RT-OPR-001-EVD-03** |
| **Assessment** | Pack completeness + clarity + residual risk note |
| **Remediation** | Runbook revision cycle |
| **AI policy** | PERMITTED_WITH_DISCLOSURE |
| **Intensity** | STANDARD |
| **Modality** | Templates / checklists (high offline) |
| **Safety / privacy** | Enforce redaction; lab branding clear |
| **Arabic-first** | Arabic runbook/handoff templates |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-INT pending |

### 14) RT-OPR-001-CAP-01-MSN-01 — Stabilize the sandbox

| Field | Content |
|-------|---------|
| **ID** | RT-OPR-001-CAP-01-MSN-01 |
| **Title** | Stabilize the sandbox |
| **Stage / Capstone** | Linked to **RT-OPR-001-CAP-01** |
| **Category** | CAPSTONE |
| **Capability outcomes** | Operate-recover a controlled degraded sandbox with documented Evidence pack demonstrating Route capability statement |
| **Brief** | Capstone Mission: stabilize seeded multi-signal environment; produce timeline + change note + updated mini-runbook + sanitized config. Full Capstone blueprint: [RT-OPR-001-CAPSTONE-BLUEPRINT.md](../../capstones/RT-OPR-001-CAPSTONE-BLUEPRINT.md) |
| **Actions** | Confirm eligibility (STG-01…05 + EVD-01…03 accepted); execute Capstone lab; assemble pack; disclose AI |
| **Output** | Capstone Evidence pack (timeline · change note · runbook · sanitized config) |
| **Evidence** | **RT-OPR-001-CAP-01** |
| **Assessment** | Capstone rubric (diagnosis, documentation, safety) — expert review pending |
| **Remediation** | Capstone resubmit cycle with new fault seed if integrity fail |
| **AI policy** | PERMITTED_WITH_DISCLOSURE + OUTPUT_VERIFICATION — **learner must execute** |
| **Intensity** | DEEP |
| **Modality** | CLOUD-SANDBOX / LOCAL-SAFE Capstone window |
| **Safety / privacy** | Lab-only; secrets stripped; public-portfolio sanitization |
| **Arabic-first** | Arabic Capstone narrative; English artifacts allowed |
| **Reviewer** | Founder (RAVEN) — blueprint; EXP-OPR · EXP-INT · Pilot **NOT RUN** |

---

## Category coverage check

| Required | Present |
|----------|---------|
| ORIENTATION | STG-01-MSN-01 |
| SCENARIO | STG-01-MSN-02 |
| ≥2 practical (GUIDED/INDEPENDENT/LAB) | STG-02-MSN-01 · STG-02-MSN-02 · STG-04-MSN-01 |
| TROUBLESHOOTING / ANALYSIS / DESIGN | STG-03-MSN-01 · STG-05-MSN-01 |
| DOCUMENTATION | STG-04-MSN-02 |
| Stage ASSESSMENT (`*-ASM-01`) | STG-01…04 ASM-01 |
| EVIDENCE_PREPARATION | STG-05-EPM-01 |
| CAPSTONE | CAP-01-MSN-01 |

## Topic coverage check

Orient env · CLI · inspect resources · networking · IAM operator · monitoring · troubleshoot degraded service · safe change · backup/recovery reasoning · runbook · handoff — **covered** across Missions 1–14.

## Explicit non-goals

- No XP / Mastery formulas  
- No full lesson scripts or click-path curricula  
- No LOCKED / PUBLISHED claim  
- No offensive / live-attack content  
- No SEX-001 secure-ops curriculum duplication  

## Unresolved (handoff)

1. Exact Mission scripts and bilingual item banks  
2. Expert review (EXP-OPR · EXP-ID · EXP-INT · EXP-A11Y · EXP-AR)  
3. Pilot run  
4. Primary vendor/region shortlist (from Route Unresolved)  
5. GHV.LEARNING.1D catalogue lock  
