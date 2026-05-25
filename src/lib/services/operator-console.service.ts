import { MEEM_REFERENCE_CODE, MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { RIMAL_REFERENCE_CODE, RIMAL_TENANT_SLUG } from "@/lib/constants/rimal";
import { industryLabel, moduleLabel, planLabel } from "@/lib/catalog-labels";
import { prisma } from "@/lib/db";
import {
  operatorAdvisoryWarnings,
  operatorNextAction,
  OPERATOR_BUCKET_LABELS,
  resolveOperatorLifecycleBucket,
  type OperatorLifecycleBucket,
} from "@/lib/operator-onboarding-lifecycle";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export type OperatorLifecycleCard = {
  requestId: string;
  referenceCode: string;
  organizationName: string;
  industryLabel: string | null;
  moduleLabels: string[];
  planLabel: string | null;
  bucket: OperatorLifecycleBucket;
  bucketLabel: string;
  status: ImplementationRequestStatus;
  nextAction: string;
  nextHint: string;
  warnings: string[];
  blueprintId: string | null;
  tenantSlug: string | null;
  isLighthouse: boolean;
  lighthouseTag: "MEEM" | "Rimal" | null;
  updatedAt: Date;
};

export type OperatorPipelineBuckets = Record<OperatorLifecycleBucket, OperatorLifecycleCard[]>;

export type OperatorConsoleSnapshot = {
  live: boolean;
  buckets: OperatorPipelineBuckets;
  /** Flat list for grid (most recently updated first). */
  lifecycleCards: OperatorLifecycleCard[];
  platformWarnings: string[];
  lighthouse: {
    meem: { referenceCode: string; tenantSlug: string } | null;
    rimal: { referenceCode: string; tenantSlug: string } | null;
  };
};

const BUCKET_ORDER: OperatorLifecycleBucket[] = [
  "pending_review",
  "discovery_in_progress",
  "blueprint_pending",
  "ready_go_live",
  "tenant_live",
  "needs_review",
];

function emptyBuckets(): OperatorPipelineBuckets {
  return {
    pending_review: [],
    discovery_in_progress: [],
    blueprint_pending: [],
    ready_go_live: [],
    tenant_live: [],
    needs_review: [],
  };
}

function lighthouseTag(
  referenceCode: string,
  tenantSlug: string | null
): "MEEM" | "Rimal" | null {
  if (referenceCode === MEEM_REFERENCE_CODE || tenantSlug === MEEM_TENANT_SLUG) return "MEEM";
  if (referenceCode === RIMAL_REFERENCE_CODE || tenantSlug === RIMAL_TENANT_SLUG) return "Rimal";
  return null;
}

export async function getOperatorConsoleSnapshot(): Promise<OperatorConsoleSnapshot> {
  const buckets = emptyBuckets();
  const platformWarnings: string[] = [];

  try {
    const rows = await prisma.implementationRequest.findMany({
      orderBy: { updatedAt: "desc" },
      take: 80,
      select: {
        id: true,
        referenceCode: true,
        organizationName: true,
        industry: true,
        status: true,
        updatedAt: true,
        requestedModules: { select: { moduleKey: true } },
        requestedPlans: { select: { planKey: true }, take: 1 },
        discoveryProfile: { select: { id: true } },
        enterpriseBlueprint: {
          select: {
            id: true,
            tenant: { select: { slug: true } },
          },
        },
      },
    });

    const lifecycleCards: OperatorLifecycleCard[] = rows.map((row) => {
      const status = row.status as ImplementationRequestStatus;
      const hasDiscoveryProfile = Boolean(row.discoveryProfile);
      const blueprintId = row.enterpriseBlueprint?.id ?? null;
      const tenantSlug = row.enterpriseBlueprint?.tenant?.slug ?? null;
      const pipelineInput = {
        status,
        hasDiscoveryProfile,
        hasBlueprint: Boolean(blueprintId),
        hasTenant: Boolean(tenantSlug),
      };
      const bucket = resolveOperatorLifecycleBucket(pipelineInput);
      const next = operatorNextAction({
        ...pipelineInput,
        requestId: row.id,
        blueprintId,
        tenantSlug,
      });

      const card: OperatorLifecycleCard = {
        requestId: row.id,
        referenceCode: row.referenceCode,
        organizationName: row.organizationName,
        industryLabel: row.industry ? industryLabel(row.industry) : null,
        moduleLabels: row.requestedModules.map((m) => moduleLabel(m.moduleKey)),
        planLabel: row.requestedPlans[0]?.planKey
          ? planLabel(row.requestedPlans[0].planKey)
          : null,
        bucket,
        bucketLabel: OPERATOR_BUCKET_LABELS[bucket],
        status,
        nextAction: next.label,
        nextHint: next.hint,
        warnings: operatorAdvisoryWarnings(pipelineInput),
        blueprintId,
        tenantSlug,
        isLighthouse: Boolean(lighthouseTag(row.referenceCode, tenantSlug)),
        lighthouseTag: lighthouseTag(row.referenceCode, tenantSlug),
        updatedAt: row.updatedAt,
      };

      buckets[bucket].push(card);
      return card;
    });

    const meemRequest = rows.find((r) => r.referenceCode === MEEM_REFERENCE_CODE);
    const rimalRequest = rows.find((r) => r.referenceCode === RIMAL_REFERENCE_CODE);

    if (!meemRequest) {
      platformWarnings.push(
        "MEEM lighthouse request not found — run npm run db:seed:meem for staging baseline."
      );
    }
    if (!rimalRequest) {
      platformWarnings.push(
        "Rimal reference request not found — run npm run db:seed:rimal for second-tenant baseline."
      );
    }

    const liveTenantCount = await prisma.tenant.count({ where: { isActive: true } });
    const inPipeline = rows.filter((r) => {
      const b = resolveOperatorLifecycleBucket({
        status: r.status as ImplementationRequestStatus,
        hasDiscoveryProfile: Boolean(r.discoveryProfile),
        hasBlueprint: Boolean(r.enterpriseBlueprint),
        hasTenant: Boolean(r.enterpriseBlueprint?.tenant),
      });
      return b !== "tenant_live";
    }).length;

    if (liveTenantCount === 0 && rows.length > 0) {
      platformWarnings.push("No active tenants — complete blueprint go-live to provision one.");
    }
    if (inPipeline > 12) {
      platformWarnings.push(`${inPipeline} requests still in onboarding pipeline — review intake queue.`);
    }

    return {
      live: true,
      buckets,
      lifecycleCards,
      platformWarnings,
      lighthouse: {
        meem: meemRequest
          ? { referenceCode: MEEM_REFERENCE_CODE, tenantSlug: MEEM_TENANT_SLUG }
          : null,
        rimal: rimalRequest
          ? { referenceCode: RIMAL_REFERENCE_CODE, tenantSlug: RIMAL_TENANT_SLUG }
          : null,
      },
    };
  } catch {
    return {
      live: false,
      buckets,
      lifecycleCards: [],
      platformWarnings: [
        "Database unavailable — connect DATABASE_URL to load operator lifecycle cards.",
      ],
      lighthouse: {
        meem: { referenceCode: MEEM_REFERENCE_CODE, tenantSlug: MEEM_TENANT_SLUG },
        rimal: { referenceCode: RIMAL_REFERENCE_CODE, tenantSlug: RIMAL_TENANT_SLUG },
      },
    };
  }
}

export { BUCKET_ORDER };
