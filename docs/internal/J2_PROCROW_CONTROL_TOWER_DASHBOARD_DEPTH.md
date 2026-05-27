# J2 — ProCrow Control Tower Dashboard Depth

**Status:** **PASSED** (27 May 2026)  
**Constraints:** No paid infra, no production launch, no migrations, no auth weakening, no auto tenant provisioning, no customer/compliance/AI/legal overclaims.

---

## 1. Control tower audit (before J2 depth)

**Route:** `/admin/overview` (`src/app/admin/overview/page.tsx`).

**Previously surfaced (J1 baseline):**

- `ProCrowControlTowerHeader`, `ProCrowSafetyNote`, `ProCrowControlTowerMap`
- Platform health stat grid (tenants provisioning, users, memberships, workflows, tasks)
- `OperatorConsoleSection` (lifecycle buckets from `getOperatorConsoleSnapshot`)
- Subscription intelligence (when summary loads)
- `NotificationSummarySection` (inbox summary)
- Org intelligence sector template stats
- Lighthouse pipeline card (optional seed)
- Tenant lifecycle text + `FULL_PLATFORM_LIFECYCLE` + pipeline deep links (`PIPELINE_LINKS`)
- Tenant grid (`CemTenantGridCard` per tenant from `getCemCommandCenterSnapshot`)
- `PlatformCybercrowPostureStrip`
- SAREA stats section (profiles, layouts, rules)
- CEM runtime layer stats + “enter as platform admin” engine cards

**Important signals that were not consolidated:**

- Single **operator priority queue** across requests, blueprints, proposals, client signals, tenants, CyberCrow, SAREA, validation
- **End-to-end customer → tenant flow** counts in one scan strip
- **Client portal** aggregates (review notes, request-changes, org linkage, submitter coverage) without opening multiple admin pages
- **Deployment / F23 / go–no-go** discipline called out explicitly as a dashboard card

**Static vs real:** Lifecycle steps text was static; CEM/operator/notifications/tenant grid/CyberCrow/SAREA blocks were real services. J2 adds a **derived** snapshot layer (read-only aggregation) so priorities are visible without new writes.

**Operator decisions that were unclear:** Which cross-cutting item to open first — J2 adds `nextActions` and a sorted **operator queue** from existing buckets + counts.

**Safe deepening without schema:** Prisma reads already used elsewhere; new `getProCrowControlTowerSnapshot` composes those patterns; no new tables; no status automation.

---

## 2. Data model

**File:** `src/lib/procrow/procrow-control-tower-contract.ts`

Defines `ProCrowControlTowerSnapshot` and nested summaries: `customerFlow`, `clientPortal`, `tenantRuntime`, `trustPosture`, `experiencePosture`, `deploymentReadiness`, `operatorQueue`, `notifications`, `nextActions`. Readiness uses `ProCrowReadinessStatus` (advisory). Queue items use explicit `type`, `priority`, `owner`, and `relatedRoute` (internal admin/SAREA/CyberCrow paths only).

---

## 3. Service (read-only)

**File:** `src/lib/services/procrow-control-tower.service.ts`

- `getProCrowControlTowerSnapshot()` aggregates:
  - `getCemCommandCenterSnapshot()` (pipeline, CyberCrow posture, SAREA studio summary, tenants + health)
  - `getOperatorConsoleSnapshot()` (lifecycle buckets)
  - `getPlatformNotificationInboxSummary()` (high-priority count)
  - Blueprint rows for proposal status / client approval timestamps
  - Prisma counts: requests, statuses, proposal states, client org links, open review-note / request-change notifications, SAREA profile splits, pipeline-tagged notifications (7d)
- `buildOperatorQueue()` derives queue rows (cap/sort); **no task records**, no writes.
- On failure, returns a **safe empty** snapshot (`dataLive: false`).

---

## 4. Operator queue

Categories covered (when signals exist): new request review, blueprint review, proposal draft/send, proposal waiting on client, client approved scope, client request changes, client review notes, onboarding / go-live bucket, pipeline triage, tenant health attention, CyberCrow incidents, SAREA mapping gap, high-priority notifications, validation / go–no-go advisory row.

---

## 5. Customer flow summary

**UI:** `ProCrowControlTowerDashboard` — horizontal strip: Request → Discovery/blueprint → Proposal → Client approval → Onboarding → Tenant runtime → Trust/SAREA. Counts and hints use **honest** language (e.g. “waiting for client”, “ready for review”, “production gated” in surrounding copy).

---

## 6. Client portal signals

Dashboard panel: submitter-linked requests, org linkage count, approved-scope blueprints, open review notes, open request-changes, onboarding attention count, profile linkage readiness chip, advisory note. Links to `/admin/requests`. Internal admin only.

---

## 7. Tenant runtime signals

Panel: tenant count, health/watch review count, tenants with modules, average enabled modules, provisioning in flight, cohesion readiness chip, runtime note. Links to `/admin/tenants`.

---

## 8. CyberCrow trust summary

Panel: evidence-ready tenant count, open incidents, security event signal, audit/GRC readiness chips, advisory note. Deep links to evidence / risk / incidents for `primaryTenantSlugForCyberCrow` (fallback MEEM slug).

---

## 9. SAREA experience summary

Panel: profiles, tenant-backed vs fallback, navigation profiles, widget rules, preview readiness, mapping gap badge. Links to SAREA overview, profiles, role mapping, preview.

---

## 10. Deployment / go–no-go

Card: F23-gated production, no paid infra, no auto provisioning, validation baseline, go/no-go state + blocked reason when pipeline triage backlog exists. **Visibility only** — no deploy controls.

---

## 11. UI integration

**File:** `src/components/procrow/procrow-control-tower-dashboard.tsx`  
**Page:** `src/app/admin/overview/page.tsx` loads `getProCrowControlTowerSnapshot()` in parallel with existing data and renders the dashboard **after** the control tower map, before platform health. Existing sections (operator console, notifications, tenant grid, CyberCrow strip, SAREA block) retained for depth without removing J1 layout.

---

## 12. Verification

- **`npm run procrow-dashboard:verify`** → `scripts/verify-procrow-control-tower.ts` (contract, service, dashboard UI, overview wiring, F23/deployment copy, forbidden phrases, no `service_role` in scanned paths).
- **`npm run procrow:verify`** runs J1 verifier **then** J2 verifier.

---

## 13. Remaining gaps

- Queue items are **capped** (slice) — very large backlogs need list pages.
- CyberCrow deep links use **primary tenant slug** (first tenant or MEEM) — multi-tenant incident triage still per-tenant admin.
- `onboardingInProgress` count maps to provisioning-related request statuses (not full I7 step model).
- No new BI charts; reports/BI still reached from tenant/admin routes.

---

## 14. Recommended next phase

**Primary:** **J3 — ProCrow Request-to-Tenant Operator Queue** (dedicated queue UX / filtering on `/admin/requests` or sibling route, still derived, no task DB).  
**Alternative:** Pause after J2 if no demo pressure.  
**Manual:** I12 client portal smoke when staging time allows.

---

## 15. Final J2 decision

**PASSED** — Dashboard depth delivered under business constraints; documentation and verifiers updated; production remains F23-gated in copy and deployment card.
