# Capability Registry

| Field | Value |
|-------|-------|
| **Status** | LOCKED inventory · reviewed GHV.LEARNING.1C |
| **Version** | 1.5.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.LEARNING.1C |
| **Related** | [SCOPE-BASELINE.md](../governance/scope/SCOPE-BASELINE.md) · [MISSION-BLUEPRINT-REGISTRY.md](./learning/missions/MISSION-BLUEPRINT-REGISTRY.md) · [LAUNCH-GRAPH-REGISTRY.md](./learning/graph/LAUNCH-GRAPH-REGISTRY.md) · [WIREFRAME-REGISTRY.md](./wireframes/WIREFRAME-REGISTRY.md) |

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
| CAP-ONB-002 | Registration | Identity | CONTROLLED LAUNCH | Activate | ACT | Defined | IdP | Founder | Tech |
| CAP-ONB-003 | Email verification | Trust | CONTROLLED LAUNCH | Activate | ACT | Defined | Email | Founder | Tech |
| CAP-ONB-004 | Terms acceptance | Trust | CONTROLLED LAUNCH | Activate | ACT | Defined | Legal copy | Founder | Ext |
| CAP-ONB-005 | Optional mobile verification | Trust | CONTROLLED LAUNCH | Activate | ACT | Defined | SMS | Founder | Tech |
| CAP-ONB-006 | Crow personalization | Identity | CONTROLLED LAUNCH | Personalize | IDN | Defined | — | Founder | 1B |
| CAP-ONB-007 | Origin | Identity | CONTROLLED LAUNCH | Origin | ONB | Defined | — | Founder | 1B |
| CAP-ONB-008 | The Nest | Learning | CONTROLLED LAUNCH | Nest | ONB/LRN | Specified | Content | Founder | Learning |
| CAP-ONB-009 | Horizon and Route selection | Learning | CONTROLLED LAUNCH | Horizon/Route | ONB/WLD | Specified | Catalogue | Founder | Learning |
| CAP-ONB-010 | Flight Plan | Learning | CONTROLLED LAUNCH | Flight Plan | ONB/WLD | Defined | Entitlement | Founder | 1B |

## Learning

| ID | Name | Pillar | Scope status | Journey | Screens | Maturity | Deps | Owner | Gate |
|----|------|--------|--------------|---------|---------|----------|------|-------|------|
| CAP-LRN-001 | World taxonomy | Learning | CORE FOUNDATION | World | WLD | Specified | — | Founder | 1B |
| CAP-LRN-002 | Learning Graph | Learning | CORE FOUNDATION | Route | WLD/LRN | Specified | Graph perf; conceptual registry 1B | Founder | Tech |
| CAP-LRN-003 | Missions | Learning | CONTROLLED LAUNCH | Missions | LRN | Specified | **87** Mission Blueprints (1C); content production pending | Founder | Learning |
| CAP-LRN-004 | Assessments | Evidence | CONTROLLED LAUNCH | Missions | LRN | Specified | **33** assessment anchors; numeric thresholds → PROGRESSION.1 | Founder | Learning |
| CAP-LRN-005 | Evidence | Evidence | CONTROLLED LAUNCH | Evidence | LRN/LOG | Specified | 24 anchors + rubrics + safe handling | Founder | Tech |
| CAP-LRN-006 | Cross-Wing | Learning | CONTROLLED LAUNCH | Learning | LRN | Specified | CXW Missions + INT-01 + Capstone | Founder | Learning |
| CAP-LRN-007 | Secure Extensions | Trust/Learning | CONTROLLED LAUNCH | Learning | LRN | Specified | SEX Missions + Capstone | Founder | Learning |
| CAP-LRN-008 | Content lifecycle | Learning | CORE FOUNDATION | Ops | ADM | Specified | Production handoff + pilot requirements | Founder | Ops |
| CAP-LRN-009 | Launch catalogue selection | Learning | PENDING TECHNICAL VALIDATION | Route | WLD | Specified | Architectures + blueprints; lock in 1D | Founder | Learning |
| CAP-LRN-010 | Route architectures (P0) | Learning | CONTROLLED LAUNCH | Route | WLD/LRN | Specified | RT-OPR/BLD/PRT/LED-001 | Founder | Learning |
| CAP-LRN-011 | ANALYZE Route reserve | Learning | CONDITIONAL | Route | WLD | Specified | RT-ANL-001 capacity conditional | Founder | Learning |
| CAP-LRN-012 | Shared learning capabilities | Learning | CORE FOUNDATION | Missions | LRN | Specified | SHC-001..012 | Founder | Learning |
| CAP-LRN-013 | Nest capability registry | Learning | CORE FOUNDATION | Nest | ONB/LRN | Specified | NST-CAP-001..013; thresholds unchanged | Founder | Learning |
| CAP-LRN-014 | Route-Proven (qualitative) | Evidence | CONTROLLED LAUNCH | Evidence/Wings | PRG/LRN | Specified | Traceability 1C; numeric → PROGRESSION.1 | Founder | Learning |
| CAP-LRN-015 | Horizon-Proven model | Evidence | POST-LAUNCH PLANNED (award) | Progression | PRG | Defined | Awarding deferred at limited catalogue | Founder | Learning |
| CAP-LRN-016 | AppSec Bridge | Learning | CONTROLLED LAUNCH | Learning | LRN | Specified | BRG-PRT-BLD-01 (4 Missions) | Founder | Learning |
| CAP-LRN-017 | Capstone blueprints | Evidence | CONTROLLED LAUNCH | Evidence | LRN | Specified | 7 Capstone blueprints | Founder | Learning |
| CAP-LRN-018 | Learning integrity / AI policy | Trust | CORE FOUNDATION | Missions | LRN | Specified | AI + integrity models | Founder | Learning |
| CAP-LRN-019 | Team / Live Sky learning | Community | CONTROLLED LAUNCH (surface) | Live | LIV | Defined | LIV-MSN-001 blueprint; tech pending | Founder | Learning |

## Progression

| ID | Name | Pillar | Scope status | Journey | Screens | Maturity | Deps | Owner | Gate |
|----|------|--------|--------------|---------|---------|----------|------|-------|------|
| CAP-PRG-001 | Flight XP | Identity | CONTROLLED LAUNCH | Progression | PRG | Defined | Formulas | Founder | PROGRESSION.1 |
| CAP-PRG-002 | Momentum | Identity | CONTROLLED LAUNCH | Progression | PRG | Defined | Formulas | Founder | PROGRESSION.1 |
| CAP-PRG-003 | Maturity Rank | Identity | CONTROLLED LAUNCH | Progression | PRG | Defined | Formulas | Founder | PROGRESSION.1 |
| CAP-PRG-004 | Route Mastery | Evidence | CONTROLLED LAUNCH | Evidence/Wings | PRG/LRN | Defined | Evidence | Founder | PROGRESSION.1 |
| CAP-PRG-005 | Breadth | Identity | CONTROLLED LAUNCH (surface) · POST-LAUNCH PLANNED (depth) | Progression | PRG | Defined | Formulas | Founder | PROGRESSION.1 |
| CAP-PRG-006 | Trust Standing | Trust | CONTROLLED LAUNCH | Community | COM/PRG | Defined | Moderation | Founder | Community |
| CAP-PRG-007 | Professional Titles | Opportunity | CONTROLLED LAUNCH (surface) · POST-LAUNCH PLANNED (depth) | Progression | PRG | Defined | Definitions | Founder | PROGRESSION.1 |
| CAP-PRG-008 | Prestige Classes | Identity | CONTROLLED LAUNCH (surface) · POST-LAUNCH PLANNED (depth) | Progression | PRG | Defined | Formulas | Founder | PROGRESSION.1 |
| CAP-PRG-009 | Crests / Achievements | Identity | CONTROLLED LAUNCH | Wings | IDN/PRG | Defined | — | Founder | 1B |
| CAP-PRG-010 | Limited Leaderboards | Community | CONTROLLED LAUNCH | Progression | PRG | Defined | Trust rules | Founder | 1B |

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
| CAP-TRU-001 | Authentication | Trust | CORE FOUNDATION + CONTROLLED LAUNCH | Activate/Return | ACT/TRU | Pending Validation | IdP | Founder | Tech |
| CAP-TRU-002 | Authorization | Trust | CORE FOUNDATION | All | — | Specified | — | Founder | 1B |
| CAP-TRU-003 | Account assurance | Trust | CORE FOUNDATION + CONTROLLED LAUNCH | Activate | TRU | Specified | — | Founder | 1B |
| CAP-TRU-004 | Privacy | Trust | CORE FOUNDATION + CONTROLLED LAUNCH | Account | TRU | Pending Validation | PDPL Ext | Founder | Ext |
| CAP-TRU-005 | Security / audit | Trust | CORE FOUNDATION + CONTROLLED LAUNCH | Ops | ADM | Defined | — | Founder | Sec |
| CAP-TRU-006 | Regional policy | Trust | CORE FOUNDATION | Ops | ADM | Defined | — | Founder | 1B |
| CAP-TRU-007 | Object storage | Trust | CONTROLLED LAUNCH | Evidence | LRN | Pending Validation | Tech | Founder | Tech |
| CAP-TRU-008 | Realtime | Community | CONTROLLED LAUNCH | Live | LIV | Pending Validation | Tech | Founder | Tech |
| CAP-TRU-009 | Observability | Trust | CORE FOUNDATION + CONTROLLED LAUNCH | Ops | ADM | Pending Validation | Tech | Founder | Tech |
| CAP-TRU-010 | Backup and recovery | Trust | CORE FOUNDATION + CONTROLLED LAUNCH | Ops | — | Pending Validation | Tech | Founder | Tech |
| CAP-TRU-011 | Localization RTL/LTR | Trust | CONTROLLED LAUNCH | All | — | Defined | — | Founder | 1B |
| CAP-TRU-012 | Accessibility | Trust | CONTROLLED LAUNCH | All | — | Defined | — | Founder | 1B |
| CAP-TRU-013 | Administration | Trust | CONTROLLED LAUNCH | Ops | ADM | Defined | — | Founder | 1B |
| CAP-TRU-014 | Preview DB readiness | Trust | PENDING TECHNICAL VALIDATION | Ops | — | Not Built | TECH-018 | Founder | 1B/Arch |

### Review notes (1B)

- No Capability lacks a Pillar (commercial items map to Trust as enabling commercial; GOV maps to All / Identity as appropriate).
- CAP-SOC-009 records OUT OF SCOPE DMs explicitly (not a silent omission).
- CAP-LRN-009 added for launch catalogue selection pending LEARNING.1.
- CAP-TRU-014 tracks Preview DB gap without implying Product Code.
- Breadth / Prestige / Titles: CONTROLLED LAUNCH surface · POST-LAUNCH PLANNED depth (no custom Scope vocabulary).
- PD.3: Controlled-launch user-facing Capabilities map to wireframe families via [WIREFRAME-REGISTRY.md](./wireframes/WIREFRAME-REGISTRY.md) and flows in [CRITICAL-FLOWS.md](./interactions/CRITICAL-FLOWS.md).
- LEARNING.1A: Nest, Horizons, Route selection research, Cross-Wing, Secure Extensions, Evidence, capstones, content lifecycle → [product/learning/](./learning/README.md). Catalogue **RECOMMENDED — NOT YET LOCKED**.
