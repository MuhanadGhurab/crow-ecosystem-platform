/**
 * Form validation. User-facing copy is English; field keys stay ASCII.
 */

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isNonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

const MSGS = {
  companyName: "Please enter the company name.",
  sector: "Please select an industry.",
  userCount: "Please enter a valid user count (positive number).",
  timeline: "Please select an expected timeline.",
  modules: "Select at least one ERP module.",
  security: "Select a CyberCrow security layer.",
  plan: "Select a subscription plan.",
};

/**
 * @param {object} input
 * @param {string} input.companyName
 * @param {string} input.sector
 * @param {string|number} input.userCount
 * @param {string} input.timeline
 * @param {string[]} input.moduleIds
 * @param {string} [input.securityLayerId]
 * @param {string} [input.planId]
 * @returns {{ ok: boolean, errors: Record<string, string> }}
 */
export function validateErpRequestForm(input) {
  /** @type {Record<string, string>} */
  const errors = {};

  if (!isNonEmpty(input.companyName)) errors.companyName = MSGS.companyName;
  if (!isNonEmpty(input.sector)) errors.sector = MSGS.sector;

  const users = Number(input.userCount);
  if (!Number.isFinite(users) || users < 1) {
    errors.userCount = MSGS.userCount;
  }

  if (!isNonEmpty(input.timeline)) errors.timeline = MSGS.timeline;
  if (!input.moduleIds?.length) errors.modules = MSGS.modules;
  if (!isNonEmpty(input.securityLayerId)) errors.security = MSGS.security;
  if (!isNonEmpty(input.planId)) errors.plan = MSGS.plan;

  return { ok: Object.keys(errors).length === 0, errors };
}
