import Link from "next/link";
import { notFound } from "next/navigation";
import { CybercrowControlReadinessPanel } from "@/components/tenant/cybercrow/cybercrow-control-readiness-panel";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/lib/routes";
import { getNcaControlDefinition } from "@/lib/constants/nca-compliance-controls";
import {
  getControlEvidenceMapping,
  getGrcControlReadiness,
  readinessLabelClass,
  readinessLabelText,
} from "@/lib/services/cybercrow-evidence-grc.service";
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

  const [controls, domains, mapping] = await Promise.all([
    listTenantComplianceControls(tenant.id),
    getGrcControlReadiness(tenant.id),
    getControlEvidenceMapping(tenant.id),
  ]);
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Compliance controls"
        description="NCA ECC–aligned control baseline with evidence mapping — advisory readiness only."
      />

      <section className="rounded-lg border border-indigo-500/20 bg-indigo-950/15 px-4 py-3 text-sm">
        <p className="font-medium text-indigo-300">NCA-aware advisory posture</p>
        <p className="mt-1 text-xs text-slate-400">
          Control keys orient to Saudi NCA Essential Cybersecurity Controls domains. Status and
          readiness labels reflect operator-managed data — not an attested certification.
        </p>
      </section>

      {controls.length === 0 ? (
        <EmptyState title="No controls" description="Provision the tenant to seed the security baseline." />
      ) : (
        <>
          <section className="cc-glass-card">
            <h3 className="text-sm font-medium text-violet-300">Control register</h3>
            <ul className="mt-4 space-y-2">
              {controls.map((c) => {
                const nca = getNcaControlDefinition(c.controlKey);
                const mapRow = mapping.find((m) => m.controlKey === c.controlKey);
                const readiness = mapRow?.readiness ?? "advisory_only";
                return (
                  <li
                    key={c.id}
                    className="cc-list-item flex-col !items-start gap-2 sm:flex-row sm:!items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-xs text-violet-300">{nca.frameworkId}</span>
                      <span className="ml-2 text-white">{nca.title}</span>
                      <span className="ml-2 text-xs text-slate-600">({c.controlKey})</span>
                      <p className="mt-1 text-xs text-slate-500">{nca.domain}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`rounded-full border px-2 py-0.5 ${readinessLabelClass(readiness)}`}
                      >
                        {readinessLabelText(readiness)}
                      </span>
                      <span className="text-slate-500">
                        {c.status} · {c._count.evidence} evidence
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <CybercrowControlReadinessPanel domains={domains} mapping={mapping} showMapping />
        </>
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href={r.evidence} className="text-indigo-400 hover:text-indigo-300">
          Evidence repository →
        </Link>
        <Link href={r.grc} className="text-violet-400 hover:text-violet-300">
          GRC overview →
        </Link>
        <Link href={routes.tenant(slug).settings} className="text-cyan-400 hover:text-cyan-300">
          Identity & Entra settings →
        </Link>
        <Link href={r.dashboard} className="text-violet-400 hover:text-violet-300">
          ← CyberCrow dashboard
        </Link>
      </div>
    </div>
  );
}
