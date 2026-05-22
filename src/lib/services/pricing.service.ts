import { aiExtrasMonthlySar as resolveAiExtrasFee } from "@/lib/constants/ai-extras";

import { employeeBandMonthlySar as resolveEmployeeBandFee } from "@/lib/constants/employee-bands";

import { CEM_MODULES, type CemModuleKey } from "@/lib/constants/modules";

import { sareaPackageMonthlySar } from "@/lib/constants/sarea-packages";

import { SECURITY_PACKAGES, type SecurityPackageKey } from "@/lib/constants/security-packages";

import { SUBSCRIPTION_TIERS, type SubscriptionTierKey } from "@/lib/constants/subscriptions";



/** Saudi Arabia standard VAT — catalog and estimates are excl. VAT; VAT is additive. */
export const SAUDI_VAT_RATE = 0.15;

export type PricingEstimateInput = {

  planKey: SubscriptionTierKey;

  moduleKeys: string[];

  securityPackageKeys: string[];

  employeeBand?: string | null;

  /** SAREA package key — defaults to Manager (professional) tier monthly */

  sareaPackageKey?: string | null;

  aiExtraKeys?: string[] | null;

  /** VAT rate applied to monthly total (excl. VAT). Defaults to {@link SAUDI_VAT_RATE}. Pass `0` to omit. */

  vatRate?: number | null;

};



export type PricingEstimate = {

  baseMonthlySar: number;

  employeeBandMonthlySar: number;

  modulesMonthlySar: number;

  securityMonthlySar: number;

  sareaMonthlySar: number;

  aiExtrasMonthlySar: number;

  complexityMultiplier: number;

  /** Monthly subtotal after complexity multiplier, excluding VAT */

  totalMonthlySar: number;

  vatRate: number;

  vatAmountSar: number;

  totalInclVatSar: number;

};

function roundSarHalalas(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function vatFromSubtotal(subtotalExclVat: number, vatRate: number = SAUDI_VAT_RATE) {
  const vatAmountSar = roundSarHalalas(subtotalExclVat * vatRate);
  const totalInclVatSar = roundSarHalalas(subtotalExclVat + vatAmountSar);
  return { vatRate, vatAmountSar, totalInclVatSar };
}



function moduleAddon(key: string): number {

  return CEM_MODULES.find((m) => m.key === key)?.monthlyAddonSar ?? 0;

}



function securityAddon(key: string): number {

  return SECURITY_PACKAGES.find((p) => p.key === key)?.monthlyAddonSar ?? 0;

}



function complexityMultiplier(employeeBand?: string | null): number {

  if (!employeeBand) return 1;

  if (employeeBand.includes("500") || employeeBand.includes("201")) return 1.1;

  if (

    employeeBand.includes("250") ||

    employeeBand.includes("200") ||

    employeeBand.includes("100") ||

    employeeBand.includes("50")

  ) {

    return 1.05;

  }

  return 1;

}



export function calculateMonthlyEstimate(input: PricingEstimateInput): PricingEstimate {

  const tier = SUBSCRIPTION_TIERS.find((t) => t.key === input.planKey);

  const baseMonthlySar = tier?.baseMonthlySar ?? 0;

  const employeeBandMonthlySar = resolveEmployeeBandFee(input.employeeBand);



  const modulesMonthlySar = input.moduleKeys.reduce(

    (sum, key) => sum + moduleAddon(key as CemModuleKey),

    0

  );

  const securityMonthlySar = input.securityPackageKeys.reduce(

    (sum, key) => sum + securityAddon(key as SecurityPackageKey),

    0

  );



  const sareaMonthlySar = sareaPackageMonthlySar(input.sareaPackageKey);

  const aiExtrasMonthlySar = resolveAiExtrasFee(input.aiExtraKeys);

  const mult = complexityMultiplier(input.employeeBand);

  const subtotal =

    baseMonthlySar +

    employeeBandMonthlySar +

    modulesMonthlySar +

    securityMonthlySar +

    sareaMonthlySar +

    aiExtrasMonthlySar;

  const totalMonthlySar = Math.round(subtotal * mult);

  const vatRate = input.vatRate ?? SAUDI_VAT_RATE;

  const vat = vatFromSubtotal(totalMonthlySar, vatRate);



  return {

    baseMonthlySar,

    employeeBandMonthlySar,

    modulesMonthlySar,

    securityMonthlySar,

    sareaMonthlySar,

    aiExtrasMonthlySar,

    complexityMultiplier: mult,

    totalMonthlySar,

    ...vat,

  };

}



export function formatSar(amount: number, fractionDigits = 0): string {

  return new Intl.NumberFormat("en-SA", {

    style: "currency",

    currency: "SAR",

    minimumFractionDigits: fractionDigits,

    maximumFractionDigits: fractionDigits,

  }).format(amount);

}

