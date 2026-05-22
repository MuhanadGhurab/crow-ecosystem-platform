/**
 * Client dashboard: lists ERP requests saved in localStorage.
 * DEMO ONLY: Access is gated in app.js (not real authentication).
 */

import { getSession } from "./auth.js";
import { appendAuditEntry, readRequests } from "./storage.js";
import { formatSar } from "./pricing.js";

const STATUS_DISPLAY = {
  submitted: { icon: "📤", label: "Submitted" },
  draft: { icon: "📝", label: "Draft" },
  under_review: { icon: "🔎", label: "Under review" },
  accepted: { icon: "✅", label: "Approved" },
  rejected: { icon: "❌", label: "Rejected" },
};

const SECTOR_LABELS = {
  technology: "Technology & IT",
  finance: "Finance & banking",
  healthcare: "Healthcare",
  manufacturing: "Manufacturing",
  logistics: "Logistics & transport",
  retail: "Retail",
  services: "Professional services",
  public: "Public sector",
  other: "Other",
};

const TIMELINE_LABELS = {
  asap: "Within 1 month",
  "1_3": "1–3 months",
  "3_6": "3–6 months",
  flexible: "Flexible / TBD",
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param {string} iso
 */
function formatDateTime(iso) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-SA", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return iso;
  }
}

/**
 * @param {Record<string, unknown>} r
 */
function formatModulesCell(r) {
  const icons = Array.isArray(r.moduleIcons)
    ? /** @type {string[]} */ (r.moduleIcons)
    : [];
  const labelsEn = Array.isArray(r.moduleLabelsEn)
    ? /** @type {string[]} */ (r.moduleLabelsEn)
    : [];
  const labelsAr = Array.isArray(r.moduleLabelsAr)
    ? /** @type {string[]} */ (r.moduleLabelsAr)
    : [];

  if (labelsEn.length && icons.length === labelsEn.length) {
    return labelsEn
      .map((label, i) => {
        const ic = icons[i] ? icons[i].trim() : "";
        const iconHtml = ic
          ? `<span class="status-icon" aria-hidden="true">${escapeHtml(ic)}</span>`
          : "";
        return `<span class="cc-dash-mod">${iconHtml}${escapeHtml(label)}</span>`;
      })
      .join("");
  }

  if (labelsEn.length) return escapeHtml(labelsEn.join(", "));
  if (labelsAr.length) return escapeHtml(labelsAr.join(", "));
  return "—";
}

/**
 * @param {Record<string, unknown>} r
 */
function renderCard(r) {
  const status = String(r.status || "");
  const st =
    STATUS_DISPLAY[/** @type {keyof typeof STATUS_DISPLAY} */ (status)] || {
      icon: "",
      label: status,
    };
  const sector =
    SECTOR_LABELS[/** @type {keyof typeof SECTOR_LABELS} */ (String(r.sector))] ||
    String(r.sector || "—");
  const timeline =
    TIMELINE_LABELS[/** @type {keyof typeof TIMELINE_LABELS} */ (String(r.timeline))] ||
    String(r.timeline || "—");
  const modsHtml = formatModulesCell(r);
  const planIcon = String(r.planIcon || "").trim();
  const planName = String(r.planNameEn || r.planNameAr || "—");
  const planHtml = planIcon
    ? `<span class="cc-dash-inline"><span class="status-icon" aria-hidden="true">${escapeHtml(planIcon)}</span>${escapeHtml(planName)}</span>`
    : escapeHtml(planName);
  const secIcon = String(r.securityIcon || "").trim();
  const secName = String(r.securityNameEn || "—");
  const secHtml = secIcon
    ? `<span class="cc-dash-inline"><span class="status-icon" aria-hidden="true">${escapeHtml(secIcon)}</span>${escapeHtml(secName)}</span>`
    : escapeHtml(secName);

  const badgeIcon = st.icon
    ? `<span class="status-icon" aria-hidden="true">${escapeHtml(st.icon)}</span>`
    : "";

  return `
    <article class="cc-dash-card">
      <header class="cc-dash-card__head">
        <div>
          <h2 class="cc-dash-card__title">${escapeHtml(String(r.companyName || "—"))}</h2>
          <p class="cc-dash-card__meta">${escapeHtml(formatDateTime(String(r.createdAt || "")))}</p>
        </div>
        <span class="cc-badge icon-badge">${badgeIcon}${escapeHtml(st.label)}</span>
      </header>
      <dl class="cc-dash-dl">
        <div><dt>Industry</dt><dd>${escapeHtml(sector)}</dd></div>
        <div><dt>Users</dt><dd>${escapeHtml(String(r.userEstimate ?? "—"))}</dd></div>
        <div><dt>Timeline</dt><dd>${escapeHtml(timeline)}</dd></div>
        <div><dt>Plan</dt><dd>${planHtml}</dd></div>
        <div><dt>Security layer</dt><dd>${secHtml}</dd></div>
        <div class="cc-dash-dl--full"><dt>ERP modules</dt><dd class="cc-dash-mods">${modsHtml}</dd></div>
        <div class="cc-dash-dl--total"><dt>Est. monthly</dt><dd>${escapeHtml(formatSar(Number(r.estimatedMonthlySar || 0)))}</dd></div>
      </dl>
    </article>
  `;
}

export function initDashboard() {
  const root = document.getElementById("dashboard-root");
  if (!root) return;

  const session = getSession();
  appendAuditEntry({
    action: "client_dashboard_viewed",
    actorName: session?.displayName ?? "Client Manager",
    actorRole: session?.role ?? "client_manager",
    target: "dashboard.html",
    severity: "info",
  });

  const requests = readRequests();
  if (!requests.length) {
    root.innerHTML = `
      <div class="cc-placeholder-panel">
        <strong><span class="nav-icon" aria-hidden="true">📊</span> No saved requests yet</strong>
        Submit an ERP request from the request page to store it in this browser (localStorage).
      </div>
    `;
    return;
  }

  root.innerHTML = `<div class="cc-dash-cards">${requests.map((r) => renderCard(/** @type {Record<string, unknown>} */ (r))).join("")}</div>`;
}
