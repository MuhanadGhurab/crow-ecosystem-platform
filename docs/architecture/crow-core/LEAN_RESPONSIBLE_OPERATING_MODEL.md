# Lean Responsible Operating Model

> **Status:** CURRENT — CROW.DISCOVERY.2  
> **Module:** `src/lib/client-enterprise-design/lean-model/build-lean-responsible-model.ts`

## Principle

Crow presents a **Lean Responsible Operating Model**, not a minimum headcount or staffing guarantee.

## Outputs

| Field | Description |
| ----- | ----------- |
| `estimatedCoreTeamRange` | Min–max advisory range |
| `workloadAssumptions` | Plain-language capacity assumptions |
| `requiredPersonaResponsibilities` | Operating responsibilities required |
| `mergeRecommendations` | Safe responsibility combinations |
| `separationRequirements` | Duties that should remain separated |
| `automationOpportunities` | Where automation may reduce manual load |
| `capacityWarnings` | Capacity limit signals |
| `singlePointOfFailureWarnings` | Concentration risks |
| `segregationOfDutiesWarnings` | Control weaknesses |
| `nextHiringTriggers` | When to add specialization |
| `nextPersonaSplitTriggers` | When to split combined roles |
| `confidenceLimitations` | What the estimate does not cover |
| `disclaimer` | Not legal, financial, safety, or employment advice |

## Example presentation

```
Estimated core-team range: 6–8 people

Responsibilities that may be combined:
Operations coordination + customer coordination

Responsibilities that should remain separated:
Payment approval + payment execution

Next specialization trigger:
Dedicated dispatcher when delivery volume exceeds selected capacity assumption
```

## Operating priority interaction

`LEAN_RESPONSIBLE` priority favors merges and shallow management layers while retaining essential controls. `CONTROL_FIRST` increases separations and approval depth.
