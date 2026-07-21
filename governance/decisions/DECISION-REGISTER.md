# Decision Register

| Field | Value |
|-------|-------|
| **Status** | ACTIVE |
| **Version** | 1.4.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.LEARNING.1B |
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
| **Status** | Accepted |
| **Related Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Evidence** | product/interactions · product/wireframes |

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
