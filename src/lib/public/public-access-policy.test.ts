import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { RESERVED_PATH_SEGMENTS, isPublicPath } from "@/lib/auth/route-protection";
import {
  GATED_CLIENT_PROCESS_PREFIXES,
  PUBLIC_BROWSE_PATHS,
  PUBLIC_RESERVED_SEGMENTS,
  isGatedClientProcessPath,
  isPublicBrowsePath,
} from "@/lib/public/public-access-policy";

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

console.log("public-access-policy:test");

test("canonical browse paths are public in middleware", () => {
  for (const path of PUBLIC_BROWSE_PATHS) {
    assert.equal(isPublicPath(path), true, `${path} must be public`);
    assert.equal(isPublicBrowsePath(path), true, `${path} browse policy`);
  }
});

test("platform and journey segments reserved from tenant slug detection", () => {
  for (const segment of PUBLIC_RESERVED_SEGMENTS) {
    assert.ok(RESERVED_PATH_SEGMENTS.has(segment), `missing reserved segment ${segment}`);
  }
  assert.equal(isPublicPath("/platform/cem"), true);
  assert.equal(isPublicPath("/how-crow-works"), true);
  assert.equal(isPublicPath("/new-organization"), true);
  assert.equal(isPublicPath("/start"), true);
});

test("client process paths are gated", () => {
  for (const prefix of GATED_CLIENT_PROCESS_PREFIXES) {
    assert.equal(isGatedClientProcessPath(prefix), true);
    assert.equal(isPublicBrowsePath(prefix), false);
  }
  assert.equal(isGatedClientProcessPath("/client/requests/new"), true);
  assert.equal(isGatedClientProcessPath("/discovery/abc"), true);
});

test("route-protection imports public access policy", () => {
  const rp = read("src/lib/auth/route-protection.ts");
  assert.ok(rp.includes("public-access-policy"));
});

test("request page is public with gated continue action", () => {
  const page = read("src/app/(public)/request/page.tsx");
  assert.ok(!page.includes("redirect(routes.auth"));
  assert.ok(page.includes("Public browsing is open"));
  assert.ok(page.includes("signupWithNext"));
});

test("start layout uses bright chrome without duplicate dark header", () => {
  const layout = read("src/app/start/layout.tsx");
  assert.ok(layout.includes("PublicSiteChrome"));
  assert.ok(!layout.includes("cc-starfield"));
  assert.ok(!layout.includes("PublicHeader"));
});

console.log("public-access-policy:test PASS");
