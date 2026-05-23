# SAREA — Smart Adaptive Role Experience Architecture

**SAREA** is the experience engine of Crow Ecosystem — persona-aware layouts, navigation, and widgets so each role sees the right operational density.

---

## Promise

> **SAREA adapts the experience.**

Not every user should see the same dashboard. Executives need risk and KPIs. Dispatchers need lanes and tasks. HR needs people workflows. Same tenant — different experience.

---

## The critical separation

```text
RBAC controls access.
SAREA controls experience.
```

| Layer | Question |
|-------|----------|
| **RBAC** | May this user open this module or perform this action? |
| **SAREA** | Given they may, what layout, nav, and widgets do they see? |

Collapsing these produces either insecure UI hacks or unusable one-size-fits-all dashboards. SAREA exists to prevent both.

---

## Configuration vs runtime

| Phase | Where |
|-------|-------|
| **Discovery** | Experience step — persona scope, AI extras positioning |
| **Blueprint** | SAREA tab — commercial line for persona density |
| **Studio** | `/sarea/*` — layouts, navigation, profiles, rules (platform) |
| **Runtime** | Tenant dashboard — applied persona for logged-in user |

---

## Personas (conceptual)

- Executive — summary, risk, commercial KPIs
- Operations / hub manager — load, workflows, module hubs
- Logistics / dispatcher — shipments, approvals, lane tasks
- HR / finance — domain modules with reduced noise
- Frontline — minimal nav, task-first
- Analyst — read-heavy, export-friendly

Persona definitions are seeded at go-live from Blueprint intent. **Customer acceptance** of persona fit may be validated by client liaisons; platform runtime is Crow engineering.

---

## Relationship to CEM modules

SAREA does not replace CEM modules. It **frames** them:

- Which modules appear in primary nav
- Widget density on dashboard
- Mobile vs desktop emphasis
- Role-appropriate defaults

Module keys remain stable in Discovery (`CEM_MODULES`) — SAREA adapts presentation, not business logic.

---

## Public surfaces

| Area | Purpose |
|------|---------|
| `/sarea/overview` | Studio home |
| `/sarea/layouts` | Layout templates |
| `/sarea/navigation` | Nav groups |
| `/sarea/profiles` | Persona profiles |
| `/{slug}/dashboard` | Runtime application |

---

## Status

Studio and runtime hooks active. Customer persona sign-off for lighthouse demos is an ongoing acceptance track — not a blocker for public architecture documentation.

See [`PLATFORM_ENGINES.md`](PLATFORM_ENGINES.md) · [`ROADMAP.md`](ROADMAP.md).
