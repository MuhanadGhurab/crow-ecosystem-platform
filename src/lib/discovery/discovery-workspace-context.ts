/**
 * CROW.DISCOVERY.2 — D2 workspace foundation view-model (pure).
 */

import type { ClientServiceRequestBrief } from "@/lib/client-service-request/types";
import {
  DISCOVERY_MVP_EVIDENCE_MODE,
  DISCOVERY_MVP_NON_CLAIMS,
  DISCOVERY_MVP_STAGES,
} from "@/lib/discovery/discovery-mvp-boundaries";
import {
  discoveryProductStatusLabel,
  resolveDiscoveryProductStatus,
  type DiscoveryProductStatus,
} from "@/lib/discovery/discovery-product-status";
import type { DiscoveryStatus } from "@prisma/client";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export type DiscoveryMvpWorkspaceModel = {
  requestId: string;
  referenceCode: string;
  organizationName: string;
  journeyKind: string | null;
  organizationContext: string | null;
  requestStatus: ImplementationRequestStatus;
  discoveryProfileStatus: DiscoveryStatus | null;
  productStatus: DiscoveryProductStatus;
  productStatusLabel: string;
  qualifiedForDiscovery: boolean;
  stages: typeof DISCOVERY_MVP_STAGES;
  evidenceMode: typeof DISCOVERY_MVP_EVIDENCE_MODE;
  nonClaims: typeof DISCOVERY_MVP_NON_CLAIMS;
  blueprintCompleteBlocked: boolean;
  d0d2ScopeNote: string;
};

export function buildDiscoveryMvpWorkspaceModel(input: {
  requestId: string;
  referenceCode: string;
  organizationName: string;
  requestStatus: ImplementationRequestStatus;
  discoveryProfileStatus: DiscoveryStatus | null | undefined;
  brief: ClientServiceRequestBrief | null | undefined;
  clientDiscoveryDraftStatus?: string | null;
  blueprintCompleteBlocked: boolean;
}): DiscoveryMvpWorkspaceModel {
  const qualifiedForDiscovery =
    input.brief?.procrowQualification?.outcome === "qualified_for_discovery";
  const productStatus = resolveDiscoveryProductStatus({
    requestStatus: input.requestStatus,
    discoveryProfileStatus: input.discoveryProfileStatus,
    clientDiscoveryDraftStatus: input.clientDiscoveryDraftStatus,
    qualifiedForDiscovery,
  });

  return {
    requestId: input.requestId,
    referenceCode: input.referenceCode,
    organizationName: input.organizationName,
    journeyKind: input.brief?.journeyKind ?? null,
    organizationContext: input.brief?.organizationContext ?? null,
    requestStatus: input.requestStatus,
    discoveryProfileStatus: input.discoveryProfileStatus ?? null,
    productStatus,
    productStatusLabel: discoveryProductStatusLabel(productStatus),
    qualifiedForDiscovery,
    stages: DISCOVERY_MVP_STAGES,
    evidenceMode: DISCOVERY_MVP_EVIDENCE_MODE,
    nonClaims: DISCOVERY_MVP_NON_CLAIMS,
    blueprintCompleteBlocked: input.blueprintCompleteBlocked,
    d0d2ScopeNote:
      "D0–D7 foundation: safety, adaptive Stages 1–7, local Operating Model input draft, ProCrow modeling review, and pre-Blueprint handoff package. Blueprint generation remains blocked.",
  };
}
