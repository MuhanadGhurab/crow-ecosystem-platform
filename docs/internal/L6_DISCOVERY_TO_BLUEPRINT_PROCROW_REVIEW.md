# L6 — Discovery-to-Blueprint ProCrow Review

**Status:** Shipped (29 May 2026)  
**Depends on:** L4 (client-led discovery), L5 (access gateway)

## Audit (pre-L6)

| Area | Finding |
|------|---------|
| Client discovery status | `DiscoveryAnswer` section `client_discovery`, key `status` |
| ProCrow visibility | `getClientDiscoveryAdminSummary` on admin request (read-only) |
| Blueprint input | `completeDiscoveryAndCreateBlueprint` exists — **not** auto-run on accept |
| Migrations | Not required — reuse DiscoveryAnswer + DiscoveryProfile |

## Implementation

| Piece | Path |
|-------|------|
| Contract | `src/lib/procrow/procrow-discovery-review-contract.ts` |
| Service | `src/lib/services/procrow-discovery-review.service.ts` |
| Actions | `src/lib/actions/procrow-discovery-review.ts` |
| ProCrow UI | `src/components/admin/admin-procrow-discovery-review-panel.tsx` |
| Client UX | `client-discovery-wizard.tsx`, `client-discovery.service.ts` |

## Status transitions

1. Client submit → `submitted_for_procrow_review`
2. ProCrow **Start review** → `procrow_reviewing`
3. ProCrow **Request changes** → `changes_requested` (+ message/sections in answers)
4. Client resubmit → `submitted_for_procrow_review`
5. ProCrow **Accept into blueprint** → `accepted_into_blueprint` (+ `acceptedBlueprintInput` JSON)

## Safety

- Accept does **not** approve proposal, activate payment, provision tenant, or mark production ready
- Blueprint draft generation remains ProCrow-controlled via existing discovery workspace / `completeDiscovery`
- Runtime preparation gate passes only when `accepted_into_blueprint` (or legacy ProCrow discovery COMPLETED)

## Notifications

In-app `platformNotification` rows (logged delivery, no external email requirement):

- `client_discovery_submitted`
- `procrow_discovery_changes_requested`
- `procrow_discovery_accepted`

## Verification

```bash
npm run procrow-discovery:verify
npm run client-discovery:verify
npm run runtime-readiness-wording:verify
```

## Gaps (L7+)

- Client-facing notification inbox (platform notifications are operator-oriented)
- Auto-sync accepted modules into blueprint modules without explicit ProCrow blueprint generation step
- Reopen accepted discovery (ProCrow-only) if client must revise post-accept

## Recommended next

**L7** — Startup / Growth / Enterprise pricing package templates  
or **M1** — CyberCrow identity, compliance & GRC tenant readiness
