import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma skips auto .env loading when prisma.config.ts exists — load explicitly.
config();

/**
 * Prisma CLI config (replaces deprecated package.json#prisma).
 * Connection URLs stay in prisma/schema.prisma until Prisma 7 upgrade.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
