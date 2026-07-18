# Discovery MVP — Local-First Certification (D0–D7)

| Field | Value |
|-------|-------|
| **Title** | Discovery MVP D0–D7 local-first certification |
| **Status** | CANONICAL certification evidence — **owner-accepted** (CROW.DISCOVERY.LOCAL-FIRST.ACCEPT.1) |
| **Authority** | Owner decisions · CROW.DISCOVERY.2–7 · [`CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md`](../milestones/CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md) · [`CROW-DISCOVERY-7.md`](../milestones/CROW-DISCOVERY-7.md) |
| **Date** | 2026-07-18 |
| **Branch / start HEAD** | `feat/first-tenant-golden-path` @ `f0d7575` (acceptance baseline) |
| **Issue** | [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) — OPEN (remaining hosted / dual-track / Blueprint work) |
| **Plan** | [`DISCOVERY-MVP-PLAN.md`](DISCOVERY-MVP-PLAN.md) |
| **Acceptance** | [`../milestones/CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md`](../milestones/CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md) |

---

## 1. Scope completed

| Phase | What landed | Key artifacts |
|-------|-------------|---------------|
| **D0** | Safety baseline | `discovery-mvp-boundaries.ts`, qualification gate, route guards, Complete quarantine |
| **D1** | Migration-free data alignment | `discovery-product-status.ts` (no DB enum migration) |
| **D2** | Workspace shell | `discovery-mvp-workspace-shell.tsx`, Stages 1–7 overview |
| **D3** | Adaptive Stages 1–3 | `discovery-mvp-d3-*.ts`, `discovery-mvp-adaptive-field-form.tsx`, localStorage drafts |
| **D4** | Operating Model input draft | `discovery-mvp-d4-*.ts`, `discovery-mvp-operating-model-draft-preview.tsx` |
| **D5** | ProCrow modeling review | `discovery-mvp-d5-*.ts`, `discovery-mvp-procrow-modeling-review-panel.tsx` |
| **D6** | Blueprint handoff contract | `discovery-mvp-d6-*.ts`, `discovery-mvp-blueprint-handoff-panel.tsx` |
| **D7** | Stages 4–7 depth | `discovery-mvp-d7-fields.ts`, enriched D4–D6, Stages 4–7 UI, `discovery-mvp-d7:test` |

Milestones: [`CROW-DISCOVERY-2.md`](../milestones/CROW-DISCOVERY-2.md) … [`CROW-DISCOVERY-7.md`](../milestones/CROW-DISCOVERY-7.md)

---

## 2. Local-first boundaries

| Boundary | Certified state |
|----------|-----------------|
| Answer / review draft persistence | Browser `localStorage` / component state where applicable |
| Hosted business writes from D0–D7 slices | **None** |
| Schema migrations | **None** authorized or applied for this stream |
| Prisma schema changes for Discovery MVP | **None** in D0–D7 slices |
| Production deploy | **Not** performed for Discovery MVP slices |
| `main` merge | **Not** performed; `main` remains `f97a835` |
| PR #10 | OPEN · DRAFT · CONFLICTING · **archive / reference only** |
| Owner acceptance | **Accepted** — CROW.DISCOVERY.LOCAL-FIRST.ACCEPT.1 @ `f0d7575` |

---

## 3. Authority safety

Discovery MVP D0–D7 **does not**:

| Side effect | Certified |
|-------------|-----------|
| Create tenant membership | Yes — not created |
| Create platform role | Yes — not created |
| Provision tenant | Yes — not provisioned |
| Create Enterprise Blueprint / draft records | Yes — not created |
| Create payment | Yes — not created |
| Invoke CroAI | Yes — not invoked |

Proven primarily by pure helper authority flags + static quarantine tests in `discovery-mvp-d0-d2` … `discovery-mvp-d6` suites.

---

## 4. Blueprint boundary

| Invariant | Value |
|-----------|-------|
| `completeDiscovery` / Blueprint Complete | Blocked by default via `assertDiscoveryBlueprintCompleteAllowed()` |
| `CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE` | **Not** enabled (`!== "1"`) |
| `readyForBlueprintDraft` | Always `false` through D4–D6 |
| `blueprintGenerationAllowed` | Always `false` (D6) |
| `readyForModeling` | May be `true` (D5 local criteria) |
| `readyForBlueprintHandoff` | May be `true` (D6 local criteria) |
| Owner gate | Always required |
| ProCrow gate | Always required |
| Handoff package lifecycle | `pre_blueprint_local_handoff` — not an approved Blueprint |

Canonical Blueprint doc clarification: [`05-ENTERPRISE-BLUEPRINT.md`](../05-ENTERPRISE-BLUEPRINT.md) § Discovery handoff boundary.

---

## 5. Test evidence matrix

| Script | Purpose | Result | Safety boundary proven |
|--------|---------|--------|------------------------|
| `npm run discovery-mvp-d0-d2:test` | D0–D2 safety, quarantine, workspace | PASS | Complete blocked; non-authority |
| `npm run discovery-mvp-d3:test` | Adaptive Stages 1–3 | PASS | localStorage; inert Blueprint tags |
| `npm run discovery-mvp-d4:test` | OM input draft | PASS | `readyForBlueprintDraft` false |
| `npm run discovery-mvp-d5:test` | ProCrow modeling review | PASS | Modeling ≠ Blueprint / tenant |
| `npm run discovery-mvp-d6:test` | Handoff package | PASS | Handoff ≠ generation; gates required |
| `npm run ftgp-discovery-question-catalog:audit` | FTGP catalog integrity | PASS | Stable keys / classification |
| `npm run client-service-request:test` | Request intake authority | PASS | Request ≠ tenant |
| `npm run request-client-process-phone-gate:test` | Client-process phone gate | PASS | Verification ≠ membership |
| `npm run request-status-product-mapping:test` | Product status mapping | PASS | No DB enum migration |
| `npm run procrow-qualification:test` | Qualification outcomes | PASS | Qualification ≠ authority |
| `npm run public-access-policy:test` | Public browse policy | PASS | Passive browse safe |
| `npm run public-route-architecture:test` | Public route architecture | PASS | Browse vs process split |
| `npm run public-v2-preview-readiness:test` | Public v2 readiness | PASS | Preview containment |
| `npm run typecheck` | TypeScript | PASS | Compile integrity |
| `npm run lint` | ESLint | PASS | `LINT_WARNING_COUNT=0` |
| `npm run build` | Production build (local) | PASS | `LOCAL_PRODUCTION_BUILD=PASS` |

### Required counters (certification run)

| Counter | Required |
|---------|----------|
| `FAILED_REQUIRED_GATE_COUNT` | 0 |
| `SKIPPED_REQUIRED_GATE_COUNT` | 0 |
| `LINT_WARNING_COUNT` | 0 |
| `LOCAL_PRODUCTION_BUILD` | PASS |
| `UNAUTHORIZED_MIGRATION_COUNT` | 0 |
| `HOSTED_BUSINESS_WRITE_COUNT` | 0 |
| `BLUEPRINT_CREATED_BY_DISCOVERY_COUNT` | 0 |
| `BLUEPRINT_GENERATION_ALLOWED_COUNT` | 0 |
| `READY_FOR_BLUEPRINT_DRAFT_COUNT` | 0 |
| `TENANT_PROVISIONED_BY_DISCOVERY_COUNT` | 0 |
| `TENANT_MEMBERSHIP_CREATED_BY_DISCOVERY_COUNT` | 0 |
| `PLATFORM_ROLE_CREATED_BY_DISCOVERY_COUNT` | 0 |
| `PAYMENT_CREATED_BY_DISCOVERY_COUNT` | 0 |
| `CROAI_INVOKED_BY_DISCOVERY_COUNT` | 0 |

---

## 6. Remaining work (not part of local-first accept)

1. Discovery Stages **4–7** field depth  
2. Client / operator track **unification**  
3. **Hosted persistence** design and implementation (after GAP-004)  
4. **GAP-004** — Preview/Production DB isolation  
5. **GAP-015** — Production auto-deploy settings gate  
6. Future **Blueprint drafting** milestone (owner-gated; do not casually enable override)  
7. Future **evidence upload** capability  
8. Future **ProCrow approval** hosted actions  
9. Future **tenant build / go-live** handoff  

---

## 7. Recommended next options

| Option | Topic | When |
|--------|-------|------|
| **1** | GAP-004 Preview/Production DB isolation | **Recommended first** — blocks safe hosted work |
| **2** | Discovery hosted persistence design | Only after GAP-004 |
| **3** | Dual client Discovery track unification | After hosted design clarity |
| **4** | Blueprint drafting design only | After GAP-004 + owner gates; still no generation |
| **5** | Production movement / `main` merge | Only with explicit owner authorization |

**Safest recommended next:** **GAP-004** (Preview/Production DB isolation) before hosted Discovery persistence, dual-track unification, `main` merge, Production movement, or Blueprint drafting. GAP-015 is already **Mitigated**.

---

## 8. What blocks hosted / Production / main movement

| Blocker | Why |
|---------|-----|
| GAP-004 | Preview/Production DB isolation open / blocked |
| GAP-015 | **Mitigated** — intentional Production still needs `CROW.PRODUCTION.DEPLOY` |
| Local-first acceptance | D0–D7 accepted ≠ hosted / Production / Blueprint authorized |
| Blueprint Complete override | Must remain off unless explicitly authorized |
| PR #10 | Archive only — not a merge vehicle |

---

## 9. Related documents

- Owner acceptance: [`../milestones/CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md`](../milestones/CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md)
- Owner checklist: [`DISCOVERY-MVP-OWNER-ACCEPTANCE-CHECKLIST.md`](DISCOVERY-MVP-OWNER-ACCEPTANCE-CHECKLIST.md)
- Milestone (build): [`../milestones/CROW-DISCOVERY-7.md`](../milestones/CROW-DISCOVERY-7.md)
- Plan: [`DISCOVERY-MVP-PLAN.md`](DISCOVERY-MVP-PLAN.md)
- Gaps: [`../GAP-LEDGER.md`](../GAP-LEDGER.md) (GAP-004, GAP-015, GAP-017)
