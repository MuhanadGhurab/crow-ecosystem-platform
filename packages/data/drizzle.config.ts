import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.GHURAVIA_DATABASE_URL ??
      "postgresql://localhost/ghuravia_local_unconfigured",
  },
});
