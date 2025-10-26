param([int]$Port = 3000)
$base = "http://localhost:$Port"

function Get-Json {
  param([string]$url)
  try {
    (Invoke-WebRequest -Uri $url -UseBasicParsing -Headers @{Accept="application/json"} -TimeoutSec 10).Content | ConvertFrom-Json
  } catch {
    Write-Host "GET $url failed: $($_.Exception.Message)"
    return $null
  }
}

function Post-Json {
  param([string]$url, [hashtable]$obj)
  try {
    $json = $obj | ConvertTo-Json -Depth 5
    $r = Invoke-WebRequest -Uri $url -Method Post -ContentType "application/json" -Body $json -UseBasicParsing -TimeoutSec 10
    return [pscustomobject]@{ Ok = $true; StatusCode = $r.StatusCode; Content = $r.Content }
  } catch {
    return [pscustomobject]@{ Ok = $false; StatusCode = $null; Content = $_.Exception.Message }
  }
}

Write-Host "Testing $base ..."
$ok = $true

foreach ($path in @("/", "/new-note", "/notes")) {
  try {
    $r = Invoke-WebRequest -Uri ($base + $path) -UseBasicParsing -TimeoutSec 10
    if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 400) {
      Write-Host "OK $path $($r.StatusCode)"
    } else {
      $ok = $false
      Write-Host "WARN $path $($r.StatusCode)"
    }
  } catch {
    $ok = $false
    Write-Host "GET $path failed: $($_.Exception.Message)"
  }
}

$notes = Get-Json "$base/api/notes"
if ($notes -eq $null) {
  $ok = $false
} else {
  Write-Host "/api/notes returned $($notes.Count) item(s)"
}

$title = "smoke-" + [guid]::NewGuid().ToString("N").Substring(0,8)
$body  = "test from smoke"
$post  = Post-Json "$base/api/notes/new" @{ title=$title; body=$body }

if (-not $post.Ok) {
  $ok = $false
  Write-Host "POST /api/notes/new failed: $($post.Content)"
} else {
  Write-Host "POST /api/notes/new => $($post.StatusCode)"
  $found = $false
  for ($i=1; $i -le 20; $i++) {
    Start-Sleep -Milliseconds (200 * $i)
    $notes2 = Get-Json "$base/api/notes"
    if ($notes2 -ne $null -and ($notes2 | Where-Object { $_.title -eq $title })) {
      $found = $true
      break
    }
  }
  if ($found) { Write-Host "Created note found" } else { $ok = $false; Write-Host "Created note NOT found after retries" }
}

if ($ok) { Write-Host "Smoke test PASSED"; exit 0 } else { Write-Host "Smoke test FAILED"; exit 1 }
