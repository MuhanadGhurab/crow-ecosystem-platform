# CROW.STORY — Journey State

## JourneyKind

- `NEW` → URL `journey=new`
- `TRANSFORM` → URL `journey=transform`

## Soft vs committed

- **Soft:** Chapter 2 / `/start` button — updates URL + sessionStorage
- **Committed:** Final CTA — `signup?journey=&next=/client/requests/new?journey=`

## Handoff

| State | Destination |
|-------|-------------|
| Anonymous, no selection, Skip | `/start` |
| Anonymous, committed | `/signup?journey=…&next=…` |
| Authenticated, committed | `/client/requests/new?journey=…` |

## Request mapping (not collapsed)

| JourneyKind | Default OrganizationContext |
|-------------|----------------------------|
| NEW | NEW_BUSINESS (user may pick NEW_DIVISION) |
| TRANSFORM | EXISTING_ORGANIZATION (user may pick MODERNIZATION) |

## Storage

Key: `crow-client-scoped-v1:story-journey` — no PII.
