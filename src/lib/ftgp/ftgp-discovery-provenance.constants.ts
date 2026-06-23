/** Canonical Discovery answer provenance types for FTGP golden path. */
export const FTGP_DISCOVERY_PROVENANCE = {
  CLIENT_PROVIDED: "CLIENT_PROVIDED",
  IMPLEMENTER_OBSERVATION: "IMPLEMENTER_OBSERVATION",
  SYSTEM_DERIVED: "SYSTEM_DERIVED",
  SYSTEM_LIFECYCLE_MARKER: "SYSTEM_LIFECYCLE_MARKER",
} as const;

export type FtgpDiscoveryProvenance =
  (typeof FTGP_DISCOVERY_PROVENANCE)[keyof typeof FTGP_DISCOVERY_PROVENANCE];

export const CLIENT_OWNER_PROOF_REQUIRED_FOR_ANSWER_CAPTURE = true;
export const CLIENT_OWNER_PROOF_REQUIRED_FOR_DISCOVERY_COMPLETION = true;
export const CLIENT_OWNER_PROOF_REQUIRED_FOR_INTERNAL_PREPARATION = false;

/** Maps write-service provenance input to canonical provenance label. */
export function mapWriteProvenanceToCanonical(
  provenance: "client_owner" | "implementer_internal" | "system_derived"
): FtgpDiscoveryProvenance {
  switch (provenance) {
    case "client_owner":
      return FTGP_DISCOVERY_PROVENANCE.CLIENT_PROVIDED;
    case "implementer_internal":
      return FTGP_DISCOVERY_PROVENANCE.IMPLEMENTER_OBSERVATION;
    case "system_derived":
      return FTGP_DISCOVERY_PROVENANCE.SYSTEM_DERIVED;
  }
}
