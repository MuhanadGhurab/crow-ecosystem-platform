import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/lib/routes";
import { listTenantComplianceControls } from "@/lib/services/cybercrow-tenant.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function CybercrowCompliancePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();
  const controls = await listTenantComplianceControls(tenant.id);

  return (
    <div className="space-y-8">
      <PageHeader badge="CyberCrow" entity="cybercrow" title="Compliance controls" description="NCA-aligned control baseline for this tenant." />
      {controls.length === 0 ? (
        <EmptyState title="No controls" description="Provision the tenant to seed the security baseline." />
      ) : (
        <ul className="space-y-2">
          {controls.map((c) => (
            <li key={c.id} className="cc-list-item">
              <span className="font-mono text-white">{c.controlKey}</span>
              <span className="text-slate-500">
                {c.status} · {c._count.evidence} evidence
              </span>
            </li>
          ))}
        </ul>
      )}
      <Link href={routes.tenant(slug).cybercrow.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
