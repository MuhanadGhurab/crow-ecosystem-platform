import {
  type C3RegistrationErrorCode,
  userMessageForRegistrationError,
} from "@/lib/account/c3-registration-errors";

export function resolveRegistrationErrorDisplay(input: {
  error?: string;
  message?: string;
  ref?: string;
}): { body: string; isAlert: boolean } | null {
  const ref = input.ref?.trim();
  const code = input.error?.trim() as C3RegistrationErrorCode | undefined;

  if (input.message?.trim()) {
    const body = ref ? `${input.message.trim()}\n\nSupport reference: ${ref}` : input.message.trim();
    return { body, isAlert: code === "registration_already_pending" ? false : true };
  }

  if (code) {
    return {
      body: userMessageForRegistrationError(code, ref),
      isAlert: code !== "registration_already_pending",
    };
  }

  return null;
}
