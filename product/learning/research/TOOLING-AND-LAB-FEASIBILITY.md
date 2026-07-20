# Tooling and Lab Feasibility

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-TOOL-001 |
| **Version** | 1.0.0 |
| **Status** | RESEARCH BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1A |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [LEARNING-RESEARCH-METHODOLOGY.md](./LEARNING-RESEARCH-METHODOLOGY.md) · [ROUTE-CANDIDATE-REGISTER.md](../routes/ROUTE-CANDIDATE-REGISTER.md) · [LAUNCH-CROSS-WING-STUDY.md](../cross-wing/LAUNCH-CROSS-WING-STUDY.md) · [LAUNCH-SECURE-EXTENSION-STUDY.md](../secure-extensions/LAUNCH-SECURE-EXTENSION-STUDY.md) · [LAUNCH-EVIDENCE-VALUE-MATRIX.md](../evidence/LAUNCH-EVIDENCE-VALUE-MATRIX.md) · [NEST-DEPENDENCY-MAP.md](../nest/NEST-DEPENDENCY-MAP.md) |
| **Limitations** | Vendor pricing and free-tier policies change; regional availability not fully surveyed; no provider contracts; assessments are research judgments for launch capacity — not procurement decisions |
| **Unresolved** | Primary cloud vendor shortlist · container hosting provider · Arabic tooling QA · mobile lab parity Spike · abuse-monitoring ops model · GHV.LEARNING.1D lock |
| **Change history** | 1.0.0 (2026-07-21) — Initial RESEARCH BASELINE for GHV.LEARNING.1A |

## Purpose

Classify tooling patterns and assess lab feasibility for the recommended launch portfolio. **Prefer avoiding expensive specialized labs at launch.** Favor browser-safe, local-safe, and small containerized / free-tier cloud sandboxes with hard quotas.

## Tooling classes (taxonomy)

| Class | Definition | Launch posture |
|-------|------------|----------------|
| **BROWSER-ONLY** | Runs in browser; no local install | Prefer for Nest + LEAD + many reflections |
| **LOCAL-SAFE** | Learner device; sandboxed; no privileged host breakout expected | Prefer for BUILD starters |
| **CONTAINERIZED** | Disposable containers/VMs under GHURAVIA or approved host | Prefer for OPERATE/PROTECT practice |
| **CLOUD-SANDBOX** | Time-boxed cloud accounts with quotas/guardrails | Prefer for RC-OPR-001 / SEX-001 |
| **SPECIALIZED-LAB** | Dedicated cyber ranges, hardware kits, licensed suites | **Avoid at launch** unless no alternative |
| **HUMAN-FACILITATED** | Live mentor / Live Sky / Team session dependency | Use sparingly for Integration / Capstone review |

A Mission may combine classes (e.g., CLOUD-SANDBOX + BROWSER-ONLY checklist).

## Assessment dimensions

| Dimension | Focus |
|-----------|-------|
| **Cost** | Fixed + per-learner variable |
| **Availability** | Always-on vs scheduled |
| **Licensing** | OSS / free tier / paid / education |
| **Hardware** | Learner device requirements |
| **Mobile** | Feasible on phone/tablet? |
| **Safety** | Breakout, secrets, outbound scan risk |
| **Abuse** | Crypto mining, spam, scanning third parties |
| **Reset** | Clean slate speed |
| **Maintenance** | Image/content drift |
| **Regional** | Saudi / MENA access, latency, payment |
| **Vendor lock-in** | Portability of skills & labs |
| **A11y** | Keyboard, screen reader, RTL, low-bandwidth |

---

## Portfolio shortlist (RECOMMENDED — NOT YET LOCKED)

### RC-OPR-001 — Cloud Systems Operations Foundations

| Field | Assessment |
|-------|------------|
| **Primary classes** | CLOUD-SANDBOX · CONTAINERIZED · BROWSER-ONLY (docs/checklists) |
| **Avoid** | SPECIALIZED-LAB cyber ranges; unrestricted cloud |
| **Cost** | **Med** — free/education tier + hard spend caps; container fallback lowers cost |
| **Availability** | High if sandbox pool sized; queue when exhausted |
| **Licensing** | Cloud free tier + OSS CLIs; abstract vendor in content |
| **Hardware** | Modest laptop; browser sufficient for many Missions |
| **Mobile** | **Low–Med** — consoles poor on phone; provide read/reflect mobile path |
| **Safety** | Quotas · deny outbound attack tooling · no prod tenants |
| **Abuse** | Metering · idle shutdown · block mining images |
| **Reset** | Snapshot/reimage ≤15 min target (aspirational ops metric) |
| **Maintenance** | **Med–High** — console UI churn |
| **Regional** | Validate Saudi-accessible regions/endpoints |
| **Vendor lock-in** | **Med** — teach portable concepts; one primary vendor for launch simplicity |
| **A11y** | Prefer keyboard flows; caption demos; RTL copy structure |

**Launch recommendation:** One primary cloud sandbox + optional local container emulator for offline/cost backup. No specialized range.

### RC-BLD-001 — Web Application Delivery Foundations

| Field | Assessment |
|-------|------------|
| **Primary classes** | LOCAL-SAFE · CONTAINERIZED · BROWSER-ONLY (preview) |
| **Avoid** | SPECIALIZED-LAB device farms; paid IDE locks |
| **Cost** | **Low–Med** — OSS stack; optional shared preview host |
| **Availability** | High |
| **Licensing** | OSS frameworks; avoid proprietary IDE requirements |
| **Hardware** | Laptop with ≥8GB RAM preferred; offer cloud IDE **CONDITIONAL** if device gap proven |
| **Mobile** | **Low** for coding; **High** for reading/review |
| **Safety** | No learner-owned public exploit targets; sandbox previews |
| **Abuse** | Rate-limit preview hosts; block crypto miners in build packs |
| **Reset** | Git clean + container rebuild |
| **Maintenance** | **Med** — framework churn (Slow-Changing Practice + Fast-Changing slices) |
| **Regional** | npm/registry mirrors may matter; document fallbacks |
| **Vendor lock-in** | **Low** if OSS |
| **A11y** | Captioned demos; keyboard editor; avoid mouse-only instructions |

**Launch recommendation:** Local-safe starter + containerized sample app. Defer mobile device farms.

### RC-PRT-001 — Defensive Security Operations Foundations

| Field | Assessment |
|-------|------------|
| **Primary classes** | CONTAINERIZED · BROWSER-ONLY (case sims) · HUMAN-FACILITATED (optional review) |
| **Avoid** | SPECIALIZED-LAB full SOC platforms at launch; live Internet attack labs |
| **Cost** | **Low–Med** — synthetic alert packs in containers beat SIEM licenses |
| **Availability** | High for packaged scenarios |
| **Licensing** | Prefer OSS/log samples; no mandatory enterprise SIEM |
| **Hardware** | Modest; browser for many triage Missions |
| **Mobile** | **Med** for case write-ups; **Low** for lab consoles |
| **Safety** | **Critical** — lab-only; no third-party scanning; ethics gates |
| **Abuse** | Disable offensive tooling images; monitor egress |
| **Reset** | Scenario redeploy |
| **Maintenance** | **Med** — TTPs drift; keep foundations stable |
| **Regional** | Threat intel feeds optional; not required for foundations |
| **Vendor lock-in** | **Low** if vendor-neutral triage language |
| **A11y** | Structured forms over dense dashboards |

**Launch recommendation:** Packaged defensive scenarios in containers + browser case sims. **Do not** buy a commercial cyber range for launch foundations.

### RC-LED-001 — Technology Delivery & Risk Foundations

| Field | Assessment |
|-------|------------|
| **Primary classes** | BROWSER-ONLY · HUMAN-FACILITATED (optional Live Sky critique) |
| **Avoid** | SPECIALIZED-LAB; heavy project tools requiring paid seats |
| **Cost** | **Low** |
| **Availability** | High |
| **Licensing** | Templates OSS/internal; no PMI/cert vendor lock |
| **Hardware** | Any modern browser device |
| **Mobile** | **High** |
| **Safety** | Low technical risk; scenario ethics (no real org secrets) |
| **Abuse** | Low |
| **Reset** | N/A (document Missions) |
| **Maintenance** | **Low** |
| **Regional** | High — content localization is the main work |
| **Vendor lock-in** | **Low** |
| **A11y** | **High** potential |

**Launch recommendation:** Browser templates + optional facilitated review sessions. Ideal low-cost Route.

### RC-ANL-001 — Practical Data Analysis Foundations (optional alt)

| Field | Assessment |
|-------|------------|
| **Primary classes** | BROWSER-ONLY · LOCAL-SAFE (spreadsheet/notebook) |
| **Avoid** | SPECIALIZED-LAB GPU clusters; paid BI suites as hard deps |
| **Cost** | **Low** — synthetic datasets + spreadsheet/OSS notebook |
| **Availability** | High |
| **Licensing** | OSS notebooks; spreadsheet learners welcome |
| **Hardware** | Modest; large data banned by design |
| **Mobile** | **Med** for spreadsheet viewers; limited for notebooks |
| **Safety** | Synthetic data only |
| **Abuse** | Low |
| **Reset** | Re-download seed dataset |
| **Maintenance** | **Low–Med** |
| **Regional** | Good |
| **Vendor lock-in** | **Low** if tool-agnostic tasks |
| **A11y** | Dual path spreadsheet + notebook |

**Launch recommendation:** Synthetic data + browser/local tools. No Spark clusters at launch.

### CXW-001 — Secure Application Delivery

| Field | Assessment |
|-------|------------|
| **Primary classes** | LOCAL-SAFE / CONTAINERIZED app · BROWSER-ONLY checklists · optional free-tier SAST |
| **Avoid** | SPECIALIZED-LAB AppSec suites with high seat cost; live target practice |
| **Cost** | **Med** — combine BUILD labs + seeded findings; free/open scanners |
| **Availability** | High if containerized Integration Mission |
| **Licensing** | OWASP-oriented checklists (summarized) · OSS scanners |
| **Hardware** | Same as RC-BLD-001 |
| **Mobile** | Low for Integration Mission execution |
| **Safety** | Lab-only targets; no credential harvesting against real orgs |
| **Abuse** | Scanner egress allowlists |
| **Reset** | Re-seed finding + rebuild app |
| **Maintenance** | **Med–High** — tool UI + vuln pattern drift |
| **Regional** | Scanner download mirrors |
| **Vendor lock-in** | **Med** if one scanner branded; keep checklist-first |
| **A11y** | Scaffold Integration Mission steps |

**Launch recommendation:** Containerized vulnerable-by-seed app + OSS checks. Defer commercial AppSec platforms.

### SEX-001 — Secure Cloud Operations Extension

| Field | Assessment |
|-------|------------|
| **Primary classes** | CLOUD-SANDBOX · BROWSER-ONLY checklists · CONTAINERIZED policy sims where cloud cost spikes |
| **Avoid** | SPECIALIZED-LAB multi-cloud war rooms; unrestricted IAM on shared orgs |
| **Cost** | **Med** — same pool as RC-OPR-001 with stricter guardrails |
| **Availability** | Tied to sandbox pool |
| **Licensing** | Cloud free tier + summarized CIS-inspired checklists (non-proprietary paraphrase) |
| **Hardware** | Browser-capable device |
| **Mobile** | Low–Med |
| **Safety** | Isolated tenants; no scanning unauthorized accounts |
| **Abuse** | Strict IAM · spend caps · idle kill |
| **Reset** | Account reimage / org recycle |
| **Maintenance** | **Med–High** |
| **Regional** | Same as OPR-001 validation |
| **Vendor lock-in** | **Med** — portable control language mandatory |
| **A11y** | Guided console tours + text checklists |

**Launch recommendation:** Reuse OPR-001 sandbox with Extension guardrail profile. No separate expensive range.

---

## Nest tooling (foundations)

| Field | Assessment |
|-------|------------|
| **Primary classes** | BROWSER-ONLY · light LOCAL-SAFE |
| **Cost** | **Low** |
| **Specialized labs** | **Not required** |
| **Notes** | Assessment + Micro-Missions should run without cloud spend; optional device MFA demos remain browser/app-based |

## Portfolio cost posture (summary)

| ID | Launch lab cost band | Specialized lab needed? |
|----|----------------------|-------------------------|
| Nest | Low | No |
| RC-OPR-001 | Med | No |
| RC-BLD-001 | Low–Med | No |
| RC-PRT-001 | Low–Med | No — avoid |
| RC-LED-001 | Low | No |
| RC-ANL-001 | Low | No |
| CXW-001 | Med | No — avoid |
| SEX-001 | Med | No — reuse OPR sandbox |

## Abuse and safety baseline (all cloud/container labs)

1. Time-boxed credentials; automatic expiry.  
2. Egress policies blocking third-party attack traffic.  
3. Secret scanning on Evidence upload.  
4. Spend and CPU quotas with kill switches.  
5. Clear Acceptable Use + Explainable Lock on violation.  
6. Reset runbooks owned by ops before launch.

## Explicit non-goals

- No Nest band or progression formula changes.
- No procurement contracts in this Gate.
- No mandatory SPECIALIZED-LAB for the recommended launch set.

## Next Gates

| Gate | Expected work |
|------|----------------|
| Technical Spike | Sandbox provider + reset SLA evidence |
| GHV.LEARNING.1B | Bind Missions to tooling classes in catalogue drafts |
| GHV.LEARNING.1D | Lock tooling assumptions with Route catalogue |
)

