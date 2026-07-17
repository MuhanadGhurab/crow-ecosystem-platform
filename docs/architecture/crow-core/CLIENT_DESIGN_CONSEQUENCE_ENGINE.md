# Client Design Consequence Engine

> **Status:** CURRENT — CROW.DISCOVERY.2  
> **Module:** `src/lib/client-enterprise-design/consequences/analyze-client-design-impact.ts`

## Function

`analyzeClientDesignImpact({ baselineInput, action })` returns deterministic impact analysis for client customizations.

## Supported actions

- Add / remove capability
- Add / remove specialist domain
- Merge / split responsibility (Work Persona)
- Change approval depth
- Change automation preference
- Change scale or operating priority
- Change model variant

## Impact dimensions

Workforce range, persona responsibilities, workflow complexity, approval depth, automation, operational capacity, security, evidence, KPIs, integrations, scalability, and risk.

## Guardrail classifications

| Class | Behavior |
| ----- | -------- |
| `SUPPORTED` | Safe to explore |
| `SUPPORTED_WITH_WARNING` | Allowed with visible caution |
| `REQUIRES_ADDITIONAL_CONTROL` | Needs compensating control |
| `NOT_RECOMMENDED` | Advisory discouragement |
| `INCOMPATIBLE` | Structural conflict |
| `REQUIRES_HUMAN_REVIEW` | ProCrow must review |

Exploration is never blocked for harmless choices. Submission is blocked only for unresolved structural contradictions (no workflow owner, high-risk approval without approver, etc.).

## Immutability

The baseline input model remains immutable; impact is computed as a diff projection.
