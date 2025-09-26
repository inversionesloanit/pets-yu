# Build stage
FROM node:20-bullseye-slim AS build

WORKDIR /app
# Evitar que @prisma/client dispare generate en postinstall durante el build
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
ENV PRISMA_GENERATE_SKIP_ENV_CHECK=1

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 make g++ openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev) for build - sin scripts de postinstall
RUN npm ci --ignore-scripts && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client needed for TypeScript types during build
RUN npx prisma generate

# Verify installations and build
RUN echo "Node version: $(node --version)"
RUN echo "NPM version: $(npm --version)"
RUN echo "TypeScript version: $(npx tsc --version)"
RUN echo "Available scripts:"
RUN npm run

# Build TypeScript
RUN npm run build

# Verify build output
RUN ls -la dist/

# Production stage
FROM node:20-bullseye-slim AS production

WORKDIR /app
# Evitar generate en postinstall y chequeos estrictos durante runtime
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1

# Install dumb-init and openssl for Prisma engines
RUN apt-get update && apt-get install -y --no-install-recommends \
  dumb-init openssl ca-certificates wget \
  && rm -rf /var/lib/apt/lists/*

# Create non-root user (Debian/Ubuntu syntax)
RUN groupadd -g 1001 nodejs || true \
  && useradd -m -u 1001 -g nodejs -s /bin/bash nodejs || true

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/public ./public

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force \
  && chown -R nodejs:nodejs /app

# Create logs directory
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app/logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check with better error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Environment variables
ENV PRISMA_GENERATE_SKIP_ENV_CHECK=1
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

# Start application with proper error handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["./start.sh"]
