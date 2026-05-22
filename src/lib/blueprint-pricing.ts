import { isUseMockData } from "@/lib/mock/env";
import { MOCK_PRICING_ESTIMATE } from "@/lib/mock/pipeline";
import { getRequestPricingEstimate } from "@/lib/services/commercial.service";
import {
  calculateMonthlyEstimate,
  type PricingEstimate,
} from "@/lib/services/pricing.service";

export async function resolveBlueprintPricingEstimate(
  requestId: string
): Promise<PricingEstimate> {
  if (isUseMockData()) {
    return MOCK_PRICING_ESTIMATE;
  }
  const estimate = await getRequestPricingEstimate(requestId).catch(() => null);
  if (estimate) return estimate;
  return calculateMonthlyEstimate({
    planKey: "enterprise",
    moduleKeys: [],
    securityPackageKeys: [],
    employeeBand: null,
    sareaPackageKey: "professional",
  });
}
