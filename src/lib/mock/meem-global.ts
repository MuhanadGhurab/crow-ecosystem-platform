import { Prisma, type ProposalStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { MEEM_REFERENCE_CODE, MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { calculateMonthlyEstimate, type PricingEstimate } from "@/lib/services/pricing.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";
import type { EnterpriseBlueprintDetail } from "@/lib/services/blueprint.service";

/** Lighthouse customer — MEEM Holding Logistics / MEEM Global (50–250 users, logistics + AI). */

export { MEEM_REFERENCE_CODE, MEEM_TENANT_SLUG };

/** MOCK ONLY — offline/demo pipeline cards when DB is unavailable. Use `resolveMeemLiveIds()`. */
export const MEEM_REQUEST_ID = "mock-req-meem";
/** MOCK ONLY */
export const MEEM_DISCOVERY_REQUEST_ID = "mock-req-meem-discovery";
/** MOCK ONLY */
export const MEEM_BLUEPRINT_ID = "mock-bp-meem";

/**
 * Last known live IDs from `npm run meem:ids` — may be stale after DB reset.
 * Prefer `resolveMeemLiveIds()` for staff links and E2E paths.
 */
export const MEEM_LIVE_REQUEST_ID = "cmpi2uum60000vhqs9bfmblh2";
export const MEEM_LIVE_BLUEPRINT_ID = "cmpi2w41q001pvhqs02qtao22";

export type MeemLiveIds = {
  tenantSlug: string;
  tenantId: string | null;
  requestId: string | null;
  blueprintId: string | null;
  referenceCode: string | null;
  source: "live" | "mock_fallback";
};

/** Resolve MEEM request/blueprint IDs from Postgres by tenant slug (source of truth: `npm run meem:ids`). */
export async function resolveMeemLiveIds(): Promise<MeemLiveIds> {
  const fallback: MeemLiveIds = {
    tenantSlug: MEEM_TENANT_SLUG,
    tenantId: null,
    requestId: MEEM_LIVE_REQUEST_ID,
    blueprintId: MEEM_LIVE_BLUEPRINT_ID,
    referenceCode: MEEM_REFERENCE_CODE,
    source: "mock_fallback",
  };

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: MEEM_TENANT_SLUG },
      select: {
        id: true,
        slug: true,
        blueprint: {
          select: {
            id: true,
            requestId: true,
            request: { select: { id: true, referenceCode: true } },
          },
        },
      },
    });

    if (!tenant?.blueprint) return fallback;

    return {
      tenantSlug: tenant.slug,
      tenantId: tenant.id,
      requestId: tenant.blueprint.request.id,
      blueprintId: tenant.blueprint.id,
      referenceCode: tenant.blueprint.request.referenceCode,
      source: "live",
    };
  } catch {
    return fallback;
  }
}
export const MEEM_PROPOSAL_TOKEN = "mock-proposal-meem";
/** Blueprint + tenant modules for MEEM lighthouse (ERP chain + people). */
export const MEEM_MODULE_KEYS = [
  "sales",
  "logistics",
  "warehouse",
  "inventory",
  "finance",
  "crm",
  "hr",
] as const;

const now = new Date("2026-05-15T09:00:00.000Z");

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
  },
] as const;

export function isMeemMockId(id: string): boolean {
  return id.includes("meem");
}

export function getMeemMockTenant(slug: string) {
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

export async function getMeemDemoPaths(baseUrl = "http://localhost:3000") {
  const live = await resolveMeemLiveIds();
  const requestId = live.requestId ?? MEEM_REQUEST_ID;
  const blueprintId = live.blueprintId ?? MEEM_BLUEPRINT_ID;

  return {
    queue: `${baseUrl}/admin/requests/${requestId}`,
    discovery: `${baseUrl}/discovery/${MEEM_DISCOVERY_REQUEST_ID}/organization`,
    blueprintOverview: `${baseUrl}/blueprints/${blueprintId}/overview`,
    blueprintPricing: `${baseUrl}/blueprints/${blueprintId}/pricing`,
    blueprintReadiness: `${baseUrl}/blueprints/${blueprintId}/readiness`,
    goLive: `${baseUrl}/blueprints/${blueprintId}/go-live`,
    proposal: `${baseUrl}/proposal/${MEEM_PROPOSAL_TOKEN}`,
    tenantDashboard: `${baseUrl}/${MEEM_TENANT_SLUG}/dashboard`,
    tenantLogistics: `${baseUrl}/${MEEM_TENANT_SLUG}/logistics`,
    tenantWorkflows: `${baseUrl}/${MEEM_TENANT_SLUG}/workflows`,
    tenantTasks: `${baseUrl}/${MEEM_TENANT_SLUG}/tasks`,
    cybercrowDashboard: `${baseUrl}/${MEEM_TENANT_SLUG}/cybercrow/dashboard`,
    adminAudit: `${baseUrl}/admin/audit`,
    portal: `${baseUrl}/portal/requests/${requestId}`,
    idSource: live.source,
  };
}
