/** C3 — server-side account registration feature gate. */
export function isAccountRegistrationEnabled(): boolean {
  return process.env.ACCOUNT_REGISTRATION_ENABLED === "true";
}
