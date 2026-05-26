import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpChainLinks } from "@/components/tenant/erp-chain-links";
import { ErpModuleHub } from "@/components/tenant/erp-module-hub";
import { LogisticsOperationsReadinessPanel } from "@/components/tenant/logistics/logistics-operations-readiness-panel";
import { MeemLogisticsHub } from "@/components/tenant/meem-logistics-hub";
import { SupplyChainOperationsLinkageBanner } from "@/components/tenant/supply-chain/supply-chain-operations-linkage-banner";
import { TenantModulePage } from "@/components/tenant/tenant-module-page";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
import { routes } from "@/lib/routes";
import { getLogisticsOperationsReadinessSnapshot } from "@/lib/services/logistics-readiness.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function LogisticsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const tenantModules = tenant.modules ?? [];
  const enabledModuleKeys = tenantModules.filter((m) => m.enabled).map((m) => m.moduleKey);
  if (!hasErpModule(tenantModules, "logistics")) notFound();

  const showMeemHub = showMeemErpHub(
    slug,
    tenant.organization.industry,
    tenantModules,
    "logistics"
  );
  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = showMeemHub ? resolveMeemHubAiKeys(answers, "logistics") : [];

  const readiness = await getLogisticsOperationsReadinessSnapshot(
    tenant.id,
    enabledModuleKeys,
    tenant.organization.industry
  );

  const linkageWarnings: string[] = [];
  if (!readiness.warehouseEnabled) {
    linkageWarnings.push(
      "Warehouse module off — enable for outbound lanes and warehouse-to-logistics handoff."
    );
  } else if (readiness.outboundLanes === 0) {
    linkageWarnings.push(
      "No outbound warehouse lanes yet — add lanes when dispatch prep is in scope."
    );
  }
  if (!readiness.inventoryEnabled) {
    linkageWarnings.push("Inventory module off — enable for SKU / movement context.");
  }
  if (!readiness.procurementEnabled) {
    linkageWarnings.push("Procurement module off — enable for supplier / purchase handoff.");
  }
  if (!readiness.crmEnabled) {
    linkageWarnings.push("CRM module off — enable for customer delivery and escalation context.");
  }
  if (readiness.crmEnabled && readiness.accountsWithoutContacts > 0) {
    linkageWarnings.push(
      `${readiness.accountsWithoutContacts} CRM account(s) without contacts — add contacts for escalation paths.`
    );
  }

  const cybercrowLive = readiness.cybercrowInitialized;
  const r = routes.tenant(slug);

  return (
    <TenantModulePage
      engine="CEM"
      title="Logistics"
      description={`Dispatch and delivery operations readiness for ${tenant.organization.displayName} — warehouse handoffs, exception review, and cross-module coordination without live GPS, carrier APIs, or automated dispatch.`}
      route="/[tenant]/logistics"
      tenantSlug={slug}
    >
      <div className="space-y-8">
        <SupplyChainOperationsLinkageBanner
          slug={slug}
          variant="logistics"
          warnings={linkageWarnings}
        />

        <TenantRuntimeCrossLinks
          slug={slug}
          current="logistics"
          cybercrowLive={cybercrowLive}
        />

        <TenantRuntimeStatStrip
          items={[
            { label: "Readiness", value: readiness.readinessLabel, accent: "cyan" },
            { label: "Outbound lanes", value: String(readiness.outboundLanes), accent: "amber" },
            { label: "SKUs (context)", value: String(readiness.totalSkus) },
            { label: "CRM accounts", value: String(readiness.crmAccountCount), accent: "teal" },
            { label: "Logistics open tasks", value: readiness.logisticsRelatedOpenTasks },
          ]}
        />

        <LogisticsOperationsReadinessPanel
          slug={slug}
          snapshot={readiness}
          cybercrowLive={cybercrowLive}
        />

        {(readiness.outboundLanes > 0 || readiness.inboundLanes > 0) && (
          <section className="cc-glass-card space-y-3">
            <h2 className="text-sm font-medium text-cyan-400">Warehouse lane signals (coordination)</h2>
            <p className="text-xs text-slate-500">
              Lane counts come from warehouse readiness — not live shipment tracking or carrier
              events.
            </p>
            <ul className="grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
              <li>
                Outbound: <span className="font-mono text-amber-300">{readiness.outboundLanes}</span>
              </li>
              <li>
                Inbound: <span className="font-mono text-teal-300">{readiness.inboundLanes}</span>
              </li>
              <li>
                Locations:{" "}
                <span className="font-mono text-slate-200">{readiness.warehouseLocations}</span>
              </li>
            </ul>
            {readiness.warehouseEnabled && (
              <p className="text-xs text-slate-500">
                <Link href={r.warehouse} className="text-cyan-400 hover:text-cyan-300">
                  Warehouse hub →
                </Link>
              </p>
            )}
          </section>
        )}

        {showMeemHub && (
          <>
            <ErpModuleHub
              slug={slug}
              organizationName={tenant.organization.displayName}
              moduleKey="logistics"
            />
            <MeemLogisticsHub
              slug={slug}
              organizationName={tenant.organization.displayName}
              aiExtraKeys={aiExtraKeys}
            />
            <ErpChainLinks
              tenantSlug={slug}
              currentModule="logistics"
              tenantModules={tenantModules}
            />
          </>
        )}
      </div>
    </TenantModulePage>
  );
}
