# Shared Capability Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-SHC-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Review date** | Before GHV.LEARNING.1D |
| **Related** | [LEARNING-IDENTIFIER-STANDARD.md](./LEARNING-IDENTIFIER-STANDARD.md) · [NEST-CAPABILITY-REGISTRY.md](../nest/NEST-CAPABILITY-REGISTRY.md) · [REMEDIATION-ARCHITECTURE.md](./REMEDIATION-ARCHITECTURE.md) · [CONTENT-FRESHNESS-AND-LIFECYCLE.md](../content/CONTENT-FRESHNESS-AND-LIFECYCLE.md) |
| **Source research** | GHV.LEARNING.1A portfolio · Nest dependency map |
| **Limitations** | Working Stage references are architecture anchors, not locked Mission catalogues; no Product Codes; no employment or certification claims |
| **Unresolved** | Exact Mission IDs (1C); EQUIVALENT recognition policy depth; bilingual shared-unit packaging; GHV.LEARNING.1D lock |
| **Change history** | 1.0.0 (2026-07-21) — Initial SHARED CAPABILITY registry for GHV.LEARNING.1B |

## Purpose

Register capabilities that appear across multiple Routes so each is taught once authoritatively, reinforced contextually, and not rewritten independently in every Route.

## Governance rules

1. **One authoritative teaching location** per `SHC-*` — Routes may reinforce, not redefine.
2. **Duplication prevention** — catalogue reviews must reject parallel full units that teach the same SHC outcomes.
3. **Recognition later** — approved Evidence tied to an SHC may support `EQUIVALENT` / recognition edges in later Gates without re-teaching the whole unit.
4. **No Product Codes** in this Gate. IDs are learning architecture identifiers only.
5. Shared capabilities must not award paid entitlement, XP, Prestige, Trust, or titles.

## Registry summary

| ID | Capability | Authoritative location | Default graph role |
|----|------------|------------------------|--------------------|
| SHC-001 | Documentation | RT-LED-001-STG-02 | COREQUISITE / RECOMMENDED by Route |
| SHC-002 | Version control | RT-BLD-001-STG-02 | PREREQUISITE for BUILD-heavy paths |
| SHC-003 | Communication | Nest NST-CAP-011 + RT-LED-001-STG-01 | RECOMMENDED / COREQUISITE |
| SHC-004 | Troubleshooting | Nest NST-CAP-012 | PREREQUISITE foundation; Route reinforce |
| SHC-005 | Responsible AI assistance | Nest NST-CAP-010 | PREREQUISITE / COREQUISITE |
| SHC-006 | Privacy | Nest NST-CAP-008 | PREREQUISITE foundation |
| SHC-007 | Identity basics | Nest NST-CAP-013 + RT-OPR-001-STG-01 | PREREQUISITE / COREQUISITE |
| SHC-008 | Evidence integrity | RT-LED-001-STG-03 (cross-taught) | COREQUISITE for Evidence-bearing Stages |
| SHC-009 | Teamwork | Nest NST-CAP-011 + TEAM / Live Sky | RECOMMENDED / COREQUISITE |
| SHC-010 | Risk awareness | RT-LED-001-STG-01 | COREQUISITE for LEAD / CW / SE |
| SHC-011 | Accessibility | RT-BLD-001-STG-03 | RECOMMENDED; COREQUISITE where UX Evidence |
| SHC-012 | Change management | RT-OPR-001-STG-05 | COREQUISITE for ops / SE |

---

## SHC-001 — Documentation

| Field | Content |
|-------|---------|
| **ID** | SHC-001 |
| **Capability** | Clear written records: runbooks, decisions, handoffs, Evidence narratives |
| **Authoritative teaching location** | **RT-LED-001-STG-02** — Delivery documentation & decision records |
| **Reinforcement locations** | RT-OPR-001 (runbooks) · RT-BLD-001 (README / change notes) · RT-PRT-001 (triage notes) · CXW-001 Integration · SEX-001 secure ops notes · Nest NST-CAP-012 (document-your-steps) |
| **Evidence location** | Explanation / decision-record anchors on each Route; LED Evidence bundle primary for SHC claim |
| **Prereq / coreq / recommended** | **COREQUISITE** for Capstone / Route-Proven review; **RECOMMENDED** early in all P0 Routes |
| **Duplication prevention** | No Route owns a second full “how to write docs” Stage; contextual templates only |
| **Later recognition note** | Approved LED or Route decision-record Evidence may satisfy documentation COREQUISITE via `EQUIVALENT` without re-enrollment |

## SHC-002 — Version control

| Field | Content |
|-------|---------|
| **ID** | SHC-002 |
| **Capability** | Safe use of repositories: clone, branch hygiene, commit messages, no secrets in history |
| **Authoritative teaching location** | **RT-BLD-001-STG-02** — Repository & delivery hygiene |
| **Reinforcement locations** | RT-OPR-001 (config as code light) · RT-PRT-001 (secure change notes) · CXW-001 · SEX-001 |
| **Evidence location** | Repo / commit-history artifacts on BUILD and CXW Evidence anchors |
| **Prereq / coreq / recommended** | **PREREQUISITE** for RT-BLD-001 practical Stages after STG-02; **RECOMMENDED** for RT-OPR-001 / SEX-001 |
| **Duplication prevention** | Other Routes link to STG-02 outcomes; no parallel Git bootcamps |
| **Later recognition note** | Prior BUILD Evidence with clean repo hygiene may be recognized for CXW/SE repo tasks |

## SHC-003 — Communication

| Field | Content |
|-------|---------|
| **ID** | SHC-003 |
| **Capability** | Clear asks, status updates, respectful disagreement, escalation without blame |
| **Authoritative teaching location** | **Nest NST-CAP-011** (foundation) deepened in **RT-LED-001-STG-01** |
| **Reinforcement locations** | TEAM_MISSION / LIVE_SKY_MISSION categories · RT-PRT-001 handoff · CXW-001 release communication |
| **Evidence location** | Team / Live Sky participation records; LED communication reflection where required |
| **Prereq / coreq / recommended** | Nest foundation **PREREQUISITE** for Guided Skip weak N-COL equivalents; LED deepen **COREQUISITE** for CW Integration |
| **Duplication prevention** | Soft-skills lectures not cloned per Route; scenario prompts reference SHC-003 |
| **Later recognition note** | Nest collaboration Evidence + LED reflection may cover communication COREQUISITE |

## SHC-004 — Troubleshooting

| Field | Content |
|-------|---------|
| **ID** | SHC-004 |
| **Capability** | Observe → isolate → fix → document; useful help questions |
| **Authoritative teaching location** | **Nest NST-CAP-012** |
| **Reinforcement locations** | RT-OPR-001-STG-04 · RT-BLD-001 debug Stages · RT-PRT-001 triage · RT-ANL-001 reproduce-steps · all Micro-Missions on Nest weakness |
| **Evidence location** | Incident / debug notes; Nest Micro-Mission completion for Guided Skip gaps |
| **Prereq / coreq / recommended** | Nest readiness on NST-CAP-012 is **PREREQUISITE** for advanced labs; Route practice **REINFORCES** |
| **Duplication prevention** | Routes teach domain tools, not a second generic troubleshooting curriculum |
| **Later recognition note** | Nest troubleshooting Evidence remains valid when Routes reinforce domain context |

## SHC-005 — Responsible AI assistance

| Field | Content |
|-------|---------|
| **ID** | SHC-005 |
| **Capability** | Know when AI helps vs invents; label AI-assisted work; verify outputs; never paste secrets |
| **Authoritative teaching location** | **Nest NST-CAP-010** |
| **Reinforcement locations** | RT-BLD-001 · RT-PRT-001 · RT-LED-001 · RT-ANL-001 · CXW-001 · SEX-001 (secrets/AI) |
| **Evidence location** | AI-assist labeling on practical Evidence; Nest AI literacy checks |
| **Prereq / coreq / recommended** | Nest **PREREQUISITE** (or Micro-Mission) where assessment weak; **COREQUISITE** for Evidence-bearing AI-assisted Missions |
| **Duplication prevention** | No per-Route “AI ethics” mini-course; policy checklists reinforce Nest outcomes |
| **Later recognition note** | Nest AI literacy Evidence + labeled Route work recognized across portfolio |

## SHC-006 — Privacy

| Field | Content |
|-------|---------|
| **ID** | SHC-006 |
| **Capability** | Permission hygiene; data minimization; safe sharing of personal / demo data |
| **Authoritative teaching location** | **Nest NST-CAP-008** |
| **Reinforcement locations** | RT-PRT-001 · RT-OPR-001 · RT-ANL-001 · SEX-001 lab-log privacy · CXW-001 demo data |
| **Evidence location** | Nest privacy checks; Route Evidence privacy classification fields |
| **Prereq / coreq / recommended** | Nest **PREREQUISITE** for PROTECT / SEX / data-bearing ANALYZE; **RECOMMENDED** elsewhere |
| **Duplication prevention** | Routes add domain privacy (logs, PII in apps), not a second Nest privacy path |
| **Later recognition note** | Nest privacy Evidence supports shared privacy COREQUISITE; domain Evidence remains Route-specific |

## SHC-007 — Identity basics

| Field | Content |
|-------|---------|
| **ID** | SHC-007 |
| **Capability** | Accounts, sessions, least privilege intuition, personal vs professional identity hygiene |
| **Authoritative teaching location** | **Nest NST-CAP-005 / NST-CAP-006 / NST-CAP-013** foundations; ops deepen in **RT-OPR-001-STG-01** |
| **Reinforcement locations** | RT-PRT-001 · SEX-001 · CXW-001 secrets/IAM awareness · RT-LED-001 professional identity tone |
| **Evidence location** | Nest account/MFA/identity checks; OPR access & identity Stage Evidence |
| **Prereq / coreq / recommended** | Nest account/MFA **PREREQUISITE** for console labs; OPR STG-01 **COREQUISITE** for SEX-001 |
| **Duplication prevention** | Full IAM Routes (if any later) deepen controls; do not re-teach Nest password hygiene |
| **Later recognition note** | Nest + OPR identity Evidence may satisfy SEX identity COREQUISITE slices |

## SHC-008 — Evidence integrity

| Field | Content |
|-------|---------|
| **ID** | SHC-008 |
| **Capability** | Honest authorship, no secrets in artifacts, revision honesty, integrity reporting |
| **Authoritative teaching location** | **RT-LED-001-STG-03** — Evidence & integrity practices (cross-Route standard) |
| **Reinforcement locations** | Every Route Evidence_PREPARATION Mission · Nest AI labeling · SEX secrets never in Evidence |
| **Evidence location** | Integrity checklist on Evidence submit; integrity review outcomes |
| **Prereq / coreq / recommended** | **COREQUISITE** before first graded Evidence submit on any P0 Route |
| **Duplication prevention** | Single integrity standard referenced; Routes only add domain-specific red flags |
| **Later recognition note** | Completion of SHC-008 standard applies portfolio-wide until content/policy change requires refresh |

## SHC-009 — Teamwork

| Field | Content |
|-------|---------|
| **ID** | SHC-009 |
| **Capability** | Shared ownership, attribution, blocker escalation, respectful collaboration |
| **Authoritative teaching location** | **Nest NST-CAP-011** + first **TEAM_MISSION** / **LIVE_SKY_MISSION** experience |
| **Reinforcement locations** | CXW-001 Integration · RT-LED-001 · Capstone team options |
| **Evidence location** | Team / Live Sky Evidence anchors; attribution records |
| **Prereq / coreq / recommended** | Nest collaboration **RECOMMENDED**; Team/Live Sky **COREQUISITE** for portfolio minimum vertical slice (Scope §3.8) |
| **Duplication prevention** | Soft-skills curriculum not duplicated; Missions invoke SHC-009 behaviors |
| **Later recognition note** | One approved Team/Live Sky Evidence may satisfy teamwork COREQUISITE for launch catalogue |

## SHC-010 — Risk awareness

| Field | Content |
|-------|---------|
| **ID** | SHC-010 |
| **Capability** | Spot risk, accept/mitigate/escalate; no false certainty; safety of labs and releases |
| **Authoritative teaching location** | **RT-LED-001-STG-01** — Delivery & risk framing |
| **Reinforcement locations** | RT-PRT-001 · CXW-001 release decision · SEX-001 · Nest NST-CAP-009 (scam/safety foundation) |
| **Evidence location** | Risk acceptance / escalation notes in LED and CW Evidence |
| **Prereq / coreq / recommended** | Nest scam/safety **PREREQUISITE** for PROTECT labs; LED risk **COREQUISITE** for CXW Integration |
| **Duplication prevention** | Threat catalogues stay in PROTECT; LED owns decision framing |
| **Later recognition note** | LED risk Evidence may support CW risk COREQUISITE; PROTECT Evidence remains domain-specific |

## SHC-011 — Accessibility

| Field | Content |
|-------|---------|
| **ID** | SHC-011 |
| **Capability** | Inclusive design basics; readable content; keyboard/contrast awareness; no shame UX |
| **Authoritative teaching location** | **RT-BLD-001-STG-03** — Inclusive delivery basics |
| **Reinforcement locations** | Product UX standards (wireframes) · LED documentation readability · Nest no-shame assessment language (product, not learner curriculum) |
| **Evidence location** | BUILD / CXW UI Evidence accessibility checklist fields |
| **Prereq / coreq / recommended** | **RECOMMENDED** for all BUILD Evidence; **COREQUISITE** where UI is the primary artifact |
| **Duplication prevention** | No second a11y Route at launch; other Horizons link to STG-03 outcomes |
| **Later recognition note** | BUILD a11y Evidence recognized for CXW UI-facing Integration tasks |

## SHC-012 — Change management

| Field | Content |
|-------|---------|
| **ID** | SHC-012 |
| **Capability** | Safe change: plan, communicate, rollback mindedness, record what changed |
| **Authoritative teaching location** | **RT-OPR-001-STG-05** — Change & recovery |
| **Reinforcement locations** | SEX-001 · CXW-001 release controls · RT-LED-001 · RT-BLD-001 deployment Stages |
| **Evidence location** | Change/recovery notes; OPR Capstone stabilize-with-steps |
| **Prereq / coreq / recommended** | **COREQUISITE** for SEX-001 and ops Capstones; **RECOMMENDED** for CXW release Stages |
| **Duplication prevention** | SE and CW reinforce in secure/release context; do not re-teach full change curriculum |
| **Later recognition note** | OPR change Evidence may satisfy SEX change COREQUISITE slices |

---

## Cross-reference: Nest foundations used by SHCs

| Nest capability | Shared capabilities that depend on it |
|-----------------|----------------------------------------|
| NST-CAP-008 Privacy | SHC-006 |
| NST-CAP-010 AI literacy | SHC-005 |
| NST-CAP-011 Collaboration | SHC-003 · SHC-009 |
| NST-CAP-012 Troubleshooting | SHC-004 |
| NST-CAP-005 / 006 / 013 Identity cluster | SHC-007 |
| NST-CAP-009 Scams / safety | SHC-010 (foundation) |

## Explicit non-goals

- Do not invent Product Codes or paid unlocks from SHC completion.
- Do not invent XP / Mastery / Prestige / Trust formulas.
- Do not mark Routes `LOCKED` in this Gate.
- Do not rewrite Nest thresholds (70 / 50 remain locked in Scope §3.5).

## Next Gates

| Gate | Expected work |
|------|----------------|
| GHV.LEARNING.1C | Mission / Evidence instances binding SHC-* |
| GHV.LEARNING.1D | Catalogue lock + display names |
| GHV.PROGRESSION.1 | Any Mastery interaction with shared Evidence (if any) |
