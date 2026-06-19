import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerCookieAdapter } from "./route-handler";

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

console.log("route-handler.test.ts: OK");
