# F37 — Industry catalog UX & sector selection polish

**Phase:** F37  
**Date:** 26 May 2026  
**Constraint:** No paid infrastructure · no production launch · no schema changes · public-safe wording only

---

## 1. Industry catalog audit

| Sector | Org template depth | Discovery JSON | Per-sector verify | Public catalog | Request selector | Hero chip |
|--------|-------------------|----------------|-------------------|----------------|------------------|-----------|
| Logistics | First-class (F33) | Yes | `logistics:verify` | Yes | Yes | Yes |
| Retail | First-class (F32) | Yes | `retail:verify` | Yes | Yes | Yes |
| Construction | First-class (F34) | Yes | `construction:verify` | Yes | Yes | Yes |
| Aviation | First-class (F35) | Yes | `aviation:verify` | Yes | Yes | Yes (Aviation intake) |
| Healthcare | First-class (F36) | Yes | `healthcare:verify` | Yes | Yes | **No** (full catalog on `/industries`) |
| Holding / public / energy | Future-readiness cards only | No full template | — | Secondary section | — | — |

**Issues found (pre-F37):**

- `/industries` used legacy `MARKETING_INDUSTRIES` with outdated healthcare copy (Entra/Fortress, “governed go-live”).
- Request industry order and labels did not match the five modeled sectors spec.
- No inline preview on `/request` when selecting an industry.
- Discovery org-model page showed long guidance lists without confidence or missing-input summary.
- Blueprint readiness had no sector operating-model context panel.
- No cross-sector catalog verification script.

---

## 2. Public industries page (`/industries`)

- Rebuilt around `MODELED_SECTOR_CATALOG` and `IndustryCatalogCard`.
- Each card: summary, readiness note, core workflows, live CEM module chips, CyberCrow/SAREA focus, advisory boundary.
- Separate **template-ready / future** section for holding, public, energy.
- CTA for **Other / Not sure** → `/request`.

---

## 3. Request industry selector (`/request`)

- Options: Other / Not sure · Logistics · Retail · Construction · Aviation · Healthcare.
- Controlled select + `RequestIndustryPreviewPanel` (modules, workflows, discovery next steps, advisory note).
- Submission logic unchanged — display-only polish.

---

## 4. Discovery sector guidance visibility

- `DiscoverySectorGuidancePanel`: sector title/key, confidence badge, collapsible department/workflow/engine hints (capped), missing inputs, blueprint notes in `<details>`.
- `DiscoveryAdvisoryRecommendationsPanel`: chip lists capped at 6 per category.
- Organization model page passes `sectorTemplateKey`, `sectorConfidence`, `missingInputs` from intelligence snapshot.

---

## 5. Blueprint sector readiness

- `BlueprintSectorReadinessPanel` on blueprint **Readiness** when org intelligence has a sector key.
- Explains what carries into blueprint vs advisory vs operator review vs future-only.
- Link back to discovery organization model.

---

## 6. Sector consistency verification

| Command | Purpose |
|---------|---------|
| `npm run sector:verify` | Cross-catalog checks + public wording scan |
| `npm run logistics:verify` | Logistics template depth |
| `npm run retail:verify` | Retail template depth |
| `npm run construction:verify` | Construction template depth |
| `npm run aviation:verify` | Aviation template depth |
| `npm run healthcare:verify` | Healthcare template depth |

`scripts/verify-sector-catalog.ts` validates five modeled keys, template registration, live vs future CEM modules, request selector alignment, and forbidden public phrases (with negation-aware scan).

---

## 7. Public wording boundary

**Use:** validated operating model · readiness pack · staging/demo validated · advisory posture · not clinical/EMR replacement (healthcare).

**Avoid:** trusted by · live customers · HIPAA-certified · certified compliance · production healthcare/aviation/logistics claims.

Central source: `src/lib/constants/sector-catalog.ts`.

---

## 8. Homepage hero alignment

**Decision:** Keep **four** hero chips (Logistics · Construction · Retail · Aviation intake). Healthcare appears on `/industries` and request selector only — avoids clinical/compliance hero risk.

---

## 9. Remaining gaps

- Holding / public / energy remain future-readiness — not full discovery templates.
- Sector guidance on discovery **Summary** could surface the same compact panel (optional follow-up).
- `npm run sector:verify` does not spawn per-sector scripts — run those separately in CI if desired.

---

## 10. F37 decision

**PASSED** when validation commands below are green on `main` after this phase lands.
