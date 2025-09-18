# 🔧 Solución al Error de Build en Portainer

## ❌ Error que estás experimentando:
```
Failed to deploy a stack: compose build operation failed: 
failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 127
```

## 🔍 Diagnóstico del Problema

El código de salida 127 significa "comando no encontrado". Esto indica que:
1. El comando `npm` no está disponible
2. O el script `build` no existe en package.json
3. O las dependencias no se instalaron correctamente

## ✅ Soluciones Implementadas

### 1. **Usar el Stack Corregido** (Recomendado)

En lugar de usar `portainer-stack.yml`, usa `portainer-stack-working.yml`:

1. Ve a **Stacks** en Portainer
2. Haz clic en **Add stack**
3. Nombre: `pets-yu`
4. Copia y pega el contenido del archivo **`portainer-stack-working.yml`**

### 2. **Configurar Variables de Entorno**

Asegúrate de configurar estas variables:

```yaml
POSTGRES_PASSWORD: "tu_password_seguro"
JWT_SECRET: "genera_un_secret_muy_largo_y_seguro"
FRONTEND_URL: "http://tu-dominio.com"
API_URL: "http://tu-dominio.com/api"
```

### 3. **Verificar que el Repositorio esté Actualizado**

El repositorio ya tiene las correcciones aplicadas. Si usas el stack desde GitHub:

1. Asegúrate de usar la URL correcta del repositorio
2. Usa la rama `main` (que tiene las correcciones)
3. El Dockerfile corregido ya está incluido

## 🚀 Pasos para Desplegar Correctamente

### Opción A: Stack Corregido (Recomendado)

1. **En Portainer**:
   - Ve a **Stacks**
   - **Add stack**
   - Nombre: `pets-yu`
   - Usa el contenido de `portainer-stack-working.yml`

2. **Configurar variables de entorno** (como se mostró arriba)

3. **Deploy the stack**

### Opción B: Stack Simplificado (Sin Build)

Si sigues teniendo problemas, usa `portainer-stack-simple.yml`:

1. Este stack usa imágenes base de Node.js
2. Instala dependencias en tiempo de ejecución
3. Es más lento pero más confiable

### Opción C: Build Local y Push

1. **Construir imágenes localmente**:
   ```bash
   # Clonar repositorio
   git clone https://github.com/inversionesloanit/pets-yu.git
   cd pets-yu
   
   # Construir imágenes
   docker build -t pets-yu-backend ./backend
   docker build -t pets-yu-frontend .
   
   # Subir a registry (si tienes uno)
   docker tag pets-yu-backend tu-registry/pets-yu-backend
   docker tag pets-yu-frontend tu-registry/pets-yu-frontend
   docker push tu-registry/pets-yu-backend
   docker push tu-registry/pets-yu-frontend
   ```

2. **Usar imágenes pre-construidas en Portainer**

## 🔍 Diagnóstico Adicional

Si sigues teniendo problemas, ejecuta el script de diagnóstico:

```bash
# En tu máquina local
git clone https://github.com/inversionesloanit/pets-yu.git
cd pets-yu
chmod +x debug-build.sh
./debug-build.sh
```

## 📋 Checklist de Verificación

Antes de desplegar en Portainer, verifica:

- [ ] ✅ Repositorio actualizado (último commit)
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Usando el stack correcto (`portainer-stack-working.yml`)
- [ ] ✅ Puerto 3001 disponible para el backend
- [ ] ✅ Puerto 8090 disponible para el frontend
- [ ] ✅ Puerto 5432 disponible para PostgreSQL (o usa puerto diferente)

## 🚨 Troubleshooting Común

### Error: "Port already in use"
```bash
# Verificar puertos en uso
netstat -tulpn | grep :3001
netstat -tulpn | grep :8090
netstat -tulpn | grep :5432

# Cambiar puertos en el stack si es necesario
```

### Error: "Permission denied"
```bash
# Verificar permisos de Docker
docker ps
docker images

# Reiniciar Docker si es necesario
sudo systemctl restart docker
```

### Error: "Database connection failed"
- Verificar que PostgreSQL esté iniciado
- Verificar variables de entorno de base de datos
- Verificar conectividad de red entre servicios

## 📞 Soporte

Si sigues teniendo problemas:

1. **Revisa los logs** en Portainer:
   - Ve a **Containers**
   - Selecciona el contenedor que falla
   - Ve a **Logs**

2. **Ejecuta el diagnóstico**:
   ```bash
   ./debug-build.sh
   ```

3. **Verifica el estado del repositorio**:
   - Asegúrate de estar usando la última versión
   - Verifica que todos los archivos estén presentes

## 🎯 Resultado Esperado

Después de aplicar estas correcciones, deberías ver:

- ✅ Stack desplegado exitosamente
- ✅ Todos los contenedores funcionando
- ✅ Backend accesible en `http://localhost:3001/api/health`
- ✅ Frontend accesible en `http://localhost:8090`
- ✅ Base de datos funcionando

---

**¡El problema está solucionado! Usa `portainer-stack-working.yml` para desplegar correctamente.** 🎉
