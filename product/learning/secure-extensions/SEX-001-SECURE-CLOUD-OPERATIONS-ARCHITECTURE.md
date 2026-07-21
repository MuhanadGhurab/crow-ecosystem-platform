# SEX-001 — Secure Cloud Operations Extension Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-SEX-001-ARCH |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [LAUNCH-SECURE-EXTENSION-STUDY.md](./LAUNCH-SECURE-EXTENSION-STUDY.md) · [CROSS-WING-VS-SECURE-EXTENSION.md](../architecture/CROSS-WING-VS-SECURE-EXTENSION.md) · [ROUTE-ARCHITECTURE-STANDARD.md](../architecture/ROUTE-ARCHITECTURE-STANDARD.md) · [STAGE-ARCHITECTURE-STANDARD.md](../architecture/STAGE-ARCHITECTURE-STANDARD.md) · [MISSION-CATEGORY-REGISTRY.md](../architecture/MISSION-CATEGORY-REGISTRY.md) · [LEARNING-IDENTIFIER-STANDARD.md](../architecture/LEARNING-IDENTIFIER-STANDARD.md) · [SHARED-CAPABILITY-REGISTRY.md](../architecture/SHARED-CAPABILITY-REGISTRY.md) · [RT-OPR-001](../routes/architecture/RT-OPR-001-CLOUD-SYSTEMS-OPERATIONS.md) · [CXW-001](../cross-wing/CXW-001-SECURE-APPLICATION-DELIVERY-ARCHITECTURE.md) |
| **Source research** | SEX-001 (GHV.LEARNING.1A) |
| **Limitations** | Working title; no Product Code; no XP formulas; not final catalogue lock; does **not** equal full PROTECT or CXW-001 |
| **Unresolved** | Trust/Mastery interaction (PROGRESSION.1); Mission scripts (1C); primary cloud vendor shortlist alignment with host Route; 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1B architecture |
| **Architecture score** | **84** (architecture-review evidence only — not final selection) |

```text
Status: ARCHITECTURE RECOMMENDED
Never final LOCKED in this Gate.
Extends RT-OPR-001 — not a free-floating security course.
```

---

## Identity

| Field | Content |
|-------|---------|
| **Canonical ID** | **SEX-001** |
| **Prior candidate ID** | SEX-001 (1A study) |
| **Working title** | Secure Cloud Operations Extension |
| **Construct type** | SECURE_EXTENSION |
| **Extends** | **RT-OPR-001** Cloud Systems Operations Foundations (HRZ-OPR) |
| **Graph edge** | `SECURE_EXTENSION` (RT-OPR-001 → SEX-001) |
| **Capability statement** | Operate cloud systems with a secure baseline: least privilege and identity hygiene, secrets handling and configuration hardening, security-relevant logging with backup/resilience practice, and secure runbooks with escalation — attached to OPERATE capability, not as a standalone PROTECT career track. |
| **Capability type** | SPECIALIST · SECURITY · OPERATIONAL |
| **Target learner** | Learners with RT-OPR-001 core Stage readiness applying secure configuration (scenario roles only) |
| **Smaller than** | Cross-Wing Route (CXW-001) |
| **Not equal to** | Full RT-PRT-001 · CXW-001 · professional licensing |

---

## Required distinction (Gate §27)

| Rule | SEX-001 posture |
|------|-----------------|
| Strengthens security of cloud operations | **Yes** — host remains OPERATE |
| Creates new multidisciplinary professional identity alone | **No** |
| Equals PROTECT Route completion | **No** |
| Duplicates full Defensive Security Operations | **No** |
| May use selected PROTECT capabilities | **Yes** — as RECOMMENDED / Bridge snippets (identity literacy), not full PRT enrollment |
| Produces secure-operations Evidence | **Yes** — tied to host ops capability |
| Smaller than a Cross-Wing | **Yes** — 4 Stages; no multi-Horizon Integration Mission |

---

## Host entry policy

| Field | Content |
|-------|---------|
| **Host Route** | RT-OPR-001 |
| **Source Route-Proven** | **Partial-entry policy for launch architecture:** host **core Stages** (STG-01…05 path in progress with STG-04/05 readiness preferred) **or** host Exit / Route-Proven review eligibility when available — Nest Guided Skip alone does **not** unlock SEX |
| **Security prerequisite** | Elevated Nest security caps (secrets, scam/safety, privacy, MFA) per Nest Dependency Map; SHC-007 identity basics as **COREQUISITE** reinforcement |
| **Learning Unlock** | **ULK-SEX-001** |
| **PROTECT enrollment** | **Not required** — selected identity/control language may be RECOMMENDED |

---

## Entry / Exit

| Field | Content |
|-------|---------|
| **Entry** | ULK-SEX-001 · RT-OPR-001 host readiness per partial-entry policy · elevated Nest security Micro-Missions if required · lab isolation brief |
| **Exit** | All four SEX Stages complete **and** required Evidence accepted **and** Capstone eligible (`SEX-001-CAP-01`) |
| **Prerequisites** | RT-OPR-001 host capability (hard) |
| **Corequisites** | SHC-007 identity basics (reinforce); SHC-012 change management (reinforce) |
| **Recommended** | RT-OPR-002 Linux/network concepts · selected RT-PRT-002 identity literacy snippets · SHC-005 · SHC-006 · SHC-010 |

---

## Stage table (4 Stages) — Gate §33

| Stage ID | Title | Outcomes | Mission categories | Evidence contribution | Remediation | Next Unlock |
|----------|-------|----------|--------------------|----------------------|-------------|-------------|
| **SEX-001-STG-01** | Least privilege & identity | Apply least-privilege roles in lab; tighten standing access; document identity boundaries for the workload | ORIENTATION · KNOWLEDGE · GUIDED_PRACTICE · LABORATORY · DOCUMENTATION | Feeds **SEX-001-EVD-01** | Lab IAM reset; Nest MFA/account Micro-Mission | Unlocks STG-02 |
| **SEX-001-STG-02** | Secrets & hardening | Store/rotate secrets correctly; remove secrets from configs/Evidence; harden exposure (network/config) with before/after proof | GUIDED_PRACTICE · LABORATORY · INDEPENDENT_PRACTICE · DOCUMENTATION | **SEX-001-EVD-02** primary | Secrets-redaction drill; hardening checklist retry | Unlocks STG-03 |
| **SEX-001-STG-03** | Logging, backup & resilience | Enable/interpret security-relevant logs; protect backup path basics; recover from a seeded misconfig/fault within runbook bounds | LABORATORY · TROUBLESHOOTING · SCENARIO · DOCUMENTATION | Feeds **SEX-001-EVD-03** | Fault-pack retry; log-privacy remediation | Unlocks STG-04 |
| **SEX-001-STG-04** | Secure runbooks & escalation | Update secure ops runbook; practice escalation note for seeded incident/misconfig; assemble Extension Evidence pack | DOCUMENTATION · EVIDENCE_PREPARATION · SCENARIO · ASSESSMENT | **SEX-001-EVD-03**; Capstone eligibility | Runbook revision cycle | Unlocks **SEX-001-CAP-01** |

**§33 note:** Four Stages compress secure-ops depth on the host Route. Capstone is separate (`SEX-001-CAP-01`). No INTEGRATION Mission category — Extensions harden a source capability; they do not create Cross-Wing Convergence.

---

## Evidence anchors (distinct from CXW-001)

| ID | Title | Artifact class | Stage contribution | Integrity | Review |
|----|-------|----------------|--------------------|-----------|--------|
| **SEX-001-EVD-01** | Least-privilege Evidence | Role/IAM before-after (redacted) + rationale | STG-01 | Lab tenant seed; no production claims | Privilege reduction quality |
| **SEX-001-EVD-02** | Secrets & hardening Evidence | Secrets-handling attestation · config harden diff | STG-02 | No real secrets in pack; seed-bound | Applied controls (not tip-sheet) |
| **SEX-001-EVD-03** | Logging, resilience & runbook | Log/audit note · backup/recover note · secure runbook + escalation | STG-03 · STG-04 | Redacted logs; unique misconfig seed | Observability + escalation clarity |

**Distinct from CXW:** SEX Evidence is **ops hardening on a cloud host** (IAM, secrets, config, logs, runbooks). CXW Evidence is **app delivery integration** (threat plan, seeded app finding, release decision). No identical mandatory Stages or EVD anchors.

---

## Capstone

| Field | Content |
|-------|---------|
| **Capstone ID** | **SEX-001-CAP-01** |
| **Concept link** | CAP-SEX-001 Harden the Ops Path (1A) — no full instructions here |
| **Eligibility** | STG-01…04 complete + EVD-01…03 accepted |
| **Output shape** | Least-privilege notes · secrets/hardening diffs · logging/backup proof · secure runbook excerpt · misconfig/escalation note |
| **Category** | CAPSTONE |
| **Extension marker / Crest** | May support later extension marker — **AWARDING DEFERRED**; not invented as Product Code here |
| **Does not award** | Full PROTECT · CXW completion · XP · professional title |

---

## Shared capability reuse

| SHC | Role in SEX |
|-----|-------------|
| SHC-001 Documentation | Secure ops notes / runbooks |
| SHC-006 Privacy | Lab-log redaction |
| SHC-007 Identity basics | Authoritative reinforce for STG-01 |
| SHC-010 Risk awareness | Misconfig risk rationale |
| SHC-012 Change management | Authoritative reinforce for safe change / STG-04 |

Do not copy Nest or PRT full units; reinforce contextually.

---

## Distinctions

| Construct | Relationship |
|-----------|--------------|
| **RT-OPR-001** | Host Route — foundational ops only; **do not** duplicate full SEX curriculum inside host |
| **RT-PRT-001** | Not substituted; optional RECOMMENDED identity/control literacy |
| **CXW-001** | Separate BUILD+PROTECT Cross-Wing; complementary launch pairing; **no** identical mandatory Stages |
| **SEX-002** (alt) | BUILD secure delivery Extension — deferred at launch to avoid CXW thematic overlap |

---

## Tooling

| Field | Content |
|-------|---------|
| **Primary classes** | **CLOUD-SANDBOX** (prefer reuse of OPR sandbox) · LOCAL-SAFE fallback · BROWSER-ONLY docs |
| **Examples (non-lock)** | IAM console · secret-store pattern · CIS-inspired summarized checklists · logging |
| **Avoid** | Unrestricted cloud · scanning unauthorized tenants · specialized cyber ranges as hard deps · production tenants |

---

## Safety / maintenance / review

| Area | Posture |
|------|---------|
| **Safety** | Isolated labs only; no unauthorized tenant scanning; no credential theft exercises; secrets never in Evidence |
| **Maintenance** | Medium–High (console/control drift) — pin lab baselines; treat vendor UI as Fast slices |
| **Expert review** | Cloud security / platform practitioner; lab safety review; Arabic instructional QA if localized |
| **Arabic-first** | High for checklists/runbooks; English for console identifiers where unavoidable; bidi docs |

---

## Unlocks

| Unlock | Note |
|--------|------|
| Sequential STG-01→04 | Stage completion |
| **SEX-001-CAP-01** | After Stages + EVD |
| **ULK-SEX-001** | Entry eligibility (host-gated) |
| Does **not** unlock | Full PROTECT catalogue · paid SKU · Prestige |

---

## Professional value (qualitative)

Practical secure-ops signal on a real OPERATE host capability — strong for misconfiguration hygiene. **Not** a SOC career claim.

---

## Unresolved

1. Exact host Stage gate for partial entry vs full Exit (1C/1D)  
2. Trust / Mastery interaction with Extension access (PROGRESSION.1)  
3. Vendor pin shared with RT-OPR-001  
4. Extension marker / Crest awarding model (deferred)  
5. Final catalogue lock (1D)  

---

## Stage review table (Gate §33)

| Stage ID | Outcomes clarity | Category fit | Evidence contribution | Remediation path | Unlock coherence | Safety | A11y | Integrity | Offline / tooling | Reviewer | Verdict |
|----------|------------------|--------------|----------------------|------------------|------------------|--------|------|-----------|-------------------|----------|---------|
| STG-01 | Clear | OK | EVD-01 | Defined | OK | Pass | Watch (console) | Pass | CLOUD-SANDBOX | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-02 | Clear | OK | EVD-02 | Defined | OK | Pass | Watch (console) | Pass | CLOUD-SANDBOX | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-03 | Clear | OK | EVD-03 | Defined | OK | Pass | Pass | Pass | Med | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-04 | Clear | OK | EVD-03 | Defined | OK | Pass | Pass | Pass | High docs | Founder (RAVEN) | **ARCHITECTURE OK** |

**§33 aggregate:** Stage count **4/4** · All Stages **ARCHITECTURE OK** · Status **ARCHITECTURE RECOMMENDED** (not LOCKED; no WITH CONDITIONS required) · Architecture score **84**.
