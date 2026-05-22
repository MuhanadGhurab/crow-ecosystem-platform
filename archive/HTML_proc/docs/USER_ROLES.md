# User roles — CyberCrow

## Phase 3 demo (current static site)

**DEMO ONLY: This is not real authentication. Replace with backend auth later.**

The HTML prototype stores a **demo session** in `localStorage` under the key `cybercrow.demoUser.v1` with shape:

`{ email, role, displayName, loggedInAt }`.

Role checks run in the browser only (`assets/js/auth.js` + `app.js` guards). Anyone can bypass them via devtools—treat this as UX routing, not security.

### Demo personas (password `Demo123!` for all accounts; demo only)

| Email | Display name | Role id | Default landing after login |
| --- | --- | --- | --- |
| _(Visitor / empty)_ | Browse only | _(no session)_ | Home (`../index.html` from `/pages/`) |
| client.user@demo.com | Client User | `client_user` | ERP request |
| client.manager@demo.com | Client Manager | `client_manager` | Client dashboard |
| admin@cybercrow.local | CyberCrow Admin | `cybercrow_admin` | Admin console |
| analyst@cybercrow.local | Security Analyst | `security_analyst` | Audit console |
| executive@cybercrow.local | Executive | `executive` | Executive summary |

### Page access (client-side)

- **`pages/request.html`** — `client_user`, `cybercrow_admin`.
- **`pages/dashboard.html`** — `client_manager`, `executive`, `cybercrow_admin` (executives can also use the executive summary page).
- **`pages/admin.html`** — `cybercrow_admin` only (status changes and full queue).
- **`pages/audit.html`** — `security_analyst`, `cybercrow_admin` (read-only audit table).
- **`pages/executive.html`** — `executive`, `cybercrow_admin` (aggregated KPI cards from stored requests).
- **`pages/login.html`** — open to everyone for demo sign-in.

Wrong-role visits **redirect** to the persona’s default landing (see `requireRoleForPage` in `assets/js/auth.js`).

---

## Target production roles (reference)

### Company user (client)

- Create and view ERP requests for their own company.
- Inspect status, estimated cost, modules, and security layer selections.
- Cannot access other companies’ requests.

### CyberCrow administrator

- View every request with search/filter tools.
- Change request status according to internal workflow.
- Read audit trails tied to a request.
- (Later) manage users, companies, and commercial pricing from a secure back office.

### System / service account

- Writes `audit_logs` automatically for system events (request created, status changed, payment failure, etc.).
- No human UI; managed via API keys on the server.

### Security analyst (target)

- Read-only access to audit trails and security-relevant metadata across scoped companies (server-enforced).

### Executive (target)

- High-level dashboards and approvals without day-to-day operational mutation rights (server-enforced).
