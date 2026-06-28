# Global Loading and Pending States

## Route loading

`loading.tsx` boundaries on login, client portal, requests, and discovery design/compare/summary routes. Skeleton via `ClientRouteLoading` with `aria-busy` and `aria-live`.

## Route transition

`RouteProgressBar` in root layout — top progress line on pathname change (reduced-motion safe).

## Button pending

`PendingButton` — immediate label change, spinner, `aria-busy`, disabled duplicate clicks, preserved min-width.

## Save/submit status

`SaveStatusIndicator` — unsaved / saving / saved / failed / conflict with `aria-live="polite"`.

## Timing model

- 0–300ms: local pending on click
- 300ms+: route skeleton
- Extended: status message on submit/save

No fake percentage progress bars.
