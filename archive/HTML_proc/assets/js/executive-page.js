/**
 * Executive summary cards from locally stored ERP requests (demo).
 */

import { readRequests } from "./storage.js";
import { formatSar } from "./pricing.js";

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
 * @param {Record<string, unknown>} r
 */
function moduleLabels(r) {
  const labels = Array.isArray(r.moduleLabelsEn)
    ? /** @type {string[]} */ (r.moduleLabelsEn)
    : [];
  return labels.map((x) => String(x));
}

export function initExecutivePage() {
  const root = document.getElementById("executive-root");
  if (!root) return;

  const requests = readRequests().map((r) => /** @type {Record<string, unknown>} */ (r));
  const total = requests.length;
  const revenue = requests.reduce((sum, r) => sum + Number(r.estimatedMonthlySar || 0), 0);

  const underReview = requests.filter((r) => String(r.status || "") === "under_review").length;

  const counts = new Map();
  for (const r of requests) {
    for (const label of moduleLabels(r)) {
      if (!label.trim()) continue;
      counts.set(label, (counts.get(label) || 0) + 1);
    }
  }
  const topMods = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const modsHtml = topMods.length
    ? `<ol class="cc-exec-list">${topMods
        .map(
          ([label, n]) =>
            `<li><span class="cc-exec-list__label">${escapeHtml(label)}</span><span class="cc-exec-list__meta">${n}×</span></li>`
        )
        .join("")}</ol>`
    : `<p class="cc-dash-sub">No module selections recorded yet.</p>`;

  root.innerHTML = `
    <div class="cc-exec-grid">
      <article class="cc-exec-card">
        <h2 class="cc-exec-card__title">Total requests</h2>
        <p class="cc-exec-card__value">${escapeHtml(String(total))}</p>
        <p class="cc-exec-card__hint">All statuses in this browser queue.</p>
      </article>
      <article class="cc-exec-card">
        <h2 class="cc-exec-card__title">Estimated monthly revenue</h2>
        <p class="cc-exec-card__value">${escapeHtml(formatSar(revenue))}</p>
        <p class="cc-exec-card__hint">Sum of SAR estimates from stored requests (UI only).</p>
      </article>
      <article class="cc-exec-card">
        <h2 class="cc-exec-card__title">Requests under review</h2>
        <p class="cc-exec-card__value">${escapeHtml(String(underReview))}</p>
        <p class="cc-exec-card__hint">Status = under review in localStorage.</p>
      </article>
      <article class="cc-exec-card cc-exec-card--wide">
        <h2 class="cc-exec-card__title">Most selected ERP modules</h2>
        ${modsHtml}
      </article>
    </div>
  `;
}
