# RT-OPR-001 — Cloud Systems Operations Foundations

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-RT-OPR-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-ARCHITECTURE-STANDARD.md](../../architecture/ROUTE-ARCHITECTURE-STANDARD.md) · [STAGE-ARCHITECTURE-STANDARD.md](../../architecture/STAGE-ARCHITECTURE-STANDARD.md) · [MISSION-CATEGORY-REGISTRY.md](../../architecture/MISSION-CATEGORY-REGISTRY.md) · [LEARNING-IDENTIFIER-STANDARD.md](../../architecture/LEARNING-IDENTIFIER-STANDARD.md) · [NEST-DEPENDENCY-MAP.md](../../nest/NEST-DEPENDENCY-MAP.md) · [LAUNCH-SECURE-EXTENSION-STUDY.md](../../secure-extensions/LAUNCH-SECURE-EXTENSION-STUDY.md) |
| **Source research** | RC-OPR-001 (GHV.LEARNING.1A) |
| **Limitations** | Working title; no Product Code; no XP formulas; does not duplicate SEX-001 secure-ops curriculum |
| **Unresolved** | Primary cloud vendor shortlist; Mission scripts (1C); Exact Evidence rubrics (1C); 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1B architecture |

```text
ARCHITECTURE RECOMMENDED — PENDING 1D LOCK
Never final LOCKED in this Gate.
```

---

## Identity

| Field | Content |
|-------|---------|
| **Canonical ID** | **RT-OPR-001** |
| **Prior candidate ID** | RC-OPR-001 |
| **Working title** | Cloud Systems Operations Foundations |
| **Horizon** | HRZ-OPR (OPERATE) |
| **Route type** | FOUNDATIONAL · OPERATIONAL |
| **Capability statement** | Operate and observe foundational cloud workloads safely within guardrails: establish operational context, use CLI/OS basics, apply networking literacy, manage cloud resources and operator IAM hygiene, and practice observability, change, and recovery with documented Evidence. |
| **Target learner** | Nest-ready beginners and career changers entering cloud / IT operations pathways (scenario roles only — not employment titles) |

---

## Entry / Exit

| Field | Content |
|-------|---------|
| **Entry** | Nest readiness **≥ 50% path** (Guided Skip with Micro-Missions on required-cap gaps) **or** Nest complete / Ready to Fly — per Scope Baseline §3.5 bands (**thresholds unchanged**). Advanced Route prerequisites are **not** waived by Nest skip. |
| **Exit** | All five Stages complete **and** required Evidence anchors accepted **and** Capstone eligible (`RT-OPR-001-CAP-01`) |
| **Prerequisites** | Nest digital foundations (required caps: N-ACC · N-FIL · N-PWD · N-NET · N-TSH · N-PRV); basic networking & OS concepts as Route-level prereqs |
| **Corequisites** | None hard-required at architecture level |
| **Recommended** | Linux/network Micro-Missions or RT-OPR-002 concepts (if later offered); N-BRW · N-AIL · N-COL · N-IDN · N-SCM Nest reviews |

---

## Stage table (5 Stages)

| Stage ID | Title | Outcomes | Mission categories | Evidence contribution | Remediation | Next Unlock |
|----------|-------|----------|--------------------|----------------------|-------------|-------------|
| **RT-OPR-001-STG-01** | Operational context & shared responsibility | Explain cloud shared-responsibility boundaries; identify operator vs provider duties; state lab safety/quota rules; map a small environment | ORIENTATION · KNOWLEDGE · SCENARIO · DOCUMENTATION | Feeds context notes toward EVD-03; Capstone framing | Nest Micro-Missions on N-ACC/N-PRV; ORIENTATION retry | Unlocks STG-02 |
| **RT-OPR-001-STG-02** | CLI & OS operator basics | Navigate host/file basics safely; run read-only diagnostic commands; capture command summaries without secrets | KNOWLEDGE · GUIDED_PRACTICE · LABORATORY · DOCUMENTATION | Supports EVD-01 / EVD-02 method trails | GUIDED_PRACTICE refresh; LOCAL-SAFE fallback | Unlocks STG-03 |
| **RT-OPR-001-STG-03** | Networking for operators | Diagnose connectivity vs app failure; read basic path/DNS symptoms; document network observations in lab | KNOWLEDGE · SCENARIO · TROUBLESHOOTING · LABORATORY | Feeds EVD-02 troubleshooting | Scenario retry with new seed; N-NET Micro-Mission | Unlocks STG-04 |
| **RT-OPR-001-STG-04** | Cloud resources & operator IAM | Provision within guardrails; apply least-privilege operator habits; snapshot config safely; avoid standing admin misuse | GUIDED_PRACTICE · LABORATORY · INDEPENDENT_PRACTICE · DOCUMENTATION | **EVD-01** config primary | Lab reset + remediation Mission; secrets redaction drill | Unlocks STG-05 |
| **RT-OPR-001-STG-05** | Observability, change & recovery | Read health signals; perform safe change with note; recover from seeded fault; update mini-runbook | TROUBLESHOOTING · LABORATORY · DOCUMENTATION · EVIDENCE_PREPARATION · ASSESSMENT | **EVD-02** · **EVD-03**; Capstone eligibility | Fault-pack retry; runbook revision cycle | Unlocks **RT-OPR-001-CAP-01** eligibility; enables SEX-001 attach *readiness* (not auto-complete) |

---

## Evidence anchors

| ID | Title | Artifact class | Stage contribution | Integrity | Review |
|----|-------|----------------|--------------------|-----------|--------|
| **RT-OPR-001-EVD-01** | Config Evidence | Sanitized config snapshot / before-after | STG-04 (primary); STG-02 support | Lab seed ID; redaction checklist | Checklist ≤15–20 min |
| **RT-OPR-001-EVD-02** | Troubleshooting Evidence | Incident/fault timeline + diagnosis note | STG-03 · STG-05 | Unique fault seed; cite change/lab IDs | Rubric: diagnosis quality + safety |
| **RT-OPR-001-EVD-03** | Runbook Evidence | Mini-runbook / change hygiene sample | STG-01 · STG-05 | Personalized to lab; no copied instructor key | Clarity + residual risk note |

---

## Capstone

| Field | Content |
|-------|---------|
| **Capstone ID** | **RT-OPR-001-CAP-01** |
| **Eligibility** | STG-01…05 complete + EVD-01 · EVD-02 · EVD-03 accepted |
| **Concept** | Stabilize a broken sample environment with documented steps (see CAP-OPR-001 / 1A concepts — no full instructions here) |
| **Output shape** | Timeline + change note + updated mini-runbook + sanitized config |
| **Category** | CAPSTONE |

---

## Cross-Wing / Secure Extension links

| Link | Note |
|------|------|
| **SEX-001** | Secure Cloud Operations Extension **attaches** to RT-OPR-001 via `SECURE_EXTENSION`. This Route teaches foundational ops only — **do not duplicate** full secure configuration / least-privilege Extension curriculum here. Attachment note: SEX-001 remains separate architecture; host Route Exit enables Extension *eligibility*, not Extension completion. |
| **CXW-001** | Not a primary source Route; optional later Bridge via observability language to PROTECT/BUILD paths |
| **BRG-OPR-PRT** | Conceptual Bridge to RT-PRT-001 (shared observability / triage language) — detail in 1C Graph |

---

## Tooling

| Field | Content |
|-------|---------|
| **Primary classes** | **CLOUD-SANDBOX** · **LOCAL-SAFE** (emulator/container fallback) · BROWSER-ONLY docs |
| **Vendor posture** | **Vendor-neutral** foundations; one primary vendor may illustrate — must not define Mastery |
| **Avoid** | Specialized cyber ranges; unrestricted cloud; production tenants |
| **Reset** | Snapshot/reimage target aspirational ≤15 min |

---

## Safety

- Lab-only; hard spend/quota caps  
- No production access  
- Secrets never in Evidence  
- Deny outbound attack tooling  
- Idle shutdown / abuse metering  

---

## Arabic-first

| Field | Content |
|-------|---------|
| **Feasibility** | High (1A Arabic study) |
| **Notes** | Arabic instructional narrative with retained English CLI/cloud terms; bidi for mixed command blocks; captioned demos |

---

## Freshness

| Class | Content areas |
|-------|---------------|
| **Stable** | Shared responsibility, change hygiene, troubleshooting method |
| **Slow-changing** | Networking/OS operator basics |
| **Fast / Vendor** | Console UI click-paths — keep thin; prefer portable concepts |

Review cadence: per CONTENT-FRESHNESS-AND-LIFECYCLE.md; vendor UI slices REVIEW DUE more often.

---

## Expert review

| Type | Need |
|------|------|
| Cloud ops SME | Stage outcomes + lab guardrails |
| Safety/privacy | Evidence redaction + quota model |
| Arabic instructional | Narrative/glossary quality before 1D |
| A11y | Keyboard console paths |

---

## Route-Proven (qualitative)

Route is qualitatively “proven” when learners consistently produce EVD-01…03 that reviewers accept without safety incidents, Capstone packs show transferable ops discipline, and lab cost/abuse stays within planned bounds — **no XP or Mastery formula invented here**.

---

## Unresolved

1. Primary cloud vendor + Saudi-accessible region shortlist  
2. Mission-level scripts and rubrics (GHV.LEARNING.1C)  
3. Exact Extension attach UX after STG-05  
4. PROGRESSION.1 Mastery/Trust thresholds  
5. GHV.LEARNING.1D catalogue lock  

---

## Stage review table (Gate §33)

| Stage ID | Outcomes clarity | Category fit | Evidence contribution | Remediation path | Unlock coherence | Safety | A11y | Integrity | Offline / tooling | Reviewer | Verdict |
|----------|------------------|--------------|----------------------|------------------|------------------|--------|------|-----------|-------------------|----------|---------|
| STG-01 | Clear | OK | Mapped | Defined | OK | Pass | Pass | Pass | High offline | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-02 | Clear | OK | Mapped | Defined | OK | Pass | Watch (CLI) | Pass | LOCAL-SAFE fallback | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-03 | Clear | OK | Mapped | Defined | OK | Pass | Pass | Pass | Med | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-04 | Clear | OK | EVD-01 | Defined | OK | Pass | Watch (console) | Pass | CLOUD-SANDBOX primary | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-05 | Clear | OK | EVD-02/03 | Defined | OK | Pass | Pass | Pass | Med | Founder (RAVEN) | **ARCHITECTURE OK** |

**§33 aggregate:** Stage count **5/5** · All Stages **ARCHITECTURE OK** · Route status remains **ARCHITECTURE RECOMMENDED — PENDING 1D LOCK** (not LOCKED).
