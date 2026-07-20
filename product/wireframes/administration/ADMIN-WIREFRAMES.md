# Administration Wireframes (ADM)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-ADM-PACK |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.22 · [CRITICAL-FLOWS.md](../../interactions/CRITICAL-FLOWS.md) · [PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md) · [CAPABILITY-REGISTRY.md](../../CAPABILITY-REGISTRY.md) · [COMMERCIAL-WIREFRAMES.md](../commercial/COMMERCIAL-WIREFRAMES.md) · [ACCOUNT-TRUST-WIREFRAMES.md](../account/ACCOUNT-TRUST-WIREFRAMES.md) |
| **Scope** | CONTROLLED LAUNCH — essential launch administration only |
| **Unresolved** | Exact RBAC role matrix labels · Feature Flag catalogue · regional policy field set |
| **Change history** | 1.0.0 — PD.3 initial low-fidelity pack |

**Authority:** Screen IDs from Master Screen Registry only. Wireframe IDs `GHV-WF-ADM-00N`.

**Shell:** Administration ([PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md)).

**Pack rule:** Hidden UI ≠ authorization. Every mutating action checks role server-side; wireframes show role gates as Explainable Locks, not merely omitted buttons.

---

## Environment / role banner (pack-wide chrome)

Required on all ADM screens.

```text
┌──────────────────────────────────────────────────────────────┐
│ ENV: [DEV | STAGING | PROD]     ROLE: [Moderator | Content | │
│ Security | Live | Support | Entitlement | …]                 │
│ Actor: staff@… · [Switch context if multi-tenant PENDING]    │
│ ⚠ Actions are audited                                        │
└──────────────────────────────────────────────────────────────┘
```

| Rule | Behavior |
|------|----------|
| **Environment** | Always visible; PROD uses stronger confirm on destructive ops |
| **Role** | Shows active admin capability set; missing capability → locked tiles |
| **Audit** | Banner reminds; ADM-007 for inspection |
| **No product learner chrome** | Admin shell does not mix Flight bottom-nav |

---

## Index

| Wireframe ID | Screen ID | Name | Detail level |
|--------------|-----------|------|--------------|
| GHV-WF-ADM-001 | ADM-001 | Admin Home | DETAILED |
| GHV-WF-ADM-002 | ADM-002 | User Support | FAMILY |
| GHV-WF-ADM-003 | ADM-003 | Moderation Queue | DETAILED |
| GHV-WF-ADM-004 | ADM-004 | Content Lifecycle (+ Evidence admin) | FAMILY |
| GHV-WF-ADM-005 | ADM-005 | Entitlement Audit (+ Commercial admin) | DETAILED |
| GHV-WF-ADM-006 | ADM-006 | Live Ops | FAMILY |
| GHV-WF-ADM-007 | ADM-007 | Audit Log Viewer | DETAILED |

---

## Sequence overview

```text
Staff auth (elevated)
  → ADM-001 Admin Home (role-filtered tiles)
  → ADM-002 User Support
  → ADM-003 Moderation Queue
  → ADM-004 Content / Evidence lifecycle
  → ADM-005 Entitlement / Commercial audit
  → ADM-006 Live Ops
  → ADM-007 Audit Log Viewer
```

---

## GHV-WF-ADM-001 — Admin Home

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ADM-001 |
| **Screen ID** | ADM-001 |
| **Name** | Admin Home |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Admin (any staff role) |
| **Journey phase** | Ops |
| **Shell** | Admin |
| **Objectives** | Role-aware hub; regional policy entry; navigate to ADM-* tools |
| **Entry** | Admin role grant / staff URL |
| **Exit** | ADM-002…007 · policy sheet |
| **Primary actions** | Open tool tile |
| **Secondary actions** | Regional policy · Feature flags (essential) · Sign out staff |
| **Related capabilities** | CAP-TRU-013 · CAP-TRU-006 |
| **Unresolved** | Final tile iconography · multi-tenant switcher |

```text
┌──────────────────────────────────────────────────────────────┐
│ [ENV / ROLE BANNER]                                          │
├──────────────────────────────────────────────────────────────┤
│ Administration · essential launch tools only                 │
│                                                              │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│ │ User Support │ │ Moderation   │ │ Content /    │         │
│ │ ADM-002      │ │ Queue ADM-003│ │ Evidence     │         │
│ │              │ │              │ │ ADM-004      │         │
│ └──────────────┘ └──────────────┘ └──────────────┘         │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│ │ Entitlement  │ │ Live Ops     │ │ Audit Log    │         │
│ │ / Commercial │ │ ADM-006      │ │ ADM-007      │         │
│ │ ADM-005      │ │              │ │              │         │
│ └──────────────┘ └──────────────┘ └──────────────┘         │
│                                                              │
│ Regional policy entry                                        │
│ [Open regional policies…]  (fields PENDING policy Gate)      │
│                                                              │
│ Locked tiles (no role): Explainable Lock — “Requires X role” │
└──────────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Permission** | Tiles without role show lock reason; no silent 404-only |
| **Empty** | New staff with narrow role still sees allowed tiles |
| **Error / offline** | Hub cached; tools need online |
| **Mobile / desktop** | Tile grid; banner sticky |
| **A11y** | Tiles as links/buttons with names |
| **Analytics** | `adm_home_view` · `adm_tile_open` |
| **Security / audit** | Home view may be audited for elevated sessions |

**Acceptance criteria**

1. Environment + role banner always present.
2. Navigation only to registry ADM-* (and policy entry).
3. Unauthorized tiles explain role need.

---

## Family — ADM-002 User Support (GHV-WF-ADM-002)

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ADM-002 |
| **Screen ID** | ADM-002 |
| **Name** | User Support |
| **Detail** | FAMILY (search → user dossier → guided actions) |
| **Scope** | CONTROLLED LAUNCH |
| **Entry** | ADM-001 |
| **Exit** | ADM-001 · ADM-005 · ADM-007 · TRU-006 case link |

```text
┌──────────────────────────────────────────────────────────────┐
│ [ENV / ROLE BANNER]                                          │
│ User Support                                                 │
├────────────────────────────┬─────────────────────────────────┤
│ Search                       │ Dossier                         │
│ Crow ID / email / handle     │ Assurance · Plan · Merit        │
│ [Search]                     │ Sessions summary                │
│ Results list                 │ Recent Evidence / reports       │
│                              │                                 │
│                              │ Guided actions (role-gated)     │
│                              │ [View entitlements → ADM-005]   │
│                              │ [Force step-up reset…]          │
│                              │ [Open moderation cases]         │
│                              │ No unrestricted DMs             │
└──────────────────────────────┴─────────────────────────────────┘
```

| Shared | Behavior |
|--------|----------|
| **Search** | Least-privilege fields; no bulk export without ADM-007/policy |
| **Actions** | Confirm + audit; PROD extra confirm |
| **Empty** | “No user matched.” |
| **Security** | Support ≠ silent entitlement grant (use ADM-005) |

---

## GHV-WF-ADM-003 — Moderation Queue

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ADM-003 |
| **Screen ID** | ADM-003 |
| **Name** | Moderation Queue |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Moderator |
| **Journey phase** | Ops |
| **Shell** | Admin |
| **Objectives** | Review reports; act; leave auditable decisions; feed appeals (TRU-006) |
| **Entry** | ADM-001 · notification |
| **Exit** | ADM-001 · case detail · ADM-007 |
| **Primary actions** | Take action (warn / remove / restrict / dismiss) |
| **Secondary actions** | Escalate · Request more info · Open Evidence context |
| **Related capabilities** | CAP-SOC-008 · CAP-TRU-005 |
| **Unresolved** | Full action taxonomy |

```text
┌──────────────────────────────────────────────────────────────┐
│ [ENV / ROLE BANNER]                                          │
│ Moderation Queue                                             │
├──────────────┬───────────────────────────────────────────────┤
│ Filters      │ Case #… · Report from TRU-006 / COM           │
│ Open         │ Target preview (policy-safe)                  │
│ In review    │ Reporter (protected) · reason · time          │
│ Escalated    │                                               │
│ Closed       │ History thread                                │
│              │                                               │
│ Case list    │ Actions                                       │
│ • Case A     │ ○ Dismiss  ○ Warn  ○ Remove content           │
│ • Case B     │ ○ Restrict account  ○ Escalate                │
│              │ Note: [ required for restrictive acts ]       │
│              │ [Apply decision]  ← confirm + audit           │
│              │ Appeal path: user sees TRU-006 if allowed     │
└──────────────┴───────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Empty** | “Queue clear.” |
| **Locked** | Non-moderators cannot Apply |
| **Error / offline** | Decisions need online; conflict if already closed |
| **Mobile** | List → detail stack |
| **A11y** | Decision group labeled; confirm dialog |
| **Analytics** | `mod_case_open` · `mod_decision` |
| **Security / audit** | Every decision → audit event (ADM-007) |

**Acceptance criteria**

1. Report/appeal lineage from TRU-006 / COM represented.
2. Restrictive acts require note + confirm.
3. Banner + role gate visible.

---

## Family — ADM-004 Content Lifecycle + Evidence admin (GHV-WF-ADM-004)

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ADM-004 |
| **Screen ID** | ADM-004 |
| **Name** | Content Lifecycle |
| **Detail** | FAMILY — Learning content lifecycle **and** Evidence admin queue as sibling views |
| **Scope** | CONTROLLED LAUNCH |
| **Entry** | ADM-001 |
| **Exit** | ADM-001 · LRN context (read) · ADM-007 |

**Evidence admin** is not a separate registry screen; it is an **ADM-004 family** view (Scope §3.22 Evidence queues).

```text
┌──────────────────────────────────────────────────────────────┐
│ [ENV / ROLE BANNER]                                          │
│ Content Lifecycle · tabs: [Catalogue] [Evidence admin]       │
├──────────────────────────────────────────────────────────────┤
│ Catalogue view                                               │
│ Items: Mission / Route / Nest content …                      │
│ States: Draft · Review · Published · Retired                 │
│ [Publish] [Retire] [Schedule] — confirm on PROD              │
│ Learning Graph hooks: PENDING LEARNING.1 where applicable    │
├──────────────────────────────────────────────────────────────┤
│ Evidence admin view                                          │
│ Queues: Pending review · Flagged · Revision requested        │
│ Case: Evidence ID · Mission · learner (minimal)              │
│ Actions: Approve path signal · Request revision · Escalate   │
│ Note: Admin does not “buy” Skill; Evidence integrity only    │
│ [Open audit trail → ADM-007]                                 │
└──────────────────────────────────────────────────────────────┘
```

| Shared | Behavior |
|--------|----------|
| **Publish / retire** | Audited; rollback note |
| **Evidence** | Aligns with learner LRN-005 status language |
| **Empty** | Empty queue / empty draft list |
| **Permission** | Content admin vs Evidence reviewer roles may differ |

---

## GHV-WF-ADM-005 — Entitlement Audit (+ Commercial admin)

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ADM-005 |
| **Screen ID** | ADM-005 |
| **Name** | Entitlement Audit |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Admin (entitlement / commercial) |
| **Journey phase** | Ops |
| **Shell** | Admin |
| **Objectives** | Inspect Access Plan, Merit Grants, concurrency; commercial reconciliation entry; never grant Skill |
| **Entry** | ADM-001 · ADM-002 dossier |
| **Exit** | ADM-001 · ADM-007 · PAY context (read) |
| **Primary actions** | Inspect · Apply audited entitlement correction |
| **Secondary actions** | Open invoice/provider refs · Merit grant adjust |
| **Related capabilities** | CAP-PAY-009 · CAP-PAY-001 · CAP-PAY-005 |
| **Unresolved** | Provider reconciliation UI depth (provider PENDING) |

**Commercial admin** surfaces through **ADM-005** (not a separate screen ID): subscription state, grace, invoices refs, Merit grants inspection.

```text
┌──────────────────────────────────────────────────────────────┐
│ [ENV / ROLE BANNER]                                          │
│ Entitlement Audit · Commercial admin                         │
│ Payment ≠ Skill · Prices authoritative in Scope §3.19        │
├────────────────────────────┬─────────────────────────────────┤
│ Lookup                       │ Entitlement snapshot            │
│ User / Crow ID               │ Plan: Open Flight | Flight |    │
│ [Load]                       │ Wing | Expedition | Merit…      │
│                              │ Period · status · grace end     │
│                              │ Concurrent Routes U / C         │
│                              │ Merit grants list               │
│                              │ Provider refs: PENDING PSP      │
│                              │                                 │
│                              │ Commercial actions (audited)    │
│                              │ [Extend grace…]                 │
│                              │ [Correct plan…]                 │
│                              │ [Issue / revoke Merit grant…]   │
│                              │ [Open invoices / receipts]      │
│                              │ Confirm + reason required       │
│                              │ Free users ≠ incomplete         │
└──────────────────────────────┴─────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Ethical** | Corrections never framed as selling Mastery; Open Flight valid |
| **Error** | Provider sync fail → PENDING label; no silent invent |
| **PROD** | Extra confirm for grant/revoke |
| **Analytics** | `ent_audit_view` · `ent_correct` · `merit_admin_adjust` |
| **Security / audit** | All mutations → ADM-007 |

**Acceptance criteria**

1. Plan / Merit / concurrency inspectable.
2. Commercial admin via this screen family.
3. Ethical commercial rules honored (no fake urgency tooling, no hiding Open Flight/Merit in admin narratives).

---

## Family — ADM-006 Live Ops (GHV-WF-ADM-006)

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ADM-006 |
| **Screen ID** | ADM-006 |
| **Name** | Live Ops |
| **Detail** | FAMILY (directory → event ops → moderate Live) |
| **Scope** | CONTROLLED LAUNCH |
| **Entry** | ADM-001 |
| **Exit** | LIV-001 (ops lens) · ADM-001 · ADM-003 |

```text
┌──────────────────────────────────────────────────────────────┐
│ [ENV / ROLE BANNER]                                          │
│ Live Ops                                                     │
├──────────────────────────────────────────────────────────────┤
│ Upcoming / live events                                       │
│ • Event A · state · capacity · [Manage]                      │
│                                                              │
│ Manage sheet                                                 │
│ Boarding gate · spectator rules · emergency stop             │
│ Moderation handoff → ADM-003 if report                       │
│ Results publish (public-safe)                                │
│ Note: essential launch Live admin only (Scope §3.17–3.22)    │
└──────────────────────────────────────────────────────────────┘
```

| Shared | Behavior |
|--------|----------|
| **Emergency stop** | PROD confirm + audit |
| **Spectator** | No private solutions leakage controls visible |
| **Empty** | No scheduled events |

---

## GHV-WF-ADM-007 — Audit Log Viewer

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ADM-007 |
| **Screen ID** | ADM-007 |
| **Name** | Audit Log Viewer |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Security admin |
| **Journey phase** | Ops |
| **Shell** | Admin |
| **Objectives** | Query security and ops audit events; export under policy; no silent tamper |
| **Entry** | ADM-001 · deep links from ADM-002/003/005 |
| **Exit** | ADM-001 · case deep-link |
| **Primary actions** | Query · Open event detail |
| **Secondary actions** | Export (policy) · Correlate user |
| **Related capabilities** | CAP-TRU-005 · CAP-TRU-009 |
| **Unresolved** | Retention windows · export format legal |

```text
┌──────────────────────────────────────────────────────────────┐
│ [ENV / ROLE BANNER]                                          │
│ Audit Log Viewer                                             │
├──────────────────────────────────────────────────────────────┤
│ Query                                                        │
│ Time range · actor · subject user · action type · env        │
│ [Search]                                                     │
├──────────────────────────────────────────────────────────────┤
│ Results                                                      │
│ TS · Actor · Action · Subject · Outcome · Correlation ID     │
│ • … entitlement.correct …                                    │
│ • … moderation.decision …                                    │
│ • … session.revoke_all …                                     │
│                                                              │
│ Detail pane                                                  │
│ Immutable payload summary · before/after (if recorded)       │
│ [Copy correlation ID]  [Export selection — policy gated]     │
│ Empty: “No events for filters.”                              │
└──────────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Permission** | Security role; others locked with explain |
| **Offline** | Query needs online |
| **Mobile** | Filters collapse; result list |
| **A11y** | Table headers; detail readable |
| **Analytics** | `audit_query` · `audit_export` (meta-audited) |
| **Security** | Viewer access itself audited; no delete of events in UI |

**Acceptance criteria**

1. Can filter by actor/subject/action/time/env.
2. Detail immutable; export policy-gated.
3. Environment/role banner present.

---

## Lock status summary

| Wireframe ID | Screen ID | Status |
|--------------|-----------|--------|
| GHV-WF-ADM-001 | ADM-001 | LOCKED AT LOW FIDELITY |
| GHV-WF-ADM-002 | ADM-002 | LOCKED AT LOW FIDELITY (FAMILY) |
| GHV-WF-ADM-003 | ADM-003 | LOCKED AT LOW FIDELITY |
| GHV-WF-ADM-004 | ADM-004 | LOCKED AT LOW FIDELITY (FAMILY · Evidence admin) |
| GHV-WF-ADM-005 | ADM-005 | LOCKED AT LOW FIDELITY (Commercial admin) |
| GHV-WF-ADM-006 | ADM-006 | LOCKED AT LOW FIDELITY (FAMILY) |
| GHV-WF-ADM-007 | ADM-007 | LOCKED AT LOW FIDELITY |
| ENV/ROLE banner | All ADM | LOCKED AT LOW FIDELITY |
