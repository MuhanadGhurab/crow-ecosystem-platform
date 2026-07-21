# Technical Spike Standard

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-VAL-SPK-STD-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN LOCKED** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §41 |
| **Last updated** | 2026-07-21 |
| **Authoritative baselines** | Product Constitution · Scope · Learning Design v1.0.0 · Progression Design v1.0.0 · Master Screen Registry v1.2.0 |

```text
SPIKES GOVERNED BY THIS STANDARD
Technical Spikes Run = 0
Technical Validation = NOT RUN
Product Code = BLOCKED
Code / Database / Deploy permission in 1A = DENIED
```

## Purpose

Define the mandatory field set and behavioural rules for every GHURAVIA technical spike so experiments cannot quietly become Product Code, schemas, or deployments.

## Mandatory fields (Gate §41)

Every future spike **must** define all of the following:

| Field | Requirement |
|-------|-------------|
| **Spike ID** | Canonical `SPK-ARC-NNN` (or later programme series) registered in [TECHNICAL-SPIKE-REGISTRY.md](./TECHNICAL-SPIKE-REGISTRY.md) |
| **Architecture question** | Single falsifiable question the spike answers |
| **Hypothesis** | Expected outcome if the candidate approach is sound |
| **Baselines affected** | Product / Learning / Progression / Architecture baselines touched |
| **Allowed code location** | Explicit path under a spike harness only — never product `src/` / `apps/` without a later Gate |
| **Time-box or Scope boundary** | Calendar time-box **or** explicit Scope cut that ends the spike |
| **Inputs** | Specs, fixtures, baselines, candidate options consumed |
| **Test data classification** | Synthetic / anonymized / prohibited (no production learner data in early spikes) |
| **Dependencies** | Prior spikes, ADRs, providers, environment prerequisites |
| **Implementation constraints** | Languages, frameworks, isolation, no silent Product Code |
| **Security constraints** | Secrets handling, network allow-list, threat boundaries |
| **Success metrics** | Measurable indicators of technical evidence quality |
| **Pass criteria** | Conditions under which the hypothesis is supported |
| **Fail criteria** | Conditions under which the candidate is rejected or deferred |
| **Outputs** | Evidence pack, decision recommendation, registry updates |
| **Cleanup** | Tear-down of harnesses, credentials, temporary resources |
| **Decision impact** | Which ADRs / Gates the result may unlock or block |
| **Commit policy** | What may be committed (docs / harness only vs nothing) |
| **Deployment policy** | Deploy allowed / denied; which environments |
| **Database policy** | DB access allowed / denied; which databases |

## Behavioural rules

1. Spikes **must not** quietly become Product Code.
2. A spike with **FAIL** or inconclusive evidence **must not** be summarized as technically validated.
3. Passing a spike produces **evidence**, not an automatic **ACCEPTED** ADR.
4. Stack ADRs remain **PROPOSED / VALIDATION REQUIRED** until Gate rules allow acceptance (not in 1A solely from planning).
5. In **GHV.ARCHITECTURE.1A**, for all registered spikes: **code permission = DENIED**, **database permission = DENIED**, **deployment permission = DENIED**.
6. Cleanup is mandatory even on PASS.
7. Commit policy defaults to **docs + named harness only** after a later Gate authorizes harness code; 1A commits are **docs only**.

## Status vocabulary

```text
PLANNED
NOT RUN
IN PROGRESS
PASS
FAIL
INCONCLUSIVE
BLOCKED
DEFERRED
```

## Related

- [TECHNICAL-SPIKE-REGISTRY.md](./TECHNICAL-SPIKE-REGISTRY.md)
- [TECHNICAL-SPIKE-PRIORITY-MATRIX.md](./TECHNICAL-SPIKE-PRIORITY-MATRIX.md)
- [../governance/ARCHITECTURE-DECISION-FRAMEWORK.md](../governance/ARCHITECTURE-DECISION-FRAMEWORK.md)
- DEC-164 (technical-spike governance)

## Limitations

```text
This standard does NOT authorize Product Code, schemas, installs, or deploys.
Spikes remain NOT RUN until a later Gate grants permissions.
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §41 — spike field standard locked as validation plan |
