Param(
    [string]$BaseUrl = 'http://localhost:3000'
)

# Simple smoke test script for Windows PowerShell
Try {
    $ts = Get-Date -Format yyyyMMddHHmmss
    $email = "smoke+$ts@example.com"
    $password = 'Password123!'

    Write-Host "\n== Smoke test starting at $(Get-Date) ==\n"

    Write-Host "[1/4] Registering user: $email"
    $registerBody = @{ email = $email; password = $password; firstName = 'Smoke'; lastName = 'Tester' } | ConvertTo-Json
    $reg = Invoke-RestMethod -Uri "$BaseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType 'application/json' -ErrorAction Stop
    $token = $reg.token
    Write-Host "Registered user id: $($reg.user.id)"

    Write-Host "[2/4] Logging in"
    $loginBody = @{ email = $email; password = $password } | ConvertTo-Json
    $login = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType 'application/json' -ErrorAction Stop
    $token = $login.token
    Write-Host "Login token length: $($token.Length)"

    Write-Host "[3/4] Creating transaction ETB -> USD (amount=10)"
    $txBody = @{ fromCurrency = 'ETB'; toCurrency = 'USD'; amount = 10 } | ConvertTo-Json
    $create = Invoke-RestMethod -Uri "$BaseUrl/api/transactions" -Method Post -Body $txBody -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
    Write-Host "Created transaction id: $($create.transaction.id)"

    Write-Host "[4/4] Listing transactions"
    $list = Invoke-RestMethod -Uri "$BaseUrl/api/transactions" -Method Get -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
    Write-Host "Found $($list.value.Count) transactions for user $($reg.user.id)"

    Write-Host "\n== Smoke test completed successfully at $(Get-Date) ==\n"
    exit 0

} Catch {
    Write-Host "\nSmoke test failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response -and $_.Exception.Response.Content) {
        try { $body = $_.Exception.Response.Content | ConvertFrom-Json; Write-Host ("Response body: " + ($body | ConvertTo-Json -Depth 4)) } catch { }
    }
    exit 1
}
