# Deploy script for Pets Yu application
# This script builds and deploys the application to Docker

param(
    [string]$Environment = "production",
    [switch]$SkipBuild = $false,
    [switch]$SkipSeeding = $false
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Pets Yu deployment..." -ForegroundColor Green

# Function to print colored output
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Info "Docker is running"
} catch {
    Write-Error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
}

# Check if docker-compose is available
try {
    docker-compose --version | Out-Null
    Write-Info "docker-compose is available"
} catch {
    Write-Error "docker-compose is not installed. Please install it and try again."
    exit 1
}

# Load environment variables
$envFile = ".env"
if (Test-Path $envFile) {
    Write-Info "Loading environment variables from .env file..."
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
} else {
    Write-Warning "No .env file found. Using default values."
}

# Set default values
$postgresPassword = if ($env:POSTGRES_PASSWORD) { $env:POSTGRES_PASSWORD } else { "password" }
$jwtSecret = if ($env:JWT_SECRET) { $env:JWT_SECRET } else { [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString())) }
$frontendUrl = if ($env:FRONTEND_URL) { $env:FRONTEND_URL } else { "http://localhost:8090" }
$apiUrl = if ($env:API_URL) { $env:API_URL } else { "http://localhost:3001/api" }

Write-Info "Environment variables:"
Write-Host "  POSTGRES_PASSWORD: $($postgresPassword.Substring(0, [Math]::Min(10, $postgresPassword.Length)))..." -ForegroundColor Gray
Write-Host "  JWT_SECRET: $($jwtSecret.Substring(0, [Math]::Min(20, $jwtSecret.Length)))..." -ForegroundColor Gray
Write-Host "  FRONTEND_URL: $frontendUrl" -ForegroundColor Gray
Write-Host "  API_URL: $apiUrl" -ForegroundColor Gray

# Stop existing containers
Write-Info "Stopping existing containers..."
try {
    docker-compose down --remove-orphans
} catch {
    Write-Warning "No existing containers to stop"
}

# Build images
if (-not $SkipBuild) {
    Write-Info "Building Docker images..."
    
    # Build backend
    Write-Info "Building backend image..."
    docker-compose build backend
    
    # Build frontend
    Write-Info "Building frontend image..."
    docker-compose build frontend
} else {
    Write-Info "Skipping build step"
}

# Start services
Write-Info "Starting services..."
docker-compose up -d

# Wait for services to be healthy
Write-Info "Waiting for services to be healthy..."
Start-Sleep -Seconds 10

# Check if backend is healthy
Write-Info "Checking backend health..."
$backendHealthy = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Info "Backend is healthy!"
            $backendHealthy = $true
            break
        }
    } catch {
        # Continue checking
    }
    
    if ($i -eq 30) {
        Write-Error "Backend failed to start properly"
        docker-compose logs backend
        exit 1
    }
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 2
}

# Check if frontend is accessible
Write-Info "Checking frontend accessibility..."
$frontendHealthy = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8090" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Info "Frontend is accessible!"
            $frontendHealthy = $true
            break
        }
    } catch {
        # Continue checking
    }
    
    if ($i -eq 30) {
        Write-Error "Frontend failed to start properly"
        docker-compose logs frontend
        exit 1
    }
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 2
}

# Run database migrations
Write-Info "Running database migrations..."
docker-compose exec backend npx prisma db push

# Seed database
if (-not $SkipSeeding) {
    Write-Info "Seeding database..."
    try {
        docker-compose exec backend node prisma/seed.js
    } catch {
        Write-Warning "Database seeding failed or already seeded"
    }
} else {
    Write-Info "Skipping database seeding"
}

# Show status
Write-Info "Deployment completed successfully!"
Write-Host ""
Write-Host "📊 Application Status:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:8090" -ForegroundColor White
Write-Host "  Backend API: http://localhost:3001/api" -ForegroundColor White
Write-Host "  Health Check: http://localhost:3001/api/health" -ForegroundColor White
Write-Host ""
Write-Host "📋 Container Status:" -ForegroundColor Cyan
docker-compose ps
Write-Host ""
Write-Host "📝 Logs:" -ForegroundColor Cyan
Write-Host "  Backend logs: docker-compose logs -f backend" -ForegroundColor White
Write-Host "  Frontend logs: docker-compose logs -f frontend" -ForegroundColor White
Write-Host "  Database logs: docker-compose logs -f postgres" -ForegroundColor White
Write-Host ""
Write-Host "🛠️  Management Commands:" -ForegroundColor Cyan
Write-Host "  Stop services: docker-compose down" -ForegroundColor White
Write-Host "  Restart services: docker-compose restart" -ForegroundColor White
Write-Host "  View logs: docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Info "Deployment completed! 🎉"
