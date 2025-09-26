#!/bin/bash
set -e

echo "🚀 Building and deploying Pets Yu..."

# Build frontend locally
echo "📦 Building frontend..."
npm run build

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Frontend built successfully"

# Copy the built files to a location accessible by Docker
echo "📁 Preparing files for deployment..."

# Create a simple nginx config for the frontend
cat > nginx-simple.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

echo "✅ Ready for deployment"
echo "📋 Next steps:"
echo "1. Use docker-compose.simple.yml in Portainer"
echo "2. Or run: docker-compose -f docker-compose.simple.yml up -d"
