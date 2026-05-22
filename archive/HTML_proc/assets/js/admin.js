/**
 * Admin console: request queue + status updates + audit (localStorage demo).
 * DEMO ONLY: Role gating is client-side only. Replace with backend auth later.
 */

import { appendAuditEntry, patchRequestById, readAuditLog, readRequests } from "./storage.js";
import { formatSar } from "./pricing.js";
import { renderAuditTableSection } from "./audit-ui.js";
import { getSession } from "./auth.js";

const STATUS_DISPLAY = {
  submitted: { icon: "📤", label: "Submitted" },
  draft: { icon: "📝", label: "Draft" },
  under_review: { icon: "🔎", label: "Under review" },
  accepted: { icon: "✅", label: "Approved" },
  rejected: { icon: "❌", label: "Rejected" },
};

const STATUS_OPTIONS = ["submitted", "under_review", "accepted", "rejected", "draft"];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param {Array<Record<string, unknown>>} requests
 */
function renderRequestsTable(requests) {
  const rows = requests
    .map((r) => {
      const row = /** @type {Record<string, unknown>} */ (r);
      const st = String(row.status || "");
      const disp =
        STATUS_DISPLAY[/** @type {keyof typeof STATUS_DISPLAY} */ (st)] || {
          icon: "",
          label: st,
        };
      const badgeIcon = disp.icon
        ? `<span class="status-icon" aria-hidden="true">${escapeHtml(disp.icon)}</span>`
        : "";
      const planIcon = String(row.planIcon || "").trim();
      const planName = String(row.planNameEn || row.planNameAr || "");
      const planCell = planIcon
        ? `<span class="icon-badge"><span class="status-icon" aria-hidden="true">${escapeHtml(planIcon)}</span>${escapeHtml(planName)}</span>`
        : escapeHtml(planName);
      const secIcon = String(row.securityIcon || "").trim();
      const secName = String(row.securityNameEn || "");
      const secCell = secIcon
        ? `<span class="icon-badge"><span class="status-icon" aria-hidden="true">${escapeHtml(secIcon)}</span>${escapeHtml(secName)}</span>`
        : escapeHtml(secName);
      const rawId = String(row.id || "");
      const rid = escapeHtml(rawId);
      const options = STATUS_OPTIONS.map((val) => {
        const label =
          STATUS_DISPLAY[/** @type {keyof typeof STATUS_DISPLAY} */ (val)]?.label || val;
        const sel = val === st ? " selected" : "";
        return `<option value="${escapeHtml(val)}"${sel}>${escapeHtml(label)}</option>`;
      }).join("");
      return `
        <tr>
          <td><code>${rid}</code></td>
          <td>${escapeHtml(String(row.companyName || ""))}</td>
          <td><span class="cc-badge icon-badge">${badgeIcon}${escapeHtml(disp.label)}</span></td>
          <td>
            <label class="cc-admin-status-label">
              <span class="visually-hidden">Status for ${rid}</span>
              <select class="cc-admin-status" data-admin-status data-request-id="${escapeHtml(rawId)}">
                ${options}
              </select>
            </label>
          </td>
          <td>${planCell}</td>
          <td>${secCell}</td>
          <td>${escapeHtml(formatSar(Number(row.estimatedMonthlySar || 0)))}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div class="cc-admin-table-wrap">
      <table class="cc-admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Company</th>
            <th>Status</th>
            <th>Update</th>
            <th>Plan</th>
            <th>Security</th>
            <th>Est. monthly</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

export function initAdmin() {
  const root = document.getElementById("admin-root");
  if (!root) return;

  const session = getSession();
  appendAuditEntry({
    action: "admin_console_viewed",
    actorName: session?.displayName ?? "CyberCrow Admin",
    actorRole: session?.role ?? "cybercrow_admin",
    target: "admin.html",
    severity: "info",
  });

  const requests = readRequests();
  const auditEntries = readAuditLog();

  if (!requests.length) {
    root.innerHTML = `
      <div class="cc-placeholder-panel">
        <strong><span class="nav-icon" aria-hidden="true">🧑‍💻</span> No local requests</strong>
        Requests submitted from the ERP request page in this browser will appear here.
      </div>
      ${renderAuditTableSection(auditEntries, {
        title: "Audit log (this browser)",
        hint: "Includes demo auth events and request lifecycle (local only).",
      })}
    `;
    return;
  }

  root.innerHTML = `
    ${renderRequestsTable(requests)}
    ${renderAuditTableSection(auditEntries, {
      title: "Audit log (this browser)",
      hint: "Includes demo auth events and request lifecycle (local only).",
    })}
  `;

  root.addEventListener("change", (ev) => {
    const sel = /** @type {HTMLSelectElement | null} */ (
      /** @type {HTMLElement} */ (ev.target).closest("[data-admin-status]")
    );
    if (!sel) return;
    const id = sel.dataset.requestId;
    if (!id) return;
    const nextStatus = sel.value;
    const result = patchRequestById(id, { status: nextStatus });
    if (!result) return;

    const actor = getSession();
    appendAuditEntry({
      action: "request_status_changed",
      actorName: actor?.displayName ?? "CyberCrow Admin",
      actorRole: actor?.role ?? "cybercrow_admin",
      target: id,
      severity: "info",
      requestId: id,
      companyName: String(result.next.companyName || ""),
      estimatedMonthlySar: Number(result.next.estimatedMonthlySar || 0),
      prevStatus: String(result.prev.status || ""),
      newStatus: nextStatus,
    });
  });
}
