import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import {
  EntraOpsPanel,
  shouldShowEntraOpsNarrative,
} from "@/components/tenant/entra-ops-panel";
import { routes } from "@/lib/routes";
import { getTenantSecuritySettings } from "@/lib/services/tenant-security-settings.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import Link from "next/link";

export default async function CybercrowIdentityPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const security = await getTenantSecuritySettings(tenant.id);
  const showEntra = shouldShowEntraOpsNarrative(tenant.planKey, security);
  const r = routes.tenant(slug);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Identity & access"
        description="IdP alignment from discovery, Entra SSO operations, and MFA posture for this tenant."
      />

      <EntraOpsPanel
        tenantSlug={slug}
        security={security}
        showEntraNarrative={showEntra}
        variant="identity"
      />

      <section className="cc-glass-card text-sm text-slate-400">
        <p>
          Session governance and privileged access reviews are on the{" "}
          <Link href={r.cybercrow.sessions} className="text-violet-400 hover:text-violet-300">
            Sessions
          </Link>{" "}
          console. Workspace-level settings:{" "}
          <Link href={r.settings} className="text-cyan-400 hover:text-cyan-300">
            Tenant settings →
          </Link>
        </p>
      </section>

      <Link href={r.cybercrow.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
