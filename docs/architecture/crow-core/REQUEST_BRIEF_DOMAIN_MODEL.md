# Request Brief Domain Model (CROW.REQUEST.2)

## Type

`ClientServiceRequestBrief` — schema version `client-service-request-brief-v1.0.0`

## Authority flags (fixed)

| Flag | Value |
|------|-------|
| advisory | true |
| createsBlueprint | false |
| provisionsTenant | false |
| grantsAuthority | false |
| completesDiscovery | false |

## Fields

- `primaryBusinessFieldKey`, `secondaryBusinessFieldKeys`
- `customFieldDescription`, `fieldResolutionStatus`, `customFieldSuggestedMatches`, `requiresProcrowFieldReview`
- `primaryPurposeKey`, `secondaryPurposeKeys`, `customPurposeDescription`
- `currentTeamRange`, `growthIntention`, `organizationContext`
- `configurationMode`, `plainLanguageGoal`, `letProcrowDecideTechnical`
- `preliminaryRecommendation` (Crow advisory preview)
- `clientAcknowledgements`, `originalClientStatement`, `idempotencyKey`, `submittedAt`

## Persistence (no migration)

Serialized JSON in `ImplementationRequest.notes` with marker `__CROW_REQUEST_BRIEF_v1__`.

Mapped columns: `industry`, `employeeBand`, `organizationName` (derived display name).

## ProCrow field resolution

`ProcrowFieldResolution` preserves original client description separately from reviewed canonical mapping (future admin action; client statement remains immutable evidence).
