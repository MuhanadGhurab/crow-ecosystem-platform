# Learning Portfolio Capacity Review

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-GOV-CAPY-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AS GOVERNED DESIGN BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1D |
| **Last updated** | 2026-07-21 |
| **Related** | [CONTENT-PRODUCTION-READINESS.md](./CONTENT-PRODUCTION-READINESS.md) · [LEARNING-PORTFOLIO-MANIFEST.md](./LEARNING-PORTFOLIO-MANIFEST.md) · [LEARNING-DESIGN-FREEZE-POLICY.md](./LEARNING-DESIGN-FREEZE-POLICY.md) |
| **Limitations** | Capacity recommendation only — does not start production; Expert Review NOT RUN; Pilot NOT RUN |
| **Expert review** | NOT RUN |
| **Pilot** | NOT RUN |
| **Technical validation** | NOT RUN |
| **Publication** | BLOCKED |
| **Implementation** | BLOCKED |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1D Portfolio Capacity Review |

## Purpose

Founder capacity review for producing P0 Routes, Bridge, CXW, SEX, and Live after design baseline lock — without beginning production.

---

## Scope evaluated

* Four P0 Routes (OPR, BLD, PRT, LED)
* One Bridge (BRG-PRT-BLD-01)
* One Cross-Wing (CXW-001)
* One Secure Extension (SEX-001)
* One Team/Live Sky blueprint (LIV-MSN-001)
* Evidence review workload · content freshness · Arabic production · accessibility · expert-review coordination · pilot coordination

---

## WIP rule (preserved)

```text
One primary implementation Capability
One supporting Capability
One Research Spike
```

Implications:

* Do not place all four P0 Routes into full content production simultaneously.
* Prefer launch quality over catalogue size.
* Content freshness and review effort count against capacity.

---

## RT-ANL-001

```text
LOCKED AS RESERVE DESIGN BASELINE
NOT A CONTROLLED-LAUNCH COMMITMENT
CAPACITY CONDITIONAL
Cannot be promoted without a Change Request
```

---

## Recommended production order

| Order | Construct | Rationale |
|------:|-----------|-----------|
| 1 | The Nest (representative slice) | Foundation for all Routes |
| 2 | RT-OPR-001 | Primary operations path; feeds SEX later |
| 3 | RT-BLD-001 | Delivery path; feeds CXW with Bridge |
| 4 | RT-PRT-001 | Defensive SecOps; feeds Bridge / CXW |
| 5 | RT-LED-001 | Delivery & risk; lower lab load |
| 6 | BRG-PRT-BLD-01 | AppSec Bridge for CXW eligibility |
| 7 | CXW-001 | After Bridge + BLD + PRT readiness |
| 8 | SEX-001 | After OPR |
| 9 | LIV-MSN-001 | After tech validation path exists |

RT-ANL-001 is **not** in the production order and is **not** promoted.

## Explicit non-claims

* Not Expert Approved · Not Pilot Validated · Not Publication Ready · Not Accredited · Not Certified.
* No XP · No numeric Mastery · No Product Code.
* Publication BLOCKED · Implementation BLOCKED.
