import assert from "node:assert/strict";

import { BUSINESS_FIELD_CATEGORIES } from "./categories";
import { BUSINESS_FIELD_CATALOG, FIELD_BY_KEY } from "./fields";
import {
  buildBusinessFieldSearchIndex,
  countArabicAliases,
  countSearchableAliases,
  resetBusinessFieldSearchIndexCache,
  searchBusinessFields,
  suggestMatchesForCustomDescription,
} from "./search";
import { CROSSWALK_REGISTRY, TAXONOMY_SOURCES } from "./crosswalk";
import { officialMajorSectionCoveragePercent } from "./isic-major-sections";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

console.log("business-field-catalog:test");

test("all broad categories represented", () => {
  assert.ok(BUSINESS_FIELD_CATEGORIES.length >= 38);
  const covered = new Set(BUSINESS_FIELD_CATALOG.map((f) => f.categoryKey));
  for (const cat of BUSINESS_FIELD_CATEGORIES) {
    if (cat.key === "other_specialist_services") continue;
    assert.ok(covered.has(cat.key), `missing field for category ${cat.key}`);
  }
});

test("keys unique", () => {
  const keys = BUSINESS_FIELD_CATALOG.map((f) => f.key);
  assert.equal(keys.length, new Set(keys).size);
});

test("parent-child references resolve", () => {
  for (const field of BUSINESS_FIELD_CATALOG) {
    if (field.parentFieldKey) {
      assert.ok(FIELD_BY_KEY.has(field.parentFieldKey), `missing parent ${field.parentFieldKey}`);
    }
    for (const child of field.childActivityKeys) {
      assert.ok(FIELD_BY_KEY.has(child), `missing child ${child}`);
    }
  }
});

test("official crosswalk metadata valid", () => {
  assert.ok(TAXONOMY_SOURCES.ssic.name.includes("SSIC"));
  assert.ok(TAXONOMY_SOURCES.isic.name.includes("ISIC"));
  for (const entry of CROSSWALK_REGISTRY) {
    assert.ok(FIELD_BY_KEY.has(entry.fieldKey), `crosswalk orphan ${entry.fieldKey}`);
  }
});

test("English search works", () => {
  const results = searchBusinessFields("construction company");
  assert.ok(results.some((r) => r.field.key === "general_contracting"));
});

test("Arabic alias search works where provided", () => {
  const results = searchBusinessFields("مقاول");
  assert.ok(results.length > 0);
});

test("minor misspelling search works", () => {
  const results = searchBusinessFields("contruction");
  assert.ok(results.some((r) => r.field.key === "general_contracting"));
});

test("aliases searchable", () => {
  assert.ok(countSearchableAliases() > 100);
  assert.ok(countArabicAliases() > 20);
});

test("custom-field fallback suggests matches", () => {
  const suggestions = suggestMatchesForCustomDescription("We build commercial buildings and manage site crews");
  assert.ok(suggestions.length > 0);
});

test("no retail fallback as only option for unrelated query", () => {
  const results = searchBusinessFields("veterinary clinic");
  assert.ok(results.some((r) => r.field.key === "veterinary_services"));
  assert.ok(!results.every((r) => r.field.key === "retail_store"));
});

test("hybrid fields supported via secondary selection model", () => {
  const construction = searchBusinessFields("construction")[0];
  const rental = searchBusinessFields("equipment rental")[0];
  assert.ok(construction && rental);
  assert.notEqual(construction.field.key, rental.field.key);
});

test("catalog index precomputes", () => {
  resetBusinessFieldSearchIndexCache();
  const index = buildBusinessFieldSearchIndex();
  assert.equal(index.length, BUSINESS_FIELD_CATALOG.length);
});

test("ISIC major section coverage", () => {
  assert.equal(officialMajorSectionCoveragePercent(), 100);
});

console.log("business-field-catalog:test PASS");
