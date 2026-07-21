# Breadth Formula

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-FRM-BRD-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **Formula ID** | FRM-BRD-001 |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

## Formula ID

```text
FRM-BRD-001
```

## Progression system

Breadth

## Purpose

Compute Breadth Index from Distinct Capability Coverage, Horizon Diversity, and Integrated Breadth. Descriptors do not award Horizon-Proven.

## Exact equation

```text
Breadth Index =
Distinct Capability Coverage
+ Horizon Diversity
+ Integrated Breadth
```

## Distinct Capability Coverage — 0 to 60

```text
5 points per distinct capability cluster
demonstrated at STANDARD or higher

Maximum:
60
```

A capability cluster may count once only. Near-duplicate capabilities do not count separately.

## Horizon Diversity — 0 to 25

```text
6.25 points per active launch Horizon
with at least two distinct capability clusters
at STANDARD or higher
```

Maximum during the initial four-Horizon launch portfolio:

```text
25
```

`RT-ANL-001` contributes:

```text
0
```

until activated through Change Control.

## Integrated Breadth — 0 to 15

```text
CXW-001 Route-Proven = 10
SEX-001 completed with approved Evidence = 3
Verified multidisciplinary Team capstone = 2
```

Maximum:

```text
15
```

## Candidate descriptors

| Breadth Index | Descriptor    |
| ------------: | ------------- |
|          0–24 | Focused       |
|         25–49 | Expanding     |
|         50–69 | Multi-Horizon |
|         70–84 | Integrated    |
|        85–100 | Extensive     |

These descriptors do **not** award Horizon-Proven.

## Prohibited inputs

* ANALYZE launch clusters (none registered).
* Payment.
* Mere enrollment without STANDARD demonstration.
* Horizon-Proven awarding (deferred).

## Rounding

Sum components; clamp 0–100; round half away from zero to 1 decimal.

---

# Launch Capability Cluster Registry (exact 12)

Clusters are named from OPERATE / BUILD / PROTECT / LEAD domains only. **No ANALYZE launch clusters.** `RT-ANL-001 = 0` for Horizon Diversity until Change Control activation.

| Cluster ID | Domain (Horizon) | Working name | Primary Route anchors |
|------------|------------------|--------------|------------------------|
| CC-01 | OPERATE (HRZ-OPR) | Cloud Systems Operations Fundamentals | RT-OPR-001 STG-01–02 |
| CC-02 | OPERATE (HRZ-OPR) | Connectivity & Service Inspection | RT-OPR-001 STG-03 |
| CC-03 | OPERATE (HRZ-OPR) | Guardrailed Change, IAM Hygiene & Recovery | RT-OPR-001 STG-04–05 · SEX-001 host ops |
| CC-04 | BUILD (HRZ-BLD) | Web Application Delivery Fundamentals | RT-BLD-001 STG-01 |
| CC-05 | BUILD (HRZ-BLD) | Repository & Delivery Hygiene | RT-BLD-001 STG-02 / SHC-002 |
| CC-06 | BUILD (HRZ-BLD) | Accessible Interface Delivery | RT-BLD-001 STG-03 / SHC-011 |
| CC-07 | PROTECT (HRZ-PRT) | Defensive Security Operations Fundamentals | RT-PRT-001 early Stages |
| CC-08 | PROTECT (HRZ-PRT) | Threat Triage & Defensive Monitoring | RT-PRT-001 triage / monitoring Stages |
| CC-09 | PROTECT (HRZ-PRT) | Secure Hardening & Change Discipline | RT-PRT-001 hardening Stages · BRG-PRT-BLD-01 |
| CC-10 | LEAD (HRZ-LED) | Technology Delivery & Risk Fundamentals | RT-LED-001 STG-01 / SHC-010 |
| CC-11 | LEAD (HRZ-LED) | Documentation & Decision Records | RT-LED-001 STG-02 / SHC-001 |
| CC-12 | LEAD (HRZ-LED) | Evidence Integrity & Responsible Judgment | RT-LED-001 STG-03 / SHC-008 |

**Exact cluster count: 12** (CC-01…CC-12).

## Explainability text

“Breadth recognizes distinct demonstrated capabilities and integrated work. Similar skills are not counted repeatedly.”

## Simulation scenarios

PER-005; PER-011; PER-012; PER-015; RUN-003

## Sensitivity range

Points-per-cluster 4–6; Horizon points 5–7.25; Integrated CXW weight 8–12.

## Known risks

Initial portfolio making high Breadth too easy or impossible; double-counting near-duplicates.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial Breadth candidate + 12 launch clusters under GHV.PROGRESSION.1B |
