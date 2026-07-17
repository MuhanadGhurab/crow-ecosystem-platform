import { Prisma, type ProposalStatus } from "@prisma/client";

import {
  MEEM_BLUEPRINT_ID,
  MEEM_DISCOVERY_REQUEST_ID,
  MEEM_MODULE_KEYS,
  MEEM_PROPOSAL_TOKEN,
  MEEM_REFERENCE_CODE,
  MEEM_REQUEST_ID,
  MEEM_TENANT_SLUG,
} from "@/lib/constants/meem";
import { calculateMonthlyEstimate, type PricingEstimate } from "@/lib/services/pricing.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";
import type { EnterpriseBlueprintDetail } from "@/lib/services/blueprint.service";

/** Lighthouse customer — MEEM Holding Logistics / MEEM Global (50–250 users, logistics + AI). */

export {
  MEEM_BLUEPRINT_ID,
  MEEM_DISCOVERY_REQUEST_ID,
  MEEM_MODULE_KEYS,
  MEEM_PROPOSAL_TOKEN,
  MEEM_REFERENCE_CODE,
  MEEM_REQUEST_ID,
  MEEM_TENANT_SLUG,
};

const now = new Date("2026-05-15T09:00:00.000Z");

const meemTenantInclude = {
  organization: true,
  modules: { where: { enabled: true }, orderBy: { moduleKey: "asc" as const } },
  blueprint: {
    include: {
      request: {
        select: {
          id: true,
          referenceCode: true,
          status: true,
          organizationName: true,
          discoveryProfile: {
            select: {
              answers: {
                select: { sectionKey: true, questionKey: true, valueJson: true },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.TenantInclude;

export type MeemMockTenant = Prisma.TenantGetPayload<{ include: typeof meemTenantInclude }>;

export const MEEM_PRICING_ESTIMATE: PricingEstimate = calculateMonthlyEstimate({
  planKey: "enterprise",
  moduleKeys: [...MEEM_MODULE_KEYS],
  securityPackageKeys: ["crow_sentinel", "crow_fortress"],
  employeeBand: "50-250",
  sareaPackageKey: "executive",
  aiExtraKeys: [
    "route_optimization",
    "demand_forecast",
    "anomaly_detection",
    "doc_intelligence",
  ],
});

export const MEEM_PIPELINE_REQUESTS = [
  {
    id: MEEM_REQUEST_ID,
    organizationName: "MEEM Holding Logistics",
    referenceCode: MEEM_REFERENCE_CODE,
    status: "BLUEPRINT_BUILD" as ImplementationRequestStatus,
    planKey: "enterprise",
    estimatedMonthlySar: MEEM_PRICING_ESTIMATE.totalMonthlySar,
    hasSecurity: true,
    hasModules: true,
    discoveryAvailable: true,
    blueprintId: MEEM_BLUEPRINT_ID,
    proposalStatus: "CLIENT_APPROVED" as ProposalStatus,
    tenantSlug: MEEM_TENANT_SLUG,
  },
  {
    id: MEEM_DISCOVERY_REQUEST_ID,
    organizationName: "MEEM Global",
    referenceCode: "CROW-2026-MEEM-DISC",
    status: "UNDER_DISCOVERY" as ImplementationRequestStatus,
    planKey: "enterprise",
    estimatedMonthlySar: calculateMonthlyEstimate({
      planKey: "enterprise",
      moduleKeys: [...MEEM_MODULE_KEYS],
      securityPackageKeys: ["crow_sentinel", "crow_fortress"],
      employeeBand: "50-250",
    }).totalMonthlySar,
    hasSecurity: true,
    hasModules: true,
    discoveryAvailable: true,
    blueprintId: null as string | null,
    proposalStatus: "DRAFT" as ProposalStatus,
    tenantSlug: null as string | null,
  },
] as const;

export function isMeemMockId(id: string): boolean {
  return id.includes("meem");
}

export function getMeemMockTenant(slug: string): MeemMockTenant | null {
  if (slug !== MEEM_TENANT_SLUG) return null;

  return {
    id: "mock-tenant-meem-global",
    slug: MEEM_TENANT_SLUG,
    planKey: "enterprise",
    organizationId: "mock-org-meem",
    blueprintId: MEEM_BLUEPRINT_ID,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    organization: {
      id: "mock-org-meem",
      displayName: "MEEM Holding Logistics",
      displayNameAr: "ميم القابضة للخدمات اللوجستية",
      legalName: "MEEM Holding Logistics LLC",
      vatNumber: null,
      industry: "logistics",
      createdAt: now,
      updatedAt: now,
    },
    modules: MEEM_MODULE_KEYS.map((moduleKey, i) => ({
      id: `mock-tm-${i + 1}`,
      tenantId: "mock-tenant-meem-global",
      moduleKey,
      enabled: true,
    })),
    blueprint: {
      id: MEEM_BLUEPRINT_ID,
      requestId: MEEM_REQUEST_ID,
      discoveryProfileId: "mock-discovery-meem",
      status: "APPROVED",
      proposalStatus: "CLIENT_APPROVED" as ProposalStatus,
      proposalToken: MEEM_PROPOSAL_TOKEN,
      proposalSentAt: now,
      clientApprovedAt: now,
      version: 1,
      approvedAt: now,
      createdAt: now,
      updatedAt: now,
      request: {
        id: MEEM_REQUEST_ID,
        referenceCode: MEEM_REFERENCE_CODE,
        status: "GO_LIVE" as ImplementationRequestStatus,
        organizationName: "MEEM Holding Logistics",
        discoveryProfile: {
          answers: [
            {
              sectionKey: "identity",
              questionKey: "idpPreference",
              valueJson: "entra_id",
            },
            {
              sectionKey: "experience",
              questionKey: "aiExtras",
              valueJson: [
                "route_optimization",
                "demand_forecast",
                "anomaly_detection",
                "doc_intelligence",
              ],
            },
          ],
        },
      },
    },
  };
}

export function getMeemMockBlueprint(blueprintId: string): EnterpriseBlueprintDetail | null {
  if (blueprintId !== MEEM_BLUEPRINT_ID) return null;

  const row = MEEM_PIPELINE_REQUESTS[0];
  const planKey = row.planKey;

  return {
    id: MEEM_BLUEPRINT_ID,
    requestId: MEEM_REQUEST_ID,
    discoveryProfileId: "mock-discovery-meem",
    status: "APPROVED",
    proposalStatus: "CLIENT_APPROVED" as ProposalStatus,
    proposalToken: MEEM_PROPOSAL_TOKEN,
    proposalSentAt: now,
    clientApprovedAt: now,
    version: 1,
    approvedAt: now,
    createdAt: now,
    updatedAt: now,
    modules: MEEM_MODULE_KEYS.map((moduleKey, i) => ({
      id: `mock-bp-meem-${i + 1}`,
      blueprintId: MEEM_BLUEPRINT_ID,
      moduleKey,
      enabled: true,
    })),
    request: {
      id: MEEM_REQUEST_ID,
      organizationName: row.organizationName,
      organizationNameAr: "ميم القابضة للخدمات اللوجستية",
      referenceCode: row.referenceCode,
      status: "BLUEPRINT_BUILD",
      industry: "logistics",
      employeeBand: "50-250",
      countryCode: "SA",
      estimatedMonthlySar: new Prisma.Decimal(row.estimatedMonthlySar),
      notes:
        "Lighthouse demo — logistics, fleet AI routing, warehouse visibility, Entra SSO, NCA-aligned CyberCrow.",
      submittedByUserId: null,
      createdAt: now,
      updatedAt: now,
      contacts: [
        {
          id: "mock-meem-contact-1",
          requestId: MEEM_REQUEST_ID,
          fullName: "Faisal Al-Meem",
          email: "faisal@meem-logistics.demo",
          phone: "+966 55 100 2000",
          jobTitle: "Group CIO",
          isPrimary: true,
          createdAt: now,
        },
      ],
      requestedModules: MEEM_MODULE_KEYS.map((moduleKey, i) => ({
        id: `mock-meem-rm-${i + 1}`,
        requestId: MEEM_REQUEST_ID,
        moduleKey,
      })),
      requestedSecurityPkgs: [
        { id: "mock-meem-rsp-1", requestId: MEEM_REQUEST_ID, packageKey: "crow_sentinel" },
        { id: "mock-meem-rsp-2", requestId: MEEM_REQUEST_ID, packageKey: "crow_fortress" },
      ],
      requestedPlans: [{ id: "mock-meem-rp-1", requestId: MEEM_REQUEST_ID, planKey }],
      discoveryProfile: {
        id: "mock-discovery-meem",
        requestId: MEEM_REQUEST_ID,
        status: "COMPLETED",
        summary: "Multi-hub logistics, Entra ID, AI-assisted dispatch and inventory signals.",
        completedAt: now,
        createdAt: now,
        updatedAt: now,
        experienceRequirements: [
          {
            id: "mock-meem-exp-1",
            profileId: "mock-discovery-meem",
            personaKey: "executive",
            requirement: "Fleet KPIs, SLA breaches, regional hub map",
          },
          {
            id: "mock-meem-exp-2",
            profileId: "mock-discovery-meem",
            personaKey: "manager",
            requirement: "Dispatch board, warehouse throughput",
          },
          {
            id: "mock-meem-exp-3",
            profileId: "mock-discovery-meem",
            personaKey: "frontline",
            requirement: "Mobile-first shipment scan and POD",
          },
        ],
        answers: [
          {
            id: "mock-meem-ans-1",
            profileId: "mock-discovery-meem",
            sectionKey: "organization",
            questionKey: "operatingModel",
            valueJson: "multi_hub_logistics",
          },
          {
            id: "mock-meem-ans-2",
            profileId: "mock-discovery-meem",
            sectionKey: "modules",
            questionKey: "confirmedKeys",
            valueJson: [...MEEM_MODULE_KEYS],
          },
          {
            id: "mock-meem-ans-3",
            profileId: "mock-discovery-meem",
            sectionKey: "security",
            questionKey: "reviewed",
            valueJson: true,
          },
          {
            id: "mock-meem-ans-idp",
            profileId: "mock-discovery-meem",
            sectionKey: "identity",
            questionKey: "idpPreference",
            valueJson: "entra_id",
          },
          {
            id: "mock-meem-ans-ai",
            profileId: "mock-discovery-meem",
            sectionKey: "experience",
            questionKey: "aiExtras",
            valueJson: [
              "route_optimization",
              "demand_forecast",
              "anomaly_detection",
              "doc_intelligence",
            ],
          },
        ],
      },
    },
    tenant: getMeemMockTenant(MEEM_TENANT_SLUG),
  };
}
