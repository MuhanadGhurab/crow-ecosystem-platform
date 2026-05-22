# Crow Ecosystem — roadmap

**Last updated:** May 2026  
**North star diagram:** [`ARCHITECTURE_DIAGRAM.md`](ARCHITECTURE_DIAGRAM.md)  
**Current execution:** [`WHATS_NEXT.md`](WHATS_NEXT.md) · [`PHASE8.md`](PHASE8.md)  
**Build status:** [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md)

Phases **1–7** are complete. All new work should map to a box in the architecture diagram.

---

## Completed phases

| Phase | Focus | Doc |
|-------|--------|-----|
| 1 | Implementation pipeline | [`PHASE1_PIPELINE.md`](PHASE1_PIPELINE.md) |
| 2 | Supabase auth | [`PHASE2_AUTH.md`](PHASE2_AUTH.md) |
| 3 | Tenant ops & admin hubs | [`PHASE3.md`](PHASE3.md) |
| 4 | CEM identity & membership | [`PHASE4.md`](PHASE4.md) |
| 5 | SAREA studio, HR/CRM, invites | [`PHASE5.md`](PHASE5.md) |
| 6 | Notifications, shells, CyberCrow pages | [`PHASE6.md`](PHASE6.md) |
| 7 | Diagram alignment: readiness, engines, commercial, health | [`PHASE7.md`](PHASE7.md) |
| 8 | CI, readiness gate, retail template | [`PHASE8.md`](PHASE8.md) (partial) |

---

## Next — Phase 8+ backlog

### Still important (from diagram gaps)

- Stripe billing (layer 05) — scaffold started, see [`STRIPE_BILLING.md`](STRIPE_BILLING.md)  
- Additional ERP modules (layer 06)  
- Public marketing content (layer 01)  

### Recently completed (Phase 8)

- Microsoft Entra SSO (layer 09) — [`ENTRA_SSO.md`](ENTRA_SSO.md)  
- GitHub Actions CI/CD (layer 10) — `.github/workflows/ci.yml`  
- Dev without paused DB — [`DEV_WITHOUT_DB.md`](DEV_WITHOUT_DB.md)  

---

## Diagram gap priorities (why this order)

1. **Readiness (7.1)** — Operationalizes the bottom checklist; prevents premature go-live.  
2. **SAREA runtime (7.2)** — Delivers the “adapts” promise users can see in 30 seconds.  
3. **CyberCrow enforce (7.3)** — Delivers the “protects” promise for your security brand.  
4. **Industry template (7.4)** — Speeds discovery for vertical demos (logistics first).  
5. **Commercial (7.5)** — Closes the left-column gap before revenue.  
6. **Health (7.6)** — Starts step 13 continuous improvement.  

---

## Definition of done

- Maps to a section in [`ARCHITECTURE_DIAGRAM.md`](ARCHITECTURE_DIAGRAM.md)  
- Prisma queries scoped by `tenantId` / `requestId` / `blueprintId`  
- Server actions use `requirePlatformStaff()` or `requireTenantAccess(slug)`  
- `npm run typecheck` and `npm run build` pass  
- [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md) updated  

---

## Out of scope (for now)

- Multi-region deployment  
- Native mobile apps  
- Full GRC/SIEM product (beyond seeded posture)  
- Replacing `HTML_proc/` (design reference only)  
