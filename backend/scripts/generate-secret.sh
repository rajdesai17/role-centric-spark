#!/bin/bash

# Generate Secure JWT Secret for Production
# This script generates a cryptographically secure random string for JWT signing

echo "🔐 Generating secure JWT secret for production..."

# Generate a 64-character random string using openssl
SECRET=$(openssl rand -base64 32)

echo "✅ Generated JWT Secret:"
echo "$SECRET"
echo ""
echo "📝 Add this to your production .env file:"
echo "JWT_SECRET=$SECRET"
echo ""
echo "⚠️  Keep this secret secure and never commit it to version control!" 