# Decision Register

| Field | Value |
|-------|-------|
| **Status** | ACTIVE |
| **Version** | 1.12.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1A |
| **Related** | [PRODUCT-CONSTITUTION.md](../constitution/PRODUCT-CONSTITUTION.md) · [SCOPE-BASELINE.md](../scope/SCOPE-BASELINE.md) · [LEARNING-IDENTIFIER-STANDARD.md](../../product/learning/architecture/LEARNING-IDENTIFIER-STANDARD.md) · [LAUNCH-GRAPH-REGISTRY.md](../../product/learning/graph/LAUNCH-GRAPH-REGISTRY.md) |

Status values: Accepted · Conditionally Accepted · Pending Validation · Superseded

---

## DEC-001 — Product name

| Field | Value |
|-------|-------|
| **Decision** | Product name is GHURAVIA — غُرافيا (internal selection) |
| **Status** | Conditionally Accepted |
| **Rationale** | Distinct product identity for the learning world |
| **Alternatives** | Retain CyberCrow product naming |
| **Reversible** | Costly after trademark/domain lock |
| **Review trigger** | External trademark/domain conflict |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | [PRODUCT-CONSTITUTION.md](../constitution/PRODUCT-CONSTITUTION.md) |

## DEC-002 — RAVEN founder identity

| Field | Value |
|-------|-------|
| **Decision** | Founder identity is RAVEN — Responsive Adaptive Virtual Education Navigator |
| **Status** | Accepted |
| **Rationale** | Separates methodology/guidance persona from product world |
| **Alternatives** | Founder name only; AI mascot as authority |
| **Reversible** | Yes before public brand lock |
| **Review trigger** | Brand conflict |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Constitution §1 |

## DEC-003 — Six Product Pillars

| Field | Value |
|-------|-------|
| **Decision** | Six Pillars; commercial is enabling, not a seventh learning Pillar |
| **Status** | Accepted |
| **Rationale** | Traceability and anti-pay-to-win clarity |
| **Alternatives** | Seven pillars including commercial |
| **Reversible** | Costly after Feature mapping |
| **Review trigger** | Pillar cannot absorb a required Feature |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Constitution §3 |

## DEC-004 — Arabic-first, international-ready

| Field | Value |
|-------|-------|
| **Decision** | Arabic-first with English LTR; international-ready |
| **Status** | Accepted |
| **Rationale** | Saudi launch priority with global path |
| **Alternatives** | English-only MVP |
| **Reversible** | Partial |
| **Review trigger** | Localization cost overrun |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | [LOCALIZATION-RTL-SPEC.md](../../product/screens/LOCALIZATION-RTL-SPEC.md) |

## DEC-005 — One core platform, regional experiences

| Field | Value |
|-------|-------|
| **Decision** | One Core Platform — Multiple Regional Experiences |
| **Status** | Accepted |
| **Rationale** | Shared domains with policy/content packs |
| **Alternatives** | Fully separate Saudi and global codebases |
| **Reversible** | Costly |
| **Review trigger** | Legal data-residency forces hard split |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Constitution §4 |

## DEC-006 — Audience approximately 15+

| Field | Value |
|-------|-------|
| **Decision** | Target direction approximately age 15+ |
| **Status** | Conditionally Accepted |
| **Rationale** | Broad technical learning audience |
| **Alternatives** | 18+ only from day one |
| **Reversible** | Yes before launch |
| **Review trigger** | Legal validation outcome |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Constitution §5; EVD external age item |

## DEC-007 — Email-first activation

| Field | Value |
|-------|-------|
| **Decision** | Basic activation requires email verified + current terms + acceptable risk |
| **Status** | Accepted |
| **Rationale** | Minimum trustable account without over-blocking learning |
| **Alternatives** | Phone-first; identity-verified-first |
| **Reversible** | Partial |
| **Review trigger** | Abuse rates |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Constitution §7 |

## DEC-008 — Optional basic mobile verification

| Field | Value |
|-------|-------|
| **Decision** | Mobile optional for ordinary learning; required for elevated actions |
| **Status** | Accepted |
| **Rationale** | Reduce activation friction; raise bar for Teams/Live host/etc. |
| **Alternatives** | Mandatory mobile for all |
| **Reversible** | Yes |
| **Review trigger** | Abuse / legal |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Constitution §7 |

## DEC-009 — Passkey-first

| Field | Value |
|-------|-------|
| **Decision** | Passkey-first authentication direction |
| **Status** | Pending Validation |
| **Rationale** | Stronger auth UX; password+TOTP and recovery codes supported |
| **Alternatives** | Password-only MVP |
| **Reversible** | Yes before hard dependency |
| **Review trigger** | Device coverage gaps |
| **Related Gate** | Future identity Gate |
| **Evidence** | Constitution §7; technical validation register |

## DEC-010 — Keycloak-first candidate

| Field | Value |
|-------|-------|
| **Decision** | Keycloak is first IdP **candidate** |
| **Status** | Pending Validation |
| **Rationale** | Open, controllable identity plane |
| **Alternatives** | Managed SaaS IdP only |
| **Reversible** | Yes until integration lock |
| **Review trigger** | Technical validation failure |
| **Related Gate** | Technical validation |
| **Evidence** | [TECHNICAL-VALIDATION-REGISTER.md](../../docs/validation/TECHNICAL-VALIDATION-REGISTER.md) |

## DEC-011 — World-to-Unlock hierarchy

| Field | Value |
|-------|-------|
| **Decision** | World → Horizon → Route → Stage → Mission → Evidence → Unlock |
| **Status** | Accepted |
| **Rationale** | Clear learning architecture |
| **Alternatives** | Flat course catalogue |
| **Reversible** | Costly |
| **Review trigger** | Learner comprehension failure |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Constitution §8 |

## DEC-012 — The Nest

| Field | Value |
|-------|-------|
| **Decision** | The Nest is Digital Foundations with 70/50 readiness bands |
| **Status** | Accepted |
| **Rationale** | Adaptive onboarding without false Mastery |
| **Alternatives** | Mandatory long foundation for all |
| **Reversible** | Partial |
| **Review trigger** | Drop-off data |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Scope Baseline §4 |

## DEC-013 — Five Horizons

| Field | Value |
|-------|-------|
| **Decision** | OPERATE, BUILD, ANALYZE, PROTECT, LEAD |
| **Status** | Accepted |
| **Rationale** | Covers technical learning world without sprawl |
| **Alternatives** | More/fewer Horizons |
| **Reversible** | Costly after content build |
| **Review trigger** | Content atlas conflict |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Constitution §8 |

## DEC-014 — Typed Learning Graph

| Field | Value |
|-------|-------|
| **Decision** | Typed edges; no cycles on mandatory prerequisites; separate Learning/Progress/Entitlement graphs |
| **Status** | Accepted |
| **Rationale** | Integrity of readiness and unlocks |
| **Alternatives** | Informal tags only |
| **Reversible** | Costly |
| **Review trigger** | Query performance validation |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Constitution §8 |

## DEC-015 — Cross-Wing Routes

| Field | Value |
|-------|-------|
| **Decision** | Cross-Wing Routes require Capability Atlas; access formula locked |
| **Status** | Conditionally Accepted |
| **Rationale** | Real-world capability over title mashups |
| **Alternatives** | Freeform multi-topic packs |
| **Reversible** | Catalogue-level yes |
| **Review trigger** | Learning Gate |
| **Related Gate** | Future Learning Gate |
| **Evidence** | [CROSS-WING-CAPABILITY-ATLAS-TEMPLATE.md](../cross-wing/CROSS-WING-CAPABILITY-ATLAS-TEMPLATE.md) |

## DEC-016 — Secure Extensions

| Field | Value |
|-------|-------|
| **Decision** | Secure Extensions may require several skills; Atlas-gated |
| **Status** | Conditionally Accepted |
| **Rationale** | Security depth without fake combinations |
| **Alternatives** | Single-skill badges only |
| **Reversible** | Catalogue-level |
| **Review trigger** | Learning Gate |
| **Related Gate** | Future Learning Gate |
| **Evidence** | Scope Baseline §7 |

## DEC-017 — EBUX

| Field | Value |
|-------|-------|
| **Decision** | Experience-Based User Experience is the primary adaptive model |
| **Status** | Accepted |
| **Rationale** | Adaptive without replacing authorization |
| **Alternatives** | Static dashboard |
| **Reversible** | Costly after UX build |
| **Review trigger** | Usability failure |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | [ADAPTIVE-STATE-MATRIX.md](../../product/ebux/ADAPTIVE-STATE-MATRIX.md) |

## DEC-018 — Adaptive Skyboard

| Field | Value |
|-------|-------|
| **Decision** | Adaptive Skyboard is authenticated home with six module types |
| **Status** | Accepted |
| **Rationale** | Replace crowded static dashboard |
| **Alternatives** | Traditional LMS home |
| **Reversible** | Costly |
| **Review trigger** | Engagement metrics |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | [SKYBOARD-COMPOSITION-RULES.md](../../product/ebux/SKYBOARD-COMPOSITION-RULES.md) |

## DEC-019 — Save and Resume

| Field | Value |
|-------|-------|
| **Decision** | Save and Resume / Flight State is in first launch scope |
| **Status** | Accepted |
| **Rationale** | Returning-user continuity |
| **Alternatives** | Restart-only sessions |
| **Reversible** | Partial |
| **Review trigger** | Sync validation |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Scope Baseline §2.4 |

## DEC-020 — Live Sky

| Field | Value |
|-------|-------|
| **Decision** | Live Sky directory + participant/spectator foundations in launch |
| **Status** | Accepted |
| **Rationale** | Social learning without full metaverse |
| **Alternatives** | Defer all live |
| **Reversible** | Feature-flaggable |
| **Review trigger** | Realtime validation |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Scope Baseline §2.6 |

## DEC-021 — The Rookery

| Field | Value |
|-------|-------|
| **Decision** | Rookery foundation with structured posts; no unrestricted DMs at launch |
| **Status** | Accepted |
| **Rationale** | Positive community with safety |
| **Alternatives** | Open social network |
| **Reversible** | Partial |
| **Review trigger** | Moderation load |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Scope Baseline §2.6 / exclusions |

## DEC-022 — Separate progression systems

| Field | Value |
|-------|-------|
| **Decision** | Access Plan, XP, Momentum, Maturity, Mastery, Breadth, Trust, Titles, Prestige are independent |
| **Status** | Accepted |
| **Rationale** | Prevent pay-to-win and single-metric ranking |
| **Alternatives** | Unified score |
| **Reversible** | Costly |
| **Review trigger** | GHV.PROGRESSION.1 formulas |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Constitution §6 |

## DEC-023 — Access Plans

| Field | Value |
|-------|-------|
| **Decision** | Open Flight + Flight/Wing/Expedition Pass with locked SAR prices and route capacities |
| **Status** | Accepted |
| **Rationale** | Clear commercial capacity model |
| **Alternatives** | Unlimited free; usage metered only |
| **Reversible** | Price revisable via change control |
| **Review trigger** | Cost sustainability |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | [COMMERCIAL-BASELINE.md](../commercial/COMMERCIAL-BASELINE.md) |

## DEC-024 — Merit Access

| Field | Value |
|-------|-------|
| **Decision** | Merit may grant capacity/Prestige Access without buying competence |
| **Status** | Accepted |
| **Rationale** | Equity and contribution without pay-to-win |
| **Alternatives** | Paid-only capacity |
| **Reversible** | Partial |
| **Review trigger** | Abuse of grants |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Scope Baseline §6 |

## DEC-025 — Saudi launch pricing

| Field | Value |
|-------|-------|
| **Decision** | SAR pricing including VAT as published in Commercial Baseline |
| **Status** | Accepted |
| **Rationale** | Saudi-first commercial launch |
| **Alternatives** | USD-only |
| **Reversible** | Via change control |
| **Review trigger** | VAT/legal validation |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Commercial Baseline |

## DEC-026 — Anti-pay-to-win

| Field | Value |
|-------|-------|
| **Decision** | Money never grants XP, Mastery, Evidence approval, exam results, leaderboard position, Trust, or Prestige |
| **Status** | Accepted — Irreversible principle |
| **Rationale** | Trust and skill integrity |
| **Alternatives** | Boost packs |
| **Reversible** | No (constitutional) |
| **Review trigger** | None for weakening |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Constitution §6 |

## DEC-027 — Prestige Classes

| Field | Value |
|-------|-------|
| **Decision** | Ascendant Raven, Apex Raven, Obsidian Raven |
| **Status** | Accepted (formulas pending) |
| **Rationale** | Distinction via Mastery + Trust + Impact |
| **Alternatives** | No Prestige layer |
| **Reversible** | Naming yes; principle costly |
| **Review trigger** | GHV.PROGRESSION.1 |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Constitution §6 |

## DEC-028 — Modular Monolith

| Field | Value |
|-------|-------|
| **Decision** | Modular Monolith, API-First, Event-Aware, Web/PWA first |
| **Status** | Pending Validation |
| **Rationale** | Fit team size and 2029 target; avoid premature microservices |
| **Alternatives** | Microservices-first |
| **Reversible** | Until implementation lock |
| **Review trigger** | Technical validation |
| **Related Gate** | Future architecture Gate |
| **Evidence** | Scope Baseline §8 |

## DEC-029 — 2029 Saudi launch target

| Field | Value |
|-------|-------|
| **Decision** | Controlled Saudi public launch no later than 2029-12-31 |
| **Status** | Accepted |
| **Rationale** | Time-boxed delivery |
| **Alternatives** | Open-ended R&D |
| **Reversible** | Slip requires founder decision |
| **Review trigger** | Gate slippage / risk RISK-OPS-007 |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | Constitution §1 |

## DEC-030 — Product Code blocked

| Field | Value |
|-------|-------|
| **Decision** | Product Code blocked pending governance and technical validation |
| **Status** | Accepted |
| **Rationale** | Prevent stack thrash and authority drift |
| **Alternatives** | Prototype immediately |
| **Reversible** | Yes when Gates authorize |
| **Review trigger** | GHV.FOUNDATION.1B / technical Gates |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | [PROJECT_STATUS.md](../../PROJECT_STATUS.md) |

## DEC-031 — Repository transition acceptance

| Field | Value |
|-------|-------|
| **Decision** | GHV.REPOSITORY-TRANSITION.1A PARTIAL verdict accepted for local governance work; push blocked pending infrastructure verification |
| **Status** | Accepted |
| **Rationale** | Unblock documentation without risky Preview deploy |
| **Alternatives** | Block all work until Vercel CLI verification |
| **Reversible** | N/A |
| **Review trigger** | GHV.REPOSITORY-TRANSITION.1B |
| **Related Gate** | GHV.FOUNDATION.1A |
| **Evidence** | [GHV.REPOSITORY-TRANSITION.1A.md](../gates/GHV.REPOSITORY-TRANSITION.1A.md) |

## DEC-032 — Branch-specific Vercel deployment guard

| Field | Value |
|-------|-------|
| **Decision** | Disable automatic Vercel deployments only for `feat/ghuravia-foundation` via root `vercel.json` `git.deploymentEnabled` |
| **Status** | Accepted |
| **Rationale** | Allow GitHub publish of governance baseline without Preview/Production builds against legacy CyberCrow project settings |
| **Alternatives** | Dashboard-only ignore; leave deploy on; delay remotes |
| **Reversible** | Yes — remove branch key when Preview is intentionally enabled |
| **Review trigger** | Architecture Preview Gate; accidental Preview creation |
| **Related Gate** | GHV.REPOSITORY-TRANSITION.1B |
| **Evidence** | [VERCEL-PRE-PUSH-VERIFICATION.md](../../docs/operations/VERCEL-PRE-PUSH-VERIFICATION.md) · `vercel.json` |

## DEC-033 — Constitution authority hierarchy

| Field | Value |
|-------|-------|
| **Decision** | Conflicts resolve per Authoritative Source Map order (Constitution → Scope → Manifest → Journey → Screens → Capabilities → Decisions → domain baselines → templates) |
| **Status** | Accepted |
| **Rationale** | Prevent competing active definitions |
| **Alternatives** | Equal peer docs |
| **Reversible** | Costly after adoption |
| **Review trigger** | Foundational rebaseline |
| **Related Gate** | GHV.FOUNDATION.1B |
| **Evidence** | [AUTHORITATIVE-SOURCE-MAP.md](../releases/AUTHORITATIVE-SOURCE-MAP.md) |

## DEC-034 — Scope classification system

| Field | Value |
|-------|-------|
| **Decision** | Adopt CORE FOUNDATION / CONTROLLED LAUNCH / POST-LAUNCH PLANNED / CONDITIONAL / PENDING TECHNICAL VALIDATION / PENDING EXTERNAL VALIDATION / DEFERRED / OUT OF SCOPE / REJECTED |
| **Status** | Accepted |
| **Rationale** | Separate durable architecture from launch delivery and pending work |
| **Alternatives** | Binary in/out Scope |
| **Reversible** | Via foundational CR |
| **Review trigger** | Vocabulary conflict |
| **Related Gate** | GHV.FOUNDATION.1B |
| **Evidence** | [SCOPE-BASELINE.md](../scope/SCOPE-BASELINE.md) |

## DEC-035 — Minimum Lovable Governed World

| Field | Value |
|-------|-------|
| **Decision** | First controlled Saudi launch must deliver the 20 MLGW outcomes in Scope Baseline |
| **Status** | Accepted |
| **Rationale** | Launch is a vertical world, not a thin demo |
| **Alternatives** | Tech-demo launch |
| **Reversible** | Foundational rebaseline only |
| **Review trigger** | Outcome missing from plan |
| **Related Gate** | GHV.FOUNDATION.1B |
| **Evidence** | Scope Baseline §2 |

## DEC-036 — Limited launch catalogue principle

| Field | Value |
|-------|-------|
| **Decision** | Launch uses a coherent limited Route catalogue; exact names deferred to GHV.LEARNING.1; five Horizons represented |
| **Status** | Accepted |
| **Rationale** | Achievable vertical slice by 2029 |
| **Alternatives** | Full catalogue at launch |
| **Reversible** | Via Learning Gate |
| **Review trigger** | Content capacity |
| **Related Gate** | GHV.FOUNDATION.1B |
| **Evidence** | Scope §3.8 |

## DEC-037 — Controlled launch progression depth

| Field | Value |
|-------|-------|
| **Decision** | Launch includes XP, Momentum, Maturity, initial Mastery, Crests, limited Leaderboards; Breadth/Prestige/title **surface** is CONTROLLED LAUNCH; full depth is POST-LAUNCH PLANNED; formulas pending PROGRESSION.1 |
| **Status** | Accepted |
| **Rationale** | Avoid overcommitment while preserving separation architecture |
| **Alternatives** | Full Prestige economy at launch |
| **Reversible** | Via Progression Gate |
| **Review trigger** | User confusion metrics |
| **Related Gate** | GHV.FOUNDATION.1B |
| **Evidence** | Scope §3.12 |

## DEC-038 — Cross-Wing and Secure Extension launch minima

| Field | Value |
|-------|-------|
| **Decision** | Launch requires one validated Cross-Wing Route and one validated Secure Extension; catalogues pending LEARNING.1 + Atlas |
| **Status** | Accepted |
| **Rationale** | Prove models without catalogue sprawl |
| **Alternatives** | Defer all Cross-Wing |
| **Reversible** | Material Scope change |
| **Review trigger** | Atlas infeasibility |
| **Related Gate** | GHV.FOUNDATION.1B |
| **Evidence** | Scope §3.9–3.10 |

## DEC-039 — Community and Live Sky launch minima

| Field | Value |
|-------|-------|
| **Decision** | Safe Rookery without unrestricted DMs; Live Sky foundation plus one controlled experience; large tournaments/ranges out of initial launch |
| **Status** | Accepted |
| **Rationale** | Safety and capacity |
| **Alternatives** | Full social + tournament platform |
| **Reversible** | Material Scope change |
| **Review trigger** | Moderation overload |
| **Related Gate** | GHV.FOUNDATION.1B |
| **Evidence** | Scope §3.16–3.17 |

## DEC-040 — Founder-capacity / WIP constraint

| Field | Value |
|-------|-------|
| **Decision** | At most one primary + one supporting Capability + one Research Spike; schedule ≤60–70% capacity; Scope additions state what they replace |
| **Status** | Accepted |
| **Rationale** | Protect 2029 deadline and quality |
| **Alternatives** | Unbounded parallel work |
| **Reversible** | If capacity expands (record CR) |
| **Review trigger** | Overload symptoms |
| **Related Gate** | GHV.FOUNDATION.1B |
| **Evidence** | Scope §6 |

## DEC-041 — Scope Change Impact model

| Field | Value |
|-------|-------|
| **Decision** | Material and Foundational Scope changes require impact analysis across Pillars, journey, screens, learning, progression, commercial, data, security, privacy, ops, schedule, cost, capacity, deadline, testing, migration, rollback, external validation |
| **Status** | Accepted |
| **Rationale** | Prevent silent Scope growth |
| **Alternatives** | Informal tickets |
| **Reversible** | Foundational CR |
| **Related Gate** | GHV.FOUNDATION.1B |
| **Evidence** | [SCOPE-CHANGE-IMPACT-MODEL.md](../scope/SCOPE-CHANGE-IMPACT-MODEL.md) |

## DEC-042 — Constitution and Scope Baseline lock (1B)

| Field | Value |
|-------|-------|
| **Decision** | Product Constitution v1.0 and Scope Baseline v1.0 are LOCKED foundation documents after GHV.FOUNDATION.1B review |
| **Status** | Accepted |
| **Rationale** | Single authoritative Constitution and Scope |
| **Alternatives** | Keep 1A drafts as peers |
| **Reversible** | Foundational rebaseline process only |
| **Related Gate** | GHV.FOUNDATION.1B |
| **Evidence** | Constitution · Scope Baseline · Baseline Manifest |

## DEC-043 — Interaction grammar

| Field | Value |
|-------|-------|
| **Decision** | Primary/secondary/tertiary/destructive/back/modal/drawer/inline/toast/banner patterns in INTERACTION-GRAMMAR.md are authoritative for Product Code |
| **Status** | Accepted |
| **Related Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Evidence** | [INTERACTION-GRAMMAR.md](../../product/interactions/INTERACTION-GRAMMAR.md) |

## DEC-044 — Page composition system

| Field | Value |
|-------|-------|
| **Decision** | Experience shells (Public, Activation, Onboarding, Adaptive World, Mission Focus, Live Sky, Admin) are locked at low fidelity |
| **Status** | Accepted |
| **Related Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Evidence** | [PAGE-COMPOSITION-SYSTEM.md](../../product/interactions/PAGE-COMPOSITION-SYSTEM.md) |

## DEC-045 — Wireframe priority model

| Field | Value |
|-------|-------|
| **Decision** | Every registered screen has WF status: DETAILED / FAMILY / STATE-ONLY / POST-LAUNCH DEFERRED / CONDITIONAL; IDs GHV-WF-* map 1:1 to locked Screen IDs |
| **Status** | Accepted |
| **Related Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Evidence** | [WIREFRAME-REGISTRY.md](../../product/wireframes/WIREFRAME-REGISTRY.md) |

## DEC-046 — Low-fidelity notation

| Field | Value |
|-------|-------|
| **Decision** | Markdown + monospace ASCII diagrams; no Product Code, Storybook, or final visual assets in this Gate |
| **Status** | Accepted |
| **Related Gate** | GHV.PRODUCT-DEFINITION.3 |

## DEC-047 — Ethical plan presentation

| Field | Value |
|-------|-------|
| **Decision** | Plans contextual; Open Flight and Merit visible; no deceptive Expedition preselect; no fake urgency; free users not incomplete; no mid-Mission subscription interrupt |
| **Status** | Accepted |
| **Related Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Evidence** | Commercial wireframes · Interaction Grammar |

## DEC-048 — Explainable Locks and Skyboard variants

| Field | Value |
|-------|-------|
| **Decision** | Eight lock types distinct; Adaptive Skyboard has 16 documented variants; ≤3 priority cards above fold |
| **Status** | Accepted |
| **Related Gate** | GHV.PRODUCT-DEFINITION.3 |

## DEC-049 — Mobile-first + no DMs + Live separation

| Field | Value |
|-------|-------|
| **Decision** | Web/PWA responsive first; unrestricted DMs remain OUT OF SCOPE; participant/spectator information visibly separated |
| **Status** | Accepted |
| **Related Gate** | GHV.PRODUCT-DEFINITION.3 |

## DEC-050 — Usability validation before implementation waves

| Field | Value |
|-------|-------|
| **Decision** | Usability plan required; tests NOT RUN at PD.3; do not claim UI validated until evidence exists |
| **Status** | Accepted |
| **Related Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Evidence** | [USABILITY-VALIDATION-PLAN.md](../../product/research/USABILITY-VALIDATION-PLAN.md) |

## DEC-051 — PD.3 interaction and wireframe lock

| Field | Value |
|-------|-------|
| **Decision** | Interaction grammar, page composition, 90-screen wireframe statuses, 16 critical flows, and launch-critical low-fi wireframes locked at low fidelity |
| **Status** | Accepted — **SUPERSEDED IN COUNT ONLY** (90 → 92 via **DEC-152** / CR-001); low-fi lock and interaction architecture otherwise **RETAINED** |
| **Related Gate** | GHV.PRODUCT-DEFINITION.3 · amended GHV.BASELINE-CORRECTION.1 |
| **Evidence** | product/interactions · product/wireframes · [GHV.PRODUCT-DEFINITION.3-AMENDMENT-01.md](../gates/GHV.PRODUCT-DEFINITION.3-AMENDMENT-01.md) |

## DEC-052 — Learning research source hierarchy

| Field | Value |
|-------|-------|
| **Decision** | Six-tier source hierarchy (frameworks → tech docs → Saudi strategic → employment patterns → professional/academic → community supplementary) governs Route research |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1A |
| **Evidence** | [LEARNING-RESEARCH-METHODOLOGY.md](../../product/learning/research/LEARNING-RESEARCH-METHODOLOGY.md) |

## DEC-053 — Research freshness model

| Field | Value |
|-------|-------|
| **Decision** | Stable 18–24mo; slow practice 12mo; fast tech 3–6mo; regulatory on edition change — content-governance baselines, not legal commitments |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1A |

## DEC-054 — Route candidate + scorecard standards

| Field | Value |
|-------|-------|
| **Decision** | Candidate records and 100-point scorecard are mandatory before recommendation; scores inform but do not auto-select |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1A |
| **Evidence** | ROUTE-CANDIDATE-REGISTER · ROUTE-SELECTION-SCORECARD |

## DEC-055 — Portfolio-size and Evidence-first selection

| Field | Value |
|-------|-------|
| **Decision** | Launch target 4–6 Routes + 1 CW + 1 SE (+ Nest); Evidence feasibility required; vendor certs are reference only |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1A |

## DEC-056 — Vendor-neutral foundation + Arabic-first feasibility

| Field | Value |
|-------|-------|
| **Decision** | Foundations remain vendor-neutral; Arabic-first feasibility required per shortlisted Route; English technical terms allowed contextually |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1A |

## DEC-057 — Cross-Wing and Secure Extension research thresholds

| Field | Value |
|-------|-------|
| **Decision** | ≥5 CW and ≥5 SE candidates researched before recommending one each; SE extends a real capability and is not a full PROTECT Route |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1A |

## DEC-058 — No final Route lock in LEARNING.1A

| Field | Value |
|-------|-------|
| **Decision** | 1A may recommend only (RECOMMENDED — NOT YET LOCKED). Final Route lock deferred to GHV.LEARNING.1D |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1A |
| **Evidence** | [LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md](../../product/learning/routes/LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md) |

## DEC-059 — Canonical learning-ID standard

| Field | Value |
|-------|-------|
| **Decision** | Stable semantic IDs (WRLD/NST-CAP/HRZ/RT/CXW/SEX/STG/EVD/CAP/ULK/BRG/RMD) are independent of working titles |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1B |
| **Evidence** | [LEARNING-IDENTIFIER-STANDARD.md](../../product/learning/architecture/LEARNING-IDENTIFIER-STANDARD.md) |

## DEC-060 — Node-type registry and edge-type rules

| Field | Value |
|-------|-------|
| **Decision** | Only registered node types and approved learning edge types may appear in the Learning Graph; entitlement/plan data must not live on Learning Graph nodes or edges |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1B |
| **Evidence** | NODE-TYPE-REGISTRY · EDGE-TYPE-RULES |

## DEC-061 — Graph invariants and layer separation

| Field | Value |
|-------|-------|
| **Decision** | 25 conceptual invariants apply; Learning / Progress / Entitlement graphs remain separate and non-substituting |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1B |
| **Evidence** | GRAPH-INVARIANTS · GRAPH-LAYER-SEPARATION |

## DEC-062 — Route and Stage architecture standards

| Field | Value |
|-------|-------|
| **Decision** | Every Route/Stage follows architecture standards; foundation Routes normally 4–6 Stages; Mission IDs in 1B are placeholders only |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1B |
| **Evidence** | ROUTE-ARCHITECTURE-STANDARD · STAGE-ARCHITECTURE-STANDARD |

## DEC-063 — Shared-capability reuse

| Field | Value |
|-------|-------|
| **Decision** | Shared capabilities have one authoritative teaching location; Routes reinforce contextually and must not independently rewrite the same unit |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1B |
| **Evidence** | [SHARED-CAPABILITY-REGISTRY.md](../../product/learning/architecture/SHARED-CAPABILITY-REGISTRY.md) |

## DEC-064 — Route-Proven qualitative standard

| Field | Value |
|-------|-------|
| **Decision** | Route-Proven eligibility is qualitative (Stages + assessments + Evidence + capstone + integrity + remediation + Trust); numeric Mastery thresholds deferred to GHV.PROGRESSION.1; completion ≠ Proven; Proven ≠ subscription benefit |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1B |
| **Evidence** | [ROUTE-PROVEN-STANDARD.md](../../product/learning/proven/ROUTE-PROVEN-STANDARD.md) |

## DEC-065 — Horizon-Proven awarding deferred

| Field | Value |
|-------|-------|
| **Decision** | Horizon-Proven foundation model is defined; awarding deferred; one foundation Route is insufficient; progress toward Horizon-Proven may display without awarding |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1B |
| **Evidence** | [HORIZON-PROVEN-STANDARD.md](../../product/learning/proven/HORIZON-PROVEN-STANDARD.md) |

## DEC-066 — Cross-Wing versus Secure Extension boundary

| Field | Value |
|-------|-------|
| **Decision** | Cross-Wing combines ≥2 domains into a new integrated outcome; Secure Extension hardens a source Route and is not a full PROTECT Route; mandatory Stages/Evidence must not be functionally identical |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1B |
| **Evidence** | [CROSS-WING-VS-SECURE-EXTENSION.md](../../product/learning/architecture/CROSS-WING-VS-SECURE-EXTENSION.md) |

## DEC-067 — ANALYZE remains launch reserve

| Field | Value |
|-------|-------|
| **Decision** | RT-ANL-001 is ARCHITECTURE RECOMMENDED — LAUNCH RESERVE (capacity conditional); not a controlled-launch commitment without Change Control |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1B |
| **Evidence** | [RT-ANL-001-PRACTICAL-DATA-ANALYSIS.md](../../product/learning/routes/architecture/RT-ANL-001-PRACTICAL-DATA-ANALYSIS.md) |

## DEC-068 — CXW-001 requires Application-Security Bridge

| Field | Value |
|-------|-------|
| **Decision** | CXW-001 challenge outcome is VALID WITH REQUIRED BRIDGE (BRG-PRT-BLD-01); status ARCHITECTURE RECOMMENDED — WITH REQUIRED BRIDGE; not silently replaced |
| **Status** | Conditionally Accepted |
| **Related Gate** | GHV.LEARNING.1B |
| **Evidence** | [CXW-001-SECURE-APPLICATION-DELIVERY-ARCHITECTURE.md](../../product/learning/cross-wing/CXW-001-SECURE-APPLICATION-DELIVERY-ARCHITECTURE.md) |

## DEC-069 — SEX-001 Secure Cloud Operations Extension

| Field | Value |
|-------|-------|
| **Decision** | SEX-001 extends RT-OPR-001 as ARCHITECTURE RECOMMENDED; distinct from CXW-001 and from full RT-PRT-001 |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1B |
| **Evidence** | [SEX-001-SECURE-CLOUD-OPERATIONS-ARCHITECTURE.md](../../product/learning/secure-extensions/SEX-001-SECURE-CLOUD-OPERATIONS-ARCHITECTURE.md) |

## DEC-070 — No final Route lock in LEARNING.1B

| Field | Value |
|-------|-------|
| **Decision** | 1B produces architecture recommendations only. Final Route lock remains deferred to GHV.LEARNING.1D. Expert review remains NOT RUN. No numeric progression formulas. |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1B |
| **Evidence** | [LAUNCH-GRAPH-REGISTRY.md](../../product/learning/graph/LAUNCH-GRAPH-REGISTRY.md) |

## DEC-071 — Mission Blueprint Standard

| Field | Value |
|-------|-------|
| **Decision** | Every Mission uses MISSION-BLUEPRINT-STANDARD fields; statuses ARCHITECTURE/CONDITIONAL/RESERVE/DEFERRED only — never PUBLISHED/LOCKED CONTENT/IMPLEMENTED in 1C |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1C |
| **Evidence** | [MISSION-BLUEPRINT-STANDARD.md](../../product/learning/missions/MISSION-BLUEPRINT-STANDARD.md) |

## DEC-072 — Mission portfolio-size limit

| Field | Value |
|-------|-------|
| **Decision** | P0 Routes target 12–16 Mission Blueprints (min 10, max 18); CXW 8–12; SEX 6–10; ANL reserve 6–10; do not inflate counts |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1C |
| **Evidence** | [MISSION-BLUEPRINT-REGISTRY.md](../../product/learning/missions/MISSION-BLUEPRINT-REGISTRY.md) — exact total **87** |

## DEC-073 — Qualitative learning-intensity model

| Field | Value |
|-------|-------|
| **Decision** | Intensity uses LIGHT/STANDARD/DEEP/EXTENDED only; no mandatory time-to-completion in 1C |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1C |
| **Evidence** | [LEARNING-INTENSITY-MODEL.md](../../product/learning/missions/LEARNING-INTENSITY-MODEL.md) |

## DEC-074 — Assessment-anchor standard

| Field | Value |
|-------|-------|
| **Decision** | Assessment anchors use governed forms and result states; no numeric pass values; no employment-style language |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1C |
| **Evidence** | ASSESSMENT-ANCHOR-STANDARD · ASSESSMENT-ANCHOR-REGISTRY (**33** anchors) |

## DEC-075 — Evidence Blueprint and rubric dimensions

| Field | Value |
|-------|-------|
| **Decision** | Evidence Blueprints follow EVIDENCE-BLUEPRINT-STANDARD; rubrics use up to 10 qualitative dimensions and NOT_DEMONSTRATED…EXCEPTIONAL levels; EXCEPTIONAL not required for Route-Proven; aggregation pending PROGRESSION.1 |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1C |
| **Evidence** | EVIDENCE-RUBRIC-STANDARD · EVIDENCE-RUBRIC-REGISTRY |

## DEC-076 — AI-assistance disclosure policy

| Field | Value |
|-------|-------|
| **Decision** | Missions/Evidence declare AI category (NOT_PERMITTED … REQUIRED_TO_BE_DEMONSTRATED); AI must not silently replace learner reasoning, practical execution, or reviewer authority |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1C |
| **Evidence** | [AI-ASSISTANCE-POLICY.md](../../product/learning/integrity/AI-ASSISTANCE-POLICY.md) |

## DEC-077 — Evidence privacy classification

| Field | Value |
|-------|-------|
| **Decision** | Evidence privacy classes: PUBLIC_PORTFOLIO · GHURAVIA_PRIVATE · REVIEWER_RESTRICTED · SENSITIVE_RESTRICTED · PROHIBITED; secrets/PII/production credentials prohibited |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1C |
| **Evidence** | [SAFE-EVIDENCE-HANDLING.md](../../product/learning/evidence/SAFE-EVIDENCE-HANDLING.md) |

## DEC-078 — Team contribution separation

| Field | Value |
|-------|-------|
| **Decision** | Team success alone does not grant full individual capability credit; contribution signals required |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1C |
| **Evidence** | [TEAM-CONTRIBUTION-EVIDENCE.md](../../product/learning/evidence/TEAM-CONTRIBUTION-EVIDENCE.md) |

## DEC-079 — AppSec Bridge blueprint

| Field | Value |
|-------|-------|
| **Decision** | BRG-PRT-BLD-01 AppSec Bridge is blueprint-defined (4 Missions) as the required CXW capability gap closer |
| **Status** | Conditionally Accepted |
| **Related Gate** | GHV.LEARNING.1C |
| **Evidence** | [BRG-PRT-BLD-01-APPSEC-BRIDGE.md](../../product/learning/missions/bridges/BRG-PRT-BLD-01-APPSEC-BRIDGE.md) |

## DEC-080 — Cross-Wing and Secure Extension capstone integrity

| Field | Value |
|-------|-------|
| **Decision** | CXW-001 Capstone requires integrated multi-domain bundle + Integration Mission; SEX-001 Capstone extends OPR ops artifact and must not duplicate CXW application-release scenario |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1C |
| **Evidence** | CXW-001 / SEX-001 Capstone blueprints |

## DEC-081 — Pilot required before publication

| Field | Value |
|-------|-------|
| **Decision** | Representative Missions must be piloted before Route publication; document review alone is not a learner pilot; pilot status remains NOT RUN in 1C |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1C |
| **Evidence** | [LEARNING-PILOT-REQUIREMENTS.md](../../product/learning/content/LEARNING-PILOT-REQUIREMENTS.md) |

## DEC-082 — No final Route lock in LEARNING.1C

| Field | Value |
|-------|-------|
| **Decision** | 1C produces Mission/Evidence/Capstone blueprints only. Final Route lock deferred to GHV.LEARNING.1D. Expert review NOT RUN. Pilot NOT RUN. No XP/Mastery formulas. |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1C |
| **Evidence** | [MISSION-BLUEPRINT-REGISTRY.md](../../product/learning/missions/MISSION-BLUEPRINT-REGISTRY.md) |

## DEC-083 — Meaning of Learning Design Baseline Lock

| Field | Value |
|-------|-------|
| **Decision** | In LEARNING.1D, LOCKED means LOCKED AS GOVERNED DESIGN BASELINE only — not Expert Approved, Pilot Validated, Publication Ready, Implemented, Production Ready, Accredited, or Certified |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1D |
| **Evidence** | [LEARNING-DESIGN-STATUS-MODEL.md](../../product/learning/governance/LEARNING-DESIGN-STATUS-MODEL.md) |

## DEC-084 — Design lock separated from publication readiness

| Field | Value |
|-------|-------|
| **Decision** | Design status and readiness fields (Expert Review, Pilot, Technical Validation, Publication, Implementation) are separate; design lock does not authorize publication or implementation |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1D |
| **Evidence** | [PUBLICATION-READINESS-MATRIX.md](../../product/learning/governance/PUBLICATION-READINESS-MATRIX.md) |

## DEC-085 — Final P0 Route design baseline

| Field | Value |
|-------|-------|
| **Decision** | RT-OPR-001, RT-BLD-001, RT-PRT-001, RT-LED-001 are LOCKED AS DESIGN BASELINE; Expert Review NOT RUN; Pilot NOT RUN; Publication BLOCKED; Implementation BLOCKED |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1D |
| **Evidence** | [LEARNING-PORTFOLIO-MANIFEST.md](../../product/learning/governance/LEARNING-PORTFOLIO-MANIFEST.md) · [ROUTE-FINAL-REVIEW.md](../../product/learning/governance/ROUTE-FINAL-REVIEW.md) |

## DEC-086 — RT-ANL-001 reserve design baseline

| Field | Value |
|-------|-------|
| **Decision** | RT-ANL-001 is LOCKED AS RESERVE DESIGN BASELINE; NOT A CONTROLLED-LAUNCH COMMITMENT; CAPACITY CONDITIONAL; promotion requires Change Control |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1D |
| **Evidence** | LEARNING-PORTFOLIO-MANIFEST · LEARNING-DESIGN-FREEZE-POLICY |

## DEC-087 — Mandatory AppSec Bridge for CXW-001

| Field | Value |
|-------|-------|
| **Decision** | BRG-PRT-BLD-01 is LOCKED AS DESIGN BASELINE and mandatory for CXW-001 eligibility; Expert Review NOT RUN; Publication BLOCKED |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1D |
| **Evidence** | Bridge blueprint · CXW Mission pack · DEC-068/079 |

## DEC-088 — Final CXW and SEX boundary

| Field | Value |
|-------|-------|
| **Decision** | CXW-001 = integrated secure application delivery (VALID WITH REQUIRED BRIDGE); SEX-001 = secure hardening of cloud operations from RT-OPR-001; duplicated mandatory Stages/Evidence/capstones = 0 |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1D |
| **Evidence** | [CROSS-WING-SECURE-EXTENSION-FINAL-BOUNDARY.md](../../product/learning/governance/CROSS-WING-SECURE-EXTENSION-FINAL-BOUNDARY.md) |

## DEC-089 — Exact learning registry reconciliation

| Field | Value |
|-------|-------|
| **Decision** | Authoritative exact totals for Learning Design Baseline v1.0.0 are those reconciled in LEARNING-REGISTRY-RECONCILIATION (166/129/87/33/24/7/7/18/8/12/13/9/1); layer differences (graph placeholders vs 1C blueprints) are documented, not errors |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1D |
| **Evidence** | [LEARNING-REGISTRY-RECONCILIATION.md](../../product/learning/governance/LEARNING-REGISTRY-RECONCILIATION.md) |

## DEC-090 — Publication-readiness matrix and review packets

| Field | Value |
|-------|-------|
| **Decision** | Publication requires completion of Publication Readiness Matrix gates; Expert Review Packets and Pilot Packets are required artifacts; Expert Review and Pilot remain NOT RUN after 1D |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1D |
| **Evidence** | PUBLICATION-READINESS-MATRIX · EXPERT-REVIEW-MASTER-PLAN · LEARNING-PILOT-MASTER-PLAN |

## DEC-091 — Learning Design Freeze Policy

| Field | Value |
|-------|-------|
| **Decision** | After 1D, P0 IDs, Stage/Mission/Evidence/Capstone IDs, CXW/SEX boundaries, Route-Proven qualitative rules, and ANL reserve status are frozen; editorial changes allowed; Controlled CR for structural changes; Foundational Rebaseline for Pillars/Horizons/Evidence-before-Mastery/payment-as-learning |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1D |
| **Evidence** | [LEARNING-DESIGN-FREEZE-POLICY.md](../../product/learning/governance/LEARNING-DESIGN-FREEZE-POLICY.md) |

## DEC-092 — Content-production sequencing

| Field | Value |
|-------|-------|
| **Decision** | Recommended controlled drafting order: Nest → OPR → BLD → PRT → LED → Bridge → CXW → SEX → LIV; do not produce all four P0 Routes simultaneously; ANL not in launch production queue without CR |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1D |
| **Evidence** | [LEARNING-PORTFOLIO-CAPACITY-REVIEW.md](../../product/learning/governance/LEARNING-PORTFOLIO-CAPACITY-REVIEW.md) |

## DEC-093 — Learning handoff to Progression and Architecture

| Field | Value |
|-------|-------|
| **Decision** | LEARNING-HANDOFF-PACKAGE defines inputs to GHV.PROGRESSION.1 (qualitative only) and GHV.ARCHITECTURE.1 (conceptual graph only — no schema); content and UX validation receive blueprints and packets |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1D |
| **Evidence** | [LEARNING-HANDOFF-PACKAGE.md](../../product/learning/governance/LEARNING-HANDOFF-PACKAGE.md) |

## DEC-094 — GHURAVIA Learning Design Baseline v1.0.0

| Field | Value |
|-------|-------|
| **Decision** | GHURAVIA Learning Design Baseline v1.0.0 is ACTIVE — LOCKED AS DESIGN BASELINE via LEARNING-PORTFOLIO-MANIFEST; closes GHV.LEARNING.1 program; does not authorize publication or Product Code |
| **Status** | Accepted |
| **Related Gate** | GHV.LEARNING.1D |
| **Evidence** | [LEARNING-PORTFOLIO-MANIFEST.md](../../product/learning/governance/LEARNING-PORTFOLIO-MANIFEST.md) · [BASELINE-MANIFEST.md](../releases/BASELINE-MANIFEST.md) |

## DEC-095 — Progression-system separation

| Field | Value |
|-------|-------|
| **Decision** | Eleven constructs are separate: Access Plan (commercial, outside progression), Flight XP, Momentum, Maturity, Mastery, Breadth, Trust, Titles, Prestige, Achievements/Crests, Leaderboards. No system may silently substitute for another. |
| **Status** | Accepted |
| **Related Gate** | GHV.PROGRESSION.1A |
| **Evidence** | [PROGRESSION-SYSTEM-SEPARATION.md](../../product/progression/architecture/PROGRESSION-SYSTEM-SEPARATION.md) · [PROGRESSION-INVARIANTS.md](../../product/progression/architecture/PROGRESSION-INVARIANTS.md) |

## DEC-096 — Canonical progression identifiers and source authority

| Field | Value |
|-------|-------|
| **Decision** | Progression uses PGS-* system IDs, MAT-*/MOM-*/PRS-* rank/league/class IDs, and governed event source classes. Commercial events never produce progression value. |
| **Status** | Accepted |
| **Related Gate** | GHV.PROGRESSION.1A |
| **Evidence** | PROGRESSION-IDENTIFIER-STANDARD · PROGRESSION-SOURCE-AUTHORITY |

## DEC-097 — Progression events, validity, and ledgers

| Field | Value |
|-------|-------|
| **Decision** | Exact progression event registry (53 events), seven validity states, and eleven conceptual ledgers are authoritative for architecture. Only VALID events influence current standing. |
| **Status** | Accepted |
| **Related Gate** | GHV.PROGRESSION.1A |
| **Evidence** | PROGRESSION-EVENT-REGISTRY · PROGRESSION-EVENT-VALIDITY · PROGRESSION-LEDGER-MODEL |

## DEC-098 — Meanings of XP, Momentum, Maturity, Mastery, Breadth, Trust

| Field | Value |
|-------|-------|
| **Decision** | XP = recognized activity (not Skill). Momentum = seasonal consistency. Maturity = long-term development (not XP-only). Mastery = Evidence-backed capability. Breadth = demonstrated multi-area capability (not enrollment). Trust = integrity/reliability (not popularity or Skill). |
| **Status** | Accepted |
| **Related Gate** | GHV.PROGRESSION.1A |
| **Evidence** | System architecture docs under product/progression/ |

## DEC-099 — Titles, Prestige, Achievements, Leaderboards

| Field | Value |
|-------|-------|
| **Decision** | Titles are governed capability bundles (not employment). Prestige is rare, human-reviewed, non-purchasable; AI cannot final-decide Prestige. Achievements distinguish participation from Skill. No universal leaderboard. |
| **Status** | Accepted |
| **Related Gate** | GHV.PROGRESSION.1A |
| **Evidence** | PROFESSIONAL-TITLE / PRESTIGE / ACHIEVEMENT-CREST / LEADERBOARD architectures |

## DEC-100 — Corrections, fairness, anti-gaming, automation boundary

| Field | Value |
|-------|-------|
| **Decision** | Corrections use audited new records; appeals tracked; anti-gaming is conceptual; fairness/a11y/age-privacy required; automation cannot grant Prestige or irreversible Trust; formulas deferred to 1B. |
| **Status** | Accepted |
| **Related Gate** | GHV.PROGRESSION.1A |
| **Evidence** | PROGRESSION-CORRECTION-AND-APPEAL · ANTI-GAMING · FAIRNESS · AUTOMATION-HUMAN-AUTHORITY-BOUNDARY |

## DEC-101 — Progression Architecture Baseline (1A)

| Field | Value |
|-------|-------|
| **Decision** | GHURAVIA Progression Architecture Baseline v1.0.0 is ARCHITECTURE RECOMMENDED. Formulas NOT DEFINED. Simulation NOT RUN. Calibration NOT RUN. Final lock PENDING 1D. Learning Design Baseline unchanged. |
| **Status** | Accepted |
| **Related Gate** | GHV.PROGRESSION.1A |
| **Evidence** | [product/progression/README.md](../../product/progression/README.md) · BASELINE-MANIFEST |

## DEC-102 — Progression Formula Governance Standard

| Field | Value |
|-------|-------|
| **Decision** | Every progression formula/policy/template must follow PROGRESSION-FORMULA-STANDARD (ID, version, inputs, prohibited inputs, equation, rounding, caps/floors/gates, reversal, explainability) and status wording `SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION`. |
| **Status** | Accepted |
| **Rationale** | Prevents silent retunes and false “FINAL/CALIBRATED/PRODUCTION READY” claims. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [PROGRESSION-FORMULA-STANDARD.md](../../product/progression/formulas/PROGRESSION-FORMULA-STANDARD.md) · [PROGRESSION-FORMULA-REGISTRY.md](../../product/progression/formulas/PROGRESSION-FORMULA-REGISTRY.md) |

## DEC-103 — Flight XP candidate recognition

| Field | Value |
|-------|-------|
| **Decision** | Adopt FRM-XP-001 v0.1.0 candidate recognition (intensity bases LIGHT 10 / STANDARD 20 / DEEP 35 / EXTENDED 50; Stage 40; Formative 30; Practical 60; Capstone 150; Route-Proven 250; Team/Live 20–60) with Validation×Repeat factors; no paid-plan multipliers; reversals negate exact original XP. |
| **Status** | Accepted |
| **Rationale** | Simulation-ready activity recognition separate from Skill/Mastery. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [FLIGHT-XP-FORMULA.md](../../product/progression/formulas/FLIGHT-XP-FORMULA.md) |

## DEC-104 — Triangular Flight Level curve

| Field | Value |
|-------|-------|
| **Decision** | Adopt FRM-LVL-001 v0.1.0 triangular Level curve: XP required for Level L = 100 × (L−1) × L ÷ 2; Level is cosmetic milestone only and does not unlock Mastery, Titles, or Prestige. |
| **Status** | Accepted |
| **Rationale** | Simple deterministic Level mapping for simulation. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [FLIGHT-LEVEL-FORMULA.md](../../product/progression/formulas/FLIGHT-LEVEL-FORMULA.md) |

## DEC-105 — Eight-week Momentum season

| Field | Value |
|-------|-------|
| **Decision** | Candidate Momentum season duration is 8 weeks (FRM-MOM-002). |
| **Status** | Accepted |
| **Rationale** | Usable season length for compressed-schedule fairness tests. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [MOMENTUM-FORMULA.md](../../product/progression/formulas/MOMENTUM-FORMULA.md) |

## DEC-106 — Best-six-week Momentum calculation

| Field | Value |
|-------|-------|
| **Decision** | Season Momentum Score = average of the learner’s best 6 weekly scores; at least four active weeks for final placement; two grace weeks allowed; no daily streak; no paid/XP multipliers. |
| **Status** | Accepted |
| **Rationale** | Softens single-week collapse while capping grinding. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [MOMENTUM-FORMULA.md](../../product/progression/formulas/MOMENTUM-FORMULA.md) |

## DEC-107 — Momentum league thresholds

| Field | Value |
|-------|-------|
| **Decision** | Candidate league bands (season score): Iron 0–29; Bronze 30–44; Silver 45–59; Gold 60–74; Platinum 75–87; Diamond 88–100. |
| **Status** | Accepted |
| **Rationale** | Simulation distribution held Diamond at 0% under seed 20260721; bands remain sensitive (±10%). PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [MOMENTUM-FORMULA.md](../../product/progression/formulas/MOMENTUM-FORMULA.md) · FORMULA-SENSITIVITY-REPORT |

## DEC-108 — Maturity Index and Rank gates

| Field | Value |
|-------|-------|
| **Decision** | Adopt FRM-MAT-001 v0.1.0 nine-dimension Maturity Index (weights sum 100) with Rank gates Hatchling→Raven; Rank ≠ employment seniority and ≠ Prestige; no ordinary inactivity demotion. |
| **Status** | Accepted |
| **Rationale** | Separates habit/independence standing from XP and Prestige. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [MATURITY-FORMULA.md](../../product/progression/formulas/MATURITY-FORMULA.md) |

## DEC-109 — Evidence-to-Mastery scoring

| Field | Value |
|-------|-------|
| **Decision** | Adopt FRM-MST-001/002 v0.1.0: rubric levels 0–4 → Evidence Item Index; Capability Mastery Index as weighted mean of valid Evidence; mandatory/critical floors cannot be averaged away. |
| **Status** | Accepted |
| **Rationale** | Preserves Evidence-before-Mastery. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [MASTERY-FORMULA.md](../../product/progression/formulas/MASTERY-FORMULA.md) |

## DEC-110 — Route Mastery hard floors

| Field | Value |
|-------|-------|
| **Decision** | Route-Proven numeric eligibility (FRM-MST-003) requires every mandatory CMI ≥ 50, mandatory Evidence ≥ MEETS_STANDARD, assessments STANDARD_MET, Capstone Index ≥ 50, no unresolved mandatory remediation/integrity issues, required reviewer approval; RMI alone does not grant Route-Proven. |
| **Status** | Accepted |
| **Rationale** | Aligns numeric floors with locked Learning Design qualitative Route-Proven. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [MASTERY-FORMULA.md](../../product/progression/formulas/MASTERY-FORMULA.md) · LEARNING-PORTFOLIO-MANIFEST |

## DEC-111 — Breadth Index

| Field | Value |
|-------|-------|
| **Decision** | Adopt FRM-BRD-001 v0.1.0 Breadth Index = Distinct Capability Coverage + Horizon Diversity + Integrated Breadth; descriptors do not award Horizon-Proven; RT-ANL-001 contributes 0 launch Breadth. |
| **Status** | Accepted |
| **Rationale** | Measures coverage without inventing Horizon awards. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [BREADTH-FORMULA.md](../../product/progression/formulas/BREADTH-FORMULA.md) |

## DEC-112 — Non-public Trust transition policy

| Field | Value |
|-------|-------|
| **Decision** | Adopt POL-TRU-001 v0.1.0 rule-based Trust Standing transitions; Trust remains non-public and non-numeric; no payment-improved Trust; positive signals cannot erase confirmed serious incidents. |
| **Status** | Accepted |
| **Rationale** | Prevents popularity/Trust conflation and public score gaming. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [TRUST-TRANSITION-POLICY.md](../../product/progression/formulas/TRUST-TRANSITION-POLICY.md) |

## DEC-113 — Professional Title eligibility templates

| Field | Value |
|-------|-------|
| **Decision** | Adopt TPL-TTL-001/002 v0.1.0 Standard and Integrated Title eligibility templates only; final Title catalogue remains deferred; Titles are not employment claims. |
| **Status** | Accepted |
| **Rationale** | Enables simulation of eligibility without locking a catalogue. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [PROFESSIONAL-TITLE-ELIGIBILITY.md](../../product/progression/formulas/PROFESSIONAL-TITLE-ELIGIBILITY.md) |

## DEC-114 — Prestige Eligibility Index

| Field | Value |
|-------|-------|
| **Decision** | Adopt FRM-PRS-001 v0.1.0 internal Prestige Eligibility Index (PEI); PEI is not a public Prestige score and cannot auto-grant Prestige. |
| **Status** | Accepted |
| **Rationale** | Nomination aid only; human review required. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [PRESTIGE-FORMULA.md](../../product/progression/formulas/PRESTIGE-FORMULA.md) |

## DEC-115 — Prestige human-review quorums

| Field | Value |
|-------|-------|
| **Decision** | Adopt POL-PRS-001 v0.1.0 hard gates and quorums (Ascendant PEI≥72 / 3-person≥2 approvals; Apex PEI≥84 / 4-person≥3; Obsidian PEI≥94 / 5-person≥4); founder cannot self-approve; automation cannot grant Prestige. |
| **Status** | Accepted |
| **Rationale** | Keeps Prestige rare and human-governed. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [PRESTIGE-FORMULA.md](../../product/progression/formulas/PRESTIGE-FORMULA.md) |

## DEC-116 — Achievement candidate rules

| Field | Value |
|-------|-------|
| **Decision** | Adopt POL-ACH-001 v0.1.0 with exactly 12 provisional Achievement rules distinguishing participation from Skill; artwork out of Scope. |
| **Status** | Accepted |
| **Rationale** | Bounded provisional catalogue for simulation. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [ACHIEVEMENT-RULE-CATALOGUE.md](../../product/progression/formulas/ACHIEVEMENT-RULE-CATALOGUE.md) |

## DEC-117 — Leaderboard population thresholds

| Field | Value |
|-------|-------|
| **Decision** | Adopt POL-POP-001 v0.1.0: &lt;20 eligible → no public ranked board; 20–49 → Route/cohort only; 50–99 → broader with context; ≥100 → global/regional may be considered; no universal leaderboard. |
| **Status** | Accepted |
| **Rationale** | Protects small populations from false prestige. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [LEADERBOARD-POPULATION-POLICY.md](../../product/progression/formulas/LEADERBOARD-POPULATION-POLICY.md) · [LEADERBOARD-FORMULAS.md](../../product/progression/formulas/LEADERBOARD-FORMULAS.md) |

## DEC-118 — Synthetic simulation method

| Field | Value |
|-------|-------|
| **Decision** | Progression formula testing uses isolated stdlib-Python analytical tooling under `analysis/progression-simulation/` (seed 20260721; 15 personas; 500 synthetic users); NOT Product Code; NOT real-user evidence; NOT a forecast. |
| **Status** | Accepted |
| **Rationale** | Enables reproducible Gate 1B simulation without runtime implementation. PENDING 1C CALIBRATION. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [analysis/progression-simulation/README.md](../../analysis/progression-simulation/README.md) · [SIMULATION-RUN-REGISTRY.md](../../product/progression/simulation/SIMULATION-RUN-REGISTRY.md) |

## DEC-119 — Pay-to-win equivalence requirement

| Field | Value |
|-------|-------|
| **Decision** | Identical event histories across Access Plans must produce zero progression differences (XP, Momentum, Maturity, Mastery, Breadth, Trust, Titles, Prestige). Gate 1B RUN-006 recorded all diffs = 0. |
| **Status** | Accepted |
| **Rationale** | Constitutional anti-pay-to-win integrity for formulas. PENDING 1C CALIBRATION (real-pilot recheck). |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [PAY-TO-WIN-EQUIVALENCE-TEST.md](../../product/progression/simulation/PAY-TO-WIN-EQUIVALENCE-TEST.md) |

## DEC-120 — Formulas provisional until 1C

| Field | Value |
|-------|-------|
| **Decision** | All 24 formula/policy/template IDs remain at v0.1.0 SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION. Simulation PASS does not calibrate, finalize, or authorize Product Code. Final Progression Baseline lock remains PENDING 1D. |
| **Status** | **Superseded** by DEC-135 (1C complete) |
| **Rationale** | PENDING 1C CALIBRATION — prevents false confidence from synthetic runs. |
| **Related Gate** | GHV.PROGRESSION.1B |
| **Evidence** | [PROGRESSION-FORMULA-REGISTRY.md](../../product/progression/formulas/PROGRESSION-FORMULA-REGISTRY.md) · [FORMULA-REVISION-LOG.md](../../product/progression/formulas/FORMULA-REVISION-LOG.md) · BASELINE-MANIFEST |

## DEC-121 — Calibration principles locked for 1C judgment

| Field | Value |
|-------|-------|
| **Decision** | The fifteen Gate §8 calibration principles in PROGRESSION-CALIBRATION-PRINCIPLES.md are LOCKED for GHV.PROGRESSION.1C judgment (no quota retunes; cohort-conditioned rates; clarification before cosmetic threshold hikes). |
| **Status** | Accepted |
| **Rationale** | Prevents overfitting formulas to synthetic histograms. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | [PROGRESSION-CALIBRATION-PRINCIPLES.md](../../product/progression/calibration/PROGRESSION-CALIBRATION-PRINCIPLES.md) |

## DEC-122 — Mandatory calibration findings dispositions (CAL-FND-001…007)

| Field | Value |
|-------|-------|
| **Decision** | CAL-FND-001…007 dispositions are accepted as recorded (clarifications / conditions / no cosmetic retunes). Measured multi-seed evidence: Fledgling **3472**; Cohort B RP **22.88%**; Cohort B Ascendant **0%**; Diamond/Raven **0**. |
| **Status** | Accepted |
| **Rationale** | Findings bind 1C judgment without authorizing production calibration. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | [MANDATORY-CALIBRATION-FINDINGS.md](../../product/progression/calibration/MANDATORY-CALIBRATION-FINDINGS.md) |

## DEC-123 — Formula-versus-generator defect classification

| Field | Value |
|-------|-------|
| **Decision** | Fledgling unreachability (CAL-FND-001) is classified as generator/context-definition defect + formula clarification (FRM-MAT-001 → 0.2.0), not a Rank-quota failure requiring forced population. |
| **Status** | Accepted |
| **Rationale** | Wrong fix would be cosmetic Rank forcing. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | MATURITY-FORMULA.md · CAL-FND-001 |

## DEC-124 — Multi-seed simulation requirement

| Field | Value |
|-------|-------|
| **Decision** | Calibration population evidence uses five seeds **20260721–20260725** at **5,000**/seed (**25,000** records). Seed instability must be reported before citing rates. |
| **Status** | Accepted |
| **Rationale** | Single-seed histograms are insufficient for 1C. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | [MULTI-SEED-POPULATION-REPORT.md](../../product/progression/simulation/MULTI-SEED-POPULATION-REPORT.md) · RUN-007 |

## DEC-125 — Launch-realistic population (Cohort B)

| Field | Value |
|-------|-------|
| **Decision** | Launch narrative KPIs must cite **Cohort B** (n=7500): RP **22.88%**, Ascendant **0%**, Apex/Obsidian **0**, Fledgling **1309**. Cohort A stress rates (RP 45.11%, Ascendant 8.31%) are architecture probes only. |
| **Status** | Accepted |
| **Rationale** | Prevents false launch confidence from stress density. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | [LAUNCH-REALISTIC-COHORT-REPORT.md](../../product/progression/simulation/LAUNCH-REALISTIC-COHORT-REPORT.md) |

## DEC-126 — Counterfactual fairness testing required

| Field | Value |
|-------|-------|
| **Decision** | Fairness claims require matched counterfactual arms. RUN-008 recorded **10/10 PASS**. Unmatched persona comparisons (e.g. raw PER-009 vs PER-010) are invalid. |
| **Status** | Accepted |
| **Rationale** | CAL-FND-007 method lock. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | [COUNTERFACTUAL-FAIRNESS-TESTS.md](../../product/progression/calibration/COUNTERFACTUAL-FAIRNESS-TESTS.md) |

## DEC-127 — Schedule-fairness boundary

| Field | Value |
|-------|-------|
| **Decision** | Schedule shape must not change Skill/Mastery when Evidence/Mission content is matched. Compressed vs distributed: Skill equal; Momentum delta **4.33 ≤ 10** — **PASS** (RUN-009). |
| **Status** | Accepted |
| **Rationale** | Accessibility/schedule fairness without Mastery dilution. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | [ACCESSIBILITY-SCHEDULE-REPORT.md](../../product/progression/simulation/ACCESSIBILITY-SCHEDULE-REPORT.md) |

## DEC-128 — Maturity Rank reachability

| Field | Value |
|-------|-------|
| **Decision** | FRM-MAT-001 **0.2.0** (Mission/Stage contexts + governed Rank skip) makes Fledgling reachable; PER-001 and PER-014 reach Fledgling. Raven remains **0** in synthetic first-year mixes. |
| **Status** | Accepted |
| **Rationale** | CAL-FND-001 clarification revision. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | FORMULA-REVISION-LOG · RUN-007 |

## DEC-129 — Route-Proven density review

| Field | Value |
|-------|-------|
| **Decision** | Mastery floors unchanged. RP density interpreted by cohort (B **22.88%** vs A **45.11%**). No floor hike solely to lower Cohort A RP %. |
| **Status** | Accepted |
| **Rationale** | CAL-FND-003. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | MANDATORY-CALIBRATION-FINDINGS.md |

## DEC-130 — Prestige soft-warning treatment

| Field | Value |
|-------|-------|
| **Decision** | Prestige advances WITH CONDITIONS. Cohort B Ascendant **0%**; Apex/Obsidian **0**. No cosmetic PEI threshold hike. Panel staffing remains Open. |
| **Status** | Conditionally Accepted |
| **Rationale** | CAL-FND-004 soft watch. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | [PRESTIGE-CALIBRATION-REPORT.md](../../product/progression/simulation/PRESTIGE-CALIBRATION-REPORT.md) |

## DEC-131 — Trust false-positive protection

| Field | Value |
|-------|-------|
| **Decision** | POL-TRU-001 advances WITH CONDITIONS. No public numeric Trust. False-positive / farming protections confirmed at design red-team level; real moderation pilot still required. |
| **Status** | Conditionally Accepted |
| **Rationale** | Trust FP risk remains Open without pilot. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | [TRUST-CALIBRATION-REPORT.md](../../product/progression/simulation/TRUST-CALIBRATION-REPORT.md) |

## DEC-132 — Leaderboard population calibration

| Field | Value |
|-------|-------|
| **Decision** | POL-POP-001 advances WITH CONDITIONS. Authoritative public boards forbidden on undersized populations; Diamond scarcity OK; do not equalize leagues. |
| **Status** | Conditionally Accepted |
| **Rationale** | Small-N distortion + cultural harm risks remain Open. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | [LEADERBOARD-POPULATION-REPORT.md](../../product/progression/simulation/LEADERBOARD-POPULATION-REPORT.md) |

## DEC-133 — Integrity red-team requirements

| Field | Value |
|-------|-------|
| **Decision** | Fixed 20-attack integrity red-team is mandatory for 1C. RUN-013 recorded **20/20 PASS**. Pay-to-win diffs remain **0**. |
| **Status** | Accepted |
| **Rationale** | Design-level integrity evidence without production detection. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | [RED-TEAM-SIMULATION-REPORT.md](../../product/progression/simulation/RED-TEAM-SIMULATION-REPORT.md) · PROGRESSION-INTEGRITY-RED-TEAM.md |

## DEC-134 — Synthetic calibration status meaning

| Field | Value |
|-------|-------|
| **Decision** | “CALIBRATION RECOMMENDED · PENDING 1D” means internal synthetic integrity/fairness judgment only. It does **not** mean production calibrated, real-user validated, or Product Code authorized. |
| **Status** | Accepted |
| **Rationale** | Prevents false confidence (RISK-PRG-044 / §31). |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | CALIBRATION-KNOWN-LIMITATIONS.md · BASELINE-MANIFEST |

## DEC-135 — Final Progression Baseline lock deferred to 1D

| Field | Value |
|-------|-------|
| **Decision** | GHV.PROGRESSION.1C PASS advances Internal Calibration Baseline **v0.2.0** as CALIBRATION RECOMMENDED. Final Progression Baseline lock remains **PENDING GHV.PROGRESSION.1D**. Formula versions: MAT **0.2.0**, MOM-002 **0.2.0**, XP **0.1.1**, others **0.1.0**. Conditions travel on MOM-002, TRU, PRS, POL-POP. |
| **Status** | **Superseded** by DEC-136 / GHV.PROGRESSION.1D PASS |
| **Rationale** | Supersedes DEC-120 pending-1C posture; does not authorize final lock or Product Code. |
| **Related Gate** | GHV.PROGRESSION.1C |
| **Evidence** | [GHV.PROGRESSION.1C.md](../gates/GHV.PROGRESSION.1C.md) · [CALIBRATION-FINAL-RECOMMENDATION.md](../../product/progression/calibration/CALIBRATION-FINAL-RECOMMENDATION.md) · PROGRESSION-FORMULA-REGISTRY.md |

## DEC-136 — Meaning of Progression Design Baseline lock

| Field | Value |
|-------|-------|
| **Decision** | **LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE** means governed design meanings, IDs, formulas/policies/templates, invariants, and Change Freeze only. It does **not** mean real-user validated, usability validated, technically validated, production calibrated, implemented, or production ready. |
| **Status** | Accepted |
| **Rationale** | Prevents false confidence after 1D PASS (extends DEC-134). |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | [GHV.PROGRESSION.1D.md](../gates/GHV.PROGRESSION.1D.md) · [PROGRESSION-BASELINE-MANIFEST.md](../../product/progression/governance/PROGRESSION-BASELINE-MANIFEST.md) |

## DEC-137 — Final accepted formula / policy / template versions

| Field | Value |
|-------|-------|
| **Decision** | Lock one active version per ID: FRM-XP-001 **0.1.1**; FRM-MAT-001 **0.2.0**; FRM-MOM-002 **0.2.0**; all other registered formula/policy/template IDs **0.1.0** as listed in FINAL-FORMULA-VERSION-REGISTRY. Conflicting active versions forbidden. |
| **Status** | Accepted |
| **Rationale** | Closes multi-version drift before technical validation. |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | [FINAL-FORMULA-VERSION-REGISTRY.md](../../product/progression/governance/FINAL-FORMULA-VERSION-REGISTRY.md) |

## DEC-138 — Momentum conditional lock (FRM-MOM-002)

| Field | Value |
|-------|-------|
| **Decision** | FRM-MOM-002 **0.2.0** is **LOCKED WITH VALIDATION CONDITIONS**: real-user League-boundary monitoring; Momentum-anxiety usability; season-distribution review after pilot; promotion-buffer technical validation. Do not equalize leagues. |
| **Status** | Conditionally Accepted |
| **Rationale** | Synthetic PASS with known boundary sensitivity (CAL-FND-002 / DEC-130 lineage). |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | MOMENTUM-FORMULA.md · FINAL-FORMULA-VERSION-REGISTRY |

## DEC-139 — Fledgling resolution (CAL-FND-001)

| Field | Value |
|-------|-------|
| **Decision** | Fledgling reachability via FRM-MAT-001 **0.2.0** (Mission/Stage contexts + governed Rank skip) is **accepted and closed** for design lock. Measured synthetic Fledgling **3472 / 25000**. Real-pilot re-check remains debt. |
| **Status** | Accepted |
| **Rationale** | Mandatory finding closure without cosmetic Rank forcing. |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | MATURITY-FORMULA.md · MANDATORY-CALIBRATION-FINDINGS · MULTI-SEED-POPULATION-REPORT |

## DEC-140 — Route-Proven density disposition (CAL-FND-003)

| Field | Value |
|-------|-------|
| **Decision** | Mastery floors unchanged. Cite **Cohort B RP 22.88%** for launch narrative; Cohort A ~45% is stress-only. No floor hike solely to lower stress RP %. |
| **Status** | Accepted |
| **Rationale** | Prevents quota tuning to synthetic histograms. |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | LAUNCH-REALISTIC-COHORT-REPORT · DEC-125/129 |

## DEC-141 — Prestige soft-warning disposition (CAL-FND-004)

| Field | Value |
|-------|-------|
| **Decision** | Prestige **LOCKED WITH VALIDATION CONDITIONS**. Cohort B Ascendant **0%**; Apex/Obsidian **0**. No cosmetic PEI hike. Panel staffing, consistency, rarity calibration, CoI ops, and Prestige usability remain Open debt. |
| **Status** | Conditionally Accepted |
| **Rationale** | Soft watch retained under design lock. |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | PRESTIGE-CALIBRATION-REPORT · FRM/POL-PRS |

## DEC-142 — Trust non-public lock (POL-TRU-001)

| Field | Value |
|-------|-------|
| **Decision** | Trust remains a **non-public state model** with **no public numeric score**. POL-TRU-001 **LOCKED WITH VALIDATION CONDITIONS** (moderation policy, FP testing, window calibration, staffing, age/legal). |
| **Status** | Conditionally Accepted |
| **Rationale** | Privacy and anti-popularity invariants. |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | TRUST-TRANSITION-POLICY · TRUST-CALIBRATION-REPORT |

## DEC-143 — Counterfactual parity lock

| Field | Value |
|-------|-------|
| **Decision** | Counterfactual parity is locked for design: matched Skill systems must show **zero** plan/language/age/AT/connectivity/device/profile/reviewer-identity diffs; schedule may affect Momentum only within approved synthetic bound (Δ **4.33 ≤ 10**); Mastery/Route-Proven unaffected by schedule. Protected traits are not formula inputs. |
| **Status** | Accepted |
| **Rationale** | Design-level fairness law; real-user still NOT RUN. |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | COUNTERFACTUAL-FAIRNESS-TESTS · ACCESSIBILITY-SCHEDULE-REPORT |

## DEC-144 — Professional Title catalogue deferral

| Field | Value |
|-------|-------|
| **Decision** | TPL-TTL-001/002 foundation templates are locked; **Title catalogue remains DEFERRED**. No automatic Title grants; employment disclaimer retained. |
| **Status** | Accepted |
| **Rationale** | Honest templates without premature catalogue lock. |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | PROFESSIONAL-TITLE-ELIGIBILITY · DEP-070 |

## DEC-145 — Prestige human-authority lock

| Field | Value |
|-------|-------|
| **Decision** | Prestige Classes remain **human-granted only**. Automation may open eligibility/review queues but **cannot grant** Prestige. Panels, quorum, founder self-approval ban, and conflict recusal are mandatory. |
| **Status** | Conditionally Accepted |
| **Rationale** | Constitution / integrity boundary. |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | PRESTIGE-ARCHITECTURE · POL-PRS-001 · AUTOMATION-HUMAN-AUTHORITY-BOUNDARY |

## DEC-146 — Achievement provisional catalogue

| Field | Value |
|-------|-------|
| **Decision** | Exactly **12** provisional launch Achievement rules (**POL-ACH-001**) are **LOCKED AS PROVISIONAL LAUNCH DESIGN CATALOGUE**. Artwork/publication deferred. Participation ≠ Skill; no payment Achievement. |
| **Status** | Accepted |
| **Rationale** | Bounded launch catalogue without clutter claim. |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | ACHIEVEMENT-RULE-CATALOGUE |

## DEC-147 — Leaderboard population policy

| Field | Value |
|-------|-------|
| **Decision** | Leaderboard formulas locked as separated design baseline; **POL-POP-001 LOCKED WITH VALIDATION CONDITIONS**. No universal board. Below **20** users: no public ranked board. Paid plans get no multiplier. |
| **Status** | Conditionally Accepted |
| **Rationale** | Small-N cultural/privacy harm risks remain Open. |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | LEADERBOARD-POPULATION-POLICY · LEADERBOARD-POPULATION-REPORT |

## DEC-148 — Real-user validation requirement

| Field | Value |
|-------|-------|
| **Decision** | Real-user progression calibration remains **mandatory before production confidence**. Design lock does **not** satisfy real-user validation. Status stays **NOT RUN**. |
| **Status** | Accepted |
| **Rationale** | RISK-PRG-038 / 044 / 056 remain Open. |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | REAL-USER-PROGRESSION-VALIDATION-PLAN (when present) · PROJECT_STATUS |

## DEC-149 — Technical validation requirement

| Field | Value |
|-------|-------|
| **Decision** | Technical validation of event ingress, version storage, rounding, reversals, audit, and workflows remains **mandatory before implementation**. Status stays **NOT RUN**. Product Code remains **BLOCKED**. |
| **Status** | Accepted |
| **Rationale** | Design lock ≠ technical correctness. |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | PROGRESSION-TECHNICAL-HANDOFF · PROGRESSION-TECHNICAL-VALIDATION-PLAN (when present) |

## DEC-150 — Progression Change Freeze

| Field | Value |
|-------|-------|
| **Decision** | After 1D PASS, progression meanings, IDs, ledger separation, accepted formula/policy/template versions, floors/caps, Trust non-public model, Prestige human authority, Leaderboard separation, and anti-pay-to-win / counterfactual-parity invariants are under **Progression Change Freeze**. Editorial clarifications allowed; value/output changes require Controlled Change Request; foundational invariants require rebaseline. |
| **Status** | Accepted |
| **Rationale** | Protects locked design baseline. |
| **Related Gate** | GHV.PROGRESSION.1D |
| **Evidence** | [PROGRESSION-CHANGE-FREEZE-POLICY.md](../../product/progression/governance/PROGRESSION-CHANGE-FREEZE-POLICY.md) |

## DEC-151 — Screen-count defect / GHV.BASELINE-CORRECTION.1

| Field | Value |
|-------|-------|
| **Decision** | Authoritative product decision remains **7 interface shells / 92 screens**. MASTER-SCREEN-REGISTRY currently lists **90** — a pre-existing governance defect. Record as external baseline debt; **do not** silently rewrite screen IDs/counts inside PROGRESSION.1D. Next Gate: **GHV.BASELINE-CORRECTION.1**. This defect **blocks GHV.ARCHITECTURE.1A**. Does not invalidate Progression Design Baseline lock when correctly recorded. |
| **Status** | Accepted — **SUPERSEDED IN COUNT ONLY / RESOLVED BY GHV.BASELINE-CORRECTION.1** (architecture retained; defect closed by **DEC-152** · CR-001 · registry v1.1.0) |
| **Rationale** | Cross-baseline integrity without scope creep into Learning/PD baselines. |
| **Related Gate** | GHV.PROGRESSION.1D · resolved under GHV.BASELINE-CORRECTION.1 |
| **Evidence** | [GATE-REGISTER.md](../gates/GATE-REGISTER.md) · [GHV.BASELINE-CORRECTION.1.md](../gates/GHV.BASELINE-CORRECTION.1.md) · RISK-PRG-057 (resolved) |

## DEC-152 — Authoritative 92-screen / 7-shell baseline lock

| Field | Value |
|-------|-------|
| **Decision** | Authoritative GHURAVIA screen baseline is **92 screens across seven interface shells**. Previous active registry count **90** corrected under **CR-001** without silent historical rewrite or global renumbering. Net **+2**: ACT-011 Email Verification Result · ACT-012 Activation Recovery. ACT-003 Email Verification Pending retained. ACT-004 preserved as **SUPERSEDED_ALIAS**. PD.2 and PD.3 remain **PASS — AMENDED, NOT RERUN**. Architecture Gate **GHV.ARCHITECTURE.1A** unblocked for the former screen-count dependency. Learning and Progression design baselines **unchanged**. Product Code remains **BLOCKED**. |
| **Status** | Accepted — **AMENDED BY DEC-153** (alias-safe counting) |
| **Rationale** | Closes cross-baseline count defect; freezes corrected inventory under SCREEN-BASELINE-FREEZE-POLICY. |
| **Related Gate** | GHV.BASELINE-CORRECTION.1 |
| **Evidence** | [CR-001-SCREEN-BASELINE-CORRECTION.md](../changes/CR-001-SCREEN-BASELINE-CORRECTION.md) · [MASTER-SCREEN-REGISTRY.md](../../product/screens/MASTER-SCREEN-REGISTRY.md) · [SCREEN-BASELINE-VALIDATION-REPORT.md](../corrections/SCREEN-BASELINE-VALIDATION-REPORT.md) · [SCREEN-BASELINE-FREEZE-POLICY.md](../corrections/SCREEN-BASELINE-FREEZE-POLICY.md) |

### DEC-152 addendum (superseded counting clause)

CR-001 counted ACT-004 SUPERSEDED_ALIAS inside the inventory table. Architecture Gate rules require SUPERSEDED_ALIAS **not** to count. See **DEC-153** / **CR-002**.

## DEC-153 — Alias-safe 92-screen counting + ACT-013 risk accept

| Field | Value |
|-------|-------|
| **Decision** | Governed screen baseline remains **92 ACTIVE IDs / 7 shells** with **0 aliases in the inventory table**. **ACT-004** is **HISTORICAL_REFERENCE / SUPERSEDED_ALIAS** in a Historical Alias Appendix only and **does NOT** contribute to 92 (redirect → ACT-011 VERIFIED). **ACT-013 Accept Account Risk** is **NEW ACTIVE** Activation screen capturing mandatory `account_risk_status = acceptable` per Scope activation formula (previously underspecified / folded into ACT-006). Happy path: ACT-005 → ACT-013 → ACT-006. ACT-003 / ACT-011 / ACT-012 titles and roles unchanged. No email-verification duplicate. PD.2 remains **PASS — AMENDED** (Amendment-02). Learning and Progression baselines **unchanged**. Product Code remains **BLOCKED**. |
| **Status** | Accepted |
| **Rationale** | Closes ARCHITECTURE.1A preflight alias inflation (91 ACTIVE when ACT-004 excluded) without inventing duplicate email screens; surfaces Scope-required risk gate. |
| **Related Gate** | GHV.BASELINE-CORRECTION.1 (amended by CR-002) · GHV.ARCHITECTURE.1A preflight |
| **Evidence** | [CR-002-SCREEN-ALIAS-INFLATION-REMEDIATION.md](../changes/CR-002-SCREEN-ALIAS-INFLATION-REMEDIATION.md) · [GHV.PRODUCT-DEFINITION.2-AMENDMENT-02.md](../gates/GHV.PRODUCT-DEFINITION.2-AMENDMENT-02.md) · [MASTER-SCREEN-REGISTRY.md](../../product/screens/MASTER-SCREEN-REGISTRY.md) v1.2.0 · [SCREEN-BASELINE-ARCHITECTURE-PREFLIGHT.md](../../architecture/ghuravia/validation/SCREEN-BASELINE-ARCHITECTURE-PREFLIGHT.md) |

## DEC-154 — Architecture programme structure

| Field | Value |
|-------|-------|
| **Decision** | GHURAVIA technical-architecture programme is sequenced **1A** Core Technical Validation Plan → **1B** Platform Architecture and Stack Decisions → **1C** Identity, Security, Data and Evidence → **1D** Runtime, Realtime, Integration and Operational → **1E** Technical Spikes, Architecture Reconciliation and Baseline Lock. **1A** plans validation only and must not prematurely perform later Gate work. |
| **Status** | Accepted |
| **Rationale** | Prevents premature stack lock and Product Code while establishing an ordered evidence path. |
| **Related Gate** | GHV.ARCHITECTURE.1A |
| **Evidence** | [GHV.ARCHITECTURE.1A.md](../gates/GHV.ARCHITECTURE.1A.md) · [TECHNICAL-VALIDATION-DEPENDENCY-GRAPH.md](../../architecture/ghuravia/validation/TECHNICAL-VALIDATION-DEPENDENCY-GRAPH.md) |

## DEC-155 — Architecture principles

| Field | Value |
|-------|-------|
| **Decision** | Architecture principles defined under GHV.ARCHITECTURE.1A (product baseline before technology; Evidence before Mastery; entitlement separate from progression; secure/privacy/Arabic-first/accessibility; idempotent events; auditable corrections; local recalculation; vendor-neutral domain logic; replaceable providers; graceful degradation; observable ops) are **DEFINED as validation-plan authority**. They are **not** a stack lock and do **not** authorize Product Code. |
| **Status** | Accepted |
| **Rationale** | Principles constrain option space before spikes and ADRs. |
| **Related Gate** | GHV.ARCHITECTURE.1A |
| **Evidence** | architecture/ghuravia/principles/ARCHITECTURE-PRINCIPLES.md (programme) · [ARCHITECTURE-DECISION-FRAMEWORK.md](../../architecture/ghuravia/governance/ARCHITECTURE-DECISION-FRAMEWORK.md) |

## DEC-156 — Technical domain catalogue

| Field | Value |
|-------|-------|
| **Decision** | The technical domain catalogue (Public Experience through Integration Gateway / deployment) is the governed domain inventory for validation planning. Domains own responsibilities and validation questions; **no database tables** are defined by this decision. |
| **Status** | Accepted |
| **Rationale** | Enables readiness matrix and spike ownership without schema invention. |
| **Related Gate** | GHV.ARCHITECTURE.1A |
| **Evidence** | [ARCHITECTURE-READINESS-MATRIX.md](../../architecture/ghuravia/governance/ARCHITECTURE-READINESS-MATRIX.md) |

## DEC-157 — Quality-attribute process

| Field | Value |
|-------|-------|
| **Decision** | Quality-attribute scenarios (QAS-*) are governed validation inputs: each P0-relevant QAS must map to a spike or explicit rationale. QAS status remains **DRAFT VALIDATION BASELINE** until spikes produce evidence. |
| **Status** | Accepted |
| **Rationale** | Ties architecture questions to measurable scenarios without claiming validation complete. |
| **Related Gate** | GHV.ARCHITECTURE.1A |
| **Evidence** | [TECHNICAL-VALIDATION-TRACEABILITY.md](../../architecture/ghuravia/governance/TECHNICAL-VALIDATION-TRACEABILITY.md) |

## DEC-158 — No inherited-stack auto-approval

| Field | Value |
|-------|-------|
| **Decision** | Presence of CyberCrow / inherited repository technologies, configs, or docs does **not** auto-approve them for GHURAVIA. Inherited items are **DISCOVERED / INHERITED / VALIDATION REQUIRED** until spikes and ADRs decide. |
| **Status** | Accepted |
| **Rationale** | Prevents inherited-technology bias (RISK-ARC-002). |
| **Related Gate** | GHV.ARCHITECTURE.1A |
| **Evidence** | [ADR-REGISTER.md](../../architecture/ghuravia/governance/ADR-REGISTER.md) · SPK-ARC-001 |

## DEC-159 — No graph-database-by-name assumption

| Field | Value |
|-------|-------|
| **Decision** | Learning Graph semantics must be validated without assuming a dedicated graph database by product name. Relational/typed representations are first-class candidates; any graph-DB option requires comparative evidence (SPK-ARC-005). |
| **Status** | Accepted |
| **Rationale** | Avoids vendor-by-name lock and database coupling. |
| **Related Gate** | GHV.ARCHITECTURE.1A |
| **Evidence** | SPK-ARC-005 · ASM-ARC-003 · RISK-ARC-004 |

## DEC-160 — Event idempotency requirement

| Field | Value |
|-------|-------|
| **Decision** | Progression and commercial event ingress must be designed for **idempotent** application (duplicate keys must not double-apply standing or entitlements). Implementation remains **BLOCKED** until SPK-ARC-010 / SPK-ARC-012 evidence. |
| **Status** | Accepted |
| **Rationale** | Data-integrity invariant from Progression Design Baseline and QAS-004. |
| **Related Gate** | GHV.ARCHITECTURE.1A |
| **Evidence** | SPK-ARC-010 · 012 · RISK-ARC-005 · 020 |

## DEC-161 — Formula-version preservation requirement

| Field | Value |
|-------|-------|
| **Decision** | Historical standings must remain reproducible under their **stored formula versions**. Silent parameter drift is forbidden. Technical proof deferred to SPK-ARC-011 (NOT RUN). |
| **Status** | Accepted |
| **Rationale** | Protects locked FINAL-FORMULA-VERSION-REGISTRY meanings at runtime. |
| **Related Gate** | GHV.ARCHITECTURE.1A |
| **Evidence** | SPK-ARC-011 · RISK-ARC-007 · QAS-013 |

## DEC-162 — Evidence-object separation

| Field | Value |
|-------|-------|
| **Decision** | Evidence Objects are a distinct technical concern from public media and from progression meters: storage isolation, resumable upload, and scanning are mandatory validation themes (SPK-ARC-007 · 008). No schema authorized in 1A. |
| **Status** | Accepted |
| **Rationale** | Security and integrity of professional Evidence. |
| **Related Gate** | GHV.ARCHITECTURE.1A |
| **Evidence** | SPK-ARC-007 · 008 · RISK-ARC-008 · 009 |

## DEC-163 — External-provider adapter principle

| Field | Value |
|-------|-------|
| **Decision** | External providers (identity, email, SMS, payments, storage, search, realtime, observability) must sit behind **replaceable adapters**; domain logic remains vendor-neutral. Provider selection ADRs stay **PROPOSED** until evaluation spikes. |
| **Status** | Accepted |
| **Rationale** | Reduces lock-in and outage blast radius. |
| **Related Gate** | GHV.ARCHITECTURE.1A |
| **Evidence** | ADR-ARC-004…009 · RISK-ARC-011 · 012 |

## DEC-164 — Technical-spike governance

| Field | Value |
|-------|-------|
| **Decision** | All technical spikes follow [TECHNICAL-SPIKE-STANDARD.md](../../architecture/ghuravia/validation/TECHNICAL-SPIKE-STANDARD.md). SPK-ARC-001…025 are registered **PLANNED · NOT RUN**. In 1A: **code DENIED**, **database DENIED**, **deploy DENIED**. Spikes must not quietly become Product Code. |
| **Status** | Accepted |
| **Rationale** | Controls experiment scope and evidence quality. |
| **Related Gate** | GHV.ARCHITECTURE.1A |
| **Evidence** | [TECHNICAL-SPIKE-REGISTRY.md](../../architecture/ghuravia/validation/TECHNICAL-SPIKE-REGISTRY.md) · [TECHNICAL-SPIKE-PRIORITY-MATRIX.md](../../architecture/ghuravia/validation/TECHNICAL-SPIKE-PRIORITY-MATRIX.md) |

## DEC-165 — Stack lock deferred to GHV.ARCHITECTURE.1B

| Field | Value |
|-------|-------|
| **Decision** | Final platform/stack lock is **deferred to GHV.ARCHITECTURE.1B**. 1A may propose ADRs and options only. **No stack ADR is ACCEPTED** in 1A. |
| **Status** | Accepted |
| **Rationale** | Evidence-before-lock; RISK-ARC-001. |
| **Related Gate** | GHV.ARCHITECTURE.1A · next 1B |
| **Evidence** | [ADR-REGISTER.md](../../architecture/ghuravia/governance/ADR-REGISTER.md) · GATE-REGISTER |

## DEC-166 — Product Code remains blocked

| Field | Value |
|-------|-------|
| **Decision** | Product Code remains **BLOCKED** after GHV.ARCHITECTURE.1A PASS. Validation plan lock ≠ technical validation ≠ implementation authorization. Product Code requires later Gate authorization after spike evidence (programme target: post-1E). |
| **Status** | Accepted |
| **Rationale** | Preserves docs-first integrity and anti-premature-build rule. |
| **Related Gate** | GHV.ARCHITECTURE.1A |
| **Evidence** | [PROJECT_STATUS.md](../../PROJECT_STATUS.md) · [BASELINE-MANIFEST.md](../releases/BASELINE-MANIFEST.md) |

## DEC-167 — CR-002 precondition correction acceptance

| Field | Value |
|-------|-------|
| **Decision** | **CR-002** is accepted as a **CONTROLLED PRECONDITION CORRECTION** (alias-safe recount + ACT-013 Scope surface). It is **not** Product Scope expansion and introduces **no Product Code**. Commit reference: `e6efffa`. |
| **Status** | Accepted |
| **Rationale** | Closes alias inflation discovered during Architecture.1A preflight while preserving 92 ACTIVE / 7 shells. |
| **Related Gate** | GHV.ARCHITECTURE.1A-AMENDMENT-01 · GHV.BASELINE-CORRECTION.1 (amended) |
| **Evidence** | [CR-002-SCREEN-ALIAS-INFLATION-REMEDIATION.md](../changes/CR-002-SCREEN-ALIAS-INFLATION-REMEDIATION.md) · [CR-002-ACTIVE-SCREEN-VALIDATION.md](../corrections/CR-002-ACTIVE-SCREEN-VALIDATION.md) |

## DEC-168 — ACT-004 alias exclusion from active inventory

| Field | Value |
|-------|-------|
| **Decision** | **ACT-004** remains **HISTORICAL_REFERENCE / SUPERSEDED_ALIAS** (redirect → ACT-011) and **must not** count toward the active 92. |
| **Status** | Accepted |
| **Rationale** | Prevents alias inflation; preserves ID for historical maps. |
| **Related Gate** | GHV.ARCHITECTURE.1A-AMENDMENT-01 · DEC-153 |
| **Evidence** | MASTER-SCREEN-REGISTRY Historical Alias Appendix · SCREEN-ID-CORRECTION-MAP |

## DEC-169 — ACT-013 active-screen inclusion (Scope-backed)

| Field | Value |
|-------|-------|
| **Decision** | **ACT-013 Accept Account Risk** is an **ACTIVE** Activation screen exposing the already approved Scope activation condition `account_risk_status = acceptable`. It does **not** add a new user obligation, commercial requirement, or assurance level beyond locked Scope/Constitution. |
| **Status** | Accepted |
| **Rationale** | Scope authority test passed under Amendment-01; CAP-ONB-014 / journey / wireframe mapped. |
| **Related Gate** | GHV.ARCHITECTURE.1A-AMENDMENT-01 |
| **Evidence** | SCOPE-BASELINE · PRODUCT-CONSTITUTION · CAPABILITY-REGISTRY · ACTIVATION-WIREFRAMES |

## DEC-170 — Architecture 1A amendment treatment

| Field | Value |
|-------|-------|
| **Decision** | Formal Architecture.1A verdict is **PASS — AMENDED BY CR-002 PRECONDITION CORRECTION**. Substantive validation-plan deliverables remain **PASS**. Gate **not** rerun. Architecture deliverables **not** invalidated (impact review: **NO ARCHITECTURE IMPACT**). |
| **Status** | Accepted |
| **Rationale** | Honest governance of process deviation without discarding valid plan work. |
| **Related Gate** | GHV.ARCHITECTURE.1A-AMENDMENT-01 |
| **Evidence** | [GHV.ARCHITECTURE.1A-AMENDMENT-01.md](../gates/GHV.ARCHITECTURE.1A-AMENDMENT-01.md) · [ARCHITECTURE-1A-CR002-IMPACT-REVIEW.md](../../architecture/ghuravia/governance/ARCHITECTURE-1A-CR002-IMPACT-REVIEW.md) |

## DEC-171 — No Gate-history rewrite

| Field | Value |
|-------|-------|
| **Decision** | Original Architecture.1A report, commit `e6efffa`, dates, and findings are **preserved**. Amendment notices record that the **initial** inventory failed alias-inflation validation. Do **not** rewrite history as if the preflight passed at Gate start. |
| **Status** | Accepted |
| **Rationale** | Audit integrity. |
| **Related Gate** | GHV.ARCHITECTURE.1A-AMENDMENT-01 |
| **Evidence** | GHV.ARCHITECTURE.1A.md amendment notice · preflight amendment notice |

## DEC-172 — No Product Scope expansion via ACT-013

| Field | Value |
|-------|-------|
| **Decision** | ACT-013 / CR-002 do **not** expand controlled-launch Product Scope, Pillars, prices, Learning Design, or Progression Design. |
| **Status** | Accepted |
| **Rationale** | Acceptable risk was already mandatory in Scope/Constitution activation formula. |
| **Related Gate** | GHV.ARCHITECTURE.1A-AMENDMENT-01 |
| **Evidence** | SCOPE-BASELINE.md · PRODUCT-CONSTITUTION.md · CR-002 Scope impact |

## DEC-173 — Future precondition failures must stop the active Gate

| Field | Value |
|-------|-------|
| **Decision** | When a Gate’s mandatory precondition fails, the active Gate **must stop** before unrelated substantive work proceeds. Correction occurs via **separate correction commit or Gate**, then **resumption record**. Mixing correction with substantive Gate work without an amendment is forbidden. |
| **Status** | Accepted |
| **Rationale** | Controls RISK-GOV-001 (Gate work after mandatory stop). |
| **Related Gate** | GHV.ARCHITECTURE.1A-AMENDMENT-01 · future Gates |
| **Evidence** | RISK-GOV-001 · Amendment-01 residual risk |
