#!/bin/bash

# Script de diagnóstico para problemas de build en Docker

echo "🔍 Diagnóstico de Build para Pets Yu"
echo "======================================"

# Verificar Docker
echo "1. Verificando Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker está instalado: $(docker --version)"
else
    echo "❌ Docker no está instalado"
    exit 1
fi

# Verificar Docker Compose
echo "2. Verificando Docker Compose..."
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose está instalado: $(docker-compose --version)"
else
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

# Verificar archivos necesarios
echo "3. Verificando archivos del proyecto..."
required_files=(
    "backend/package.json"
    "backend/tsconfig.json"
    "backend/Dockerfile"
    "backend/src/index.ts"
    "package.json"
    "Dockerfile"
    "docker-compose.yml"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file NO existe"
    fi
done

# Verificar estructura del backend
echo "4. Verificando estructura del backend..."
backend_files=(
    "backend/src/controllers"
    "backend/src/middleware"
    "backend/src/routes"
    "backend/prisma"
)

for dir in "${backend_files[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir existe"
        echo "   Contenido: $(ls -la $dir | wc -l) elementos"
    else
        echo "❌ $dir NO existe"
    fi
done

# Verificar package.json del backend
echo "5. Verificando package.json del backend..."
if [ -f "backend/package.json" ]; then
    echo "✅ package.json existe"
    
    # Verificar si tiene script de build
    if grep -q '"build"' backend/package.json; then
        echo "✅ Script 'build' encontrado"
    else
        echo "❌ Script 'build' NO encontrado"
    fi
    
    # Verificar dependencias de TypeScript
    if grep -q '"typescript"' backend/package.json; then
        echo "✅ TypeScript en dependencias"
    else
        echo "❌ TypeScript NO en dependencias"
    fi
fi

# Probar build local del backend
echo "6. Probando build local del backend..."
if [ -d "backend" ]; then
    cd backend
    
    if [ -f "package.json" ]; then
        echo "✅ Instalando dependencias..."
        npm install
        
        echo "✅ Verificando TypeScript..."
        npx tsc --version
        
        echo "✅ Intentando build..."
        npm run build
        
        if [ $? -eq 0 ]; then
            echo "✅ Build local exitoso"
            ls -la dist/
        else
            echo "❌ Build local falló"
        fi
    fi
    
    cd ..
fi

# Probar build de Docker
echo "7. Probando build de Docker..."
echo "✅ Construyendo imagen del backend..."
docker build -t pets-yu-backend-test ./backend

if [ $? -eq 0 ]; then
    echo "✅ Build de Docker exitoso"
else
    echo "❌ Build de Docker falló"
    echo "Verifica los logs arriba para más detalles"
fi

echo ""
echo "🏁 Diagnóstico completado"
echo "Si hay errores, revisa los logs arriba y corrige los problemas antes de desplegar en Portainer."
