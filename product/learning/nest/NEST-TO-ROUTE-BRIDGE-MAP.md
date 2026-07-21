# Nest-to-Route Bridge Map

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-NEST-BRG-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Review date** | Before GHV.LEARNING.1D |
| **Related** | [NEST-CAPABILITY-REGISTRY.md](./NEST-CAPABILITY-REGISTRY.md) · [NEST-DEPENDENCY-MAP.md](./NEST-DEPENDENCY-MAP.md) · [LEARNING-ELIGIBILITY-OVERLAY.md](../architecture/LEARNING-ELIGIBILITY-OVERLAY.md) · [REMEDIATION-ARCHITECTURE.md](../architecture/REMEDIATION-ARCHITECTURE.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.5 |
| **Limitations** | Bridge nodes are architecture recommendations; Micro-Mission content unresolved (1C); Routes not LOCKED; no Product Codes |
| **Unresolved** | Exact Micro-Mission IDs · bilingual assessment items · Integration Readiness numeric detail (PROGRESSION.1 / 1D) |
| **Change history** | 1.0.0 (2026-07-21) — Nest→Route bridge map for GHV.LEARNING.1B |

## Purpose

For each launch portfolio construct, define required / recommended Nest capabilities, Guided Skip treatment, Micro-Mission triggers, Bridge IDs, retest behavior, and blocked advanced entry — **without changing Nest thresholds 70 / 50**.

## Nest bands (LOCKED — unchanged)

| Result | Label |
|--------|-------|
| ≥ 70% | Ready to Fly |
| 50%–69% | Guided Skip |
| < 50% | Nest Recommended |

## Legend

| Field | Meaning |
|-------|---------|
| **Required Nest caps** | Weakness → Micro-Mission (Guided Skip) or Nest path before claiming Route readiness |
| **Recommended Nest caps** | Strengthen before / early in Route; optional reviews under Ready to Fly |
| **Guided Skip treatment** | Whether 50%–69% may enter **with** Micro-Missions + remaining advanced prereqs |
| **Micro-Mission trigger** | Which required-cap gaps insert Micro-Missions |
| **Bridge ID** | Optional Nest→Route connector (`BRG-NEST-*`); empty if Micro-Missions alone suffice |
| **Retest** | When Nest readiness retest is offered / required |
| **Blocked advanced entry** | What stays gated despite Nest skip / Guided Skip |

---

## RT-OPR-001 — Cloud Systems Operations Foundations

| Field | Content |
|-------|---------|
| **Required Nest caps** | NST-CAP-001 · NST-CAP-004 · NST-CAP-005 · NST-CAP-006 · NST-CAP-007 · NST-CAP-008 · NST-CAP-012 |
| **Recommended Nest caps** | NST-CAP-002 · NST-CAP-003 · NST-CAP-009 · NST-CAP-010 · NST-CAP-011 · NST-CAP-013 |
| **Guided Skip treatment** | **Proceed allowed** — Micro-Missions mandatory on any required-cap gap |
| **Micro-Mission trigger** | Weak NST-CAP-005/006 before console labs · NST-CAP-004 cloud sharing · NST-CAP-007 connectivity triage · NST-CAP-012 document-your-steps · NST-CAP-008 privacy of ops notes |
| **Bridge ID** | **BRG-NEST-OPR-01** — optional OS/network foundations refresh when Nest device/connectivity weak and Route networking Stage imminent |
| **Retest** | Offered after Nest path or Micro-Mission cluster; Ready to Fly skip does not require retest to enter Route; retest recommended after long inactivity (remediation source) |
| **Blocked advanced entry** | Advanced Mastery / Route-Proven / SEX-001 — Nest skip never waives Stage gates or Extension prereqs |

## RT-BLD-001 — Web Application Delivery Foundations

| Field | Content |
|-------|---------|
| **Required Nest caps** | NST-CAP-003 · NST-CAP-004 · NST-CAP-005 · NST-CAP-010 · NST-CAP-011 · NST-CAP-012 |
| **Recommended Nest caps** | NST-CAP-001 · NST-CAP-002 · NST-CAP-006 · NST-CAP-007 · NST-CAP-008 · NST-CAP-009 · NST-CAP-013 |
| **Guided Skip treatment** | **Proceed allowed** — Micro-Missions on required-cap gaps |
| **Micro-Mission trigger** | Weak NST-CAP-004 file/project discipline · NST-CAP-003 browser literacy · NST-CAP-005 credential safety · NST-CAP-012 structured debug · NST-CAP-011 attribution · NST-CAP-010 AI-assist labeling |
| **Bridge ID** | **BRG-NEST-BLD-01** — HTML/CSS literacy Micro-Bridge when Route defines web literacy gap (does not replace Nest caps) |
| **Retest** | Same as OPR — optional after remediation; required only if policy marks Micro-Mission incomplete under Explainable Lock |
| **Blocked advanced entry** | CXW-001 Integration · advanced BUILD Stages that list non-Nest prereqs |

## RT-PRT-001 — Defensive Security Operations Foundations

| Field | Content |
|-------|---------|
| **Required Nest caps** | NST-CAP-003 · NST-CAP-005 · NST-CAP-006 · NST-CAP-007 · NST-CAP-008 · NST-CAP-009 · NST-CAP-010 · NST-CAP-012 |
| **Recommended Nest caps** | NST-CAP-001 · NST-CAP-002 · NST-CAP-004 · NST-CAP-011 · NST-CAP-013 |
| **Guided Skip treatment** | **Proceed cautiously** — Micro-Missions **mandatory** on NST-CAP-009 / 005 / 006 / 008 gaps; lab safety brief still required |
| **Micro-Mission trigger** | MFA discipline · scam/phishing · privacy permissions · safe browsing · connectivity vs compromise cues · Evidence-safe troubleshooting · AI overtrust |
| **Bridge ID** | **BRG-NEST-PRT-01** — networking/OS awareness Bridge when Nest connectivity/devices weak (Route still keeps its own networking prereqs) |
| **Retest** | Recommended after safety-critical Micro-Missions; Nest Recommended band must complete Nest or reach ≥ 50% before advanced PROTECT labs |
| **Blocked advanced entry** | Live-range / offensive practice (out of Nest; out of launch safety) · CXW/SE until Route Stage prereqs met · Nest skip ≠ PROTECT Mastery |

## RT-LED-001 — Technology Delivery & Risk Foundations

| Field | Content |
|-------|---------|
| **Required Nest caps** | NST-CAP-003 · NST-CAP-008 · NST-CAP-010 · NST-CAP-011 · NST-CAP-012 · NST-CAP-013 |
| **Recommended Nest caps** | NST-CAP-001 · NST-CAP-002 · NST-CAP-004 · NST-CAP-005 · NST-CAP-006 · NST-CAP-007 · NST-CAP-009 |
| **Guided Skip treatment** | **Proceed allowed** — Micro-Missions on required-cap gaps |
| **Micro-Mission trigger** | Collaboration/handoff · privacy in shared artifacts · AI for summaries vs decisions · source evaluation · structured problem framing · professional identity tone |
| **Bridge ID** | *(none required)* — Micro-Missions suffice; optional **BRG-NEST-LED-01** only if experience-in-another-Route recommendation is packaged as Bridge later |
| **Retest** | Optional after Micro-Missions; experience-in-another-Route remains RECOMMENDED graph edge, not Nest-waived |
| **Blocked advanced entry** | CW Integration risk COREQUISITE still needs LED / shared risk Evidence (SHC-010) — Nest alone insufficient |

## RT-ANL-001 — Practical Data Analysis Foundations (reserve)

| Field | Content |
|-------|---------|
| **Status note** | Launch **reserve** — capacity conditional |
| **Required Nest caps** | NST-CAP-003 · NST-CAP-004 · NST-CAP-008 · NST-CAP-010 · NST-CAP-011 · NST-CAP-012 |
| **Recommended Nest caps** | NST-CAP-001 · NST-CAP-002 · NST-CAP-005 · NST-CAP-006 · NST-CAP-007 · NST-CAP-009 · NST-CAP-013 |
| **Guided Skip treatment** | **Proceed allowed** if Route is activated — Micro-Missions on required-cap gaps |
| **Micro-Mission trigger** | Spreadsheet/file hygiene · source quality · personal data minimization · AI hallucination checks · reproduce-your-steps · shared workbook etiquette |
| **Bridge ID** | **BRG-NEST-ANL-01** — spreadsheet literacy Bridge (Route prerequisite; Nest does not replace it) |
| **Retest** | Optional after Micro-Missions |
| **Blocked advanced entry** | Not in committed launch portfolio unless Change Control + capacity; Nest readiness alone does not activate reserve Route |

## CXW-001 — Secure Application Delivery

| Field | Content |
|-------|---------|
| **Required Nest caps** | Union of RT-BLD-001 **and** RT-PRT-001 required sets: NST-CAP-003 · NST-CAP-004 · NST-CAP-005 · NST-CAP-006 · NST-CAP-007 · NST-CAP-008 · NST-CAP-009 · NST-CAP-010 · NST-CAP-011 · NST-CAP-012 |
| **Recommended Nest caps** | NST-CAP-001 · NST-CAP-002 · NST-CAP-013 |
| **Guided Skip treatment** | **Only if** Guided Skip already allows continuation on **both** source Routes **and** Integration Readiness checks pass — Nest band alone insufficient |
| **Micro-Mission trigger** | Combined BUILD+PROTECT refresh: credential safety · scam hygiene · AI labeling · structured debug · privacy of demo data |
| **Bridge ID** | **BRG-NEST-CXW-01** — Nest weakness cluster Bridge before Integration Mission when residual Nest gaps remain after source Routes |
| **Retest** | Nest retest does not unlock CW; source Route Stage Evidence and Integration Readiness govern entry |
| **Blocked advanced entry** | CXW without RT-BLD-001 + selected RT-PRT-001 prerequisites · Nest Ready to Fly alone · payment alone |

## SEX-001 — Secure Cloud Operations Extension

| Field | Content |
|-------|---------|
| **Required Nest caps** | Same as RT-OPR-001 required set, **elevated emphasis** on NST-CAP-005 · NST-CAP-006 · NST-CAP-008 · NST-CAP-009 |
| **Recommended Nest caps** | NST-CAP-003 · NST-CAP-010 · NST-CAP-011 · NST-CAP-013 |
| **Guided Skip treatment** | **Only after** RT-OPR-001 core Stages (or declared equivalents) in progress/complete per Extension rules — Nest Guided Skip does **not** unlock Extension alone |
| **Micro-Mission trigger** | Secrets never in Evidence · scam/social-engineering against ops roles · privacy of lab logs · MFA before privileged labs |
| **Bridge ID** | **BRG-NEST-SEX-01** — elevated Nest security Micro-Bridge when OPR entry allowed but Nest scam/privacy/MFA still weak |
| **Retest** | Nest retest optional; host Route progress governs Extension eligibility |
| **Blocked advanced entry** | SEX without host RT-OPR-001 capability path · Nest skip alone · treating SEX as full PROTECT Route |

---

## Bridge ID register (Nest-origin)

| Bridge ID | Source | Target | Role |
|-----------|--------|--------|------|
| BRG-NEST-OPR-01 | Nest (NST-CAP-001/007 gaps) | RT-OPR-001 | OS/network foundations refresh |
| BRG-NEST-BLD-01 | Nest + web literacy gap | RT-BLD-001 | HTML/CSS literacy connector |
| BRG-NEST-PRT-01 | Nest (NST-CAP-001/007 gaps) | RT-PRT-001 | Networking/OS awareness before labs |
| BRG-NEST-LED-01 | Nest / cross-Route experience | RT-LED-001 | Optional; deferred packaging |
| BRG-NEST-ANL-01 | Nest + spreadsheet gap | RT-ANL-001 | Spreadsheet literacy (reserve) |
| BRG-NEST-CXW-01 | Nest residual gaps | CXW-001 | Pre-Integration Nest refresh |
| BRG-NEST-SEX-01 | Nest elevated security gaps | SEX-001 | Pre-privileged-lab Nest security |

## Band × advanced entry (summary)

| Band | Foundational Routes | CW / SE / advanced |
|------|---------------------|--------------------|
| Ready to Fly (≥ 70%) | May enter with recommended reviews | Advanced Mastery **not** from skip; CW/SE keep own prereqs |
| Guided Skip (50%–69%) | May enter with Micro-Missions (+ Bridges where listed) | Advanced prereqs **still required** |
| Nest Recommended (< 50%) | Advanced gated Routes unavailable until Nest done or ≥ 50% | CW/SE remain gated |

## Explicit non-goals

- Do not change Nest thresholds.
- Do not invent Mastery / Trust / Merit numeric formulas.
- Do not treat Nest Evidence as Route-Proven.
- Do not lock Routes in this Gate.

## Next Gates

| Gate | Expected work |
|------|----------------|
| GHV.LEARNING.1C | Micro-Mission and Bridge content instances |
| GHV.LEARNING.1D | Lock Nest→Route bridge catalogue |
| GHV.PROGRESSION.1 | Integration Readiness / Trust numeric detail if any |
