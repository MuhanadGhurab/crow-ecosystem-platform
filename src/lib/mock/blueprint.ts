import { Prisma, type ProposalStatus } from "@prisma/client";

import { isUseMockData } from "@/lib/mock/env";
import {
  MOCK_PIPELINE_REQUESTS,
  MOCK_PRICING_ESTIMATE,
  MOCK_SAREA_MONTHLY_SAR,
  isMockPipelineId,
} from "@/lib/mock/pipeline";
import { moduleLabel, planLabel, securityPackageLabel } from "@/lib/catalog-labels";
import {
  MEEM_BLUEPRINT_ID,
  MEEM_PROPOSAL_TOKEN,
  MEEM_PRICING_ESTIMATE,
  getMeemMockBlueprint,
} from "@/lib/mock/meem-global";
import type { EnterpriseBlueprintDetail } from "@/lib/services/blueprint.service";

export const MOCK_BLUEPRINT_ID = "mock-bp-001";
export const MOCK_PROPOSAL_TOKEN = "mock-proposal-demo";

const MOCK_REQUEST_ID = "mock-req-003";

const now = new Date("2026-05-01T10:00:00.000Z");

let mockClientApprovedAt: Date | null = null;
let mockProposalStatusOverride: ProposalStatus | null = null;

export function applyMockClientScopeApproval(): Date {
  mockClientApprovedAt = new Date();
  mockProposalStatusOverride = "CLIENT_APPROVED";
  return mockClientApprovedAt;
}

export function getMockProposalApprovalOverrides(): {
  clientApprovedAt: Date | null;
  proposalStatus: ProposalStatus;
} {
  return {
    clientApprovedAt: mockClientApprovedAt,
    proposalStatus: mockProposalStatusOverride ?? "SENT",
  };
}

function mockRequestRow() {
  return MOCK_PIPELINE_REQUESTS.find((r) => r.id === MOCK_REQUEST_ID)!;
}

export function isMockBlueprintId(id: string): boolean {
  return id.startsWith("mock-");
}

export function getMockBlueprintIdForRequest(requestId: string): string | null {
  const row = MOCK_PIPELINE_REQUESTS.find((r) => r.id === requestId);
  return row?.blueprintId ?? null;
}

export function getMockEnterpriseBlueprint(
  blueprintId: string
): EnterpriseBlueprintDetail | null {
  const meem = getMeemMockBlueprint(blueprintId);
  if (meem) return meem;
  if (blueprintId !== MOCK_BLUEPRINT_ID) return null;

  const row = mockRequestRow();
  const planKey = row.planKey;
  const approvalOverrides = getMockProposalApprovalOverrides();

  return {
    id: MOCK_BLUEPRINT_ID,
    requestId: MOCK_REQUEST_ID,
    discoveryProfileId: "mock-discovery-profile-001",
    status: "IN_REVIEW",
    proposalStatus: approvalOverrides.proposalStatus,
    proposalToken: MOCK_PROPOSAL_TOKEN,
    proposalSentAt: now,
    clientApprovedAt: approvalOverrides.clientApprovedAt,
    version: 1,
    approvedAt: null,
    tenantId: null,
    title: null,
    currentApprovedVersionId: null,
    activeDraftVersionId: null,
    currentVersionId: null,
    platformFinalizedVersionId: null,
    lifecycleState: "DRAFT_INTERNAL",
    clientVisibilityState: "NOT_SHARED",
    sharedWithClientVersionNumber: null,
    rowVersion: 1,
    createdAt: now,
    updatedAt: now,
    modules: [
      { id: "mock-bp-mod-1", blueprintId: MOCK_BLUEPRINT_ID, moduleKey: "hr", enabled: true },
      { id: "mock-bp-mod-2", blueprintId: MOCK_BLUEPRINT_ID, moduleKey: "crm", enabled: true },
      { id: "mock-bp-mod-3", blueprintId: MOCK_BLUEPRINT_ID, moduleKey: "inventory", enabled: true },
    ],
    request: {
      id: MOCK_REQUEST_ID,
      organizationName: row.organizationName,
      organizationNameAr: null,
      referenceCode: row.referenceCode,
      status: row.status,
      industry: "holding",
      employeeBand: "500-2000",
      countryCode: "SA",
      estimatedMonthlySar: new Prisma.Decimal(row.estimatedMonthlySar),
      notes: "Demo blueprint — UI-only mock data.",
      submittedByUserId: null,
      createdAt: now,
      updatedAt: now,
      contacts: [
        {
          id: "mock-contact-1",
          requestId: MOCK_REQUEST_ID,
          fullName: "Sara Al-Mutairi",
          email: "sara@alnoor.demo",
          phone: "+966 50 000 0001",
          jobTitle: "CIO",
          isPrimary: true,
          createdAt: now,
        },
      ],
      requestedModules: [
        { id: "mock-rm-1", requestId: MOCK_REQUEST_ID, moduleKey: "hr" },
        { id: "mock-rm-2", requestId: MOCK_REQUEST_ID, moduleKey: "crm" },
        { id: "mock-rm-3", requestId: MOCK_REQUEST_ID, moduleKey: "inventory" },
      ],
      requestedSecurityPkgs: row.hasSecurity
        ? [
            { id: "mock-rsp-1", requestId: MOCK_REQUEST_ID, packageKey: "crow_shield" },
            { id: "mock-rsp-2", requestId: MOCK_REQUEST_ID, packageKey: "crow_sentinel" },
          ]
        : [],
      requestedPlans: [{ id: "mock-rp-1", requestId: MOCK_REQUEST_ID, planKey }],
      discoveryProfile: {
        id: "mock-discovery-profile-001",
        requestId: MOCK_REQUEST_ID,
        status: "IN_PROGRESS",
        summary: null,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
        experienceRequirements: [
          {
            id: "mock-exp-bp-1",
            profileId: "mock-discovery-profile-001",
            personaKey: "executive",
            requirement: "Executive KPI board",
          },
          {
            id: "mock-exp-bp-2",
            profileId: "mock-discovery-profile-001",
            personaKey: "manager",
            requirement: "Team workload view",
          },
        ],
        answers: [
          {
            id: "mock-ans-1",
            profileId: "mock-discovery-profile-001",
            sectionKey: "organization",
            questionKey: "operatingModel",
            valueJson: "multi_branch",
          },
          {
            id: "mock-ans-2",
            profileId: "mock-discovery-profile-001",
            sectionKey: "modules",
            questionKey: "confirmedKeys",
            valueJson: ["hr", "crm", "inventory"],
          },
          {
            id: "mock-ans-3",
            profileId: "mock-discovery-profile-001",
            sectionKey: "security",
            questionKey: "reviewed",
            valueJson: true,
          },
          {
            id: "mock-ans-idp",
            profileId: "mock-discovery-profile-001",
            sectionKey: "identity",
            questionKey: "idpPreference",
            valueJson: "entra_id",
          },
          {
            id: "mock-ans-mfa",
            profileId: "mock-discovery-profile-001",
            sectionKey: "identity",
            questionKey: "mfaRequired",
            valueJson: "yes",
          },
          {
            id: "mock-ans-sso",
            profileId: "mock-discovery-profile-001",
            sectionKey: "identity",
            questionKey: "ssoNotes",
            valueJson: "Entra SSO — conditional access aligned with Crow Shield.",
          },
        ],
      },
    },
    tenant: null,
  };
}

export function getMockProposalByToken(token: string) {
  const blueprintId =
    token === MEEM_PROPOSAL_TOKEN ? MEEM_BLUEPRINT_ID : token === MOCK_PROPOSAL_TOKEN ? MOCK_BLUEPRINT_ID : null;
  if (!blueprintId) return null;

  const blueprint = getMockEnterpriseBlueprint(blueprintId);
  if (!blueprint) return null;

  const planKey = blueprint.request.requestedPlans[0]?.planKey ?? "growth";
  const estimate =
    blueprintId === MEEM_BLUEPRINT_ID ? MEEM_PRICING_ESTIMATE : MOCK_PRICING_ESTIMATE;

  return {
    blueprint,
    estimate,
    planKey,
    planLabel: planLabel(planKey),
    modules: blueprint.request.requestedModules.map((m) => ({
      key: m.moduleKey,
      label: moduleLabel(m.moduleKey),
    })),
    securityPackages: blueprint.request.requestedSecurityPkgs.map((p) => ({
      key: p.packageKey,
      label: securityPackageLabel(p.packageKey),
    })),
  };
}

export function resolveMockBlueprintForDemo(): {
  blueprintId: string;
  proposalUrl: string;
  overviewUrl: string;
  pricingUrl: string;
} {
  return {
    blueprintId: MOCK_BLUEPRINT_ID,
    proposalUrl: `/proposal/${MOCK_PROPOSAL_TOKEN}`,
    overviewUrl: `/blueprints/${MOCK_BLUEPRINT_ID}/overview`,
    pricingUrl: `/blueprints/${MOCK_BLUEPRINT_ID}/pricing`,
  };
}

export function shouldUseMockBlueprint(blueprintId: string): boolean {
  return isUseMockData() && isMockBlueprintId(blueprintId);
}

export { MOCK_SAREA_MONTHLY_SAR };
