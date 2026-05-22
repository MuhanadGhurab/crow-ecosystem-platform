/** Employee headcount bands — monthly platform scale fee (SAR) before complexity multiplier */

export const EMPLOYEE_BANDS = [
  { key: "1-49", labelEn: "1–49 employees", monthlyBandSar: 0 },
  { key: "50-100", labelEn: "50–100 employees", monthlyBandSar: 1_200 },
  { key: "50-250", labelEn: "50–250 employees", monthlyBandSar: 2_400 },
  { key: "101-250", labelEn: "101–250 employees", monthlyBandSar: 2_400 },
  { key: "51-200", labelEn: "51–200 employees", monthlyBandSar: 2_000 },
  { key: "201-500", labelEn: "201–500 employees", monthlyBandSar: 4_800 },
  { key: "500+", labelEn: "500+ employees", monthlyBandSar: 7_200 },
] as const;

export function employeeBandMonthlySar(band?: string | null): number {
  if (!band) return 0;
  const row = EMPLOYEE_BANDS.find((b) => b.key === band);
  if (row) return row.monthlyBandSar;
  if (band.includes("500") || band.includes("201")) return 4_800;
  if (band.includes("250") || band.includes("200") || band.includes("100") || band.includes("50")) {
    return 2_400;
  }
  return 0;
}

/** Typical market monthly SAR for comparison tables (marketing reference — not a quote) */
export const MARKET_COMPARISON = {
  /** Upper-mid enterprise list — illustrative comparison only */
  odooEnterprisePerUserUsd: 48,
  zohoOnePerUserUsd: 42,
  usdToSar: 3.75,
  /** Illustrative security / GRC uplift on top of ERP seat stack */
  securityStackUpliftPct: 0.28,
} as const;

export function typicalMarketMonthlySar(
  employees: number,
  vendor: "odoo" | "zoho"
): number {
  const perUserUsd =
    vendor === "odoo"
      ? MARKET_COMPARISON.odooEnterprisePerUserUsd
      : MARKET_COMPARISON.zohoOnePerUserUsd;
  const erp = perUserUsd * employees * MARKET_COMPARISON.usdToSar;
  const withSecurity = erp * (1 + MARKET_COMPARISON.securityStackUpliftPct);
  return Math.round(withSecurity);
}
