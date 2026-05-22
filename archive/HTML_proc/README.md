# CyberCrow — secure ERP request portal (HTML/CSS/JS)

## What is this?

**CyberCrow** is an **English / LTR** experience for requesting, configuring, and subscribing to **ERP** systems with tiered CyberCrow security layers (**Crow Shield**, **Crow Sentinel**, **Crow Fortress**).  
Phase 1 ships the **request wizard**, **live SAR estimate**, **draft autosave**, and **local submission storage**. **Phase 2** is backend, authentication, and APIs.

## Run it with Live Server in Cursor

1. Open the `HTML_proc` folder as the preview root.
2. Right-click `index.html` → **Open with Live Server** (if the extension is installed).
3. Typical URL: `http://127.0.0.1:5500/index.html`

> **Important:** loading JSON via `fetch` requires `http://localhost` / `127.0.0.1`. Opening files as `file://` will block the data requests.

## Brand image

The UI references the full logo at:

`assets/img/cybercrow.png`

Replace that asset with your production artwork as needed.

## Folder layout

```
HTML_proc/
├── index.html
├── README.md
├── assets/
│   ├── css/          # LTR foundation, components, dashboards, responsive
│   ├── js/           # Storage, pricing, validation, request wizard, dashboards
│   ├── img/          # Logos and imagery
│   └── icons/
├── pages/            # Request flow, dashboards, about
├── data/             # Seed JSON for modules, plans, security layers
└── docs/             # English product/technical notes
```

## Phase 1 highlights

- **English / LTR** interface with **IBM Plex Sans**.
- Dark glass UI with cobalt / cyan / teal accents.
- **Homepage**, **ERP request** page, **about**, **client dashboard**, **admin preview**.
- **localStorage** keys:
  - `cybercrow.requests.v1` — submitted requests from this browser.
  - `cybercrow.requestDraft.v1` — in-progress draft for the request form.

## Phase 2 and beyond

See `docs/NEXT_STEPS.md` for backend, auth, admin workflows, and hardening.

---

**Founder:** Muhanad Ghurab — IT specialist with a cybersecurity focus.
