#!/bin/bash
set -e

echo "🔍 Debugging build process..."

echo "📦 Node version:"
node --version

echo "📦 NPM version:"
npm --version

echo "📦 Current directory:"
pwd

echo "📦 Files in current directory:"
ls -la

echo "📦 Package.json contents:"
cat package.json

echo "📦 Environment variables:"
env | grep -E "(VITE_|NODE_)" || echo "No VITE_ or NODE_ env vars found"

echo "📦 Installing dependencies..."
npm ci

echo "📦 Running build with verbose output..."
npm run build -- --verbose

echo "✅ Build completed successfully!"