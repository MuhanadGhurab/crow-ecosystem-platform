# Phase 1 — Implementation pipeline

**Status:** Done · **Snapshot:** [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md) · **Next:** [`ROADMAP.md`](ROADMAP.md)

Golden rule: **Discovery understands → Blueprint defines → CEM runs → CyberCrow protects → SAREA adapts.**



## Progress tracker



| # | Deliverable | Route(s) | Status |

|---|-------------|----------|--------|

| 1.1 | Admin request detail + approve/reject/start discovery | `/admin/requests/[id]` | Done |

| 1.2 | Discovery workspace — organization + modules + summary | `/discovery/[id]/*` | Done |

| 1.3 | Complete discovery → draft blueprint | pipeline + summary | Done |

| 1.4 | Blueprint overview + module sync from request | `/blueprints/[id]/overview` | Done |

| 1.5 | Approve blueprint + provision tenant | blueprint overview | Done |

| 1.6 | Tenant dashboard loads real data | `/[tenant]/dashboard` | Done |



## End-to-end test flow



1. **Submit** — http://localhost:3000/request

2. **Review** — http://localhost:3000/admin/requests → open request → **Start discovery**

3. **Discover** — Organization (save) → Modules (save) → Summary → **Complete discovery**

4. **Blueprint** — Overview → **Approve blueprint & go live** (edit slug if needed)

5. **Tenant** — Redirects to `/{slug}/dashboard` with live modules and pipeline status



## Week plan



### Week 1 — Admin intake loop

- [x] Schema + Supabase + public `/request`

- [x] **1.1** Request detail, status actions, link to discovery

- [x] Smoke test: submit → review → start discovery



### Week 2 — Discovery (understand)

- [x] Discovery layout + navigation

- [x] Organization form (persist `DiscoveryAnswer`)

- [x] Modules alignment with request

- [x] Summary page + “Complete discovery” action

- [ ] Optional: departments, branches, roles (placeholders remain)



### Week 3 — Blueprint + tenant (define + run)

- [x] Blueprint overview from discovery

- [x] Approve & provision tenant (`pipeline.service`)

- [x] Tenant dashboard with DB-backed context

- [ ] Optional: CyberCrow/SAREA init UI surfaces



## Status flow



```

PENDING_REVIEW → (Start discovery) → UNDER_DISCOVERY

PENDING_REVIEW → (Reject) → REJECTED

UNDER_DISCOVERY → (Complete discovery) → BLUEPRINT_BUILD

BLUEPRINT_BUILD → (Approve & provision) → GO_LIVE (+ tenant created)

```



## Key files



| Area | Path |

|------|------|

| Discovery | `src/lib/services/discovery.service.ts`, `src/lib/actions/discovery.ts` |

| Blueprint | `src/lib/services/blueprint.service.ts`, `src/lib/actions/blueprint.ts` |

| Pipeline | `src/lib/services/pipeline.service.ts` |

| Admin | `src/lib/actions/admin-pipeline.ts` |

| Tenant | `src/lib/services/tenant.service.ts` |


