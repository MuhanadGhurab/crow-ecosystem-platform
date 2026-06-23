import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  resolveClientOnlyLifecycleDestinationFromRequests,
} from "@/lib/auth/client-only-lifecycle-routing";
import { routes } from "@/lib/routes";

const root = process.cwd();

function readSrc(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

test("client-only single UNDER_DISCOVERY request routes to discovery", () => {
  const dest = resolveClientOnlyLifecycleDestinationFromRequests([
    {
      id: "req-07",
      status: "UNDER_DISCOVERY",
      discoveryProfile: { status: "IN_PROGRESS" },
    },
  ]);
  assert.equal(dest, routes.client.requestDiscovery("req-07"));
});

test("client-only multiple requests routes to request list", () => {
  const dest = resolveClientOnlyLifecycleDestinationFromRequests([
    { id: "a", status: "UNDER_DISCOVERY", discoveryProfile: { status: "IN_PROGRESS" } },
    { id: "b", status: "SUBMITTED", discoveryProfile: null },
  ]);
  assert.equal(dest, routes.client.requests);
});

test("client-only no requests routes to account home", () => {
  const dest = resolveClientOnlyLifecycleDestinationFromRequests([]);
  assert.equal(dest, routes.account.home);
});

test("client-only single non-discovery request routes to request detail", () => {
  const dest = resolveClientOnlyLifecycleDestinationFromRequests([
    { id: "req-1", status: "APPROVED", discoveryProfile: { status: "COMPLETED" } },
  ]);
  assert.equal(dest, routes.client.request("req-1"));
});

test("runtime does not read operator email file", () => {
  const landing = readSrc("src/lib/auth/client-only-lifecycle-landing.ts");
  const postAuth = readSrc("src/lib/auth/c3-post-auth-landing.ts");
  const access = readSrc("src/app/access/page.tsx");
  for (const src of [landing, postAuth, access]) {
    assert.equal(src.includes(".env.ftgp-first-client.operator"), false);
    assert.equal(src.includes("FTGP_FIRST_CLIENT_EMAIL"), false);
  }
});

test("access page redirects client-only scope before gateway render", () => {
  const access = readSrc("src/app/access/page.tsx");
  assert.match(access, /isAuthoritativeClientOnlyScope/);
  assert.match(access, /resolveClientOnlyLifecycleDestination/);
  assert.match(access, /redirect\(/);
  const gatewayIdx = access.indexOf("<PortalAccessGateway");
  const redirectIdx = access.indexOf("redirect(");
  assert.ok(redirectIdx > 0 && redirectIdx < gatewayIdx);
});

test("post-auth landing uses lifecycle destination for client-only scope", () => {
  const postAuth = readSrc("src/lib/auth/c3-post-auth-landing.ts");
  assert.match(postAuth, /isAuthoritativeClientOnlyScope/);
  assert.match(postAuth, /resolveClientOnlyLifecycleDestination/);
});

test("ownership transfer service uses submittedByUserId only", () => {
  const svc = readSrc("src/lib/ftgp/ftgp-first-client-ownership-transfer.service.ts");
  assert.match(svc, /submittedByUserId/);
  assert.equal(svc.includes("crow_role"), false);
  assert.equal(svc.includes("FTGP_FIRST_CLIENT_EMAIL"), false);
});

test("operator tooling is scripts-only", () => {
  const designate = readSrc("scripts/designate-ftgp-first-client.ts");
  assert.match(designate, /zero writes/i);
  const operator = readSrc("scripts/lib/ftgp-first-client-operator.ts");
  assert.match(operator, /FTGP_FIRST_CLIENT_OPERATOR_ENV/);
});

test("fingerprint helpers are stable length in transfer service", () => {
  const svc = readSrc("src/lib/ftgp/ftgp-first-client-ownership-transfer.service.ts");
  assert.match(svc, /ownerFingerprint/);
  assert.match(svc, /slice\(0, 16\)/);
});

test("isAuthoritativeClientOnlyScope lives in server landing module", () => {
  const landing = readSrc("src/lib/auth/client-only-lifecycle-landing.ts");
  assert.match(landing, /isAuthoritativeClientOnlyScope/);
});
