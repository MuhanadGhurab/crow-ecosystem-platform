import { MEEM_REFERENCE_CODE } from "@/lib/mock/meem-global";
import {
  lifecycleIndexFromRequestStatus,
  PIPELINE_LIFECYCLE_LABELS,
} from "@/lib/pipeline-lifecycle";
import { REQUEST_STATUS_LABELS } from "@/lib/constants/request-status";
import { prisma } from "@/lib/db";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export type LighthousePipelineSnapshot = {
  requestId: string;
  referenceCode: string;
  organizationName: string;
  status: ImplementationRequestStatus;
  statusLabel: string;
  blueprintId: string | null;
  tenantSlug: string | null;
  currentLifecycleStep: string;
  nextLifecycleStep: string | null;
  lifecycleIndex: number;
  isGoLive: boolean;
};

function buildPipelineSnapshot(input: {
  id: string;
  referenceCode: string;
  organizationName: string;
  status: string;
  enterpriseBlueprint: {
    id: string;
    tenant: { slug: string } | null;
  } | null;
}): LighthousePipelineSnapshot {
  const status = input.status as ImplementationRequestStatus;
  const idx = lifecycleIndexFromRequestStatus(status);
  const currentLifecycleStep =
    idx >= 0 ? PIPELINE_LIFECYCLE_LABELS[idx]! : "Outside lifecycle";
  const nextLifecycleStep =
    idx >= 0 && idx < PIPELINE_LIFECYCLE_LABELS.length - 1
      ? PIPELINE_LIFECYCLE_LABELS[idx + 1]!
      : null;

  return {
    requestId: input.id,
    referenceCode: input.referenceCode,
    organizationName: input.organizationName,
    status,
    statusLabel: REQUEST_STATUS_LABELS[status] ?? status,
    blueprintId: input.enterpriseBlueprint?.id ?? null,
    tenantSlug: input.enterpriseBlueprint?.tenant?.slug ?? null,
    currentLifecycleStep,
    nextLifecycleStep,
    lifecycleIndex: idx,
    isGoLive: status === "GO_LIVE",
  };
}

/** MEEM lighthouse request — status and lifecycle position for admin overview. */
export async function getLighthousePipelineSnapshot(): Promise<LighthousePipelineSnapshot | null> {
  const request = await prisma.implementationRequest.findFirst({
    where: { referenceCode: MEEM_REFERENCE_CODE },
    select: {
      id: true,
      referenceCode: true,
      organizationName: true,
      status: true,
      enterpriseBlueprint: {
        select: {
          id: true,
          tenant: { select: { slug: true } },
        },
      },
    },
  });

  if (!request) return null;
  return buildPipelineSnapshot(request);
}

/** Lifecycle snapshot for any tenant via its blueprint request. */
export async function getTenantLifecycleSnapshot(
  tenantId: string
): Promise<LighthousePipelineSnapshot | null> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      blueprint: {
        select: {
          id: true,
          request: {
            select: {
              id: true,
              referenceCode: true,
              organizationName: true,
              status: true,
              enterpriseBlueprint: {
                select: {
                  id: true,
                  tenant: { select: { slug: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  const request = tenant?.blueprint?.request;
  if (!request) return null;

  return buildPipelineSnapshot({
    ...request,
    enterpriseBlueprint: request.enterpriseBlueprint,
  });
}
