import "@/lib/server-only-guard";

import { listIndustryArchetypes, listCapabilities } from "@/lib/tenant-composition/registry";
import { listSpecialistDomains } from "@/lib/model-forge/specialist-domains";
import { clientCanAccessRequestAuthoritative } from "@/lib/auth/customer-access.service";
import { prisma } from "@/lib/db";
import type { User } from "@supabase/supabase-js";
import {
  draftToInput,
  emptyClientEnterpriseDesignDraft,
} from "@/lib/client-enterprise-design/persistence/constants";
import { loadClientEnterpriseDesignDraft } from "@/lib/client-enterprise-design/persistence/client-design-discovery.service";
import { composeClientEnterpriseDesign } from "@/lib/client-enterprise-design/recommendations/compose-client-enterprise-design";
import {
  recommendedPurposesForIndustry,
  recommendedPurposesForSpecialistDomain,
  purposesForFieldSelection,
} from "@/lib/client-enterprise-design/purposes/industry-purpose-mappings";
import { getBusinessPurpose, listBusinessPurposes } from "@/lib/client-enterprise-design/purposes/business-purpose-catalog";
import { DOMAIN_CATEGORY_MAP } from "@/lib/client-enterprise-design/references/field-explorer-groups";

export type ClientDesignPageModel = {
  requestId: string;
  referenceCode: string;
  organizationName: string;
  canEdit: boolean;
  editBlockedReason: string | null;
  draft: ReturnType<typeof emptyClientEnterpriseDesignDraft> extends infer T ? T : never;
  profileUpdatedAt: string | null;
  snapshot: ReturnType<typeof composeClientEnterpriseDesign> | null;
  industries: ReturnType<typeof listIndustryArchetypes>;
  domains: ReturnType<typeof listSpecialistDomains>;
  capabilities: ReturnType<typeof listCapabilities>;
  purposes: ReturnType<typeof listBusinessPurposes>;
  domainCategories: typeof DOMAIN_CATEGORY_MAP;
};

export async function buildClientDesignPageModel(
  user: User,
  requestId: string,
): Promise<ClientDesignPageModel | null> {
  const allowed = await clientCanAccessRequestAuthoritative(user.id, requestId);
  if (!allowed) return null;

  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: { discoveryProfile: true },
  });
  if (!request) return null;

  const { draft, profileUpdatedAt } = await loadClientEnterpriseDesignDraft(requestId);
  const input = draftToInput(draft);
  const snapshot =
    draft.recommendationSnapshot ?? (draft.primaryIndustry ? composeClientEnterpriseDesign(input) : null);

  const status = request.status;
  const canEdit =
    request.submittedByUserId === user.id &&
    status === "UNDER_DISCOVERY" &&
    request.discoveryProfile?.status === "IN_PROGRESS" &&
    draft.status !== "SUBMITTED";

  return {
    requestId,
    referenceCode: request.referenceCode,
    organizationName: request.organizationName,
    canEdit,
    editBlockedReason: canEdit
      ? null
      : draft.status === "SUBMITTED"
        ? "Design submitted for ProCrow review."
        : "Discovery is not editable in the current lifecycle state.",
    draft,
    profileUpdatedAt,
    snapshot,
    industries: listIndustryArchetypes(),
    domains: listSpecialistDomains(),
    capabilities: listCapabilities(),
    purposes: listBusinessPurposes(),
    domainCategories: DOMAIN_CATEGORY_MAP,
  };
}

export { purposesForFieldSelection };
