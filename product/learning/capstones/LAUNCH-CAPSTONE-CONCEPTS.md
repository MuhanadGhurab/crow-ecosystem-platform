# Launch Capstone Concepts

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-CAP-001 |
| **Version** | 1.0.0 |
| **Status** | RESEARCH BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1A |
| **Access date** | 2026-07-21 |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md](../routes/LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md) · [ROUTE-CANDIDATE-REGISTER.md](../routes/ROUTE-CANDIDATE-REGISTER.md) · [LAUNCH-CROSS-WING-STUDY.md](../cross-wing/LAUNCH-CROSS-WING-STUDY.md) · [LAUNCH-SECURE-EXTENSION-STUDY.md](../secure-extensions/LAUNCH-SECURE-EXTENSION-STUDY.md) · [ROLE-AND-TITLE-BOUNDARIES.md](../research/ROLE-AND-TITLE-BOUNDARIES.md) |
| **Limitations** | Concepts only — **no full Mission instructions**; no Product Codes; no employment or certification promises; lab designs pending LEARNING.1B; all IDs **NOT LOCKED** |
| **Unresolved** | Exact Evidence rubrics; Trust thresholds (GHV.PROGRESSION.1); Live Sky facilitation standards; team matchmaking rules |
| **Change history** | 1.0.0 (2026-07-21) — Initial RESEARCH BASELINE for GHV.LEARNING.1A |

## Purpose

Define **one capstone concept** per recommended launch Route, plus Cross-Wing, Secure Extension, and one optional Team/Live Sky experience. Concepts bound Evidence shape — they are not step-by-step Missions.

```text
NO FULL INSTRUCTIONS IN THIS DOCUMENT.
```

All portfolio IDs: **NOT LOCKED** (final lock → GHV.LEARNING.1D).

## Concept field schema

| Field | Meaning |
|-------|---------|
| **Problem** | Real-world situation the learner confronts |
| **Learner role** | Role *inside the scenario* (not a job offer) |
| **Output** | Artifacts produced |
| **Required caps** | Capability types / prior Route readiness (conceptual) |
| **Evidence** | What counts toward Mastery assessment |
| **Review** | Human / rubric review pattern |
| **Integrity** | Anti-cheat / originality expectations |
| **Privacy / safety** | Data and harm constraints |
| **Effort** | Relative learner effort |
| **Tooling** | Sandbox / local tools (examples) |
| **Team roles** | Solo unless noted |
| **Public portfolio suitability** | Safe to share externally? |

---

## CAP-OPR-001 — Stabilize the Sandbox (RC-OPR-001)

| Field | Content |
|-------|---------|
| **Linked Route** | RC-OPR-001 Cloud Systems Operations Foundations — **NOT LOCKED** |
| **Problem** | A small multi-service sample environment shows noisy alerts, a failed health check, and an undocumented recent change |
| **Learner role** | Junior cloud operator on call (scenario only) |
| **Output** | Incident timeline; change note; updated mini-runbook; config snapshot (sanitized) |
| **Required caps** | Nest foundations; OPERATE Stages for identity, compute, observe, change hygiene |
| **Evidence** | Timeline + runbook + sanitized configs demonstrating triage and safe change discipline |
| **Review** | Rubric on diagnosis quality, documentation clarity, safety of proposed fix — not “alert volume” |
| **Integrity** | Unique fault seed or write-up originality check; no copy of instructor key |
| **Privacy / safety** | Lab-only; no production access; no secrets in Evidence; quota guardrails |
| **Effort** | Medium (guided faults, time-boxed) |
| **Tooling** | Sandboxed cloud or emulator; monitoring dashboard; CLI basics |
| **Team roles** | Solo |
| **Public portfolio suitability** | Yes — with secrets stripped and lab branding clear |

---

## CAP-BLD-001 — Ship the Small Feature (RC-BLD-001)

| Field | Content |
|-------|---------|
| **Linked Route** | RC-BLD-001 Web Application Delivery Foundations — **NOT LOCKED** |
| **Problem** | A starter web app needs one scoped feature delivered with version control hygiene |
| **Learner role** | Junior web contributor (scenario only) |
| **Output** | Working feature; repository history; PR/MR or equivalent; README update; short delivery note |
| **Required caps** | Nest; BUILD Stages for repo, app basics, delivery checklist |
| **Evidence** | Repo link/export, PR Evidence, screenshots, delivery note |
| **Review** | Rubric on completeness, clarity, basic quality — not framework fashion |
| **Integrity** | Original commits; disclose generators/AI assist per Evidence policy |
| **Privacy / safety** | No real user PII; no credential commits; dependency allowlist |
| **Effort** | Medium |
| **Tooling** | Local/browser/container stack; git host (sandbox) |
| **Team roles** | Solo (pair optional later) |
| **Public portfolio suitability** | Yes — strong public artifact if sanitized |

---

## CAP-PRT-001 — Defensive Briefing from a Scenario Pack (RC-PRT-001)

| Field | Content |
|-------|---------|
| **Linked Route** | RC-PRT-001 Defensive Security Operations Foundations — **NOT LOCKED** |
| **Problem** | Provided alerts and context require triage, prioritization, and a defensive recommendation |
| **Learner role** | Junior defensive analyst (scenario only) |
| **Output** | Alert triage report; detection/decision note; ethics declaration; briefing summary |
| **Required caps** | Nest safety/privacy; recommended networking literacy; PROTECT foundation Stages |
| **Evidence** | Triage report + ethics declaration + briefing (no offensive exploitation) |
| **Review** | Rubric on defensive reasoning, proportionality, documentation — red-team skill out of scope |
| **Integrity** | Scenario pack version pinned; no live-target claims |
| **Privacy / safety** | Controlled scenarios only; no live attacks; no doxxing; synthetic indicators |
| **Effort** | Medium |
| **Tooling** | Scenario packet; read-only log viewers; playbook templates |
| **Team roles** | Solo |
| **Public portfolio suitability** | Conditional — share briefing without sensitive IOC dumps; lab-marked |

---

## CAP-LED-001 — Constrained Change Delivery Plan (RC-LED-001)

| Field | Content |
|-------|---------|
| **Linked Route** | RC-LED-001 Technology Delivery & Risk Foundations — **NOT LOCKED** |
| **Problem** | A technical change must be planned under time, dependency, and risk constraints |
| **Learner role** | Delivery coordinator (scenario only — **not** a senior manager title) |
| **Output** | Delivery plan; RACI-lite; risk register; stakeholder communication note |
| **Required caps** | Nest collaboration; recommended exposure to one technical Route |
| **Evidence** | Plan + risk register + stakeholder note demonstrating prioritization and risk literacy |
| **Review** | Rubric on realism, risk quality, clarity — not charismatic writing alone |
| **Integrity** | Original analysis of provided constraint pack |
| **Privacy / safety** | No real organizational confidential data; fictional stakeholders |
| **Effort** | Low–Medium |
| **Tooling** | Docs / spreadsheets / templates in browser |
| **Team roles** | Solo |
| **Public portfolio suitability** | Yes — strong reflective portfolio piece |

---

## CAP-ANL-001 — Insight from a Bounded Dataset (RC-ANL-001, alternative)

| Field | Content |
|-------|---------|
| **Linked Route** | RC-ANL-001 Practical Data Analysis Foundations — **NOT LOCKED** (launch alternative) |
| **Problem** | A bounded synthetic dataset needs cleaning, analysis, and a decision-useful summary |
| **Learner role** | Junior analyst (scenario only) |
| **Output** | Notebook or analysis script; chart set; findings memo; data-quality notes |
| **Required caps** | Nest; ANALYZE foundation Stages (SQL/tables, visualization basics) |
| **Evidence** | Reproducible analysis + memo; disclose assumptions |
| **Review** | Rubric on method honesty, clarity, privacy awareness — not model hype |
| **Integrity** | Seeded dataset version; no scraped personal data |
| **Privacy / safety** | Synthetic/public-safe data only; PDPL-aware handling themes |
| **Effort** | Medium |
| **Tooling** | Spreadsheet and/or notebook; SQL lab |
| **Team roles** | Solo |
| **Public portfolio suitability** | Yes — if dataset license allows |

---

## CAP-CXW-001 — Secure Delivery Integration Studio (CXW-001)

| Field | Content |
|-------|---------|
| **Linked construct** | CXW-001 Secure Application Delivery — **NOT LOCKED** |
| **Problem** | A small app change must be delivered with practical security checks integrated into the workflow |
| **Learner role** | Contributor responsible for secure delivery integration (scenario only) |
| **Output** | App change Evidence + security checklist results + short integration reflection |
| **Required caps** | Source readiness from BUILD (RC-BLD-001) and PROTECT-relevant secure practice; Integration Readiness (formula pending PROGRESSION.1) |
| **Evidence** | Combined Evidence proving *integration*, not sequential topic browsing |
| **Review** | Dual rubric: delivery quality + secure practice depth |
| **Integrity** | Atlas-aligned combination; reject badge-only “secure” labeling |
| **Privacy / safety** | No real secrets; dependency/CVE handling in lab scope only |
| **Effort** | Medium–High |
| **Tooling** | App sandbox + basic secure-delivery checks (lab) |
| **Team roles** | Solo default; pair optional |
| **Public portfolio suitability** | Yes — with findings sanitized |

---

## CAP-SEX-001 — Harden the Ops Path (SEX-001)

| Field | Content |
|-------|---------|
| **Linked construct** | SEX-001 Secure Cloud Operations Extension — **NOT LOCKED** |
| **Problem** | An operable cloud sample is functional but over-privileged and under-logged |
| **Learner role** | Cloud operator applying secure configuration (scenario only) |
| **Output** | Least-privilege adjustment notes; logging/audit evidence; before/after config diff (sanitized); short risk rationale |
| **Required caps** | RC-OPR-001 core Stages complete (conceptual); Extension Stages |
| **Evidence** | Secure-practice Evidence attached to ops capability — not a full PROTECT Route substitute |
| **Review** | Rubric on privilege reduction quality and observability — not penetration skill |
| **Integrity** | Lab seed uniqueness; no production claims |
| **Privacy / safety** | Sandbox only; secrets never in Evidence |
| **Effort** | Medium |
| **Tooling** | Same ops sandbox + policy/config tools (lab) |
| **Team roles** | Solo |
| **Public portfolio suitability** | Yes — sanitized diffs |

---

## CAP-SKY-001 — Team/Live Sky Delivery Drill (optional)

| Field | Content |
|-------|---------|
| **Linked experience** | Team / Live Sky learning experience (optional concept) — **NOT LOCKED** |
| **Problem** | A time-boxed, facilitator-supported scenario requires coordinated roles to deliver a constrained technical outcome |
| **Learner role** | One of: Operator · Builder · Defender-lite · Coordinator (assigned, scenario only) |
| **Output** | Team Evidence pack: shared timeline, role contributions, individual reflection, integrity attestation |
| **Required caps** | At least one P0 Route in progress or complete; Nest collaboration; Live Sky eligibility rules TBD |
| **Evidence** | Individual contribution Evidence + team artifact; no free-riding |
| **Review** | Facilitator + rubric; contribution checks |
| **Integrity** | Attendance/presence rules; plagiarism across teams monitored |
| **Privacy / safety** | Lab data only; recording/consent rules for Live Sky; no real org secrets |
| **Effort** | Medium (session-bounded) |
| **Tooling** | Live Sky session tools + Route-appropriate sandboxes |
| **Team roles** | **Required** — Operator, Builder, Defender-lite, Coordinator (4); smaller pods allowed with dual-hat rules |
| **Public portfolio suitability** | Individual reflections yes; team pack only with peer consent |

---

## Portfolio coverage check

| Construct | Capstone concept | Status |
|-----------|------------------|--------|
| RC-OPR-001 | CAP-OPR-001 | NOT LOCKED |
| RC-BLD-001 | CAP-BLD-001 | NOT LOCKED |
| RC-PRT-001 | CAP-PRT-001 | NOT LOCKED |
| RC-LED-001 | CAP-LED-001 | NOT LOCKED |
| RC-ANL-001 (alt) | CAP-ANL-001 | NOT LOCKED |
| CXW-001 | CAP-CXW-001 | NOT LOCKED |
| SEX-001 | CAP-SEX-001 | NOT LOCKED |
| Team/Live Sky (opt) | CAP-SKY-001 | NOT LOCKED |

## Explicit non-claims

- Capstone completion does **not** grant employment readiness or Professional Titles.  
- No Product Codes assigned in LEARNING.1A.  
- No vendor, government, or framework endorsement implied.
