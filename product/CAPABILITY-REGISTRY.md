# Capability Registry

| Field | Value |
|-------|-------|
| **Status** | LOCKED inventory · Learning Design Baseline v1.0.0 · Progression Design Baseline v1.0.0 · **Architecture Design Baseline v1.0.0 LOCKED** · **External Technical Validation Baseline v0.1.0 PARTIAL** · **Implementation.0A bootstrap PASS** · **Implementation.0B activation slice PARTIAL** · **Implementation.0C activation UX PARTIAL** · **Master Screen Registry Baseline 7/92 CORRECTED AND LOCKED (v1.2.0 alias-safe)** |
| **Version** | 1.20.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-24 |
| **Source Gate** | GHV.CROW-IDENTITY.1F |
| **Related** | [SCOPE-BASELINE.md](../governance/scope/SCOPE-BASELINE.md) · [MASTER-SCREEN-REGISTRY.md](./screens/MASTER-SCREEN-REGISTRY.md) · [LEARNING-PORTFOLIO-MANIFEST.md](./learning/governance/LEARNING-PORTFOLIO-MANIFEST.md) · [PROGRESSION-BASELINE-MANIFEST.md](./progression/governance/PROGRESSION-BASELINE-MANIFEST.md) · [FINAL-FORMULA-VERSION-REGISTRY.md](./progression/governance/FINAL-FORMULA-VERSION-REGISTRY.md) · [product/progression/README.md](./progression/README.md) · [WIREFRAME-REGISTRY.md](./wireframes/WIREFRAME-REGISTRY.md) · [IDENTITY-SECURITY-DATA-EVIDENCE-BASELINE.md](../architecture/ghuravia/governance/IDENTITY-SECURITY-DATA-EVIDENCE-BASELINE.md) |

Scope status vocabulary: CORE FOUNDATION · CONTROLLED LAUNCH · POST-LAUNCH PLANNED · CONDITIONAL · PENDING TECHNICAL VALIDATION · PENDING EXTERNAL VALIDATION · DEFERRED · OUT OF SCOPE · REJECTED

Maturity: Defined · Specified · Pending Validation · Not Built

Journey phases: Discover · Activate · Personalize · Origin · Nest · Horizon · Preview · Route · Flight Plan · Missions · Evidence · Wings · Skyboard · Return · Ops

Screen families: PUB · ACT · IDN · ONB · LRN · SKY/WLD · COM · LIV · PRG · PAY · TRU · ADM

---

## Product and Governance

| ID | Name | Pillar | Scope status | Journey | Screens | Maturity | Deps | Owner | Gate |
|----|------|--------|--------------|---------|---------|----------|------|-------|------|
| CAP-GOV-001 | Constitution | All | CORE FOUNDATION | — | — | Specified | — | Founder | 1B |
| CAP-GOV-002 | Brand | Identity | CONDITIONAL | Discover | PUB | Defined | EXT trademark/domain | Founder | Ext |
| CAP-GOV-003 | Scope Baseline | All | CORE FOUNDATION | — | — | Specified | — | Founder | 1B |
| CAP-GOV-004 | Change governance | All | CORE FOUNDATION | — | — | Specified | — | Founder | 1B |
| CAP-GOV-005 | Roadmap / Gates | All | CORE FOUNDATION | — | — | Defined | — | Founder | 1B |

## Public and Onboarding

| ID | Name | Pillar | Scope status | Journey | Screens | Maturity | Deps | Owner | Gate |
|----|------|--------|--------------|---------|---------|----------|------|-------|------|
| CAP-ONB-001 | Landing Page | Learning | CONTROLLED LAUNCH | Discover | PUB | Defined | — | Founder | 1B |
| CAP-ONB-002 | Registration | Identity | CONTROLLED LAUNCH | Activate | ACT | Specified | IdP adapter · ADR-013 | Founder | ARCH.1C |
| CAP-ONB-003 | Email verification (Pending + Result) | Trust | CONTROLLED LAUNCH | Activate | **ACT-003 · ACT-011** | **Specified** | Email adapter · ADR-016 · CR-001 | Founder | ARCH.1C |
| CAP-ONB-004 | Terms acceptance | Trust | CONTROLLED LAUNCH | Activate | **ACT-005** | Defined | Legal copy | Founder | Ext |
| CAP-ONB-005 | Optional mobile verification | Trust | CONTROLLED LAUNCH | Activate | ACT | Defined | SMS | Founder | Tech |
| CAP-ONB-006 | Crow personalization | Identity | CONTROLLED LAUNCH | Personalize | IDN | Defined | — | Founder | 1B |
| CAP-ONB-007 | Origin | Identity | CONTROLLED LAUNCH | Origin | ONB | Defined | — | Founder | 1B |
| CAP-ONB-008 | The Nest | Learning | CONTROLLED LAUNCH | Nest | ONB/LRN | Specified | Content · Nest ≠ Lineage (1B vocabulary) | Founder | Learning / 0E |
| CAP-IDN-001 | Core Crow Lineage taxonomy | Identity | CORE FOUNDATION (design) | Identity | — | Specified | Taxonomy Baseline v1.0.0 · no runtime award | Founder | CROW-IDENTITY.1B |
| CAP-IDN-002 | Chosen / Suggested / Earned Crow Lineage lifecycle | Identity | CORE FOUNDATION (design) | Identity | — | Specified | Lifecycle Baseline v1.0.0 · Evidence-before-Mastery · privacy/projection · no runtime | Founder | CROW-IDENTITY.1C |
| CAP-IDN-003 | Crow visual / Mother Form / Lineage Mark / motion system | Identity | CORE FOUNDATION (design) | Identity | — | Specified | Visual Baseline v1.0.0 · REFERENCE LOCKED plates · no runtime | Founder | CROW-IDENTITY.1D |
| CAP-IDN-004 | Founder-selected Horizon Mother Form visual directions | Identity | CORE FOUNDATION (design) | Identity | — | Specified | Operate MF-O-B · Build MF-B-A v0.2 · Analyze MF-A-A · Protect MF-P-A · Lead MF-L-B · local hashes · not production art · no runtime | Founder | CROW-IDENTITY.1E |
| CAP-IDN-005 | Founder-selected Operate Core Crow Lineage visual directions | Identity | CORE FOUNDATION (design) | Identity | — | Specified | O1 A · O2 C · O3 C · O4 A · O5 B under MF-O-B · local hashes · family PASS_WITH_MINOR_RISK · not production art · no runtime | Founder | CROW-IDENTITY.1F |
| CAP-ONB-009 | Horizon and Route selection | Learning | CONTROLLED LAUNCH | Horizon/Route | ONB/WLD | Specified | Catalogue | Founder | Learning |
| CAP-ONB-010 | Flight Plan | Learning | CONTROLLED LAUNCH | Flight Plan | ONB/WLD | Defined | Entitlement | Founder | 1B |
| CAP-ONB-011 | Verification result / resend / expiry handling | Trust | CONTROLLED LAUNCH | Activate | **ACT-011** | **Specified** | CAP-ONB-003 · Email | Founder | BC.1 |
| CAP-ONB-012 | Activation recovery / interrupted activation | Trust | CONTROLLED LAUNCH | Activate | **ACT-012** | **Specified** | Preserves completed gates | Founder | BC.1 |
| CAP-ONB-013 | Safe activation support escalation | Trust | CONTROLLED LAUNCH | Activate | **ACT-012** · support | **Defined** | CAP-ONB-012 · no pay-to-skip | Founder | BC.1 |
| CAP-ONB-014 | Account risk acceptance | Trust | CONTROLLED LAUNCH | Activate | **ACT-013** | **Specified** | Scope activation formula · CR-002 | Founder | BC.1 / CR-002 |

## Learning

| ID | Name | Pillar | Scope status | Journey | Screens | Maturity | Deps | Owner | Gate |
|----|------|--------|--------------|---------|---------|----------|------|-------|------|
| CAP-LRN-001 | World taxonomy | Learning | CORE FOUNDATION | World | WLD | Specified | — | Founder | 1B |
| CAP-LRN-002 | Learning Graph | Learning | CORE FOUNDATION | Route | WLD/LRN | Specified | Graph perf; conceptual registry 1B | Founder | Tech |
| CAP-LRN-003 | Missions | Learning | CONTROLLED LAUNCH | Missions | LRN | Specified | **87** Mission Blueprints LOCKED AS DESIGN BASELINE; content production pending | Founder | Learning |
| CAP-LRN-004 | Assessments | Evidence | CONTROLLED LAUNCH | Missions | LRN | Specified | **33** assessment anchors LOCKED AS ASSESSMENT DESIGN BASELINE; numeric → PROGRESSION.1 | Founder | Learning |
| CAP-LRN-005 | Evidence | Evidence | CONTROLLED LAUNCH | Evidence | LRN/LOG | Specified | Design baseline + 1C upload/scan/access architecture · providers deferred | Founder | ARCH.1C |
| CAP-LRN-006 | Cross-Wing | Learning | CONTROLLED LAUNCH | Learning | LRN | Specified | CXW-001 LOCKED AS DESIGN BASELINE; VALID WITH REQUIRED BRIDGE; Publication BLOCKED | Founder | Learning |
| CAP-LRN-007 | Secure Extensions | Trust/Learning | CONTROLLED LAUNCH | Learning | LRN | Specified | SEX-001 LOCKED AS DESIGN BASELINE; Publication BLOCKED | Founder | Learning |
| CAP-LRN-008 | Content lifecycle | Learning | CORE FOUNDATION | Ops | ADM | Specified | Production handoff + freeze + capacity sequencing | Founder | Ops |
| CAP-LRN-009 | Launch catalogue selection | Learning | CONTROLLED LAUNCH (design) | Route | WLD | Specified | Learning Design Baseline v1.0.0 LOCKED; Expert/Pilot NOT RUN; Publication BLOCKED | Founder | Learning |
| CAP-LRN-010 | Route architectures (P0) | Learning | CONTROLLED LAUNCH | Route | WLD/LRN | Specified | RT-OPR/BLD/PRT/LED-001 LOCKED AS DESIGN BASELINE | Founder | Learning |
| CAP-LRN-011 | ANALYZE Route reserve | Learning | CONDITIONAL | Route | WLD | Specified | RT-ANL-001 LOCKED AS RESERVE DESIGN BASELINE | Founder | Learning |
| CAP-LRN-012 | Shared learning capabilities | Learning | CORE FOUNDATION | Missions | LRN | Specified | SHC-001..012 | Founder | Learning |
| CAP-LRN-013 | Nest capability registry | Learning | CORE FOUNDATION | Nest | ONB/LRN | Specified | NST-CAP-001..013; thresholds unchanged | Founder | Learning |
| CAP-LRN-014 | Route-Proven (qualitative) | Evidence | CONTROLLED LAUNCH | Evidence/Wings | PRG/LRN | Specified | Qualitative lock; numeric → PROGRESSION.1 | Founder | Learning |
| CAP-LRN-015 | Horizon-Proven model | Evidence | POST-LAUNCH PLANNED (award) | Progression | PRG | Defined | Foundation model locked; awarding deferred | Founder | Learning |
| CAP-LRN-016 | AppSec Bridge | Learning | CONTROLLED LAUNCH | Learning | LRN | Specified | BRG-PRT-BLD-01 LOCKED AS DESIGN BASELINE; mandatory for CXW | Founder | Learning |
| CAP-LRN-017 | Capstone blueprints | Evidence | CONTROLLED LAUNCH | Evidence | LRN | Specified | 7 Capstones LOCKED AS DESIGN BASELINE | Founder | Learning |
| CAP-LRN-018 | Learning integrity / AI policy | Trust | CORE FOUNDATION | Missions | LRN | Specified | AI + integrity models | Founder | Learning |
| CAP-LRN-019 | Team / Live Sky learning | Community | CONTROLLED LAUNCH (surface) | Live | LIV | Defined | LIV-MSN-001 LOCKED AS DESIGN BLUEPRINT; tech NOT RUN | Founder | Learning |

## Progression

| ID | Name | Pillar | Scope status | Journey | Screens | Maturity | Deps | Owner | Gate |
|----|------|--------|--------------|---------|---------|----------|------|-------|------|
| CAP-PRG-001 | Flight XP | Identity | CONTROLLED LAUNCH | Progression | PRG | Specified | Architecture 1A; FRM-XP-001 **0.1.1** LOCKED AS DESIGN BASELINE | Founder | PROGRESSION.1D |
| CAP-PRG-002 | Momentum | Identity | CONTROLLED LAUNCH | Progression | PRG | Specified | FRM-MOM-002 **0.2.0** LOCKED WITH VALIDATION CONDITIONS | Founder | PROGRESSION.1D |
| CAP-PRG-003 | Maturity Rank | Identity | CONTROLLED LAUNCH | Progression | PRG | Specified | FRM-MAT-001 **0.2.0** LOCKED AS DESIGN BASELINE · Fledgling reachable | Founder | PROGRESSION.1D |
| CAP-PRG-004 | Route Mastery | Evidence | CONTROLLED LAUNCH | Evidence/Wings | PRG/LRN | Specified | FRM-MST-* LOCKED AS DESIGN BASELINE · Cohort B RP 22.88% | Founder | PROGRESSION.1D |
| CAP-PRG-005 | Breadth | Identity | CONTROLLED LAUNCH (surface) · POST-LAUNCH PLANNED (depth) | Progression | PRG | Specified | FRM-BRD-001 LOCKED AS DESIGN BASELINE | Founder | PROGRESSION.1D |
| CAP-PRG-006 | Trust Standing | Trust | CONTROLLED LAUNCH | Community | COM/PRG | Specified | POL-TRU-001 LOCKED WITH VALIDATION CONDITIONS · non-public · ≠ popularity | Founder | PROGRESSION.1D |
| CAP-PRG-007 | Professional Titles | Opportunity | CONTROLLED LAUNCH (surface) · POST-LAUNCH PLANNED (depth) | Progression | PRG | Specified | TPL-TTL-001/002 foundation templates locked · catalogue deferred | Founder | PROGRESSION.1D |
| CAP-PRG-008 | Prestige Classes | Identity | CONTROLLED LAUNCH (surface) · POST-LAUNCH PLANNED (depth) | Progression | PRG | Specified | FRM/POL-PRS LOCKED WITH VALIDATION CONDITIONS · human final authority | Founder | PROGRESSION.1D |
| CAP-PRG-009 | Crests / Achievements | Identity | CONTROLLED LAUNCH | Wings | IDN/PRG | Specified | POL-ACH-001 provisional launch catalogue locked · participation ≠ Skill | Founder | PROGRESSION.1D |
| CAP-PRG-010 | Limited Leaderboards | Community | CONTROLLED LAUNCH | Progression | PRG | Specified | FRM-LDB-* locked · POL-POP-001 LOCKED WITH VALIDATION CONDITIONS | Founder | PROGRESSION.1D |
| CAP-PRG-011 | Progression events & validity | Identity | CORE FOUNDATION | Progression | PRG | Specified | 53 events; 7 validity states | Founder | PROGRESSION.1 |
| CAP-PRG-012 | Progression corrections & appeals | Trust | CORE FOUNDATION | Progression | PRG | Specified | Audited corrections; POL-COR-001 candidate | Founder | PROGRESSION.1 |
| CAP-PRG-013 | Progression explainability | Identity | CORE FOUNDATION | Progression | PRG | Specified | Mandatory explanations | Founder | PROGRESSION.1 |
| CAP-PRG-014 | Mastery freshness / revalidation | Evidence | CONTROLLED LAUNCH | Evidence | PRG/LRN | Specified | POL-FRS-001 SIMULATION CANDIDATE | Founder | PROGRESSION.1 |
| CAP-PRG-015 | Progression anti-gaming | Trust | CORE FOUNDATION | Progression | PRG | Specified | Conceptual controls; no surveillance design | Founder | PROGRESSION.1 |
| CAP-PRG-016 | Progression privacy & age safety | Trust | CORE FOUNDATION | Progression | PRG | Specified | Minors Crow identity; legal PENDING | Founder | Legal |

## Adaptive Experience

| ID | Name | Pillar | Scope status | Journey | Screens | Maturity | Deps | Owner | Gate |
|----|------|--------|--------------|---------|---------|----------|------|-------|------|
| CAP-EBUX-001 | Flight State | Learning | CORE FOUNDATION + CONTROLLED LAUNCH | Skyboard/Return | SKY | Defined | Save/Sync | Founder | Tech |
| CAP-EBUX-002 | Eligibility Engine | Learning | CORE FOUNDATION | Route | ONB/LRN | Specified | Graph | Founder | 1B |
| CAP-EBUX-003 | Entitlements | Trust (enabling commercial) | CORE FOUNDATION + CONTROLLED LAUNCH | Commercial | PAY | Specified | Plans/Merit | Founder | 1B |
| CAP-EBUX-004 | Recommendations | Learning | CONTROLLED LAUNCH (basic) | Skyboard | SKY | Defined | Optional AI later | Founder | Tech |
| CAP-EBUX-005 | Engagement recovery | Learning | CONTROLLED LAUNCH | Return | SKY | Defined | — | Founder | 1B |
| CAP-EBUX-006 | Save and Sync | Learning | CORE FOUNDATION + CONTROLLED LAUNCH | Missions/Return | LRN | Defined | Tech val | Founder | Tech |
| CAP-EBUX-007 | Adaptive Skyboard | Learning | CONTROLLED LAUNCH | Skyboard | SKY | Specified | — | Founder | 1B |
| CAP-EBUX-008 | World Map | Learning | CONTROLLED LAUNCH | Horizon | WLD | Defined | — | Founder | 1B |
| CAP-EBUX-009 | Explainable Locks | Trust / Learning | CORE FOUNDATION + CONTROLLED LAUNCH | Activate / All | **ACT-003 · ACT-011 · ACT-012** + lock surfaces | **Specified** | [EXPLAINABLE-LOCKS.md](./interactions/EXPLAINABLE-LOCKS.md) | Founder | BC.1 |

## Community and Live

| ID | Name | Pillar | Scope status | Journey | Screens | Maturity | Deps | Owner | Gate |
|----|------|--------|--------------|---------|---------|----------|------|-------|------|
| CAP-SOC-001 | The Rookery | Community | CONTROLLED LAUNCH | Community | COM | Defined | Moderation | Founder | Community |
| CAP-SOC-002 | Route spaces | Community | CONTROLLED LAUNCH | Community | COM | Defined | — | Founder | Community |
| CAP-SOC-003 | Teams | Community | CONTROLLED LAUNCH | Community | COM | Defined | Mobile rules | Founder | Community |
| CAP-SOC-004 | Repository spaces | Community | CONTROLLED LAUNCH | Community | COM | Defined | One controlled | Founder | Community |
| CAP-SOC-005 | Live Sky | Community | CONTROLLED LAUNCH | Live | LIV | Defined | Realtime | Founder | Tech |
| CAP-SOC-006 | Spectate | Community | CONTROLLED LAUNCH | Live | LIV | Defined | Scale | Founder | Tech |
| CAP-SOC-007 | Moderation | Trust | CONTROLLED LAUNCH | Community/Ops | COM/ADM | Defined | Staffing | Founder | Community |
| CAP-SOC-008 | Appeals | Trust | CONTROLLED LAUNCH | Trust | TRU | Defined | — | Founder | Community |
| CAP-SOC-009 | Unrestricted DMs | Community | OUT OF SCOPE | — | — | Rejected at launch | — | Founder | 1B |

## Commercial

| ID | Name | Pillar | Scope status | Journey | Screens | Maturity | Deps | Owner | Gate |
|----|------|--------|--------------|---------|---------|----------|------|-------|------|
| CAP-PAY-001 | Access Plans | Trust (enabling commercial) | CORE FOUNDATION + CONTROLLED LAUNCH | Commercial | PAY | Specified | — | Founder | 1B |
| CAP-PAY-002 | Prices | Trust (enabling commercial) | CONTROLLED LAUNCH | Commercial | PAY | Specified | VAT Ext | Founder | Ext |
| CAP-PAY-003 | Subscriptions | Trust (enabling commercial) | CONTROLLED LAUNCH | Commercial | PAY | Defined | Provider | Founder | Tech |
| CAP-PAY-004 | Payments | Trust (enabling commercial) | PENDING TECHNICAL VALIDATION | Commercial | PAY | Pending Validation | Provider | Founder | Tech |
| CAP-PAY-005 | Merit Access | Opportunity / Trust | CONTROLLED LAUNCH | Commercial | PAY | Specified | Criteria pending | Founder | 1B |
| CAP-PAY-006 | Scholarships | Opportunity | POST-LAUNCH PLANNED | Commercial | PAY | Defined | Partners | Founder | Later |
| CAP-PAY-007 | Refunds | Trust (enabling commercial) | CONDITIONAL (legal wording) | Commercial | PAY | Defined | Ext legal | Founder | Ext |
| CAP-PAY-008 | Invoices | Trust (enabling commercial) | PENDING EXTERNAL VALIDATION | Commercial | PAY | Pending Validation | VAT/e-invoice | Founder | Ext |
| CAP-PAY-009 | Reconciliation | Trust (enabling commercial) | CONTROLLED LAUNCH | Ops | ADM | Defined | Provider | Founder | Ops |

## Platform and Trust

| ID | Name | Pillar | Scope status | Journey | Screens | Maturity | Deps | Owner | Gate |
|----|------|--------|--------------|---------|---------|----------|------|-------|------|
| CAP-TRU-001 | Authentication | Trust | CORE FOUNDATION + CONTROLLED LAUNCH | Activate/Return | ACT/TRU | Specified | ADR-013/014 · IdP deferred with adapter | Founder | ARCH.1C |
| CAP-TRU-002 | Authorization | Trust | CORE FOUNDATION | All | — | Specified | ADR-015 deny-by-default | Founder | ARCH.1C |
| CAP-TRU-003 | Account assurance | Trust | CORE FOUNDATION + CONTROLLED LAUNCH | Activate | TRU | Specified | IDENTITY-ASSURANCE-ARCHITECTURE | Founder | ARCH.1C |
| CAP-TRU-004 | Privacy | Trust | CORE FOUNDATION + CONTROLLED LAUNCH | Account | TRU | Specified | Classification · minor ADR-023 · PDPL Ext pending | Founder | ARCH.1C |
| CAP-TRU-005 | Security / audit | Trust | CORE FOUNDATION + CONTROLLED LAUNCH | Ops | ADM | Specified | ADR-022 · SPK-ARC-019 · pen-test pending | Founder | ARCH.1C |
| CAP-TRU-006 | Regional policy | Trust | CORE FOUNDATION | Ops | ADM | Defined | SAUDI readiness · OFFICIAL ACCESS NOT VERIFIED | Founder | ARCH.1C |
| CAP-TRU-007 | Object storage | Trust | CONTROLLED LAUNCH | Evidence | LRN | Specified | ADR-020 S3 adapter locked · provider deferred | Founder | ARCH.1C |
| CAP-TRU-008 | Realtime | Community | CONTROLLED LAUNCH | Live | LIV | Specified | ADR-030 adapter · provider deferred | Founder | ARCH.1D |
| CAP-TRU-009 | Observability | Trust | CORE FOUNDATION + CONTROLLED LAUNCH | Ops | ADM | Specified | ADR-034 · provider conditional | Founder | ARCH.1D |
| CAP-TRU-010 | Backup and recovery | Trust | CORE FOUNDATION + CONTROLLED LAUNCH | Ops | — | Specified | ADR-035 operational conditions | Founder | ARCH.1D |
| CAP-TRU-011 | Localization RTL/LTR | Trust | CONTROLLED LAUNCH | All | — | Specified | ADR-025 · SPK-002 | Founder | ARCH.1D |
| CAP-TRU-012 | Accessibility | Trust | CONTROLLED LAUNCH | All | — | Specified | ADR-026 · user validation pending | Founder | ARCH.1D |
| CAP-TRU-013 | Administration | Trust | CONTROLLED LAUNCH | Ops | ADM | Defined | — | Founder | 1B |
| CAP-TRU-014 | Preview DB readiness | Trust | PENDING TECHNICAL VALIDATION | Ops | — | Not Built | TECH-018 | Founder | 1B/Arch |

### Review notes (1B / 1C)

- No Capability lacks a Pillar (commercial items map to Trust as enabling commercial; GOV maps to All / Identity as appropriate).
- CAP-SOC-009 records OUT OF SCOPE DMs explicitly (not a silent omission).
- CAP-LRN-009 added for launch catalogue selection pending LEARNING.1.
- CAP-TRU-014 tracks Preview DB gap without implying Product Code.
- Breadth / Prestige / Titles: CONTROLLED LAUNCH surface · POST-LAUNCH PLANNED depth (no custom Scope vocabulary).
- PD.3: Controlled-launch user-facing Capabilities map to wireframe families via [WIREFRAME-REGISTRY.md](./wireframes/WIREFRAME-REGISTRY.md) and flows in [CRITICAL-FLOWS.md](./interactions/CRITICAL-FLOWS.md).
- LEARNING.1A: Nest, Horizons, Route selection research, Cross-Wing, Secure Extensions, Evidence, capstones, content lifecycle → [product/learning/](./learning/README.md). Catalogue **LOCKED AS DESIGN BASELINE v1.0.0**.
- PROGRESSION.1C: Synthetic calibration COMPLETE · CALIBRATION RECOMMENDED · PENDING 1D · NOT production calibrated · red-team **20/20 PASS** · multi-seed **25k** · see [calibration/](./progression/calibration/).
- BASELINE-CORRECTION.1: CAP-ONB-003 matured; CAP-ONB-011/012/013 + CAP-EBUX-009 map Pending / Result / Recovery / Explainable Locks to ACT-003 · ACT-011 · ACT-012. No Product Code.
- CR-002: CAP-ONB-014 Account risk acceptance → **ACT-013**; CAP-ONB-004 exit → ACT-013; alias-safe 92 (ACT-004 appendix only).
- ARCHITECTURE.1B: Core Platform Stack Baseline v1.0.0 **ACTIVE** · ADR-ARC-001..012 **ACCEPTED** (some WITH CONDITIONS) · P0 spikes **6/6 PASS** · **Technical Validation PARTIAL** · **Product Code BLOCKED**. See [PLATFORM-STACK-BASELINE.md](../architecture/ghuravia/governance/PLATFORM-STACK-BASELINE.md) · [TECHNICAL-VALIDATION-TRACEABILITY.md](../architecture/ghuravia/governance/TECHNICAL-VALIDATION-TRACEABILITY.md) · [TECHNICAL-SPIKE-REGISTRY.md](../architecture/ghuravia/validation/TECHNICAL-SPIKE-REGISTRY.md).
- ARCHITECTURE.1E: Architecture Design Baseline v1.0.0 **LOCKED AS GOVERNED ARCHITECTURE DESIGN BASELINE** · capabilities remain **NOT IMPLEMENTED** · Product Code **BLOCKED** · Implementation **NOT GRANTED**. See [GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md](../architecture/ghuravia/governance/GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md).
- VALIDATION.1A: External Technical Validation Baseline v0.1.0 **PARTIAL** · live provider/Preview proof **NOT AVAILABLE** for most domains · capabilities remain **NOT IMPLEMENTED** · Product Code **BLOCKED** · Implementation Authorization **NOT GRANTED**. See [EXTERNAL-TECHNICAL-VALIDATION-BASELINE.md](../validation/ghuravia/external-1a/governance/EXTERNAL-TECHNICAL-VALIDATION-BASELINE.md).
- VALIDATION.1B: Implementation-entry validation **PASS** · local readiness **READY WITH CONDITIONS** · capabilities remain **NOT IMPLEMENTED** · Preview / controlled launch **NOT READY** · Product Code **BLOCKED** pending GHV.IMPLEMENTATION.0A. See [GHV.VALIDATION.1B.md](../governance/gates/GHV.VALIDATION.1B.md).
- IMPLEMENTATION.0A: Product Code is authorized only for the completed foundation bootstrap; the capability inventory, scope classifications, and **92 ACTIVE / 7 shells** baseline are unchanged. Preview and Production remain prohibited. See [GHV.IMPLEMENTATION.0A.md](../governance/gates/GHV.IMPLEMENTATION.0A.md).
- IMPLEMENTATION.0B: Local activation vertical slice implemented for ACT-003/011/005/013/012/006 under GHV-IMP-AUTH-002; formula excludes mobile; inventory count unchanged; Preview/Production still prohibited. See [GHV.IMPLEMENTATION.0B.md](../governance/gates/GHV.IMPLEMENTATION.0B.md).
- IMPLEMENTATION.0C: Activation UX hardened (Arabic-first shell, localization, route guards, a11y automation); thin ACT-007 + ONB-001 handoff only under GHV-IMP-AUTH-003; full onboarding deferred to 0D. See [GHV.IMPLEMENTATION.0C.md](../governance/gates/GHV.IMPLEMENTATION.0C.md).
- IMPLEMENTATION.0D / 0D-CLOSURE-01: Crow personalization, Origin setup, and Nest Intro handoff vertical slice under GHV-IMP-AUTH-004; Baseline v0.4.0 ACTIVE WITH CONDITIONS; Nest assessment / Horizon / Route remain deferred to 0E+. See [GHV.IMPLEMENTATION.0D.md](../governance/gates/GHV.IMPLEMENTATION.0D.md) · [GHV.IMPLEMENTATION.0D-CLOSURE-01.md](../governance/gates/GHV.IMPLEMENTATION.0D-CLOSURE-01.md) · [GHURAVIA-PERSONALIZATION-ORIGIN-BASELINE.md](../governance/implementation/GHURAVIA-PERSONALIZATION-ORIGIN-BASELINE.md).
- IMPLEMENTATION.0E: Nest Intro full, Nest Assessment (synthetic fixture), Nest Result, ONB-006/007 handoffs under GHV-IMP-AUTH-005; Baseline v0.5.0 ACTIVE WITH CONDITIONS; no earned identity. See [GHV.IMPLEMENTATION.0E.md](../governance/gates/GHV.IMPLEMENTATION.0E.md) · [GHURAVIA-NEST-READINESS-BASELINE.md](../governance/implementation/GHURAVIA-NEST-READINESS-BASELINE.md).
- CROW-IDENTITY.1A: Crow Identity System admitted as governed **candidate** domain (Intake Baseline v0.1.1 after Amendment-01); five Horizons reconfirmed; 25 Core meanings admitted as candidate foundation; **no** runtime authority; Prestige names remain Ascendant/Apex/Obsidian; Trust public visuals prohibited. See [GHV.CROW-IDENTITY.1A.md](../governance/gates/GHV.CROW-IDENTITY.1A.md) · [product/identity/crow-system/](./identity/crow-system/).
- CROW-IDENTITY.1B: Core Crow Lineage Taxonomy Baseline v1.0.0 **LOCKED** (design); formal noun + CRW-* IDs + 25 registry + Nest vocabulary contract; Arabic CONTROLLED PROVISIONAL; Evolved Roles deferred; **0E Nest/readiness hold released** (no earned identity award). See [GHV.CROW-IDENTITY.1B.md](../governance/gates/GHV.CROW-IDENTITY.1B.md) · [GHURAVIA-CORE-CROW-LINEAGE-TAXONOMY-BASELINE.md](./identity/crow-system/governance/GHURAVIA-CORE-CROW-LINEAGE-TAXONOMY-BASELINE.md).
- CROW-IDENTITY.1C: Crow Identity Lifecycle Baseline v1.0.0 **LOCKED** (design); Chosen/Suggested/Earned; Evidence-before-Mastery; privacy/projection; symbol authorization; collision handoff grammar; Cross-Wing eligibility only; **no runtime**. See [GHV.CROW-IDENTITY.1C.md](../governance/gates/GHV.CROW-IDENTITY.1C.md) · [GHURAVIA-CROW-IDENTITY-LIFECYCLE-BASELINE.md](./identity/crow-system/governance/GHURAVIA-CROW-IDENTITY-LIFECYCLE-BASELINE.md).
- CROW-IDENTITY.1D: Crow Visual and Motion Identity Baseline v1.0.0 **LOCKED** (design); five Mother Forms; 25 Lineage visuals/Marks; 60 visual collisions closed; lifecycle visual grammar; symbol/Wingprint separation; motion + reduced-motion; REFERENCE LOCKED SVG plates; **no runtime**. See [GHV.CROW-IDENTITY.1D.md](../governance/gates/GHV.CROW-IDENTITY.1D.md) · [GHURAVIA-CROW-VISUAL-AND-MOTION-BASELINE.md](./identity/crow-system/visual/governance/GHURAVIA-CROW-VISUAL-AND-MOTION-BASELINE.md).
- CROW-IDENTITY.1E: Founder visual directions **SELECTED** for five Horizon Mother Forms (Operate MF-O-B · Build MF-B-A v0.2 · Analyze MF-A-A · Protect MF-P-A · Lead MF-L-B); Analyze Lens Wing v2 lock preserved; binaries LOCAL_ONLY_NO_COMMIT; **no runtime**. See [GHV.CROW-IDENTITY.1E.md](../governance/gates/GHV.CROW-IDENTITY.1E.md) · [SELECTED-MOTHER-FORM-MANIFEST.md](./identity/crow-system/visual/comparison/1E/founder-review/SELECTED-MOTHER-FORM-MANIFEST.md).
- CROW-IDENTITY.1F: Founder Operate Lineage directions **SELECTED** (CRW-OPR-01 A · CRW-OPR-02 C · CRW-OPR-03 C · CRW-OPR-04 A · CRW-OPR-05 B) under locked MF-O-B; family collision PASS_WITH_MINOR_RISK; binaries LOCAL_ONLY_NO_COMMIT; Core Lineages **5/25**; remaining 20 not generated; **no runtime**. See [GHV.CROW-IDENTITY.1F.md](../governance/gates/GHV.CROW-IDENTITY.1F.md) · [SELECTED-OPERATE-LINEAGE-MANIFEST.md](./identity/crow-system/visual/development/1F/founder-review/SELECTED-OPERATE-LINEAGE-MANIFEST.md).

## Activation capability trace (BC.1 / CR-002)

| Capability | Pillar | User type | Journey | Screen | Flow | State | Wireframe | Validation dependency |
|------------|--------|-----------|---------|--------|------|-------|-----------|------------------------|
| CAP-ONB-003 | Trust | Learner | Activate | ACT-003 · ACT-011 | FLOW-001 | Pending / Result outcomes | ACTIVATION-WIREFRAMES | TECH-003 · EXT legal (email) · usability NOT RUN |
| CAP-ONB-004 | Trust | Learner | Activate | ACT-005 | FLOW-001 | Terms accepted | ACTIVATION-WIREFRAMES | Legal copy · Ext |
| CAP-ONB-011 | Trust | Learner | Activate | ACT-011 | FLOW-001 result/expiry/resend | VERIFIED…RISK_REVIEW_REQUIRED | ACTIVATION-WIREFRAMES | Same; tech NOT RUN |
| CAP-ONB-012 | Trust | Learner | Activate | ACT-012 | FLOW-001-REC / INT | Interrupted / resume | ACTIVATION-WIREFRAMES | Tech NOT RUN |
| CAP-ONB-013 | Trust | Learner / Support | Activate | ACT-012 | Support escalate | Help available | ACTIVATION-WIREFRAMES | Ops staffing |
| CAP-ONB-014 | Trust | Learner | Activate | **ACT-013** | FLOW-001 / FLOW-001-DONE | `account_risk_status = acceptable` | ACTIVATION-WIREFRAMES · GHV-WF-ACT-013 | Risk policy · CR-002 |
| CAP-EBUX-009 | Trust | Learner | Activate+ | ACT-003/011/012/013 + locks | Explainable Lock sheets | Assurance / incomplete | EXPLAINABLE-LOCKS | Usability NOT RUN |
