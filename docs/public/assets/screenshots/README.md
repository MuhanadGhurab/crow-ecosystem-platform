# Screenshot gallery

Add PNG or WebP captures here for the public GitHub README.

**Rules:** dark theme, no API keys in devtools, no real customer PII, use **mock demo** routes only.

---

## Recommended captures

| File | Route (mock / public) |
|------|------------------------|
| `homepage.png` | `/` |
| `architecture.png` | `/architecture` |
| `request.png` | `/request` |
| `admin-request.png` | `/admin/requests/mock-req-meem` |
| `blueprint-pricing.png` | `/blueprints/mock-bp-meem/pricing` |
| `tenant-dashboard.png` | `/meem-global/dashboard` (mock data) |
| `cybercrow-dashboard.png` | `/meem-global/cybercrow/dashboard` |

---

## Capture

```bash
# In .env: AUTH_DISABLED=true  USE_MOCK_DATA=true
npm run dev
npm run demo:meem
```

---

## Embed in README

```markdown
![Crow Ecosystem homepage](./docs/public/assets/screenshots/homepage.png)
```
