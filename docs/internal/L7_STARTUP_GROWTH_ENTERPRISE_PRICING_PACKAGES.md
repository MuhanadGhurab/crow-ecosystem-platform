# L7 — Startup / Growth / Enterprise Pricing Package Templates

**Status:** Shipped (29 May 2026)  
**Depends on:** L4 discovery · L6 ProCrow review

## Audit (pre-L7)

| Area | Finding |
|------|---------|
| Pricing engine | `pricing.service.ts` + `commercial.service.ts` (SAR estimates) |
| Stage hints | L4 `client-discovery-stage-templates.ts` already advisory |
| Proposal | ProCrow `sendCommercialProposal` — unchanged |
| Storage | Package preference in `DiscoveryAnswer` `client_discovery/*` + review notes |

## Implementation

| Piece | Path |
|-------|------|
| Contract | `src/lib/pricing/pricing-package-contract.ts` |
| Templates | `src/lib/constants/pricing-package-templates.ts` |
| Service | `src/lib/services/pricing-package-recommendation.service.ts` |
| Client preference | `src/lib/actions/pricing-package-preference.ts` |
| ProCrow UI | `admin-procrow-pricing-package-panel.tsx` |
| Client UI | `client-pricing-package-panel.tsx` |

## Rules

- Accepted discovery → strongest recommendation signal
- Draft/submitted → advisory with “not final” warning
- No checkout, payment activation, tenant provisioning, or auto proposal approval
- Client package changes → review note (`scope_clarification` / `pricing_package`) + answer metadata

## Verification

```bash
npm run pricing-packages:verify
npm run procrow-discovery:verify
npm run client-discovery:verify
```

## Gaps (L8+)

- Dedicated ProCrow “apply package to proposal draft” sync
- Client notification inbox for package preference acknowledgment
- Richer industry-specific package overrides

## Recommended next

**M1** — CyberCrow Identity, Compliance & GRC Tenant Readiness  
or **L8** — Package preference workflow refinement
