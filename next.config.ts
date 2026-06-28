import type { NextConfig } from "next";

/** Production builds: limit parallelism to stay within Node heap on 16 GB dev machines. */
const isVercelBuild = process.env.VERCEL === "1";
const isProductionBuild = process.env.NODE_ENV === "production" || process.argv.includes("build");
const lowMemoryBuild = isVercelBuild || isProductionBuild;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  serverExternalPackages: ["@prisma/client", "prisma"],
  experimental: {
    webpackMemoryOptimizations: true,
    serverSourceMaps: false,
    preloadEntriesOnStart: false,
    ...(lowMemoryBuild
      ? {
          cpus: 1,
          webpackBuildWorker: false,
          staticGenerationMaxConcurrency: 1,
        }
      : {}),
  },
  webpack: (config, { dev }) => {
    if (!dev && lowMemoryBuild) {
      config.cache = false;
      config.parallelism = 1;
    }
    return config;
  },
};

export default nextConfig;
