/**
 * ERP request wizard: modules, security layer, plan, live summary, localStorage.
 */

import { loadJson } from "./data.js";
import { computeMonthlyEstimate, formatSar } from "./pricing.js";
import { appendAuditEntry, appendRequest, readDraft, writeDraft } from "./storage.js";
import { getSessionSnapshotForAudit } from "./auth.js";
import { validateErpRequestForm } from "./validation.js";
import { setText } from "./render.js";

/** @typedef {{ id: string, name_en?: string, name_ar?: string, slug: string, monthly_addon_sar: number, icon?: string }} ErpModule */
/** @typedef {{ id: string, name_en: string, monthly_addon_sar: number, description_en?: string, description_ar?: string, icon?: string }} SecurityLayer */
/** @typedef {{ id: string, name_en: string, name_ar?: string, base_monthly_sar: number, description_en?: string, description_ar?: string, icon?: string }} Plan */

const DATA = {
  modules: "../data/modules.json",
  security: "../data/security-layers.json",
  plans: "../data/plans.json",
};

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function debounce(fn, ms) {
  let t = 0;
  return (...args) => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
}

/** @param {ErpModule} mod */
function moduleLabel(mod) {
  return mod.name_en || mod.name_ar || mod.slug;
}

/** @param {SecurityLayer} layer */
function layerDescription(layer) {
  return layer.description_en || layer.description_ar || "";
}

/** @param {Plan} plan */
function planDescription(plan) {
  return plan.description_en || plan.description_ar || "";
}

/** @param {string} [icon] */
function inlineIconHtml(icon) {
  const ic = icon && String(icon).trim();
  if (!ic) return "";
  return `<span class="summary-inline-icon" aria-hidden="true">${escapeHtml(ic)}</span>`;
}

/** @param {string} [icon] */
function ddWithOptionalIcon(icon, text) {
  if (text == null || text === "") return "—";
  return `${inlineIconHtml(icon)}${escapeHtml(String(text))}`;
}

/** @param {string} [icon] */
function cardIconHtml(icon) {
  const ic = icon && String(icon).trim();
  if (!ic) return "";
  return `<span class="card-icon" aria-hidden="true">${escapeHtml(ic)}</span>`;
}

/**
 * @param {HTMLElement} root
 * @param {ErpModule[]} modules
 */
function renderModulePicks(root, modules) {
  root.innerHTML = "";
  modules.forEach((mod) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cc-pick cc-pick--multi";
    btn.dataset.pickType = "module";
    btn.dataset.id = mod.id;
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = `
      ${cardIconHtml(mod.icon)}
      <span class="cc-pick__title">${escapeHtml(moduleLabel(mod))}</span>
      <span class="cc-pick__meta">+${formatSar(mod.monthly_addon_sar)} / mo</span>
    `;
    root.appendChild(btn);
  });
}

/**
 * @param {HTMLElement} root
 * @param {SecurityLayer[]} layers
 */
function renderSecurityPicks(root, layers) {
  root.innerHTML = "";
  layers.forEach((layer) => {
    const id = `sec_${layer.id}`;
    const wrap = document.createElement("label");
    wrap.className = "cc-pick cc-pick--radio";
    wrap.innerHTML = `
      <input type="radio" name="securityLayer" value="${escapeHtml(layer.id)}" id="${id}" />
      <span class="cc-pick__body">
        <span class="cc-pick__title cc-pick__title--with-icon">${cardIconHtml(layer.icon)}<span>${escapeHtml(layer.name_en)}</span></span>
        <span class="cc-pick__text">${escapeHtml(layerDescription(layer))}</span>
        <span class="cc-pick__meta">+${formatSar(layer.monthly_addon_sar)} / mo</span>
      </span>
    `;
    root.appendChild(wrap);
  });
}

/**
 * @param {HTMLElement} root
 * @param {Plan[]} plans
 */
function renderPlanPicks(root, plans) {
  root.innerHTML = "";
  plans.forEach((plan) => {
    const id = `plan_${plan.id}`;
    const wrap = document.createElement("label");
    wrap.className = "cc-pick cc-pick--radio";
    wrap.innerHTML = `
      <input type="radio" name="plan" value="${escapeHtml(plan.id)}" id="${id}" />
      <span class="cc-pick__body">
        <span class="cc-pick__title cc-pick__title--with-icon">${cardIconHtml(plan.icon)}<span>${escapeHtml(plan.name_en)}</span></span>
        <span class="cc-pick__text">${escapeHtml(planDescription(plan))}</span>
        <span class="cc-pick__meta">Plan base: ${formatSar(plan.base_monthly_sar)} / mo</span>
      </span>
    `;
    root.appendChild(wrap);
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param {Record<string, string>} errors
 */
function showErrors(errors) {
  document.querySelectorAll("[data-error-for]").forEach((el) => {
    const key = el.getAttribute("data-error-for");
    if (!key) return;
    const msg = errors[key] || "";
    el.textContent = msg;
    el.hidden = !msg;
    const holder = document.querySelector(`[data-field="${key}"]`);
    if (holder) holder.classList.toggle("has-error", Boolean(msg));
  });
}

function clearErrors() {
  showErrors({});
}

export async function initRequestPage() {
  // DEMO ONLY: Role gating is enforced in app.js via auth.js (not real authentication).

  const form = document.getElementById("erp-request-form");
  const moduleRoot = document.getElementById("module-picks");
  const securityRoot = document.getElementById("security-picks");
  const planRoot = document.getElementById("plan-picks");
  const successBanner = document.getElementById("request-success");
  const submitBtn = document.getElementById("request-submit");

  if (!form || !moduleRoot || !securityRoot || !planRoot) return;

  /** @type {ErpModule[]} */
  let modules = [];
  /** @type {SecurityLayer[]} */
  let securityLayers = [];
  /** @type {Plan[]} */
  let plans = [];

  try {
    [modules, securityLayers, plans] = await Promise.all([
      /** @type {Promise<ErpModule[]>} */ (loadJson(DATA.modules)),
      /** @type {Promise<SecurityLayer[]>} */ (loadJson(DATA.security)),
      /** @type {Promise<Plan[]>} */ (loadJson(DATA.plans)),
    ]);
  } catch (e) {
    console.error(e);
    const errEl = document.getElementById("request-load-error");
    setText(
      errEl,
      "Could not load modules, security layers, or plans. Serve the site over HTTP (e.g. Live Server), not as a raw file:// URL."
    );
    if (errEl) errEl.hidden = false;
    return;
  }

  renderModulePicks(moduleRoot, modules);
  renderSecurityPicks(securityRoot, securityLayers);
  renderPlanPicks(planRoot, plans);

  const draft = readDraft();
  if (draft && typeof draft === "object") {
    applyDraft(/** @type {Record<string, unknown>} */ (draft));
  }

  const getSelectedModuleIds = () =>
    [...moduleRoot.querySelectorAll(".cc-pick--multi.is-selected")].map(
      (b) => /** @type {HTMLElement} */ (b).dataset.id || ""
    );

  const getPlan = () => {
    const checked = form.querySelector('input[name="plan"]:checked');
    const id = checked?.value;
    return plans.find((p) => p.id === id) ?? null;
  };

  const getSecurity = () => {
    const checked = form.querySelector('input[name="securityLayer"]:checked');
    const id = checked?.value;
    return securityLayers.find((s) => s.id === id) ?? null;
  };

  const getSelectedModules = () => {
    const ids = new Set(getSelectedModuleIds());
    return modules.filter((m) => ids.has(m.id));
  };

  function updateSummary() {
    const plan = getPlan();
    const security = getSecurity();
    const selectedMods = getSelectedModules();
    const total = computeMonthlyEstimate({
      plan,
      securityLayer: security,
      selectedModules: selectedMods,
    });

    const planEl = document.getElementById("sum-plan");
    if (planEl) {
      planEl.innerHTML = plan ? ddWithOptionalIcon(plan.icon, plan.name_en) : "—";
    }

    setText(
      document.getElementById("sum-plan-base"),
      plan ? formatSar(plan.base_monthly_sar) : "—"
    );

    const secEl = document.getElementById("sum-security");
    if (secEl) {
      secEl.innerHTML = security
        ? ddWithOptionalIcon(security.icon, security.name_en)
        : "—";
    }
    setText(
      document.getElementById("sum-security-addon"),
      security ? formatSar(security.monthly_addon_sar) : "—"
    );

    const modEl = document.getElementById("sum-modules");
    if (modEl) {
      if (!selectedMods.length) {
        modEl.textContent = "No ERP modules selected yet.";
      } else {
        modEl.innerHTML = selectedMods
          .map(
            (m) =>
              `<div class="cc-summary-line"><span class="cc-summary-line__label">${inlineIconHtml(m.icon)}<span>${escapeHtml(moduleLabel(m))}</span></span><span>${formatSar(m.monthly_addon_sar)}</span></div>`
          )
          .join("");
      }
    }

    setText(document.getElementById("sum-users"), String(form.userCount.value || "—"));
    setText(document.getElementById("sum-total"), formatSar(total));
  }

  function collectDraft() {
    return {
      companyName: String(form.companyName.value || "").trim(),
      sector: String(form.sector.value || "").trim(),
      userCount: form.userCount.value,
      timeline: String(form.timeline.value || "").trim(),
      notes: String(form.notes.value || "").trim(),
      moduleIds: getSelectedModuleIds(),
      securityLayerId: form.querySelector('input[name="securityLayer"]:checked')?.value ?? "",
      planId: form.querySelector('input[name="plan"]:checked')?.value ?? "",
    };
  }

  function applyDraft(d) {
    if (d.companyName) form.companyName.value = String(d.companyName);
    if (d.sector) form.sector.value = String(d.sector);
    if (d.userCount != null) form.userCount.value = String(d.userCount);
    if (d.timeline) form.timeline.value = String(d.timeline);
    if (d.notes != null) form.notes.value = String(d.notes);

    const mids = Array.isArray(d.moduleIds) ? d.moduleIds.map(String) : [];
    moduleRoot.querySelectorAll(".cc-pick--multi").forEach((btn) => {
      const id = /** @type {HTMLElement} */ (btn).dataset.id;
      const on = mids.includes(id || "");
      btn.classList.toggle("is-selected", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    if (d.securityLayerId) {
      form.querySelectorAll('input[name="securityLayer"]').forEach((inp) => {
        if (inp.value === String(d.securityLayerId)) {
          /** @type {HTMLInputElement} */ (inp).checked = true;
        }
      });
    }
    if (d.planId) {
      form.querySelectorAll('input[name="plan"]').forEach((inp) => {
        if (inp.value === String(d.planId)) {
          /** @type {HTMLInputElement} */ (inp).checked = true;
        }
      });
    }
  }

  const persistDraft = debounce(() => {
    writeDraft(collectDraft());
  }, 450);

  moduleRoot.addEventListener("click", (e) => {
    const t = /** @type {HTMLElement} */ (e.target).closest(".cc-pick--multi");
    if (!t) return;
    const on = !t.classList.contains("is-selected");
    t.classList.toggle("is-selected", on);
    t.setAttribute("aria-pressed", on ? "true" : "false");
    updateSummary();
    persistDraft();
  });

  form.addEventListener("change", () => {
    updateSummary();
    persistDraft();
  });

  form.addEventListener("input", () => {
    updateSummary();
    persistDraft();
  });

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (successBanner) successBanner.hidden = true;
    clearErrors();

    const data = collectDraft();
    const validation = validateErpRequestForm({
      companyName: data.companyName,
      sector: data.sector,
      userCount: data.userCount,
      timeline: data.timeline,
      moduleIds: data.moduleIds,
      securityLayerId: data.securityLayerId,
      planId: data.planId,
    });

    if (!validation.ok) {
      showErrors(validation.errors);
      document.getElementById("form-errors-summary")?.removeAttribute("hidden");
      return;
    }

    document.getElementById("form-errors-summary")?.setAttribute("hidden", "true");

    const plan = getPlan();
    const security = getSecurity();
    const selectedMods = getSelectedModules();
    const total = computeMonthlyEstimate({
      plan,
      securityLayer: security,
      selectedModules: selectedMods,
    });

    const record = {
      id: newId(),
      createdAt: new Date().toISOString(),
      status: "submitted",
      companyName: data.companyName,
      sector: data.sector,
      userEstimate: Number(data.userCount),
      timeline: data.timeline,
      notes: data.notes,
      moduleIds: data.moduleIds,
      moduleIcons: selectedMods.map((m) => String(m.icon || "").trim()),
      moduleLabelsEn: selectedMods.map((m) => moduleLabel(m)),
      moduleLabelsAr: selectedMods.map((m) => m.name_ar || moduleLabel(m)),
      securityLayerId: data.securityLayerId,
      securityNameEn: security?.name_en ?? "",
      securityIcon: security?.icon ? String(security.icon).trim() : "",
      planId: data.planId,
      planNameAr: plan?.name_ar ?? "",
      planNameEn: plan?.name_en ?? "",
      planIcon: plan?.icon ? String(plan.icon).trim() : "",
      estimatedMonthlySar: total,
    };

    appendRequest(record);
    const actor = getSessionSnapshotForAudit();
    appendAuditEntry({
      id: `aud_${record.id}`,
      createdAt: record.createdAt,
      action: "request_submitted",
      actorName: actor?.displayName ?? "Unknown (legacy)",
      actorRole: actor?.role ?? "unknown",
      target: String(record.id),
      severity: "info",
      requestId: record.id,
      companyName: record.companyName,
      estimatedMonthlySar: record.estimatedMonthlySar,
    });
    writeDraft(null);
    form.reset();
    moduleRoot.querySelectorAll(".cc-pick--multi").forEach((btn) => {
      btn.classList.remove("is-selected");
      btn.setAttribute("aria-pressed", "false");
    });
    updateSummary();

    if (successBanner) {
      successBanner.hidden = false;
      successBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    if (submitBtn) submitBtn.blur();
  });

  updateSummary();
}
