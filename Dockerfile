# Etapa 1: Build Frontend
FROM node:20-alpine AS frontend_build
WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json ./
RUN npm ci --only=production=false

# Copiar código fuente
COPY . .

# Configurar variables de entorno para el build de Vite
ENV VITE_API_URL=http://localhost:3001/api
ENV VITE_APP_NAME=Pets Yu
ENV VITE_APP_VERSION=1.0.0

# Build del frontend
RUN npm run build

# Etapa 2: Build Backend (para copiar archivos estáticos)
FROM node:20-alpine AS backend_static_build
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
# Evitar que postinstall dispare prisma generate en este stage
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
# Instalar dependencias sin ejecutar scripts de postinstall
RUN npm ci --ignore-scripts
COPY backend/public ./public/

# Etapa 3: Runtime con Nginx
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=frontend_build /app/dist/ .
COPY --from=backend_static_build /app/backend/public/ ./backend_public/ # Copiar la carpeta public del backend
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -qO- http://localhost/ | grep -q "</html>" || exit 1
CMD ["nginx", "-g", "daemon off;"]
