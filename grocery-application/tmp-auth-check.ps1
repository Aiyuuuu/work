$base = "http://localhost:3000"
$email = "qa_$([int](Get-Random -Maximum 999999))@example.com"
$pass = "P@ssw0rd123"
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$results = @()

try {
  Invoke-RestMethod -Method Post -Uri "$base/api/auth/login" -ContentType "application/json" -Body "{}" -WebSession $session | Out-Null
  $results += "missing-creds:unexpected-success"
} catch {
  $results += "missing-creds:$($_.Exception.Response.StatusCode.value__)"
}

try {
  $payload = @{ email = $email; password = $pass; mode = "signup" } | ConvertTo-Json
  $r = Invoke-RestMethod -Method Post -Uri "$base/api/auth/login" -ContentType "application/json" -Body $payload -WebSession $session
  $results += "signup:$($r.statusCode):$($r.isRequestSuccess)"
} catch {
  $results += "signup:$($_.Exception.Response.StatusCode.value__)"
}

try {
  $payload = @{ email = $email; password = "wrong"; mode = "login" } | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri "$base/api/auth/login" -ContentType "application/json" -Body $payload -WebSession $session | Out-Null
  $results += "login-wrong:unexpected-success"
} catch {
  $results += "login-wrong:$($_.Exception.Response.StatusCode.value__)"
}

try {
  $payload = @{ email = $email; password = $pass; mode = "login" } | ConvertTo-Json
  $r = Invoke-RestMethod -Method Post -Uri "$base/api/auth/login" -ContentType "application/json" -Body $payload -WebSession $session
  $results += "login-ok:$($r.statusCode):role=$($r.data.role)"
} catch {
  $results += "login-ok:$($_.Exception.Response.StatusCode.value__)"
}

try {
  Invoke-RestMethod -Method Put -Uri "$base/api/auth/RefreshToken" -ContentType "application/json" -Body "{}" | Out-Null
  $results += "refresh-missing:unexpected-success"
} catch {
  $results += "refresh-missing:$($_.Exception.Response.StatusCode.value__)"
}

try {
  $r = Invoke-RestMethod -Method Put -Uri "$base/api/auth/RefreshToken" -ContentType "application/json" -Body "{}" -WebSession $session
  $results += "refresh-ok:$($r.statusCode):role=$($r.data.role)"
} catch {
  $results += "refresh-ok:$($_.Exception.Response.StatusCode.value__)"
}

try {
  Invoke-RestMethod -Method Get -Uri "$base/api/cart" | Out-Null
  $results += "cart-unauth:unexpected-success"
} catch {
  $results += "cart-unauth:$($_.Exception.Response.StatusCode.value__)"
}

try {
  $r = Invoke-RestMethod -Method Get -Uri "$base/api/cart" -WebSession $session
  $count = 0
  if ($null -ne $r.data -and $null -ne $r.data.items) { $count = $r.data.items.Count }
  $results += "cart-auth:$($r.statusCode):items=$count"
} catch {
  $results += "cart-auth:$($_.Exception.Response.StatusCode.value__)"
}

$results -join "`n"
