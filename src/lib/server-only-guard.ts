/**
 * Enforces Next.js server boundary unless CYBERCROW_SCRIPT_PRISMA=1 (CLI seeds/scripts).
 */
if (process.env.CYBERCROW_SCRIPT_PRISMA !== "1") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("server-only");
}
