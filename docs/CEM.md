# CEM — Crow Enterprise Manager

**CEM** is the operational engine of Crow Ecosystem — the tenant workspace where organizations run day-to-day work after go-live.

---

## Promise

> **CEM runs the organization.**

HR, CRM, finance, logistics, inventory, warehouse, procurement, workflows, tasks, and module-specific operations live under `/{tenant-slug}/…`.

---

## Design principles

### Modular, not monolithic

CEM modules are **blueprint-selected**. A logistics holding company does not receive the same module surface as a retail group. Disabled modules show intentional empty states — not broken pages.

### ERP chain, not silos

Modules link operationally (e.g. sales → inventory → warehouse → logistics) so the demo and production narratives feel like one operating system.

### Tenant CyberAdmin

After go-live, customer administrators manage users, roles, departments, and module visibility within RBAC boundaries.

---

## Typical surfaces (public)

| Route pattern | Purpose |
|---------------|---------|
| `/{slug}/dashboard` | Operational home — tasks, workflows, SAREA persona |
| `/{slug}/logistics` | Shipments, carriers, logistics hub |
| `/{slug}/sales` | Pipeline and commercial ops |
| `/{slug}/inventory` | Stock and SKUs |
| `/{slug}/warehouse` | Zones, bins, movements |
| `/{slug}/workflows` | Governed process definitions |
| `/{slug}/users` | Membership and access |
| `/{slug}/settings` | Workspace configuration |

---

## Relationship to other engines

| Engine | Relationship to CEM |
|--------|---------------------|
| **CyberCrow** | Protects CEM data and actions — audit, identity, compliance narrative |
| **SAREA** | Adapts how CEM surfaces appear per persona — does not replace RBAC |

```text
RBAC:  May I open logistics?
SAREA: What does logistics look like for a dispatcher vs an executive?
```

---

## Commercial positioning

CEM base tier (Startup / Growth / Enterprise) anchors the SAR bundle. Module add-ons and employee bands adjust estimate during Blueprint — band-based, not unlimited per-seat multiplication.

---

## Status

Active development. Lighthouse logistics enterprise path demonstrates modular ERP chain quality. Deeper industry packs and retail/healthcare templates on public roadmap.

See [`ROADMAP.md`](ROADMAP.md).
