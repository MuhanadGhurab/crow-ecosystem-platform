import { NextRequest, NextResponse } from "next/server";
import { supabaseAuthCookieBaseName } from "./auth-cookie-names";
import { clearStaleSupabaseAuthCookies, createRouteHandlerCookieAdapter, stripSupabaseAuthCookiesFromRequest } from "./route-handler";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const request = new NextRequest("https://preview.example.com/login/submit", {
  method: "POST",
});
const response = NextResponse.redirect(new URL("/account", request.url), 303);
const adapter = createRouteHandlerCookieAdapter(request, response);

adapter.setAll([
  {
    name: "sb-example-auth-token",
    value: "redacted-not-asserted",
    options: { path: "/", secure: true, sameSite: "lax" },
  },
  {
    name: "sb-example-auth-token.0",
    value: "redacted-not-asserted",
    options: { path: "/", secure: true, sameSite: "lax" },
  },
]);

const responseCookieNames = response.cookies.getAll().map((cookie) => cookie.name);
assert(
  responseCookieNames.includes("sb-example-auth-token"),
  "adapter writes auth cookie name to response"
);
assert(
  responseCookieNames.includes("sb-example-auth-token.0"),
  "adapter writes chunked auth cookie name to response"
);

const serialized = response.headers.getSetCookie();
assert(
  serialized.some((header) => header.startsWith("sb-example-auth-token=")),
  "redirect response exposes Set-Cookie for auth token"
);
assert(
  serialized.some((header) => header.includes("Secure")),
  "HTTPS adapter marks auth cookies Secure"
);

const base = supabaseAuthCookieBaseName();
const staleRequest = new NextRequest("https://preview.example.com/login/submit", {
  method: "POST",
  headers: {
    cookie: `${base}=stale; ${base}.0=stale-chunk`,
  },
});
const staleResponse = NextResponse.redirect(new URL("/account", staleRequest.url), 303);
const cleared = clearStaleSupabaseAuthCookies(staleRequest, staleResponse);
assert(cleared.includes(base), "clears base auth cookie name");
assert(cleared.includes(`${base}.0`), "clears chunked auth cookie name");

const freshAdapter = createRouteHandlerCookieAdapter(staleRequest, staleResponse);
freshAdapter.setAll([
  {
    name: base,
    value: "redacted-not-asserted",
    options: { path: "/", secure: true, sameSite: "lax" },
  },
]);
assert(
  staleResponse.cookies.getAll().some((cookie) => cookie.name === base),
  "new session cookie written after stale clear"
);

const stripRequest = new NextRequest("https://preview.example.com/login/submit", {
  method: "POST",
  headers: { cookie: `${base}=stale; ${base}.0=stale-chunk` },
});
const stripped = stripSupabaseAuthCookiesFromRequest(stripRequest);
assert(stripped.includes(base), "strip removes base auth cookie from request");
assert(stripped.includes(`${base}.0`), "strip removes chunked auth cookie from request");
assert(
  stripRequest.cookies.getAll().every((cookie) => cookie.value === ""),
  "stripped request cookies are empty"
);

console.log("route-handler.test.ts: OK");
