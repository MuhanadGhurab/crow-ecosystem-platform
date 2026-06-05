import "server-only";

import {
  CEM_OPERATING_MODEL_RELATIONSHIP_COPY,
  type CemOperatingGoNoGoDependency,
} from "@/lib/cem/cem-operating-model-contract";

/** Lightweight Go/No-Go advisory dependency for M3.1 — no Prisma chain. */
export function buildCemOperatingModelGoNoGoDependency(): CemOperatingGoNoGoDependency {
  return {
    status: "warning",
    label: "CEM core operating model integration (M3.1)",
    advisoryNote:
      "CEM operating model maps how modules, workflows, tasks, and reports connect as one tenant operating system. Advisory until per-tenant spine is reviewed on ProCrow tenant workbench. Does not approve production launch. Run npm run cem-operating-model:verify after M3.1 changes.",
    relationshipNote: CEM_OPERATING_MODEL_RELATIONSHIP_COPY,
    spineChecks: [
      "Operational spine ready (departments, roles, users present)",
      "Core cross-module flows mapped (5 advisory flows)",
      "Tasks / workflows / reports cross-linked",
      "CyberCrow observability hooks described",
      "SAREA experience hooks described",
    ],
  };
}
