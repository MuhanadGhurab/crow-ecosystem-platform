# RT-BLD-001 — Capstone Blueprint

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-CAP-BLD-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW AND PILOT |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Date** | 2026-07-21 |
| **Capstone ID** | **RT-BLD-001-CAP-01** |
| **Capstone Mission** | **RT-BLD-001-CAP-01-MSN-01** |
| **Route** | [RT-BLD-001-WEB-APPLICATION-DELIVERY.md](../routes/architecture/RT-BLD-001-WEB-APPLICATION-DELIVERY.md) |
| **Related** | [LAUNCH-CAPSTONE-CONCEPTS.md](./LAUNCH-CAPSTONE-CONCEPTS.md) (CAP-BLD-001) · [RT-BLD-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-BLD-001-MISSION-BLUEPRINTS.md) · [RT-BLD-001-EVIDENCE-RUBRICS.md](../evidence/rubrics/RT-BLD-001-EVIDENCE-RUBRICS.md) · [EVIDENCE-ANCHOR-REGISTRY.md](../evidence/EVIDENCE-ANCHOR-REGISTRY.md) |
| **Limitations** | Blueprint — **not full step-by-step lesson**; **framework-neutral**; **no XP**; **not LOCKED** |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Capstone blueprint |

```text
BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW AND PILOT
Expert: NOT RUN · Pilot: NOT RUN
No XP · No full lessons · No LOCKED · No offensive content
Framework-neutral
```

## Identity

| Field | Content |
|-------|---------|
| **Capstone ID** | **RT-BLD-001-CAP-01** |
| **Working title** | Ship the Small Feature |
| **Category** | CAPSTONE |
| **Horizon** | HRZ-BLD (BUILD) |
| **Concept** | Deliver a **small accessible web product** (scoped feature) end-to-end with version-control and delivery Evidence |

## Eligibility

| Requirement | Rule |
|-------------|------|
| Stages | RT-BLD-001-STG-01…05 complete |
| Evidence | **RT-BLD-001-EVD-01** · **EVD-02** · **EVD-03** · **EVD-04** accepted |
| Integrity | No open plagiarism / secret-commit revocation |
| Mission entry | Via **RT-BLD-001-CAP-01-MSN-01** |

## Problem (scenario)

A starter web app needs one **scoped** feature delivered with git hygiene, basic accessibility, tests, and sandbox preview documentation.

## Learner role (scenario only)

Junior web contributor — **not** an employment title or certification claim.

## Capability outcomes

- Ship a unique-seed feature with inspectable repository history  
- Demonstrate basic accessible UI patterns  
- Provide basic tests and delivery documentation  
- Disclose AI assist and explain learner-owned deltas  

## Output shape

| Artifact | Required |
|----------|----------|
| Working feature (sandbox) | Yes |
| Repository history | Yes |
| PR/MR or equivalent Evidence | Yes |
| README update | Yes |
| Short delivery note | Yes |
| AI-assist disclosure | Yes (required on code Evidence path) |
| Feature seed ID | Yes |
| Tests / a11y linkage | Prefer cite EVD-03 / EVD-02 |

## Evidence & review

| Field | Content |
|-------|---------|
| **Evidence ID** | **RT-BLD-001-CAP-01** |
| **Rubric** | [RT-BLD-001-EVIDENCE-RUBRICS.md](../evidence/rubrics/RT-BLD-001-EVIDENCE-RUBRICS.md) — Capstone section |
| **Review focus** | Completeness · clarity · basic quality · accessibility — **not** framework fashion |
| **Review target** | Smoke checklist + human rubric |
| **Prior EVD** | EVD-01…04 remain required; Capstone integrates, does not replace |

## Integrity

- Original commits; unique feature seed  
- Disclose generators/AI assist  
- Learner must **execute** build/test/preview steps  
- Reject scaffold-only submissions  

## Privacy / safety

- No real user PII in demos  
- No credential commits  
- Dependency allowlist mindset  
- Sandbox previews only  
- No live exploit targets  

## Tooling

| Class | Use |
|-------|-----|
| **LOCAL-SAFE** | Primary development |
| **CONTAINERIZED** | Optional |
| **BROWSER-ONLY** preview | Sandbox deploy |

OSS-first; avoid proprietary IDE hard dependencies. **Framework-neutral** — starter stack pin is Unresolved (1C/1D).

## Effort & modality

| Field | Content |
|-------|---------|
| **Effort** | Medium |
| **Intensity** | DEEP |
| **Team roles** | Solo (pair optional later) |
| **Public portfolio** | Yes — strong public artifact if sanitized |

## AI policy

**PERMITTED_WITH_DISCLOSURE** and **PERMITTED_WITH_OUTPUT_VERIFICATION**. Capstone coding/deploy/test steps require **learner execution**.

## Arabic-first

Arabic Capstone narrative; RTL UI patterns encouraged as learning content; English retained for code/APIs; bidi editor guidance.

## Remediation

Plagiarism, secret commits, undeclared AI-only paste, or Incomplete rubric → revoke; Capstone resubmit with new seed; may block Route-Proven / CXW-001 *source readiness* until remediated.

## Boundary notes

- Does **not** complete CXW-001 (Secure Application Delivery)  
- Does **not** require full AppSec / secure SDLC depth  
- Does **not** award XP or employment titles  

## Explicit non-goals

- Full lesson script  
- Single-framework lock  
- XP / Mastery formulas  
- LOCKED / PUBLISHED catalogue status  

## Unresolved

1. Exact starter stack pin and preview hosting caps  
2. Expert review (EXP-BLD · EXP-A11Y · EXP-INT · EXP-AR)  
3. Pilot run and reviewer smoke scripts  
4. CXW Integration Readiness numeric thresholds (PROGRESSION.1)  
5. GHV.LEARNING.1D lock  
