# Crow Ecosystem — Windows demo launcher (port 3000 only)
# Frees port 3000, starts dev, opens demo URL. Stop with Ctrl+C or npm run demo:stop

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$EnvFile = Join-Path $Root ".env"
$BaseUrl = "http://localhost:3000"
$DemoUrl = "$BaseUrl/admin/requests/mock-req-001"

function Stop-Port3000 {
    $conns = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
        Where-Object { $_.State -eq "Listen" }
    foreach ($c in $conns) {
        $procId = $c.OwningProcess
        if ($procId) {
            Write-Host "[demo] Stopping process on port 3000 (PID $procId)"
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        }
    }
    Start-Sleep -Seconds 1
}

function Ensure-DemoEnv {
    $required = @{
        "AUTH_DISABLED" = "true"
        "USE_MOCK_DATA"   = "true"
    }
    $lines = @()
    if (Test-Path $EnvFile) {
        $lines = Get-Content $EnvFile
    } else {
        Write-Host "[demo] Warning: .env missing — copy .env.example to .env"
        if (Test-Path (Join-Path $Root ".env.example")) {
            Copy-Item (Join-Path $Root ".env.example") $EnvFile
            $lines = Get-Content $EnvFile
        }
    }
    $map = @{}
    foreach ($line in $lines) {
        if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
            $map[$Matches[1]] = $Matches[2].Trim().Trim('"')
        }
    }
    $missing = @()
    foreach ($key in $required.Keys) {
        if ($map[$key] -ne $required[$key]) {
            $missing += $key
        }
    }
    if ($missing.Count -gt 0) {
        Write-Host "[demo] Warning: .env should set: $($missing -join ', ')=true"
    } else {
        Write-Host "[demo] .env OK (AUTH_DISABLED + USE_MOCK_DATA)"
    }
}

function Wait-Health {
    $deadline = (Get-Date).AddSeconds(60)
    while ((Get-Date) -lt $deadline) {
        try {
            $r = Invoke-WebRequest -Uri "$BaseUrl/api/health" -UseBasicParsing -TimeoutSec 5
            if ($r.StatusCode -eq 200) {
                $json = $r.Content | ConvertFrom-Json
                if ($json.ok) { return $true }
            }
        } catch { }
        Start-Sleep -Seconds 1.5
    }
    return $false
}

Stop-Port3000
Ensure-DemoEnv

Write-Host "[demo] Starting npm run dev (background job)…"
$job = Start-Job -ScriptBlock {
    Set-Location $using:Root
    npm run dev 2>&1
}

Start-Sleep -Seconds 2

if (-not (Wait-Health)) {
    Write-Host "[demo] Health check failed after 60s"
    Stop-Job $job -ErrorAction SilentlyContinue
    Remove-Job $job -Force -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "[demo] Server ready"
Write-Host "[demo] App: $DemoUrl"
Write-Host "[demo] Stop: npm run demo:stop (or Ctrl+C)"

Start-Process $DemoUrl

Write-Host "[demo] Streaming dev logs…"

try {
    Receive-Job $job -Wait
} finally {
    Stop-Job $job -ErrorAction SilentlyContinue
    Remove-Job $job -Force -ErrorAction SilentlyContinue
}
