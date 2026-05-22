import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/lib/routes";
import { listTenantIncidents } from "@/lib/services/cybercrow-tenant.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function CybercrowIncidentsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();
  const incidents = await listTenantIncidents(tenant.id);

  return (
    <div className="space-y-8">
      <PageHeader badge="CyberCrow" entity="cybercrow" title="Incidents" description="Security incidents and response status." />
      {incidents.length === 0 ? (
        <EmptyState title="No incidents" description="Baseline posture is healthy — incidents will list here when raised." />
      ) : (
        <ul className="space-y-2">
          {incidents.map((i) => (
            <li key={i.id} className="cc-list-item">
              <span className="text-white">{i.title}</span>
              <span className="text-slate-500">
                {i.severity} · {i.status}
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
