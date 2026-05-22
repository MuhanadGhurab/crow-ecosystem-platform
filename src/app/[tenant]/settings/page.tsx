import { notFound } from "next/navigation";
import {
  EntraOpsPanel,
  shouldShowEntraOpsNarrative,
} from "@/components/tenant/entra-ops-panel";
import { getTenantSecuritySettings } from "@/lib/services/tenant-security-settings.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantSettingsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const security = await getTenantSecuritySettings(tenant.id);
  const showEntra = shouldShowEntraOpsNarrative(tenant.planKey, security);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Settings</h2>
        <p className="mt-1 text-sm text-slate-400">
          Workspace configuration for {tenant.organization.displayName}.
        </p>
      </div>

      {showEntra ? (
        <EntraOpsPanel
          tenantSlug={slug}
          security={security}
          showEntraNarrative={showEntra}
          variant="settings"
        />
      ) : (
        <section className="cc-glass-card space-y-4">
          <h3 className="text-sm font-medium text-cyan-400">Identity & MFA</h3>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">MFA for admins</dt>
              <dd className={security.mfaRequired ? "text-teal-300" : "text-amber-300"}>
                {security.mfaLabel}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Identity provider</dt>
              <dd className="text-white">{security.idpLabel}</dd>
            </div>
          </dl>
        </section>
      )}

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-cyan-400">Organization</h3>
        <p className="mt-2 text-sm text-slate-300">Plan: {tenant.planKey}</p>
        <p className="mt-1 font-mono text-xs text-slate-500">/{tenant.slug}</p>
      </section>
    </div>
  );
}
