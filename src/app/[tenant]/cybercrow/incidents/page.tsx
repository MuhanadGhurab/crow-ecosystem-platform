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
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Incidents"
        description="Security incidents and response status — status updates are read-only in this phase."
      />

      <section className="rounded-lg border border-amber-500/15 bg-amber-950/15 px-4 py-3 text-xs text-slate-400">
        Open incidents reduce the dashboard posture score. Escalation and closure actions are not
        wired to external ticketing in this release — use for visibility and audit alignment only.
      </section>
      {incidents.length === 0 ? (
        <EmptyState title="No incidents" description="Baseline posture is healthy — incidents will list here when raised." />
      ) : (
        <ul className="space-y-2">
          {incidents.map((i) => (
            <li key={i.id} className="cc-list-item flex-col !items-start gap-1 sm:flex-row sm:items-center">
              <span className="font-medium text-white">{i.title}</span>
              <span className="text-slate-500">
                {i.severity} · {i.status} ·{" "}
                {i.createdAt.toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
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
