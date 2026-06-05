import "server-only";

import type { SareaExperienceGoNoGoDependency } from "@/lib/sarea/sarea-experience-mapping-contract";

/** Lightweight Go/No-Go advisory dependency — no Prisma or CyberCrow snapshot chain. */
export function buildSareaExperienceGoNoGoDependency(): SareaExperienceGoNoGoDependency {
  return {
    status: "warning",
    label: "SAREA blueprint-to-experience mapping (M2)",
    advisoryNote:
      "Personas, navigation, and widget recommendations are advisory — RBAC controls access; SAREA does not grant permissions. Run npm run sarea-blueprint:verify after M2 changes.",
  };
}
