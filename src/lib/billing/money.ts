/** Saudi Riyal — Stripe amounts use the smallest currency unit (halala = 1/100 SAR). */

export function sarToStripeAmount(monthlySar: number): number {
  if (!Number.isFinite(monthlySar) || monthlySar < 0) {
    throw new Error("Invalid monthly SAR amount");
  }
  return Math.round(monthlySar * 100);
}

export function stripeAmountToSar(amountHalala: number): number {
  return amountHalala / 100;
}
