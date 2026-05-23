# Screenshot gallery

Add PNG or WebP captures here for the public GitHub README.  
Recommended: **1920×1080** or **1440×900**, dark theme, no real customer PII.

---

## Required captures

| File | Route | Notes |
|------|-------|-------|
| `homepage.png` | `/` | Hero + three engine cards |
| `architecture-public.png` | `/architecture` | Customer pipeline story |
| `request-wizard.png` | `/request` | Implementation intake |
| `admin-request.png` | `/admin/requests/mock-req-meem` | Lifecycle + product process (mock ID) |
| `blueprint-pricing.png` | `/blueprints/mock-bp-meem/pricing` | Commercial workspace |
| `tenant-dashboard.png` | `/meem-global/dashboard` | CEM + SAREA runtime (mock/demo data) |
| `cybercrow-dashboard.png` | `/meem-global/cybercrow/dashboard` | Security posture |
| `modules.png` | `/modules` | CEM catalog + talent profiles |

---

## How to capture

```bash
# UI-only demo
AUTH_DISABLED=true USE_MOCK_DATA=true npm run dev
npm run demo:meem
```

Use browser full-page or viewport capture. Crop sensitive browser chrome if needed.

---

## README embed example

```markdown
![Crow Ecosystem homepage](./docs/assets/screenshots/homepage.png)
```

---

## Do not publish

- Screenshots with real email addresses or API keys in devtools
- `/admin/audit` with personal `PIPELINE_NOTIFY_EMAIL_OVERRIDE` visible
- Production URLs with internal resource names
