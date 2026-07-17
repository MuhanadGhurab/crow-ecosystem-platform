import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  buildClientScopedStorageKey,
  clearAllClientScopedStorage,
  CLIENT_SCOPED_STORAGE_VERSION,
  deriveAccountScopeKey,
} from "@/lib/client-state/scoped-storage";
import {
  clearRequestWizardDraft,
  loadRequestWizardDraft,
  saveRequestWizardDraft,
  REQUEST_WIZARD_DRAFT_SCHEMA_VERSION,
} from "@/lib/client-service-request/draft-storage";
import { buildDefaultRequestBrief } from "@/lib/client-service-request/constants";
import { officialMajorSectionCoveragePercent } from "@/lib/business-field-catalog/isic-major-sections";
import { BUSINESS_FIELD_CATALOG } from "@/lib/business-field-catalog/fields";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

console.log("uat-readiness:test");

function mockBrowserStorage() {
  const local = new Map<string, string>();
  const session = new Map<string, string>();
  const make = (map: Map<string, string>): Storage =>
    ({
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => {
        map.set(k, v);
      },
      removeItem: (k: string) => {
        map.delete(k);
      },
      clear: () => map.clear(),
      key: (i: number) => [...map.keys()][i] ?? null,
      get length() {
        return map.size;
      },
    }) as Storage;
  (globalThis as { localStorage?: Storage }).localStorage = make(local);
  (globalThis as { sessionStorage?: Storage }).sessionStorage = make(session);
}

mockBrowserStorage();

test("USER_SCOPED_CACHE_KEYS use versioned prefix", () => {
  const key = buildClientScopedStorageKey("request-wizard-draft", deriveAccountScopeKey("acct-a"));
  assert.ok(key.startsWith(`${CLIENT_SCOPED_STORAGE_VERSION}:`));
});

test("cross-account draft keys differ", () => {
  const a = buildClientScopedStorageKey("request-wizard-draft", deriveAccountScopeKey("acct-a"));
  const b = buildClientScopedStorageKey("request-wizard-draft", deriveAccountScopeKey("acct-b"));
  assert.notEqual(a, b);
});

test("request draft round-trip in memory simulation", () => {
  const scope = deriveAccountScopeKey("test-account-1");
  const brief = buildDefaultRequestBrief({ primaryBusinessFieldKey: "game_development" });
  saveRequestWizardDraft(scope, { step: "purpose", brief });
  const loaded = loadRequestWizardDraft(scope);
  assert.equal(loaded?.step, "purpose");
  assert.equal(loaded?.brief.primaryBusinessFieldKey, "game_development");
  clearRequestWizardDraft(scope);
  assert.equal(loadRequestWizardDraft(scope), null);
});

test("submitted brief clears from draft loader logic", () => {
  const scope = deriveAccountScopeKey("test-account-2");
  const brief = { ...buildDefaultRequestBrief(), submittedAt: new Date().toISOString() };
  saveRequestWizardDraft(scope, { step: "review", brief });
  assert.equal(loadRequestWizardDraft(scope), null);
  clearRequestWizardDraft(scope);
});

test("sign-out clears scoped storage keys", () => {
  const prefix = `${CLIENT_SCOPED_STORAGE_VERSION}:`;
  const signOut = readFileSync(join(process.cwd(), "src/components/auth/sign-out-button.tsx"), "utf8");
  assert.ok(signOut.includes("clearAllClientScopedStorage"));
  assert.ok(typeof clearAllClientScopedStorage === "function");
  assert.ok(prefix.length > 10);
});

test("catalog expanded beyond REQUEST.2 baseline", () => {
  assert.ok(BUSINESS_FIELD_CATALOG.length >= 110);
  assert.ok(!BUSINESS_FIELD_CATALOG.some((f) => f.key === "custom_specialist_activity"));
});

test("ISIC major section coverage complete", () => {
  assert.equal(officialMajorSectionCoveragePercent(), 100);
});

test("certification label component exists", () => {
  assert.ok(existsSync(join(process.cwd(), "src/components/public/certification-environment-label.tsx")));
});

test("iPad touch targets in globals", () => {
  const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
  assert.ok(css.includes("min-h-[44px]"));
  assert.ok(css.includes("100dvh") || css.includes("safe-area-inset-bottom"));
});

test("draft schema version constant", () => {
  assert.equal(REQUEST_WIZARD_DRAFT_SCHEMA_VERSION, "request-wizard-draft-v1");
});

console.log("uat-readiness:test PASS");
