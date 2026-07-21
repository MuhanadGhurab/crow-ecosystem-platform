/**
 * Regenerate packages/contracts/generated/screen-registry.json locally.
 * Not used by CI — CI validates drift only.
 */
import { writeRegistryArtifact } from "./screen-registry.mjs";

const { outPath, body } = await writeRegistryArtifact();
console.log(
  `Regenerated ${outPath} (${body.activeCount} ACTIVE / ${body.shellCount} shells)`,
);
