# Client Intake Simplification (CROW.DISCOVERY.2B)

## Problem statement

Real user testing found: too many questions, poor field discovery, forced inaccurate selections, and missing loading feedback.

## Correction

Normal clients now provide only:

- Business field (search-first catalog or custom description)
- Business purpose (catalog or custom text)
- Current team size range
- Growth intention
- Configuration mode (default: Recommend Everything)

Crow and ProCrow infer ERP capabilities, workflows, security, and integrations.

## Quick intake flow

`Field → Purpose → Team and growth → Configuration mode → Recommendations → Review → Submit`

Expert and guided steps are deferred until the client selects a higher configuration mode.

## Question classifications

| Classification | Examples removed from normal path |
|----------------|-----------------------------------|
| ESSENTIAL_INITIAL | field, purpose, team, mode |
| OPTIONAL_INITIAL | client notes |
| GUIDED_ONLY | capability checkboxes |
| EXPERT_ONLY | priority, compare, customize |
| PROCROW_DISCOVERY | branch count, regulatory depth |
| REMOVE | legacy 10-step always-visible nav |

## Post-submit

No Blueprint, tenant, or authority side effects. ProCrow reviews client-provided design answers.
