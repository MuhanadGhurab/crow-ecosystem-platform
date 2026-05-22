# Stop demo/dev server — free port 3000 only

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

function Stop-Port3000 {
    $conns = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
        Where-Object { $_.State -eq "Listen" }
    foreach ($c in $conns) {
        $procId = $c.OwningProcess
        if ($procId) {
            Write-Host "[demo:stop] Stopping PID $procId on port 3000"
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        }
    }
}

Stop-Port3000
Write-Host "[demo:stop] Done"
