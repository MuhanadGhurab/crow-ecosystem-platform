# Nest Dependency Map

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-NEST-DEP-001 |
| **Version** | 1.1.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1A · **GHV.LEARNING.1B** |
| **Last updated** | 2026-07-21 |
| **Review date** | Before GHV.LEARNING.1D |
| **Related** | [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.5 · [NEST-INTERACTION-FLOW.md](../../wireframes/onboarding/NEST-INTERACTION-FLOW.md) · [NEST-CAPABILITY-REGISTRY.md](./NEST-CAPABILITY-REGISTRY.md) · [NEST-TO-ROUTE-BRIDGE-MAP.md](./NEST-TO-ROUTE-BRIDGE-MAP.md) · [LEARNING-IDENTIFIER-STANDARD.md](../architecture/LEARNING-IDENTIFIER-STANDARD.md) · [LAUNCH-LEARNING-GRAPH-CONCEPT.md](../graph/LAUNCH-LEARNING-GRAPH-CONCEPT.md) |
| **Limitations** | Nest Mission catalogue content remains for 1C; no Product Codes; Routes **ARCHITECTURE RECOMMENDED — NOT LOCKED**; no employment or certification claims |
| **Unresolved** | Exact Nest Mission catalogue · Micro-Mission content packs · bilingual assessment item bank · GHV.PROGRESSION.1 interaction with Nest skip (no formula invented here) · GHV.LEARNING.1D catalogue lock |
| **Change history** | 1.0.0 (2026-07-21) — Initial RESEARCH BASELINE for GHV.LEARNING.1A · **1.1.0 (2026-07-21) — LEARNING.1B: canonical RT-* / NST-CAP-* IDs; Source Gate now also 1B; thresholds unchanged** |

## Purpose

Map Nest Digital Foundations capabilities to the launch portfolio so readiness bands, Micro-Missions, and Guided Skip behavior stay consistent with Scope — without redesigning Nest bands or inventing progression formulas.

**Source Gate note:** This map originated in GHV.LEARNING.1A research and is expanded under **GHV.LEARNING.1B** with canonical IDs. Nest thresholds remain locked.

## Nest readiness bands (LOCKED — do not redesign)

Authoritative source: [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.5.

| Result | Label | Rule (unchanged) |
|--------|-------|------------------|
| ≥ 70% | Ready to Fly | May skip Nest; weaknesses → recommended reviews; **no advanced Mastery from skip alone** |
| 50%–69% | Guided Skip | May continue; **Micro-Missions** inserted; **advanced Routes keep prerequisites** |
| < 50% | Nest Recommended | Nest recommended active journey; advanced gated content unavailable until Nest done or readiness ≥ 50%; public exploration allowed |

This document **does not** change thresholds, invent Mastery/Trust formulas, or redefine band labels.

```text
THRESHOLDS LOCKED: 70 / 50 — UNCHANGED
```

## Nest capability inventory (canonical — 1B)

Authoritative outcomes: [NEST-CAPABILITY-REGISTRY.md](./NEST-CAPABILITY-REGISTRY.md).

**Nest capability count = 13** (`NST-CAP-001` … `NST-CAP-013`). Freshness: **Stable Foundation**.

| Cap ID | Capability | What readiness looks like (observable) |
|--------|------------|----------------------------------------|
| **NST-CAP-001** | Devices / OS basics | Device vs account cues; settings literacy; safe updates |
| **NST-CAP-002** | Apps / permissions | Permission hygiene; restrict unused apps |
| **NST-CAP-003** | Browsers / search | Source evaluation; phishing UI awareness; search literacy |
| **NST-CAP-004** | Files / cloud | Local vs cloud; least-privilege sharing; avoid public exposure |
| **NST-CAP-005** | Accounts / passwords | Unique passwords; manager habit; session hygiene |
| **NST-CAP-006** | MFA | Enroll/use MFA; recovery-code hygiene; fatigue awareness |
| **NST-CAP-007** | Connectivity / Wi-Fi | Wi-Fi vs app failure triage; safe public Wi-Fi |
| **NST-CAP-008** | Privacy / footprint | Data minimization; sharing prompts; footprint awareness |
| **NST-CAP-009** | Scams / safety | Spot scam patterns; escalate safely; no live attack practice |
| **NST-CAP-010** | AI literacy | AI helps vs invents; label assist; verify; no secrets in tools |
| **NST-CAP-011** | Collaboration | Shared docs/chat; attribution; escalate blockers |
| **NST-CAP-012** | Troubleshooting | Observe → isolate → fix → document |
| **NST-CAP-013** | Digital identity | Personal vs professional identity; profile risk |

### Legacy 1A labels (retired as primary IDs)

| Legacy | Canonical |
|--------|-----------|
| N-ACC | NST-CAP-001 · 002 · 005 (split) |
| N-PWD | NST-CAP-005 · 006 |
| N-FIL | NST-CAP-004 |
| N-BRW | NST-CAP-003 |
| N-NET | NST-CAP-007 |
| N-PRV | NST-CAP-008 |
| N-SCM | NST-CAP-009 |
| N-AIL | NST-CAP-010 |
| N-COL | NST-CAP-011 |
| N-TSH | NST-CAP-012 |
| N-IDN | NST-CAP-013 |

## Portfolio in scope (ARCHITECTURE RECOMMENDED — NOT LOCKED)

Canonical IDs per [LEARNING-IDENTIFIER-STANDARD.md](../architecture/LEARNING-IDENTIFIER-STANDARD.md).

| Canonical ID | 1A candidate | Working title | Role |
|--------------|--------------|---------------|------|
| **RT-OPR-001** | RC-OPR-001 | Cloud Systems Operations Foundations | Primary OPERATE |
| **RT-BLD-001** | RC-BLD-001 | Web Application Delivery Foundations | Primary BUILD |
| **RT-PRT-001** | RC-PRT-001 | Defensive Security Operations Foundations | Primary PROTECT |
| **RT-LED-001** | RC-LED-001 | Technology Delivery & Risk Foundations | Primary LEAD |
| **RT-ANL-001** | RC-ANL-001 | Practical Data Analysis Foundations | Reserve / stretch |
| **CXW-001** | CXW-001 | Secure Application Delivery | Launch Cross-Wing |
| **SEX-001** | SEX-001 | Secure Cloud Operations Extension | Launch Secure Extension |

Final lock: **GHV.LEARNING.1D**. Status in this Gate is never `LOCKED`.

Detail matrix: [NEST-TO-ROUTE-BRIDGE-MAP.md](./NEST-TO-ROUTE-BRIDGE-MAP.md).

## Legend for Route dependency rows

| Column | Meaning |
|--------|---------|
| **Required Nest caps** | Weakness here should trigger Micro-Missions (Guided Skip) or Nest path before claiming Route readiness |
| **Recommended Nest caps** | Strengthen before or early in Route; may be optional reviews under Ready to Fly |
| **Micro-Missions on weakness** | Short foundations refresh topics if assessment shows gaps (Scope Guided Skip behavior) |
| **Guided Skip may proceed?** | Whether 50%–69% band may enter the Route **with** Micro-Missions + remaining advanced prereqs |
| **Advanced prereqs still required?** | Always **Yes** where Route / CW / SE lists non-Nest prerequisites — skip never waives them (Scope §3.5) |

---

## Route / CW / SE Nest dependency matrix

### RT-OPR-001 — Cloud Systems Operations Foundations

| Field | Content |
|-------|---------|
| **Required Nest caps** | NST-CAP-001 · NST-CAP-004 · NST-CAP-005 · NST-CAP-006 · NST-CAP-007 · NST-CAP-008 · NST-CAP-012 |
| **Recommended Nest caps** | NST-CAP-002 · NST-CAP-003 · NST-CAP-009 · NST-CAP-010 · NST-CAP-011 · NST-CAP-013 |
| **Micro-Missions on weakness** | Account/session hygiene · MFA before console labs · Cloud file sharing risks · “No connectivity” triage · Document-your-steps troubleshooting · Privacy of ops notes |
| **Guided Skip may proceed?** | **Yes** — with Micro-Missions on required-cap gaps |
| **Advanced prereqs still required?** | **Yes** — basic networking & OS concepts remain Route prerequisites (Nest skip ≠ Mastery; does not waive Stage gates) |
| **Bridge** | BRG-NEST-OPR-01 (optional) |

### RT-BLD-001 — Web Application Delivery Foundations

| Field | Content |
|-------|---------|
| **Required Nest caps** | NST-CAP-003 · NST-CAP-004 · NST-CAP-005 · NST-CAP-010 · NST-CAP-011 · NST-CAP-012 |
| **Recommended Nest caps** | NST-CAP-001 · NST-CAP-002 · NST-CAP-006 · NST-CAP-007 · NST-CAP-008 · NST-CAP-009 · NST-CAP-013 |
| **Micro-Missions on weakness** | File/project folder discipline · Browser literacy light · Credential safety · Structured debug habit · Collaboration attribution · AI-assist labeling |
| **Guided Skip may proceed?** | **Yes** — with Micro-Missions on required-cap gaps |
| **Advanced prereqs still required?** | **Yes** — HTML/CSS literacy or Nest bridge module still applies where Route defines it |
| **Bridge** | BRG-NEST-BLD-01 |

### RT-PRT-001 — Defensive Security Operations Foundations

| Field | Content |
|-------|---------|
| **Required Nest caps** | NST-CAP-003 · NST-CAP-005 · NST-CAP-006 · NST-CAP-007 · NST-CAP-008 · NST-CAP-009 · NST-CAP-010 · NST-CAP-012 |
| **Recommended Nest caps** | NST-CAP-001 · NST-CAP-002 · NST-CAP-004 · NST-CAP-011 · NST-CAP-013 |
| **Micro-Missions on weakness** | MFA discipline · Scam/phishing recognition · Privacy permissions · Safe browsing · Connectivity vs compromise cues · Evidence-safe troubleshooting · AI misuse / overtrust |
| **Guided Skip may proceed?** | **Yes, cautiously** — Micro-Missions mandatory on NST-CAP-009 / 005 / 006 / 008 gaps; lab safety brief still required |
| **Advanced prereqs still required?** | **Yes** — networking/OS basics remain Route-level prereqs, not waived by Nest skip |
| **Bridge** | BRG-NEST-PRT-01 |

### RT-LED-001 — Technology Delivery & Risk Foundations

| Field | Content |
|-------|---------|
| **Required Nest caps** | NST-CAP-003 · NST-CAP-008 · NST-CAP-010 · NST-CAP-011 · NST-CAP-012 · NST-CAP-013 |
| **Recommended Nest caps** | NST-CAP-001 · NST-CAP-002 · NST-CAP-004 · NST-CAP-005 · NST-CAP-006 · NST-CAP-007 · NST-CAP-009 |
| **Micro-Missions on weakness** | Collaboration / handoff clarity · Privacy in shared artifacts · AI for summaries vs decisions · Source evaluation · Structured problem framing · Professional identity tone |
| **Guided Skip may proceed?** | **Yes** — with Micro-Missions on required-cap gaps |
| **Advanced prereqs still required?** | **Yes** — experience-in-another-Route recommendation remains RECOMMENDED graph edge, not waived |
| **Bridge** | BRG-NEST-LED-01 (optional) |

### RT-ANL-001 — Practical Data Analysis Foundations (reserve)

| Field | Content |
|-------|---------|
| **Required Nest caps** | NST-CAP-003 · NST-CAP-004 · NST-CAP-008 · NST-CAP-010 · NST-CAP-011 · NST-CAP-012 |
| **Recommended Nest caps** | NST-CAP-001 · NST-CAP-002 · NST-CAP-005 · NST-CAP-006 · NST-CAP-007 · NST-CAP-009 · NST-CAP-013 |
| **Micro-Missions on weakness** | Spreadsheet/file hygiene · Source quality · Personal data minimization · AI hallucination checks · Reproduce-your-steps · Shared workbook etiquette |
| **Guided Skip may proceed?** | **Yes** — if Route activated; with Micro-Missions on required-cap gaps |
| **Advanced prereqs still required?** | **Yes** — spreadsheet literacy remains Route prerequisite |
| **Bridge** | BRG-NEST-ANL-01 |

### CXW-001 — Secure Application Delivery

| Field | Content |
|-------|---------|
| **Required Nest caps** | Union of RT-BLD-001 **and** RT-PRT-001 required sets: NST-CAP-003 · NST-CAP-004 · NST-CAP-005 · NST-CAP-006 · NST-CAP-007 · NST-CAP-008 · NST-CAP-009 · NST-CAP-010 · NST-CAP-011 · NST-CAP-012 |
| **Recommended Nest caps** | NST-CAP-001 · NST-CAP-002 · NST-CAP-013 |
| **Micro-Missions on weakness** | Combined BUILD+PROTECT refresh: credential safety · scam hygiene · AI labeling · structured debug · privacy of demo data |
| **Guided Skip may proceed?** | **Only if** Guided Skip already allows continuation on **both** source Routes **and** Integration Readiness checks pass — Nest band alone is insufficient |
| **Advanced prereqs still required?** | **Yes** — RT-BLD-001 foundation Stages + selected RT-PRT-001 Stages + Integration Mission / Evidence requirements remain; Cross-Wing access formula thresholds stay **PENDING GHV.PROGRESSION.1** / **GHV.LEARNING.1D** (not invented here) |
| **Bridge** | BRG-NEST-CXW-01 |

### SEX-001 — Secure Cloud Operations Extension

| Field | Content |
|-------|---------|
| **Required Nest caps** | Same as RT-OPR-001 required set, plus elevated NST-CAP-005 · NST-CAP-006 · NST-CAP-008 · NST-CAP-009 |
| **Recommended Nest caps** | NST-CAP-003 · NST-CAP-010 · NST-CAP-011 · NST-CAP-013 |
| **Micro-Missions on weakness** | Secrets never in Evidence · scam/social-engineering against ops roles · privacy of lab logs · MFA before privileged labs |
| **Guided Skip may proceed?** | **Only after** RT-OPR-001 core Stages (or declared equivalents) are in progress/complete per Extension rules — Nest Guided Skip does **not** unlock Extension alone |
| **Advanced prereqs still required?** | **Yes** — host Route capability (RT-OPR-001) + Extension Evidence; Trust/Mastery interaction **PENDING GHV.PROGRESSION.1** |
| **Bridge** | BRG-NEST-SEX-01 |

---

## Capability → portfolio heat map (summary)

| Nest cap | OPR-001 | BLD-001 | PRT-001 | LED-001 | ANL-001 | CXW-001 | SEX-001 |
|----------|---------|---------|---------|---------|---------|---------|---------|
| NST-CAP-001 | Req | Rec | Rec | Rec | Rec | Rec | Req |
| NST-CAP-002 | Rec | Rec | Rec | Rec | Rec | Rec | Rec |
| NST-CAP-003 | Rec | Req | Req | Req | Req | Req | Rec |
| NST-CAP-004 | Req | Req | Rec | Rec | Req | Req | Req |
| NST-CAP-005 | Req | Req | Req | Rec | Rec | Req | Req+ |
| NST-CAP-006 | Req | Rec | Req | Rec | Rec | Req | Req+ |
| NST-CAP-007 | Req | Rec | Req | Rec | Rec | Req | Req |
| NST-CAP-008 | Req | Rec | Req | Req | Req | Req | Req+ |
| NST-CAP-009 | Rec | Rec | Req | Rec | Rec | Req | Req+ |
| NST-CAP-010 | Rec | Req | Req | Req | Req | Req | Rec |
| NST-CAP-011 | Rec | Req | Rec | Req | Req | Req | Rec |
| NST-CAP-012 | Req | Req | Req | Req | Req | Req | Req |
| NST-CAP-013 | Rec | Rec | Rec | Req | Rec | Rec | Rec |

**Req** = required · **Rec** = recommended · **Req+** = required with elevated Extension emphasis.

## Band behavior (portfolio-level — no formula invention)

| Band | Nest journey | Horizon / foundational Routes | Advanced / CW / SE |
|------|--------------|-------------------------------|--------------------|
| Ready to Fly (≥ 70%) | May skip; recommended reviews on weak caps | May choose recommended Routes | Advanced Mastery not granted by skip alone; CW/SE keep their own prereqs |
| Guided Skip (50%–69%) | Optional Nest path; Micro-Missions inserted | May proceed on mapped Routes with Micro-Missions | Advanced prereqs **still required** |
| Nest Recommended (< 50%) | Nest active journey recommended | Advanced gated content unavailable until Nest done or readiness ≥ 50% | CW/SE remain gated |

Exact Mastery / Merit / Trust numeric thresholds: **out of scope** — PENDING GHV.PROGRESSION.1.

## Explicit non-goals

- Do **not** redesign Nest bands or change 70 / 50 thresholds.
- Do **not** invent progression, Mastery, or Trust formulas.
- Do **not** treat Nest skip as equivalent to Route Evidence.
- Do **not** lock Route / CW / SE catalogue in this Gate.
- Do **not** assign Product Codes.

## Next Gates

| Gate | Expected work |
|------|----------------|
| GHV.LEARNING.1C | Nest Mission catalogue + Evidence architecture tying Micro-Missions to caps |
| GHV.LEARNING.1D | Final catalogue lock |
| GHV.PROGRESSION.1 | Mastery / Trust / Merit thresholds (if any) interacting with Nest skip |
