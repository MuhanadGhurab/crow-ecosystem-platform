/**
 * Idempotent backfill for PlatformNotification.metadata (tenant / blueprint / request links).
 *
 * Usage:
 *   npm run notifications:backfill:dry   # report only
 *   npm run notifications:backfill       # apply repairs
 */
import { Prisma, PrismaClient } from "@prisma/client";

import { MEEM_REFERENCE_CODE, MEEM_TENANT_SLUG } from "../src/lib/constants/meem";
import {
  buildNotificationDedupeKey,
  enrichPlatformNotificationRow,
  legacyStatusFromSplit,
  parsePlatformNotificationMetadata,
  resolveDeliveryStatus,
  resolveInboxStatus,
  resolveNotificationActionLinks,
  severityForNotification,
  summarizeNotificationLinkReliability,
  type PlatformNotificationMetadata,
  type PlatformNotificationRow,
} from "../src/lib/services/platform-notification-links";

const prisma = new PrismaClient();
const MEEM_SLUG = MEEM_TENANT_SLUG;

type TenantLookup = {
  id: string;
  slug: string;
  blueprintId: string | null;
  displayName: string;
};

type RequestLookup = {
  id: string;
  referenceCode: string;
  organizationName: string;
  blueprintId: string | null;
};

type MeemLiveIds = {
  tenantSlug: string;
  tenantId: string | null;
  requestId: string | null;
  blueprintId: string | null;
  referenceCode: string | null;
  source: "live" | "unavailable";
};

type BackfillContext = {
  tenantsById: Map<string, TenantLookup>;
  tenantsBySlug: Map<string, TenantLookup>;
  tenantByBlueprintId: Map<string, TenantLookup>;
  requestsById: Map<string, RequestLookup>;
  requestsByReference: Map<string, RequestLookup>;
  blueprintByRequestId: Map<string, string>;
  meem: MeemLiveIds;
};

type RepairProposal = {
  id: string;
  eventType: string;
  before: PlatformNotificationMetadata;
  after: PlatformNotificationMetadata;
  addedFields: string[];
  reasons: string[];
};

function parseArgs(argv: string[]) {
  const dryRun = argv.includes("--dry-run") || !argv.includes("--apply");
  return { dryRun };
}

function isBlank(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  return false;
}

function mergeMetadata(
  existing: PlatformNotificationMetadata,
  patch: PlatformNotificationMetadata
): { merged: PlatformNotificationMetadata; addedFields: string[] } {
  const merged = { ...existing };
  const addedFields: string[] = [];

  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === null) continue;
    const current = merged[key];
    if (!isBlank(current)) continue;
    merged[key] = value;
    addedFields.push(key);
  }

  return { merged, addedFields };
}

function orgLooksMeem(organizationName: string | undefined): boolean {
  if (!organizationName) return false;
  return /meem/i.test(organizationName);
}

function effectiveMeta(
  base: PlatformNotificationMetadata,
  patch: PlatformNotificationMetadata
): PlatformNotificationMetadata {
  return mergeMetadata(base, patch).merged;
}

async function resolveMeemLiveIds(ctx: BackfillContext): Promise<MeemLiveIds> {
  const fallback: MeemLiveIds = {
    tenantSlug: MEEM_SLUG,
    tenantId: null,
    requestId: null,
    blueprintId: null,
    referenceCode: MEEM_REFERENCE_CODE,
    source: "unavailable",
  };

  const tenant = ctx.tenantsBySlug.get(MEEM_SLUG);
  if (!tenant?.blueprintId) return fallback;

  const request = [...ctx.requestsById.values()].find((r) => r.blueprintId === tenant.blueprintId);
  if (!request) {
    return {
      tenantSlug: MEEM_SLUG,
      tenantId: tenant.id,
      requestId: null,
      blueprintId: tenant.blueprintId,
      referenceCode: MEEM_REFERENCE_CODE,
      source: "live",
    };
  }

  return {
    tenantSlug: MEEM_SLUG,
    tenantId: tenant.id,
    requestId: request.id,
    blueprintId: tenant.blueprintId,
    referenceCode: request.referenceCode,
    source: "live",
  };
}

function proposeRepair(
  row: { id: string; eventType: string; metadata: unknown },
  ctx: BackfillContext
): RepairProposal | null {
  const before = parsePlatformNotificationMetadata(row.metadata);
  const patch: PlatformNotificationMetadata = {};
  const reasons: string[] = [];

  if (isBlank(before.tenantId) && !isBlank(before.tenantSlug)) {
    const t = ctx.tenantsBySlug.get(String(before.tenantSlug).trim());
    if (t) {
      patch.tenantId = t.id;
      reasons.push(`tenantId ← slug ${t.slug}`);
    }
  }

  if (isBlank(before.tenantSlug) && !isBlank(before.tenantId)) {
    const t = ctx.tenantsById.get(String(before.tenantId).trim());
    if (t) {
      patch.tenantSlug = t.slug;
      reasons.push(`tenantSlug ← tenantId`);
    }
  }

  const working = effectiveMeta(before, patch);

  if (isBlank(working.requestId) && !isBlank(working.referenceCode)) {
    const req = ctx.requestsByReference.get(String(working.referenceCode).trim());
    if (req) {
      patch.requestId = req.id;
      reasons.push(`requestId ← referenceCode ${req.referenceCode}`);
      if (isBlank(working.blueprintId) && req.blueprintId) {
        patch.blueprintId = req.blueprintId;
        reasons.push(`blueprintId ← request ${req.referenceCode}`);
      }
      if (isBlank(working.displayName)) {
        patch.displayName = req.organizationName;
        reasons.push(`displayName ← request org`);
      }
    }
  }

  const working2 = effectiveMeta(before, patch);

  if (isBlank(working2.blueprintId) && !isBlank(working2.requestId)) {
    const bp = ctx.blueprintByRequestId.get(String(working2.requestId).trim());
    if (bp) {
      patch.blueprintId = bp;
      reasons.push(`blueprintId ← requestId`);
    }
  }

  const working3 = effectiveMeta(before, patch);

  if (!isBlank(working3.blueprintId) && isBlank(working3.requestId)) {
    for (const [requestId, blueprintId] of ctx.blueprintByRequestId) {
      if (blueprintId === working3.blueprintId) {
        patch.requestId = requestId;
        reasons.push(`requestId ← blueprintId`);
        break;
      }
    }
  }

  const working4 = effectiveMeta(before, patch);

  if (isBlank(working4.tenantId) && !isBlank(working4.blueprintId)) {
    const t = ctx.tenantByBlueprintId.get(String(working4.blueprintId).trim());
    if (t) {
      patch.tenantId = t.id;
      patch.tenantSlug = t.slug;
      reasons.push(`tenant ← blueprint ${working4.blueprintId}`);
      if (isBlank(working4.displayName)) {
        patch.displayName = t.displayName;
        reasons.push(`displayName ← tenant org`);
      }
    }
  }

  const working5 = effectiveMeta(before, patch);

  if (
    (isBlank(working5.tenantSlug) || working5.tenantSlug === MEEM_SLUG) &&
    (orgLooksMeem(working5.organizationName) ||
      orgLooksMeem(working5.displayName) ||
      row.eventType === "tenant_provisioned")
  ) {
    const meemTenant = ctx.tenantsBySlug.get(MEEM_SLUG);
    if (meemTenant) {
      if (isBlank(working5.tenantId)) {
        patch.tenantId = meemTenant.id;
        reasons.push(`tenantId ← MEEM slug ${MEEM_SLUG}`);
      }
      if (isBlank(working5.tenantSlug)) {
        patch.tenantSlug = MEEM_SLUG;
        reasons.push(`tenantSlug ← MEEM org hint`);
      }
      if (isBlank(working5.displayName)) {
        patch.displayName = meemTenant.displayName;
        reasons.push(`displayName ← MEEM tenant org`);
      }
      if (isBlank(working5.requestId) && ctx.meem.requestId) {
        patch.requestId = ctx.meem.requestId;
        reasons.push(`requestId ← MEEM live lookup`);
      }
      if (isBlank(working5.blueprintId) && ctx.meem.blueprintId) {
        patch.blueprintId = ctx.meem.blueprintId;
        reasons.push(`blueprintId ← MEEM live lookup`);
      }
      if (isBlank(working5.referenceCode) && ctx.meem.referenceCode) {
        patch.referenceCode = ctx.meem.referenceCode;
        reasons.push(`referenceCode ← MEEM live lookup`);
      }
    }
  }

  const resolvedTenantId = effectiveMeta(before, patch).tenantId;
  if (!isBlank(resolvedTenantId) && isBlank(patch.displayName) && isBlank(before.displayName)) {
    const t = ctx.tenantsById.get(String(resolvedTenantId).trim());
    if (t?.displayName) {
      patch.displayName = t.displayName;
      reasons.push(`displayName ← tenant organization`);
    }
  }

  if (isBlank(before.displayName) && !isBlank(before.organizationName) && isBlank(patch.displayName)) {
    patch.displayName = String(before.organizationName).trim();
    reasons.push(`displayName ← organizationName`);
  }

  const { merged, addedFields } = mergeMetadata(before, patch);
  if (addedFields.length === 0) return null;

  return {
    id: row.id,
    eventType: row.eventType,
    before,
    after: merged,
    addedFields,
    reasons,
  };
}

function rowNeedsMetadataRepair(meta: PlatformNotificationMetadata, eventType: string): boolean {
  const wantsTenant =
    meta.advisory === true ||
    Boolean(meta.tenantSlug) ||
    Boolean(meta.tenantId) ||
    orgLooksMeem(meta.organizationName) ||
    orgLooksMeem(meta.displayName);

  if (wantsTenant && (isBlank(meta.tenantId) || isBlank(meta.tenantSlug))) return true;
  if (wantsTenant && isBlank(meta.displayName)) return true;

  const wantsPipeline =
    Boolean(meta.referenceCode) ||
    Boolean(meta.requestId) ||
    Boolean(meta.blueprintId) ||
    ["request_received", "discovery_started", "blueprint_ready", "tenant_provisioned"].includes(
      eventType
    );

  if (wantsPipeline && isBlank(meta.requestId) && !isBlank(meta.referenceCode)) return true;
  if (wantsPipeline && isBlank(meta.blueprintId) && !isBlank(meta.requestId)) return true;

  return false;
}

async function loadContext(): Promise<BackfillContext> {
  const [tenants, requests] = await Promise.all([
    prisma.tenant.findMany({
      select: {
        id: true,
        slug: true,
        blueprintId: true,
        organization: { select: { displayName: true } },
      },
    }),
    prisma.implementationRequest.findMany({
      select: {
        id: true,
        referenceCode: true,
        organizationName: true,
        enterpriseBlueprint: { select: { id: true } },
      },
    }),
  ]);

  const tenantsById = new Map<string, TenantLookup>();
  const tenantsBySlug = new Map<string, TenantLookup>();
  const tenantByBlueprintId = new Map<string, TenantLookup>();

  for (const t of tenants) {
    const entry: TenantLookup = {
      id: t.id,
      slug: t.slug,
      blueprintId: t.blueprintId,
      displayName: t.organization.displayName,
    };
    tenantsById.set(t.id, entry);
    tenantsBySlug.set(t.slug, entry);
    if (t.blueprintId) tenantByBlueprintId.set(t.blueprintId, entry);
  }

  const requestsById = new Map<string, RequestLookup>();
  const requestsByReference = new Map<string, RequestLookup>();
  const blueprintByRequestId = new Map<string, string>();

  for (const r of requests) {
    const blueprintId = r.enterpriseBlueprint?.id ?? null;
    const entry: RequestLookup = {
      id: r.id,
      referenceCode: r.referenceCode,
      organizationName: r.organizationName,
      blueprintId,
    };
    requestsById.set(r.id, entry);
    requestsByReference.set(r.referenceCode, entry);
    if (blueprintId) blueprintByRequestId.set(r.id, blueprintId);
  }

  const partial: BackfillContext = {
    tenantsById,
    tenantsBySlug,
    tenantByBlueprintId,
    requestsById,
    requestsByReference,
    blueprintByRequestId,
    meem: {
      tenantSlug: MEEM_SLUG,
      tenantId: null,
      requestId: null,
      blueprintId: null,
      referenceCode: MEEM_REFERENCE_CODE,
      source: "unavailable",
    },
  };
  partial.meem = await resolveMeemLiveIds(partial);
  return partial;
}

type MeemValidationRow = {
  id: string;
  eventType: string;
  tenantSlug: string | null;
  hasMeemLogisticsLink: boolean;
  hasTenantPlanLink: boolean;
  linkKinds: string[];
  meemIdsMatchLive: boolean;
};

function validateMeemRows(rows: PlatformNotificationRow[], ctx: BackfillContext): MeemValidationRow[] {
  const live = ctx.meem;
  return rows
    .filter(
      (r) =>
        r.parsed.tenantSlug === MEEM_SLUG ||
        orgLooksMeem(r.parsed.displayName ?? undefined) ||
        orgLooksMeem(parsePlatformNotificationMetadata(r.metadata).organizationName)
    )
    .map((row) => {
      const links = resolveNotificationActionLinks(row);
      const meta = parsePlatformNotificationMetadata(row.metadata);
      const idsMatch =
        live.source === "live" &&
        (!live.tenantId || meta.tenantId === live.tenantId) &&
        (!live.requestId || meta.requestId === live.requestId) &&
        (!live.blueprintId || meta.blueprintId === live.blueprintId);

      return {
        id: row.id,
        eventType: row.eventType,
        tenantSlug: row.parsed.tenantSlug,
        hasMeemLogisticsLink: links.some((l) => l.kind === "meem_logistics"),
        hasTenantPlanLink: links.some((l) => l.kind === "tenant_plan"),
        linkKinds: links.map((l) => l.kind),
        meemIdsMatchLive: idsMatch,
      };
    });
}

function printSampleRepairs(repairs: RepairProposal[], limit = 5) {
  const sample = repairs.slice(0, limit);
  if (!sample.length) {
    console.log("(no repairable rows in this run)\n");
    return;
  }
  console.log(`Sample repairs (up to ${limit}):\n`);
  for (const r of sample) {
    console.log(`  ${r.id}  ${r.eventType}`);
    console.log(`    + ${r.addedFields.join(", ")}`);
    console.log(`    ${r.reasons.join("; ")}`);
    console.log(`    before: ${JSON.stringify(r.before)}`);
    console.log(`    after:  ${JSON.stringify(r.after)}\n`);
  }
}

async function main() {
  const { dryRun } = parseArgs(process.argv.slice(2));
  console.log(`\n=== Notification metadata backfill (${dryRun ? "DRY RUN" : "APPLY"}) ===\n`);

  const ctx = await loadContext();
  const rows = await prisma.platformNotification.findMany({
    orderBy: { createdAt: "asc" },
  });

  let missingMetadata = 0;
  let repairable = 0;
  let unrepairable = 0;
  const proposals: RepairProposal[] = [];

  for (const row of rows) {
    const meta = parsePlatformNotificationMetadata(row.metadata);
    const needsRepair = rowNeedsMetadataRepair(meta, row.eventType);
    if (needsRepair) missingMetadata++;

    const proposal = proposeRepair(row, ctx);
    if (proposal) {
      repairable++;
      proposals.push(proposal);
    } else if (needsRepair) {
      unrepairable++;
    }
  }

  console.log(`Scanned:              ${rows.length}`);
  console.log(`Missing metadata:     ${missingMetadata}`);
  console.log(`Repairable:           ${repairable}`);
  console.log(`Unrepairable:         ${unrepairable}`);
  console.log(`Mode:                 ${dryRun ? "dry-run (no writes)" : "apply"}\n`);

  printSampleRepairs(proposals);

  if (!dryRun && proposals.length > 0) {
    let updated = 0;
    for (const p of proposals) {
      await prisma.platformNotification.update({
        where: { id: p.id },
        data: { metadata: p.after as Prisma.InputJsonValue },
      });
      updated++;
    }
    console.log(`Applied metadata patches: ${updated}\n`);
  }

  let statusSplitPatched = 0;
  let severityPatched = 0;
  let dedupePatched = 0;
  const freshRows = await prisma.platformNotification.findMany({
    orderBy: { createdAt: "asc" },
  });

  for (const row of freshRows) {
    const meta = parsePlatformNotificationMetadata(row.metadata);
    const deliveryStatus = resolveDeliveryStatus(row);
    const inboxStatus = resolveInboxStatus(row);
    const severity =
      row.severity ??
      severityForNotification(row.eventType, deliveryStatus, meta);
    const tenantId = meta.tenantId;
    const dedupeKey =
      row.dedupeKey ??
      (tenantId && meta.advisory !== false
        ? buildNotificationDedupeKey(String(tenantId), row.eventType, row.createdAt)
        : undefined);
    const legacyStatus = legacyStatusFromSplit(deliveryStatus, inboxStatus);

    const needsPatch =
      row.deliveryStatus !== deliveryStatus ||
      row.inboxStatus !== inboxStatus ||
      row.severity !== severity ||
      (dedupeKey && row.dedupeKey !== dedupeKey) ||
      row.status !== legacyStatus;

    if (!needsPatch) continue;
    statusSplitPatched += 1;
    if (!row.severity) severityPatched += 1;
    if (!row.dedupeKey && dedupeKey) dedupePatched += 1;

    if (!dryRun) {
      await prisma.platformNotification.update({
        where: { id: row.id },
        data: {
          deliveryStatus,
          inboxStatus,
          severity,
          status: legacyStatus,
          ...(dedupeKey ? { dedupeKey } : {}),
        },
      });
    }
  }

  console.log("Status split / severity / dedupe (Phase E):\n");
  console.log(`  Rows needing patch:     ${statusSplitPatched}`);
  console.log(`  Severity backfills:   ${severityPatched}`);
  console.log(`  Dedupe keys added:    ${dedupePatched}`);
  console.log(`  Mode:                 ${dryRun ? "dry-run (no writes)" : "apply"}\n`);

  const enrichedAfterScan = rows.map((r) => {
    const proposal = proposals.find((p) => p.id === r.id);
    const meta = proposal ? proposal.after : r.metadata;
    return enrichPlatformNotificationRow({ ...r, metadata: meta ?? r.metadata });
  });

  const reliability = summarizeNotificationLinkReliability(enrichedAfterScan);
  console.log("Link reliability (after proposed/applied metadata):\n");
  console.log(`  Valid tenant plan links:  ${reliability.valid_tenant}`);
  console.log(`  Valid blueprint links:    ${reliability.valid_blueprint}`);
  console.log(`  Valid request links:      ${reliability.valid_request}`);
  console.log(`  Audit-only fallback:      ${reliability.audit_only}`);
  console.log(`  No actionable destination: ${reliability.none}\n`);

  console.log("MEEM live lookup (dynamic, slug meem-global):\n");
  console.log(
    JSON.stringify(
      {
        source: ctx.meem.source,
        tenantId: ctx.meem.tenantId,
        requestId: ctx.meem.requestId,
        blueprintId: ctx.meem.blueprintId,
        referenceCode: ctx.meem.referenceCode,
      },
      null,
      2
    )
  );

  const meemRows = validateMeemRows(enrichedAfterScan, ctx);
  console.log(`\nMEEM-related notification rows: ${meemRows.length}`);
  if (meemRows.length > 0) {
    const withLogistics = meemRows.filter((m) => m.hasMeemLogisticsLink).length;
    const withPlan = meemRows.filter((m) => m.hasTenantPlanLink).length;
    const idsOk = meemRows.filter((m) => m.meemIdsMatchLive).length;
    console.log(`  With MEEM logistics audit link: ${withLogistics}`);
    console.log(`  With tenant plan link:          ${withPlan}`);
    console.log(`  Metadata IDs match live lookup:  ${idsOk} (when source=live)`);
    console.log("\n  Sample MEEM rows:");
    for (const m of meemRows.slice(0, 5)) {
      console.log(
        `    ${m.id}  ${m.eventType}  slug=${m.tenantSlug ?? "—"}  links=[${m.linkKinds.join(", ")}]  liveIdsMatch=${m.meemIdsMatchLive}`
      );
    }
  }

  console.log("");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
