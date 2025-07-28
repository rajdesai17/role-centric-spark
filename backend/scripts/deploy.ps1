# Production Deployment Script for Windows
param(
    [string]$Environment = "production"
)

Write-Host "🚀 Starting production deployment..." -ForegroundColor Green

# Check if we're in production mode
if ($env:NODE_ENV -ne "production") {
    Write-Host "⚠️  Warning: NODE_ENV is not set to 'production'" -ForegroundColor Yellow
    Write-Host "   Set NODE_ENV=production for production deployment" -ForegroundColor Yellow
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install --production

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Blue
npx prisma generate

# Run database migrations
Write-Host "🗄️  Running database migrations..." -ForegroundColor Blue
npx prisma migrate deploy

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Blue
npm run build

# Start the production server
Write-Host "🚀 Starting production server..." -ForegroundColor Green
npm run start:prod 