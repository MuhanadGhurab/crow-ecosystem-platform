import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

const FORBIDDEN_PUBLIC_AUTH_PHRASES = [
  "Microsoft Entra ID",
  "Microsoft SSO",
  "Entra SSO",
  "Entra ID",
  "Azure AD",
  "Enterprise sign-in",
  "SignInWithEntra",
  "EntraOpsPanel",
  "organization administrator",
  "IT administrator",
] as const;

const PUBLIC_AUTH_FILES = [
  "src/app/login/page.tsx",
  "src/app/signup/page.tsx",
  "src/components/portal/auth/sign-in-form.tsx",
  "src/components/portal/auth/sign-up-form.tsx",
  "src/app/auth/resolving/page.tsx",
  "src/components/auth/crow-post-auth-resolver.tsx",
  "src/components/auth/auth-back-navigation.tsx",
] as const;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

console.log("auth-public-ui:test");

for (const rel of PUBLIC_AUTH_FILES) {
  test(`${rel} exists`, () => {
    assert.ok(readFileSync(join(ROOT, rel), "utf8").length > 0);
  });
}

test("/login does not render Microsoft or Entra guidance", () => {
  const src = readFileSync(join(ROOT, "src/app/login/page.tsx"), "utf8");
  for (const phrase of FORBIDDEN_PUBLIC_AUTH_PHRASES) {
    assert.ok(!src.includes(phrase), `login page must not include "${phrase}"`);
  }
});

test("/signup does not render Microsoft or Entra guidance", () => {
  const src = readFileSync(join(ROOT, "src/app/signup/page.tsx"), "utf8");
  for (const phrase of FORBIDDEN_PUBLIC_AUTH_PHRASES) {
    assert.ok(!src.includes(phrase), `signup page must not include "${phrase}"`);
  }
});

test("sign-in form keeps Google and email controls", () => {
  const src = readFileSync(join(ROOT, "src/components/portal/auth/sign-in-form.tsx"), "utf8");
  assert.ok(src.includes("SignInWithGoogle"));
  assert.ok(src.includes("Sign in with email"));
  assert.ok(!src.includes("SignInWithEntra"));
});

test("sign-up form keeps Google registration path", () => {
  const src = readFileSync(join(ROOT, "src/components/portal/auth/sign-up-form.tsx"), "utf8");
  assert.ok(src.includes("SignInWithGoogle"));
  assert.ok(!src.includes("SignInWithEntra"));
});

test("Back to Home navigation remains on login and signup", () => {
  const login = readFileSync(join(ROOT, "src/app/login/page.tsx"), "utf8");
  const signup = readFileSync(join(ROOT, "src/app/signup/page.tsx"), "utf8");
  assert.ok(login.includes("AuthBackNavigation"));
  assert.ok(signup.includes("AuthBackNavigation"));
});

test("enterprise Entra panel preserved for tenant settings", () => {
  const src = readFileSync(join(ROOT, "src/app/[tenant]/settings/page.tsx"), "utf8");
  assert.ok(src.includes("EntraOpsPanel"));
});

console.log("auth-public-ui:test PASS");
