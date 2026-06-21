export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export type PasswordValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateNewPassword(
  password: string,
  confirmPassword: string
): PasswordValidationResult {
  if (!password || !confirmPassword) {
    return { ok: false, error: "Both password fields are required." };
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      ok: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    };
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return {
      ok: false,
      error: `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`,
    };
  }
  if (password !== confirmPassword) {
    return { ok: false, error: "Passwords do not match." };
  }
  return { ok: true };
}
