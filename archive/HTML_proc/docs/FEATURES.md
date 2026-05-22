# Features — CyberCrow (product map)

## Shipped (Phase 1)

- **English-first LTR** interface with **IBM Plex Sans** and dark glass styling.
- **Homepage** plus **ERP request** flow: company profile, selectable **ERP modules** (English labels from data), **CyberCrow security layer** (English names + English descriptions), **subscription plan**, **live SAR summary**, validation, draft autosave, submit to **localStorage**.
- **About** page (vision and integrated security story).
- **Client dashboard** and **admin preview** read the same local queue—demo only until APIs exist.

## Phase 2 (in progress)

- **Backend + auth**: real companies/users, persisted `erp_requests`, server pricing, audit trail.
- **Replace localStorage** with authenticated API reads/writes.

## Later phases

- **Admin operations**: search/filter, status workflow, audit UI fed by the server.
- **Hardening**: rate limits, CSRF, server-side role checks.

## UX polish backlog

- Richer empty states and onboarding hints.
- Post-submit notifications once email/API exists.
- Stronger accessibility for multi-select module cards.
