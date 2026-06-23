import type { WorkPersonaDefinition } from "../types";
import { WORK_PERSONA_CATALOG } from "./work-persona-catalog";
import { WORK_PERSONA_EXTENDED_CATALOG } from "./work-persona-extended";

export { WORK_PERSONA_CATALOG, PERSONA_BUILDING_BLOCKS } from "./work-persona-catalog";
export { WORK_PERSONA_EXTENDED_CATALOG } from "./work-persona-extended";

export function listWorkPersonas(): WorkPersonaDefinition[] {
  return [...WORK_PERSONA_CATALOG, ...WORK_PERSONA_EXTENDED_CATALOG];
}

export function getWorkPersona(key: string): WorkPersonaDefinition | undefined {
  return listWorkPersonas().find((p) => p.key === key);
}
