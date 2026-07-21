/**
 * Validate generated screen-registry artifact drift without writing files.
 */
import { mkdtemp, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  formatRegistryJson,
  generateCanonicalRegistry,
  validateCommittedRegistry,
  REGISTRY_RELATIVE_PATH,
} from "./screen-registry.mjs";

const root = process.cwd();
const { formatted, body } = await generateCanonicalRegistry(root);
await validateCommittedRegistry(root);

if (!formatted.endsWith("\n")) {
  throw new Error("Canonical registry output missing final newline");
}

const reformatted = await formatRegistryJson(body);
if (reformatted !== formatted) {
  throw new Error("Canonical registry formatting is not Prettier-stable");
}

const tempRoot = await mkdtemp(path.join(tmpdir(), "ghv-screen-registry-"));
try {
  const tempFile = path.join(tempRoot, "screen-registry.json");
  await writeFile(tempFile, formatted, "utf8");
  const roundTrip = await readFile(tempFile, "utf8");
  if (roundTrip !== formatted) {
    throw new Error("Temporary registry round-trip mismatch");
  }
  const committed = await readFile(
    path.join(root, REGISTRY_RELATIVE_PATH),
    "utf8",
  );
  if (roundTrip !== committed) {
    throw new Error("Temporary generation does not match committed artifact");
  }
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}

console.log("Generated screen-registry artifact validated (no drift)");
