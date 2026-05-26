import { calculateMonthlyEstimate, type PricingEstimate } from "@/lib/services/pricing.service";
import type { ProposalStatus } from "@prisma/client";

import type { ImplementationRequestStatus } from "@/lib/types/platform";
import { MEEM_PIPELINE_REQUESTS, MEEM_PRICING_ESTIMATE } from "@/lib/mock/meem-global";
import { SAREA_DEFAULT_MONTHLY_SAR } from "@/lib/constants/sarea-packages";

const DEMO1_ESTIMATE = calculateMonthlyEstimate({
  planKey: "growth",
  moduleKeys: ["hr", "crm", "finance"],
  securityPackageKeys: ["crow_shield"],
  employeeBand: "50-100",
});

const DEMO2_ESTIMATE = calculateMonthlyEstimate({
  planKey: "enterprise",
  moduleKeys: ["logistics", "inventory", "warehouse"],
  securityPackageKeys: ["crow_sentinel"],
  employeeBand: "101-250",
});

const DEMO3_ESTIMATE = calculateMonthlyEstimate({
  planKey: "growth",
  moduleKeys: ["hr", "bi", "approvals"],
  securityPackageKeys: ["crow_shield", "crow_sentinel"],
  employeeBand: "51-200",
  sareaPackageKey: "professional",
});

/** Demo queue when DATABASE_URL / Prisma is unavailable */
export const MOCK_PIPELINE_REQUESTS = [
  {
    id: "mock-req-001",
    organizationName: "Al Noor Holdings",
    referenceCode: "CROW-2026-DEMO1",
    status: "PENDING_REVIEW" as ImplementationRequestStatus,
    planKey: "growth",
    estimatedMonthlySar: DEMO1_ESTIMATE.totalMonthlySar,
    hasSecurity: true,
    hasModules: true,
    discoveryAvailable: false,
    blueprintId: null as string | null,
    proposalStatus: "DRAFT" as ProposalStatus,
    tenantSlug: null as string | null,
  },
  {
    id: "mock-req-002",
    organizationName: "Riyadh Logistics Co.",
    referenceCode: "CROW-2026-DEMO2",
    status: "UNDER_DISCOVERY" as ImplementationRequestStatus,
    planKey: "enterprise",
    estimatedMonthlySar: DEMO2_ESTIMATE.totalMonthlySar,
    hasSecurity: true,
    hasModules: true,
    discoveryAvailable: true,
    blueprintId: null as string | null,
    proposalStatus: "DRAFT" as ProposalStatus,
    tenantSlug: null as string | null,
  },
  {
    id: "mock-req-003",
    organizationName: "Gulf Health Network",
    referenceCode: "CROW-2026-DEMO3",
    status: "BLUEPRINT_BUILD" as ImplementationRequestStatus,
    planKey: "growth",
    estimatedMonthlySar: DEMO3_ESTIMATE.totalMonthlySar,
    hasSecurity: true,
    hasModules: true,
    discoveryAvailable: true,
    blueprintId: "mock-bp-001",
    proposalStatus: "DRAFT" as ProposalStatus,
    tenantSlug: null as string | null,
  },
  ...MEEM_PIPELINE_REQUESTS,
] as const;

export { MEEM_PRICING_ESTIMATE };

export const MOCK_SAREA_MONTHLY_SAR = SAREA_DEFAULT_MONTHLY_SAR;

export const MOCK_PRICING_ESTIMATE: PricingEstimate = DEMO3_ESTIMATE;

export function isMockPipelineId(id: string): boolean {
  return id.startsWith("mock-");
}
