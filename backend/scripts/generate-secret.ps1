# Generate Secure JWT Secret for Production
# This script generates a cryptographically secure random string for JWT signing

Write-Host "🔐 Generating secure JWT secret for production..." -ForegroundColor Green

# Generate a 64-character random string using .NET cryptography
$bytes = New-Object Byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)

Write-Host "✅ Generated JWT Secret:" -ForegroundColor Green
Write-Host $secret -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Add this to your production .env file:" -ForegroundColor Blue
Write-Host "JWT_SECRET=$secret" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Keep this secret secure and never commit it to version control!" -ForegroundColor Red 