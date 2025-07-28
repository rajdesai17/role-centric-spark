#!/bin/bash

# Production Deployment Script
set -e

echo "🚀 Starting production deployment..."

# Check if we're in production mode
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  Warning: NODE_ENV is not set to 'production'"
    echo "   Set NODE_ENV=production for production deployment"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Build the application
echo "🔨 Building application..."
npm run build

# Start the production server
echo "🚀 Starting production server..."
npm run start:prod 