import Link from "next/link";
import { getModeledSectorCatalog } from "@/lib/constants/sector-catalog";
import { routes } from "@/lib/routes";

type Props = {
  requestId: string;
  sectorTemplateKey: string;
  orgIntelligenceStatus: string | null;
};

export function BlueprintSectorReadinessPanel({
  requestId,
  sectorTemplateKey,
  orgIntelligenceStatus,
}: Props) {
  const catalog = getModeledSectorCatalog(sectorTemplateKey);
  const sectorLabel = catalog?.title ?? sectorTemplateKey;

  return (
    <section className="rounded-xl border border-violet-500/20 bg-violet-950/10 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-violet-300/80">
        Sector operating model
      </p>
      <h2 className="mt-1 text-lg font-semibold text-white">{sectorLabel}</h2>
      <p className="mt-2 text-sm text-slate-400">
        Blueprint and readiness checks assume the{" "}
        <span className="font-mono text-violet-200">{sectorTemplateKey}</span> advisory template
        {orgIntelligenceStatus ? (
          <>
            {" "}
            (org intelligence: <span className="text-slate-300">{orgIntelligenceStatus}</span>)
          </>
        ) : null}
        .
      </p>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Carries into blueprint</dt>
          <dd className="text-slate-200">
            Accepted departments, roles, workflows, requested modules, security packages, pricing
            alignment
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Remains advisory</dt>
          <dd className="text-slate-200">
            Sector hints, SAREA/CyberCrow suggestions, completeness scores, future-only integrations
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Needs operator review</dt>
          <dd className="text-slate-200">
            Org model acceptance, discovery gate blockers, manual readiness toggles before provision
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Future-only</dt>
          <dd className="text-slate-200">
            {catalog?.advisoryNote ??
              "Confirm sector template on discovery organization model before go-live."}
          </dd>
        </div>
      </dl>

      <Link
        href={routes.discovery(requestId).organizationModel}
        className="mt-4 inline-block text-xs text-cyan-400 hover:text-cyan-300"
      >
        Review discovery sector model →
      </Link>
    </section>
  );
}
