# Commercial Wireframes (PAY)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-PAY-PACK |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.19–3.20 · [CRITICAL-FLOWS.md](../../interactions/CRITICAL-FLOWS.md) · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · [PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md) · [PUBLIC-WIREFRAMES.md](../public/PUBLIC-WIREFRAMES.md) · [CAPABILITY-REGISTRY.md](../../CAPABILITY-REGISTRY.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Payment provider — **PENDING TECHNICAL VALIDATION** · Invoice/VAT e-invoice wording — **PENDING EXTERNAL VALIDATION** · Merit criteria — **PENDING GHV.PROGRESSION.1 / GHV.LEARNING.1** · Refund legal copy — **PENDING EXTERNAL VALIDATION** |
| **Change history** | 1.0.0 — PD.3 initial low-fidelity pack |

**Authority:** Screen IDs from Master Screen Registry only. Wireframe IDs `GHV-WF-PAY-00N`.

**Shell:** Commercial ([PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md)).

**Happy paths:** FLOW-013 Subscription Purchase · FLOW-014 Failed Renewal and Grace · FLOW-004 Merit alternative · FLOW-005 Capacity.

---

## Ethical plan rules (pack-wide)

Applies to PUB-005, PAY-001…006, entitlement locks, and grace surfaces.

1. **No fake urgency** — no countdown scarcity, “only N left,” or invented deadline pressure. Real timers allowed only for OTP, checkout session expiry, or grace end date.
2. **Open Flight always visible** — free path equal-weight with paid plans; never buried behind paid-only layout or “incomplete” framing.
3. **Merit always visible when applicable** — when entitlement is missing and Merit is eligible/signaled, Merit path appears (PAY-006); never hidden to force paid upgrade.
4. **No deceptive Expedition preselect** — default selection is current plan, Open Flight, or none; never silently preselect Expedition Pass as “recommended” to inflate conversion.
5. **Free users are not incomplete** — Open Flight / free status is a valid Access Plan, not a deficit, warning, or “finish setup” paywall.
6. **Payment ≠ Skill** — copy never claims payment buys Mastery, Rank, Prestige, Evidence, or Wings Claimed. Plans buy Access / concurrency entitlement only.
7. **Prices authoritative in Scope** — display summaries only; full matrix and concurrency in [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.19.
8. **Provider PENDING** — checkout UI shows method placeholders; do not name a contracted PSP until validation closes.

### Price summary (non-authoritative display aid)

| Plan | Monthly (VAT-incl.) | Annual (VAT-incl.) | Concurrent Routes |
|------|--------------------:|-------------------:|------------------:|
| Open Flight | Free | Free | 1 |
| Flight Pass | SAR 50 | SAR 480 | 2 |
| Wing Pass | SAR 90 | SAR 864 | 3 |
| Expedition Pass | SAR 149 | SAR 1,430.40 | 5 |

Annual ≈ **20% off** monthly baseline. Full rules, grace (7 calendar days), refund baseline, fee assumptions: **Scope §3.19**.

---

## Index

| Wireframe ID | Screen ID | Name | Detail level |
|--------------|-----------|------|--------------|
| GHV-WF-PAY-001 | PAY-001 | Plans | DETAILED |
| GHV-WF-PAY-002 | PAY-002 | Checkout | DETAILED |
| GHV-WF-PAY-003 | PAY-003 | Payment Result | DETAILED |
| GHV-WF-PAY-004 | PAY-004 | Subscription Manage | DETAILED |
| GHV-WF-PAY-005 | PAY-005 | Invoices | FAMILY |
| GHV-WF-PAY-006 | PAY-006 | Merit Grants | DETAILED |
| — | — | Grace / recovery interaction | DETAILED (banner + PAY-004) |

---

## Sequence overview

```text
Contextual entitlement / PUB-005 (auth)
  → PAY-001 Plans
  → PAY-002 Checkout
  → PAY-003 Payment Result
  → return Route / SKY-001 / ONB-010

Account / manage
  → PAY-004 Subscription Manage
  → PAY-001 (change) · PAY-005 (invoices) · PAY-006 (Merit)

Renewal fail (FLOW-014)
  → Grace banner (any shell) → PAY-004 update payment
  → success resume  OR  downgrade Open Flight (preserve work)
```

---

## GHV-WF-PAY-001 — Plans

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-PAY-001 |
| **Screen ID** | PAY-001 |
| **Name** | Plans |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | A1+ |
| **Journey phase** | Commercial |
| **Shell** | Commercial |
| **Objectives** | Compare Access Plans ethically; select a plan or Merit path; keep Open Flight first-class |
| **Entry** | Nav · entitlement Explainable Lock · ONB-010 · PUB-005 after auth · PAY-004 change |
| **Exit** | PAY-002 · PAY-006 · prior context (Save for later) · SKY-001 |
| **Primary actions** | Select plan → Checkout · Continue on Open Flight |
| **Secondary actions** | Merit path · Billing period toggle · Compare capacity · Back |
| **Related capabilities** | CAP-PAY-001 · CAP-PAY-002 · CAP-PAY-005 |
| **Unresolved** | Locale currency formatting · final “recommended” badge policy (must not deceive) |

**Content hierarchy:** Ethical frame → current entitlement → Open Flight → paid plans equal weight → Merit strip → footnotes (Scope link).

```text
┌──────────────────────────────────────────────────────────────┐
│ Plans · Access (not Skill)                                   │
│ Payment does not buy Mastery, Rank, Prestige, or Evidence    │
├──────────────────────────────────────────────────────────────┤
│ Current: Open Flight | Flight | Wing | Expedition | Merit…   │
│ Free status = complete Access Plan (not incomplete)          │
├──────────────────────────────────────────────────────────────┤
│ Billing: (●) Monthly  ( ) Annual  (~20% off — Scope §3.19)   │
│                                                              │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐│
│ │Open Flight │ │Flight Pass │ │Wing Pass   │ │Expedition  ││
│ │FREE        │ │50 / 480    │ │90 / 864    │ │149 /1430.40││
│ │1 Route     │ │2 Routes    │ │3 Routes    │ │5 Routes    ││
│ │[Continue]  │ │[Select]    │ │[Select]    │ │[Select]    ││
│ │current? ✓  │ │            │ │            │ │ no auto-sel││
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘│
│ No fake scarcity · prices VAT-inclusive · Scope authoritative│
├──────────────────────────────────────────────────────────────┤
│ Merit Access (when eligible)                                 │
│ [View Merit Grants → PAY-006]  never replaces Evidence       │
├──────────────────────────────────────────────────────────────┤
│ [Back / Save for later]                                      │
└──────────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading** | Skeleton cards; Open Flight CTA available if catalogue slow |
| **Empty** | Catalogue fail → Open Flight + retry; never blank paid-only |
| **Error / offline** | Offline: view cached plan matrix read-only; checkout disabled |
| **Locked** | If assurance/restricted blocks purchase → Explainable Lock + TRU path |
| **Mobile** | Stack; Open Flight first; sticky ethical note |
| **Desktop** | Equal card row; Expedition not visually dominating |
| **A11y** | Selection via radio/button state, not color-only “best” |
| **RTL / LTR** | Mirror card order; currency locale |
| **Analytics** | `pay_plans_view` · `plan_select` · `open_flight_continue` · `merit_open` |
| **Security / audit** | No PAN; selection only |

**Acceptance criteria**

1. Open Flight visible without scroll-past-paid-only layout.
2. No Expedition (or any plan) preselected deceptively.
3. Free / Open Flight never framed as incomplete.
4. Merit entry visible when applicable.
5. Prices summarized; deep link/footnote to Scope §3.19.
6. Select paid → PAY-002; Continue Open Flight → prior learning context.

---

## GHV-WF-PAY-002 — Checkout

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-PAY-002 |
| **Screen ID** | PAY-002 |
| **Name** | Checkout |
| **Scope** | CONTROLLED LAUNCH (provider PENDING) |
| **User type** | A1+ |
| **Journey phase** | Commercial |
| **Shell** | Commercial |
| **Objectives** | Confirm plan, period, and payment method; start subscription charge |
| **Entry** | PAY-001 select · ONB-010 path · capacity upgrade |
| **Exit** | PAY-003 · PAY-001 · cancel to prior |
| **Primary actions** | Pay / Confirm |
| **Secondary actions** | Change plan · Change period · Legal links · Cancel |
| **Related capabilities** | CAP-PAY-003 · CAP-PAY-004 |
| **Unresolved** | Exact PSP widget · mada/wallet method matrix (targets in Scope) |

**Content hierarchy:** Order summary → method → legal → Pay.

```text
┌──────────────────────────────────────────────────────────────┐
│ Checkout                                                     │
├────────────────────────────┬─────────────────────────────────┤
│ Order                                        │ Trust note    │
│ Plan: Flight Pass (example)                  │ Access only   │
│ Period: Monthly | Annual                     │ Provider:     │
│ Amount: SAR … (VAT-inclusive)                │ PENDING       │
│ Concurrent Routes: N (Scope)                 │               │
│                                              │               │
│ Payment method (placeholders)                │               │
│ ○ mada  ○ Card  ○ Apple Pay  ○ Google Pay    │               │
│ ○ Samsung Pay  (where supported)             │               │
│ [PSP widget / redirect — PENDING]            │               │
│                                              │               │
│ □ Agree Terms / billing notice (if required) │               │
├────────────────────────────┴─────────────────────────────────┤
│ [Cancel]  [Change plan → PAY-001]            [Pay → PAY-003] │
└──────────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading** | Pay disabled until method ready; spinner on submit |
| **Error** | Soft field / method errors; no silent charge |
| **Offline** | Pay disabled; preserve order draft |
| **Mobile** | Single column; sticky Pay |
| **Desktop** | Summary + method columns |
| **A11y** | Amount announced; focus trap in PSP if modal |
| **Analytics** | `checkout_start` · `checkout_submit` · `checkout_cancel` |
| **Security / audit** | No raw card data in product UI; provider handles PCI |

**Acceptance criteria**

1. Amount matches selected Scope baseline (VAT-inclusive).
2. Provider labeled PENDING until validation.
3. Cancel returns without charge; Change plan → PAY-001.
4. Success/fail always lands PAY-003 (never ambiguous toast-only).

---

## GHV-WF-PAY-003 — Payment Result

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-PAY-003 |
| **Screen ID** | PAY-003 |
| **Name** | Payment Result |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | A1+ |
| **Journey phase** | Commercial |
| **Shell** | Commercial |
| **Objectives** | Communicate success, failure, or pending; update entitlement narrative; return learner |
| **Entry** | PAY-002 / provider return |
| **Exit** | SKY-001 · return Route / ONB-010 · PAY-002 retry · PAY-004 |
| **Primary actions** | Continue (success) · Retry (fail) |
| **Secondary actions** | Manage subscription · Invoices · Merit (if still blocked) |
| **Related capabilities** | CAP-PAY-003 · CAP-PAY-004 |
| **Unresolved** | Pending/async payment status copy variants |

### Success

```text
┌──────────────────────────────────────────────────────────────┐
│ Payment successful                                           │
│ Access updated — not Skill / Mastery                         │
├──────────────────────────────────────────────────────────────┤
│ Plan: … · Period: … · Next renewal: …                        │
│ Concurrent Routes now: N                                     │
│ [Continue → prior Route / SKY-001]                           │
│ [Manage subscription → PAY-004]  [Invoices → PAY-005]        │
└──────────────────────────────────────────────────────────────┘
```

### Failure / cancelled

```text
┌──────────────────────────────────────────────────────────────┐
│ Payment not completed                                        │
│ No entitlement change · Open Flight / prior plan unchanged   │
├──────────────────────────────────────────────────────────────┤
│ Reason (provider-safe) · [Retry → PAY-002]                   │
│ [Back to Plans → PAY-001]  [Merit → PAY-006 if applicable]   │
│ [Continue learning on current Access]                        │
└──────────────────────────────────────────────────────────────┘
```

### Pending

```text
┌──────────────────────────────────────────────────────────────┐
│ Payment pending confirmation                                 │
│ We will update Access when confirmed — no fake urgency       │
│ [Check status]  [Go to Skyboard]  [Manage → PAY-004]         │
└──────────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading** | Confirming entitlement sync before success Continue |
| **Error** | If entitlement lag → pending state, not false success |
| **Mobile / desktop** | Centered result; primary Continue sticky |
| **A11y** | Status as live region |
| **Analytics** | `pay_result_success` · `pay_result_fail` · `pay_result_pending` |
| **Security / audit** | Receipt id / provider ref shown; audited downstream |

**Acceptance criteria**

1. Success does not claim skill purchase.
2. Failure preserves prior Access; Open Flight still available.
3. Continue returns to contextual learning path (FLOW-013).

---

## GHV-WF-PAY-004 — Subscription Manage

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-PAY-004 |
| **Screen ID** | PAY-004 |
| **Name** | Subscription Manage |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Subscriber / payer / grace user (also Open Flight viewers) |
| **Journey phase** | Commercial |
| **Shell** | Commercial |
| **Objectives** | Show plan status; update payment; change/cancel; surface grace recovery |
| **Entry** | Account · grace banner · PAY-003 · capacity lock |
| **Exit** | PAY-001 · PAY-002 · PAY-005 · PAY-006 · SKY-001 |
| **Primary actions** | Update payment method · Change plan |
| **Secondary actions** | Cancel / downgrade to Open Flight · Invoices · Merit |
| **Related capabilities** | CAP-PAY-003 · CAP-PAY-007 |
| **Unresolved** | Cancel retention copy (no deceptive dark patterns) |

```text
┌──────────────────────────────────────────────────────────────┐
│ Subscription                                                 │
│ ┌─ Status ─────────────────────────────────────────────────┐ │
│ │ Plan: Wing Pass (example) · Monthly | Annual             │ │
│ │ Status: Active | Grace (ends DATE) | Cancelled | Open…   │ │
│ │ Concurrent Routes: used U / capacity C (Scope §3.19)     │ │
│ │ Next bill / grace end: …                                 │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ Payment method                                               │
│ •••• 4242  [Update method]  [Retry payment]  ← grace primary │
│                                                              │
│ [Change plan → PAY-001]  [Invoices → PAY-005]                │
│ [Merit Grants → PAY-006]                                     │
│                                                              │
│ Downgrade / cancel                                           │
│ [Switch to Open Flight] — preserves completed work           │
│ [Cancel paid plan…] — consequence sheet; no fake urgency     │
├──────────────────────────────────────────────────────────────┤
│ Refund baseline: 7 calendar days — PENDING LEGAL wording     │
└──────────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Grace** | Primary = Update / Retry; secondary = Open Flight downgrade |
| **Loading / error / offline** | Method update needs online; offline shows status only |
| **Empty** | Open Flight user: show free plan as valid; offer upgrade without incompleteness |
| **Mobile** | Stack; grace actions first |
| **A11y** | Status text + date, not color alone |
| **Analytics** | `sub_manage_view` · `payment_update` · `downgrade_open_flight` · `cancel_start` |
| **Security / audit** | Method change may require step-up (link TRU-003) |

**Acceptance criteria**

1. Open Flight users see a complete free plan, not a broken/incomplete account.
2. Cancel/downgrade preserves completed work (Scope Merit/grace policy).
3. Grace recovery primary path is here (see Grace section).

---

## Grace / recovery interaction (FLOW-014)

**Surfaces:** Persistent grace **banner** (Core/Commercial shells) + **PAY-004** recovery. Banner alone is insufficient for recovery actions that mutate billing.

### Banner (any entitled shell — e.g. SKY-001)

```text
┌──────────────────────────────────────────────────────────────┐
│ ⚠ Billing grace · ends DATE (7 calendar days — Scope §3.19)  │
│ Completed work stays. [Update payment → PAY-004]  [Details]  │
└──────────────────────────────────────────────────────────────┘
```

Rules:

- Banner priority with restricted/terms/offline (see CORE-WIREFRAMES).
- No fake urgency beyond real grace end date.
- Does **not** interrupt active Mission canvas mid-step (MISSION-WORKSPACE); surfaces before entry / on Safe Exit return.
- Merit alternative may appear as secondary Skyboard card when eligible — not a fourth competing priority without rules.

### Recovery on PAY-004

| Outcome | UI |
|---------|-----|
| Retry success | Clear grace → PAY-003-like confirmation or inline success → resume entitled Routes |
| Retry fail | Remain in grace until end date; explain next attempt |
| User chooses Open Flight | Downgrade; capacity → 1 Route; preserve completed work; clear paid entitlement |
| Grace expires without fix | Automatic downgrade Open Flight; notify; preserve work |

**Acceptance:** FLOW-014 — grace banner → update payment → success **or** Open Flight downgrade; work preserved.

---

## Family — PAY-005 Invoices (GHV-WF-PAY-005)

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-PAY-005 |
| **Screen ID** | PAY-005 |
| **Name** | Invoices |
| **Detail** | FAMILY (list + detail sheet) |
| **Scope** | PENDING EXTERNAL VALIDATION (VAT / e-invoice) |
| **Entry** | PAY-004 · Account |
| **Exit** | PAY-004 · download |

```text
┌──────────────────────────────────────────────────────────────┐
│ Invoices                                                     │
│ VAT / e-invoice fields: PENDING EXTERNAL VALIDATION          │
├──────────────────────────────────────────────────────────────┤
│ Filters: period · status                                     │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 2026-07-01 · Flight Pass · SAR 50 · Paid · [PDF]         │ │
│ │ 2026-06-01 · Flight Pass · SAR 50 · Paid · [PDF]         │ │
│ │ …                                                        │ │
│ └──────────────────────────────────────────────────────────┘ │
│ Empty: “No invoices yet.” · [Back to Subscription]           │
└──────────────────────────────────────────────────────────────┘
```

| Shared | Behavior |
|--------|----------|
| **List** | Chronological; status Paid / Open / Refunded (labels pending legal) |
| **Detail / PDF** | Download or provider-hosted receipt; no skill language |
| **Error / offline** | Cached list if any; download needs online |
| **A11y** | Table or list with amount + date announced |
| **Security** | Authz: payer only; audit download |

**Acceptance:** Invoices reachable from PAY-004; PENDING legal labeled; no payment≠skill confusion.

---

## GHV-WF-PAY-006 — Merit Grants

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-PAY-006 |
| **Screen ID** | PAY-006 |
| **Name** | Merit Grants |
| **Scope** | CONTROLLED LAUNCH (criteria PENDING) |
| **User type** | A1+ |
| **Journey phase** | Commercial / Opportunity |
| **Shell** | Commercial |
| **Objectives** | Show Merit Access paths and grants; activate eligible grant; never replace Evidence |
| **Entry** | PAY-001 · entitlement lock · awards · Account |
| **Exit** | SKY-001 · Route resume · PAY-001 · Evidence/Mission progress |
| **Primary actions** | Activate eligible grant · Continue requirements |
| **Secondary actions** | Compare paid plans · Back |
| **Related capabilities** | CAP-PAY-005 · CAP-PAY-006 (scholarships post-launch) |
| **Unresolved** | Exact Merit criteria — PENDING PROGRESSION.1 / LEARNING.1 |

```text
┌──────────────────────────────────────────────────────────────┐
│ Merit Access                                                 │
│ Earn or receive Access — does not replace Evidence / Skill   │
│ Criteria detail: PENDING GHV.PROGRESSION.1 / LEARNING.1      │
├──────────────────────────────────────────────────────────────┤
│ Active grants                                                │
│ • Temporary Wing Pass Grant · expires DATE · [Manage]        │
│                                                              │
│ Available / in progress                                      │
│ ○ Mission Grant — progress bar / requirements placeholder    │
│ ○ Route Grant — …                                            │
│ ○ Cross-Wing Grant — …                                       │
│ ○ Prestige / partner / scholarship (if signaled)             │
│                                                              │
│ [Activate grant] when eligible                               │
│ [Continue requirements → Mission / Evidence]                 │
│ [Compare Access Plans → PAY-001]  secondary, not dominant    │
├──────────────────────────────────────────────────────────────┤
│ On expiry: preserve completed work + grace (Scope §3.20)     │
└──────────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Empty** | Explain Merit; show how to become eligible; never imply “buy Merit” |
| **Locked** | Explainable Lock with missing requirement; path to Evidence |
| **Loading / error** | Soft retry; paid plans still secondary |
| **Mobile / desktop** | List + detail; Activate sticky when eligible |
| **A11y** | Progress not color-only |
| **Analytics** | `merit_view` · `merit_activate` · `merit_continue_req` |
| **Security / audit** | Grant activation audited; no self-serve fake grants |

**Acceptance criteria**

1. Merit visible from entitlement/plans flows when applicable.
2. Activate never claims Skill purchase.
3. Paid plans secondary; Open Flight still valid alternative.
4. Criteria placeholders labeled PENDING.

---

## Lock status summary

| Wireframe ID | Screen ID | Status |
|--------------|-----------|--------|
| GHV-WF-PAY-001 | PAY-001 | LOCKED AT LOW FIDELITY |
| GHV-WF-PAY-002 | PAY-002 | LOCKED AT LOW FIDELITY |
| GHV-WF-PAY-003 | PAY-003 | LOCKED AT LOW FIDELITY |
| GHV-WF-PAY-004 | PAY-004 | LOCKED AT LOW FIDELITY |
| GHV-WF-PAY-005 | PAY-005 | LOCKED AT LOW FIDELITY (FAMILY) |
| GHV-WF-PAY-006 | PAY-006 | LOCKED AT LOW FIDELITY |
| Grace banner + PAY-004 | FLOW-014 | LOCKED AT LOW FIDELITY |
