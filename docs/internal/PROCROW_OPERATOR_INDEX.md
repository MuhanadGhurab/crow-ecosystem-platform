# ProCrow operator index

**Audience:** Platform operators, delivery leads  
**Last updated:** 27 May 2026 (J6)

ProCrow is the internal control tower for Crow Ecosystem — platform administration, customer-to-tenant flow, trust governance, experience studio, runtime cohesion, and deployment discipline. CyberCrow and SAREA remain distinct capabilities under ProCrow.

---

## Control tower entry

| Surface | Route | Notes |
|---------|-------|--------|
| ProCrow Control Tower | `/admin/overview` | Primary entry — map, pipeline, tenant grid, embedded operator queue |
| Operator queue (derived) | `/admin/queue` | Request-to-tenant stages — read-only, no task engine |
| Deployment go/no-go center | `/admin/go-no-go` | J6 — advisory readiness, validation index, F23/migration/payment guardrails (no auto-deploy) |
| Platform Admin shell | `/admin/*` | `requirePlatformConsole` — not public |

---

## Customer flow

| Topic | Document / route |
|-------|------------------|
| Portal architecture (four portals) | [`I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md`](I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md) |
| Client portal runbook | [`CLIENT_PORTAL_RUNBOOK.md`](CLIENT_PORTAL_RUNBOOK.md) |
| Client checkpoint (I11) | [`I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md`](I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md) |
| Request intake | `/admin/requests` |
| Request detail | `/admin/requests/[requestId]` |
| Blueprints | `/admin/blueprints` |

---

## Trust & security (CyberCrow)

| Topic | Document / route |
|-------|------------------|
| CyberCrow completion context | [`CYBERCROW_COMPLETION.md`](CYBERCROW_COMPLETION.md) |
| Tenant CyberCrow dashboard | `/[tenant]/cybercrow/dashboard` |
| Security events | `/[tenant]/cybercrow/security-events` |
| Evidence | `/[tenant]/cybercrow/evidence` |
| GRC | `/[tenant]/cybercrow/grc` |
| Risk | `/[tenant]/cybercrow/risk` |
| Audit logs | `/[tenant]/cybercrow/audit-logs` |

---

## Experience studio (SAREA)

| Topic | Route |
|-------|-------|
| SAREA overview | `/sarea/overview` |
| Profiles | `/sarea/profiles` |
| Role mapping | `/sarea/role-mapping` |
| Preview | `/sarea/preview` |
| Navigation | `/sarea/navigation` |
| Widgets | `/sarea/widgets` |

---

## Runtime cohesion & tenant runtime

| Topic | Document |
|-------|----------|
| Cross-module cohesion (G10) | [`G10_CROSS_MODULE_INTELLIGENCE_RUNTIME_COHESION.md`](G10_CROSS_MODULE_INTELLIGENCE_RUNTIME_COHESION.md) |
| Tenant runtime UX (F24) | [`F24_TENANT_RUNTIME_UX_DEPTH.md`](F24_TENANT_RUNTIME_UX_DEPTH.md) |
| Tenant control room | `/admin/tenants/[tenantId]` |
| Tenant dashboard | `/[tenant]/dashboard` |

---

## Deployment discipline

| Topic | Document |
|-------|----------|
| Deployment go/no-go center (J6) | [`J6_DEPLOYMENT_GO_NO_GO_CENTER.md`](J6_DEPLOYMENT_GO_NO_GO_CENTER.md) |
| Production launch deferred (F23) | [`F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md`](F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md) |
| Go / no-go matrix | [`F16_GO_NO_GO_MATRIX.md`](F16_GO_NO_GO_MATRIX.md) |
| Deployment runbook | [`F16_DEPLOYMENT_RUNBOOK.md`](F16_DEPLOYMENT_RUNBOOK.md) |
| Validation playbook | [`VALIDATION_PLAYBOOK.md`](VALIDATION_PLAYBOOK.md) |
| Git safety | [`GIT_SAFETY_GUIDE.md`](GIT_SAFETY_GUIDE.md) |

---

## Demo & rehearsal

| Topic | Document |
|-------|----------|
| Operator demo index | [`OPERATOR_DEMO_INDEX.md`](OPERATOR_DEMO_INDEX.md) |
| H1 product polish | [`H1_PRODUCT_POLISH_DEMO_REHEARSAL.md`](H1_PRODUCT_POLISH_DEMO_REHEARSAL.md) |
| H1 demo playbook | [`H1_DEMO_REHEARSAL_PLAYBOOK.md`](H1_DEMO_REHEARSAL.md) |
| I8 client demo playbook | [`I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md`](I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md) |

---

## J-track (ProCrow UX)

| Phase | Document |
|-------|----------|
| J1 UX unification | [`J1_PROCROW_PORTAL_UX_UNIFICATION.md`](J1_PROCROW_PORTAL_UX_UNIFICATION.md) |
| J2 Control tower depth | [`J2_PROCROW_CONTROL_TOWER_DASHBOARD_DEPTH.md`](J2_PROCROW_CONTROL_TOWER_DASHBOARD_DEPTH.md) |
| J3 Operator queue | [`J3_PROCROW_REQUEST_TO_TENANT_OPERATOR_QUEUE.md`](J3_PROCROW_REQUEST_TO_TENANT_OPERATOR_QUEUE.md) |

---

## Verification

```bash
npm run procrow:verify
npm run procrow-queue:verify
npm run mock:verify
npm run typecheck
npm run lint
npm run build
```

Client portal regression batch (after ProCrow UI touches):

```bash
npm run client-portal:verify
npm run client-profile:verify
npm run client-review:verify
npm run client-approval:verify
npm run client-onboarding:verify
npm run client-demo:verify
npm run client-org:verify
npm run client-notes:verify
```
