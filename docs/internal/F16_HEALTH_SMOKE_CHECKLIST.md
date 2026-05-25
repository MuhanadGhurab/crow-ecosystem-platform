# F16 — Health & smoke checklist

**Use after:** staging RC1 validation or production deploy  
**Record:** deployment URL, date, operator, pass/fail per row  
**No secrets** in notes.

---

## Public marketing (unauthenticated)

| # | Route | Method | Expected |
|---|-------|--------|----------|
| P1 | `/` | GET | 200; hero and sections render; no console auth errors |
| P2 | `/request` | GET | 200; intake form visible |
| P3 | `/architecture` | GET | 200 |
| P4 | `/security` | GET | 200; honest security copy (no fake certifications) |
| P5 | `/pricing` | GET | 200 |

---

## Auth surfaces

| # | Route | Context | Expected |
|---|-------|---------|----------|
| A1 | `/login` | Logged out | 200; sign-in options |
| A2 | `/auth/callback` | After OAuth | Redirect to admin or portal per role; no open redirect to external URL |
| A3 | `/admin/overview` | Logged out | 302 → `/login` |
| A4 | `/admin/overview` | Platform Admin | 200; command center |
| A5 | `/portal/requests` | Client user | 200; client portal |
| A6 | `/portal` | Platform staff | 302 → `/admin/overview` (unless `?preview=client`) |
| A7 | `/auth/signout` | Logged in | Session cleared; redirect to public/login |

---

## API

| # | Route | Method | Expected |
|---|-------|--------|----------|
| I1 | `/api/health` | GET | JSON `ok: true`, `db: "ok"` when DB reachable |
| I2 | `/api/implementation-requests` | POST | **Staging only** with safe payload: 201 + `requestId`; or 400/429 with validation — never 500 for valid body |
| I3 | `/api/billing/checkout` | POST | 401 without session (not public) |
| I4 | `/api/billing/webhook` | POST | 400 without Stripe signature |
| I5 | `/api/sarea/preview` | GET | 401/redirect without auth (not anonymous tenant data) |

Automated dry run (no live POST to prod unless approved):

```powershell
npm run request:e2e:dry
npm run request:pipeline:verify
```

---

## Tenant dashboards (authenticated)

| # | Route | Role | Expected |
|---|-------|------|----------|
| T1 | `/meem-global/dashboard` | MEEM tenant user | 200; logistics context |
| T2 | `/rimal-construction/dashboard` | Rimal tenant user | 200; construction context |
| T3 | `/najm-aviation/...` | Najm (if seeded) | Discovery/onboarding paths per seed |

Scripts:

```powershell
npm run meem:ids:staging
npm run tenant:verify:rimal
```

---

## CyberCrow (authenticated)

| # | Route | Expected |
|---|-------|----------|
| C1 | `/meem-global/cybercrow/dashboard` | 200; advisory metrics/widgets |
| C2 | `/rimal-construction/cybercrow/dashboard` | 200 |
| C3 | `/meem-global/cybercrow/incidents` | 200 or module gate per plan |
| C4 | `/meem-global/cybercrow/sessions` | 200 |

---

## SAREA Studio (platform staff)

| # | Route | Expected |
|---|-------|----------|
| S1 | `/sarea/overview` | 200 for platform staff |
| S2 | `/sarea/preview` | Preview API/UI; tenant slug required |
| S3 | `/admin/tenants/[tenantId]?tab=sarea` | Tenant SAREA tab loads |

```powershell
npm run sarea:meem-verify
```

---

## Operator console

| # | Route | Expected |
|---|-------|----------|
| O1 | `/admin/requests` | Pipeline list |
| O2 | `/admin/tenants` | Tenant list |
| O3 | `/admin/notifications` | Notification center |
| O4 | `/admin/overview` | KPIs / summary |

---

## Build gates (pre-smoke)

| Command | Expected |
|---------|----------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| `npm run public:mirror-manifest` | `docs/internal` excluded |

---

## Failure escalation

| Symptom | First action |
|---------|--------------|
| Health `db` not ok | Check `DATABASE_URL`, Supabase status, pooler |
| Auth redirect loop | Align `NEXT_PUBLIC_SITE_URL` + Supabase Site URL |
| Admin open without login | **Stop** — check `AUTH_DISABLED`, redeploy |
| 500 on public intake | Logs + Turnstile + DB; do not disable guards |

See [`F16_GO_NO_GO_MATRIX.md`](F16_GO_NO_GO_MATRIX.md).
