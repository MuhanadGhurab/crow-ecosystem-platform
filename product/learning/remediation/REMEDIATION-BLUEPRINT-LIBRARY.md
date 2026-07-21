# Remediation Blueprint Library

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-RMD-LIB-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [REMEDIATION-ARCHITECTURE.md](../architecture/REMEDIATION-ARCHITECTURE.md) · Gate §40 · [MISSION-EVIDENCE-TRACEABILITY.md](../missions/MISSION-EVIDENCE-TRACEABILITY.md) · [ASSESSMENT-ANCHOR-STANDARD.md](../assessments/ASSESSMENT-ANCHOR-STANDARD.md) |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |
| **Limitations** | Reusable patterns only — not Mission CMS scripts; no XP; not LOCKED |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Remediation Blueprint Library |

## Purpose

Define reusable remediation patterns for every trigger listed in GHV.LEARNING.1C gate **§40**.

```text
Tone: supportive path, not a verdict on human value.
Preserve valid completed work. Expert: NOT RUN · Pilot: NOT RUN · No XP
```

Identifier pattern: `RMD-{DOMAIN}-NNN` (instances bind in later content production).

---

## Pattern catalog (gate §40)

### 1) Missing Nest foundation — `RMD-NEST-FOUND`

| Field | Content |
|-------|---------|
| **Trigger** | Nest weakness / missing `NST-CAP-*` under Guided Skip or Nest Recommended |
| **Learner message** | “A Nest foundation for this Route is incomplete. Complete the short foundation path — your Route progress stays.” |
| **Remediation form** | Micro-Mission · Nest Bridge (`BRG-NEST-*`) · Knowledge review |
| **Preserved progress** | Nest bands and completed Nest Missions remain; Route Stage completions remain |
| **Reassessment** | Nest readiness retest / targeted cap check |
| **Return point** | Original Route entry / Flight Plan insert exit → ULK-RMD-001 |
| **Escalation** | Repeated failure → mentor review if available |
| **Mentor** | Optional for stuck Nest loops |

### 2) Misunderstood concept — `RMD-CONCEPT`

| Field | Content |
|-------|---------|
| **Trigger** | Assessment / scenario shows conceptual misunderstanding |
| **Learner message** | “One concept needs a clearer pass. Review the brief, then retry the check.” |
| **Remediation form** | Knowledge review · Scenario retry with new seed |
| **Preserved progress** | Prior Stage completions and unrelated Evidence remain |
| **Reassessment** | Linked `*-ASM-*` or concept check |
| **Return point** | Failed Stage / Mission gate |
| **Escalation** | Third fail → instructional redesign flag (content) + mentor if available |
| **Mentor** | Optional |

### 3) Procedural error — `RMD-PROC`

| Field | Content |
|-------|---------|
| **Trigger** | Wrong procedure / unsafe sequence in guided practice |
| **Learner message** | “The steps need a safer or clearer sequence. Practice the corrected procedure.” |
| **Remediation form** | Guided practice · Laboratory retry |
| **Preserved progress** | Valid prior attempts retained as history |
| **Reassessment** | Practical checklist / ASM practical portion |
| **Return point** | Same Mission / Stage |
| **Escalation** | Safety-adjacent errors → safety remediation pattern |
| **Mentor** | Optional |

### 4) Incomplete practical output — `RMD-PRAC-OUT`

| Field | Content |
|-------|---------|
| **Trigger** | Lab / practice output missing required elements |
| **Learner message** | “Your practical output is incomplete against the checklist. Finish the missing parts.” |
| **Remediation form** | Guided practice · Independent practice with checklist |
| **Preserved progress** | Drafts retained; environment reset only if unsafe |
| **Reassessment** | Output completeness check |
| **Return point** | Same practical Mission |
| **Escalation** | Chronic incompleteness → intensity pacing review |
| **Mentor** | Optional |

### 5) Weak reasoning — `RMD-REASON`

| Field | Content |
|-------|---------|
| **Trigger** | Analysis / decision rationale fails qualitative STANDARD |
| **Learner message** | “Strengthen the reasoning: cite seed constraints, options considered, and residual risk.” |
| **Remediation form** | Knowledge review · Scenario rewrite · Analysis coaching prompt |
| **Preserved progress** | Prior drafts versioned |
| **Reassessment** | Reasoning dimension on ASM or Evidence rubric |
| **Return point** | Analysis / decision Mission |
| **Escalation** | Integrity suspicion → integrity pattern |
| **Mentor** | Optional for LEAD / Capstone reasoning |

### 6) Poor documentation — `RMD-DOC`

| Field | Content |
|-------|---------|
| **Trigger** | Documentation Mission / Evidence docs unclear or incomplete |
| **Learner message** | “Documentation must be usable by another practitioner. Revise for clarity and completeness.” |
| **Remediation form** | Documentation rewrite · Evidence revision |
| **Preserved progress** | Prior versions retained |
| **Reassessment** | Documentation rubric dimension |
| **Return point** | DOCUMENTATION / EPM Mission |
| **Escalation** | Privacy defects → safety/privacy pattern |
| **Mentor** | Optional |

### 7) Safety or security gap — `RMD-SAFE`

| Field | Content |
|-------|---------|
| **Trigger** | Unsafe lab action, missing ethics acknowledgment, secrets exposure risk, offensive drift |
| **Learner message** | “A safety or security rule was missed. Complete the safety remediation before continuing.” |
| **Remediation form** | Safety brief · Ethics gate retry · Lab environment reset · Guided practice |
| **Preserved progress** | Non-implicated work remains; unsafe env state reset |
| **Reassessment** | Ethics / safety ASM (esp. PRT STG-01) |
| **Return point** | Hard gate Stage / Mission |
| **Escalation** | Immediate content quarantine if content defect; integrity review if intentional violation |
| **Mentor** | Recommended for repeated safety gaps |

### 8) Evidence integrity concern — `RMD-EVD-INT`

| Field | Content |
|-------|---------|
| **Trigger** | Authorship doubt, undisclosed AI, seed mismatch, plagiarized pack, secrets in artifact |
| **Learner message** | “Integrity review is required on this Evidence. Follow the integrity path; unrelated approved Evidence stays.” |
| **Remediation form** | Integrity review · Evidence revision · Retest if required after clear |
| **Preserved progress** | Non-implicated Evidence remains; implicated artifacts quarantined |
| **Reassessment** | Integrity clear + Evidence resubmission |
| **Return point** | Evidence review state machine |
| **Escalation** | Unresolved → INTEGRITY_REVIEW; may suspend Proven eligibility |
| **Mentor** | Required when available for integrity cases |

### 9) Inactivity — `RMD-INACTIVE`

| Field | Content |
|-------|---------|
| **Trigger** | Long inactivity vs resume policy (timer exact value PENDING ops policy) |
| **Learner message** | “Welcome back. A short refresh keeps your lab and skills current — progress is preserved.” |
| **Remediation form** | Knowledge review · Guided practice · Micro-Mission |
| **Preserved progress** | All valid Stage / Evidence progress preserved; refresh additive |
| **Reassessment** | Light retest if safety-critical tooling changed |
| **Return point** | Last eligible Stage / Mission |
| **Escalation** | Major content change while inactive → content-change pattern |
| **Mentor** | Optional |

### 10) Changed technology or content — `RMD-CONTENT`

| Field | Content |
|-------|---------|
| **Trigger** | Content UPDATE REQUIRED / major version while learner mid-flight |
| **Learner message** | “This learning unit changed. Complete the delta path for new requirements; historical approved Evidence is not silently erased.” |
| **Remediation form** | Knowledge review · Bridge · Targeted Stage delta · Retest if safety-critical |
| **Preserved progress** | Historical Evidence retained; new Unlock requirements may apply (freshness) |
| **Reassessment** | Delta assessment / updated ASM slice |
| **Return point** | Updated Stage / Mission version |
| **Escalation** | Safety defect → unpublish path + RMD-SAFE |
| **Mentor** | Optional |

### 11) Failed integration — `RMD-INTEGRATION`

| Field | Content |
|-------|---------|
| **Trigger** | CXW Integration Mission (`CXW-001-INT-01`) or Bridge assessment not STANDARD_MET |
| **Learner message** | “Integration is not yet demonstrated. Remediate the gap (Bridge, delivery, or security half) — do not restart entire source Routes.” |
| **Remediation form** | Targeted Bridge retry · Guided practice on weak wing · Evidence revision for integrated pack |
| **Preserved progress** | Source Route completions preserved; CXW Stage progress outside failed INT retained where valid |
| **Reassessment** | BRG-PRT-BLD-01-ASM-01 and/or CXW STG / INT assessment |
| **Return point** | Integration Mission / Bridge gate |
| **Escalation** | Semantic coherence failure → EXP-CXW review of blueprint (content), mentor if available |
| **Mentor** | Recommended |

### 12) Failed Capstone — `RMD-CAPSTONE`

| Field | Content |
|-------|---------|
| **Trigger** | Capstone STANDARD_NOT_YET_MET / REVISION_REQUIRED / integrity hold |
| **Learner message** | “Capstone needs revision. Keep approved Stage Evidence; revise the Capstone bundle against the rubric.” |
| **Remediation form** | Capstone revision · Evidence revision · Targeted Stage refresh only if Capstone reveals Stage gap |
| **Preserved progress** | Approved Stage Evidence and prior Stage completions remain |
| **Reassessment** | Capstone review + rubric pack |
| **Return point** | Capstone Mission / CAP-01 |
| **Escalation** | Integrity → RMD-EVD-INT; repeated fails → mentor + intensity check |
| **Mentor** | Recommended for Capstone |

---

## Cross-trigger map (architecture sources)

| Architecture source (1B) | §40 patterns primarily used |
|--------------------------|----------------------------|
| Nest weakness | Missing Nest foundation |
| Assessment gap | Misunderstood concept · Weak reasoning |
| Practical failure | Procedural error · Incomplete practical output |
| Evidence revision | Poor documentation · Weak reasoning |
| Integrity concern | Evidence integrity concern · Safety gap |
| Long inactivity | Inactivity |
| Changed content | Changed technology or content |
| Missing shared capability | Missing Nest foundation · Misunderstood concept |
| CXW / Bridge fail | Failed integration |
| Capstone fail | Failed Capstone |

## Explicit non-goals

* No infinite ungoverned retries (caps PENDING policy / pilot).
* No full-Route wipe for a single gap.
* No XP penalties invented here.
