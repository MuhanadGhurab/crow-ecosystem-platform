import {
  FTGP_DISCOVERY_CLIENT_ANSWER_SECTION,
  FTGP_DISCOVERY_SYSTEM_ANSWER_SECTIONS,
} from "./ftgp-discovery-invariant.constants";

/** Reserved namespaces — must not collide with client_discovery question keys. */
export const FTGP_DISCOVERY_RESERVED_SECTION_PREFIXES = [
  "ftgp_",
  "org_intelligence",
] as const;

export const FTGP_DISCOVERY_SYSTEM_MARKER_SECTIONS = [
  ...FTGP_DISCOVERY_SYSTEM_ANSWER_SECTIONS,
] as const;

export function isReservedSystemMarkerSection(sectionKey: string): boolean {
  if ((FTGP_DISCOVERY_SYSTEM_MARKER_SECTIONS as readonly string[]).includes(sectionKey)) {
    return true;
  }
  return FTGP_DISCOVERY_RESERVED_SECTION_PREFIXES.some((prefix) =>
    sectionKey.startsWith(prefix)
  );
}

export function isClientDiscoverySection(sectionKey: string): boolean {
  return sectionKey === FTGP_DISCOVERY_CLIENT_ANSWER_SECTION;
}

export function sectionExcludedFromClientCompletion(sectionKey: string): boolean {
  return isReservedSystemMarkerSection(sectionKey);
}

export function systemMarkersSatisfyClientRequirements(): false {
  return false;
}
