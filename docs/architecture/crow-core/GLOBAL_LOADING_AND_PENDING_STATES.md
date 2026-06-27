# Global Loading and Pending States

## Route-level

- `RouteProgressBar` in root layout — top progress line on navigation
- `loading.tsx` on login, client, requests, and discovery design/compare/summary routes
- Skeleton via `ClientRouteLoading` with `aria-busy` and `role="status"`

## Button pending

- `PendingButton` — spinner, label change, duplicate click blocked
- Sign-in: `Signing in…`
- Design journey: `Saving your design…`, `Submitting your request…`

## Save status

`SaveStatusIndicator`: Unsaved → Saving → Saved / Failed / Conflict (`aria-live="polite"`)

## Duration model

- 0–300ms: local pending on click
- 300ms+: route skeleton / progress bar
- Extended: message via save/submit status

## Reduced motion

Spinners respect `motion-reduce:animate-none`. Route progress bar hidden under reduced motion via CSS.

## Tests

`npm run client-loading-feedback:test`
