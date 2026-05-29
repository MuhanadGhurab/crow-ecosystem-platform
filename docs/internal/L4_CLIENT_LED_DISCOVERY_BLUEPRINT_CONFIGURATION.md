# L4 — Client-Led Discovery & Blueprint Configuration Foundation

**Status:** Foundation shipped (no schema migration)  
**Date:** 2026-05-29

## Concept

Clients complete **advisory** discovery on a linked implementation request. ProCrow reviews submissions and owns blueprint generation, final proposal/pricing, tenant runtime preparation, CyberCrow baseline, SAREA profiles, and go/no-go.

## Audit result (persistence)

| Store | Use in L4 |
|-------|-----------|
| `DiscoveryProfile` + `DiscoveryAnswer` (`sectionKey: client_discovery`) | Status, stage, preferences, submit timestamp |
| `ImplementationRequest` | `employeeBand`, `industry` |
| `RequestedModule` | Client-selected modules |
| `DiscoveryDepartment` / `DiscoveryRole` / `DiscoveryWorkflow` | Structured selections synced on save |
| `EnterpriseBlueprint` | **ProCrow-only** — not mutated by client actions |

**Migration:** Not required for L4. Full L4B could add dedicated columns or JSON if client_discovery answers become heavy.

## Routes & UI

- Client: `/client/requests/[requestId]/discovery` — multi-section wizard
- Client request detail: discovery status card + CTA
- Client company: missing fields link to discovery steps (K2.6 quick employee band edit retained)
- ProCrow: `AdminClientDiscoveryPanel` on `/admin/requests/[requestId]`

## Stage templates

`startup` | `growth` | `enterprise` — advisory module/workflow intensity in `client-discovery-stage-templates.ts`.

## Industry integration

Recommendations from `MODELED_SECTOR_CATALOG`, `getDiscoveryTemplate`, and `getSectorTemplateModel` with general fallback.

## Safety

- Ownership: `resolveCanClientEditCompanyProfile` (strong submitter or `canApproveScope`; blocks email-only)
- No blueprint approval, tenant provisioning, pricing finalization, or `platform_admin` assignment
- Submit sets `client_discovery.status = submitted_for_procrow_review` only

## Verification

```bash
npm run client-discovery:verify
```

## Remaining gaps (L5+)

- ProCrow “accept discovery into blueprint” workflow automation
- Discovery-to-blueprint diff / change-request loop (`changes_requested` status)
- Optional pricing estimate refresh on client save (currently advisory copy only)
- Dedicated L4B migration if `client_discovery` JSON outgrows answers table

## Recommended next phase

**L5 — Discovery-to-Blueprint ProCrow Review** (operator accept/reject, blueprint draft sync)
