# Push prisma/schema.prisma to local PostgreSQL (crow_ecosystem @ localhost:5432).
# Does NOT run seed — use: npm run db:seed
#
# First-time setup:
#   $env:CROW_LOCAL_PG_PASSWORD = "your-postgres-password"
#   npm run db:push:local
#
# Or edit the fallback below (do not commit real passwords).

$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

$password = if ($env:CROW_LOCAL_PG_PASSWORD) { $env:CROW_LOCAL_PG_PASSWORD } else { "YOUR_PASSWORD" }
if ($password -eq "YOUR_PASSWORD") {
    Write-Host ""
    Write-Host "Set your local postgres password first:" -ForegroundColor Yellow
    Write-Host '  $env:CROW_LOCAL_PG_PASSWORD = "your-password"' -ForegroundColor Cyan
    Write-Host "  npm run db:push:local" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or copy the local block from .env.example into .env and run: npm run db:push" -ForegroundColor Yellow
    exit 1
}

$localUrl = "postgresql://postgres:${password}@localhost:5432/crow_ecosystem?schema=public"
$env:DATABASE_URL = $localUrl
$env:DIRECT_URL = $localUrl

Write-Host "Target: localhost:5432 / crow_ecosystem (Prisma uses DIRECT_URL for db push)" -ForegroundColor Green
Write-Host ""

npx prisma validate
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

npx prisma db push
exit $LASTEXITCODE
