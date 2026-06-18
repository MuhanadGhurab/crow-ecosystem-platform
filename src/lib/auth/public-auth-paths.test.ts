import { readFileSync } from "fs";
import { join } from "path";
import {
  isAuthEntryPath,
  isProtectedSelfServicePath,
  isStartupLoaderBypassPath,
} from "./public-auth-paths";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const routeProtection = readFileSync(
  join(process.cwd(), "src/lib/auth/route-protection.ts"),
  "utf8"
);
const middleware = readFileSync(
  join(process.cwd(), "src/lib/supabase/middleware.ts"),
  "utf8"
);
const accountLayout = readFileSync(
  join(process.cwd(), "src/app/account/layout.tsx"),
  "utf8"
);

assert(isAuthEntryPath("/login"), "/login is auth entry");
assert(isAuthEntryPath("/signup"), "/signup is auth entry");
assert(isAuthEntryPath("/register/legal"), "/register/legal is auth entry");
assert(isAuthEntryPath("/verify-email"), "/verify-email is auth entry");
assert(!isAuthEntryPath("/account"), "/account is not auth entry");

assert(isStartupLoaderBypassPath("/login"), "loader bypass includes login");
assert(isStartupLoaderBypassPath("/account"), "loader bypass includes account");
assert(isStartupLoaderBypassPath("/account/profile"), "loader bypass includes account child");

assert(isProtectedSelfServicePath("/account"), "/account is protected self-service");
assert(isProtectedSelfServicePath("/account/profile"), "/account/profile is protected");
assert(!isProtectedSelfServicePath("/login"), "/login is not self-service");

assert(
  routeProtection.includes("isC3SessionOnlyPath") &&
    routeProtection.includes("isAccountSelfServicePath"),
  "route-protection defines C3 session-only account paths"
);
assert(
  middleware.includes("isC3SessionOnlyPath") && middleware.includes("redirectToLogin"),
  "middleware requires session for C3 session-only paths"
);
assert(
  accountLayout.includes("requireActivePlatformAccount"),
  "/account layout requires ACTIVE platform account"
);

console.log("public-auth-paths.test.ts: OK");
