# F16 — Production go / no-go matrix

**Decision owner:** Release operator + product sign-off  
**Use with:** [`F16_DEPLOYMENT_RUNBOOK.md`](F16_DEPLOYMENT_RUNBOOK.md), [`F16_HEALTH_SMOKE_CHECKLIST.md`](F16_HEALTH_SMOKE_CHECKLIST.md)

---

## Go criteria (all required unless waived in writing)

| Gate | Verification |
|------|----------------|
| **G1** Environment | [`F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md`](F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md) vars set on Vercel Production |
| **G2** Env validation | `validate-vercel-env` / `deploy:check` pass for target env file |
| **G3** Build | `npm run typecheck`, `lint`, `build` pass on release commit |
| **G4** Migrations | `prisma migrate status` — no pending migrations on prod `DIRECT_URL` |
| **G5** Health | `GET /api/health` → `ok: true`, `db: "ok"` |
| **G6** Auth | Login works; `AUTH_DISABLED` false; admin gated when logged out |
| **G7** Public intake | `/request` loads; guards active (Turnstile per policy) |
| **G8** Admin console | `/admin/overview` for platform admin |
| **G9** MEEM smoke | `meem:ids:staging` or prod-equivalent tenant paths verified |
| **G10** Rimal smoke | `tenant:verify:rimal` or prod-equivalent |
| **G11** Public mirror | `public:mirror-manifest` — no `docs/internal` |
| **G12** Secrets | No `.env` in git; no service role in public docs/screenshots |
| **G13** Supabase URLs | Site URL + redirect URLs match prod host |
| **G14** Entra | Azure redirect = Supabase callback (if SSO enabled) |

---

## No-go triggers (any one blocks launch)

| Code | Condition | Severity |
|------|-----------|----------|
| **N1** | `AUTH_DISABLED=true` on Production | Critical |
| **N2** | `USE_MOCK_DATA=true` on Production | Critical |
| **N3** | `DATABASE_URL` points to wrong project (staging DB on prod) | Critical |
| **N4** | `GET /api/health` fails or `db` not ok | Critical |
| **N5** | Unauthenticated access to `/admin/*` or tenant routes | Critical |
| **N6** | `.env` / secrets committed or staged | Critical |
| **N7** | `npm run build` fails on release commit | Critical |
| **N8** | Unresolved migration drift on production | Critical |
| **N9** | Auth redirect loop (Site URL mismatch) | High |
| **N10** | `SUPABASE_SERVICE_ROLE_KEY` in client or public doc | Critical |
| **N11** | Public mirror includes `docs/internal` | High |
| **N12** | Known open security regression from F15.6 re-opened | High |

---

## Waivers

Waivers require: named approver, risk acceptance, expiry date, mitigation plan.  
**Not** waivable without exec approval: N1, N3, N5, N6, N10.

---

## Scoring (informal)

| Outcome | Meaning |
|---------|---------|
| **GO** | All G* met; zero N* |
| **CONDITIONAL GO** | G* met; N* mitigated with dated waiver |
| **NO-GO** | Any unmitigated N* |

F16 documentation phase **passes** when governance artifacts exist and local/staging validation commands pass — production GO still requires operator execution of this matrix on the **production** deployment.

---

## Post-launch (first 24h)

- Monitor Vercel errors and Supabase metrics
- Watch `/api/health` synthetic check if configured
- Confirm notification delivery (Resend) for test pipeline event on staging first

---

## Related

- [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md) — F1 checklist
- [`F15_6_PUBLIC_SECURITY_REGRESSION_AUDIT.md`](F15_6_PUBLIC_SECURITY_REGRESSION_AUDIT.md)
- [`RC1_STAGING_VALIDATION.md`](RC1_STAGING_VALIDATION.md)
