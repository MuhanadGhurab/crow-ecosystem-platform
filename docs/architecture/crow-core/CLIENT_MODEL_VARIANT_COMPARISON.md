# Client Model Variant Comparison

> **Status:** CURRENT — CROW.DISCOVERY.2  
> **Module:** `src/lib/client-enterprise-design/comparisons/model-variants.ts`

## Variants

| Variant | Meaning |
| ------- | ------- |
| `STARTER` | Lean core team, shallow workflows, essential controls |
| `GROWTH` | Moderate specialization, scaling readiness |
| `ENTERPRISE` | Deeper governance, broader specialization |
| `CUSTOM` | Client-mixed hybrid analyzed by consequence engine |

These are **operating realities**, not pricing plans.

## Comparison dimensions

- Estimated core-team range
- Responsibility structure and Work Personas
- Departments / shared operating units
- Workflow depth and approval depth
- Automation opportunities
- Security and evidence expectations
- Integration recommendations
- Next-growth triggers
- Assumptions and warnings

## Hybrid models

Clients may mix elements (e.g. Growth workforce + Enterprise security). `analyzeClientDesignImpact()` explains the resulting hybrid without applying authority.

## Routes

- Journey step 6: `/client/requests/[requestId]/discovery/design?step=compare`
- Dedicated compare page: `/client/requests/[requestId]/discovery/compare`
