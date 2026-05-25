# F10 — Tenant onboarding UX & admin operator console

**Date:** 25 May 2026  
**Scope:** Operator clarity across admin intake → discovery → blueprint → readiness → go-live → tenant. No schema changes, no public redesign, no auto production provision.  
**Out of scope:** Stripe, SCIM/Entra, new ERP, fake data/AI, hardcoded live tenant IDs in UI, customer one-off logic, workflow engine.

---

## PART 1 — Audit (admin operator journey)

### Surfaces in the journey

| Stage | Route(s) | Primary data | Operator affordances (pre-F10) |
|-------|----------|--------------|--------------------------------|
| Command center | `/admin/overview` | CEM snapshot, lighthouse, org intel, subscriptions | Queue stats, MEEM/Rimal cards, links to requests/tenants |
| Request list | `/admin/requests` | `implementation_request` rows | Status badge, filters, open detail |
| Request detail | `/admin/requests/[requestId]` | Request + modules + blueprint + discovery | Lifecycle strip, process guide, pipeline links, promote/actions |
| Discovery | `/discovery/[requestId]/*` | Discovery profile, answers, org model | Progress nav, readonly banner, summary + complete |
| Blueprint | `/blueprints/[blueprintId]/*` | Enterprise blueprint, modules, tenant | Area nav, readiness, go-live |
| Readiness | `.../readiness` | Grouped readiness groups | Gate panel, plan diff, go-live CTA |
| Go-live | `.../go-live` | Provision form, blockers | Explicit provision action only |
| Tenants | `/admin/tenants`, `/admin/tenants/[tenantId]` | Tenant registry | Slug, blueprint link |
| Tenant runtime | `/[tenant]/dashboard` | CEM workspace | Post-provision handoff |

### Gaps identified (pre-F10)

| Gap | Impact | F10 response |
|-----|--------|--------------|
| Overview mixed CEM intel with pipeline queue | Hard to see “what needs action now” by lifecycle bucket | `OperatorConsoleSection` + `getOperatorConsoleSnapshot()` |
| Request detail status is enum-only | Operators map `BLUEPRINT_BUILD` mentally | `OperatorNextActionPanel` + human bucket labels |
| Pipeline links only on request detail | Discovery/blueprint pages isolated | `OnboardingPipelineContext` on summary, readiness, go-live, layouts |
| No single E2E verify alias for operators | F8 script name not obvious | `npm run onboarding:verify` → same as `request:e2e:verify` |
| MEEM/Rimal visibility | Lighthouse buried in overview sections | Bucket cards tag MEEM/Rimal; constants-only refs |

### MEEM-specific vs reusable

| Reusable (all tenants) | MEEM/Rimal-specific (constants + verify only) |
|------------------------|-----------------------------------------------|
| Operator lifecycle buckets & labels | `MEEM_REFERENCE_CODE`, `MEEM_TENANT_SLUG` in snapshot lighthouse block |
| `OnboardingPipelineContext` | `RIMAL_REFERENCE_CODE`, `RIMAL_TENANT_SLUG` |
| Discovery gate, readiness, go-live | `meem:ids:staging`, `sarea:meem-verify`, `discovery:verify:meem` scripts |
| Organic E2E checklist panel | No MEEM-only UI branches in F10 components |

---

## PART 2 — Operator console (`/admin/overview`)

**Service:** `src/lib/services/operator-console.service.ts`  
**UI:** `src/components/admin/operator-console-section.tsx`  
**Wired in:** `src/app/admin/overview/page.tsx` (alongside existing CEM Command Center blocks).

Features:

- **Pipeline buckets:** pending review, discovery in progress, blueprint pending, ready for go-live, tenant live, needs review (counts + top cards).
- **Lifecycle cards:** reference, company, industry, modules, plan, bucket label, next action, advisory warnings, deep links (request, discovery, blueprint, tenant).
- **Platform warnings:** DB unavailable, large pending queue (advisory).
- **Lighthouse refs:** copyable MEEM/Rimal reference codes when env constants set (not hardcoded request IDs).

No separate `/admin/onboarding` route — overview remains the single command center.

---

## PART 3 — Request detail enhancements

**Route:** `/admin/requests/[requestId]`

| Addition | Module |
|----------|--------|
| Operator next action | `operator-next-action-panel.tsx` |
| Pipeline map (extended) | `request-pipeline-links.tsx` → `OnboardingPipelineContext` |
| Organic E2E checklist | `operator-e2e-checklist-panel.tsx` |
| Existing lifecycle strip | `lifecycle-strip.tsx` (unchanged) |

Works with live DB rows and mock pipeline rows (mock mode).

---

## PART 4 — Pipeline navigation bridge

**Component:** `src/components/admin/onboarding-pipeline-context.tsx`

Steps: Request → Discovery → Org intel → Blueprint → Readiness → Go live → Tenant.

| Location | `current` highlight |
|----------|---------------------|
| Request detail | `request` |
| Discovery layout + summary | `discovery` |
| Blueprint layout | (none — child pages set step) |
| Readiness | `readiness` |
| Go-live | `go_live` |

Disabled steps render muted until discovery/blueprint/tenant exist.

---

## PART 5 — Lifecycle status labels

**Module:** `src/lib/operator-onboarding-lifecycle.ts`

| Bucket | Human label | Derived from (no schema) |
|--------|-------------|---------------------------|
| `pending_review` | Pending review | `PENDING_REVIEW`, `DRAFT`, `APPROVED` without discovery progress |
| `discovery_in_progress` | Discovery in progress | `UNDER_DISCOVERY` or profile without blueprint |
| `blueprint_pending` | Blueprint pending | Blueprint exists, pre-provision statuses |
| `ready_go_live` | Ready for go-live | Blueprint + `BLUEPRINT_BUILD` / provisioning statuses |
| `tenant_live` | Tenant live | Tenant slug or `GO_LIVE` |
| `needs_review` | Needs review | `REJECTED`, `CANCELLED`, unknown |

Also exports: phase meaning copy, `operatorNextAction()`, `operatorAdvisoryWarnings()`, `operatorHumanStatusLabel()`.

Raw `ImplementationRequestStatus` still shown on request detail for engineers.

---

## PART 6 — Organic E2E UI support

- **Checklist panel** on request detail with F8 step summary and links to `docs/internal/F8_ORGANIC_REQUEST_E2E.md` stages.
- **Copyable verify command:** `npm run onboarding:verify -- --reference=CROW-YYYY-XXXXXX`
- **Overview:** lighthouse reference codes when configured.
- **Cross-links:** F8 checklist remains source of truth; F10 doc references F8 for full 18-step manual path.

---

## PART 7 — Verification script

```bash
npm run onboarding:verify -- --reference=CROW-2026-XXXXXX
```

Alias for `scripts/verify-organic-request-e2e.ts` (read-only, `.env.staging`). Same flags as F8/F9: `--expect-blueprint`, `--expect-tenant`, `--expect-sector=`, `--expect-plan=`.

Checks: reference format, request row, discovery profile, blueprint link, tenant slug, SAREA/CyberCrow when tenant present, no duplicate blueprint on MEEM reference misuse.

---

## PART 8 — Regression commands

Run after F10 changes (staging DB where noted):

```bash
npm run meem:ids:staging
npm run sarea:meem-verify
npm run tenant:verify:rimal
npm run request:pipeline:verify
npm run request:e2e:dry
npm run typecheck
npm run lint
npm run build
npm run simulate:vercel-build:staging
npm run public:mirror-manifest
npm run onboarding:verify -- --reference=<CROW-...>   # when row exists
```

---

## PART 9 — Admin UI polish

F10 touches **admin and operator pipeline surfaces only:**

- Dark glass cards (`cc-glass-card`), bucket badges (`OPERATOR_BUCKET_STYLES`).
- Empty states in operator console when DB offline or no cards.
- No changes to public `/request` or tenant ERP chrome.

---

## PART 10 — Related docs

| Doc | Role |
|-----|------|
| [`F8_ORGANIC_REQUEST_E2E.md`](F8_ORGANIC_REQUEST_E2E.md) | Full organic checklist |
| [`F9_BLUEPRINT_GO_LIVE_BRIDGE.md`](F9_BLUEPRINT_GO_LIVE_BRIDGE.md) | Gate + provision hardening |
| [`PROJECT_STATUS.md`](PROJECT_STATUS.md) | Current delivery track |
| [`MILESTONES.md`](MILESTONES.md) | F10 milestone row |

---

## Acceptance mapping (13 criteria)

1. **Operator console on overview** — `OperatorConsoleSection` with buckets + cards.  
2. **No schema change** — lifecycle derived in TS only.  
3. **Request detail next action** — panel + human labels.  
4. **Pipeline map** — `RequestPipelineLinks` / `OnboardingPipelineContext`.  
5. **Cross-stage navigation** — discovery summary, blueprint readiness/go-live.  
6. **Human lifecycle labels** — six operator buckets.  
7. **MEEM + Rimal visible** — lighthouse tags, not MEEM-only logic.  
8. **No public redesign** — admin-only diff.  
9. **No auto provision** — go-live unchanged.  
10. **E2E checklist UI** — panel + verify alias.  
11. **`onboarding:verify` script** — package.json alias.  
12. **Reuse existing services** — discovery gate unchanged; console uses prisma request list.  
13. **Regression path documented** — Part 8 above.

---

## Acceptance execution (25 May 2026)

All Part 8 regression commands exited **0** on staging. Decision **PASSED WITH WARNINGS** — no organic `CROW-2026-{6-char}` row in staging for `onboarding:verify`; lighthouse refs use `request:pipeline:verify` / dedicated MEEM/Rimal scripts; F8 browser checklist pending. Full table: [`F10_DEPLOYMENT_CHECKPOINT.md`](F10_DEPLOYMENT_CHECKPOINT.md).
