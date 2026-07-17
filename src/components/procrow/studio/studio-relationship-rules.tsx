"use client";

import type { CatalogRelationshipRule } from "@/lib/model-forge/relationships/relationship-types";
import { CATALOG_RELATIONSHIP_RULES } from "@/lib/model-forge/relationships/relationship-registry";
import { studioMotion } from "./studio-motion";

type Props = {
  rules?: readonly CatalogRelationshipRule[];
  filterSource?: string;
  filterStatus?: string;
  onSelectRule?: (ruleKey: string) => void;
  reducedMotion?: boolean;
};

export function StudioRelationshipRulesView({
  rules = CATALOG_RELATIONSHIP_RULES,
  filterSource,
  filterStatus,
  onSelectRule,
  reducedMotion,
}: Props) {
  const filtered = rules.filter((r) => {
    if (filterSource && r.sourceType !== filterSource) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className={`space-y-2 ${reducedMotion ? "" : studioMotion.tabTransition}`}>
      <p className="text-xs text-white/50">Read-only catalog relationship rules — authorityEffect: NONE</p>
      <ul className="max-h-[28rem] space-y-2 overflow-y-auto text-xs">
        {filtered.map((r) => (
          <li key={r.ruleKey}>
            <button
              type="button"
              className="w-full rounded border border-white/10 bg-black/30 p-2 text-left hover:border-cyan-500/30"
              onClick={() => onSelectRule?.(r.ruleKey)}
            >
              <p className="font-medium text-cyan-100">{r.ruleKey}</p>
              <p className="text-white/60">{r.sourceType} → {r.relationshipType} → {r.targetType}</p>
              <p className="text-white/40">{r.description}</p>
              <span className="mt-1 inline-block rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-violet-200">{r.status}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
