import { PLATFORM_OWNER_FORBIDDEN_CREDENTIAL_ENV_KEYS } from "@/lib/platform/platform-owner-bootstrap.constants";

export type PlatformOwnerCredentialRefusal = "password_supplied_forbidden";

export function detectForbiddenPlatformOwnerCredentials(): PlatformOwnerCredentialRefusal | null {
  const checkEnvKeys = process.env.CYBERCROW_SCRIPT_PRISMA !== "1";
  if (checkEnvKeys) {
    for (const key of PLATFORM_OWNER_FORBIDDEN_CREDENTIAL_ENV_KEYS) {
      if (process.env[key]?.trim()) return "password_supplied_forbidden";
    }
  }
  for (const arg of process.argv) {
    if (/password/i.test(arg) && /=/.test(arg)) return "password_supplied_forbidden";
  }
  return null;
}
