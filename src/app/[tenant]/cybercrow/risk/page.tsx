import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { routes } from "@/lib/routes";
import { listTenantRiskScores } from "@/lib/services/cybercrow-tenant.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function CybercrowRiskPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();
  const scores = await listTenantRiskScores(tenant.id);

  return (
    <div className="space-y-8">
      <PageHeader badge="CyberCrow" entity="cybercrow" title="Risk scores" description="Aggregated risk posture over time." />
      {scores.length === 0 ? (
        <EmptyState title="No assessments" description="Risk scores will be generated from control and event data." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scores.map((s) => (
            <StatCard
              key={s.id}
              label={s.createdAt.toLocaleDateString()}
              value={String(s.score)}
              accent="violet"
              entity="cybercrow"
            />
          ))}
        </div>
      )}
      <Link href={routes.tenant(slug).cybercrow.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
