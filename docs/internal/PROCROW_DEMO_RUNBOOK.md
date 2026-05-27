# ProCrow demo runbook

**Audience:** Operators and engineers preparing a ProCrow control-tower demo  
**Mode:** Staging / mock / portfolio — **no paid infra**, **no production launch**, **no live payments**

---

## Before demo checklist

- [ ] Platform Admin account available (not client-only session)
- [ ] App running locally or staging URL healthy (`/api/health` if applicable)
- [ ] `npm run procrow-demo:verify` green (after J8 doc changes)
- [ ] `npm run procrow:verify` green (full ProCrow stack)
- [ ] Optional: `npm run meem:ids:staging` for lighthouse URLs
- [ ] Browser tabs pre-opened per [`J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK.md`](J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK.md)
- [ ] Request ID noted for `/admin/requests/[requestId]`
- [ ] Tenant slug confirmed for CyberCrow (default: `meem-global`)
- [ ] Review **forbidden claims** section below
- [ ] Deck/screenshots: [`J8_PROCROW_SCREENSHOT_CHECKLIST.md`](J8_PROCROW_SCREENSHOT_CHECKLIST.md)

---

## Commands to run before demo

**Minimum (engineering confidence):**

```bash
npm run mock:verify
npm run typecheck
npm run lint
npm run build
npm run procrow:verify
npm run procrow-demo:verify
```

**Recommended (full ProCrow + client guardrails after UI touches):**

```bash
npm run public:mirror-manifest
npm run procrow-dashboard:verify
npm run procrow-queue:verify
npm run procrow-go-no-go:verify
npm run procrow-operator:verify
npm run cybercrow:verify
npm run sarea:ux-verify
npm run client-portal:verify
npm run client-profile:verify
npm run client-review:verify
npm run client-approval:verify
npm run client-onboarding:verify
npm run client-demo:verify
npm run client-org:verify
npm run client-notes:verify
```

**Staging anchors (optional, requires `.env.staging`):**

```bash
npm run meem:ids:staging
npm run sarea:meem-verify
```

**Do not run before demo unless explicitly approved:**

- `db:migrate:*` against production
- Destructive seeds
- Payment activation scripts
- Tenant auto-provision experiments

---

## Browser / tab setup

| Tab | Route |
|-----|-------|
| 1 (present) | `/admin/overview` |
| 2 | `/admin/queue` |
| 3 | `/admin/requests` (+ one detail URL) |
| 4 | `/meem-global/cybercrow/dashboard` |
| 5 | `/meem-global/cybercrow/evidence` |
| 6 | `/sarea/overview` |
| 7 | `/sarea/role-mapping` or `/sarea/preview` |
| 8 | `/admin/go-no-go` |
| 9 | `/admin/operator-console` |

Adjust tenant slug after `meem:ids:staging`.

---

## Demo account notes

| Role | Use |
|------|-----|
| Platform Admin | Required for `/admin/*` and `/sarea/*` |
| Tenant user (MEEM) | Optional if showing tenant ERP — not required for J8 core path |
| Client portal user | **Separate** I8 demo — do not mix unless telling end-to-end story |

Auth failures: sign in via normal app login; do not weaken admin protection for demo.

---

## Route order (10 minutes)

1. `/admin/overview` — define ProCrow
2. `/admin/queue` — derived operator queue
3. `/admin/requests/[requestId]` — readiness detail
4. `/[tenant]/cybercrow/dashboard` + one of evidence/GRC/risk
5. `/sarea/overview` + role-mapping or preview
6. `/admin/go-no-go` — F23 + gates
7. `/admin/operator-console` — docs + verifiers
8. Close on overview — value statement

Full talk track: [`J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK.md`](J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK.md)

---

## Fallback routes / situations

| Situation | Fallback |
|-----------|----------|
| Empty queue | `/admin/requests` table + explain derivation |
| No client-linked request | Read-only request tour; cite J3 doc |
| CyberCrow 404 | `meem:ids:staging`; use returned slug |
| SAREA preview empty | Stay on overview + role-mapping |
| Go/no-go mostly `not_run` | Expected — point to terminal verifiers |
| Short on time | Skip optional CyberCrow sub-page; skip client bridge |
| Client questions | Open [`I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md`](I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md) |

---

## Common questions — safe answers

| Question | Safe answer |
|----------|-------------|
| Is this production? | No — staging/demo/portfolio mode; F23 gates production commercial launch. |
| Does ProCrow auto-provision tenants? | No — operator-guided; client approval does not alone create production tenants. |
| Are payments live? | No — pricing/subscription surfaces are advisory unless explicitly approved. |
| Is CyberCrow certified? | No — advisory trust/evidence/GRC/risk cockpit, not certification or SIEM. |
| Does SAREA replace RBAC? | No — RBAC controls access; SAREA controls experience presentation. |
| Can I deploy from the UI? | No — go/no-go is advisory; operators run npm scripts manually. |
| What proves readiness? | `npm run procrow:verify` and related verifiers — see operator console. |

---

## Forbidden claims

- Production launch / go-live approved
- Live payments or billing enforcement
- Automatic tenant provisioning
- Certified compliance (SOC2, ISO, regulator certification)
- Autonomous security or AI remediation
- Legal audit readiness
- SIEM / 24×7 SOC replacement
- One-click deploy from ProCrow
- Claims of “ready for production” because UI shows green gates

---

## Post-demo follow-up

- [ ] Note any broken routes or confusing copy → file as polish, not J9 feature scope
- [ ] Capture screenshots per checklist if needed for deck
- [ ] Run `procrow:verify` if demo included live code pull
- [ ] Update stakeholder: **pause recommended** after J8 unless K1/J9 scheduled
- [ ] Link [`J8_PROCROW_DEMO_REHEARSAL.md`](J8_PROCROW_DEMO_REHEARSAL.md) in handoff email

---

## Related operator surfaces

| Surface | Doc / route |
|---------|-------------|
| Go/No-Go (J6) | [`J6_DEPLOYMENT_GO_NO_GO_CENTER.md`](J6_DEPLOYMENT_GO_NO_GO_CENTER.md) · `/admin/go-no-go` |
| Operator Console (J7) | [`J7_OPERATOR_DOCS_VALIDATION_CONSOLE.md`](J7_OPERATOR_DOCS_VALIDATION_CONSOLE.md) · `/admin/operator-console` |
| Operator index | [`PROCROW_OPERATOR_INDEX.md`](PROCROW_OPERATOR_INDEX.md) |
| F23 production gate | [`F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md`](F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md) |
| Validation playbook | [`VALIDATION_PLAYBOOK.md`](VALIDATION_PLAYBOOK.md) |
