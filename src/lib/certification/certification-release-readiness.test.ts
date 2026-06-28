import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { verifyRouteInventory, requiredLoadingPatterns } from "./discover-routes";
import { officialMajorSectionCoveragePercent } from "../business-field-catalog/isic-major-sections";
import { countArabicAliases, countSearchableAliases } from "../business-field-catalog/search";
import { BUSINESS_FIELD_CATALOG } from "../business-field-catalog/fields";
import {
  clearAllClientScopedStorage,
  buildClientScopedStorageKey,
  CLIENT_SCOPED_STORAGE_VERSION,
  CLIENT_SCOPED_SCOPES,
} from "../client-state/scoped-storage";
import {
  clearRequestWizardDraft,
  loadRequestWizardDraft,
  saveRequestWizardDraft,
  REQUEST_WIZARD_DRAFT_SCHEMA_VERSION,
} from "../client-service-request/draft-storage";
import { buildDefaultRequestBrief } from "../client-service-request/constants";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

console.log("certification-release-readiness:test");

test("ACTIVE_ROUTE_INVENTORY_COMPLETE", () => {
  const { routes, brokenModules } = verifyRouteInventory();
  assert.ok(routes.length >= 140, `expected >=140 routes, got ${routes.length}`);
  assert.equal(brokenModules.length, 0, brokenModules.join(", "));
});

test("MISSING_REQUIRED_LOADING_STATE_COUNT=0", () => {
  const { missingLoading } = verifyRouteInventory();
  assert.equal(
    missingLoading.length,
    0,
    `missing loading: ${missingLoading.join(", ")}`
  );
  assert.ok(requiredLoadingPatterns().length >= 20);
});

test("FIELD_CATALOG_AUDIT_COMPLETE", () => {
  assert.ok(BUSINESS_FIELD_CATALOG.length >= 115);
  assert.equal(officialMajorSectionCoveragePercent(), 100);
  assert.ok(countSearchableAliases() >= 400);
  assert.ok(countArabicAliases() >= 100);
});

test("USER_SCOPED_CACHE_KEYS", () => {
  assert.ok(CLIENT_SCOPED_STORAGE_VERSION.includes("v1"));
  const a = buildClientScopedStorageKey(CLIENT_SCOPED_SCOPES.REQUEST_WIZARD_DRAFT, "account-a");
  const b = buildClientScopedStorageKey(CLIENT_SCOPED_SCOPES.REQUEST_WIZARD_DRAFT, "account-b");
  assert.notEqual(a, b);
});

test("REQUEST_DRAFT_RECOVERY round-trip", () => {
  const local = new Map<string, string>();
  (globalThis as { localStorage?: Storage }).localStorage = {
    getItem: (k: string) => local.get(k) ?? null,
    setItem: (k: string, v: string) => {
      local.set(k, v);
    },
    removeItem: (k: string) => {
      local.delete(k);
    },
    clear: () => local.clear(),
    key: (i: number) => [...local.keys()][i] ?? null,
    get length() {
      return local.size;
    },
  } as Storage;

  const scope = "scope-a";
  saveRequestWizardDraft(scope, {
    step: "field",
    brief: buildDefaultRequestBrief({ primaryBusinessFieldKey: "software_company" }),
  });
  const loaded = loadRequestWizardDraft(scope);
  assert.ok(loaded);
  assert.equal(loaded.schemaVersion, REQUEST_WIZARD_DRAFT_SCHEMA_VERSION);
  clearRequestWizardDraft(scope);
  assert.equal(loadRequestWizardDraft(scope), null);
  local.set(buildClientScopedStorageKey(CLIENT_SCOPED_SCOPES.REQUEST_WIZARD_DRAFT, scope), "{}");
  clearAllClientScopedStorage();
  assert.equal(local.size, 0);
});

test("certification environment label exists", () => {
  const src = readFileSync(
    join(process.cwd(), "src/components/public/certification-environment-label.tsx"),
    "utf8"
  );
  assert.ok(src.includes("FTGP_CERTIFICATION"));
});

test("iPad touch and wizard shell CSS", () => {
  const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
  assert.ok(css.includes("min-h-[44px]"));
  assert.ok(css.includes("cc-wizard-actions"));
  assert.ok(css.includes("env(safe-area-inset-bottom"));
});

test("custom field fallback always visible", () => {
  const src = readFileSync(
    join(process.cwd(), "src/components/client-enterprise-design/business-field-finder.tsx"),
    "utf8"
  );
  assert.ok(src.includes("I cannot find my business"));
});

test("sign-out clears scoped client storage", () => {
  const src = readFileSync(
    join(process.cwd(), "src/components/auth/sign-out-button.tsx"),
    "utf8"
  );
  assert.ok(src.includes("clearAllClientScopedStorage"));
});

test("repository HEAD available", () => {
  const head = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  assert.match(head, /^[0-9a-f]{40}$/);
});

console.log("certification-release-readiness:test PASS");
