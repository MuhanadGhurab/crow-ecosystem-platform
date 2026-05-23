import { notFound } from "next/navigation";
import { ErpChainLinks } from "@/components/tenant/erp-chain-links";
import { ErpModuleHub } from "@/components/tenant/erp-module-hub";
import { MeemLogisticsHub } from "@/components/tenant/meem-logistics-hub";
import { TenantModulePage } from "@/components/tenant/tenant-module-page";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
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
  const hasLogisticsModule = hasErpModule(tenantModules, "logistics");
  const showLogisticsHub = showMeemErpHub(
    slug,
    tenant.organization.industry,
    tenantModules,
    "logistics"
  );
  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = showLogisticsHub ? resolveMeemHubAiKeys(answers, "logistics") : [];
  return (
    <TenantModulePage
      engine="CEM"
      title="Logistics"
      description={
        showLogisticsHub
          ? `Shipments, carriers, OCR document capture, and AI-assisted routing for ${tenant.organization.displayName}.`
          : "Shipments, carriers, and fulfillment operations."
      }
      route="/[tenant]/logistics"
      tenantSlug={slug}
    >
      {showLogisticsHub ? (
        <div className="space-y-8">
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
          {hasLogisticsModule && (
            <ErpChainLinks
              tenantSlug={slug}
              currentModule="logistics"
              tenantModules={tenantModules}
            />
          )}
        </div>
      ) : undefined}
    </TenantModulePage>
  );
}
