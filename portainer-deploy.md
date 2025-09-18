# 🚀 Guía de Despliegue en Portainer

Esta guía te ayudará a desplegar Pets Yu en Portainer usando Docker Swarm o Docker Compose.

## 📋 Prerrequisitos

- Portainer instalado y funcionando
- Docker Swarm inicializado (para stacks)
- Acceso de administrador a Portainer

## 🔧 Opción 1: Docker Compose Stack

### 1. Preparar el Stack

1. Ve a **Stacks** en Portainer
2. Haz clic en **Add stack**
3. Nombre: `pets-yu`
4. Copia y pega el contenido del archivo `portainer-stack.yml`

### 2. Variables de Entorno

Configura las siguientes variables de entorno en Portainer:

```yaml
# Base de datos
POSTGRES_PASSWORD: "tu_password_seguro_aqui"

# JWT Secret (genera uno nuevo)
JWT_SECRET: "genera_un_secret_muy_largo_y_seguro"

# URLs de la aplicación
FRONTEND_URL: "http://tu-dominio.com"
API_URL: "http://tu-dominio.com/api"

# Configuración de cache (opcional)
CACHE_TTL_PRODUCTS: "600000"
CACHE_TTL_CATEGORIES: "1800000"
CACHE_TTL_USERS: "900000"
```

### 3. Desplegar

1. Haz clic en **Deploy the stack**
2. Espera a que todos los servicios estén funcionando
3. Verifica el estado en **Containers**

## 🔧 Opción 2: Docker Compose Local

Si prefieres usar Docker Compose directamente:

```bash
# Clonar el repositorio
git clone https://github.com/inversionesloanit/pets-yu.git
cd pets-yu

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus valores

# Desplegar
docker-compose up -d
```

## 🌐 Configuración de Dominio

### Con Nginx (Recomendado)

El stack incluye un servicio Nginx que actúa como reverse proxy:

- **Frontend**: `http://tu-dominio.com`
- **API**: `http://api.tu-dominio.com` o `http://tu-dominio.com/api`

### Configuración DNS

```
A    tu-dominio.com          -> IP_DEL_SERVIDOR
A    api.tu-dominio.com      -> IP_DEL_SERVIDOR (opcional)
```

## 🔒 Configuración SSL/HTTPS

### Con Let's Encrypt (Certbot)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Generar certificados
sudo certbot --nginx -d tu-dominio.com -d api.tu-dominio.com
```

### Con Traefik (Alternativa)

Agregar al stack:

```yaml
traefik:
  image: traefik:v2.10
  command:
    - "--api.insecure=true"
    - "--providers.docker=true"
    - "--entrypoints.web.address=:80"
    - "--entrypoints.websecure.address=:443"
    - "--certificatesresolvers.letsencrypt.acme.email=tu-email@ejemplo.com"
    - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - letsencrypt:/letsencrypt
  networks:
    - pets-yu-network

volumes:
  letsencrypt:
```

## 📊 Monitoreo y Logs

### Ver Logs en Portainer

1. Ve a **Containers**
2. Selecciona el contenedor
3. Haz clic en **Logs**

### Logs Importantes

- **Backend**: `/app/logs/` dentro del contenedor
- **Nginx**: Logs de acceso y errores
- **PostgreSQL**: Logs de base de datos

### Health Checks

Todos los servicios tienen health checks configurados:

- **Backend**: `http://localhost:3001/api/health`
- **Frontend**: `http://localhost:80/`
- **PostgreSQL**: `pg_isready`

## 🗄️ Backup y Restauración

### Backup de Base de Datos

```bash
# Crear backup
docker exec pets-yu-db pg_dump -U petsyu petsyu_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker exec -i pets-yu-db psql -U petsyu -d petsyu_db < backup.sql
```

### Backup de Volúmenes

```bash
# Backup de volúmenes Docker
docker run --rm -v pets-yu_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

## 🔧 Mantenimiento

### Actualizar la Aplicación

1. **Pull de la nueva imagen**:
   ```bash
   docker-compose pull
   ```

2. **Reiniciar servicios**:
   ```bash
   docker-compose up -d
   ```

3. **Ejecutar migraciones** (si las hay):
   ```bash
   docker-compose exec backend npx prisma db push
   ```

### Escalado Horizontal

Para escalar el backend:

```bash
docker service scale pets-yu_backend=3
```

### Limpieza de Recursos

```bash
# Limpiar contenedores parados
docker container prune

# Limpiar imágenes no utilizadas
docker image prune

# Limpiar volúmenes no utilizados
docker volume prune
```

## 🚨 Troubleshooting

### Problemas Comunes

1. **Servicios no inician**:
   - Verificar logs: `docker-compose logs servicio`
   - Verificar recursos del servidor
   - Verificar configuración de red

2. **Base de datos no conecta**:
   - Verificar que PostgreSQL esté corriendo
   - Verificar variables de entorno
   - Verificar conectividad de red

3. **Frontend no carga**:
   - Verificar que Nginx esté corriendo
   - Verificar configuración de proxy
   - Verificar certificados SSL

### Comandos de Diagnóstico

```bash
# Estado de servicios
docker-compose ps

# Uso de recursos
docker stats

# Logs en tiempo real
docker-compose logs -f

# Verificar conectividad
docker-compose exec backend ping postgres
```

## 📞 Soporte

Si tienes problemas con el despliegue:

1. Revisa los logs de los contenedores
2. Verifica la configuración de variables de entorno
3. Consulta la documentación en el README.md
4. Abre un issue en el repositorio de GitHub

---

**¡Tu aplicación Pets Yu está lista para producción! 🎉**
