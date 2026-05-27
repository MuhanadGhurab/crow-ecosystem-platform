# J3 — ProCrow Request-to-Tenant Operator Queue

**Status:** **PASSED** (27 May 2026)  
**Constraints:** No paid infra, no production launch, no migrations, no auth weakening, no auto tenant provisioning, no task engine, no customer/compliance/AI/legal overclaims.

---

## 1. Queue audit (before J3)

**Surfaces reviewed:**

| Surface | Role today |
|---------|------------|
| `/admin/overview` | J2 control tower + embedded queue preview via `operatorQueue` array (legacy shape) |
| `/admin/requests` | Lifecycle list with status badges |
| `/admin/requests/[requestId]` | Operator next-action panels, client feedback, onboarding readiness |
| `/admin/notifications` | Platform notification inbox (I6/I10 events) |
| `/admin/tenants/[tenantId]` | Tenant runtime posture |

**Real signals (no new tables):**

- Implementation request status buckets (`getOperatorConsoleSnapshot`)
- Enterprise blueprint `proposalStatus`, `clientApprovedAt`, `proposalSentAt`
- Open client review notes / request-changes (`PlatformNotification` counts)
- CEM tenant health attention list
- CyberCrow open incidents + SAREA mapping gap (from control tower inputs)
- High-priority notification count

**Derived / advisory:** Queue stage, priority, owner, and “next action” labels are **operator-guided** interpretations — they do not mutate workflow state.

**Gaps addressed in J3:**

- Single typed **queue contract** with stage buckets and summary counts
- Dedicated **read-only queue service** with deduplication and sort rules
- Reusable **queue UI** (panel, browser, cards, summary strip)
- Full **`/admin/queue`** route with stage filters
- Request list/detail **queue vocabulary** alignment
- Notification page cross-link to operator queue

---

## 2. Data / contract

**File:** `src/lib/procrow/procrow-operator-queue-contract.ts`

- `ProCrowQueueStage`: intake → discovery → blueprint → proposal → client_review → approval → onboarding → tenant_readiness → runtime_trust → complete
- `ProCrowQueuePriority`, `ProCrowQueueOwner`, `ProCrowQueueItemStatus`
- `ProCrowOperatorQueueItem` (id, stage, priority, status, owner, title, description, org/ref ids, `relatedRoute`, `actionLabel`, `reason`, `source`, `tags`)
- `ProCrowOperatorQueueSummary`, `ProCrowOperatorQueueSnapshot` (`stageBuckets`, `nextRecommendedActions`, `safetyNotes`)

Control tower snapshot uses `operatorQueueSnapshot: ProCrowOperatorQueueSnapshot` (replaces legacy flat `operatorQueue[]`).

---

## 3. Service (read-only)

**File:** `src/lib/services/procrow-operator-queue.service.ts`

- `deriveProCrowOperatorQueueSnapshot(input)` — pure derivation from buckets, blueprints, notification/tenant/trust counts
- `getProCrowOperatorQueueSnapshot()` — loads operator + blueprint + notification + CEM context, then derives
- `emptyProCrowOperatorQueueSnapshot()` — safe empty posture
- **No** Prisma create/update/delete; **no** task records

**Priority rules (examples):** client request-changes and blocked readiness → critical; new intake / blueprint review / client-approved scope → high; waiting on client → medium; informational validation reminders → low.

---

## 4. UI components

**Location:** `src/components/procrow/`

| Component | Purpose |
|-----------|---------|
| `procrow-operator-queue-panel.tsx` | Compact/full panel for overview |
| `procrow-operator-queue-browser.tsx` | Stage-filtered list (client) |
| `procrow-queue-stage-tabs.tsx` | Stage filter tabs |
| `procrow-queue-item-card.tsx` | Single queue row |
| `procrow-queue-summary-strip.tsx` | Counts by priority / waiting |
| `procrow-queue-priority-badge.tsx` | Priority chip |
| `procrow-queue-empty-state.tsx` | Empty queue copy |

---

## 5. Admin overview integration

`ProCrowControlTowerDashboard` embeds `ProCrowOperatorQueuePanel` with `compact` mode and link to `routes.admin.queue`. J2 customer-flow strip and posture panels unchanged.

---

## 6. Dedicated queue route

**Added:** `/admin/queue` (`src/app/admin/queue/page.tsx`) — admin-protected via existing `admin/layout.tsx` nav (“Queue”).

Includes summary strip, priority highlights, stage browser, suggested next actions, safety note.

---

## 7. Request list / detail alignment

- **List:** `requestStatusToOperatorQueueHint()` advisory line per row; header link to operator queue
- **Detail:** Derived queue stage card; link to operator queue; existing onboarding / client approval panels unchanged

**File:** `src/lib/procrow/procrow-request-status-queue-hint.ts`

---

## 8. Notifications alignment

`/admin/notifications` description notes that client review notes and request-changes may appear on the operator queue; link to `/admin/queue`. Inbox remains source of truth for notification records.

---

## 9. Verification

| Script | Scope |
|--------|--------|
| `npm run procrow-queue:verify` | J3 contract, service, UI, routes, read-only guards, forbidden phrases |
| `npm run procrow-dashboard:verify` | J2 dashboard + `operatorQueueSnapshot` wiring |
| `npm run procrow:verify` | J1 + J2 + J3 |

---

## 10. Remaining gaps

- Per-request queue item drill-down from list (filter queue by `requestId`) — future enhancement
- Owner/priority filters on `/admin/queue` — optional J4
- Deeper CyberCrow/SAREA queue rows when tenant slug linkage is sparse in mock mode
- No SLA timers or assignment — intentionally out of scope (not a task system)

---

## 11. Recommended next phase

**Primary:** **J4 — CyberCrow Evidence/GRC UX Depth** (per platform roadmap)

**Alternative:** **J4 — ProCrow Request-to-Tenant Detail Actions** (inline operator actions from queue rows, still ProCrow-controlled, no auto-provision)

**Pause** if no internal demo pressure.
