import type { WorkPersonaDefinition } from "@/lib/model-forge/types";
import { StudioStatusChip } from "./studio-panel";

export function PersonaCard({ persona }: { persona: WorkPersonaDefinition }) {
  return (
    <article className="studio-surface p-3 transition hover:ring-1 hover:ring-cyan-500/20" tabIndex={0}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-white">{persona.displayName}</h4>
        <StudioStatusChip label="advisory" tone="advisory" />
      </div>
      <p className="text-xs text-slate-400">{persona.purpose}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {persona.workflowPositions.slice(0, 4).map((pos) => (
          <span key={pos} className="studio-chip-violet">
            {pos}
          </span>
        ))}
      </div>
      {persona.responsibilities.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-[11px] text-slate-500">
          {persona.responsibilities.slice(0, 3).map((r) => (
            <li key={r}>• {r}</li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[10px] text-slate-600">grantsPermissions: false</p>
    </article>
  );
}
