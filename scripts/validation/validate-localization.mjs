/**
 * Arabic/English localization key parity (no runtime i18n framework).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

function objectKeys(path) {
  const src = readFileSync(path, "utf8");
  return [
    ...new Set(
      [...src.matchAll(/^\s{2}([a-zA-Z][a-zA-Z0-9]*):/gm)].map((m) => m[1]),
    ),
  ].sort();
}

function declaredKeys(path) {
  const src = readFileSync(path, "utf8");
  return [
    ...new Set(
      [...src.matchAll(/^\s{2}"([a-zA-Z][a-zA-Z0-9]*)",?\s*$/gm)].map(
        (m) => m[1],
      ),
    ),
  ].sort();
}

const root = join(process.cwd(), "apps/web/lib/localization");
const ar = objectKeys(join(root, "ar.ts"));
const en = objectKeys(join(root, "en.ts"));
const declared = declaredKeys(join(root, "messages.ts"));

if (ar.join(",") !== en.join(",")) {
  console.error("Arabic/English key mismatch");
  process.exit(1);
}
if (declared.join(",") !== ar.join(",")) {
  console.error("Declared MESSAGE_KEYS diverge from catalogues");
  console.error("declared", declared.length, "catalog", ar.length);
  process.exit(1);
}
console.log(
  `validate:localization OK — ${ar.length} keys · Arabic/English parity`,
);
