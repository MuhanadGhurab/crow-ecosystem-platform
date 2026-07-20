# Risk Register

| Field | Value |
|-------|-------|
| **Status** | ACTIVE — Initial |
| **Version** | 1.0.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Note** | Risks are identified, not claimed mitigated |

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
| RISK-OPS-014 | 90-screen overcommitment | M | H | H | UI build sprawl | Screen families; PD.3 wireframes prioritize MLGW | Defer non-MLGW screens | Founder | Open | 2026-09-01 | CAP-EBUX-* |
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

**Contingency owners** default to Founder until roles are staffed.
