# Paste into Vercel → Settings → Environment Variables (Production)
# Usage: powershell scripts/print-vercel-env-template.ps1
#        powershell scripts/print-vercel-env-template.ps1 -RegionHost "aws-0-me-central-1.pooler.supabase.com"

param(
  [string]$ProjectRef = "qnujbwfztmrmsvkugvot",  # NEW ref after Vercel → Storage → Create Supabase
  [string]$RegionHost = "aws-0-eu-central-1.pooler.supabase.com"  # REPLACE from Dashboard connection string
)

$ref = $ProjectRef

Write-Host "`n=== Vercel Production env ===`n" -ForegroundColor Cyan
Write-Host "1. Supabase → Project Settings → Database → Connection string (URI)" -ForegroundColor DarkGray
Write-Host "2. Copy Transaction + Session pooler; paste password (encode @ as %40)" -ForegroundColor DarkGray
Write-Host "3. Vercel → Settings → Environment Variables → Production`n" -ForegroundColor DarkGray

Write-Host "DATABASE_URL=postgresql://postgres.${ref}:YOUR_DB_PASSWORD@${RegionHost}:6543/postgres?pgbouncer=true"
Write-Host "DIRECT_URL=postgresql://postgres.${ref}:YOUR_DB_PASSWORD@${RegionHost}:5432/postgres"
Write-Host ""
Write-Host "NEXT_PUBLIC_SUPABASE_URL=https://${ref}.supabase.co"
Write-Host "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<copy from local .env>"
Write-Host "SUPABASE_SERVICE_ROLE_KEY=<copy from local .env — server only>"
Write-Host "NEXT_PUBLIC_SITE_URL=https://YOUR-PROJECT.vercel.app"
Write-Host "AZURE_SSO_ENABLED=true"
Write-Host "NEXT_PUBLIC_AZURE_TENANT_ID=<copy from local .env>"
Write-Host ""
Write-Host "Test build locally (after filling password):" -ForegroundColor Yellow
Write-Host '  $env:SIM_DATABASE_URL="postgresql://postgres.' + $ref + ':PASSWORD@' + $RegionHost + ':6543/postgres?pgbouncer=true"'
Write-Host '  $env:SIM_DIRECT_URL="postgresql://postgres.' + $ref + ':PASSWORD@' + $RegionHost + ':5432/postgres"'
Write-Host "  npm run simulate:vercel-build"
Write-Host ""
Write-Host "Do NOT set AUTH_DISABLED or USE_MOCK_DATA on Production`n" -ForegroundColor Yellow
Write-Host "Fresh Vercel integration: docs/SUPABASE_VERCEL_FRESH_PROJECT.md" -ForegroundColor DarkGray
Write-Host "Manual pooler paste:     docs/VERCEL_CONNECT.md`n" -ForegroundColor DarkGray
