# F8 — Organic implementation request E2E (manual checklist)

**Environment:** Staging (Vercel URL + `.env.staging` database)  
**Duration:** ~45–60 minutes first run  
**Prerequisites:** Platform admin login; optional fresh browser profile for public form

**Automated helpers (read-only):**

```bash
npm run request:e2e:dry
npm run request:e2e:verify -- --reference=CROW-2026-XXXXXX
npm run onboarding:verify -- --reference=CROW-2026-XXXXXX
npm run request:pipeline:verify
```

Operator console UI (F10): [`F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md`](F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md) — lifecycle buckets on `/admin/overview`, checklist panel on request detail.

Replace `XXXXXX` with the reference shown after step 5.

**F9 — optional expectations** (after blueprint / go-live on staging):

```bash
npm run request:e2e:verify -- --reference=CROW-2026-XXXXXX --expect-blueprint --expect-sector=construction
npm run request:e2e:verify -- --reference=CROW-2026-XXXXXX --expect-blueprint --expect-tenant --expect-plan=startup
```

See [`F9_BLUEPRINT_GO_LIVE_BRIDGE.md`](F9_BLUEPRINT_GO_LIVE_BRIDGE.md).

---

## 18-step browser checklist

### Public intake (steps 1–6)

1. Open `/request` (not logged in or as a non-admin user).
2. Confirm industry dropdown includes **Construction & engineering** and **Aviation & aerospace** plus logistics, retail, healthcare, and general.
3. Complete step 01 — organization name, contact email, select **Construction** (or aviation for a second run).
4. Select plan tier and at least one CEM module; avoid selecting only MEEM-specific demo combinations if testing isolation.
5. Select at least one CyberCrow security package; complete Turnstile if enabled.
6. Submit the form; confirm success panel shows **reference code** `CROW-2026-XXXXXX` and **What happens next** bullets (review → contact → discovery → blueprint).

### Admin review (steps 7–10)

7. Sign in as platform staff; open `/admin/requests`.
8. Find the new request by reference code; confirm **Industry** label on the card matches the selection.
9. Open request detail; verify reference, industry (human-readable label), modules, and plan estimate.
10. Click **Start discovery** (from `PENDING_REVIEW`); confirm redirect into discovery wizard for this request id.

### Discovery bootstrap (steps 11–14)

11. On discovery organization step, confirm sector / org intelligence reflects **construction** or **aviation** (not logistics unless industry was logistics).
12. Use **Apply template** (if shown) — confirm departments/workflows populate without error (JSON pack loaded).
13. Open organization model / org intelligence panel; confirm growth-plan copy is sector-appropriate (not logistics-only wording).
14. Skim modules, security, and experience steps; save progress; note discovery profile status.

### Blueprint bridge (steps 15–16)

15. If policy allows on staging, complete discovery through existing **complete discovery → blueprint** action (or confirm blueprint already linked for seeded tenants only).
16. Confirm blueprint overview loads for this request; tenant slug is **not** `meem-global` unless this is the MEEM reference.

### Isolation & regression spot-checks (steps 17–18)

17. Open MEEM tenant dashboard (`/meem-global/dashboard` or staging equivalent); confirm MEEM data unchanged by the organic test.
18. Run `npm run request:e2e:verify -- --reference=<your code>` and `npm run request:pipeline:verify`; both should pass.

---

## Pass / fail

| Result | Condition |
|--------|-----------|
| **Pass** | All 18 steps behave as described; verify scripts pass; no MEEM/Rimal regression |
| **Fail** | Wrong sector, missing template apply, blueprint on wrong tenant, or script failure — log request id + reference in issue |

---

## Notes

- For a **full construction chain without browser**, use seeded Rimal: `npm run discovery:verify:rimal`.
- For **logistics lighthouse**, use `npm run discovery:verify:meem`.
- Do **not** run destructive reset scripts against staging MEEM/Rimal data during this checklist.

---

*Companion spec: [`F8_DISCOVERY_TEMPLATE_EXPANSION.md`](F8_DISCOVERY_TEMPLATE_EXPANSION.md)*
