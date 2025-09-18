#!/bin/bash

# Deploy script for Pets Yu application
# This script builds and deploys the application to Docker

set -e  # Exit on any error

echo "🚀 Starting Pets Yu deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install it and try again."
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    print_status "Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
else
    print_warning "No .env file found. Using default values."
fi

# Set default values
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-password}
JWT_SECRET=${JWT_SECRET:-$(openssl rand -base64 32)}
FRONTEND_URL=${FRONTEND_URL:-http://localhost:8090}
API_URL=${API_URL:-http://localhost:3001/api}

print_status "Environment variables:"
echo "  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:0:10}..."
echo "  JWT_SECRET: ${JWT_SECRET:0:20}..."
echo "  FRONTEND_URL: $FRONTEND_URL"
echo "  API_URL: $API_URL"

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans || true

# Build images
print_status "Building Docker images..."

# Build backend
print_status "Building backend image..."
docker-compose build backend

# Build frontend
print_status "Building frontend image..."
docker-compose build frontend

# Start services
print_status "Starting services..."
docker-compose up -d

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
sleep 10

# Check if backend is healthy
print_status "Checking backend health..."
for i in {1..30}; do
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        print_status "Backend is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start properly"
        docker-compose logs backend
        exit 1
    fi
    echo -n "."
    sleep 2
done

# Check if frontend is accessible
print_status "Checking frontend accessibility..."
for i in {1..30}; do
    if curl -f http://localhost:8090 > /dev/null 2>&1; then
        print_status "Frontend is accessible!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Frontend failed to start properly"
        docker-compose logs frontend
        exit 1
    fi
    echo -n "."
    sleep 2
done

# Run database migrations
print_status "Running database migrations..."
docker-compose exec backend npx prisma db push

# Seed database
print_status "Seeding database..."
docker-compose exec backend node prisma/seed.js || print_warning "Database seeding failed or already seeded"

# Show status
print_status "Deployment completed successfully!"
echo ""
echo "📊 Application Status:"
echo "  Frontend: http://localhost:8090"
echo "  Backend API: http://localhost:3001/api"
echo "  Health Check: http://localhost:3001/api/health"
echo ""
echo "📋 Container Status:"
docker-compose ps
echo ""
echo "📝 Logs:"
echo "  Backend logs: docker-compose logs -f backend"
echo "  Frontend logs: docker-compose logs -f frontend"
echo "  Database logs: docker-compose logs -f postgres"
echo ""
echo "🛠️  Management Commands:"
echo "  Stop services: docker-compose down"
echo "  Restart services: docker-compose restart"
echo "  View logs: docker-compose logs -f"
echo ""
print_status "Deployment completed! 🎉"
