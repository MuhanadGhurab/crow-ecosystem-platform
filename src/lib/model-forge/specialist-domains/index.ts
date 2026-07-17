import type { SpecialistDomainDefinition } from "../types";
import { SPECIALIST_DOMAIN_CATALOG } from "./specialist-domain-catalog";
import { SPECIALIST_DOMAIN_EXTENDED_CATALOG } from "./specialist-domain-extended";

export function listSpecialistDomains(): SpecialistDomainDefinition[] {
  return [...SPECIALIST_DOMAIN_CATALOG, ...SPECIALIST_DOMAIN_EXTENDED_CATALOG];
}

export function getSpecialistDomain(key: string): SpecialistDomainDefinition | undefined {
  return listSpecialistDomains().find((d) => d.key === key);
}

export const SPECIALIST_DOMAIN_COUNT = () => listSpecialistDomains().length;
