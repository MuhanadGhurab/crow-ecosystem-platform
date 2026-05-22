/**
 * Shared audit log rendering for admin and audit-focused pages.
 */

import { formatSar } from "./pricing.js";

const ACTION_LABELS = {
  request_submitted: "Request submitted (local)",
  demo_login: "Demo login",
  demo_logout: "Demo logout",
  client_dashboard_viewed: "Client dashboard viewed",
  admin_console_viewed: "Admin console viewed",
  request_status_changed: "Request status changed",
};

/**
 * @param {string} s
 */
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
 * @param {Array<Record<string, unknown>>} entries
 * @param {{ title?: string, hint?: string, variant?: "admin"|"audit" }} opts
 */
export function renderAuditTableSection(entries, opts = {}) {
  const title = opts.title || "Audit log (this browser)";
  const hint =
    opts.hint ||
    "Append-only local trail. Phase 2 moves this to the server with real authentication.";
  if (!entries.length) {
    return `
      <section class="cc-admin-audit" aria-labelledby="audit-empty-heading">
        <h2 id="audit-empty-heading" class="cc-title-lg">${escapeHtml(title)}</h2>
        <p class="cc-dash-sub cc-admin-audit__hint">${escapeHtml(hint)}</p>
        <div class="cc-placeholder-panel">
          <strong><span class="nav-icon" aria-hidden="true">📜</span> No audit rows yet</strong>
          Actions such as demo login or request submission will appear here.
        </div>
      </section>
    `;
  }

  const rows = entries
    .map((e) => {
      const row = /** @type {Record<string, unknown>} */ (e);
      const action = String(row.action || "");
      const label =
        ACTION_LABELS[/** @type {keyof typeof ACTION_LABELS} */ (action)] || action || "—";
      const when = formatDateTime(String(row.timestamp || row.createdAt || ""));
      const rid = String(row.requestId || "");
      const company = String(row.companyName || "");
      const amt = Number(row.estimatedMonthlySar ?? 0);
      const amtStr = Number.isFinite(amt) ? formatSar(amt) : "—";
      const actor = String(row.actorName || "—");
      const role = String(row.actorRole || "—");
      const target = String(row.target || rid || company || "—");
      const severity = String(row.severity || "info");
      const sevClass =
        severity === "critical"
          ? "cc-sev cc-sev--critical"
          : severity === "warning"
            ? "cc-sev cc-sev--warn"
            : "cc-sev cc-sev--info";
      return `
        <tr>
          <td>${escapeHtml(when)}</td>
          <td><span class="${sevClass}">${escapeHtml(severity)}</span></td>
          <td>${escapeHtml(actor)}</td>
          <td>${escapeHtml(role)}</td>
          <td>${escapeHtml(label)}</td>
          <td><code>${escapeHtml(target)}</code></td>
          <td><code>${escapeHtml(rid)}</code></td>
          <td>${escapeHtml(company)}</td>
          <td>${escapeHtml(amtStr)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <section class="cc-admin-audit" aria-labelledby="audit-table-heading">
      <h2 id="audit-table-heading" class="cc-title-lg">${escapeHtml(title)}</h2>
      <p class="cc-dash-sub cc-admin-audit__hint">${escapeHtml(hint)}</p>
      <div class="cc-admin-table-wrap">
        <table class="cc-admin-table cc-admin-table--audit">
          <thead>
            <tr>
              <th>Time</th>
              <th>Severity</th>
              <th>Actor</th>
              <th>Role</th>
              <th>Action</th>
              <th>Target</th>
              <th>Request ID</th>
              <th>Company</th>
              <th>Est. monthly</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}
