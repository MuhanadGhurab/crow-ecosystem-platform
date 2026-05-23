# AI on the platform

**Governed assistive AI** — scoped in Discovery, priced in Blueprint, bounded by tenant isolation and CyberCrow audit policy.

This repository is **not** an “AI-first ERP.” The core promise is **enterprise orchestration**; AI is an **optional extra services** layer.

---

## Positioning

| Wrong framing | This codebase |
|---------------|---------------|
| AI replaces operators | AI **assists** workflows |
| AI in every tier | AI **line items** in Blueprint |
| Shadow copilots | Features stay **inside tenant + CyberCrow trails** |
| Hype on homepage | AI mentioned as **optional extras** band |

---

## AI extra keys (examples)

Captured in Discovery `experience.aiExtras` and reflected in commercial pricing:

| Key | Use case |
|-----|----------|
| `doc_intelligence` | OCR — POD/BOL document capture (logistics) |
| `route_optimization` | Dispatch and routing assist |
| `anomaly_detection` | Shipment / ops anomaly signals |
| `demand_forecast` | Inventory demand signals |

Constants and catalog hooks live in platform code; implementation depth varies by module — demo paths show **credible surfaces**, not unlimited LLM scope.

---

## Where AI appears in the UI

- Discovery **experience** step — customer selects scope
- Blueprint **pricing** — SAR line for AI pack
- Tenant **logistics hub** — feature cards and workflow links
- **Workflows** — e.g. OCR capture, dispatch approval chains

---

## SecDevOps boundaries for AI

1. **Tenant isolation** — no cross-tenant model context  
2. **Audit** — sensitive actions remain logged via CyberCrow where applicable  
3. **Human approval** — financial, HR, compliance actions not fully automated in marketing SLA  
4. **Data residency** — follows existing Postgres / tenant boundaries (production policy in private ops)

See [`SECDEVOPS.md`](SECDEVOPS.md).

---

## SecDevOps + AI together

```text
Discovery scopes AI  →  Blueprint prices AI  →  CEM runs workflows  →  CyberCrow audits  →  SAREA presents role-appropriate AI density
```

Executives see summary KPIs; dispatchers see operational AI tools — **SAREA** adapts presentation; **RBAC** controls access.

---

## Roadmap (public)

- Deeper workflow assist hooks per module  
- Executive summary packs (quoted extras)  
- Industry templates (logistics first — lighthouse demo)  

Not on public roadmap: generic “chat with your ERP” without governance.

---

## Related

- [`MULTI_TENANT.md`](MULTI_TENANT.md)
- [`PLATFORM_ENGINES.md`](PLATFORM_ENGINES.md)
- [`LIFECYCLE.md`](LIFECYCLE.md)
