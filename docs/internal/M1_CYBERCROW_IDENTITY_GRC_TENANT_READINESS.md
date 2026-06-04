# M1 — CyberCrow Identity, Compliance & GRC Tenant Readiness

**Date:** 29 May 2026  
**Mode:** Advisory readiness only — no live Entra sync, no certified compliance, no migrations.

---

## Audit (existing surfaces)

| Area | Status |
|------|--------|
| Tenant CyberCrow routes (`dashboard`, `evidence`, `grc`, `risk`, …) | Existed — extended with M1 trust summary |
| `CYBERCROW_SCOPE` / evidence-GRC services | Advisory — reused |
| ProCrow tenant workbench, request detail, go/no-go | Existed — M1 panels added |
| Entra | Enterprise tier `authMode: entra_id` in `SUBSCRIPTION_TIERS` — **mapping only** |
| Gaps before M1 | No unified tenant trust contract/service; limited identity/access-review copy on ProCrow |

---

## Deliverables

| Item | Path |
|------|------|
| Trust contract | `src/lib/cybercrow/cybercrow-tenant-trust-contract.ts` |
| Identity readiness constants | `src/lib/constants/cybercrow-identity-readiness.ts` |
| GRC readiness constants | `src/lib/constants/cybercrow-grc-readiness.ts` |
| Trust service | `src/lib/services/cybercrow-tenant-trust.service.ts` |
| ProCrow panel | `src/components/admin/admin-cybercrow-trust-readiness-panel.tsx` |
| Tenant dashboard summary | `src/components/tenant/cybercrow/cybercrow-tenant-trust-summary.tsx` |
| Go/No-Go dependency panel | `src/components/procrow/procrow-cybercrow-trust-go-no-go-panel.tsx` |
| Evidence/GRC/risk align | `src/components/tenant/cybercrow/cybercrow-m1-readiness-align.tsx` |
| Verifier | `npm run cybercrow-trust:verify` |

---

## Integration

- **ProCrow tenant** (`/admin/tenants/[tenantId]`): trust panel on Overview + CyberCrow tab.
- **ProCrow request** (`/admin/requests/[requestId]`): preparation preview when tenant missing; live snapshot when tenant exists.
- **Go/No-Go** (`/admin/go-no-go`): dependency panel + `cybercrow-tenant-trust-m1` gate in `procrow-go-no-go.service.ts`.
- **Tenant CyberCrow dashboard**: full trust summary (identity, GRC, evidence, risk, access review, SAREA/CEM/Go-No-Go notes).
- **Evidence / GRC / Risk**: M1 alignment strip from trust snapshot.

---

## SAREA & CEM

- **SAREA:** CyberCrow validates trust and access boundaries; SAREA shapes experience — RBAC enforces access.
- **CEM:** Operations runtime; CyberCrow reviews trust posture around users, roles, modules, workflows.

---

## Verification

```bash
npm run cybercrow-trust:verify
npm run cybercrow:verify
npm run procrow:verify
```

Forbidden in M1 UI: certified compliance, legal audit evidence, SIEM replacement, autonomous remediation, live Entra sync claims.

---

## Remaining gaps

- No live Microsoft Graph / Entra provisioning.
- No access-review workflow engine (M1.1 candidate).
- Per-tenant trust not auto-evaluated inside Go/No-Go Center (operator runs verifier + reviews workbench).

---

## Recommended next

- **M2 — SAREA Blueprint-to-Experience Mapping**, or  
- **M1.1 — CyberCrow Access Review Workflow**
