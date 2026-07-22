import test from "node:test";
import assert from "node:assert/strict";
import { mapServiceError } from "../lib/http.js";

test("HTTP error mapping for activation categories", async () => {
  const cases: Array<[string, number, string]> = [
    ["CONFLICT", 409, "CONFLICT"],
    ["IDEMPOTENCY_CONFLICT", 409, "IDEMPOTENCY_CONFLICT"],
    ["INVALID_TRANSITION", 409, "INVALID_TRANSITION"],
    ["CHALLENGE_EXPIRED", 410, "CHALLENGE_EXPIRED"],
    ["NOT_FOUND", 404, "NOT_FOUND"],
    ["UNAUTHORIZED", 401, "UNAUTHORIZED"],
    ["FORBIDDEN", 403, "FORBIDDEN"],
    ["LOCAL_RUNTIME_ONLY", 403, "LOCAL_RUNTIME_ONLY"],
    ["CATALOGUE_VERSION_CONFLICT", 409, "CATALOGUE_VERSION_CONFLICT"],
    ["ORIGIN_SCHEMA_CONFLICT", 409, "ORIGIN_SCHEMA_CONFLICT"],
  ];
  for (const [name, status, category] of cases) {
    const err = new Error(name);
    err.name = name;
    const res = mapServiceError(err);
    assert.equal(res.status, status);
    const body = await res.json();
    assert.equal(body.category, category);
  }
});

test("unknown errors fail closed as INTERNAL_ERROR", async () => {
  const res = mapServiceError(new Error("surprise"));
  assert.equal(res.status, 500);
  const body = await res.json();
  assert.equal(body.category, "INTERNAL_ERROR");
});
