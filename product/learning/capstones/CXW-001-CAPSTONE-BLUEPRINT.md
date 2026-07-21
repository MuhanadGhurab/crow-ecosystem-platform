# CXW-001 Capstone Blueprint — Secure Delivery Integration Studio

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-CAP-CXW-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE BLUEPRINT / BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Capstone ID** | **CXW-001-CAP-01** |
| **Working title** | Secure Delivery Integration Studio |
| **Concept link** | CAP-CXW-001 (1A) |
| **Related** | [CAPSTONE-BLUEPRINT-STANDARD.md](./CAPSTONE-BLUEPRINT-STANDARD.md) · [CXW-001 Mission blueprints](../missions/cross-wing/CXW-001-MISSION-BLUEPRINTS.md) · [CXW-001 rubrics](../evidence/rubrics/CXW-001-EVIDENCE-RUBRICS.md) · [CXW-001 architecture](../cross-wing/CXW-001-SECURE-APPLICATION-DELIVERY-ARCHITECTURE.md) · [BRG-PRT-BLD-01](../missions/bridges/BRG-PRT-BLD-01-APPSEC-BRIDGE.md) · [SEX-001 Capstone](./SEX-001-CAPSTONE-BLUEPRINT.md) |
| **Limitations** | Blueprint — no full CMS step scripts; no XP; not LOCKED |
| **Unresolved** | Numeric eligibility thresholds (PROGRESSION.1); expert review; pilot; 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1C CXW Capstone blueprint |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |

```text
Capstone: CXW-001-CAP-01 — integrated secure application release Evidence studio
Integrity test: Gate §36 (below)
No XP. Defensive only. Never LOCKED in this Gate.
```

---

## Problem

A small web application change must be **planned, built with Bridge-backed secure practice, verified against a seeded finding, and released or deferred** with honest residual risk and handoff — as one integrated secure delivery outcome.

---

## Learner role (scenario only)

Contributor responsible for **secure delivery integration** — not AppSec engineer title, not SOC analyst title, not employment offer.

---

## Eligibility

| Requirement | Rule |
|-------------|------|
| Stages | CXW-001-STG-01…04 complete |
| Bridge | BRG-PRT-BLD-01 complete (required) |
| Evidence | **CXW-001-EVD-01…03** accepted |
| Integration | **CXW-001-INT-01** complete |
| Access | Final Access Decision / Unlock rules still apply |

---

## Output shape (integrated secure app release)

| Artifact | Description |
|----------|-------------|
| App change Evidence | Lab repo/delta unique to the Capstone/Integration seed |
| Threat-aware plan | EVD-01-class plan tied to same seed |
| Security checklist / verification | Bridge-reinforced checks + interpretation |
| Remediated finding | Seeded finding log with proportionate remediation |
| Residual-risk reflection | Honest unresolved items |
| Release / handoff notes | Go/no-go + ops-aware handoff as applicable |

Pack is reviewed as **one integrated release studio**, not a folder of unrelated Route leftovers.

---

## Evidence & rubrics

| Anchor | Role in Capstone |
|--------|------------------|
| CXW-001-EVD-01 | Plan quality |
| CXW-001-EVD-02 | Secure build + remediation |
| CXW-001-EVD-03 | Release decision pack |
| INTEGRATION I1–I8 | Mandatory — see [CXW-001-EVIDENCE-RUBRICS.md](../evidence/rubrics/CXW-001-EVIDENCE-RUBRICS.md) |

Dual rubric: **delivery quality + secure practice depth + integration**.

---

## Integrity test — Gate §36

```text
GHV.LEARNING.1C Integrity Test §36 — CXW-001 Capstone
Result in this Gate: DEFINED IN BLUEPRINT — EXPERT REVIEW NOT RUN — PILOT NOT RUN
```

| # | §36 check | Pass | Fail |
|---|-----------|------|------|
| **36.1** | Seed unity | Plan, delta, finding, decision share one Capstone/Integration seed | Unrelated BUILD + PROTECT artifacts stapled |
| **36.2** | Integration necessity | Pack fails if BUILD-only or PROTECT-only subset would “pass” alone | Separate Route Capstones reused as CXW without reconciliation |
| **36.3** | Bridge authenticity | Secure-build hygiene shows Bridge-backed practice, not tip-sheet | Checklist with no applied change |
| **36.4** | Finding integrity | Seeded finding ID unique; remediation affects same delta | Copied finding write-up / wrong seed |
| **36.5** | Residual-risk honesty | Go/no-go includes residual risk; no false assurance | “Fully secure” claims |
| **36.6** | Secrets & safety | No real secrets/PII; lab-only; defensive only | Live-target or offensive steps |
| **36.7** | Authorship | Original work; AI disclosure present | Instructor-key paste / undisclosed wholesale generation |
| **36.8** | Non-collapse | Distinct from SEX-001 ops-harden Capstone problem shape | IAM/host harden submitted as CXW Capstone |

**§36 aggregate rule:** Capstone **cannot** be marked complete if any of 36.1–36.8 fails. Remediation: revise pack or governed new seed — preserve non-implicated approved Evidence per Remediation Architecture.

---

## Review

| Field | Content |
|-------|---------|
| **Pattern** | Human review with dual + INTEGRATION rubric |
| **Capacity** | Planned — not staffed in 1C |
| **Does not award** | XP · Product Code · professional title · full PROTECT · SEX completion |

---

## Privacy / safety / tooling

| Area | Posture |
|------|---------|
| **Privacy / safety** | Lab-only; demo data; no live attacks; ethics retained from PRT |
| **Tooling** | LOCAL-SAFE / CONTAINERIZED app lab; optional free/open scan tiers; pin versions |
| **Effort** | Medium–High |
| **Team** | Solo default; pair optional — not LIV-MSN-001 substitute |

---

## Distinctions

| Construct | Relationship |
|-----------|--------------|
| **RT-BLD-001-CAP-01** | Delivery-only — insufficient for CXW |
| **RT-PRT-001-CAP-01** | Defensive briefing — insufficient for CXW |
| **SEX-001-CAP-01** | Ops host harden — **distinct** problem shape |
| **CXW-001-INT-01** | Required predecessor — not the Capstone itself |

---

## Explicit non-claims

- No XP · No LOCKED · Expert review **NOT RUN** · Pilot **NOT RUN**  
- Completing CXW Capstone ≠ dual job titles ≠ certification  
