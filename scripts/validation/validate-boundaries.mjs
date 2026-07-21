import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
async function files(d) {
  const out = [];
  for (const e of await readdir(d, { withFileTypes: true }).catch(() => [])) {
    const p = join(d, e.name);
    if (e.isDirectory()) out.push(...(await files(p)));
    else if (/\.[cm]?[jt]sx?$/.test(e.name)) out.push(p);
  }
  return out;
}
const all = await files("packages");
const rules = [
  [
    /packages\\contracts/,
    /@ghuravia\/(config|domain|data|provider-mocks|testing|web|background-worker)/,
  ],
  [
    /packages\\domain/,
    /@ghuravia\/(config|data|provider-mocks|testing|web|background-worker)/,
  ],
  [
    /packages\\data/,
    /@ghuravia\/(web|provider-mocks|testing|background-worker)/,
  ],
];
for (const f of all) {
  const t = await readFile(f, "utf8");
  if (/from\s+["'][^"']*(spikes|validation)\//.test(t))
    throw new Error("Prohibited import: " + f);
  for (const [path, ban] of rules)
    if (path.test(f) && ban.test(t))
      throw new Error("Boundary violation: " + f);
}
console.log("Package boundaries validated");
