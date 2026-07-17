# ProCrow Client Design Review

> **Status:** CURRENT — CROW.DISCOVERY.2  
> **Route:** `/admin/requests/[requestId]`  
> **Service:** `src/lib/services/procrow-client-design-review.service.ts`

## Review panel

`AdminClientEnterpriseDesignPanel` displays:

- Selected field and specialist domains
- Business purpose (primary + secondary)
- Current and target scale
- Operating priority and selected capabilities
- Chosen model variant
- Estimated workforce range (lean model)
- Work Personas / operating responsibilities
- Workflow summaries
- Customizations, warnings, unresolved decisions

## Source distinction

| Source | Label |
| ------ | ----- |
| `clientSelections` | Client selection |
| `crowRecommendations` | Crow recommendation |
| Implementer notes | Internal reviewer (existing Discovery paths) |

## Model Forge handoff

Button: **Open Client Design in Model Forge**  
URL: `/admin/model-forge?clientDesignRequestId={requestId}`

Handoff maps client snapshot to session-local Model Forge draft state with provenance preserved. Does not modify client answers or create Blueprint rows.

## Blueprint Studio path

Client Discovery Design → ProCrow Model Forge → Blueprint Preview. Persistent Blueprint save remains an explicit PLATFORM_ADMIN confirmation action.
