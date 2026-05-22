# CyberCrow — recommended demo script

Follow these steps in order. All paths are relative to the repository root (`d:\CYBERCROW\` on your machine). Serve the app over HTTP (see root `README.md`); `file://` URLs can break JSON loading.

**Shared demo password (all accounts):** `Demo123!`

Account emails are defined in `HTML_proc/assets/js/auth.js` (`DEMO_USERS`).

---

## 1. Open the homepage

1. Start your static server with **`HTML_proc`** as the site root (see root `README.md`).
2. Open **`HTML_proc/index.html`** in the browser (for example `http://127.0.0.1:5500/index.html` if using Live Server on that folder).

You should see the CyberCrow home page with navigation to ERP request, dashboard, admin, and so on.

---

## 2. Log in as Client User

1. Go to **`HTML_proc/pages/login.html`** (from home, use the account / login entry in the nav if present, or open this path directly).
2. Under **Demo account**, select **Client User** (`client.user@demo.com`).
3. Enter password **`Demo123!`** and submit / continue as the UI indicates.

---

## 3. Submit an ERP request

1. Open **`HTML_proc/pages/request.html`** (nav: **ERP request**).
2. Complete the wizard at a high level:
   - **Company profile** — fill the company and contact fields shown on the form.
   - **ERP modules** — pick at least one module (section **#modules** if you use in-page anchors).
   - **Security layer** — choose a CyberCrow tier (**#security**).
   - **Plans** — pick a subscription plan (**#plans**).
3. Submit the request so it is stored **in this browser** (`localStorage`). Confirm the success message and/or follow the link to the client dashboard if offered.

---

## 4. Log in as Client Manager

1. Open **`HTML_proc/pages/login.html`** again (or use **Sign out** / visitor flow if you need to clear the session first, per the login page instructions).
2. Select **Client Manager** (`client.manager@demo.com`).
3. Password: **`Demo123!`**.

---

## 5. View the request on the client dashboard

1. Open **`HTML_proc/pages/dashboard.html`** (nav: **Client dashboard**).
2. Confirm the submitted ERP request appears in the client dashboard list or detail view for this browser session.

---

## 6. Log in as CyberCrow Admin

1. **`HTML_proc/pages/login.html`** — select **CyberCrow Admin** (`admin@cybercrow.local`).
2. Password: **`Demo123!`**.

---

## 7. Review the request (and status if shown)

1. Open **`HTML_proc/pages/admin.html`** (nav: **Admin**).
2. Locate the same request and review any status, filters, or actions the admin UI exposes for demo data.

---

## 8. Log in as Security Analyst

1. **`HTML_proc/pages/login.html`** — select **Security Analyst** (`analyst@cybercrow.local`).
2. Password: **`Demo123!`**.

---

## 9. View audit logs

1. Open **`HTML_proc/pages/audit.html`** (use the in-app navigation to the audit area if your build exposes it).
2. Review audit entries tied to demo actions (for example logins and request-related events stored for this browser).

---

## 10. Log in as Executive

1. **`HTML_proc/pages/login.html`** — select **Executive** (`executive@cybercrow.local`).
2. Password: **`Demo123!`**.

---

## 11. View the executive summary

1. Open **`HTML_proc/pages/executive.html`** (via navigation from the shell if available).
2. Review the high-level executive summary and metrics the page presents for the demo dataset.

---

## Next.js app — Phase 7 highlights (`npm run dev`)

1. **`/request`** — submit with industry **Logistics**, **Retail**, or **Healthcare**; note estimated pricing on admin request after review.
2. **Admin** → start discovery → **Apply logistics template** on organization step.
3. **Blueprint overview** — **Send proposal** → open **`/proposal/[token]`** → client **Approve**.
4. **`/blueprints/[id]/readiness`** — go-live checklist traffic lights.
5. **Tenant workspace** — sign in as `tenant_admin` vs `tenant_user`: different SAREA nav/widgets; `tenant_user` blocked from invite (check **`/[tenant]/cybercrow/audit-logs`**).
6. **`/[tenant]/users`** — tenant_admin assigns a CEM role; audit shows `ROLE_ASSIGNED`; tenant_user cannot assign (`POLICY_DENIED`).
7. **`/[tenant]/settings`** — MFA/IdP from discovery.
8. **`/admin/tenants`** — workspace health column.

---

## Reference — key files

| Purpose            | Path                               |
| ------------------ | ---------------------------------- |
| Home               | `HTML_proc/index.html`             |
| Demo login         | `HTML_proc/pages/login.html`       |
| ERP request wizard | `HTML_proc/pages/request.html`     |
| Client dashboard   | `HTML_proc/pages/dashboard.html`   |
| Admin              | `HTML_proc/pages/admin.html`       |
| Audit logs         | `HTML_proc/pages/audit.html`       |
| Executive summary  | `HTML_proc/pages/executive.html`   |
| Demo users / password | `HTML_proc/assets/js/auth.js`   |
