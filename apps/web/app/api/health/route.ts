import { NextResponse } from "next/server";
import { HealthResponse } from "@ghuravia/contracts/schemas";
export function GET() {
  const body = HealthResponse.parse({
    status: "ok",
    version: process.env.GHURAVIA_APP_VERSION ?? "0.1.0",
    runtimeMode: process.env.GHURAVIA_RUNTIME_MODE ?? "local_development",
    dbConnectivityCategory: "not_configured",
    migrationStatusCategory: "unknown",
    workerStatusCategory: "idle",
  });
  return NextResponse.json(body);
}
