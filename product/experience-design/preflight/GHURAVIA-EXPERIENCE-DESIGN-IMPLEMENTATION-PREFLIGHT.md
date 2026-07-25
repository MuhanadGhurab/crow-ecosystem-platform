# GHURAVIA Experience Design — Implementation Preflight

| Field | Value |
|-------|-------|
| **Document** | GHURAVIA-EXPERIENCE-DESIGN-IMPLEMENTATION-PREFLIGHT |
| **Mode** | **AUDIT ONLY** — no visual redesign · no Product Code changes · no design-framework install · no visual direction selection |
| **Repository** | `D:\CyberCrow` |
| **Branch** | `feat/ghuravia-foundation` |
| **Inspected HEAD** | `f536dd6fa794a65b64e3495b3544cd3496d5ca0d` |
| **HEAD subject** | `docs(validation): record Preview isolation and deployment evidence` |
| **Scope app** | `apps/web` (`@ghuravia/web`) |
| **Date** | 2026-07-25 |
| **Verdict** | **READY WITH TECHNICAL CONDITIONS** |

This preflight is repository-grounded. It does **not** invent a Gate ID, authorize redesign, or choose a visual language.

---

## 1. Final verdict

**READY WITH TECHNICAL CONDITIONS**

The frontend is implementable for a first approved experience-design programme: routes, guards, localization, activation/onboarding shells, and Black Signal state/API surfaces are identifiable and testable. Conditions below must be treated as **programme constraints / early remediation waves**, not as permission to redesign Product rules.

Not **READY FOR EXPERIENCE DESIGN** (unconditional): internal ID leakage, stub homepage, dual styling stacks, and missing font loading require explicit handling in wave 0–1.

Not **BLOCKED**: journeys run under local/CI/Preview guards; Master Screen Registry authority remains intact; CI/validation tooling exists.

---

## 2. Route map

### 2.1 User-facing App Router pages (implemented)

| URL | Screen ID (governed) | Guard pattern | Notes |
|-----|----------------------|---------------|-------|
| `/` | *(none — stub)* | None | Technical homepage; not PUB-001 |
| `/activation/email-pending` | ACT-003 | `loadActivationEntryScreen` | Synthetic bootstrap allowed |
| `/activation/email-result` | ACT-011 | `loadActivationEntryScreen` | Synthetic bootstrap allowed |
| `/activation/terms` | ACT-005 | `requireActivationScreenAccess` | Session + gates |
| `/activation/account-risk` | ACT-013 | `requireActivationScreenAccess` | |
| `/activation/recovery` | ACT-012 | `requireActivationScreenAccess` | Governed recovery states only |
| `/activation/complete` | ACT-006 | `requireActivationScreenAccess` | ACTIVATED |
| `/activation/mobile-optional` | ACT-007 | `requireActivationScreenAccess` | Optional; skip → ONB-001 |
| `/onboarding/entry` | ONB-001 | `requireOnboardingScreenAccess` | Requires ACTIVATED |
| `/onboarding/crow` | IDN-001 | onboarding guard | |
| `/onboarding/habitat` | IDN-002 | onboarding guard | |
| `/onboarding/character` | IDN-003 | onboarding guard | |
| `/onboarding/origin` | ONB-002 | onboarding guard | |
| `/onboarding/nest-intro` | ONB-003 | onboarding guard | |
| `/onboarding/nest-assessment` | ONB-004 | onboarding guard | |
| `/onboarding/nest-result` | ONB-005 | onboarding guard | |
| `/onboarding/nest-learning-path` | ONB-006 | onboarding guard | Handoff only |
| `/onboarding/choose-horizon` | ONB-007 | onboarding guard | Handoff only |
| `/missions/black-signal` | *(Mission slice — not a Master Registry ACT/ONB ID)* | Session preferred; page loads without hard redirect | Living Mission First Flight |
| `/dev/local-tools` | *(dev)* | Runtime-gated APIs | Mock mailbox; not learner product |

**No `middleware.ts`** — access is enforced in server page loaders + client access hooks.

### 2.2 API surfaces (learner-relevant)

| Method / path | Role |
|---------------|------|
| `POST /api/local/synthetic-session` | Preview/local/CI synthetic learner cookie |
| `DELETE /api/local/synthetic-session` | End session |
| `GET/POST /api/activation` · `POST .../commands/[command]` | Activation aggregate + commands |
| `GET/POST /api/onboarding` · `POST .../commands/[command]` | Onboarding aggregate + commands |
| `GET /api/missions/black-signal` | Preferred active / `?runId=` ownership read |
| `POST /api/missions/black-signal/commands/{start\|select-choice\|complete-debrief\|start-echo\|dismiss-suggestion\|override-route}` | Mission commands (Idempotency-Key required) |
| `GET /api/local/mock-mailbox` · `POST /api/local/test-controls` | Local/test only |
| `GET /api/health` | Health |

### 2.3 Registry vs implementation gap (screen-registry implications)

Authoritative inventory: `product/screens/MASTER-SCREEN-REGISTRY.md` — **92 ACTIVE** screens.

**Implemented with governed IDs:** ACT-003, 005, 006, 007, 011, 012, 013 · ONB-001–007 · IDN-001–003 · Black Signal mission route (product-kernel First Flight; outside ACT/ONB numbering).

**Registry ACTIVE but not implemented as routes (non-exhaustive):** PUB-001–008 · ACT-001, 002, 008, 009, 010 · IDN-004–006 · ONB-008–011 · and the remaining LRN / TRU / PAY / etc. shells.

Experience design must not treat unimplemented registry rows as live UI. Mapping future screens to registry IDs remains mandatory; inventing new public IDs in UI is out of scope for design waves unless governance amends the registry.

---

## 3. Root-page and authenticated entry behavior

### 3.1 `/` (root)

```text
apps/web/app/page.tsx
→ <h1>GHURAVIA</h1>
→ "LOCAL DEVELOPMENT ONLY · NOT DEPLOYED"
→ link: /activation/email-pending labeled "Activation (ACT-003)"
```

- Does **not** redirect to activation, onboarding, or Black Signal.
- Does **not** implement PUB-001 Landing.
- Exposes internal screen ID in link label.
- Status copy is false for Controlled Preview (Preview **is** deployed under 0G) — technical debt for copy remediation, not a visual direction choice.

### 3.2 Authenticated / activated entry

1. Synthetic session on ACT-003 / ACT-011 (`allowBootstrap`).
2. Activation formula: email → terms → risk → ACT-006.
3. Optional ACT-007 → ONB-001.
4. Onboarding progression via `accessibleScreens` / domain `canAccessOnboardingScreen`.
5. Black Signal is a **separate** entry URL; not wired as post-ONB-007 destination in Product Code today.

There is no global “home after login” shell. Learner presence is cookie-scoped synthetic session, not Production auth (ACT-010 not built).

---

## 4. Route guards (summary)

| Layer | Mechanism | Failure behavior |
|-------|-----------|------------------|
| Runtime | `assertLocalRuntime()` / config `controlled_preview` | Deny Production; allow local / CI / verified Preview |
| Activation entry | `loadActivationEntryScreen` | Soft allow without session for bootstrap |
| Activation protected | `requireActivationScreenAccess` | `redirect` to authorized ACT route |
| Onboarding | `requireOnboardingScreenAccess` | Redirect to activation if not ACTIVATED; else resume ONB/IDN |
| Client | `canAccessScreen` / `canAccessOnboardingRoute` + `router.replace` | Prevents client-side deep-link flash |
| Mission API | Session + ownership on GET/commands | 401 / 403 / 404 |
| Return URLs | `ALLOWED_RETURN_TO` allowlist | Blocks open redirects |

---

## 5. Current-shell assessment

| Shell | Location | Structure | Assessment |
|-------|----------|-----------|------------|
| **Root layout** | `app/layout.tsx` | `<html lang="ar" dir="rtl">` + `LocaleProvider` + `globals.css` | Minimal; no nav chrome, no skip-link at layout level |
| **Activation shell** | `ActivationShell` | Header (brand + local banner + lang) · aside progress · main | Functional wireframe; progress + screen-meta are technical |
| **Onboarding shell** | `OnboardingShell` | Reuses activation grid classes · lists **raw ONB/IDN IDs** in aside | Strongest internal-ID leakage surface |
| **Page frames** | `ActivationPageFrame` · `OnboardingPageFrame` | Loading / error / bootstrap / locks / children | Correct composition seam for future visual skins |
| **Black Signal** | `BlackSignalClient` only | Self-contained dark `styled-jsx` mission shell | **Parallel visual system**; does not use Activation/Onboarding shells |
| **Dev tools** | `/dev/local-tools` | Standalone main | Must stay out of learner chrome |

**Shell redesign risk:** Changing Activation/Onboarding shell structure without preserving `data-*` hooks, progress semantics, and frame contracts will break Playwright evidence and route-access UX. Black Signal must keep mission `data-*` attributes and command contract (see §12).

---

## 6. Styling-stack assessment

| Item | Finding |
|------|---------|
| Tailwind | **Not installed** |
| CSS-in-JS library (Emotion/styled-components) | **Not installed** |
| Component library (shadcn/MUI/etc.) | **None** |
| Global CSS | `apps/web/app/globals.css` — CSS variables + activation/onboarding layout |
| Local CSS | Black Signal uses **styled-jsx** embedded in `BlackSignalClient.tsx` |
| Design tokens | Informal `:root` variables only (see §15) |
| Fonts | Family name `"IBM Plex Sans Arabic"` referenced; **no `next/font`, no `@font-face`, no Google Fonts link** → falls back to system UI fonts |
| Images | `next.config.ts`: `images.unoptimized: true` (explicit 0B constraint) · **no `apps/web/public` asset tree in use** · no `next/image` usage found |
| Icons | No icon package; text / emoji-free UI |

**Proposed design-system integration point (technical only — no framework chosen):**

1. Keep **App Router layouts + page frames** as the composition boundary.
2. Introduce tokens / primitives under a future `apps/web` (or package) **without** relocating domain/API logic.
3. Prefer extending `globals.css` tokens + shared shell components **before** adopting a CSS framework.
4. **Do not** merge Black Signal into Activation shell until Mission chrome requirements are specified; treat Mission as a second shell family.
5. Any framework install requires a later Founder/governance authorization — **out of scope for this preflight**.

---

## 7. Internal-ID leakage inventory

User-visible (or user-adjacent) identifiers and development copy:

| Surface | Leakage | Severity |
|---------|---------|----------|
| `/` link text | `Activation (ACT-003)` | High |
| `/` status | `LOCAL DEVELOPMENT ONLY · NOT DEPLOYED` | High (wrong for Preview; developer voice) |
| `ActivationShell` aside | `{screenId} · {route}` e.g. `ACT-005 · /activation/terms` | High |
| `ActivationPageFrame` | `<p data-screen-id className="sr-meta">` shows screen ID | High (visible monospace, not sr-only) |
| `OnboardingShell` progress `<ol>` | Raw `ONB-*` / `IDN-*` as list labels | **Critical** for learner UX |
| `OnboardingShell` | `{screenId} · {route}` + `{state} · v{version}` | High |
| `OnboardingPageFrame` | Visible `data-screen-id` text | High |
| `ExplainableLocks` | Raw `lock.code` in `.tech` | Medium (support-debug voice) |
| `ErrorPanel` | Correlation ID | Medium (acceptable if labeled; keep LTR) |
| Localization | Keys/copy reference ACT-008, “later Gate”, “local synthetic”, “not Production” | Medium–High |
| Black Signal | Hardcoded English subtitle “First Flight — Black Signal · أداة ألفا تركيبية”; `outcomeId`, `lineageId`, `routeId`, `sceneId` shown raw | Medium–High |
| Black Signal `data-*` | run IDs, hashes, node IDs on DOM | Low for learners (attributes); **must retain for tests** |
| Dev tools | Token display, mailbox | Expected for `/dev` only |

**CAP-\*:** Nest weak-capability IDs exist in domain/resource typing but are **not rendered** as `CAP-*` labels in current Nest Result UI. No CAP leakage found in page copy today.

**Gate IDs (GHV.\*):** Not rendered in learner UI in inspected pages.

---

## 8. Reusable-component inventory

| Component | Path | Reuse role |
|-----------|------|------------|
| `LocaleProvider` / `useLocale` | `lib/locale-context.tsx` | Global AR/EN + `dir` sync |
| Message catalogs | `lib/localization/{ar,en,messages,format}.ts` | Copy source of truth for ACT/ONB |
| `ActivationShell` | `activation/_components/ActivationShell.tsx` | Chrome + progress + locks + errors |
| `ActivationPageFrame` | `ActivationPageFrame.tsx` | Screen orchestration |
| `SessionBootstrap` / `useActivation` | `ActivationClient.tsx` | Session + commands + access |
| `OnboardingShell` | `onboarding/_components/OnboardingShell.tsx` | Chrome (reuses activation CSS) |
| `OnboardingPageFrame` | `OnboardingPageFrame.tsx` | Screen orchestration |
| `useOnboarding` | `useOnboarding.ts` | Aggregate + commands |
| Catalogue option helpers | `catalogue-options.ts` | Personalization/origin options |
| Per-screen `*Client.tsx` | activation/ · onboarding/ | Thin screen bodies |
| `BlackSignalClient` | missions/black-signal/ | Monolithic mission UI + styles |
| Route maps | `activation-routes.ts` · `onboarding-routes.ts` | ID ↔ path authority |

---

## 9. Replace / refactor / retain matrix

| Item | Disposition | Rationale |
|------|-------------|-----------|
| Domain services, commands, idempotency, ownership | **Retain** | Product Code authority |
| Route guards + screen ID maps | **Retain** | Registry alignment |
| `data-screen-id`, `data-cta`, mission `data-*` | **Retain** (may hide visually) | Browser evidence / a11y tests |
| Activation/Onboarding **page frame contracts** | **Retain** | Stable integration point |
| Visible screen-ID / route meta / raw ONB list labels | **Replace** (copy/presentation) | Leakage remediation |
| Root homepage stub | **Replace** (content/entry behavior within authorized scope) | Not PUB-001; misleading Preview copy |
| `localOnlyBanner` copy | **Refactor** | Must distinguish local vs Controlled Preview without inventing Production claims |
| `globals.css` token block | **Refactor / extend** | Seed for design tokens — no direction chosen here |
| Black Signal styled-jsx block | **Refactor later** | Extract styles when Mission chrome is designed; keep behavior |
| `/dev/local-tools` | **Retain** off learner path | Synthetic mailbox |
| Installing Tailwind/shadcn/etc. | **Not authorized by this document** | Requires later decision |

---

## 10. RTL / LTR and localization

| Concern | Status |
|---------|--------|
| Default document | `lang="ar"` `dir="rtl"` |
| Runtime switch | Client toggles `documentElement.lang/dir` |
| Catalogs | Parallel `ar` / `en` message keys; localization validator in CI |
| Logical CSS | Uses `inline-start` / `inline-end` in globals |
| Black Signal | Hardcoded `dir="rtl"` `lang="ar"` on `<main>` — **does not follow** LocaleProvider for EN yet |
| `dir="ltr"` islands | Screen IDs, tech codes, tokens — keep for bidi safety |

---

## 11. Accessibility and reduced motion

| Foundation | Status |
|------------|--------|
| Skip link | Present in Activation/Onboarding shells (`#main`) · **absent** on root and Black Signal |
| Focus visible | Global `:focus-visible` outline |
| Landmarks | `banner`, `main`, `aside` progress, `role="alert"` errors |
| Live regions | Loading/submitting polite status |
| Reduced motion | Global CSS + Black Signal styled-jsx `prefers-reduced-motion` |
| Axe | `@axe-core/playwright` in repo; browser evidence validators |
| Color-only state | Mission bands use border-style differentiation (`data-noncolor-state`) |

Gaps: root/Black Signal skip-link; technical text in progress lists harms comprehension (a11y + UX).

---

## 12. Black Signal — architecture to preserve

### 12.1 Structure

- Server `page.tsx`: optional session → `listPreferredActive` → `initialResource`.
- Client monolith: phases `brief` | `play` | `debrief`; local state mirrors `MissionResource`.
- Commands via `POST /api/missions/black-signal/commands/*` with `Idempotency-Key`.

### 12.2 State / API preservation matrix

| Must preserve | Why |
|---------------|-----|
| Commands: start, select-choice, complete-debrief, start-echo, dismiss-suggestion, override-route | Product kernel behavior |
| Idempotency-Key on every command | Receipt safety |
| Ownership checks on GET `?runId=` and mutations | Privacy |
| Canonical vs Echo separation + echo notices | Counterfactual rules |
| Crowprint private · Suggested Lineage dismissible · Flight Log · route override | 0F/0G acceptance surface |
| DOM: `data-mission`, `data-run-*`, `data-node`, `data-band`, `data-debrief`, `data-echo`, choice buttons in `.choice-stack` | Playwright closure + smoke |
| World bands + non-color encoding | Accessibility invariant |
| Arabic-first Mission copy authority (content) | Kernel content — redesign skins copy layout, not Mission meaning |

Experience design may restyle chrome/typography/spacing **without** changing deterministic Mission rules, Crowprint meaning, or API payloads.

---

## 13. Synthetic Preview-session entry flow

```text
Founder SSO (Vercel Deployment Protection)
  → open /activation/email-pending (or ACT-011)
  → POST /api/local/synthetic-session (gated: local | automated_test | verified controlled_preview)
  → httpOnly cookie ghuravia_synthetic_session
  → activation commands → ACTIVATED
  → optional ACT-007 → /onboarding/entry
  → (separate) /missions/black-signal for First Flight
```

Constraints for redesign:

- Bootstrap UI only on ACT-003 / ACT-011 (`allowBootstrap`).
- No publicly discoverable Production synthetic login.
- Cookie `secure` on Preview HTTPS; denied in Production runtime mode.

---

## 14. Responsive behavior

| Area | Behavior |
|------|----------|
| Activation/Onboarding | Single column → two-column grid at `min-width: 768px` |
| Narrow | Extra padding reduction at `max-width: 320px` |
| Black Signal | `clamp` heading; stacked choices; dark full-viewport shell |
| No dedicated tablet/desktop Mission layout variants | — |

---

## 15. Existing design tokens (informal)

From `globals.css` `:root`:

| Token | Value (as shipped) | Role |
|-------|--------------------|------|
| `--bg` | `#f3f0ea` | Page atmosphere |
| `--fg` | `#1a1a1a` | Text |
| `--accent` | `#0b5f56` | Primary actions |
| `--focus` | `#a16207` | Focus ring |
| `--surface` | `#fffdf8` | Panels |
| `--line` | `#d6d0c4` | Borders |

Black Signal uses a **separate dark palette** inline (not these tokens). Extending tokens is allowed as a technical condition; choosing a final brand palette is **not** this document’s job.

---

## 16. Images, icons, assets

- No learner-facing image pipeline in `apps/web`.
- Crow personalization is **catalogue option IDs + text labels**, not rendered Crow art.
- Identity visual dossiers under `product/identity/...` are **governance evidence**, not Next public assets.
- `sharp` is a dependency; Image Optimization remains disabled until a later authorized Gate.

---

## 17. Build and performance constraints

| Constraint | Detail |
|------------|--------|
| Next.js | 16.2.11 · React 19 · `next build --webpack` |
| Transpile | Internal `@ghuravia/*` packages |
| DB | `serverExternalPackages`: postgres, drizzle-orm |
| CI | Full `npm run ci` includes lint, typecheck, unit/integration, route/registry validators, localization, browser evidence, build, Playwright |
| Preview | Monorepo `vercel.json` points output at `apps/web/.next` |
| Bundle risk | Monolithic Black Signal + per-screen clients are acceptable; avoid adding heavy UI kits without authorization |

---

## 18. Screen-registry implications

1. Keep **Master Screen Registry** as the naming authority for ACT/ONB/IDN/PUB/….
2. Experience work on implemented screens must preserve ID ↔ route maps in `activation-routes.ts` / `onboarding-routes.ts` and `validate:routes`.
3. Do not surface registry IDs as learner-facing labels.
4. PUB-001 (Landing) is the natural long-term owner of `/` — implementing it is a product/governance decision, not implied by this preflight.
5. Black Signal First Flight is kernel-authorized Mission UI; if/when registered as an LRN/MIS screen, map deliberately — **do not invent IDs here**.

---

## 19. Recommended implementation waves

Technical sequencing only — **no visual direction**:

| Wave | Focus | Exit criteria |
|------|-------|---------------|
| **0 — Hygiene** | Hide/relabel internal IDs; fix Preview-accurate banners; skip-links on root/Mission; stop showing raw routes in asides | Leakage inventory cleared for learner paths; CI a11y/browser evidence still green |
| **1 — Token & shell seam** | Formalize CSS variables; extract shared shell primitives; align Mission font loading mechanism (still no brand pick) | Single token file; frames unchanged behaviorally |
| **2 — Entry** | Replace stub `/` with authorized entry experience (likely toward PUB-001 when authorized) | Clear path to ACT-003 / session without developer copy |
| **3 — Activation / Onboarding chrome** | Visual skin on existing frames; human progress labels mapped from IDs internally | Same routes/guards; Playwright selectors stable via `data-*` |
| **4 — Black Signal chrome** | Restyle Mission shell; keep commands/state/`data-*` | Resume/Echo/ownership suites pass |
| **5 — Registry expansion** | Only after Founder authorizes missing PUB/ACT/LRN screens | Registry + routes + validators updated together |

Do **not** start Wave 5 by redesigning unimplemented screens in Product Code without authorization.

---

## 20. Risks of redesigning the shell

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking `data-*` / CTA hooks | CI browser evidence fails | Treat attributes as API; restyle around them |
| Merging Mission into Activation shell too early | Wrong information architecture; Echo labeling lost | Keep Mission shell family until specified |
| Changing guard redirects | Learners stuck / activation formula broken | Freeze guard modules in early waves |
| Adopting a CSS framework mid-flight | Scope explosion; Preview regressions | Separate authorization; Wave 1 tokens first |
| Localizing Black Signal only partially | EN toggle inconsistent | Wire Mission to `useLocale` when chrome work starts |
| Exposing Crow art before Production approval | Governance violation | Continue catalogue text / approved assets only |
| Treating Preview as Production in copy | Trust / compliance confusion | Banner taxonomy: local · controlled Preview · Production |

---

## 21. Technical conditions (must track)

1. Remediable **internal-ID leakage** before Founder-facing experience claims “learner-ready chrome.”
2. Root page / banner copy must not claim “NOT DEPLOYED” while Controlled Preview exists.
3. Font loading must be implemented when typography work begins (currently name-only).
4. Dual styling stacks (globals vs Mission styled-jsx) need a deliberate consolidation plan.
5. Black Signal locale must eventually respect LocaleProvider.
6. No design-framework install and no visual direction selection under this preflight alone.
7. Preserve Living Mission API/state invariants and 0G Preview guards.

---

## 22. Non-claims

- No Product Code changes in this audit.
- No visual direction, palette, or motion language selected.
- No design framework installed.
- No new Gate ID invented or opened.
- No Production authorization.
- No Crow visual dossier promotion into the web app.

---

## 23. Evidence pointers (repository)

- Routes: `apps/web/app/**/page.tsx`
- Guards: `lib/server/activation-route-guard.ts`, `lib/server/onboarding-route-guard.ts`, `lib/activation-routes.ts`, `lib/onboarding-routes.ts`
- Shells: `ActivationShell.tsx`, `OnboardingShell.tsx`, `BlackSignalClient.tsx`
- Styles: `app/globals.css`, Black Signal `<style jsx>`
- Registry: `product/screens/MASTER-SCREEN-REGISTRY.md`
- Localization: `lib/localization/*`
- Config: `apps/web/next.config.ts`, `apps/web/package.json`

---

## 24. Verdict block

```text
GHURAVIA EXPERIENCE DESIGN IMPLEMENTATION PREFLIGHT

Inspected HEAD:
f536dd6fa794a65b64e3495b3544cd3496d5ca0d

Mode:
AUDIT ONLY — NO PRODUCT CODE CHANGES
NO VISUAL DIRECTION
NO DESIGN FRAMEWORK INSTALL

Verdict:
READY WITH TECHNICAL CONDITIONS

Primary conditions:
INTERNAL ID LEAKAGE REMEDIATION REQUIRED
ROOT / BANNER COPY HYGIENE REQUIRED
FONT LOADING + TOKEN FORMALIZATION REQUIRED BEFORE CHROME CLAIMS
MISSION SHELL PRESERVATION (API + data-* + CANONICAL/ECHO)

Screen registry:
92 ACTIVE AUTHORITY UNCHANGED
PARTIAL IMPLEMENTATION ACKNOWLEDGED

Next step:
Await Founder authorization of the experience-design programme
and Wave 0 hygiene scope — do not invent a Gate ID in this document.
```
