import type { OrganizationalModelDNA } from "@/lib/model-forge/types";
import { StudioStatusChip } from "./studio-panel";

export function ModelDnaSummary({ dna }: { dna: OrganizationalModelDNA }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <StudioStatusChip label={dna.scaleProfile.preset} />
        <StudioStatusChip label={dna.operatingTopology} tone="advisory" />
        <StudioStatusChip label={dna.authorityStyle} tone="warning" />
      </div>
      <dl className="grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Primary industry</dt>
          <dd className="font-medium text-white">{dna.primaryIndustry}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Specialist domains</dt>
          <dd className="text-cyan-100">{(dna.specialistDomains.length ? dna.specialistDomains : ["—"]).join(", ")}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Workforce model</dt>
          <dd className="text-slate-200">{dna.workforceModel}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Workflow intensity</dt>
          <dd className="text-slate-200">{dna.workflowIntensity}</dd>
        </div>
      </dl>
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Provenance</p>
        <ul className="max-h-24 space-y-0.5 overflow-y-auto text-[11px] text-slate-400">
          {dna.provenance.map((p) => (
            <li key={`${p.field}-${p.source}`}>
              {p.field}: <span className="text-slate-300">{p.source}</span>
            </li>
          ))}
        </ul>
      </div>
      <ul className="space-y-1 text-[11px] text-slate-400">
        {dna.modelRationale.map((r) => (
          <li key={r}>• {r}</li>
        ))}
      </ul>
    </div>
  );
}
