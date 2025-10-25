param([int]$MaxWait = 90)

$proj = "C:\Users\chris\dev\mysite"
Set-Location $proj

# Clean start
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force .\.next -ErrorAction SilentlyContinue | Out-Null

# Ensure deps & prisma client, then build
if (-not (Test-Path ".\node_modules")) { npm install }
npx prisma generate --schema .\prisma\schema.prisma | Out-Null
npm run build

# Start prod in a new terminal
Start-Process powershell -ArgumentList "-NoLogo","-NoExit","-Command","cd `"$proj`"; npm start"

# Wait for server on 3000
$up = $false
$sw = [Diagnostics.Stopwatch]::StartNew()
while ($sw.Elapsed.TotalSeconds -lt $MaxWait -and -not $up) {
  try {
    $r = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2
    if ($r.StatusCode -ge 200) { $up = $true; break }
  } catch {}
  Start-Sleep -Milliseconds 600
}
$sw.Stop()

if ($up) {
  Write-Host "✅ Production server is up at http://localhost:3000"
  Start-Process "http://localhost:3000"
  Start-Process "http://localhost:3000/notes"
} else {
  Write-Host "❌ Production server did not start within $MaxWait seconds."
}
