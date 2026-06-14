# 03 — Blueprint Studio UX Contract

## Canonical route

**Studio:** `routes.blueprint(id).studio` → `/blueprints/[id]/studio`  
**Sections:** `routes.blueprint(id).studioSection(section)`

Admin blueprint list primary link targets Studio (not legacy overview only).

## Shell layout

```
CommandHeader | PrimaryActionBar | VersionReviewStatus
BlueprintNav (10 tabs) | FocusedWorkspace | TraceabilityDrawer
```

## Ten tabs

| Section key | Label |
|-------------|-------|
| `overview` | Overview |
| `organization` | Organization |
| `operations` | Operations |
| `security-trust` | Security & Trust |
| `experience-sarea` | Experience / SAREA |
| `integrations` | Integrations |
| `commercial` | Commercial |
| `roi` | ROI |
| `sow` | SOW |
| `versions-evidence` | Versions & Evidence |

## Actors

| Actor | Surface | Permissions |
|-------|---------|-------------|
| ProCrow implementer | Studio | `platform.discovery.write` for mutations |
| Platform admin | Studio + admin list | Same + oversight |
| Sales / commercial | Commercial, ROI, SOW tabs | `platform.discovery.write` |
| Auditor | Studio readonly | `platform.audit.view` |
| Client | Client portal only | Existing proposal/review flow — no Studio edit |

SAREA mapping is **presentation-only** — never grants permissions.

## Route consolidation decision

- **Keep:** `/blueprints/[id]/{pricing,cem,cybercrow,sarea,...}` as focused runtime-prep sub-surfaces; Studio links to them
- **Do not expand:** duplicate `/admin/blueprints/[id]/studio`
- **Client:** unchanged at `routes.client.blueprint(id)`

## Plan diff vs version diff

- **Plan comparison (advisory):** `blueprint-plan-diff.service.ts` — subscription tiers
- **Blueprint version changes:** `blueprint-diff.service.ts` — section-level C1 snapshots

UI must label these distinctly.
