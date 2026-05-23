import Link from "next/link";
import { notFound } from "next/navigation";
import { SareaAcceptanceHub } from "@/components/studio/sarea/sarea-acceptance-hub";
import { ENTITY_THEME } from "@/lib/entity-theme";
import { SAREA_PACKAGES } from "@/lib/constants/sarea-packages";
import { getSareaPackageKey } from "@/lib/discovery-answers";
import { MOCK_SAREA_MONTHLY_SAR } from "@/lib/mock/pipeline";
import { isUseMockData } from "@/lib/mock/env";
import { MEEM_TENANT_SLUG } from "@/lib/mock/meem-global";
import { routes } from "@/lib/routes";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";
import { listSareaProfilesForTenant } from "@/lib/services/sarea.service";

export default async function BlueprintSareaPage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  const blueprint = await getEnterpriseBlueprint(blueprintId);
  if (!blueprint) notFound();

  const tenant = blueprint.tenant;
  const profiles = tenant ? await listSareaProfilesForTenant(tenant.id) : [];

  const experienceReqs = blueprint.request.discoveryProfile?.experienceRequirements ?? [];
  const answers = blueprint.request.discoveryProfile?.answers ?? [];
  const sareaPackageKey = getSareaPackageKey(answers);
  const sareaPackageLabel = SAREA_PACKAGES.find((p) => p.key === sareaPackageKey)?.label;

  return (
    <div className="space-y-6">
      <header className="cc-entity-block cc-entity-block--sarea !p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">
          {ENTITY_THEME.sarea.shortLabel}
        </p>
        <h2 className="cc-section-title mt-2 text-lg">SAREA experience</h2>
        <p className="mt-2 text-sm text-slate-400">
          Adaptive personas and layouts from discovery — seeded when the tenant goes live.
        </p>
        {sareaPackageKey && (
          <p className="mt-2 text-xs text-rose-200/90">
            Discovery package:{" "}
            <span className="font-medium">{sareaPackageLabel ?? sareaPackageKey}</span>
            {tenant && (
              <>
                {" "}
                ·{" "}
                <Link
                  href={routes.discovery(blueprint.requestId).experience}
                  className="text-rose-300 underline"
                >
                  View discovery experience →
                </Link>
              </>
            )}
          </p>
        )}
        {isUseMockData() && (
          <p className="mt-2 text-xs text-rose-300/80">
            Demo package estimate: SAR {MOCK_SAREA_MONTHLY_SAR.toLocaleString()}/mo
          </p>
        )}
      </header>

      {experienceReqs.length > 0 && (
        <ul className="space-y-2">
          {experienceReqs.map((e) => (
            <li
              key={e.id}
              className="rounded-cc border border-rose-500/15 bg-rose-500/5 px-4 py-3 text-sm"
            >
              <span className="font-medium text-rose-200">{e.personaKey}</span>
              <span className="text-slate-400"> — {e.requirement}</span>
            </li>
          ))}
        </ul>
      )}

      {tenant ? (
        <>
          {profiles.length === 0 ? (
            <p className="text-sm text-slate-500">No SAREA profiles yet.</p>
          ) : (
            <ul className="space-y-2">
              {profiles.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between rounded-cc border border-cyan-500/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <span className="text-white">{p.name}</span>
                  <span className="text-slate-500">
                    {p.personaKey} · {p._count.dashboardLayouts} layouts
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-3">
            <Link href={routes.sarea.profiles} className="cc-btn-secondary text-sm">
              SAREA studio →
            </Link>
            <Link href={routes.sarea.preview} className="cc-btn-secondary text-sm">
              Persona preview →
            </Link>
            <Link href={routes.tenant(tenant.slug).dashboard} className="text-sm text-cyan-400">
              Live dashboard →
            </Link>
          </div>
          {tenant.slug === MEEM_TENANT_SLUG && (
            <SareaAcceptanceHub
              requestId={blueprint.requestId}
              blueprintId={blueprintId}
              tenantSlug={tenant.slug}
              compact
            />
          )}
        </>
      ) : (
        <p className="text-sm text-slate-500">Provision tenant from overview to seed SAREA.</p>
      )}

      <Link href={routes.blueprint(blueprintId).overview} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Blueprint overview
      </Link>
    </div>
  );
}
