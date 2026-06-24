import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function check(cond: boolean, msg: string) {
  assert.ok(cond, msg);
}

check(
  existsSync(join(ROOT, "src/app/client/requests/[requestId]/discovery/design/page.tsx")),
  "design route exists",
);
check(
  existsSync(join(ROOT, "src/lib/client-enterprise-design/index.ts")),
  "client-enterprise-design module exists",
);
check(
  existsSync(join(ROOT, "src/components/client-enterprise-design/client-design-journey.tsx")),
  "client design journey component exists",
);

const routes = readFileSync(join(ROOT, "src/lib/routes.ts"), "utf8");
check(routes.includes("requestDiscoveryDesign"), "routes include design journey");

const pkg = readFileSync(join(ROOT, "package.json"), "utf8");
check(pkg.includes("client-enterprise-design:test"), "package script registered");

console.log("client-enterprise-design-routes: PASS");
