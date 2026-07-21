# CXW-001 — Secure Application Delivery Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-CXW-001-ARCH |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — WITH REQUIRED BRIDGE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [LAUNCH-CROSS-WING-STUDY.md](./LAUNCH-CROSS-WING-STUDY.md) · [CROSS-WING-VS-SECURE-EXTENSION.md](../architecture/CROSS-WING-VS-SECURE-EXTENSION.md) · [ROUTE-ARCHITECTURE-STANDARD.md](../architecture/ROUTE-ARCHITECTURE-STANDARD.md) · [STAGE-ARCHITECTURE-STANDARD.md](../architecture/STAGE-ARCHITECTURE-STANDARD.md) · [MISSION-CATEGORY-REGISTRY.md](../architecture/MISSION-CATEGORY-REGISTRY.md) · [LEARNING-IDENTIFIER-STANDARD.md](../architecture/LEARNING-IDENTIFIER-STANDARD.md) · [SHARED-CAPABILITY-REGISTRY.md](../architecture/SHARED-CAPABILITY-REGISTRY.md) · [RT-BLD-001](../routes/architecture/RT-BLD-001-WEB-APPLICATION-DELIVERY.md) · [RT-PRT-001](../routes/architecture/RT-PRT-001-DEFENSIVE-SECURITY-OPERATIONS.md) · [RT-LED-001](../routes/architecture/RT-LED-001-TECHNOLOGY-DELIVERY-RISK.md) · [SEX-001](../secure-extensions/SEX-001-SECURE-CLOUD-OPERATIONS-ARCHITECTURE.md) |
| **Source research** | CXW-001 (GHV.LEARNING.1A) |
| **Limitations** | Working title; no Product Code; no XP / Mastery / Prestige formulas; not final catalogue lock; does **not** duplicate SEX-001 or full RT-PRT-001 |
| **Unresolved** | Exact Integration Readiness thresholds (PROGRESSION.1); Mission scripts (1C); Bridge Mission detail (1C); 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1B architecture |
| **Architecture score** | **85** (architecture-review evidence only — not final selection) |

```text
Challenge outcome: VALID WITH REQUIRED BRIDGE
Status: ARCHITECTURE RECOMMENDED — WITH REQUIRED BRIDGE
Never final LOCKED in this Gate.
```

---

## Challenge outcome

| Field | Content |
|-------|---------|
| **Challenge** | Does CXW-001 genuinely combine existing capabilities into a distinct secure-delivery outcome? |
| **Outcome (exact)** | **VALID WITH REQUIRED BRIDGE** |
| **Required Bridge** | **BRG-PRT-BLD-01** — Application-Security-for-Delivery |
| **Why not ARCHITECTURALLY VALID alone** | RT-PRT-001 supplies defensive ethics, threat/control literacy, and investigation discipline — **not** a focused appsec-for-delivery unit (secure SDLC hygiene, dependency/secret handling in build context, seeded finding remediation on an app change). Without the Bridge, CXW would either over-scope into a PROTECT rewrite or under-scope into BUILD + tip-sheet security. |
| **Why not RESEARCHED ALTERNATIVE REQUIRED** | BUILD + PROTECT (+ genuine LEAD release-risk) remains the right launch Cross-Wing; the Bridge preserves CXW-001 research without silent replacement or Scope change. |

---

## Identity

| Field | Content |
|-------|---------|
| **Canonical ID** | **CXW-001** |
| **Prior candidate ID** | CXW-001 (1A study) |
| **Working title** | Secure Application Delivery |
| **Construct type** | CROSS_WING_ROUTE |
| **Source Horizons** | **HRZ-BLD** · **HRZ-PRT** · **HRZ-LED** (release-risk contribution only — not a third full Route enrollment) |
| **Capability statement** | Plan, deliver, and verify a small web application change through a security-conscious delivery lifecycle: threat-aware planning, secure build practices via Bridge, security verification with seeded findings, and a release decision with residual-risk handoff — without claiming full AppSec engineer or SOC mastery. |
| **Capability type** | INTEGRATIVE · BUILDING · SECURITY |
| **Target learner** | Learners with BUILD + selected PROTECT source readiness aiming at secure delivery integration (scenario roles only) |
| **Distinct from** | RT-BLD-001 alone · RT-PRT-001 alone · SEX-001 (OPERATE secure ops) · BUILD + any Secure Extension |

---

## Source requirements

| Source | Role | Required depth |
|--------|------|----------------|
| **RT-BLD-001** | Primary BUILD source | Foundation Stages complete (or declared equivalents) — delivery, repo hygiene, test/env literacy, delivery docs |
| **RT-PRT-001** | Primary PROTECT source | Selected Stages: ethics · assets/threats/controls · triage discipline (not full SOC track as CXW content) |
| **BRG-PRT-BLD-01** | **Required Bridge** | Focused Application-Security-for-Delivery — **not** a PRT Route rewrite |
| **RT-LED-001** | Genuine LEAD release-risk | Selected risk / decision / residual-risk practices (**SHC-010** authoritative); **RECOMMENDED** / slice — not mandatory full LED Route |
| **RT-OPR-001** | Cloud ops | **RECOMMENDED** for handoff language only — **not** PREREQUISITE or COREQUISITE |

### Nest / Unlock

| Field | Content |
|-------|---------|
| **Nest** | Union of RT-BLD-001 and RT-PRT-001 required Nest caps (see Nest Dependency Map); Nest band alone insufficient |
| **Learning Unlock** | **ULK-CXW-001** eligibility → CXW entry checks still subject to Final Access Decision |
| **Access formula thresholds** | PENDING GHV.PROGRESSION.1 — not invented here |

---

## Required Bridge — BRG-PRT-BLD-01

| Field | Content |
|-------|---------|
| **Bridge ID** | **BRG-PRT-BLD-01** |
| **Working title** | Application-Security-for-Delivery |
| **Direction** | PROTECT concepts → BUILD delivery context |
| **Purpose** | Supply focused appsec-for-delivery capabilities missing from RT-PRT-001 defensive ops foundations |
| **Includes (architecture scope)** | Threat-aware feature notes · dependency / secret hygiene in repo & pipeline context · secure config checklist for lab apps · seeded finding intake · proportionate remediation · residual-risk language for release |
| **Excludes** | Full AppSec career track · red-team / offensive content · full RT-PRT-001 rewrite · SEX-001 cloud hardening curriculum · live third-party targets |
| **Graph role** | `BRIDGE` (mandatory for CXW-001 progression into STG-02+) |
| **Authoritative teaching** | Bridge owns the appsec-for-delivery unit; CXW Stages **reinforce** in Integration context — do not duplicate as a second full unit |

---

## Entry / Exit

| Field | Content |
|-------|---------|
| **Entry** | ULK-CXW-001 learning eligibility · RT-BLD-001 source readiness · selected RT-PRT-001 Stage readiness · Nest rules per Nest Dependency Map · lab safety / ethics brief |
| **Exit** | All four CXW Stages complete **and** required Evidence accepted **and** Integration Mission complete **and** Capstone eligible (`CXW-001-CAP-01`) |
| **Prerequisites** | RT-BLD-001 foundation path · selected RT-PRT-001 Stages · **BRG-PRT-BLD-01** before / with STG-02 |
| **Corequisites** | None hard-required beyond Bridge |
| **Recommended** | RT-LED-001 risk/decision slice (SHC-010) · RT-OPR-001 observability vocabulary · SHC-002 · SHC-005 · SHC-008 |

---

## Stage table (4 Stages) — Gate §33

| Stage ID | Title | Outcomes | Mission categories | Evidence contribution | Remediation | Next Unlock |
|----------|-------|----------|--------------------|----------------------|-------------|-------------|
| **CXW-001-STG-01** | Threat-aware planning | Frame the delivery change; produce threat-aware plan notes; map assets/abuse cases at feature scope; state lab safety and residual-risk posture | ORIENTATION · KNOWLEDGE · DESIGN · SCENARIO · DOCUMENTATION | Feeds **CXW-001-EVD-01** | Planning rewrite; Nest scam/privacy Micro-Mission if weak | Unlocks STG-02; Bridge entry check |
| **CXW-001-STG-02** | Secure build via Bridge | Apply **BRG-PRT-BLD-01** practices to the change: secret/dependency hygiene; secure config checklist; implement change without unsafe commits | GUIDED_PRACTICE · LABORATORY · INDEPENDENT_PRACTICE · DOCUMENTATION | Feeds **CXW-001-EVD-02** (build + Bridge checklist) | Bridge Micro-Mission; LOCAL-SAFE lab reset; secret-redaction drill | Unlocks STG-03 |
| **CXW-001-STG-03** | Security verification | Run basic secure checks; intake and remediate a **seeded** finding; record verification Evidence; disclose AI-assist | LABORATORY · ANALYSIS · INTEGRATION · ASSESSMENT · EVIDENCE_PREPARATION | **CXW-001-EVD-02** remediation log · feeds **EVD-03** | Seeded-finding retry; guided verification drill | Unlocks STG-04; Integration Mission active |
| **CXW-001-STG-04** | Release decision & handoff | Make go/no-go with residual risk; write release notes + ops-aware handoff; assemble integrated Evidence pack | SCENARIO · DOCUMENTATION · INTEGRATION · EVIDENCE_PREPARATION · ASSESSMENT | **CXW-001-EVD-03**; Capstone eligibility | Decision-record revision; SHC-010 risk refresh | Unlocks **CXW-001-CAP-01** |

**§33 note:** Four Stages (not five) is intentional for Cross-Wing compression around Integration — Capstone is separate (`CXW-001-CAP-01`), not a fifth Stage.

---

## Integration Mission position

| Field | Content |
|-------|---------|
| **Position** | Spans **STG-03 → STG-04**; must force **combined** BUILD + PROTECT(+Bridge) practice — not sequential topic browsing |
| **Mission category** | **INTEGRATION** (primary) with LABORATORY / SCENARIO support |
| **Concept** | Ship a small app feature in controlled lab: implement change · run static/basic checks · remediate seeded finding · document residual risk · produce release notes + Evidence pack |
| **Graph** | `CONVERGENCE` of RT-BLD-001 + RT-PRT-001 (+ Bridge) into CXW Integration |
| **Not** | A substitute Capstone; Capstone (`CXW-001-CAP-01`) reviews the integrated Evidence bundle |

---

## Evidence anchors (distinct from SEX-001)

| ID | Title | Artifact class | Stage contribution | Integrity | Review |
|----|-------|----------------|--------------------|-----------|--------|
| **CXW-001-EVD-01** | Threat-aware delivery plan | Feature threat notes + abuse cases + scope | STG-01 | Scenario/feature seed; no generic paste | Plan realism + proportionality |
| **CXW-001-EVD-02** | Secure build & remediation | Repo/lab delta · Bridge checklist · seeded finding log | STG-02 · STG-03 | Unique finding seed; original commits; AI disclosure | Delivery + secure practice dual rubric |
| **CXW-001-EVD-03** | Release & residual-risk pack | Go/no-go · residual risk · release notes · handoff | STG-03 · STG-04 | Sandbox only; no real secrets/PII | Integration completeness |

**Distinct from SEX:** CXW Evidence proves **secure application delivery integration** (app change + finding + release decision). SEX Evidence proves **cloud ops hardening** (IAM/secrets/config diffs on an OPERATE host). No shared mandatory EVD IDs.

---

## Capstone

| Field | Content |
|-------|---------|
| **Capstone ID** | **CXW-001-CAP-01** |
| **Concept link** | CAP-CXW-001 Secure Delivery Integration Studio (1A) — no full instructions here |
| **Eligibility** | STG-01…04 complete + EVD-01…03 accepted + Integration Mission complete |
| **Output shape** | App change Evidence · security checklist/verification · remediated finding · residual-risk reflection · release/handoff notes |
| **Category** | CAPSTONE |
| **Does not award** | Professional title · full PROTECT completion · SEX completion · XP |

---

## Semantic-coherence test (Gate §26) — explicit answers

| # | Question | Answer |
|---|----------|--------|
| **1** | Does Defensive Security Operations provide the right source capabilities? | **Partially — necessary but not sufficient.** RT-PRT-001 correctly supplies defensive ethics, asset/threat/control framing, and triage discipline that inform verification and residual-risk documentation. It does **not** teach focused application-security-for-delivery. Treating PRT alone as the security source would mis-scope CXW toward SOC content or leave a delivery-appsec hole. |
| **2** | Does the candidate require a focused application-security Bridge? | **Yes.** **BRG-PRT-BLD-01 Application-Security-for-Delivery** is **required**. Challenge outcome: **VALID WITH REQUIRED BRIDGE**. The Bridge is a focused appsec unit — **not** a full PRT Route rewrite. |
| **3** | Does Cloud Operations need to be a prerequisite, corequisite or recommendation? | **Recommendation only.** RT-OPR-001 helps handoff/observability vocabulary in STG-04 but is **not** a hard PREREQUISITE or COREQUISITE. CXW remains BUILD+PROTECT(+Bridge) centered; ops security depth belongs to **SEX-001**. |
| **4** | Does LEAD contribute a real release-risk capability? | **Yes, where genuine.** Release go/no-go, residual-risk acceptance, and decision records reuse **SHC-010** / selected RT-LED-001 practices. This is a real contribution to STG-04 — **not** forced multidisciplinary padding and **not** mandatory full LED Route enrollment. |
| **5** | Is the outcome distinct from completing BUILD plus a Secure Extension? | **Yes.** BUILD + SEX-001 yields delivery foundations plus **OPERATE** secure-ops hardening — not an integrated secure **application delivery** capability with threat-aware planning, Bridge-backed build, seeded finding remediation, and release decision Evidence. SEX does not create CXW’s multidisciplinary delivery identity. |
| **6** | Can the result be reviewed through integrated Evidence? | **Yes.** EVD-01…03 form one integrated pack reviewed on a dual rubric (delivery quality + secure practice depth). Capstone reviews integration, not sequential topic checklists. |

---

## Shared capability reuse

| SHC | Role in CXW |
|-----|-------------|
| SHC-001 Documentation | Reinforce in plan / release notes |
| SHC-002 Version control | Reinforce from RT-BLD-001 |
| SHC-005 Responsible AI assistance | Disclosure on code/security prose |
| SHC-006 Privacy | Demo data / Evidence redaction |
| SHC-008 Evidence integrity | Capstone pack integrity |
| SHC-010 Risk awareness | Authoritative for release-risk language |
| SHC-012 Change management | Handoff / change note reinforce |

Do not redefine these as CXW-owned full units.

---

## Distinctions

| Construct | Relationship |
|-----------|--------------|
| **RT-BLD-001** | Source Route — delivery foundations only; no CXW duplication |
| **RT-PRT-001** | Source Route — defensive foundations; not the Integration Mission |
| **SEX-001** | Separate OPERATE Extension — complementary Horizon story; **no** identical mandatory Stages/EVD |
| **Full PROTECT** | CXW ≠ PROTECT completion |

---

## Tooling

| Field | Content |
|-------|---------|
| **Primary classes** | LOCAL-SAFE · CONTAINERIZED · BROWSER-ONLY preview · optional CLOUD-SANDBOX for handoff demos |
| **Examples (non-lock)** | Git · lab app stack · OWASP-oriented checklists · free/open SAST/dependency scan tiers |
| **Avoid** | Live exploit targets · production tenants · device farms · proprietary IDE hard locks |

---

## Safety

- Lab-only targets; no live attacks against third parties  
- No credential harvesting; fake/demo secrets only  
- No offensive exploitation instructions  
- AI-assist disclosure required on code and security prose  
- Residual risk must be stated honestly — no false assurance  

---

## Arabic-first / Freshness / Expert review

| Area | Posture |
|------|---------|
| **Arabic-first** | High feasibility for narratives/checklists; English retained for code/tooling strings; RTL-aware docs |
| **Stable** | Threat-aware planning discipline; residual-risk / release decision pattern |
| **Slow-changing** | Secure delivery checklist structure |
| **Fast** | Scanner UIs / CVE pattern examples — keep thin; pin lab seeds |
| **Expert review** | AppSec practitioner + delivery engineer; Arabic QA if localized; safety review on seeded findings |

---

## Professional value (qualitative)

Visible secure-delivery trail: plan → secure change → remediated finding → release decision. Scenario role relevance only — **no employment, certification, or title claims** in this Gate.

---

## Unresolved

1. Integration Readiness / Mastery / Trust numeric thresholds (PROGRESSION.1)  
2. Bridge Mission scripts and seed packs (1C)  
3. Dual-rubric reviewer capacity model  
4. Exact LED slice vs RECOMMENDED packaging (1C/1D)  
5. Final catalogue lock (1D)  

---

## Stage review table (Gate §33)

| Stage ID | Outcomes clarity | Category fit | Evidence contribution | Remediation path | Unlock coherence | Safety | A11y | Integrity | Offline / tooling | Reviewer | Verdict |
|----------|------------------|--------------|----------------------|------------------|------------------|--------|------|-----------|-------------------|----------|---------|
| STG-01 | Clear | OK | EVD-01 | Defined | OK | Pass | Pass | Pass | High docs | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-02 | Clear | OK | EVD-02 | Defined (Bridge) | OK | Pass | Pass | Pass | LOCAL-SAFE | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-03 | Clear | OK (INTEGRATION) | EVD-02/03 | Defined | OK | Pass | Watch (tool UI) | Pass | Med (scanners) | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-04 | Clear | OK (INTEGRATION) | EVD-03 | Defined | OK | Pass | Pass | Pass | High docs | Founder (RAVEN) | **ARCHITECTURE OK** |

**§33 aggregate:** Stage count **4/4** · All Stages **ARCHITECTURE OK** · Challenge outcome **VALID WITH REQUIRED BRIDGE** · Status **ARCHITECTURE RECOMMENDED — WITH REQUIRED BRIDGE** (not LOCKED) · Architecture score **85**.
