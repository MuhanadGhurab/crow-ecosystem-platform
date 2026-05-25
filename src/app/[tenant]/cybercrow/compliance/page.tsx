import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/lib/routes";
import { getNcaControlDefinition } from "@/lib/constants/nca-compliance-controls";
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
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Compliance controls"
        description="NCA ECC–aligned control baseline — advisory mapping, not a certification claim."
      />

      <section className="rounded-lg border border-indigo-500/20 bg-indigo-950/15 px-4 py-3 text-sm">
        <p className="font-medium text-indigo-300">NCA-aware advisory posture</p>
        <p className="mt-1 text-xs text-slate-400">
          Control keys reference Saudi NCA Essential Cybersecurity Controls (ECC) domains for
          orientation. Status labels reflect provisioned baseline data — they do not constitute an
          attested compliance certification.
        </p>
      </section>
      {controls.length === 0 ? (
        <EmptyState title="No controls" description="Provision the tenant to seed the security baseline." />
      ) : (
        <ul className="space-y-2">
          {controls.map((c) => {
            const nca = getNcaControlDefinition(c.controlKey);
            return (
              <li key={c.id} className="cc-list-item flex-col !items-start gap-1 sm:flex-row sm:!items-center">
                <div>
                  <span className="font-mono text-xs text-violet-300">{nca.frameworkId}</span>
                  <span className="ml-2 text-white">{nca.title}</span>
                  <span className="ml-2 text-xs text-slate-600">({c.controlKey})</span>
                </div>
                <span className="text-slate-500">
                  {c.status} · {c._count.evidence} evidence
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex flex-wrap gap-4 text-sm">
        <Link href={routes.tenant(slug).settings} className="text-cyan-400 hover:text-cyan-300">
          Identity & Entra settings →
        </Link>
        <Link href={routes.tenant(slug).cybercrow.dashboard} className="text-violet-400 hover:text-violet-300">
          ← CyberCrow dashboard
        </Link>
      </div>
    </div>
  );
}
