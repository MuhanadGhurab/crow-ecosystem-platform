import "server-only";

import { prisma } from "@/lib/db";
import {
  MEEM_DISCOVERY_REQUEST_ID,
  MEEM_MOCK_ONLY_FALLBACK_BLUEPRINT_ID,
  MEEM_MOCK_ONLY_FALLBACK_REQUEST_ID,
  MEEM_PROPOSAL_TOKEN,
  MEEM_REFERENCE_CODE,
  MEEM_TENANT_SLUG,
} from "@/lib/constants/meem";

export type MeemLiveIds = {
  tenantSlug: string;
  tenantId: string | null;
  requestId: string | null;
  blueprintId: string | null;
  referenceCode: string | null;
  source: "live" | "unavailable";
  /** Set when Postgres lookup fails — staff should run `npm run meem:ids:staging`. */
  errorMessage?: string;
};

/** Resolve MEEM request/blueprint IDs from Postgres by tenant slug (source of truth: `npm run meem:ids`). */
export async function resolveMeemLiveIds(): Promise<MeemLiveIds> {
  const unavailable = (errorMessage?: string): MeemLiveIds => ({
    tenantSlug: MEEM_TENANT_SLUG,
    tenantId: null,
    requestId: null,
    blueprintId: null,
    referenceCode: MEEM_REFERENCE_CODE,
    source: "unavailable",
    errorMessage,
  });

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

    if (!tenant) {
      return unavailable(
        `Tenant slug "${MEEM_TENANT_SLUG}" not found — seed MEEM or run npm run meem:ids:staging.`
      );
    }
    if (!tenant.blueprint) {
      return unavailable(
        `Tenant "${MEEM_TENANT_SLUG}" has no blueprint — complete provisioning before SAREA acceptance links.`
      );
    }

    return {
      tenantSlug: tenant.slug,
      tenantId: tenant.id,
      requestId: tenant.blueprint.request.id,
      blueprintId: tenant.blueprint.id,
      referenceCode: tenant.blueprint.request.referenceCode,
      source: "live",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "MEEM ID lookup failed";
    return unavailable(`${msg} — check DATABASE_URL and npm run meem:ids:staging.`);
  }
}

export async function getMeemDemoPaths(baseUrl = "http://localhost:3000") {
  const live = await resolveMeemLiveIds();
  /** Offline demo script only — not used for staff UI when source is unavailable. */
  const requestId = live.requestId ?? MEEM_MOCK_ONLY_FALLBACK_REQUEST_ID;
  const blueprintId = live.blueprintId ?? MEEM_MOCK_ONLY_FALLBACK_BLUEPRINT_ID;

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
