import Link from "next/link";
import { notFound } from "next/navigation";
import {
  EntraOpsPanel,
  shouldShowEntraOpsNarrative,
} from "@/components/tenant/entra-ops-panel";
import { PageHeader } from "@/components/ui/page-header";
import { routes } from "@/lib/routes";
import { getTenantSecuritySettings } from "@/lib/services/tenant-security-settings.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

const WORKSPACE_LINKS = (slug: string) => [
  { href: routes.tenant(slug).users, label: "Users" },
  { href: routes.tenant(slug).roles, label: "Roles" },
  { href: routes.tenant(slug).departments, label: "Departments" },
  { href: routes.tenant(slug).modules, label: "Modules" },
  { href: routes.tenant(slug).cybercrow.identity, label: "CyberCrow identity" },
  { href: routes.tenant(slug).cybercrow.sessions, label: "Sessions" },
];

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
    <div className="space-y-8">
      <PageHeader
        badge="CEM · Settings"
        entity="cem"
        title="Workspace settings"
        description={`Configuration for ${tenant.organization.displayName}.`}
      />

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-cyan-400">Workspace operations</h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {WORKSPACE_LINKS(slug).map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm text-slate-300 hover:text-cyan-300">
                {link.label} →
              </Link>
            </li>
          ))}
        </ul>
      </section>

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

      <section className="cc-glass-card space-y-3">
        <h3 className="text-sm font-medium text-cyan-400">Organization & plan</h3>
        <p className="text-sm text-slate-300">Plan: {tenant.planKey}</p>
        <p className="font-mono text-xs text-slate-500">/{tenant.slug}</p>
        <Link href={routes.tenant(slug).settingsPlan} className="text-sm text-cyan-400 hover:text-cyan-300">
          View subscription plan (read-only) →
        </Link>
      </section>
    </div>
  );
}
