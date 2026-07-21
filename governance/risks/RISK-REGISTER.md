# Risk Register

| Field | Value |
|-------|-------|
| **Status** | ACTIVE — Initial |
| **Version** | 1.17.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1E |
| **Note** | Risks are identified, not claimed mitigated. **Architecture Design Baseline v1.0.0 lock (1E)** does **not** resolve external, provider, legal, accessibility, DR, or operational validation risks. **Core Platform Stack Baseline acceptance** and **P0 spike PASS** do **not** close Open validation-debt, provider-selection, or operational risks. Screen-count / alias defects RISK-PRG-057/058 are resolved. Process deviation RISK-GOV-001 remains **OPEN / MONITORED**. |

Probability / Impact: H · M · L · Exposure = qualitative combination · Status: Open

---

## Product

| ID | Description | P | I | Exp | Trigger | Mitigation | Contingency | Owner | Status | Review | Caps |
|----|-------------|---|---|-----|---------|------------|-------------|-------|--------|--------|------|
| RISK-PRD-001 | Scope expansion beyond controlled launch | H | H | H | Feature pressure | Change-control 7Q; exclusions list | Idea Vault | Founder | Open | 2026-10-01 | CAP-GOV-* |
| RISK-PRD-002 | Unclear launch catalogue | H | H | H | Learning Gate delay | Capability Atlas; selected Routes only | Shrink Route set | Founder | Open | 2026-10-01 | CAP-LRN-* |
| RISK-PRD-003 | Excessive product complexity | M | H | H | Too many systems at once | Pillar traceability; defer formulas | Cut Live/Community depth | Founder | Open | 2026-10-01 | CAP-EBUX-* |
| RISK-PRD-004 | Poor onboarding completion | M | H | H | Nest/activation friction | Nest bands; optional mobile | Simplify Nest | Founder | Open | 2026-10-01 | CAP-ONB-* |
| RISK-PRD-005 | Progression confusion | M | M | M | Many independent meters | Clear UX copy; GHV.PROGRESSION.1 | Hide advanced meters | Founder | Open | 2026-12-01 | CAP-PRG-* |

## Learning

| ID | Description | P | I | Exp | Trigger | Mitigation | Contingency | Owner | Status | Review | Caps |
|----|-------------|---|---|-----|---------|------------|-------------|-------|--------|--------|------|
| RISK-LRN-001 | Outdated content | M | H | H | Fast tech change | Freshness requirements | Retire Routes | Content lead TBD | Open | 2026-12-01 | CAP-LRN-008 |
| RISK-LRN-002 | Incorrect prerequisites | M | H | H | Graph errors | Typed graph; no cycles; review | Hotfix edges | Founder | Open | 2026-12-01 | CAP-LRN-002 |
| RISK-LRN-003 | Cross-Wing without real value | M | H | H | Title-driven design | Atlas mandatory | Unpublish Route | Founder | Open | 2026-12-01 | CAP-LRN-006 |
| RISK-LRN-004 | Evidence-quality inconsistency | H | H | H | Subjective review | Rubrics; reviewer trust gates | Pause approvals | Founder | Open | 2026-12-01 | CAP-LRN-005 |
| RISK-LRN-005 | Assessment integrity failure | M | H | H | Cheating / leaks | Proctoring later; integrity design | Invalidate session | Founder | Open | 2026-12-01 | CAP-LRN-004 |

## Commercial

| ID | Description | P | I | Exp | Trigger | Mitigation | Contingency | Owner | Status | Review | Caps |
|----|-------------|---|---|-----|---------|------------|-------------|-------|--------|--------|------|
| RISK-COM-001 | Pricing below sustainable cost | M | H | H | Provider + content cost | Cost model Gate | Raise prices via CR | Founder | Open | 2026-11-01 | CAP-PAY-* |
| RISK-COM-002 | Payment-provider limitations | H | H | H | mada/recurring gaps | Multi-provider validation | Narrow methods | Founder | Open | 2026-11-01 | CAP-PAY-004 |
| RISK-COM-003 | Subscription abuse | M | M | M | Shared accounts | Assurance + risk | Force A2 for paid | Founder | Open | 2027-01-01 | CAP-TRU-* |
| RISK-COM-004 | Entitlement inconsistency | M | H | H | Bug / race | Entitlement Graph separate | Freeze grants | Founder | Open | 2027-01-01 | CAP-EBUX-003 |
| RISK-COM-005 | Refund abuse | M | M | M | 7-day window | Legal wording; fraud checks | Shorten window legally | Founder | Open | 2027-01-01 | CAP-PAY-007 |
| RISK-COM-006 | Tax/invoice mistakes | M | H | H | VAT rules | External validation | Manual invoice halt | Founder | Open | 2026-11-01 | CAP-PAY-008 |

## Identity

| ID | Description | P | I | Exp | Trigger | Mitigation | Contingency | Owner | Status | Review | Caps |
|----|-------------|---|---|-----|---------|------------|-------------|-------|--------|--------|------|
| RISK-IDN-001 | Account takeover | M | H | H | Credential theft | Passkey-first; A2 prompts | Force reset | Founder | Open | 2026-12-01 | CAP-TRU-001 |
| RISK-IDN-002 | Email compromise | M | H | H | Inbox takeover | Alerts; step-up | Freeze sensitive actions | Founder | Open | 2026-12-01 | CAP-ONB-002 |
| RISK-IDN-003 | SIM swap | M | H | H | SMS reliance | SMS not strongest factor | Disable SMS recovery | Founder | Open | 2026-12-01 | CAP-TRU-001 |
| RISK-IDN-004 | Recovery bypass | L | H | H | Weak recovery | Recovery codes + review | Manual recovery only | Founder | Open | 2026-12-01 | CAP-TRU-001 |
| RISK-IDN-005 | Duplicate accounts | H | M | M | Multi-register | Risk signals | Merge/limit | Founder | Open | 2027-01-01 | CAP-TRU-003 |
| RISK-IDN-006 | Minors and consent | H | H | H | 15–17 users | Legal validation; fallback 18+ | Age-gate 18+ | Founder | Open | 2026-10-01 | CAP-GOV-003 |

## Adaptive Experience

| ID | Description | P | I | Exp | Trigger | Mitigation | Contingency | Owner | Status | Review | Caps |
|----|-------------|---|---|-----|---------|------------|-------------|-------|--------|--------|------|
| RISK-EBX-001 | Corrupted saved state | M | H | H | Sync bugs | Versioned Flight State | Reset to last good | Founder | Open | 2027-02-01 | CAP-EBUX-001 |
| RISK-EBX-002 | Incorrect recommendations | M | M | M | Bad signals | Advisory-only rule | Disable reco engine | Founder | Open | 2027-02-01 | CAP-EBUX-004 |
| RISK-EBX-003 | Hidden opportunities | M | M | M | Over-personalization | World Map always reachable | Show all eligible | Founder | Open | 2027-02-01 | CAP-EBUX-008 |
| RISK-EBX-004 | Excessive notifications | M | M | M | Engagement tactics | Caps + preferences | Kill switches | Founder | Open | 2027-02-01 | CAP-EBUX-005 |
| RISK-EBX-005 | Interface instability | M | H | H | Too many states | State matrix; QA Gates | Freeze EBUX variants | Founder | Open | 2027-02-01 | CAP-EBUX-* |

## Community

| ID | Description | P | I | Exp | Trigger | Mitigation | Contingency | Owner | Status | Review | Caps |
|----|-------------|---|---|-----|---------|------------|-------------|-------|--------|--------|------|
| RISK-SOC-001 | Harassment | H | H | H | Social features | Moderation + report/appeal | Lock Rookery | Founder | Open | 2027-03-01 | CAP-SOC-008 |
| RISK-SOC-002 | Spam | H | M | M | Open posting | Structured posts; rate limits | Freeze compose | Founder | Open | 2027-03-01 | CAP-SOC-001 |
| RISK-SOC-003 | Impersonation | M | H | H | Display names | Assurance/Prestige signals | Hide names | Founder | Open | 2027-03-01 | CAP-TRU-003 |
| RISK-SOC-004 | Unsafe links | H | H | H | User content | Link scanning TBD | Strip links | Founder | Open | 2027-03-01 | CAP-SOC-001 |
| RISK-SOC-005 | Adult-minor contact | M | H | H | Mixed ages | Legal model; no unrestricted DMs | 18+ only | Founder | Open | 2026-10-01 | CAP-SOC-* |
| RISK-SOC-006 | Toxic competition | M | M | M | Leaderboards | Limited boards; Trust | Disable boards | Founder | Open | 2027-03-01 | CAP-PRG-010 |
| RISK-SOC-007 | Moderation overload | H | H | H | Volume | Queues; trust gates | Reduce surfaces | Founder | Open | 2027-03-01 | CAP-SOC-008 |

## Live Sky

| ID | Description | P | I | Exp | Trigger | Mitigation | Contingency | Owner | Status | Review | Caps |
|----|-------------|---|---|-----|---------|------------|-------------|-------|--------|--------|------|
| RISK-LIV-001 | Realtime failure | M | H | H | Infra limits | Technical validation | Async-only events | Founder | Open | 2027-04-01 | CAP-SOC-005 |
| RISK-LIV-002 | Spectator overload | M | M | M | Popular events | Cap spectators | Queue / VOD | Founder | Open | 2027-04-01 | CAP-SOC-006 |
| RISK-LIV-003 | Cheating in live | M | H | H | Competitions | Integrity design | Invalidate | Founder | Open | 2027-04-01 | CAP-SOC-005 |
| RISK-LIV-004 | Result inconsistency | M | H | H | Race conditions | Authoritative server results | Manual finalize | Founder | Open | 2027-04-01 | CAP-SOC-005 |
| RISK-LIV-005 | Information leakage | M | H | H | Spectator vs participant | Channel separation | End event | Founder | Open | 2027-04-01 | CAP-SOC-006 |

## Security and Privacy

| ID | Description | P | I | Exp | Trigger | Mitigation | Contingency | Owner | Status | Review | Caps |
|----|-------------|---|---|-----|---------|------------|-------------|-------|--------|--------|------|
| RISK-SEC-001 | Unauthorized access | M | H | H | Authz bugs | Authorization Engine; audits | Incident response | Founder | Open | 2026-12-01 | CAP-TRU-002 |
| RISK-SEC-002 | Data leakage | M | H | H | Misconfig | Privacy baseline; reviews | Contain + notify | Founder | Open | 2026-12-01 | CAP-TRU-004 |
| RISK-SEC-003 | Excessive data collection | M | M | M | Feature creep | Minimization principle | Delete fields | Founder | Open | 2026-12-01 | CAP-TRU-004 |
| RISK-SEC-004 | Cross-border transfer errors | M | H | H | Wrong region hosting | External validation | Restrict region | Founder | Open | 2026-11-01 | CAP-TRU-006 |
| RISK-SEC-005 | Insecure uploads | M | H | H | Evidence files | Object-storage security validation | Block uploads | Founder | Open | 2027-01-01 | CAP-TRU-007 |
| RISK-SEC-006 | Secret exposure | M | H | H | Bad commits | Gitignore; Gate checks | Rotate secrets | Founder | Open | Continuous | CAP-TRU-* |
| RISK-SEC-007 | Audit gaps | M | H | H | Missing logs | Auditable decisions rule | Freeze state changes | Founder | Open | 2027-01-01 | CAP-TRU-005 |

## Operations

| ID | Description | P | I | Exp | Trigger | Mitigation | Contingency | Owner | Status | Review | Caps |
|----|-------------|---|---|-----|---------|------------|-------------|-------|--------|--------|------|
| RISK-OPS-001 | Founder overload | H | H | H | Solo execution | Gate discipline; deferral | Shrink scope | Founder | Open | 2026-10-01 | CAP-GOV-* |
| RISK-OPS-002 | Key-person dependency | H | H | H | Single owner | Documented baselines | Knowledge pack | Founder | Open | 2026-10-01 | CAP-GOV-* |
| RISK-OPS-003 | Infrastructure cost | M | H | H | Cloud spend | Cost guardrails later | Pause Live | Founder | Open | 2027-01-01 | CAP-TRU-* |
| RISK-OPS-004 | Vendor lock-in | M | M | M | Managed services | Prefer portable candidates | Abstraction layers | Founder | Open | 2027-01-01 | CAP-TRU-* |
| RISK-OPS-005 | Backup failure | L | H | H | Untested restore | Backup/recovery validation | Manual export | Founder | Open | 2027-01-01 | CAP-TRU-010 |
| RISK-OPS-006 | Domain or trademark conflict | M | H | H | External search | External validation register | Rename contingency | Founder | Open | 2026-09-01 | CAP-GOV-002 |
| RISK-OPS-007 | Missed 2029 launch target | M | H | H | Gate slips | Roadmap Gates; scope cuts | Reduce launch surface | Founder | Open | Quarterly | CAP-GOV-005 |
| RISK-OPS-008 | Automatic Preview deploy on governance-only pushes | H | M | H | Push without guard | Branch `deploymentEnabled: false` in root `vercel.json` | Cancel/ignore Preview; do not promote | Founder | Mitigating | 2026-07-21 | CAP-GOV-* |
| RISK-OPS-009 | Missing/unverified Preview database variables | H | H | H | Future Preview runtime | Record in TECH-018; add vars only in authorized Gate | Keep deploy disabled until ready | Founder | Open | 2026-08-01 | CAP-TRU-* |
| RISK-OPS-010 | Legacy CyberCrow env-variable carryover | H | M | M | Shared project | Inventory; deferred cleanup Gate | Do not reuse blindly | Founder | Open | 2026-08-01 | CAP-TRU-* |
| RISK-OPS-011 | Root-directory / vercel.json mismatch | L | H | M | Non-root Vercel Root Directory | Confirmed root is repo root in 1B | Dashboard correction before push | Founder | Closed (verified root) | 2026-07-21 | CAP-GOV-* |
| RISK-OPS-012 | Legacy Vercel build command references missing CyberCrow scripts | H | M | M | Accidental enable of deploy | Keep branch deploy disabled; rebuild settings in architecture Gate | Failed Preview only; never promote | Founder | Open | 2026-08-01 | CAP-GOV-* |
| RISK-OPS-013 | Scope growth after baseline lock | H | H | H | Feature pressure | Classification system; impact model; WIP | Idea Vault / reject | Founder | Open | 2026-08-01 | CAP-GOV-* |
| RISK-OPS-014 | 92-screen inventory UX sprawl / overcommitment | M | H | H | UI build sprawl against full inventory | Screen families; PD.3 wireframes prioritize MLGW; freeze adds CR for new screens | Defer non-MLGW screens | Founder | Open | 2026-09-01 | CAP-EBUX-* |
| RISK-OPS-015 | Insufficient launch content / thin Horizons | H | H | H | Content lag | Limited catalogue + LEARNING.1 | Cut Routes; keep Nest+one vertical | Founder | Open | 2026-10-01 | CAP-LRN-* |
| RISK-OPS-016 | Commercial work delaying learning | M | H | H | Billing priority | Pillars; learning-before-commerce sequencing | Soft commercial later | Founder | Open | 2026-10-01 | CAP-PAY-* |
| RISK-OPS-017 | Live Sky overengineering | M | H | H | Realtime ambition | One controlled experience | Directory-only fallback | Founder | Open | 2026-11-01 | CAP-SOC-005 |
| RISK-OPS-018 | Excessive progression complexity | M | M | M | Many meters | LIMITED launch depth; PROGRESSION.1 | Hide advanced meters | Founder | Open | 2026-12-01 | CAP-PRG-* |
| RISK-OPS-019 | Founder-capacity exhaustion | H | H | H | Parallelism | WIP 1+1+1; 60–70% schedule | Pause enhancements | Founder | Open | Continuous | CAP-GOV-* |
| RISK-OPS-020 | Launch deadline compression | M | H | H | Scope adds | MLGW checklist; impact model | Shrink MLGW only via foundational CR | Founder | Open | Quarterly | CAP-GOV-* |
| RISK-OPS-021 | Conditional legal requirements (15–17) | H | H | H | Legal delay | Fallback 18+ | Age-gate | Founder | Open | 2026-10-01 | CAP-GOV-002 |
| RISK-OPS-022 | Preview environment not yet available | H | H | H | Missing Preview DB vars | TECH-018; keep deploy guard | Local-only validation longer | Founder | Open | 2026-08-01 | CAP-TRU-014 |
| RISK-UX-001 | Excessive screens / inconsistent behavior | M | H | H | 90 IDs | Wireframe registry + grammar + families | Cut non-MLGW build order | Founder | Open | 2026-09-01 | WF-REG |
| RISK-UX-002 | Onboarding length fatigue | M | M | M | Many ONB steps | Quick Crow path; Nest choice clarity | Skip non-critical cosmetics | Founder | Open | Usability | ONB |
| RISK-UX-003 | Plans confused with Skill | H | H | H | Checkout copy | Ethical plan rules; Explainable Locks | Usability fix before code | Founder | Open | Usability | PAY |
| RISK-UX-004 | World Map complexity on mobile | M | M | M | Spatial UI | List alternative; reduced motion | Horizon cards only | Founder | Open | Usability | WLD |
| RISK-UX-005 | Inaccessible motion / RTL breakage | M | H | H | Locale/a11y | Motion + RTL specs; checklist | Block ship of failing flows | Founder | Open | Usability | TRU-011/012 |
| RISK-UX-006 | Incomplete offline / Evidence confusion | M | H | H | Sync ambiguity | Save-Sync-Offline + Evidence lifecycle | Disable unsupported offline | Founder | Open | Tech | SYNC |
| RISK-UX-007 | Live Sky information leakage | H | H | H | Spectator UI | Participant/spectator separation | Spectate-only until fixed | Founder | Open | Live | LIV |
| RISK-UX-008 | Untested wireframe assumptions | H | M | H | No sessions yet | Usability plan NOT RUN | Do not start Product Code UI waves | Founder | Open | Usability | RES |
| RISK-UX-009 | Wireframes drifting beyond Scope | M | H | H | Designer invent | Registry Scope column; impact model | Reject out-of-Scope WF | Founder | Open | Continuous | GOV |
| RISK-LRN-001 | Routes selected from trends not capability | H | H | H | Hype | Methodology + scorecard + sources | Defer Route | Founder | Open | 1B–1D | LRN |
| RISK-LRN-002 | Curriculum obsolescence | H | H | H | Fast tech | Freshness lifecycle | Urgent update triggers | Founder | Open | Continuous | CONTENT |
| RISK-LRN-003 | Excessive vendor dependence | M | H | H | Cloud labs | Vendor-neutral foundations | Swap vendor illustrations | Founder | Open | 1B | OPR/BLD |
| RISK-LRN-004 | Too many launch Routes | H | H | H | Ambition | Portfolio size rule + WIP | Drop optional ANL | Founder | Open | 1D | PORT |
| RISK-LRN-005 | Weak Evidence quality | H | H | H | Passive video | Evidence-first selection | Redesign Missions | Founder | Open | 1C | EVID |
| RISK-LRN-006 | Inaccessible / costly labs | M | H | H | Specialized ranges | Prefer browser/local/container | Cut lab-heavy Routes | Founder | Open | Tech | LAB |
| RISK-LRN-007 | Arabic content lag | H | M | H | Bilingual load | Arabic feasibility assessments | Prioritize LEAD/Nest Arabic | Founder | Open | Loc | AR |
| RISK-LRN-008 | Incorrect prerequisites | M | H | H | Graph errors | Nest map + 1B graph | Remediation edges | Founder | Open | 1B | GRAPH |
| RISK-LRN-009 | Duplicate / superficial CW or SE | M | M | M | Checklist fill | ≥5 candidates + definition tests | Reject weak CXW/SEX | Founder | Open | 1D | CW/SE |
| RISK-LRN-010 | Misleading career promises | H | H | H | Marketing drift | Role/title boundaries | Remove claims | Founder | Open | Continuous | GOV |
| RISK-LRN-011 | AI content inaccuracy / integrity | H | H | H | GenAI drafts | Expert review + Evidence integrity | Human gate | Founder | Open | 1C | EVID |
| RISK-LRN-012 | Expert reviewer unavailable | M | H | H | Capacity | Identify SMEs early | Narrow portfolio | Founder | Open | 1B | DEP |
| RISK-LRN-013 | Content-maintenance overload | H | H | H | Small team | Freshness classes + WIP | Freeze fast-change depth | Founder | Open | Continuous | CONTENT |
| RISK-LRN-014 | Unsafe cyber laboratories | H | H | H | Offensive labs | Defensive scenarios only | Ban live attack labs | Founder | Open | 1C | PRT |
| RISK-LRN-015 | Assessment integrity weakness | H | H | H | Copy/AI | Evidence matrix risks | Human review | Founder | Open | 1C | EVID |
| RISK-LRN-016 | Excessive beginner difficulty | M | H | H | Advanced first | Nest + accessibility scores | Micro-Missions | Founder | Open | Usability | NEST |
| RISK-LRN-017 | Fragmented learning journey | M | M | M | Siloed Horizons | Graph Bridges + CW | Coherence review 1B | Founder | Open | 1B | GRAPH |
| RISK-LRN-018 | Cross-Wing dependency mismatch | M | H | H | Source Stages insufficient | BRG-PRT-BLD-01 + source Proven paths | Alternative CW research via CR | Founder | Open | 1C–1D | CXW |
| RISK-LRN-019 | Cross-Wing / Secure Extension duplication | M | H | H | Overlapping Stages | Boundary doc + duplication test | Redesign overlapping Stage | Founder | Open | 1C | CW/SE |
| RISK-LRN-020 | Insufficient application-security source capability | M | H | H | PRT SOC ≠ AppSec | Required Bridge BRG-PRT-BLD-01 | Expand Bridge or alt CW | Founder | Open | 1C | BRG |
| RISK-LRN-021 | Stage over-fragmentation | M | M | M | Padding Stages | Stage integrity rule | Merge Stages | Founder | Open | 1C | STG |
| RISK-LRN-022 | Stage under-specification | M | H | H | Vague outcomes | Stage architecture standard | Block 1D lock | Founder | Open | 1C | STG |
| RISK-LRN-023 | Duplicated shared learning | M | M | M | Parallel rewrites | Shared-capability registry | Consolidate to SHC authority | Founder | Open | 1C | SHC |
| RISK-LRN-024 | Graph cycles in mandatory prerequisites | L | H | H | Bad edges | Manual DAG check; invariants | Remove/reverse edge | Founder | Open | Continuous | GRAPH |
| RISK-LRN-025 | Unclear Evidence anchors | M | H | H | Passive completion | Evidence Anchor Registry | Redesign in 1C | Founder | Open | 1C | EVD |
| RISK-LRN-026 | Route-Proven ambiguity | M | H | H | Completion treated as Proven | Qualitative Proven standard | Clarify UX copy | Founder | Open | PROGRESSION.1 | PRV |
| RISK-LRN-027 | Horizon-Proven overclaiming | M | H | H | Single Route award | Awarding deferred policy | Block Wing Key until catalogue expands | Founder | Open | Continuous | HRZ |
| RISK-LRN-028 | Excessive remediation loops | M | M | M | Over-trigger Micro-Missions | Targeted remediation arch | Cap remediations per gap | Founder | Open | 1C | RMD |
| RISK-LRN-029 | Architecture exceeding founder capacity | H | H | H | 5 Routes + CW + SE content | ANL reserve; WIP; 1D lock gate | Drop ANL permanently via CR | Founder | Open | Continuous | WIP |
| RISK-LRN-030 | ANALYZE reserve becoming hidden Scope expansion | M | H | H | Quiet promotion to P0 | Explicit LAUNCH RESERVE status + CR | Reject unscoped ANL work | Founder | Open | Continuous | ANL |
| RISK-LRN-031 | Expert-review availability for architecture domains | H | H | H | SME scarcity | Expert-review requirements (NOT RUN) | Narrow PUBLISHED set | Founder | Open | 1D | EXP |
| RISK-LRN-032 | Mission-count explosion | M | H | H | Blueprint inflation | Portfolio-size limits (DEC-072) | Cap packs; merge Missions | Founder | Open | 1D | MSN |
| RISK-LRN-033 | Passive learning replacing practice | M | H | H | Watch-only packs | Practical category minima + Evidence | Redesign Mission | Founder | Open | Pilot | MSN |
| RISK-LRN-034 | Weak Evidence authenticity | H | H | H | Screenshots-only / recycled artifacts | Integrity model + authenticity signals | Integrity Review | Founder | Open | 1D | EVD |
| RISK-LRN-035 | Rubric inconsistency across reviewers | M | H | H | Ambiguous criteria | Shared dimensions + short rubrics | Calibration sessions | Founder | Open | Pilot | RUB |
| RISK-LRN-036 | Reviewer overload | H | H | H | Capstone + dual-review load | Reviewer role matrix; dual only when justified | Narrow launch Evidence | Founder | Open | Continuous | REV |
| RISK-LRN-037 | Unsafe Evidence uploads | H | H | H | Secrets/malware/PII | Safe Evidence handling; scanning deps | Quarantine + takedown | Founder | Open | Tech | SAFE |
| RISK-LRN-038 | AI-assisted plagiarism | H | H | H | Undeclared genAI | AI policy + disclosure + integrity | Integrity Review + remediation | Founder | Open | Continuous | AI |
| RISK-LRN-039 | Excessive learner disclosure burden | M | M | M | Over-detailed AI prompts | Disclose category/purpose/portions/verify — not private prompts | Simplify disclosure UX | Founder | Open | Pilot | AI |
| RISK-LRN-040 | Sensitive operational data submission | H | H | H | Employer/customer data | Synthetic preference + PROHIBITED class | Reject + educate | Founder | Open | Continuous | PRIV |
| RISK-LRN-041 | Inaccessible labs | M | H | H | Tooling barriers | Modality alternatives; LOCAL-SAFE paths | Browser-only fallback | Founder | Open | Tech | LAB |
| RISK-LRN-042 | Weak Arabic technical content | H | M | H | Bilingual lag | Arabic-first fields + Arabic review | Prioritize Nest/LEAD Arabic | Founder | Open | Loc | AR |
| RISK-LRN-043 | Capstones too large | M | H | H | Scope creep | Capstone constraints + intensity caps | Split optional outputs | Founder | Open | Pilot | CAP |
| RISK-LRN-044 | Capstones too easy | M | H | H | Checklist theatre | Integrity tests + practical function dimension | Raise practical bar | Founder | Open | Expert | CAP |
| RISK-LRN-045 | Cross-Wing integration remaining superficial | M | H | H | Separate artifacts glued | CXW-001-INT-01 + integration rubric | Fail non-integrated packs | Founder | Open | 1D | CXW |
| RISK-LRN-046 | Team success masking individual weakness | M | H | H | Live Sky free-riding | Team contribution Evidence rules | Role-bound credit only | Founder | Open | Live | TEAM |
| RISK-LRN-047 | Remediation loops becoming punitive | M | M | M | Infinite retry shame | Targeted remediation library + preserve progress | Cap loops; mentor path | Founder | Open | Continuous | RMD |
| RISK-LRN-048 | Pilot participants unavailable | H | H | H | No learners for pilot | Pilot requirements; recruit early | Delay PUBLISHED | Founder | Open | Pilot | PLT |
| RISK-LRN-049 | Content-production workload exceeding founder capacity | H | H | H | 87 blueprints → full content | WIP; ANL reserve; production handoff states | Cut depth; freeze ANL | Founder | Open | Continuous | WIP |
| RISK-LRN-050 | Expert-review staffing after design lock | H | H | H | SME scarcity | Expert packets READY; publication blocked until review | Delay PUBLISHED | Founder | **BLOCKING PUBLICATION** | 1D+ | EXP |
| RISK-LRN-051 | Learner-pilot availability after design lock | H | H | H | No participants | Pilot packets READY; publication blocked | Delay PUBLISHED | Founder | **BLOCKING PUBLICATION** | 1D+ | PLT |
| RISK-LRN-052 | Design freeze violated by silent portfolio change | M | H | H | Uncontrolled edits | LEARNING-DESIGN-FREEZE-POLICY + CR | Revert; rebaseline | Founder | Monitored | Continuous | FRZ |
| RISK-LRN-053 | Mistaking design lock for publication approval | H | H | H | Status confusion | Status model + readiness matrix | Correct PUBLICATION=BLOCKED | Founder | Monitored | Continuous | GOV |

**Contingency owners** default to Founder until roles are staffed.

### 1D risk status note

Design baseline lock does **not** mitigate open learning risks. Expert Review, Pilot, lab/storage validation, and capacity risks remain **OPEN** or **BLOCKING PUBLICATION**.

### Progression architecture risks (GHV.PROGRESSION.1A)

| ID | Title | L | I | R | Trigger | Mitigation | Contingency | Owner | Status | Review | Cont. |
|----|-------|---|---|---|---------|------------|-------------|-------|--------|--------|-------|
| RISK-PRG-001 | XP perceived as Skill score | H | H | H | UI conflation | Separation + explainability | Correct copy; training | Founder | Open | 1B+ | EXP |
| RISK-PRG-002 | Momentum encourages unhealthy grinding | M | H | H | Streak pressure | Anti-burnout + fairness | Soften season rules in 1B | Founder | Open | 1B | FAI |
| RISK-PRG-003 | Maturity Rank confused with job seniority | M | M | M | Title wording | Explicit disclaimers | Rename display labels | Founder | Open | Continuous | TTL |
| RISK-PRG-004 | Mastery aggregation masks weak capabilities | M | H | H | Premature % formulas | Capability/Route separation | Capability-level visibility | Founder | Open | 1B | MST |
| RISK-PRG-005 | Breadth inflated by near-duplicates | M | M | M | Loose capability IDs | Duplicate-control rules | Recalibrate Breadth | Founder | Open | 1B | BRD |
| RISK-PRG-006 | Trust becomes popularity score | H | H | H | Reaction-based Trust | Trust architecture invariants | Remove reaction inputs | Founder | Open | Continuous | TRU |
| RISK-PRG-007 | Opaque Trust restrictions | M | H | H | Unexplained blocks | Explainability + appeals | Expand appeal coverage | Founder | Open | Continuous | TRU |
| RISK-PRG-008 | Titles overstate employability | H | H | H | Marketing drift | Employment disclaimer | Correct public copy | Founder | Open | Continuous | TTL |
| RISK-PRG-009 | Prestige inflation or favoritism | M | H | H | Weak quorum | Human review + rarity | Raise bar; audit | Founder | Open | 1C+ | PRS |
| RISK-PRG-010 | Founder Prestige conflict of interest | M | H | H | Self-grant | Founder ≠ auto Prestige | Independent review panel | Founder | Open | Prestige | PRS |
| RISK-PRG-011 | Leaderboard toxicity / small-population distortion | M | M | M | Low N boards | Board separation + privacy | Hide low-N boards | Founder | Open | Launch | LDB |
| RISK-PRG-012 | Minor-user exposure on standings | H | H | H | Public boards | Age-privacy architecture | Restrict minor boards | Founder | Open | Legal | AGE |
| RISK-PRG-013 | Perceived pay-to-win | H | H | H | Capacity confusion | Anti-pay-to-win invariants | Public education | Founder | Open | Continuous | COM |
| RISK-PRG-014 | Merit / Mission farming | M | H | H | Low-value loops | Anti-gaming + caps | Tighten recognition | Founder | Open | 1B | AGM |
| RISK-PRG-015 | AI-generated activity spam | M | H | H | Automated XP | Integrity + authenticity | Suspend provisional XP | Founder | Open | Tech | AGM |
| RISK-PRG-016 | Reviewer collusion / Team masking weak individuals | M | H | H | Shared reviews | Conflict controls + contribution separation | Dual review | Founder | Open | Continuous | INT |
| RISK-PRG-017 | Inaccessible progression requirements | M | H | H | Live-only Evidence | Fairness + alternatives | Provide alternatives | Founder | Open | Pilot | FAI |
| RISK-PRG-018 | Unexplainable automated decisions | H | H | H | Hidden scores | Explainability mandate | Human review override | Founder | Open | Continuous | EXP |
| RISK-PRG-019 | Correction cascade / outdated Mastery | M | M | M | Broad revocation | Targeted reevaluation | Limit blast radius | Founder | Open | Ops | COR |
| RISK-PRG-020 | Unresolved formula tuning / calibration | H | H | H | Premature lock | 1B simulation + 1C calibration | Delay final lock | Founder | Open | 1B–1D | SIM |
| RISK-PRG-021 | Founder capacity for appeals and Prestige reviews | H | H | H | Volume | WIP + staffing deps | Narrow Prestige scope | Founder | Open | Continuous | CAP |

### Progression formula / simulation risks (GHV.PROGRESSION.1B)

Simulation PASS does **not** mitigate these risks. They remain **Open** until 1C calibration, real pilots, and operational controls.

| ID | Title | L | I | R | Trigger | Mitigation | Contingency | Owner | Status | Review | Cont. |
|----|-------|---|---|---|---------|------------|-------------|-------|--------|--------|-------|
| RISK-PRG-022 | XP inflation / over-recognition | M | H | H | High base values | Caps + anti-farming + 1C retune | Lower intensity tables | Founder | Open | 1C | XP |
| RISK-PRG-023 | Flight Level overlap with Maturity meaning | M | H | H | UI conflation | Separation + Level cosmetic-only rule | Soften Level prominence | Founder | Open | 1C | LVL |
| RISK-PRG-024 | Momentum unfairness for compressed schedules | M | H | H | One-day weeks | Best-six + grace weeks + fairness tests | Adjust season/best-N | Founder | Open | 1C | MOM |
| RISK-PRG-025 | Momentum threshold instability | H | M | H | ±10% band shifts | Sensitivity watch; 1C band spacing | Widen/soften Diamond | Founder | Open | 1C | MOM |
| RISK-PRG-026 | Maturity over-gating experienced users | M | H | H | Hard Evidence gates | Experienced-learner path in formula | Lower Rank gates via CR | Founder | Open | 1C | MAT |
| RISK-PRG-027 | Maturity too easy to farm | M | H | H | Weak dimension evidence | Dimension Evidence requirements | Raise Index gates | Founder | Open | 1C | MAT |
| RISK-PRG-028 | Mastery averages hiding weak mandatory areas | H | H | H | Compensating averages | Mandatory CMI floors ≥50 | Fail RP when floors miss | Founder | Open | 1C | MST |
| RISK-PRG-029 | Breadth inflation via near-duplicates | M | M | M | Loose clusters | Duplicate-control + RT-ANL-001 = 0 | Recalibrate clusters | Founder | Open | 1C | BRD |
| RISK-PRG-030 | Trust thresholds produce false restrictions | M | H | H | Over-sensitive concerns | Time windows + appeal | Soften transitions | Founder | Open | 1C | TRU |
| RISK-PRG-031 | Trust positive signals gamed | M | H | H | Manufactured positivity | Signal classification + non-erasure of serious incidents | Human review | Founder | Open | 1C | TRU |
| RISK-PRG-032 | Title templates overstate capability | H | H | H | Marketing drift | Employment disclaimer + Mastery floors | Narrow eligibility | Founder | Open | 1C | TTL |
| RISK-PRG-033 | Prestige candidate inflation | M | H | H | Low PEI / weak quorum | Hard gates + rarity + human grant only | Raise PEI / quorum | Founder | Open | 1C | PRS |
| RISK-PRG-034 | Reviewer-panel availability | H | H | H | Quorum shortfall | Narrow Prestige scope; staffing deps | Pause Prestige grants | Founder | Open | Continuous | PRS |
| RISK-PRG-035 | Achievement clutter | M | M | M | Too many rules | Cap at 12 provisional; Skill vs participation | Retire low-value ACH | Founder | Open | 1C | ACH |
| RISK-PRG-036 | Leaderboard small-population distortion | M | M | M | Low N boards | POL-POP-001 thresholds | Hide public ranks | Founder | Open | Launch | LDB |
| RISK-PRG-037 | Community score reviewer bias | M | H | H | Subjective contribution scoring | Dual review + explainability | Exclude biased boards | Founder | Open | Pilot | LDB |
| RISK-PRG-038 | Synthetic assumptions ≠ real users | H | H | H | Calibration from sims alone | Treat sims as candidates only | Require pilot data in 1C | Founder | Open | 1C | SIM |
| RISK-PRG-039 | Formula sensitivity / unstable classification | H | M | H | Threshold proximity | Sensitivity report watches | Prefer stable bands in 1C | Founder | Open | 1C | SIM |
| RISK-PRG-040 | Rounding inconsistencies | M | M | M | Mixed rounding rules | Deterministic rounding per formula | Align half-away policy | Founder | Open | Tech | FRM |
| RISK-PRG-041 | Correction cascades | M | H | H | Broad revocation | Targeted reevaluation (POL-COR-001) | Limit blast radius | Founder | Open | Ops | COR |
| RISK-PRG-042 | Formula version drift | M | H | H | Silent parameter edits | FORMULA-REVISION-LOG + version storage | Reject unlogged changes | Founder | Open | Continuous | FRM |
| RISK-PRG-043 | Analytical script mistaken for Product Code | M | H | H | Path confusion | `analysis/` isolation + NON-RUNTIME markers | Relocate / refuse runtime use | Founder | Open | Continuous | SIM |
| RISK-PRG-044 | False confidence from simulations / internal calibration | H | H | H | Treating 1C PASS as production calibrated | Status wording + DEC-134/135 | Block final lock until 1D + pilots | Founder | Open | 1C–1D | SIM |
| RISK-PRG-045 | Accessibility bias in Momentum/Evidence paths | M | H | H | Live-only / compressed unfairness | Fairness alternatives + watches; synthetic schedule PASS | Provide equivalent modalities | Founder | Open | Pilot | FAI |
| RISK-PRG-046 | Minor-user exposure on standings | H | H | H | Public boards / identity leak | Age-privacy + board restrictions | Restrict minor visibility | Founder | Open | Legal | AGE |
| RISK-PRG-047 | Founder capacity for calibration | H | H | H | 1C WIP overload | Narrow calibration scope; sequence watches | Defer non-critical retunes | Founder | Open | 1C–1D | CAP |
| RISK-PRG-048 | Fledgling Rank meaningless / skipped | M | H | H | Context defect / Rank skip abuse | FRM-MAT-001 0.2.0; Fledgling 3472 measured | Re-check in real pilot | Founder | Open | 1D/Pilot | MAT |
| RISK-PRG-049 | Gold League concentration / Diamond unreachable | M | M | M | Cosmetic equalization pressure | CAL-FND-006; Diamond 0 OK | Do not equalize leagues | Founder | Open | Pilot | MOM |
| RISK-PRG-050 | Route-Proven overproduction in stress mixes | M | H | H | Citing Cohort A RP as launch KPI | Cohort B mandatory (22.88%) | Pilot density compare | Founder | Open | Pilot | MST |
| RISK-PRG-051 | Evidence XP inflating Flight Level perception | M | H | H | UX conflation XP=Skill | FRM-XP-001 0.1.1 + explainability | Soften Level prominence | Founder | Open | Usability | XP |
| RISK-PRG-052 | Prestige nomination inflation (stress cohorts) | M | H | H | Cohort A Asc ~8% misread as launch | Cohort B Asc 0%; no cosmetic PEI hike | Panel + PEI monitor | Founder | Open | 1D | PRS |
| RISK-PRG-053 | Synthetic generator bias / multi-seed instability | H | H | H | Generator artifacts mistaken for product truth | Multi-seed RUN-007; DEC-124 | Require real-user data | Founder | Open | Pilot | SIM |
| RISK-PRG-054 | Formula overfitting to synthetic cohorts | H | H | H | Quota retunes to histograms | Calibration principles locked | Reject cosmetic retunes | Founder | Open | 1D | SIM |
| RISK-PRG-055 | Arabic explainability gaps | M | H | H | EN-only explanations | AR/EN explainability package | Localization review | Founder | Open | Launch | EXP |
| RISK-PRG-056 | Real-user behavior differs materially from synthetic | H | H | H | Internal calibration alone | DEC-134/148; real-user NOT RUN | Delay production confidence | Founder | Open | Pilot | SIM |
| RISK-PRG-057 | Screen-count baseline defect (90 listed vs 92 authoritative / 7 shells) | H | H | H | ARCHITECTURE.1A without reconcile | Record defect; **GHV.BASELINE-CORRECTION.1**; do not silently rewrite in Progression Gates | Block ARCH.1A until correction | Founder | **RESOLVED BY CONTROLLED BASELINE CORRECTION** | 2026-07-21 · CR-001 · DEC-152 · residual closed by CR-002/DEC-153 (alias-safe) | SCR |
| RISK-PRG-058 | Screen-baseline alias inflation (SUPERSEDED_ALIAS counted in inventory → 91 ACTIVE) | H | H | H | ARCH.1A preflight false 92 | **CR-002**: ACT-004 appendix-only; ACT-013 risk accept ACTIVE; alias-safe counting locked | Re-verify 0 aliases in inventory before Material CRs | Founder | **RESOLVED BY CR-002 / DEC-153** | 2026-07-21 · preflight PASS | SCR |
| RISK-ARC-001 | Premature stack lock | H | H | H | Accept stack in 1A without spikes | DEC-165 · P0 6/6 PASS · ADR register | Domain/provider validation still required | Founder | **PARTIALLY MITIGATED — DOMAIN RISK REMAINS** | Open | ARCH |
| RISK-ARC-002 | Inherited-technology bias | H | H | H | Treat CyberCrow paths as approved | DEC-158 · SPK-ARC-001 reject/inherit table | Reject silent ACCEPTED | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-005 | Event duplication | H | H | H | Double-apply standing | SPK-ARC-010 P0 PASS · DEC-160 | Production-scale and replay controls still required | Founder | **P0 EVIDENCE — IMPLEMENTATION RISK OPEN** | Open | ARCH |
| RISK-ARC-007 | Formula-version drift | H | H | H | Silent parameter rewrite | SPK-ARC-011 P0 PASS · DEC-161 | Runtime governance and migration controls still required | Founder | **P0 EVIDENCE — IMPLEMENTATION RISK OPEN** | Open | ARCH |
| RISK-ARC-008 | Evidence-object exposure | H | H | H | Public Evidence URLs | SPK-ARC-007 PASS · DEC-199 · ADR-019/020 | Isolation architecture accepted; provider/runtime validation remains | Founder | **P1 EVIDENCE — IMPLEMENTATION RISK OPEN** | Open | ARCH |
| RISK-ARC-020 | Entitlement/progression coupling | H | H | H | Pay-to-win path | SPK-ARC-012 | Keep ledgers separate | Founder | **BLOCKING IMPLEMENTATION** | Open | ARCH |
| RISK-ARC-021 | Trust privacy leakage | H | H | H | Public Trust score | SPK-ARC-013 · 025 PASS · DEC-203 | Architecture forbids public score; launch UX still required | Founder | **1C EVIDENCE — LAUNCH UX RISK OPEN** | Open | ARCH |
| RISK-ARC-029 | Preview/production isolation failure | H | H | H | Shared Production DB on Preview | SPK-ARC-021 P0 PASS · TECH-018 | Block Preview runtime until remediation | Founder | **P0 EVIDENCE — TECH-018 OPEN** | Open | ARCH |
| RISK-ARC-031 | Founder operational overload | H | M | H | Over-wide architecture | Capacity ASM · modular monolith bias | Shrink WIP | Founder | **MONITORED** | Continuous | ARCH |
| RISK-ARC-033 | Stale architecture documentation | M | M | M | Docs drift after 1A/1B | Source map · readiness matrix · 1E reconciliation | Reconcile in 1E | Founder | **MONITORED** | Continuous | ARCH |
| RISK-ARC-034 | False confidence from small P0 spikes | H | H | H | Treat 6 harness tests as full validation | DEC-190 · status messaging · P1–P3 still NOT RUN | Require later spikes + domain gates | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-035 | ORM abstraction leakage | M | H | H | Drizzle defaults hide hot-path SQL needs | ADR-006 raw SQL exceptions · query review | Justified raw SQL + explain plans | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-036 | Event ledger unbounded growth | M | H | H | Append-only ledger without lifecycle | Retention/archival policy in 1C/1D | Partition/archive + targeted replay | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-037 | Spike harness mistaken for Product Code | H | H | H | Copy spike libs into product tree | DEC-189 · spike root isolation | Reject Product Code until authorized Gate | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-038 | Monorepo operational burden | M | M | M | Package/workspace sprawl | Modular monolith package boundaries · founder WIP | Extract or simplify packages | Founder | **OPEN** | Open | ARCH |

| RISK-ARC-039 | Identity-provider lock-in | M | H | H | Domain logic embeds vendor APIs | ADR-013 adapter lock · DEC-204 | Swap adapter | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-040 | Recovery abuse / assurance bypass | H | H | H | Support shortcuts activation | ACCOUNT-RECOVERY boundary · privileged SoD | Dual-control exceptions only | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-041 | Session theft / fixation | H | H | H | Stolen cookie/token | ADR-014 rotation/revocation | Force logout all devices | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-042 | Privilege escalation / policy misconfig | H | H | H | Role alone grants access | ADR-015 resource checks · deny default | Break-glass audit | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-043 | Malware / secret upload | H | H | H | Skip quarantine | SPK-ARC-008 fail-closed · ADR-021 | Keep fail-closed | Founder | **P2 EVIDENCE — PROVIDER RISK OPEN** | Open | ARCH |
| RISK-ARC-044 | Scan false negative / positive | M | H | H | Scanner quality | Dual scanners · appeal path | Quarantine backlog ops | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-045 | Signed-URL / storage credential compromise | H | H | H | Long-lived URLs | Short TTL · credential isolation | Rotate keys · revoke | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-046 | Audit tampering / excess PII in audit | M | H | H | Mutable audit / over-logging | Append-only · SPK-ARC-019 | Tamper-evident store in 1D | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-047 | Minor public-profile leakage | H | H | H | Legal identity on public surface | SPK-ARC-025 · ADR-023 | Legal review + tests | Founder | **1C EVIDENCE — LEGAL OPEN** | Open | ARCH |
| RISK-ARC-048 | Saudi integration assumption | M | H | H | Claim Nafath availability | SAUDI readiness · OFFICIAL ACCESS NOT VERIFIED | Defer federation | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-049 | Legal retention uncertainty | H | H | H | Wrong deletion/retention | ADR-017 DRAFT classes | Legal validation required | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-050 | Spike confidence exceeding evidence | H | H | H | Treat 1C harness as prod security | DEC-205 · PARTIAL gate | Require pen-test + provider sandbox | Founder | **OPEN** | Open | ARCH |

| RISK-ARC-051 | Live Sky spectator fan-out / connection scaling | H | H | H | Unbounded spectators | Channel separation · capacity triggers | Degrade spectators first | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-052 | Reconnect contribution duplication | M | H | H | Client retry storms | SPK-ARC-015 command idempotency | Reject duplicates | Founder | **1D EVIDENCE — RUNTIME RISK OPEN** | Open | ARCH |
| RISK-ARC-053 | Payment webhook forgery / entitlement drift | H | H | H | Unsigned events | ADR-029 signature + reconcile | Freeze entitlements | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-054 | Search privacy / Arabic relevance | M | H | H | Filter miss / poor AR search | SPK-ARC-016 · authZ filters | Narrow search surfaces | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-055 | Notification duplication / sensitive leak | M | H | H | Retry storms | Outbox idempotency · content minimization | Dead-letter | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-056 | Offline stale overwrite | H | H | H | Multi-device race | SPK-ARC-006 revision checks | Conflict UX | Founder | **1D EVIDENCE — IMPL RISK OPEN** | Open | ARCH |
| RISK-ARC-057 | Observability PII / Evidence in logs | H | H | H | Over-logging | SPK-ARC-022 redaction | Block ship of loose logging | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-058 | Backup restore incompleteness | H | H | H | Partial restore | ADR-035 · restore drills | Hold cutover | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-059 | Environment / secret leakage | H | H | H | Preview=Prod | ADR-036 · SPK-021 | Block Preview runtime | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-060 | Spike confidence vs real infrastructure | H | H | H | 25/25 mistaken for prod-ready | DEC-215 · PARTIAL gate | Require 1E + infra tests | Founder | **OPEN** | Open | ARCH |
| RISK-ARC-061 | Accessibility outcomes untested with users | H | H | H | Automated-only a11y | ADR-026 user-validation debt | Schedule user tests | Founder | **OPEN** | Open | ARCH |
| RISK-GOV-001 | Gate work continuing after a mandatory stop condition | M | H | H | Precondition fail ignored; mixed correction + substantive Gate commit | Precondition checklist · stop checkpoint · separate correction commit/Gate · resumption record · reviewer confirmation · amendment if mixed (DEC-173) | Reopen Gate / issue amendment; do not rewrite history | Founder | **OPEN / MONITORED** — Amendment-01 recorded; **not eliminated** | Continuous | GOV |
| RISK-GOV-002 | Stack acceptance messaging overclaims validation | M | H | H | “Architecture done” after 1B | PROJECT_STATUS · BASELINE-MANIFEST · DEC-190 · **1E-AMENDMENT-01 restores 1B PARTIAL** | Correct to PARTIAL / domain continues · verdict preservation policy | Founder | **OPEN / MONITORED** — label corrected; overclaim risk not eliminated | Open | GOV |
| RISK-GOV-003 | Downstream Gate summaries silently upgrading predecessor verdicts | H | H | H | PARTIAL quoted as PASS in starting-state / registers | Authoritative Gate records · exact-verdict refs · amendment linkage · GATE-VERDICT-CONSISTENCY-CHECK · pre-next-Gate validation · reviewer sign-off · DEC-227..232 | Correct via amendment before next programme Gate | Founder | **OPEN / MONITORED** — 1E-AMENDMENT-01 applied; not permanently eliminated | Continuous | GOV |

Architecture, simulation, synthetic calibration, **Progression Design Baseline lock**, **Architecture Design Baseline lock (1E)**, **Core Platform Stack Baseline acceptance**, and **P0 spike PASS** do **not** close these risks; external validation, provider selection, real-user pilots, staffing, and operational controls remain required. Full architecture risk set: [ARCHITECTURE-RISK-REGISTER.md](../../architecture/ghuravia/governance/ARCHITECTURE-RISK-REGISTER.md).

## 1E note (2026-07-21)

GHV.ARCHITECTURE.1E locks the governed architecture **design** baseline only. External infrastructure validation, provider sandbox validation, legal/privacy validation, accessibility user validation, Arabic UX user validation, penetration testing, and operational DR validation remain **OPEN / NOT RUN**. Do not downgrade Open risks based on design lock alone.
