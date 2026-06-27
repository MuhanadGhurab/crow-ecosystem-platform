# Authentication Navigation Standard

Every gated auth screen must offer an understandable next action.

## Login / Signup

- **Back to Home** — visible labeled link to `/`
- **Go Back** — safe browser history when available
- Logo remains clickable to home
- Keyboard focus visible on controls

## Implemented on

- `/login`
- `/signup`

## Related pages to audit manually

- `/auth/resolving`
- `/auth/account-status`
- `/onboarding/*`
- `/access`

Component: `AuthBackNavigation`

## Tests

`npm run client-login-navigation:test`
