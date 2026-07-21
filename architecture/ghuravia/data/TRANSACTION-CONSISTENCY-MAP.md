# Transaction and Consistency Map

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-TX-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §17 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-003 · SPK-ARC-009 · SPK-ARC-010 · SPK-ARC-011 · SPK-ARC-012 · SPK-ARC-013 · SPK-ARC-019 |
| **Related** | [DATA-ARCHITECTURE-VALIDATION-PLAN.md](./DATA-ARCHITECTURE-VALIDATION-PLAN.md) · [BACKEND-API-VALIDATION-PLAN.md](../backend/BACKEND-API-VALIDATION-PLAN.md) |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
NO Product Code · NO schema · NO runtime transactions implemented
```

## 1. Purpose

Classify governed operations (Gate §17) by source of truth, transaction boundary, consistency model, idempotency, audit, reversal, downstream recalculation, and failure behavior.

Consistency codes:

| Code | Meaning |
|------|---------|
| **SC** | Strong consistency within declared boundary |
| **EC** | Eventual consistency for projections / delivery |
| **APPEND** | Append-only event with compensating reverse |
| **HUMAN** | Requires human decision before final effect |

## 2. Operation map

| Operation | Source of truth | Transaction boundary | Consistency | Idempotency key (conceptual) | Audit record | Reversal | Downstream recalculation | Failure behavior |
|-----------|-----------------|----------------------|-------------|------------------------------|--------------|----------|--------------------------|------------------|
| Account creation | Identity store | Create account claim + initial activation = incomplete | SC | `account_create:{client_request_id}` | Account created | Soft-delete / support path | None (no progression) | No partial “activated” account |
| Email-verification result | Activation / verification service | Token consume → result state (ACT-011) | SC | `email_verify:{token_id}` or `{request_id}` | Verify success/fail/expired | New request supersedes; no un-verify without admin | Unlock next activation step only | Remain pending (ACT-003); no activation complete |
| Activation completion | Activation aggregate | Evaluate `email_verified` + `current_terms_accepted` + `account_risk_status=acceptable` → ACT-006 | SC | `activation_complete:{account_id}:{formula_version}` | Activation completed | Admin revoke activation (rare) | Entitlement/eligibility recompute — **not** XP | Fail closed; stay incomplete; surface ACT-012 |
| Terms acceptance | Legal acceptance store | Bind terms version + timestamp + account | SC | `terms_accept:{account_id}:{terms_version}` | Terms accepted | New version requires re-accept | Activation recompute | Prior version retained historically |
| Mission completion | Mission state | Complete mission instance under eligibility | SC | `mission_complete:{mission_attempt_id}` | Mission completed | Correction / reopen policy | May emit progression events if governed | No double-complete; explainable lock if ineligible |
| Evidence submission | Evidence metadata (+ object ref) | Submit metadata + object pointer; quarantine if needed | SC meta | `evidence_submit:{upload_id}` | Submitted | Withdraw if policy | Review queue | Object fail → no “submitted” without meta integrity |
| Evidence approval | Review decision | Approve/reject under rubric | SC + HUMAN | `evidence_review:{evidence_id}:{decision_id}` | Review decision | Revocation / appeal | **Targeted** progression recalculation | No progression effect until committed decision |
| Route-Proven grant | Progression / Learning eligibility overlay | Grant Route-Proven from Evidence rules | SC / APPEND | `route_proven:{account_id}:{route_id}:{evidence_set_hash}` | Grant | Revoke via correction | Unlock graph eligibility; ledgers | Must not grant via payment alone |
| Evidence revocation | Review / Trust | Revoke prior approval | SC + APPEND | `evidence_revoke:{evidence_id}:{revocation_id}` | Revocation | May re-approve after appeal | Cascade progression reverse | Fail closed on standing until cascade done |
| XP event | Progression event log | Append XP event with validity state | APPEND | `prg_event:{event_type}:{dedupe_key}` | Event + validity | Reverse / supersede event | Ledger rebuild / partial recompute | Duplicate key → no double apply |
| Momentum update | Progression event / season | Apply Momentum formula versioned | APPEND | `mom_event:{account_id}:{season_id}:{window_key}` | Event | Reverse | Season standing | Late events ordered by policy |
| Entitlement grant | Entitlement store | Grant Access Plan / Merit access | SC | `entitlement:{account_id}:{plan_or_grant_id}:{effect_id}` | Entitlement change | Expire / revoke | Access only — **never** progression value | Payment success without webhook → pending reconcile |
| Payment reconciliation | Commercial ledger | Match provider event → entitlement effect | SC + idempotent | `pay_reconcile:{provider_event_id}` | Payment + entitlement link | Refund / chargeback flows | Entitlement only | Duplicate webhook ignored; delay ≠ deny forever |
| Team contribution approval | Live / Learning | Approve contribution recognition | SC + HUMAN where required | `team_contrib:{event_id}:{contribution_id}` | Approval | Revoke | Possible progression event | No duplicate contribution credit |
| Moderation action | Moderation case | Action on content / user | SC | `mod_action:{case_id}:{action_id}` | **Mandatory** | Appeal / undo | Search removal; Trust signals | Content stays restricted on tool fail |
| Trust restriction | Trust standing | Apply POL-TRU restriction | SC | `trust_restrict:{account_id}:{policy_version}:{case_id}` | Trust change | Lift / expire | Eligibility / visibility | Prefer false-open investigation over silent |
| Title grant | Titles / progression | Grant professional title eligibility outcome | SC + HUMAN as required | `title_grant:{account_id}:{title_id}:{decision_id}` | Grant | Revoke | Profile display | No pay-to-title |
| Prestige grant | Prestige panel | Human quorum decision | HUMAN + SC record | `prestige_grant:{account_id}:{cycle_id}:{decision_id}` | Panel decision | Panel reverse | Standing + display | No automated prestige from payment |
| Correction and appeal resolution | Governance / Progression | Apply correction cascade (POL-COR) | SC + APPEND | `correction:{case_id}:{resolution_id}` | Full before/after | Compensating correction | Targeted ledger rebuild | Partial apply forbidden |

## 3. Global rules

1. **Idempotency:** Every mutating operation above must declare a stable key before implementation.
2. **Commercial → Entitlement only:** Payment/commercial events never write XP, Mastery, Momentum, Prestige, or Trust.
3. **Notification failure ≠ business state change.**
4. **Search / projection lag ≠ source of truth.**
5. **Activation state is server-authoritative** (screens ACT-003/011/012/005/013/006 are projections).

## 4. Validation method (future)

| Evidence | Spike |
|----------|-------|
| Duplicate event / webhook tests | SPK-ARC-010 · SPK-ARC-012 |
| Evidence approve → targeted recalc | SPK-ARC-009 |
| Formula-version historical reproduction | SPK-ARC-011 |
| Activation formula atomicity | SPK-ARC-003 |
| Privileged correction audit | SPK-ARC-019 |

## 5. Limitations

```text
MAP ONLY · NOT RUN · NO runtime transaction manager selected
Draft keys are conceptual names, not schema fields
```

## 6. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §17 — operation consistency map |
