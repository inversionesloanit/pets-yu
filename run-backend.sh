#!/bin/bash

# Script para ejecutar el backend manualmente en el servidor
echo "🚀 Iniciando backend de Pets Yu..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Instalando..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Instalando..."
    sudo apt-get install -y npm
fi

# Navegar al directorio del backend
cd backend

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Construir el proyecto
echo "🔨 Construyendo el proyecto..."
npm run build

# Configurar variables de entorno
export DATABASE_URL="postgresql://petsyu:password@localhost:5432/petsyu_db?schema=public"
export JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
export JWT_EXPIRES_IN="7d"
export PORT=3001
export NODE_ENV="production"
export FRONTEND_URL="http://localhost:8090"

# Iniciar el servidor
echo "🌟 Iniciando servidor backend en puerto 3001..."
npm start
