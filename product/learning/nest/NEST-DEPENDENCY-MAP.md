# Nest Dependency Map

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-NEST-DEP-001 |
| **Version** | 1.0.0 |
| **Status** | RESEARCH BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1A |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.5 · [NEST-INTERACTION-FLOW.md](../../wireframes/onboarding/NEST-INTERACTION-FLOW.md) · [ROUTE-CANDIDATE-REGISTER.md](../routes/ROUTE-CANDIDATE-REGISTER.md) · [LAUNCH-CROSS-WING-STUDY.md](../cross-wing/LAUNCH-CROSS-WING-STUDY.md) · [LAUNCH-SECURE-EXTENSION-STUDY.md](../secure-extensions/LAUNCH-SECURE-EXTENSION-STUDY.md) · [LAUNCH-LEARNING-GRAPH-CONCEPT.md](../graph/LAUNCH-LEARNING-GRAPH-CONCEPT.md) |
| **Limitations** | Nest Mission catalogue content remains unresolved (GHV.LEARNING.1B); capability labels here are research groupings, not Product Codes; Route / CW / SE picks are **RECOMMENDED — NOT YET LOCKED**; no employment or certification claims |
| **Unresolved** | Exact Nest Mission catalogue · Micro-Mission insertion rules per capability · bilingual assessment item bank · GHV.PROGRESSION.1 interaction with Nest skip (no formula invented here) · GHV.LEARNING.1D catalogue lock |
| **Change history** | 1.0.0 (2026-07-21) — Initial RESEARCH BASELINE for GHV.LEARNING.1A |

## Purpose

Map Nest Digital Foundations capabilities to the recommended launch portfolio so readiness bands, Micro-Missions, and Guided Skip behavior stay consistent with Scope — without redesigning Nest bands or inventing progression formulas.

## Nest readiness bands (LOCKED — do not redesign)

Authoritative source: [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.5.

| Result | Label | Rule (unchanged) |
|--------|-------|------------------|
| ≥ 70% | Ready to Fly | May skip Nest; weaknesses → recommended reviews; **no advanced Mastery from skip alone** |
| 50%–69% | Guided Skip | May continue; **Micro-Missions** inserted; **advanced Routes keep prerequisites** |
| < 50% | Nest Recommended | Nest recommended active journey; advanced gated content unavailable until Nest done or readiness ≥ 50%; public exploration allowed |

This document **does not** change thresholds, invent Mastery/Trust formulas, or redefine band labels.

## Nest capability inventory (research groupings)

Capability IDs are research labels only (not Product Codes).

| Cap ID | Capability | What readiness looks like (observable) |
|--------|------------|----------------------------------------|
| **N-ACC** | Account / device | Create/sign-in safely; recognize device trust cues; manage sessions; recover access without sharing secrets |
| **N-FIL** | Files / cloud | Organize files; distinguish local vs cloud storage; share with least privilege; avoid accidental public exposure |
| **N-BRW** | Browser / search | Evaluate sources; use tabs/bookmarks safely; recognize phishing UI; basic search literacy |
| **N-PWD** | Passwords / MFA | Strong unique passwords; password manager habit; enroll/use MFA; recover without unsafe sharing |
| **N-NET** | Connectivity | Distinguish Wi-Fi / mobile / VPN at a user level; diagnose “no internet” vs app failure; safe public Wi-Fi habits |
| **N-PRV** | Privacy | Permission hygiene; understand data sharing prompts; basic personal data minimization |
| **N-SCM** | Scams / safety | Spot common scam patterns; report/escalate safely; refuse unsafe requests; no live attack practice |
| **N-AIL** | AI literacy | Know when AI helps vs invents; label AI-assisted work; verify outputs; avoid pasting secrets into tools |
| **N-COL** | Collaboration | Use shared docs/chat responsibly; attribution; respectful disagreement; escalate blockers |
| **N-TSH** | Troubleshooting | Structured “observe → isolate → fix → document”; ask useful help questions |
| **N-IDN** | Digital identity | Separate personal vs professional identity; username/avatar hygiene; public profile risk awareness |

## Portfolio in scope (RECOMMENDED — NOT YET LOCKED)

| ID | Title | Role in launch research |
|----|-------|-------------------------|
| RC-OPR-001 | Cloud Systems Operations Foundations | Primary OPERATE |
| RC-BLD-001 | Web Application Delivery Foundations | Primary BUILD |
| RC-PRT-001 | Defensive Security Operations Foundations | Primary PROTECT |
| RC-LED-001 | Technology Delivery & Risk Foundations | Primary LEAD |
| RC-ANL-001 | Practical Data Analysis Foundations | Optional alt / stretch |
| CXW-001 | Secure Application Delivery | Launch Cross-Wing |
| SEX-001 | Secure Cloud Operations Extension | Launch Secure Extension |

Final lock: **GHV.LEARNING.1D**. Status in this Gate is never `LOCKED`.

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

### RC-OPR-001 — Cloud Systems Operations Foundations

| Field | Content |
|-------|---------|
| **Required Nest caps** | N-ACC · N-FIL · N-PWD · N-NET · N-TSH · N-PRV |
| **Recommended Nest caps** | N-BRW · N-AIL · N-COL · N-IDN · N-SCM |
| **Micro-Missions on weakness** | Account/session hygiene · Cloud file sharing risks · Password/MFA before console labs · “No connectivity” triage · Document-your-steps troubleshooting |
| **Guided Skip may proceed?** | **Yes** — with Micro-Missions on required-cap gaps |
| **Advanced prereqs still required?** | **Yes** — basic networking & OS concepts remain Route prerequisites (Nest skip ≠ Mastery; does not waive Stage gates) |

### RC-BLD-001 — Web Application Delivery Foundations

| Field | Content |
|-------|---------|
| **Required Nest caps** | N-FIL · N-BRW · N-PWD · N-TSH · N-COL · N-AIL |
| **Recommended Nest caps** | N-ACC · N-PRV · N-IDN · N-SCM · N-NET |
| **Micro-Missions on weakness** | File/project folder discipline · Browser DevTools literacy light · Credential safety for accounts · Structured debug habit · Collaboration attribution · AI-assist labeling |
| **Guided Skip may proceed?** | **Yes** — with Micro-Missions on required-cap gaps |
| **Advanced prereqs still required?** | **Yes** — HTML/CSS literacy or Nest bridge module still applies where Route defines it |

### RC-PRT-001 — Defensive Security Operations Foundations

| Field | Content |
|-------|---------|
| **Required Nest caps** | N-PWD · N-SCM · N-PRV · N-BRW · N-NET · N-TSH · N-AIL |
| **Recommended Nest caps** | N-ACC · N-FIL · N-COL · N-IDN |
| **Micro-Missions on weakness** | MFA discipline · Scam/phishing recognition · Privacy permissions · Safe browsing · Connectivity vs compromise cues · Evidence-safe troubleshooting · AI misuse / overtrust |
| **Guided Skip may proceed?** | **Yes, cautiously** — Micro-Missions mandatory on N-SCM / N-PWD / N-PRV gaps; lab safety brief still required |
| **Advanced prereqs still required?** | **Yes** — networking/OS basics (RC-OPR-002 strongly recommended as Route-level prereq, not waived by Nest skip) |

### RC-LED-001 — Technology Delivery & Risk Foundations

| Field | Content |
|-------|---------|
| **Required Nest caps** | N-COL · N-PRV · N-AIL · N-BRW · N-TSH · N-IDN |
| **Recommended Nest caps** | N-ACC · N-FIL · N-PWD · N-SCM · N-NET |
| **Micro-Missions on weakness** | Collaboration / handoff clarity · Privacy in shared artifacts · AI for summaries vs decisions · Source evaluation · Structured problem framing · Professional identity tone |
| **Guided Skip may proceed?** | **Yes** — with Micro-Missions on required-cap gaps |
| **Advanced prereqs still required?** | **Yes** — experience-in-another-Route recommendation remains RECOMMENDED graph edge, not waived |

### RC-ANL-001 — Practical Data Analysis Foundations (optional alt)

| Field | Content |
|-------|---------|
| **Required Nest caps** | N-FIL · N-BRW · N-PRV · N-AIL · N-TSH · N-COL |
| **Recommended Nest caps** | N-ACC · N-PWD · N-IDN · N-SCM · N-NET |
| **Micro-Missions on weakness** | Spreadsheet/file hygiene · Source quality · Personal data minimization · AI hallucination checks · Reproduce-your-steps · Shared workbook etiquette |
| **Guided Skip may proceed?** | **Yes** — with Micro-Missions on required-cap gaps |
| **Advanced prereqs still required?** | **Yes** — spreadsheet literacy remains Route prerequisite |

### CXW-001 — Secure Application Delivery

| Field | Content |
|-------|---------|
| **Required Nest caps** | All **required** sets from RC-BLD-001 **and** RC-PRT-001 (union): N-FIL · N-BRW · N-PWD · N-TSH · N-COL · N-AIL · N-SCM · N-PRV · N-NET |
| **Recommended Nest caps** | N-ACC · N-IDN |
| **Micro-Missions on weakness** | Combined BUILD+PROTECT refresh: credential safety · scam hygiene · AI labeling · structured debug · privacy of demo data |
| **Guided Skip may proceed?** | **Only if** Guided Skip already allows continuation on **both** source Routes **and** Integration Readiness checks pass — Nest band alone is insufficient |
| **Advanced prereqs still required?** | **Yes** — RC-BLD-001 foundation Stages + selected RC-PRT-001 Stages + Integration Mission / Evidence requirements remain; Cross-Wing access formula thresholds stay **PENDING GHV.PROGRESSION.1** / **GHV.LEARNING.1B–1D** (not invented here) |

### SEX-001 — Secure Cloud Operations Extension

| Field | Content |
|-------|---------|
| **Required Nest caps** | Same as RC-OPR-001 required set, plus elevated N-SCM · N-PRV · N-PWD |
| **Recommended Nest caps** | N-AIL · N-COL · N-IDN · N-BRW |
| **Micro-Missions on weakness** | Secrets never in Evidence · scam/social-engineering against ops roles · privacy of lab logs · MFA before privileged labs |
| **Guided Skip may proceed?** | **Only after** RC-OPR-001 core Stages (or declared equivalents) are in progress/complete per Extension rules — Nest Guided Skip does **not** unlock Extension alone |
| **Advanced prereqs still required?** | **Yes** — host Route capability (RC-OPR-001) + Extension Evidence; Trust/Mastery interaction **PENDING GHV.PROGRESSION.1** |

---

## Capability → portfolio heat map (summary)

| Nest cap | OPR-001 | BLD-001 | PRT-001 | LED-001 | ANL-001 | CXW-001 | SEX-001 |
|----------|---------|---------|---------|---------|---------|---------|---------|
| N-ACC | Req | Rec | Rec | Rec | Rec | Rec | Req |
| N-FIL | Req | Req | Rec | Rec | Req | Req | Req |
| N-BRW | Rec | Req | Req | Req | Req | Req | Rec |
| N-PWD | Req | Req | Req | Rec | Rec | Req | Req+ |
| N-NET | Req | Rec | Req | Rec | Rec | Req | Req |
| N-PRV | Req | Rec | Req | Req | Req | Req | Req+ |
| N-SCM | Rec | Rec | Req | Rec | Rec | Req | Req+ |
| N-AIL | Rec | Req | Req | Req | Req | Req | Rec |
| N-COL | Rec | Req | Rec | Req | Req | Req | Rec |
| N-TSH | Req | Req | Req | Req | Req | Req | Req |
| N-IDN | Rec | Rec | Rec | Req | Rec | Rec | Rec |

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

## Next Gates

| Gate | Expected work |
|------|----------------|
| GHV.LEARNING.1B | Nest Mission catalogue + Evidence architecture tying Micro-Missions to caps |
| GHV.LEARNING.1C | Graph edges Nest→Route→CW→SE (typed) |
| GHV.PROGRESSION.1 | Mastery / Trust / Merit thresholds (if any) interacting with Nest skip |
| GHV.LEARNING.1D | Final catalogue lock |
)

