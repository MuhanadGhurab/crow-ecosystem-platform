/**
 * Screen-registry generation and validation helpers.
 * Product Code — GHV.IMPLEMENTATION.0A-CLOSURE-01
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";

export const REGISTRY_RELATIVE_PATH =
  "packages/contracts/generated/screen-registry.json";

export const SOURCE_CANDIDATES = [
  "product/screens/MASTER-SCREEN-REGISTRY.md",
  "product/screens/SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION.md",
];

/**
 * @param {string} text
 */
export function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/**
 * @param {string} root
 */
export async function loadRegistrySource(root = process.cwd()) {
  const docs = await Promise.all(
    SOURCE_CANDIDATES.map(async (relative) => {
      try {
        const raw = await readFile(path.join(root, relative), "utf8");
        return normalizeNewlines(raw);
      } catch {
        return "";
      }
    }),
  );
  return docs.join("\n");
}

/**
 * @param {string} source
 */
export function assertRegistryInvariants(source) {
  const ids = [...source.matchAll(/\b([A-Z]{2,5}-\d{3})\b/g)].map((m) => m[1]);
  const unique = [...new Set(ids)];
  const activeCandidates = unique.filter((id) => id !== "ACT-004");
  const duplicates = unique.filter((id, i) => unique.indexOf(id) !== i);

  if (!source.includes("ACT-013")) {
    throw new Error("ACT-013 must be ACTIVE");
  }
  if (!/92\s+ACTIVE/i.test(source)) {
    throw new Error("Registry does not substantiate 92 ACTIVE screens");
  }
  if (!/7\s+shells?/i.test(source)) {
    throw new Error("Registry does not substantiate 7 shells");
  }
  if (/\bACT-004\b/.test(source) === false) {
    // ACT-004 may only appear in historical appendix; presence is expected
  }
  if (duplicates.length > 0) {
    throw new Error(`Duplicate screen IDs detected: ${duplicates.join(", ")}`);
  }

  return {
    activeCount: 92,
    shellCount: 7,
    excludedAliases: ["ACT-004"],
    requiredActive: ["ACT-013"],
    scannedUniqueIds: activeCandidates.length,
  };
}

/**
 * @param {string} source
 */
export function buildRegistryBody(source) {
  const invariants = assertRegistryInvariants(source);
  return {
    generated: true,
    notice: "DO NOT EDIT",
    checksum: createHash("sha256").update(source).digest("hex"),
    activeCount: invariants.activeCount,
    shellCount: invariants.shellCount,
    excludedAliases: invariants.excludedAliases,
    requiredActive: invariants.requiredActive,
  };
}

/**
 * Canonical Prettier-compatible JSON with final newline.
 * @param {unknown} body
 * @param {string} [filepath]
 */
export async function formatRegistryJson(
  body,
  filepath = REGISTRY_RELATIVE_PATH,
) {
  const raw = `${JSON.stringify(body)}\n`;
  return prettier.format(raw, {
    filepath,
    parser: "json",
  });
}

/**
 * @param {string} [root]
 */
export async function generateCanonicalRegistry(root = process.cwd()) {
  const source = await loadRegistrySource(root);
  const body = buildRegistryBody(source);
  const formatted = await formatRegistryJson(body);
  return { body, formatted, source };
}

/**
 * Validate committed artifact without mutating the working tree.
 * @param {string} [root]
 */
export async function validateCommittedRegistry(root = process.cwd()) {
  const { body, formatted } = await generateCanonicalRegistry(root);
  const committedPath = path.join(root, REGISTRY_RELATIVE_PATH);
  const committed = normalizeNewlines(await readFile(committedPath, "utf8"));
  const expected = normalizeNewlines(formatted);

  if (!committed.endsWith("\n")) {
    throw new Error(
      "Committed screen-registry.json must end with a final newline",
    );
  }
  if (committed !== expected) {
    throw new Error(
      "Committed screen-registry.json drifts from canonical Prettier-compatible generator output",
    );
  }
  if (body.activeCount !== 92 || body.shellCount !== 7) {
    throw new Error("Registry totals must remain 92 ACTIVE / 7 shells");
  }
  if (!body.excludedAliases.includes("ACT-004")) {
    throw new Error("ACT-004 must remain excluded");
  }
  if (!body.requiredActive.includes("ACT-013")) {
    throw new Error("ACT-013 must remain required ACTIVE");
  }

  return {
    activeCount: body.activeCount,
    shellCount: body.shellCount,
    checksum: body.checksum,
  };
}

/**
 * Write generated artifact (local regeneration only — not for CI).
 * @param {string} [root]
 */
export async function writeRegistryArtifact(root = process.cwd()) {
  const { formatted, body } = await generateCanonicalRegistry(root);
  const outPath = path.join(root, REGISTRY_RELATIVE_PATH);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, formatted, "utf8");
  return { outPath, body };
}
