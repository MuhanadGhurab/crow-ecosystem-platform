# J1 — ProCrow Portal UX Unification

**Status:** **Passed** (27 May 2026)  
**Scope:** UX / copy / information architecture — no major new features  
**Constraints:** No paid infra, migrations, auth redesign, route moves, production launch, or overclaims

---

## 1. ProCrow surface audit

### What already felt unified

- Platform Admin (`/admin/*`) shares `AreaShell`, pipeline cards, and lifecycle language.
- Customer flow panels (onboarding readiness, client review feedback) already reference ProCrow ownership.
- CyberCrow and SAREA use consistent entity badges and hub links from `platform-engine-hub`.
- Client portal shell links operators back to “ProCrow console”.

### What felt scattered (before J1)

| Area | Issue |
|------|--------|
| `/admin/overview` | Branded as “CEM Command Center” / “Crow Enterprise Manager” without ProCrow control-tower framing |
| Admin vs CyberCrow vs SAREA | Strong entity colors but weak umbrella narrative |
| Page headers | Mixed badges (“Implementation request”, “CyberCrow”) without ProCrow parent context |
| Operator docs | Spread across F/G/H/I phase docs without a ProCrow index |
| Warnings | Staging disclaimer only on overview; repeated ad hoc on other pages |

### Naming inconsistencies addressed

- Admin shell title → **ProCrow** with subtitle “Platform administration · control tower”.
- Control Tower entry → **ProCrow Control Tower** on `/admin/overview`.
- CyberCrow → **CyberCrow · ProCrow capability** on dashboard header.
- SAREA → **SAREA Studio · ProCrow capability** on overview hero.

### Route confusion (unchanged — by design)

- No new `/procrow` route (auth boundary unchanged).
- `/admin/overview` remains the Control Tower entry.
- `/[tenant]/cybercrow/*` and `/sarea/*` remain distinct capability routes.

---

## 2. Information architecture

Canonical IA lives in `src/lib/constants/procrow-portal.ts` as `PROCROW_INFORMATION_ARCHITECTURE`:

1. **Control Tower** — overview, requests, tenants, notifications, subscriptions  
2. **Customer Flow** — request → client → blueprint → ProCrow review → onboarding → tenant readiness  
3. **Trust & Security** — CyberCrow surfaces (dashboard, events, evidence, GRC, risk, audit)  
4. **Experience Studio** — SAREA profiles, mapping, preview, navigation, widgets  
5. **Runtime Cohesion** — tenant health, modules, reports, tasks, readiness signals  
6. **Deployment Discipline** — go/no-go, validation, F23 deferred gate  
7. **Operator Docs** — runbooks, validation, git safety, demo playbooks  

J1 surfaces this lightly via **Control tower map** on `/admin/overview`; full route implementation per section is deferred to J2+.

---

## 3. Language / copy system

**File:** `src/lib/constants/procrow-portal.ts`

| Key | Purpose |
|-----|---------|
| `PROCROW_CONTROL_TOWER` | Title, subtitle, staging note |
| `PROCROW_CAPABILITY_COPY` | ProCrow, CyberCrow, SAREA, runtime, customer flow, deployment |
| `PROCROW_CONTROL_TOWER_LINKS` | Entry cards for overview map |
| `PROCROW_INFORMATION_ARCHITECTURE` | Documented IA sections |
| `PROCROW_UX_ROADMAP` | J2–J8 labels |
| `PROCROW_FORBIDDEN_CLAIM_PHRASES` | Verifier guardrails |

**Avoided claims:** autonomous AI, guaranteed compliance, certified audit, production-ready (ungated), self-healing, automatic go-live, live payments.

---

## 4. Control Tower entry

**Route:** `/admin/overview` (unchanged)

- `ProCrowControlTowerHeader` — title + subtitle from constants  
- `ProCrowSafetyNote` — shared staging / F23 disclaimer  
- `ProCrowControlTowerMap` — eight capability cards with safe in-app links  
- Existing CEM pipeline, tenant grid, CyberCrow strip, and SAREA section retained below the map  

---

## 5. Shared components

**Location:** `src/components/procrow/`

| Component | Role |
|-----------|------|
| `procrow-page-header.tsx` | `ProCrowPageHeader`, `ProCrowControlTowerHeader` |
| `procrow-safety-note.tsx` | Staging / F23 disclaimer |
| `procrow-capability-card.tsx` | Linked tower map cards |
| `procrow-control-tower-map.tsx` | Overview section grid |
| `procrow-capability-framing.tsx` | “ProCrow capability” banner on child surfaces |

`ProCrowOperatorNextActions` deferred — existing `OperatorNextActionPanel` on request detail is sufficient for J1.

---

## 6. Platform Admin UX alignment

| Page | Change |
|------|--------|
| `admin/layout.tsx` | Shell title ProCrow + subtitle |
| `admin/overview/page.tsx` | Control Tower header, map, safety note |
| `admin/requests/page.tsx` | Customer-flow description |
| `admin/requests/[requestId]/page.tsx` | ProCrow-framed header + customer flow framing |
| `admin/tenants/[tenantId]/page.tsx` | ProCrow tenant control room copy + runtime framing |

**Unchanged:** permissions, request lifecycle logic, provisioning controls, go/no-go ownership.

---

## 7. CyberCrow UX alignment

| Page | Change |
|------|--------|
| `[tenant]/cybercrow/dashboard/page.tsx` | ProCrow capability badge; advisory description; `ProCrowCapabilityFraming` |

**Deferred (J4):** evidence, GRC, risk page headers; deeper copy pass on incidents/compliance.

---

## 8. SAREA UX alignment

| Page | Change |
|------|--------|
| `sarea/overview/page.tsx` | ProCrow capability badge; framing banner; no autonomous personalization claim |

**Deferred (J5):** preview source attribution depth, navigation/widgets isolation copy.

---

## 9. Operator docs index

**File:** [`PROCROW_OPERATOR_INDEX.md`](PROCROW_OPERATOR_INDEX.md)

Links: I1 architecture, client runbook, I11 checkpoint, CyberCrow/SAREA routes, G10 runtime cohesion, F23/F16 deployment, validation/git safety, demo indexes, J1 doc.

---

## 10. ProCrow UX roadmap (documented only)

| Phase | Title |
|-------|--------|
| J2 | ProCrow Control Tower Dashboard Depth |
| J3 | ProCrow Request-to-Tenant Operator Queue |
| J4 | CyberCrow Evidence/GRC UX Depth |
| J5 | SAREA Studio UX Depth |
| J6 | Deployment Go/No-Go Center |
| J7 | Operator Docs & Validation Console |
| J8 | ProCrow Demo Rehearsal |

---

## 11. Verification

**Script:** `scripts/verify-procrow-portal-ux.ts`  
**Command:** `npm run procrow:verify`

Checks: required files, overview ProCrow language, IA/roadmap constants, auth guard, forbidden claim phrases, operator index, J1 doc.

---

## 12. Validation results

| Command | Result |
|---------|--------|
| `npm run procrow:verify` | **PASSED** |
| `npm run mock:verify` | **PASSED** (28 checks) |
| `npm run typecheck` | **PASSED** |
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `npm run public:mirror-manifest` | **PASSED** |
| `client-portal:verify` | **PASSED** |
| `client-profile:verify` | **PASSED** |
| `client-review:verify` | **PASSED** |
| `client-approval:verify` | **PASSED** |
| `client-onboarding:verify` | **PASSED** |
| `client-demo:verify` | **PASSED** |
| `client-org:verify` | **PASSED** |
| `client-notes:verify` | **PASSED** |

---

## 13. Remaining gaps

- Manual logged-in staging smoke for ProCrow map links and CyberCrow/SAREA framing.
- No dedicated `/procrow` route (intentional until auth story is explicit).
- CyberCrow sub-pages (evidence, GRC, risk) not individually reframed in J1.
- SAREA studio sub-routes not individually reframed in J1.
- Deployment go/no-go center UI not consolidated (J6).
- Operator docs remain markdown — no in-app docs browser (J7).

---

## 14. Recommended next phase

**Primary:** **J2 — ProCrow Control Tower Dashboard Depth** — deepen overview metrics and customer-flow queue without new infra.

**Alternative:** Pause after J1 if no immediate internal demo pressure.

---

## 15. J1 decision

**PASSED** — ProCrow surface audit and IA documented; shared language and components shipped; Control Tower entry improved on `/admin/overview`; Platform Admin, CyberCrow dashboard, and SAREA overview aligned; operator index and roadmap added; verifier added; no forbidden scope introduced.
