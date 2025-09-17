# Build stage
FROM node:20-bullseye-slim AS build

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 make g++ openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev) for build
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript with verbose output
RUN npm run build || (echo "Build failed, checking TypeScript errors..." && npx tsc --noEmit --listFiles)

# Production stage
FROM node:20-bullseye-slim AS production

WORKDIR /app

# Install dumb-init and openssl for Prisma engines
RUN apt-get update && apt-get install -y --no-install-recommends \
  dumb-init openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Create non-root user (Debian/Ubuntu syntax)
RUN groupadd -g 1001 nodejs || true \
  && useradd -m -u 1001 -g nodejs -s /bin/bash nodejs || true

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force \
  && chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

ENV PRISMA_GENERATE_SKIP_ENV_CHECK=1
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Start application
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["sh", "-c", "npx prisma db push && node prisma/seed.js || true && node dist/index.js"]
