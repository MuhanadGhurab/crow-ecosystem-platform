import Link from "next/link";
import { notFound } from "next/navigation";
import { CommercialLinkageBanner } from "@/components/tenant/crm-sales/commercial-linkage-banner";
import { CrmOperationsReadinessPanel } from "@/components/tenant/crm/crm-operations-readiness-panel";
import { CrmAccountEditRow, CrmContactEditRow } from "@/components/tenant/crm/crm-edit-rows";
import { CrmAccountForm, CrmContactForm } from "@/components/tenant/crm/crm-forms";
import { MeemCrmHub } from "@/components/tenant/meem-crm-hub";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { PageHeader } from "@/components/ui/page-header";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
import { routes } from "@/lib/routes";
import { getCrmCommercialReadinessSnapshot } from "@/lib/services/crm-sales-readiness.service";
import { listCrmAccounts, listCrmContacts } from "@/lib/services/crm.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import {
  buildCemOperatingModelSnapshotForTenantSlug,
  selectModuleOperatingContext,
} from "@/lib/services/cem-operating-model.service";
import { TenantModuleOperatingContext } from "@/components/tenant/tenant-module-operating-context";
import { TenantCemModuleDepthSection } from "@/components/tenant/tenant-cem-module-depth-section";
import { buildCemModuleDepthSnapshotForTenantSlug } from "@/lib/services/cem-module-depth.service";

export default async function TenantCrmPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const tenantModules = tenant.modules ?? [];
  const enabledModuleKeys = tenantModules.filter((m) => m.enabled).map((m) => m.moduleKey);
  const hasCrmModule = hasErpModule(tenantModules, "crm");
  const showMeemHub = showMeemErpHub(slug, tenant.organization.industry, tenantModules, "crm");
  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = showMeemHub ? resolveMeemHubAiKeys(answers, "crm") : [];

  const request = tenant.blueprint?.request;
  const requestContext = {
    requestReferenceCode: request?.referenceCode ?? null,
    requestStatus: request?.status ?? null,
  };

  const [accounts, contacts, readiness, operatingModel, moduleDepth] = await Promise.all([
    hasCrmModule ? listCrmAccounts(tenant.id) : Promise.resolve([]),
    hasCrmModule ? listCrmContacts(tenant.id) : Promise.resolve([]),
    getCrmCommercialReadinessSnapshot(
      tenant.id,
      enabledModuleKeys,
      tenant.organization.industry,
      requestContext
    ),
    buildCemOperatingModelSnapshotForTenantSlug(slug),
    buildCemModuleDepthSnapshotForTenantSlug(slug, "crm"),
  ]);

  const accountOptions = accounts.map((a) => ({ id: a.id, name: a.name }));
  const moduleCtx = operatingModel
    ? selectModuleOperatingContext(operatingModel, "crm")
    : { relatedFlows: [], moduleAssignment: undefined };
  const cybercrowLive = readiness.cybercrowInitialized;
  const linkageWarnings: string[] = [];
  if (readiness.accountsWithoutContacts > 0) {
    linkageWarnings.push(
      `${readiness.accountsWithoutContacts} account(s) without contacts — add for escalation readiness.`
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM · CRM"
        title="Customer relationships"
        description={`Client and account readiness for ${tenant.organization.displayName}. Operator-managed accounts and contacts — commercial coordination, not a full CRM product.`}
      />

      <TenantRuntimeStatStrip
        items={[
          { label: "Readiness", value: readiness.readinessLabel, accent: "cyan" },
          { label: "Accounts", value: readiness.accountCount },
          { label: "Contacts", value: readiness.contactCount },
          {
            label: "Request link",
            value: readiness.requestReferenceCode ?? "—",
            accent: readiness.requestReferenceCode ? "teal" : undefined,
          },
          { label: "CRM open tasks", value: readiness.crmRelatedOpenTasks },
        ]}
      />

      <CommercialLinkageBanner
        slug={slug}
        variant="crm"
        requestReferenceCode={requestContext.requestReferenceCode}
        requestStatus={requestContext.requestStatus}
        warnings={linkageWarnings}
      />

      <CrmOperationsReadinessPanel
        slug={slug}
        snapshot={readiness}
        cybercrowLive={cybercrowLive}
      />

      {operatingModel && (
        <TenantModuleOperatingContext
          slug={slug}
          moduleKey="crm"
          moduleAssignment={moduleCtx.moduleAssignment}
          relatedFlows={moduleCtx.relatedFlows}
          cybercrowInitialized={cybercrowLive}
        />
      )}

      {moduleDepth && (
        <TenantCemModuleDepthSection
          slug={slug}
          snapshot={moduleDepth}
          cybercrowInitialized={cybercrowLive}
        />
      )}

      <TenantRuntimeCrossLinks slug={slug} current="crm" cybercrowLive={cybercrowLive} />

      {showMeemHub && (
        <MeemCrmHub
          slug={slug}
          organizationName={tenant.organization.displayName}
          aiExtraKeys={aiExtraKeys}
        />
      )}

      {hasCrmModule && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <CrmAccountForm tenantSlug={slug} />
            <CrmContactForm tenantSlug={slug} accounts={accountOptions} />
          </div>

          <section>
            <h3 className="text-sm font-medium text-cyan-400">Accounts ({accounts.length})</h3>
            {accounts.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">
                No accounts yet — add when commercial intake exists. Do not invent customer records.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {accounts.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-cc border border-cyan-500/10 bg-white/5 px-4 py-3 text-sm"
                  >
                    <div className="flex justify-between">
                      <span className="text-white">{a.name}</span>
                      <span className="text-slate-500">{a._count.contacts} contacts</span>
                    </div>
                    <CrmAccountEditRow tenantSlug={slug} account={a} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="text-sm font-medium text-cyan-400">Contacts ({contacts.length})</h3>
            {contacts.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No contacts yet.</p>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-cc border border-cyan-500/10">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-cyan-500/10 bg-white/5 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Account</th>
                      <th className="px-4 py-3">Title</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/5 text-slate-300">
                    {contacts.map((c) => (
                      <tr key={c.id}>
                        <td className="px-4 py-3" colSpan={4}>
                          <CrmContactEditRow tenantSlug={slug} contact={c} />
                          <p className="mt-1 text-xs text-slate-500">
                            {c.account?.name ?? "No account"}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {!hasCrmModule && (
        <p className="text-sm text-slate-500">
          CRM module is not enabled on this tenant — readiness guidance above still applies when
          you enable the module.
        </p>
      )}

      <Link href={routes.tenant(slug).dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Dashboard
      </Link>
    </div>
  );
}
