import { Prisma } from "@prisma/client";

import type { ImplementationRequestStatus } from "@/lib/types/platform";

import { isUseMockData } from "@/lib/mock/env";
import {
  MOCK_PIPELINE_REQUESTS,
  isMockPipelineId,
} from "@/lib/mock/pipeline";
import { MOCK_BLUEPRINT_ID } from "@/lib/mock/blueprint";
import {
  MEEM_BLUEPRINT_ID,
  MEEM_PROPOSAL_TOKEN,
  isMeemMockId,
} from "@/lib/mock/meem-global";
import type { DiscoveryContext } from "@/lib/services/discovery.service";

const now = new Date("2026-05-01T10:00:00.000Z");

const DISCOVERY_STATUSES: ImplementationRequestStatus[] = [
  "UNDER_DISCOVERY",
  "BLUEPRINT_BUILD",
];

function baseProfile(requestId: string) {
  const profileId = `mock-discovery-${requestId}`;
  return {
    id: profileId,
    requestId,
    status: "IN_PROGRESS" as const,
    summary: null,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
    answers: [
      {
        id: `mock-ans-org-${requestId}`,
        profileId,
        sectionKey: "organization",
        questionKey: "operatingModel",
        valueJson: "multi_branch",
      },
      {
        id: `mock-ans-mod-${requestId}`,
        profileId,
        sectionKey: "modules",
        questionKey: "confirmedKeys",
        valueJson: ["hr", "crm"],
      },
      {
        id: `mock-ans-sec-${requestId}`,
        profileId,
        sectionKey: "security",
        questionKey: "reviewed",
        valueJson: true,
      },
      {
        id: `mock-ans-idp-${requestId}`,
        profileId,
        sectionKey: "identity",
        questionKey: "idpPreference",
        valueJson: "entra_id",
      },
      {
        id: `mock-ans-mfa-${requestId}`,
        profileId,
        sectionKey: "identity",
        questionKey: "mfaRequired",
        valueJson: "yes",
      },
      {
        id: `mock-ans-sso-${requestId}`,
        profileId,
        sectionKey: "identity",
        questionKey: "ssoNotes",
        valueJson: "Entra SSO for corporate users; phased MFA rollout.",
      },
      {
        id: `mock-ans-sarea-${requestId}`,
        profileId,
        sectionKey: "experience",
        questionKey: "sareaPackageKey",
        valueJson: "professional",
      },
    ],
    departments: [
      {
        id: `mock-dept-1-${requestId}`,
        profileId,
        name: "Operations",
        nameAr: null,
        headcount: 120,
      },
    ],
    branches: [
      {
        id: `mock-branch-1-${requestId}`,
        profileId,
        name: "Riyadh HQ",
        city: "Riyadh",
        region: "Central",
      },
    ],
    roles: [
      {
        id: `mock-role-1-${requestId}`,
        profileId,
        name: "Regional Manager",
        level: "L2",
      },
    ],
    workflows: [
      {
        id: `mock-wf-1-${requestId}`,
        profileId,
        name: "Purchase approval",
        description: "3-step approval chain",
      },
    ],
    securityRequirements: [
      {
        id: `mock-sec-req-1-${requestId}`,
        profileId,
        requirement: "MFA for privileged accounts",
        priority: "high",
      },
    ],
    integrations: [
      {
        id: `mock-int-1-${requestId}`,
        profileId,
        providerKey: "microsoft_entra",
        notes: "SSO + conditional access",
      },
    ],
    experienceRequirements: [
      {
        id: `mock-exp-1-${requestId}`,
        profileId,
        personaKey: "executive",
        requirement: "KPI dashboard, mobile-first",
      },
    ],
    orgIntelligence: null,
  };
}

export function shouldUseMockDiscovery(requestId: string): boolean {
  if (!isUseMockData() || !isMockPipelineId(requestId)) return false;
  const row = MOCK_PIPELINE_REQUESTS.find((r) => r.id === requestId);
  return Boolean(row?.discoveryAvailable);
}

export function getMockDiscoveryContext(
  requestId: string
): DiscoveryContext | null {
  const row = MOCK_PIPELINE_REQUESTS.find((r) => r.id === requestId);
  if (!row?.discoveryAvailable) return null;
  if (!DISCOVERY_STATUSES.includes(row.status)) return null;

  const blueprintId = row.blueprintId ?? null;
  const meem = isMeemMockId(requestId);

  return {
    id: requestId,
    organizationName: row.organizationName,
    organizationNameAr: meem ? "ميم القابضة للخدمات اللوجستية" : null,
    referenceCode: row.referenceCode,
    status: row.status,
    industry: meem ? "logistics" : "logistics",
    employeeBand: meem ? "50-250" : "200-500",
    countryCode: "SA",
    estimatedMonthlySar: new Prisma.Decimal(row.estimatedMonthlySar),
    notes: null,
    submittedByUserId: null,
    createdAt: now,
    updatedAt: now,
    contacts: [
      {
        id: `mock-contact-${requestId}`,
        requestId,
        fullName: "Demo Contact",
        email: "demo@cybercrow.local",
        phone: null,
        jobTitle: null,
        isPrimary: true,
        createdAt: now,
      },
    ],
    requestedModules: meem
      ? [
          { id: `mock-rm-log-${requestId}`, requestId, moduleKey: "logistics" },
          { id: `mock-rm-wh-${requestId}`, requestId, moduleKey: "warehouse" },
          { id: `mock-rm-inv-${requestId}`, requestId, moduleKey: "inventory" },
          { id: `mock-rm-crm-${requestId}`, requestId, moduleKey: "crm" },
          { id: `mock-rm-hr-${requestId}`, requestId, moduleKey: "hr" },
        ]
      : [
          { id: `mock-rm-hr-${requestId}`, requestId, moduleKey: "hr" },
          { id: `mock-rm-crm-${requestId}`, requestId, moduleKey: "crm" },
        ],
    requestedSecurityPkgs: row.hasSecurity
      ? [{ id: `mock-rsp-${requestId}`, requestId, packageKey: "crow_shield" }]
      : [],
    requestedPlans: [{ id: `mock-rp-${requestId}`, requestId, planKey: row.planKey }],
    discoveryProfile: baseProfile(requestId),
    enterpriseBlueprint: blueprintId
      ? {
          id: blueprintId,
          requestId,
          discoveryProfileId: `mock-dp-${requestId}`,
          tenantId: null,
          title: null,
          currentApprovedVersionId: null,
          activeDraftVersionId: null,
          status: "IN_REVIEW",
          proposalStatus: "DRAFT",
          proposalToken: null,
          proposalSentAt: null,
          clientApprovedAt: null,
          approvedAt: null,
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          tenant: null,
        }
      : null,
  };
}
