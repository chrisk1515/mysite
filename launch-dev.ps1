param([int]$MaxWait = 60)

$proj = "C:\Users\chris\dev\mysite"
Set-Location $proj

# Clean up common issues
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force .\.next -ErrorAction SilentlyContinue | Out-Null

# Ensure deps & prisma client (safe to run repeatedly)
if (-not (Test-Path ".\node_modules")) { npm install }
npx prisma generate --schema .\prisma\schema.prisma | Out-Null

# Start dev in a new window
Start-Process powershell -ArgumentList "-NoLogo","-NoExit","-Command","cd `"$proj`"; npm run dev"

# Wait for server to come up on 3000 or 3001
$urls = @("http://localhost:3000","http://localhost:3001")
$upUrl = $null
$sw = [Diagnostics.Stopwatch]::StartNew()
while ($sw.Elapsed.TotalSeconds -lt $MaxWait -and -not $upUrl) {
  foreach ($u in $urls) {
    try {
      $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 2
      if ($r.StatusCode -ge 200) { $upUrl = $u; break }
    } catch {}
  }
  Start-Sleep -Milliseconds 500
}
$sw.Stop()

if ($upUrl) {
  Write-Host "✅ Next.js is up at $upUrl"
  Start-Process "$upUrl"
  Start-Process "$upUrl/new-note"
  Start-Process "$upUrl/notes"
} else {
  Write-Host "❌ Server did not start within $MaxWait seconds."
}
