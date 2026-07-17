# Request Route Loading Standard (CROW.REQUEST.2)

## Loading boundaries

| Route | Component |
|-------|-----------|
| `/request` | `ClientRouteLoading` — "Loading service request entry…" |
| `/client/requests/new` | `ClientRouteLoading` — "Opening request…" |
| `/client/requests/{id}/confirmation` | `ClientRouteLoading` |
| `/client/requests` | existing list loader |
| `/auth/resolving` | `ClientRouteLoading` — "Resolving your session…" |
| `/account` | `ClientRouteLoading` — "Loading account…" |

## Pending button labels

- Opening request…
- Searching business fields… (field finder)
- Preparing recommendations…
- Submitting request…
- Loading request…
- Opening Discovery…

Use `aria-busy`, `role="status"`, `aria-live="polite"` on submit feedback.

## Error recovery

Wizard surfaces actionable messages for catalog failure, submission failure, duplicate detection, activation/legal gates — no raw DB errors.

See also `GLOBAL_LOADING_AND_PENDING_STATES.md`.
