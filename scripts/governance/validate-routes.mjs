/**
 * Validate governed screen registry totals and committed generated artifact.
 * CI-safe: does not mutate the working tree.
 */
import { validateCommittedRegistry } from "./screen-registry.mjs";

const result = await validateCommittedRegistry();
console.log(
  `Route registry validated: ${result.activeCount} ACTIVE, ${result.shellCount} shells (checksum ${result.checksum.slice(0, 12)}…)`,
);
