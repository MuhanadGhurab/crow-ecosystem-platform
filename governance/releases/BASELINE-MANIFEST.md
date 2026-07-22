# Baseline Manifest

| Field | Value |
|-------|-------|
| **Status** | ACTIVE |
| **Version** | 1.24.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.IMPLEMENTATION.0A-CLOSURE-01-AMENDMENT-01 |

## Active baseline set

| Input | Status |
|-------|--------|
| GHURAVIA Product Constitution v1.0 | **ACTIVE — LOCKED** |
| GHURAVIA Scope Baseline v1.0 | **ACTIVE — LOCKED** |
| Interaction Grammar / Wireframes | **ACTIVE — LOCKED AT LOW FIDELITY** (amended for alias-safe 92 screens) |
| **GHURAVIA Master Screen Registry Baseline v1.2.0** | **ACTIVE — CORRECTED AND LOCKED** · **7 shells · 92 ACTIVE · 0 aliases in inventory** · Source Gate **GHV.BASELINE-CORRECTION.1** · CR-001 · **CR-002** · DEC-152 · **DEC-153** · PD.2 Amendment-01/02 |
| **GHURAVIA Learning Design Baseline v1.0.0** | **ACTIVE — LOCKED AS DESIGN BASELINE** (unchanged by Progression 1A–1D and BASELINE-CORRECTION.1) |
| **GHURAVIA Progression Design Baseline v1.0.0** | **ACTIVE — LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE** (unchanged by BASELINE-CORRECTION.1) |
| GHURAVIA Progression Architecture Baseline v1.0.0 | **LOCKED AS DESIGN BASELINE** (absorbed into Progression Design Baseline v1.0.0) |
| GHURAVIA Progression Formula Simulation Baseline v0.1.0 | **HISTORICAL** — evidence retained under 1B |
| GHURAVIA Progression Internal Calibration Baseline v0.2.0 | **SUPERSEDED INTO Progression Design Baseline v1.0.0** — synthetic calibration evidence retained; **NOT** production calibrated |
| Route-Proven Traceability | **ACTIVE — LOCKED AT QUALITATIVE DESIGN LEVEL** (+ numeric floors under Progression Design Baseline) |
| Horizon-Proven | **FOUNDATION MODEL LOCKED — AWARDING DEFERRED** |
| RT-ANL-001 | **LOCKED AS RESERVE DESIGN BASELINE — NOT A LAUNCH COMMITMENT** |
| Expert Review | **NOT RUN** |
| Learning Pilot | **NOT RUN** |
| Real-User Progression Calibration | **NOT RUN** |
| Usability Validation | **NOT RUN** |
| Technical Validation | **PARTIAL — ALL REGISTERED SPIKES COMPLETE · EXTERNAL VALIDATION BASELINE v0.1.0 PARTIAL** |
| **GHURAVIA External Technical Validation Baseline v0.1.0** | **ACTIVE — PARTIAL** · most domains NOT AVAILABLE · Preview NOT ESTABLISHED · TECH-018 OPEN · **historical as-of VALIDATION.1A: Product Code BLOCKED** · Source Gate **GHV.VALIDATION.1A** (**PARTIAL**) |
| **GHURAVIA Implementation Entry Validation Baseline v0.1.0** | **READY WITH CONDITIONS** · Architecture Design **LOCKED v1.0.0** · External Technical Validation **PARTIAL** · Local Implementation Readiness **READY WITH CONDITIONS** · Preview Readiness **NOT READY** · Controlled Launch Readiness **NOT READY** · **historical as-of VALIDATION.1B close: Product Code BLOCKED · Implementation Authorization NOT GRANTED** · Source Gate **GHV.VALIDATION.1B** (**PASS — COMPLETE**) |
| **GHURAVIA Product Code Bootstrap Baseline v0.1.0** | **ACTIVE — LIMITED FOUNDATION PRODUCT CODE AUTHORIZED AND CREATED** · GHV-IMP-AUTH-001 · `apps/` / `packages/` / `workers/` / `scripts/` · local CI PASS · disposable-PostgreSQL migration/reset PASS · mocks only · Preview/Staging blocked · Production not authorized · **Remote CI: VERIFIED** (Actions `29872538651`) · Source Gate **GHV.IMPLEMENTATION.0A** (**PASS**) · Closure **GHV.IMPLEMENTATION.0A-CLOSURE-01** (**PARTIAL — GHURAVIA IMPLEMENTATION 0A CI CLOSURE COMPLETED WITH NON-BLOCKING DEPENDENCY CONDITIONS**) · Amended by **GHV.IMPLEMENTATION.0A-CLOSURE-01-AMENDMENT-01** (**PASS**) · **0B ELIGIBLE TO START · NOT STARTED** |

### Current Product Code and launch dimensions (authoritative)

```text
Product Code:
AUTHORIZED ONLY FOR COMPLETED GHV.IMPLEMENTATION.0A
FOUNDATION BOOTSTRAP SCOPE

Broader Product Code:
REQUIRES LATER IMPLEMENTATION GATES

Preview:
BLOCKED

Controlled Launch:
NOT READY

Production:
NOT AUTHORIZED

Remote CI:
VERIFIED

Closure:
PARTIAL — NON-BLOCKING DEPENDENCY CONDITIONS RETAINED
```

### GHURAVIA Implementation Entry Validation Baseline v0.1.0 (historical at Gate close)

```text
Status: READY WITH CONDITIONS
Architecture Design: LOCKED v1.0.0
External Technical Validation: PARTIAL
Local Implementation Readiness: READY WITH CONDITIONS
Preview Readiness: NOT READY
Controlled Launch Readiness: NOT READY
Product Code: BLOCKED
Implementation Authorization: NOT GRANTED
```

```text
GHV.VALIDATION.1B:
COMPLETE — PASS

External provider and infrastructure validation:
REMAINS OPEN IN LATER VALIDATION / FEATURE / LAUNCH GATES
```

Source Gate: **GHV.VALIDATION.1B** (historical Product Code BLOCKED wording preserved above; superseded for current Product Code by IMPLEMENTATION.0A authorization)

| **GHURAVIA Core Technical Validation Plan v1.0.0** | **ACTIVE — VALIDATION PLAN LOCKED** · Amendment **GHV.ARCHITECTURE.1A-AMENDMENT-01** · Precondition correction **CR-002** · Source Gate **GHV.ARCHITECTURE.1A** (PASS — AMENDED) |
| **GHURAVIA Core Platform Architecture and Stack Baseline v1.0.0** | **ACTIVE — CORE PLATFORM DECISIONS ACCEPTED · DOMAIN VALIDATION CONTINUES** · ADR-ARC-001..012 **ACCEPTED** (some WITH CONDITIONS) · P0 spikes **6/6 PASS** · **Registered Architecture Spikes later completed 25/25** · historical note: P1–P3 open at 1B close · **historical as-of Gate: Product Code BLOCKED** · Source Gate **GHV.ARCHITECTURE.1B** (**PARTIAL** — restored by 1E-AMENDMENT-01) |
| **GHURAVIA Identity, Security, Data and Evidence Architecture Baseline v1.0.0** | **ACTIVE — DOMAIN ARCHITECTURE ACCEPTED** · Provider and Legal Conditions **OPEN** · Full Technical Validation **NOT COMPLETE** · **historical as-of Gate: Product Code BLOCKED** · ADR-ARC-013..023 · 1C spikes **6/6 PASS** · Source Gate **GHV.ARCHITECTURE.1C** (**PARTIAL**) |
| **GHURAVIA Runtime, Realtime, Integration and Operational Architecture Baseline v1.0.0** | **ACTIVE — DOMAIN ARCHITECTURE ACCEPTED** · External Infrastructure Validation **OPEN** · Full Technical Validation **NOT COMPLETE** · Final Architecture Lock **COMPLETED BY 1E** · **historical as-of Gate: Product Code BLOCKED** · ADR-ARC-024..038 · 1D spikes **13/13** · Source Gate **GHV.ARCHITECTURE.1D** (**PARTIAL**) |
| **GHURAVIA Architecture Design Baseline v1.0.0** | **ACTIVE — LOCKED AS GOVERNED ARCHITECTURE DESIGN BASELINE** · Registered Architecture Spikes **25 / 25 COMPLETE** · Internal Local Spike Evidence **COMPLETE** · External Technical Validation **NOT COMPLETE** · **historical as-of 1E lock: Product Code BLOCKED · Implementation Authorization NOT GRANTED** · ADR-ARC-001..038 · conflicting ADRs **0** · Source Gate **GHV.ARCHITECTURE.1E** (**PARTIAL**) |
| Publication | **BLOCKED** |
| Implementation | **LIMITED FOUNDATION RUNTIME + ACTIVATION SLICE + ACTIVATION UX HARDENING COMPLETE** — broader onboarding requires GHV.IMPLEMENTATION.0D |
| Product Code | **AUTHORIZED FOR COMPLETED 0A BOOTSTRAP + 0B ACTIVATION SLICE + 0C UX HARDENING ONLY** |
| Historical Master Screen Registry v1.0.0 (90) | **SUPERSEDED** — corrected by CR-001 |
| GHV.LEARNING.1A–1D | PASS |
| GHV.PROGRESSION.1A–1C | PASS |
| GHV.PROGRESSION.1D | **PASS** |
| GHV.BASELINE-CORRECTION.1 | **PASS** |
| GHV.ARCHITECTURE.1A | **PASS — AMENDED BY CR-002 PRECONDITION CORRECTION** |
| GHV.ARCHITECTURE.1B | **PARTIAL** — CORE STACK ACCEPTED WITH NON-BLOCKING CONDITIONS |
| GHV.ARCHITECTURE.1C | **PARTIAL** |
| GHV.ARCHITECTURE.1D | **PARTIAL** |
| GHV.ARCHITECTURE.1E | **PARTIAL — AMENDED FOR PREDECESSOR VERDICT PRESERVATION** |
| GHV.ARCHITECTURE.1E-AMENDMENT-01 | **PASS** |
| GHV.VALIDATION.1A | **PARTIAL** — external validation with implementation readiness conditions |
| GHV.VALIDATION.1B | **PASS — COMPLETE** — implementation entry validation complete |
| GHV.IMPLEMENTATION.0A | **PASS** — LIMITED PRODUCT CODE AUTHORIZED AND FOUNDATION BOOTSTRAPPED WITH CI VERIFIED · Remote CI **VERIFIED** |
| GHV.IMPLEMENTATION.0A-CLOSURE-01 | **PARTIAL** — GHURAVIA IMPLEMENTATION 0A CI CLOSURE COMPLETED WITH NON-BLOCKING DEPENDENCY CONDITIONS · **AMENDED FOR CLOSURE VERDICT PRESERVATION** |
| GHV.IMPLEMENTATION.0A-CLOSURE-01-AMENDMENT-01 | **PASS** — CLOSURE VERDICT AND STATUS REFERENCES RECONCILED |
| GHV.IMPLEMENTATION.0B | **PARTIAL** — FOUNDATION RUNTIME AND ACTIVATION VERTICAL SLICE COMPLETE WITH NON-BLOCKING MODERATE DEPENDENCY CONDITIONS · Baseline v0.2.0 · ADV-003 FIXED · amended by **0B-CLOSURE-01** |
| GHV.IMPLEMENTATION.0B-CLOSURE-01 | **PARTIAL** — HIGH DEPENDENCY ADVISORY SECURITY CLOSURE COMPLETE WITH NON-BLOCKING MODERATE DEPENDENCY CONDITIONS · Closure `65b4a54` Actions `29877518856` · Final docs HEAD `090b5dc` Actions `29877647176` **success** |
| GHV.IMPLEMENTATION.0C | **PARTIAL** — ACTIVATION UX, ACCESSIBILITY AND ONBOARDING ENTRY HARDENING COMPLETE WITH NON-BLOCKING VALIDATION CONDITIONS · Baseline v0.3.0 · GHV-IMP-AUTH-003 · CI `TBD-AFTER-PUSH` |
| GHV.IMPLEMENTATION.0D | **ELIGIBLE TO START · NOT STARTED** |
| GHV.PRODUCT-DEFINITION.2 | **PASS — AMENDED** |
| GHV.PRODUCT-DEFINITION.3 | **PASS — AMENDED** |

Authoritative learning portfolio: [LEARNING-PORTFOLIO-MANIFEST.md](../../product/learning/governance/LEARNING-PORTFOLIO-MANIFEST.md)

Authoritative progression design baseline: [PROGRESSION-BASELINE-MANIFEST.md](../../product/progression/governance/PROGRESSION-BASELINE-MANIFEST.md)

Authoritative architecture design baseline: [GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md](../../architecture/ghuravia/governance/GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md)

Authoritative external validation baseline: [EXTERNAL-TECHNICAL-VALIDATION-BASELINE.md](../../validation/ghuravia/external-1a/governance/EXTERNAL-TECHNICAL-VALIDATION-BASELINE.md)

Authoritative implementation-entry validation baseline: [IMPLEMENTATION-ENTRY-MINIMUM-CRITERIA.md](../../validation/ghuravia/external-1b/IMPLEMENTATION-ENTRY-MINIMUM-CRITERIA.md)

Authoritative master screen registry: [MASTER-SCREEN-REGISTRY.md](../../product/screens/MASTER-SCREEN-REGISTRY.md) · [SCREEN-BASELINE-FREEZE-POLICY.md](../corrections/SCREEN-BASELINE-FREEZE-POLICY.md)

Authoritative final formula versions: [FINAL-FORMULA-VERSION-REGISTRY.md](../../product/progression/governance/FINAL-FORMULA-VERSION-REGISTRY.md)

Authoritative formula registry (supporting): [PROGRESSION-FORMULA-REGISTRY.md](../../product/progression/formulas/PROGRESSION-FORMULA-REGISTRY.md)

Calibration package: [product/progression/calibration/](../../product/progression/calibration/)

Analytical simulation package (non-runtime): [analysis/progression-simulation/](../../analysis/progression-simulation/)

## Baseline status map

| Area | Category |
|------|----------|
| Pillars / Horizons / Nest thresholds | LOCKED |
| Learning Design Baseline | LOCKED AS DESIGN BASELINE |
| Progression Design Baseline | **LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE v1.0.0** |
| Progression formulas / thresholds / seasons | **LOCKED AS DESIGN BASELINE** (conditional locks: MOM-002 · TRU · PRS · POL-POP) |
| Progression simulation | COMPLETE (synthetic) · NOT real-user evidence |
| Progression calibration | **COMPLETE AT SYNTHETIC LEVEL** · NOT production calibrated |
| Final Progression Baseline | **LOCKED** (design) · real-user / tech still NOT RUN |
| Expert Review / Pilot | NOT RUN |
| Publication / broader implementation | BLOCKED pending later Gates |
| Product Code | **AUTHORIZED FOR COMPLETED 0A BOOTSTRAP + 0B ACTIVATION SLICE + 0C UX HARDENING ONLY** |
| Foundation Runtime / Activation Baseline | **ACTIVE v0.2.0** — LIMITED ACTIVATION VERTICAL SLICE |
| Activation UX / Onboarding Entry Baseline | **ACTIVE WITH CONDITIONS v0.3.0** |
| Screen count reconciliation | **COMPLETE** — BASELINE-CORRECTION.1 PASS · CR-002 alias-safe · 7/92 ACTIVE locked |
| Core Technical Validation Plan | **LOCKED** (plan) · **AMENDED** (Amendment-01 / CR-002) |
| Core Platform Stack Baseline | **ACTIVE v1.0.0** · core decisions **ACCEPTED** · domain validation **CONTINUES** |
| Identity / Security / Data / Evidence Baseline | **ACTIVE v1.0.0** · domain architecture **ACCEPTED** · providers/legal **OPEN** |
| P0 architecture spikes | **COMPLETE** (6/6 PASS) |
| 1C domain spikes | **COMPLETE** (6/6) |
| 1D runtime spikes | **COMPLETE** (13/13) |
| Registered spikes total | **25 / 25 COMPLETE** |
| External Technical Validation Baseline | **PARTIAL v0.1.0** |
| GHV.VALIDATION.1B | **COMPLETE — PASS** |
| External provider and infrastructure validation | **OPEN** in later validation / feature / launch Gates |
| Architecture Design Baseline | **LOCKED v1.0.0** · governed design · external validation **PARTIAL** |
| Final Architecture Lock | **COMPLETED BY 1E** · broader Product Code requires later Implementation Gates |
| TECH-018 Preview DB | PENDING TECHNICAL VALIDATION · SPK-ARC-021 P0 PASS does not close remediation |
| Preview | **BLOCKED** |
| Controlled Launch | **NOT READY** |
| Production | **NOT AUTHORIZED** |

## Explicit non-claims

```text
Formulas are NOT production calibrated
Real-user validation NOT RUN
Usability validation NOT RUN
Technical validation PARTIAL — all registered spikes complete; external validation NOT COMPLETE
Registered Architecture Spikes: 25 / 25 COMPLETE
External infrastructure and provider validation: OPEN
Architecture Design Baseline LOCKED — NOT external proof · NOT broader Product Code · NOT launch
Core platform stack ADRs ACCEPTED — domain validation continues
Identity/Evidence providers DEFERRED WITH ADAPTERS — not production-approved
Product Code: AUTHORIZED FOR COMPLETED GHV.IMPLEMENTATION.0A BOOTSTRAP + 0B ACTIVATION SLICE ONLY
Broader Product Code: REQUIRES LATER IMPLEMENTATION GATES (next: 0C)
Preview: BLOCKED
Controlled Launch: NOT READY
Production: NOT AUTHORIZED
Master Screen Registry Baseline CORRECTED AND LOCKED (7 / 92 ACTIVE · 0 aliases) — not fully implemented
Core Platform Stack Baseline ACTIVE — not production ready
Identity Security Data Evidence Baseline ACTIVE — not production ready
```
