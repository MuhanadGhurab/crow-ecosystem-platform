# RT-OPR-001 — Capstone Blueprint

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-CAP-OPR-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW AND PILOT |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Date** | 2026-07-21 |
| **Capstone ID** | **RT-OPR-001-CAP-01** |
| **Capstone Mission** | **RT-OPR-001-CAP-01-MSN-01** |
| **Route** | [RT-OPR-001-CLOUD-SYSTEMS-OPERATIONS.md](../routes/architecture/RT-OPR-001-CLOUD-SYSTEMS-OPERATIONS.md) |
| **Related** | [LAUNCH-CAPSTONE-CONCEPTS.md](./LAUNCH-CAPSTONE-CONCEPTS.md) (CAP-OPR-001) · [RT-OPR-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-OPR-001-MISSION-BLUEPRINTS.md) · [RT-OPR-001-EVIDENCE-RUBRICS.md](../evidence/rubrics/RT-OPR-001-EVIDENCE-RUBRICS.md) · [EVIDENCE-ANCHOR-REGISTRY.md](../evidence/EVIDENCE-ANCHOR-REGISTRY.md) |
| **Limitations** | Blueprint — **not full step-by-step lesson**; **no XP**; **not LOCKED** |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Capstone blueprint |

```text
BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW AND PILOT
Expert: NOT RUN · Pilot: NOT RUN
No XP · No full lessons · No LOCKED · No offensive content
```

## Identity

| Field | Content |
|-------|---------|
| **Capstone ID** | **RT-OPR-001-CAP-01** |
| **Working title** | Stabilize the Sandbox |
| **Category** | CAPSTONE |
| **Horizon** | HRZ-OPR (OPERATE) |
| **Concept** | Stabilize / operate-recover a **controlled** degraded sandbox environment with documented Evidence |

## Eligibility

| Requirement | Rule |
|-------------|------|
| Stages | RT-OPR-001-STG-01…05 complete |
| Evidence | **RT-OPR-001-EVD-01** · **EVD-02** · **EVD-03** accepted |
| Integrity | No open safety/integrity revocation |
| Mission entry | Via **RT-OPR-001-CAP-01-MSN-01** |

## Problem (scenario)

A small multi-service sample environment shows noisy alerts, a failed health check, and an undocumented recent change. The learner must **stabilize** the lab within guardrails — not “hack” or attack anything.

## Learner role (scenario only)

Junior cloud operator on call — **not** an employment title or certification claim.

## Capability outcomes

- Observe health signals and isolate a seeded fault  
- Perform a **safe change** with change note and rollback/backup-recovery reasoning  
- Produce a Capstone Evidence pack demonstrating foundational ops discipline  
- Handoff-ready documentation without secrets  

## Output shape

| Artifact | Required |
|----------|----------|
| Incident / stabilize timeline | Yes |
| Change note (what changed, why, rollback) | Yes |
| Updated mini-runbook | Yes |
| Sanitized config snapshot | Yes |
| AI-assist disclosure | Yes if AI used |
| Lab seed ID citation | Yes |

## Evidence & review

| Field | Content |
|-------|---------|
| **Evidence ID** | **RT-OPR-001-CAP-01** |
| **Rubric** | [RT-OPR-001-EVIDENCE-RUBRICS.md](../evidence/rubrics/RT-OPR-001-EVIDENCE-RUBRICS.md) — Capstone section |
| **Review focus** | Diagnosis quality · documentation clarity · safety of proposed fix — **not** alert volume |
| **Review target** | Human rubric; capacity pending expert review |
| **Prior EVD** | EVD-01…03 remain part of Proven path; Capstone does not replace them |

## Integrity

- Unique Capstone fault seed (or write-up originality check)  
- No copy of instructor answer key  
- Learner must **execute** lab actions (AI may advise with disclosure + output verification)  

## Privacy / safety

- Lab-only; no production access  
- Hard spend/quota caps; idle shutdown  
- Secrets never in Evidence  
- Deny outbound attack tooling  
- No offensive content  

## Tooling

| Class | Use |
|-------|-----|
| **CLOUD-SANDBOX** | Primary |
| **LOCAL-SAFE** | Emulator/container fallback |
| Monitoring / CLI | Sandbox views only |

Vendor-neutral foundations; one vendor may illustrate — must not define Mastery.

## Effort & modality

| Field | Content |
|-------|---------|
| **Effort** | Medium (guided faults, time-boxed) |
| **Intensity** | DEEP |
| **Team roles** | Solo |
| **Public portfolio** | Yes — with secrets stripped and lab branding clear |

## AI policy

**PERMITTED_WITH_DISCLOSURE** and **PERMITTED_WITH_OUTPUT_VERIFICATION**. Practical Capstone steps require **learner execution**.

## Arabic-first

Arabic Capstone narrative and templates; retain English CLI/cloud terms; bidi-safe command blocks; captioned demos where used.

## Remediation

Integrity fail, unsafe artifact, or Incomplete rubric → revoke Capstone approval; resubmit cycle with new fault seed; may block Route-Proven / SEX-001 attach *eligibility* until remediated.

## Boundary notes

- Does **not** complete SEX-001 (Secure Cloud Operations Extension)  
- Does **not** teach offensive techniques  
- Does **not** award XP or employment titles  

## Explicit non-goals

- Full lesson script / click-path curriculum  
- XP / Mastery formulas  
- LOCKED / PUBLISHED catalogue status  
- Production tenant access  

## Unresolved

1. Exact fault-pack catalogue and time boxes  
2. Expert review (EXP-OPR · EXP-INT · EXP-AR · EXP-A11Y)  
3. Pilot run and reviewer capacity model  
4. Numeric Proven thresholds (GHV.PROGRESSION.1)  
5. GHV.LEARNING.1D lock  
