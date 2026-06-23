# FTGP 1H.3 — Certification Deployment Provenance, Private-Host Containment & OAuth Redirect Readiness

**Phase:** FTGP.1H.3  
**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**Final feature HEAD:** `ae7ea26`  
**Verdict:** `READY WITH MANUAL ACTION — CERTIFICATION DEPLOYMENT IS REPRODUCIBLE AND PRIVATE; EXACT SUPABASE REDIRECTS MUST BE ADDED`

---

## 1. Deployment provenance ambiguity (resolved)

FTGP.1H.2 deployed the certification project from a clean local tree, but the active deployment could not be conclusively tied to pushed commit `213d0b8` via Vercel Git metadata (CLI production deploy).

| Item | Before 1H.3 | After 1H.3 |
|------|-------------|------------|
| Deploy class | `488aee97` (local CLI, unpinned) | `ae7ea26` (clean tree, pinned) |
| Source commit proof | Unverified | `/api/health` → `certification.sourceCommit` |
| Deploy workflow | Ad-hoc `vercel deploy` | `npm run ftgp-certification-production:deploy` |
| Pinned env | Absent | `FTGP_CERTIFICATION_SOURCE_COMMIT` on Vercel Production |

**Final certification deployment**

| Field | Value |
|-------|-------|
| Deployment ID | `dpl_5qnasiybbipzSiH9keu1TMAqtX1C` |
| Protected host | `crow-ftgp-certification-4o8ymfctt-muhanadghurabs-projects.vercel.app` |
| Origin fingerprint | `e62d6f6f18e77384` |
| Source commit | `ae7ea26cdbd30db42d95028f56f970cbff2589fe` |
| Branch | `feat/first-tenant-golden-path` |

---

## 2. Public alias exposure (before hardening)

Anonymous requests to `https://crow-ftgp-certification.vercel.app/` returned **200** with Crow login UI and Google sign-in entry. Vercel SSO applies only to per-deployment URLs on the current plan; the stable `*.vercel.app` project alias remained world-reachable.

```text
PUBLIC_ALIAS_APPLICATION_EXPOSURE=true
PUBLIC_ALIAS_LOGIN_EXPOSURE=true
PUBLIC_ALIAS_PROTECTED_BY_VERCEL=false
```

---

## 3. Containment method selected

| Option | Result |
|--------|--------|
| Vercel Deployment Protection on stable alias | Unavailable — Advanced Deployment Protection not enabled on team |
| Alias removal | Not safely supported on current plan |
| **Certification host gate** | **Applied** |

```text
PUBLIC_ALIAS_CONTAINMENT_METHOD=CERTIFICATION_HOST_GATE
FTGP_CERTIFICATION_MODE=true
```

Server-side gate (`src/middleware.ts` + `src/lib/ftgp/ftgp-certification-host-gate.ts`):

- **Allow:** protected deployment host pattern `crow-ftgp-certification-{hash}-muhanadghurabs-projects.vercel.app`
- **Deny:** stable alias `crow-ftgp-certification.vercel.app` and team aliases → minimal `404` (no login, legal, or FTGP content)
- **Inactive** when `FTGP_CERTIFICATION_MODE` is not `true` (live Production, Preview, local dev unchanged)

---

## 4. Post-hardening access behavior

### Protected deployment host (anonymous)

```text
/ → 302 Vercel SSO
/login → 302
/account → 302
```

Crow application not visible before Vercel authorization.

### Protected deployment host (authorized Vercel session)

```text
/login → 200 (Crow login reachable)
Normal application routing → reachable
```

### Public project alias (anonymous)

```text
/ → 404
/login → 404
/account → 404
/auth/callback → 404
```

No Crow branding, Google login, or application metadata beyond denial.

### Live Production

Unchanged — `crow-ecosystem-platform.vercel.app/login` → 200.

---

## 5. OAuth redirect readiness

**Certification OAuth origin (protected host only):**

```text
https://crow-ftgp-certification-4o8ymfctt-muhanadghurabs-projects.vercel.app
```

**Exact Supabase redirect URLs to add** (do not remove Production URLs):

```text
https://crow-ftgp-certification-4o8ymfctt-muhanadghurabs-projects.vercel.app/auth/callback
https://crow-ftgp-certification-4o8ymfctt-muhanadghurabs-projects.vercel.app/auth/resolving
```

```text
PUBLIC_ALIAS_USED_FOR_OAUTH=false
WILDCARD_REDIRECT_REQUIRED=false
GOOGLE_CLOUD_ADDITIONAL_REDIRECT_REQUIRED=false
SUPABASE_REDIRECT_ALLOWLIST_UPDATE_REQUIRED=true
EXISTING_PRODUCTION_REDIRECTS_PRESERVED=true
```

Refresh host after each certification production deploy:

```bash
npm run ftgp-certification-deployment:mint
```

---

## 6. Google OAuth topology (static, not executed)

```text
Certification origin → Supabase OAuth → Google
→ https://wbwnsndcxrgyqwppurms.supabase.co/auth/v1/callback
→ protected /auth/callback → /auth/resolving
→ /register/legal (when acceptance missing) or /account
```

Normal Google OAuth, legal acceptance, and owner-proof artifact: **not executed** in 1H.3.

---

## 7. Quality gates

| Gate | Result |
|------|--------|
| typecheck | PASS |
| lint | PASS |
| ftgp-certification-host-gate:test | PASS |
| ftgp-certification-legal-gate:test | PASS |
| ftgp-certification-environment:verify | PASS |
| cloud-data-api-containment:verify | PASS |
| cloud-1e-post-apply:verify | PASS (23 migrations applied, 0 failed, 0 pending) |
| Local `npm run build` | OOM (known; Vercel certification build PASS) |

---

## 8. Hosted business state (unchanged)

| Check | Value |
|-------|-------|
| Candidate 07 status | `UNDER_DISCOVERY` |
| Owner fingerprint | `876863fe8c15c5c3` |
| DiscoveryProfile | 1 × `IN_PROGRESS`, `completedAt=null` |
| System markers | 2 |
| CLIENT_PROVIDED answers | 0 |
| Blueprints | 0 |
| PLATFORM_ADMIN / IMPLEMENTER | 1 each |

---

## 9. Production preservation

| Check | Result |
|-------|--------|
| PR #10 | OPEN, DRAFT, UNMERGED |
| `main` HEAD | `a5620c39f589dc4e4873ada46e07abec573cc154` |
| Live Production FTGP code | false |

---

## 10. Manual operator action

Add the two Supabase redirect URLs in §5 to project `wbwnsndcxrgyqwppurms`, then authorize owner browser proof execute (FTGP.1H.4 scope).
