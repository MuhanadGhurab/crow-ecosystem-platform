# Next steps — CyberCrow

## Phase 1 (shipped)

English-first **LTR** UI: ERP request wizard (company profile, **ERP modules**, CyberCrow **security layer**, **subscription plan**), live SAR estimate, `localStorage` draft autosave, submitted requests, client dashboard, and admin-style views.

## Phase 3 (shipped in prototype) — Demo auth & role UX

**DEMO ONLY: This is not real authentication. Replace with backend auth later.**

- **`assets/js/auth.js`** — Demo users, shared password `Demo123!` (demo only), session helpers (`getSession`, `setSession`, `clearSession`, `hasRole`, `requireRoleForPage`), navbar auth slot (`initNavAuth`), and login form wiring (`initLoginPage`).
- **Session key** — `cybercrow.demoUser.v1` in `localStorage` (`{ email, role, displayName, loggedInAt }`).
- **`pages/login.html`** — Dropdown personas + password + “Enter Demo Workspace”; visitor option clears the session and returns to home.
- **Redirects after login** — Implemented in `getPostLoginPathForPagesDir` (visitor → home, client user → request, manager → dashboard, admin → admin, analyst → audit, executive → executive).
- **New pages** — `pages/audit.html` (analyst-focused audit table), `pages/executive.html` (summary cards from stored requests).
- **Guards** — `app.js` calls `guardPage` before page modules load; wrong roles are sent to their landing via `location.replace`.
- **Audit extensions** — `cybercrow.auditLog.v1` rows are normalized on read with defaults for legacy entries; new fields include `timestamp`, `actorName`, `actorRole`, `target`, `severity` (`info` | `warning` | `critical`). Events include demo login/logout, request submit (with actor from session), admin console viewed, and request status changes from the admin table.

See **`docs/USER_ROLES.md`** for the role matrix and storage notes.

## Phase 2 (next) — Backend and auth

1. Implement REST or GraphQL endpoints for companies, ERP requests, modules, plans, and security layers (see `docs/DATABASE_PLAN.md`).
2. Add real authentication and replace demo `localStorage` sessions with scoped reads/writes by `company_id` and server-side RBAC.
3. Server-side price validation; persist `audit_logs` and `request_status_history` on the server only (tamper-evident, authoritative timestamps).

## Phase 4 — Admin workflows (server-backed)

1. Port status transitions and audit events to APIs with optimistic UI states.
2. Surface audit entries per request with authoritative timestamps from the server.

## Phase 5 — Hardening

1. Rate limiting, CSRF protection, and role enforcement on every mutating route.
2. Contract tests for pricing rules to prevent UI/server drift.

## UX follow-ups

- Optional Arabic locale / RTL mode without breaking the English technical vocabulary where needed.
- Export request PDF for procurement teams.
