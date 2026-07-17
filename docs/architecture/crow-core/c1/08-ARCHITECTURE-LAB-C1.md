# 08 — Architecture Lab C1 Extension

**Location:** `/admin/architecture-lab`  
**Files:** `architecture-lab-content.tsx`, `mock-architecture-lab-data.ts`

## C1 mock sections

| Mock constant | Purpose |
|---------------|---------|
| `MOCK_C1_COMMAND_CENTER` | Studio shell preview |
| `MOCK_C1_VERSION_COMPARE` | Section diff table |
| `MOCK_C1_ROI_SCENARIOS` | Three scenario cards |
| `MOCK_C1_SOW_SECTIONS` | 22-section list |
| `MOCK_C1_TRACEABILITY_TIMELINE` | Event chain |
| `MOCK_C1_SAREA_ROLE_COMPARISON` | Role mapping table |

## Constraints

- **Mock data only** — existing reference prototype banner preserved
- No mutations, no Prisma writes, no auth changes
- `C1_ARCHITECTURE_LAB_REFERENCE.studioRoute` documents canonical Studio path

Architecture Lab is for **design validation**, not production Blueprint editing.
