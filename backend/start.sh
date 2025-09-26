#!/bin/bash
set -e

echo "🚀 Starting Pets Yu Backend..."

# Configurar variables de entorno para Prisma
export PRISMA_GENERATE_SKIP_ENV_CHECK=1
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

echo "📦 Generating Prisma client..."
npx prisma generate || {
    echo "❌ Error generating Prisma client, continuing anyway..."
}

echo "🗄️ Pushing database schema..."
npx prisma db push || {
    echo "❌ Error pushing database schema, continuing anyway..."
}

echo "🌱 Running database seed..."
node prisma/seed.js || {
    echo "❌ Error running seed, continuing anyway..."
}

echo "🎯 Starting application..."
node dist/index.js
