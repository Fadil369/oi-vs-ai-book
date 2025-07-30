#!/bin/bash

echo "🚀 GIVC Medical Coding Platform Deployment Script"
echo "=================================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "✅ Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Run type checking
echo ""
echo "🔍 Type checking..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "❌ Type checking failed"
    exit 1
fi

# Run linting
echo ""
echo "🧹 Linting..."
npm run lint

# Build the application
echo ""
echo "🏗️  Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "🎉 Ready for deployment!"
echo ""
echo "Deployment Options:"
echo "==================="
echo "1. 🌟 Cloudflare Pages (Recommended):"
echo "   - Run: './deploy-cloudflare.sh'"
echo "   - Or manually: 'npx wrangler pages deploy .next/out --project-name=givc-medical-coding'"
echo ""
echo "2. 🚀 Vercel:"
echo "   - Run: 'npx vercel --prod'"
echo ""
echo "3. 🐳 Docker:"
echo "   - Build: 'docker build -t givc-medical-coding .'"
echo "   - Run: 'docker run -p 3000:3000 givc-medical-coding'"
echo ""
echo "4. 📱 Manual/Self-hosted:"
echo "   - Run: 'npm start'"
echo ""
echo "📖 See README.md for detailed deployment instructions"
