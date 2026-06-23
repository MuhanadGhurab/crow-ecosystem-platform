"use client";

import type { ProvenanceChain } from "@/lib/model-forge/provenance/provenance-types";
import { studioMotion } from "./studio-motion";

type StudioProvenanceDrawerProps = {
  chain: ProvenanceChain | null;
  onFocusUpstream?: (ref: string) => void;
  onFocusDownstream?: (path: string) => void;
  reducedMotion?: boolean;
};

export function StudioProvenanceDrawer({
  chain,
  onFocusUpstream,
  onFocusDownstream,
  reducedMotion = false,
}: StudioProvenanceDrawerProps) {
  if (!chain || chain.records.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-white/50">
        Select a graph node or Blueprint section to inspect provenance.
      </div>
    );
  }

  const record = chain.records[0]!;
  const duration = reducedMotion ? 0 : studioMotion.panel;

  return (
    <div
      className="space-y-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 text-sm"
      style={{ transition: duration ? `opacity ${duration}ms ease` : undefined }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-400/90">Advisory — not an authority assignment</p>
      <div>
        <p className="font-medium text-white">{record.recommendation}</p>
        <p className="mt-1 text-white/60">{record.reason}</p>
      </div>
      <div>
        <p className="text-xs text-white/40">Sources</p>
        <p className="text-white/70">{record.sources.join(", ")}</p>
      </div>
      {record.catalogRefs.length > 0 && (
        <div>
          <p className="text-xs text-white/40">Catalog entries</p>
          <ul className="text-white/70">
            {record.catalogRefs.map((r) => (
              <li key={r}>
                <button type="button" className="text-cyan-300 hover:underline" onClick={() => onFocusUpstream?.(r)}>
                  {r}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {record.userInputs.length > 0 && (
        <div>
          <p className="text-xs text-white/40">User selections</p>
          <p className="text-white/70">{record.userInputs.join(", ")}</p>
        </div>
      )}
      <p className="text-xs text-white/50">Strength: {record.strength}</p>
      {chain.downstreamPaths.length > 0 && (
        <div>
          <p className="text-xs text-white/40">Downstream effects</p>
          <ul className="max-h-24 overflow-y-auto text-xs text-white/60">
            {chain.downstreamPaths.slice(0, 8).map((p) => (
              <li key={p}>
                <button type="button" className="text-violet-300 hover:underline" onClick={() => onFocusDownstream?.(p)}>
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        className="text-xs text-cyan-400 hover:text-cyan-300"
        onClick={() => navigator.clipboard?.writeText(JSON.stringify(chain, null, 2))}
      >
        Copy provenance summary
      </button>
    </div>
  );
}
