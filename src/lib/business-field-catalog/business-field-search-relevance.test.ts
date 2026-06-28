import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { BUSINESS_FIELD_CATALOG } from "./fields";
import { searchBusinessFields, countSearchableAliases, countArabicAliases, resetBusinessFieldSearchIndexCache } from "./search";
import { SEARCH_RELEVANCE_FIXTURES } from "./search-relevance-fixtures";
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

console.log("business-field-search-relevance:test");
resetBusinessFieldSearchIndexCache();

test("official major section coverage is complete", () => {
  assert.equal(officialMajorSectionCoveragePercent(), 100);
});

test("representative queries resolve expected fields", () => {
  for (const fixture of SEARCH_RELEVANCE_FIXTURES) {
    const results = searchBusinessFields(fixture.query, { limit: 8 });
    assert.ok(results.length > 0, `no results for "${fixture.query}"`);
    const topKeys = results.slice(0, 3).map((r) => r.field.key);
    const hit = fixture.expectedTopKeys.some((k) => topKeys.includes(k));
    assert.ok(hit, `"${fixture.query}" expected one of ${fixture.expectedTopKeys.join(", ")} in top 3, got ${topKeys.join(", ")}`);
    if (fixture.mustNotDominate) {
      const blocked = Array.isArray(fixture.mustNotDominate) ? fixture.mustNotDominate : [fixture.mustNotDominate];
      for (const key of blocked) {
        assert.notEqual(results[0]?.field.key, key, `"${fixture.query}" dominated by ${key}`);
      }
    }
  }
});

test("gaming studio does not rank retail first", () => {
  const results = searchBusinessFields("gaming studio");
  assert.equal(results[0]?.field.key, "game_development");
});

console.log("business-field-search-relevance:test PASS");
