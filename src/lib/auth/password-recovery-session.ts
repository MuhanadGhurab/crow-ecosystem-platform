import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const PASSWORD_RECOVERY_COOKIE = "crow_password_recovery";

const RECOVERY_COOKIE_MAX_AGE_SEC = 15 * 60;

export function passwordRecoveryCookieOptions(secure: boolean): ResponseCookie {
  return {
    name: PASSWORD_RECOVERY_COOKIE,
    value: "1",
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: RECOVERY_COOKIE_MAX_AGE_SEC,
  };
}

export function clearPasswordRecoveryCookieOptions(secure: boolean): ResponseCookie {
  return {
    name: PASSWORD_RECOVERY_COOKIE,
    value: "",
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  };
}

export const PASSWORD_RECOVERY_NEXT_PATH = "/reset-password";

export function isPasswordRecoveryNextPath(raw: string | null | undefined): boolean {
  return raw?.trim() === PASSWORD_RECOVERY_NEXT_PATH;
}
