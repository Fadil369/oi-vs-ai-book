#!/bin/bash

echo "☁️  Cloudflare Pages Deployment for GIVC Medical Coding"
echo "======================================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if wrangler is installed
if ! command_exists wrangler; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler

    if [ $? -ne 0 ]; then
        echo "❌ Failed to install wrangler. Please install manually:"
        echo "   npm install -g wrangler"
        exit 1
    fi
fi

echo "✅ Wrangler CLI version: $(wrangler --version)"

# Check authentication
echo ""
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami > /dev/null 2>&1; then
    echo "⚠️  Not authenticated with Cloudflare. Please login:"
    wrangler login

    if [ $? -ne 0 ]; then
        echo "❌ Authentication failed"
        exit 1
    fi
fi

echo "✅ Authenticated with Cloudflare"

# Ensure we have a production build
echo ""
echo "🏗️  Ensuring fresh production build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Configure Next.js for static export (required for Cloudflare Pages)
echo ""
echo "⚙️  Configuring for static export..."

# Set environment variable for static export
export STATIC_EXPORT=true
export NEXT_PUBLIC_SITE_URL="https://givc-medical-coding.pages.dev"

# Rebuild with static export
echo ""
echo "🔄 Rebuilding for static export..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Static build failed"
    exit 1
fi

# Deploy to Cloudflare Pages
echo ""
echo "🚀 Deploying to Cloudflare Pages..."

PROJECT_NAME="givc-medical-coding"
BUILD_OUTPUT_DIR="out"

# Deploy using wrangler
wrangler pages deploy $BUILD_OUTPUT_DIR \
    --project-name=$PROJECT_NAME \
    --compatibility-date=2024-01-01

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "Your GIVC Medical Coding Platform is now live at:"
    echo "🌐 https://$PROJECT_NAME.pages.dev"
    echo ""
    echo "Next steps:"
    echo "1. 🔗 Set up custom domain (optional)"
    echo "2. 🔧 Configure environment variables in Cloudflare dashboard"
    echo "3. 📊 Monitor performance and analytics"
    echo ""
    echo "Dashboard: https://dash.cloudflare.com/pages"
else
    echo "❌ Deployment failed"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check your Cloudflare account permissions"
    echo "2. Verify project name is available"
    echo "3. Ensure build output directory exists"
    exit 1
fi
