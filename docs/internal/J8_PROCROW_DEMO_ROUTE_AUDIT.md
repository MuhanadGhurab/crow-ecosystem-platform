# J8 — ProCrow demo route audit

**Mode:** Staging / mock / portfolio · **no paid infra** · Platform Admin auth for `/admin/*` and `/sarea/*` · tenant membership for `/[tenant]/*`

---

## 10-minute demo (required routes)

| Order | Route | Purpose | Auth | Talk time |
|-------|-------|---------|------|-----------|
| 1 | `/admin/overview` | **Start here** — ProCrow Control Tower, map, embedded queue, go/no-go + operator console links | Platform Admin | 1 min |
| 2 | `/admin/queue` | Request-to-tenant operator queue (derived stages) | Platform Admin | 1 min |
| 3 | `/admin/requests/[requestId]` | Request detail — client signals, onboarding readiness, ProCrow-owned flow | Platform Admin | 1 min |
| 4 | `/[tenant]/cybercrow/dashboard` | Trust cockpit entry | Tenant + module access | 0:45 |
| 5 | `/[tenant]/cybercrow/evidence` or `/grc` or `/risk` | Evidence / GRC / risk depth (pick **one** extra) | Tenant + module access | 1 min |
| 6 | `/sarea/overview` | Experience Studio framing | Platform Admin (SAREA studio) | 0:45 |
| 7 | `/sarea/role-mapping` or `/sarea/preview` | RBAC vs experience — mapping or preview | Platform Admin | 1 min |
| 8 | `/admin/go-no-go` | Deployment discipline — F23, gates, validation index | Platform Admin | 1:15 |
| 9 | `/admin/operator-console` | Docs + npm verifiers — manual execution only | Platform Admin | 1 min |

**Lighthouse tenant for CyberCrow:** prefer `meem-global` (run `npm run meem:ids:staging` for current slug/IDs). Fallback: any tenant with CyberCrow module enabled in demo data.

**Request ID for beat 3:** pick from `/admin/requests` or top item on `/admin/queue` — avoid empty placeholder rows.

---

## Optional routes (strong supporting cast)

| Route | When to show | Skip when |
|-------|--------------|-----------|
| `/admin/requests` | Need full intake table before detail | Short on time |
| `/admin/tenants/[tenantId]` | Tenant control room / go-live context | Already covered queue + request |
| `/admin/notifications` | Advisory inbox story | Rarely needed in 10 min |
| `/[tenant]/cybercrow/security-events` | Security narrative beyond evidence | Time-boxed |
| `/[tenant]/cybercrow/audit-logs` | Audit trail mention | Pair with evidence instead |
| `/sarea/profiles` | Profile catalog depth | Preview/mapping enough |
| `/sarea/navigation` · `/sarea/widgets` | Studio breadth | J5 depth — optional |
| `/client` | Client portal bridge | Separate I-track demo |
| `/client/proposals/[proposalId]` | Authenticated client review | After I6 approval story |
| `/client/onboarding` | Onboarding tracker | If request beat needs client view |
| `/proposal/[token]` | Public token — **sign-in notice only** | Do not demo as approval authority |

---

## Admin / ProCrow routes (inventory)

| Route | Demo tier | Notes |
|-------|-----------|-------|
| `/admin/overview` | **Core** | Primary entry; demo path hint (J8) |
| `/admin/queue` | **Core** | Derived queue — read-only |
| `/admin/requests` | Optional | List before detail |
| `/admin/requests/[requestId]` | **Core** | Client + onboarding signals |
| `/admin/go-no-go` | **Core** | Advisory gates — no deploy from UI |
| `/admin/operator-console` | **Core** | Docs/commands — no shell from UI |
| `/admin/notifications` | Optional | Advisory counts |
| `/admin/tenants/[tenantId]` | Optional | Operator tenant room |
| `/admin/tenants` | Skip (10 min) | Use overview grid instead |
| `/admin/discovery` · `/admin/blueprints` | Skip (10 min) | H1/F-series depth — mention only |
| `/admin/audit` · `/admin/integrations` · `/admin/subscriptions` | Skip | Not J-track focus |
| `/admin/domains` · `/admin/security-baselines` | Skip | Specialist topics |

---

## CyberCrow routes (tenant-scoped)

| Route | Demo tier | What it is / is not |
|-------|-----------|---------------------|
| `/[tenant]/cybercrow/dashboard` | **Core** | Trust cockpit — advisory posture |
| `/[tenant]/cybercrow/evidence` | **Core** (pick 1 of 3) | Evidence readiness — not certified audit |
| `/[tenant]/cybercrow/grc` | **Core** (pick 1 of 3) | Control mapping — not legal certification |
| `/[tenant]/cybercrow/risk` | **Core** (pick 1 of 3) | Risk review — not autonomous detection |
| `/[tenant]/cybercrow/security-events` | Optional | Event narrative — not SIEM |
| `/[tenant]/cybercrow/audit-logs` | Optional | Trail visibility |
| `/[tenant]/cybercrow/compliance` | Optional | Extra module surface |
| `/[tenant]/cybercrow/incidents` · `/sessions` · `/identity` | Skip (10 min) | Deeper ops — mention only |

---

## SAREA routes (platform studio)

| Route | Demo tier | Notes |
|-------|-----------|-------|
| `/sarea/overview` | **Core** | Studio entry — ProCrow experience governance |
| `/sarea/role-mapping` | **Core** (either) | RBAC ↔ experience boundary |
| `/sarea/preview` | **Core** (either) | Persona preview — tenant-backed vs fallback |
| `/sarea/profiles` | Optional | Profile catalog |
| `/sarea/navigation` · `/sarea/widgets` | Optional | Linked from control tower |
| `/sarea/rules` · `/layouts` · `/device-rules` | Skip (10 min) | Advanced studio |

---

## Where to avoid over-explaining

| Surface | Keep brief |
|---------|------------|
| Pipeline stat strip on overview | “Advisory counts — staging/mock” |
| Subscription / org intelligence cards | One sentence — not billing product |
| Lighthouse seed warning | “Run seed if empty — not a blocker for narrative” |
| Go/no-go gate statuses | “Metadata — we run verifiers in terminal” |
| Validation command list | Point to operator console — don’t read every npm script |
| SAREA fallback personas | “Demo fallback when tenant pack missing” |

---

## Thin data / fallbacks

| Condition | Fallback |
|-----------|----------|
| No queue rows | Walk `/admin/requests`; explain derivation rules from J3 doc |
| No request with client linkage | Use MEEM request from `meem:ids:staging` or read-only table tour |
| CyberCrow empty tenant | Switch to `meem-global`; mention advisory demo metrics |
| SAREA preview unavailable | Stay on overview + role-mapping copy |
| Go/no-go `not_run` gates | Expected — say operators run `procrow:verify` locally |
| Auth redirect | Use Platform Admin account; see [`PROCROW_DEMO_RUNBOOK.md`](PROCROW_DEMO_RUNBOOK.md) |

---

## Known manual smoke gaps

| Gap | Mitigation |
|-----|------------|
| End-to-end live DB not required for portfolio demo | Mock/advisory labels on overview |
| Client approval not repeated in 10 min ProCrow path | Reference I8 client playbook separately |
| Full ERP module chain not in J8 path | H1 playbook covers `/[tenant]/hr` etc. |
| Staging-only `meem:ids:staging` | Run before demo if URLs needed |
| Public `/proposal/[token]` must not imply token approval | Show sign-in notice only if asked |

---

## Login requirements

| Area | Requirement |
|------|-------------|
| `/admin/*` | `requirePlatformConsole` — Platform Admin role |
| `/sarea/*` | Platform console access (same shell policy as admin studio) |
| `/[tenant]/cybercrow/*` | Authenticated user with tenant membership + CyberCrow access |
| `/client/*` | Client portal session (separate demo) |
| Public routes | No login — do not use as ProCrow core demo |
