/**
 * Client-side pricing helpers. Server must validate final amounts.
 */

export const CURRENCY = "SAR";

/**
 * @param {object} params
 * @param {{ base_monthly_sar?: number } | null} params.plan
 * @param {{ monthly_addon_sar?: number } | null} params.securityLayer
 * @param {Array<{ monthly_addon_sar?: number }>} params.selectedModules
 * @returns {number}
 */
export function computeMonthlyEstimate({
  plan,
  securityLayer,
  selectedModules,
}) {
  const base = Number(plan?.base_monthly_sar ?? 0);
  const securityAddon = Number(securityLayer?.monthly_addon_sar ?? 0);
  const modulesSum = (selectedModules ?? []).reduce(
    (sum, mod) => sum + Number(mod?.monthly_addon_sar ?? 0),
    0
  );
  return Math.round(base + securityAddon + modulesSum);
}

/**
 * @param {number} amount
 * @returns {string}
 */
export function formatSar(amount) {
  try {
    return new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `SAR ${amount}`;
  }
}
