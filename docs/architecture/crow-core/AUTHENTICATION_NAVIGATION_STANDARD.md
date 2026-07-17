# Authentication Navigation Standard

## Login / signup

- Visible **Back to Home** button (`AuthBackNavigation`)
- **Go Back** when browser history exists
- Logo remains clickable to `/`
- Keyboard focus ring on controls
- OAuth flows unchanged — navigation is outside provider forms

## Other auth screens

Forgot password, reset password, verify email, auth resolving, account status should offer Back, Home, Retry, Continue, or Sign out as applicable.

Component: `src/components/auth/auth-back-navigation.tsx`
