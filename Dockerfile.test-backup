# Ultra simple test Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy only essential files
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY src/ ./src/
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Set environment variables
ENV VITE_API_URL=http://localhost:3001/api
ENV VITE_APP_NAME=Pets Yu
ENV VITE_APP_VERSION=1.0.0

# Try to build
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
