# Launch Secure Extension Study

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-SEX-001 |
| **Version** | 1.0.0 |
| **Status** | RESEARCH BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1A |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [LEARNING-RESEARCH-METHODOLOGY.md](../research/LEARNING-RESEARCH-METHODOLOGY.md) · [CROSS-WING-CAPABILITY-ATLAS-TEMPLATE.md](../../../governance/cross-wing/CROSS-WING-CAPABILITY-ATLAS-TEMPLATE.md) · [ROUTE-CANDIDATE-REGISTER.md](../routes/ROUTE-CANDIDATE-REGISTER.md) · [LAUNCH-CROSS-WING-STUDY.md](../cross-wing/LAUNCH-CROSS-WING-STUDY.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) |
| **Limitations** | Extensions are research recommendations only; security depth must stay practical and scoped; public frameworks may overstate role requirements; Saudi strategic alignment is relevance assessment only — not endorsement; no employment, certification, or placement promises; Trust / Mastery thresholds unresolved |
| **Unresolved** | GHV.PROGRESSION.1 (Trust / Mastery interaction with Secure Extensions) · GHV.LEARNING.1B (Evidence architecture) · GHV.LEARNING.1C (SECURE_EXTENSION graph edges / Atlas drafts) · GHV.LEARNING.1D (final catalogue lock) |
| **Change history** | 1.0.0 — LEARNING.1A research baseline |

## Purpose

Assess Secure Extension candidates for controlled launch. Select **one** recommended launch Secure Extension with status **RECOMMENDED — NOT YET LOCKED**. Final lock is deferred to **GHV.LEARNING.1D**. Status in this Gate is never `LOCKED`.

## Secure Extension definition rules

A Secure Extension **must**:

1. **Extend another capability** — attach to a source Route / Horizon capability (not a free-floating security course).  
2. Deliver **practical security** skills usable in that capability’s real tasks.  
3. Require **Evidence** of secure practice (not quiz-only).  
4. **Not** be a full **PROTECT** Route substitute.  
5. **Not** be superficial (badge-only, tip-sheet, or marketing “secure by default” labeling).

Per DEC-016: Atlas-gated; may require several skills; reject fake combinations.

Graph edge type: `SECURE_EXTENSION` (Scope Baseline / Learning Graph).

## Portfolio rule

Controlled launch targets **one** validated Secure Extension (Scope Baseline §3.10). Full catalogue: POST-LAUNCH PLANNED.

## Relationship to Cross-Wing and PROTECT

| Construct | Role |
|-----------|------|
| PROTECT Route | Full security Horizon progression |
| Cross-Wing | Multi-Horizon integrated capability (e.g., CXW-001) |
| Secure Extension | Depth layer securing an existing non-PROTECT (or mixed) capability |

Learners may hold both a Secure Extension and Cross-Wing over time; launch selects **one of each**, independently.

---

## Assessment method (score-ish)

| Band | Range | Meaning |
|------|-------|---------|
| Strong | 85–100 | Prefer for launch |
| Good | 75–84 | Strong alternative |
| Possible | 65–74 | Post-launch / research |
| Weak | 50–64 | Defer |
| Reject | <50 | Fails definition rules |

Criteria: attachment clarity · practical security depth · Evidence quality · non-duplication of full PROTECT · lab/cost · Saudi + international relevance · ethics · maintenance · expert-review need.

---

## Candidate inventory

| ID | Working title | Extends | Extension Score | Recommendation |
|----|---------------|---------|-----------------|----------------|
| **SEX-001** | Secure Cloud Operations Extension | OPERATE · RC-OPR-001 | **88** | **RECOMMENDED — NOT YET LOCKED** (launch) |
| SEX-002 | Secure Software Delivery Extension | BUILD · RC-BLD-001 | 84 | RECOMMENDED AS LAUNCH ALTERNATIVE |
| SEX-003 | Secure Data Handling Extension | ANALYZE · RC-ANL-001 | 80 | RECOMMENDED AS LAUNCH ALTERNATIVE / POST-LAUNCH |
| SEX-004 | Secure AI Usage Extension | ANALYZE · RC-ANL-003 (and cross-use) | 77 | RECOMMENDED POST-LAUNCH |
| SEX-005 | Identity-Aware System Design Extension | BUILD / OPERATE · RC-PRT-002 concepts as extension layer | 79 | RECOMMENDED POST-LAUNCH |
| SEX-006 | Secure Project Decision-Making Extension | LEAD · RC-LED-001 | 73 | RESEARCH FURTHER / POST-LAUNCH |

---

## SEX-001 — Secure Cloud Operations Extension

| Field | Content |
|-------|---------|
| **ID** | SEX-001 |
| **Working title** | Secure Cloud Operations Extension |
| **Extends** | OPERATE cloud capability — primary source Route [RC-OPR-001](../routes/ROUTE-CANDIDATE-REGISTER.md) Cloud Systems Operations Foundations |
| **Supporting Routes** | [RC-OPR-002](../routes/ROUTE-CANDIDATE-REGISTER.md) Linux & Network Operations Foundations (RECOMMENDED) · identity concepts from [RC-PRT-002](../routes/ROUTE-CANDIDATE-REGISTER.md) as referenced controls — **not** a PROTECT Route enrollment requirement |
| **Integrated / extended capability** | Operate cloud systems with secure baseline controls: least privilege, network exposure hygiene, secret handling, logging for security events, and safe change practice |
| **Capability type** | SPECIALIST · SECURITY · OPERATIONAL |
| **Related roles (illustrative)** | Cloud operator · junior platform engineer · IT specialist running cloud workloads |
| **Sequential deps** | Nest → RC-OPR-001 core Stages (compute/network/storage ops) → Secure Extension Stages → Evidence |
| **Parallel deps** | Linux/network foundations RECOMMENDED; IAM literacy modules as COREQUISITE snippets |
| **Not a full PROTECT Route because** | No SOC career track, no full IR/threat-hunting progression, no broad defensive curriculum — only cloud-ops security practices |
| **Practical security outcomes** | Harden a lab account/service · apply least-privilege roles · rotate/store secrets correctly · reduce public exposure · interpret security-relevant logs · respond to a seeded misconfiguration |
| **Evidence** | Secure baseline checklist completed · before/after config evidence · secrets handling attestation · short incident/misconfig note |
| **Tools** | Cloud free tier · IAM console · secret store pattern · CIS-inspired checklists (summarized, not copied proprietary) · logging |
| **Ethics / security** | Isolated labs only; no scanning of unauthorized tenants; no credential theft exercises against real orgs |
| **Saudi relevance** | High — cloud adoption + cybersecurity skill demand (relevance only; not endorsement) |
| **International relevance** | High — cloud misconfiguration remains a dominant failure mode |
| **Expert-review needs** | Cloud security / platform practitioner; lab safety review |
| **Cost** | Medium (cloud labs + review) |
| **Maintenance** | Medium–High (console and control drift) |
| **Extension Score** | **88 (Strong)** |
| **Status** | **RECOMMENDED — NOT YET LOCKED** |

### Why recommend SEX-001 for launch

1. Clear host capability (cloud ops) already expected in launch OPERATE portfolio.  
2. Practical security with strong Evidence potential.  
3. Distinct from full PROTECT Routes and from Cross-Wing CXW-001 (BUILD+PROTECT delivery).  
4. Complements CXW-001 without duplicating it: ops security vs secure app delivery.  
5. High Saudi + international task clarity.

### Risks

- Scope creep into full cloud security architect content.  
- Vendor-specific labs becoming brittle.  
- Confusion with PROTECT Route marketing — UI must label as Extension on an OPERATE Route.

---

## SEX-002 — Secure Software Delivery Extension

| Field | Content |
|-------|---------|
| **ID** | SEX-002 |
| **Working title** | Secure Software Delivery Extension |
| **Extends** | BUILD — [RC-BLD-001](../routes/ROUTE-CANDIDATE-REGISTER.md) Web Application Delivery Foundations |
| **Supporting** | [RC-BLD-002](../routes/ROUTE-CANDIDATE-REGISTER.md) · OWASP-oriented secure coding practices (summarized) |
| **Extended capability** | Apply secure coding/config and pipeline checks within web delivery work |
| **Capability type** | SPECIALIST · SECURITY · BUILDING |
| **Related roles** | Developer · junior DevOps contributing to delivery gates |
| **Sequential deps** | RC-BLD-001 core Stages → Secure Extension → Evidence |
| **Parallel deps** | Scripting RECOMMENDED |
| **Not full PROTECT** | No SOC/IR track; AppSec lite only |
| **Evidence** | Remediated seeded vuln · secure PR checklist · pipeline gate notes |
| **Tools** | Git · SAST/dependency scan free tiers · local app lab |
| **Ethics / security** | Lab apps only; responsible disclosure norms |
| **Saudi relevance** | High |
| **International relevance** | High |
| **Expert-review needs** | AppSec + developer coach |
| **Cost** | Medium |
| **Maintenance** | Medium–High |
| **Extension Score** | **84 (Good)** |
| **Status** | RECOMMENDED AS LAUNCH ALTERNATIVE |

**Note:** Excellent, but overlaps thematically with recommended Cross-Wing **CXW-001**. Prefer SEX-001 at launch to diversify Horizons (OPERATE security depth + BUILD/PROTECT Cross-Wing).

---

## SEX-003 — Secure Data Handling Extension

| Field | Content |
|-------|---------|
| **ID** | SEX-003 |
| **Working title** | Secure Data Handling Extension |
| **Extends** | ANALYZE — [RC-ANL-001](../routes/ROUTE-CANDIDATE-REGISTER.md) Practical Data Analysis Foundations |
| **Supporting** | Privacy concepts; optional [RC-ANL-002](../routes/ROUTE-CANDIDATE-REGISTER.md) later |
| **Extended capability** | Handle datasets with classification awareness, access limits, minimization, and safe sharing |
| **Capability type** | SPECIALIST · SECURITY · ANALYTICAL |
| **Related roles** | Analyst · analytics engineer · reporting specialist |
| **Sequential deps** | RC-ANL-001 → Extension → Evidence |
| **Not full PROTECT** | No enterprise GRC track; analyst-facing controls only |
| **Evidence** | Classified sample workflow · access note · sharing decision log |
| **Tools** | Spreadsheet/SQL lab · synthetic data · access templates |
| **Ethics / security** | Synthetic/public data only; no real PII |
| **Saudi relevance** | High — data protection expectations |
| **International relevance** | High |
| **Expert-review needs** | Privacy-aware analytics coach |
| **Cost** | Low–Medium |
| **Maintenance** | Medium (regulatory language freshness) |
| **Extension Score** | **80 (Good)** |
| **Status** | RECOMMENDED AS LAUNCH ALTERNATIVE / POST-LAUNCH |

---

## SEX-004 — Secure AI Usage Extension

| Field | Content |
|-------|---------|
| **ID** | SEX-004 |
| **Working title** | Secure AI Usage Extension |
| **Extends** | ANALYZE — [RC-ANL-003](../routes/ROUTE-CANDIDATE-REGISTER.md) Responsible AI Literacy & Applied Analytics; usable as cross-Horizon module later |
| **Extended capability** | Use AI tools safely: data leakage avoidance, prompt hygiene, verification of outputs, policy-aware usage |
| **Capability type** | SPECIALIST · SECURITY · ANALYTICAL |
| **Related roles** | Knowledge worker · analyst · developer using AI assistants |
| **Sequential deps** | Responsible AI literacy Stages → Secure Extension Evidence |
| **Not full PROTECT** | No AI red-team career path; workplace usage controls only |
| **Evidence** | Safe-use scenario pack · leakage avoidance checklist · verified-output exercise |
| **Tools** | Approved AI lab accounts · policy templates |
| **Ethics / security** | Prohibit uploading secrets/PII; disclose model limitations; no harmful content generation tasks |
| **Saudi relevance** | High — AI adoption + governance themes (relevance only) |
| **International relevance** | High — fast-changing; maintenance heavy |
| **Expert-review needs** | AI risk + workplace policy reviewer |
| **Cost** | Medium |
| **Maintenance** | **High** (Fast-Changing Technology) |
| **Extension Score** | **77 (Good)** |
| **Status** | RECOMMENDED POST-LAUNCH |

**Note:** Valuable, but freshness burden and dependency on RC-ANL-003 make it poor as sole launch SE.

---

## SEX-005 — Identity-Aware System Design Extension

| Field | Content |
|-------|---------|
| **ID** | SEX-005 |
| **Working title** | Identity-Aware System Design Extension |
| **Extends** | BUILD and/or OPERATE system design tasks — host Routes [RC-BLD-001](../routes/ROUTE-CANDIDATE-REGISTER.md) / [RC-OPR-001](../routes/ROUTE-CANDIDATE-REGISTER.md); draws control language from [RC-PRT-002](../routes/ROUTE-CANDIDATE-REGISTER.md) without replacing that Route |
| **Extended capability** | Design simple systems with authN/authZ, session hygiene, and privilege boundaries |
| **Capability type** | SPECIALIST · SECURITY · BUILDING |
| **Related roles** | Developer · systems designer · junior architect collaborator |
| **Sequential deps** | Host Route Stages → identity-aware design Extension → Evidence |
| **Not full PROTECT** | Not a full IAM/security operations curriculum |
| **Evidence** | AuthZ matrix · threat/abuse cases for identity · lab implementation notes |
| **Tools** | Auth library/lab IdP · diagramming |
| **Ethics / security** | No real credential stuffing; lab IdP only |
| **Saudi relevance** | High — identity is foundational to national/cyber programs (relevance only) |
| **International relevance** | High |
| **Expert-review needs** | IAM engineer |
| **Cost** | Medium |
| **Maintenance** | Medium |
| **Extension Score** | **79 (Good)** |
| **Status** | RECOMMENDED POST-LAUNCH |

**Risk:** Must stay an Extension of BUILD/OPERATE — do not publish as shadow PROTECT Route.

---

## SEX-006 — Secure Project Decision-Making Extension (optional)

| Field | Content |
|-------|---------|
| **ID** | SEX-006 |
| **Working title** | Secure Project Decision-Making Extension |
| **Extends** | LEAD — [RC-LED-001](../routes/ROUTE-CANDIDATE-REGISTER.md) Technology Delivery & Risk Foundations |
| **Supporting** | [RC-LED-003](../routes/ROUTE-CANDIDATE-REGISTER.md) only if that Route is later activated (likely deferred) |
| **Extended capability** | Make delivery decisions with security risk trade-offs: accept/mitigate/transfer language, control selection lite, go/no-go notes |
| **Capability type** | SPECIALIST · SECURITY · GOVERNANCE |
| **Related roles** | Delivery lead · coordinator · risk-aware project contributor |
| **Sequential deps** | RC-LED-001 → Extension → Evidence |
| **Not full PROTECT** | No control framework certification track; decision practice only |
| **Evidence** | Risk decision log · control trade-off memo · stakeholder note |
| **Tools** | Risk register template · scenario packs |
| **Ethics / security** | No false assurance claims; document uncertainty |
| **Saudi relevance** | Medium–High — governance language common |
| **International relevance** | Medium–High |
| **Expert-review needs** | Risk/governance coach; avoid superficial “security leadership” labeling |
| **Cost** | Low–Medium |
| **Maintenance** | Medium |
| **Extension Score** | **73 (Possible)** |
| **Status** | RESEARCH FURTHER / POST-LAUNCH |

**Note:** Highest superficiality risk; keep only if Evidence forces real trade-off decisions.

---

## Definition-rule compliance matrix

| ID | Extends capability | Practical security | Evidence | Not full PROTECT | Not superficial | Pass? |
|----|--------------------|--------------------|----------|------------------|-----------------|-------|
| SEX-001 | Yes (OPERATE cloud) | Yes | Yes | Yes | Yes | **Pass** |
| SEX-002 | Yes (BUILD delivery) | Yes | Yes | Yes | Yes | Pass |
| SEX-003 | Yes (ANALYZE) | Yes | Yes | Yes | Yes | Pass |
| SEX-004 | Yes (AI literacy) | Yes | Yes | Yes | Conditional (must stay deep) | Pass w/ conditions |
| SEX-005 | Yes (system design) | Yes | Yes | Yes | Yes | Pass |
| SEX-006 | Yes (LEAD delivery) | Conditional | Yes | Yes | **Watch** | Conditional |

---

## Launch recommendation

| Decision | Value |
|----------|-------|
| **Selected launch Secure Extension** | **SEX-001 Secure Cloud Operations Extension** |
| **Host Route** | RC-OPR-001 Cloud Systems Operations Foundations |
| **Status** | **RECOMMENDED — NOT YET LOCKED** |
| **Launch alternative** | SEX-002 (if OPERATE cloud Route slips; note CXW-001 overlap) |
| **Atlas** | Required before publication |
| **Final lock Gate** | GHV.LEARNING.1D |
| **Never in this document** | Status `LOCKED` |

### Pairing with recommended Cross-Wing

| Launch pick | Horizon emphasis |
|-------------|------------------|
| CXW-001 Secure Application Delivery | BUILD + PROTECT integration |
| SEX-001 Secure Cloud Operations Extension | OPERATE security depth |

Together they cover delivery security and operations security without collapsing into a single PROTECT-only story.

### Recommendation conditions (must clear before 1D)

1. RC-OPR-001 remains a launch Route (or Strong OPERATE replacement).  
2. Extension Stages and Evidence pass security expert review.  
3. UI/copy clearly distinguishes Extension vs PROTECT Route vs Cross-Wing.  
4. `SECURE_EXTENSION` graph edge drafted in LEARNING.1C.  
5. Trust / Mastery interactions resolved via PROGRESSION.1.

---

## Explicit non-claims

- No Product Code in this Gate.  
- No certification, employer, or government endorsement claims.  
- No employment, salary, or placement promises.  
- Completing a Secure Extension does not grant professional licensing or SOC employment.  
- Saudi / national-framework mentions are **relevance assessments only**.

---

## Next Gates

| Gate | Expected Secure Extension work |
|------|--------------------------------|
| GHV.LEARNING.1B | Evidence types and assessment method for SEX-001 |
| GHV.LEARNING.1C | Atlas draft + `SECURE_EXTENSION` edges |
| GHV.LEARNING.1D | Lock or replace recommendation; never earlier |
| GHV.PROGRESSION.1 | Trust / Mastery thresholds affecting Extension access |
