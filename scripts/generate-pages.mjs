import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "app");

function shell(area, route, extra = "") {
  return `import { PagePlaceholder } from "@/components/ui/page-placeholder";

export default function Page() {
  return (
    <PagePlaceholder area="${area}" route="${route}" />
    ${extra}
  );
}
`;
}

function writePage(relPath, area, route, extra = "") {
  const full = join(root, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, shell(area, route, extra), "utf8");
}

const pages = [
  ["admin/overview/page.tsx", "Crow Admin", "/admin/overview"],
  ["admin/requests/page.tsx", "Crow Admin", "/admin/requests"],
  ["admin/discovery/page.tsx", "Crow Admin", "/admin/discovery"],
  ["admin/blueprints/page.tsx", "Crow Admin", "/admin/blueprints"],
  ["admin/tenants/page.tsx", "Crow Admin", "/admin/tenants"],
  ["admin/domains/page.tsx", "Crow Admin", "/admin/domains"],
  ["admin/integrations/page.tsx", "Crow Admin", "/admin/integrations"],
  ["admin/subscriptions/page.tsx", "Crow Admin", "/admin/subscriptions"],
  ["admin/security-baselines/page.tsx", "Crow Admin", "/admin/security-baselines"],
  ["admin/audit/page.tsx", "Crow Admin", "/admin/audit"],
  ["admin/requests/[requestId]/page.tsx", "Crow Admin", "/admin/requests/[requestId]"],
  ["admin/tenants/[tenantId]/page.tsx", "Crow Admin", "/admin/tenants/[tenantId]"],
  ["discovery/[requestId]/page.tsx", "Discovery", "/discovery/[requestId]"],
  ...["organization", "departments", "branches", "roles", "workflows", "modules", "security", "identity", "integrations", "experience", "summary"].map(
    (s) => [`discovery/[requestId]/${s}/page.tsx`, "Discovery", `/discovery/[requestId]/${s}`]
  ),
  ...["overview", "cem", "cybercrow", "sarea", "identity", "integrations", "go-live"].map(
    (s) => [`blueprints/[blueprintId]/${s}/page.tsx`, "Blueprint", `/blueprints/[blueprintId]/${s}`]
  ),
  ...["dashboard", "workflows", "tasks", "users", "roles", "departments", "branches", "modules", "reports", "settings", "hr", "crm", "sales", "inventory", "warehouse", "logistics", "finance"].map(
    (s) => [`[tenant]/${s}/page.tsx`, "CEM", `/[tenant]/${s}`]
  ),
  ...["dashboard", "audit-logs", "security-events", "risk", "incidents", "compliance", "identity", "sessions", "grc", "evidence"].map(
    (s) => [`[tenant]/cybercrow/${s}/page.tsx`, "CyberCrow", `/[tenant]/cybercrow/${s}`]
  ),
  ...["overview", "profiles", "layouts", "role-mapping", "rules", "widgets", "navigation", "device-rules", "preview"].map(
    (s) => [`sarea/${s}/page.tsx`, "SAREA", `/sarea/${s}`]
  ),
];

for (const [path, area, route] of pages) {
  writePage(path, area, route);
}

console.log(`Regenerated ${pages.length} shell pages (layout-only, no nested AreaShell)`);
