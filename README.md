# 🐾 Pets Yu - E-commerce para Mascotas

Una aplicación completa de e-commerce especializada en productos para mascotas, desarrollada con tecnologías modernas y optimizada para producción.

## 🚀 Características

### Frontend (React + Vite)
- **UI/UX Moderna**: Interfaz responsiva con Tailwind CSS
- **Autenticación Completa**: Login, registro y gestión de sesiones
- **Carrito de Compras**: Funcionalidad completa con persistencia
- **Búsqueda y Filtros**: Filtrado por categorías y búsqueda en tiempo real
- **Notificaciones**: Sistema de notificaciones toast
- **Accesibilidad**: Cumple estándares de accesibilidad web

### Backend (Node.js + TypeScript)
- **API REST Completa**: Endpoints para productos, usuarios, carrito y órdenes
- **Autenticación JWT**: Sistema seguro de autenticación
- **Validación Robusta**: Validación de entrada con express-validator
- **Rate Limiting**: Protección contra abuso de API
- **Cache Inteligente**: Sistema de cache en memoria para mejor performance
- **Logging Avanzado**: Sistema de logs estructurado
- **Manejo de Errores**: Manejo robusto de errores con clases personalizadas

### Base de Datos (PostgreSQL + Prisma)
- **Schema Optimizado**: Índices para mejorar performance
- **Migraciones**: Sistema de versionado de base de datos
- **Seed Data**: Datos de prueba incluidos
- **Relaciones**: Modelo de datos bien estructurado

### Seguridad
- **Headers de Seguridad**: Helmet.js para protección
- **CORS Configurado**: Política de CORS restrictiva
- **Sanitización de Input**: Limpieza de datos de entrada
- **Rate Limiting**: Protección contra ataques DDoS
- **Validación de Entrada**: Validación estricta de datos

## 🛠️ Tecnologías

### Frontend
- **React 19** - Framework de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Iconos
- **Context API** - Manejo de estado

### Backend
- **Node.js 20** - Runtime de JavaScript
- **TypeScript** - Tipado estático
- **Express.js** - Framework web
- **Prisma** - ORM y cliente de base de datos
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación
- **Nginx** - Reverse proxy
- **Portainer** - Gestión de contenedores

## 📦 Instalación y Despliegue

### Prerrequisitos
- Docker Desktop
- Docker Compose
- Node.js 20+ (para desarrollo local)
- Git

### Despliegue Rápido

#### Windows (PowerShell)
```powershell
# Clonar el repositorio
git clone <repository-url>
cd pets-yu

# Ejecutar script de despliegue
.\deploy.ps1
```

#### Linux/macOS (Bash)
```bash
# Clonar el repositorio
git clone <repository-url>
cd pets-yu

# Hacer ejecutable y ejecutar
chmod +x deploy.sh
./deploy.sh
```

### Despliegue Manual

1. **Configurar variables de entorno**:
```bash
cp env.example .env
# Editar .env con tus valores
```

2. **Construir y ejecutar**:
```bash
docker-compose up --build -d
```

3. **Ejecutar migraciones**:
```bash
docker-compose exec backend npx prisma db push
docker-compose exec backend node prisma/seed.js
```

### Despliegue en Portainer

1. **Subir imágenes**:
```bash
# Construir y etiquetar imágenes
docker build -t pets-yu-backend ./backend
docker build -t pets-yu-frontend .

# Subir a registry (opcional)
docker push your-registry/pets-yu-backend
docker push your-registry/pets-yu-frontend
```

2. **Crear stack en Portainer**:
   - Usar el archivo `portainer-stack.yml`
   - Configurar variables de entorno
   - Desplegar stack

## 🔧 Desarrollo Local

### Frontend
```bash
cd pets-yu
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Base de Datos
```bash
# Iniciar PostgreSQL
docker-compose up postgres -d

# Ejecutar migraciones
npm run db:push

# Seed datos
npm run db:seed
```

## 📊 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Perfil del usuario

### Productos
- `GET /api/products` - Listar productos (con paginación y filtros)
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/:id` - Actualizar producto (Admin)
- `DELETE /api/products/:id` - Eliminar producto (Admin)

### Carrito
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart` - Agregar producto al carrito
- `PUT /api/cart/:id` - Actualizar cantidad
- `DELETE /api/cart/:id` - Eliminar del carrito

### Órdenes
- `GET /api/orders` - Listar órdenes del usuario
- `POST /api/orders` - Crear nueva orden
- `GET /api/orders/:id` - Obtener orden por ID

## 🔒 Seguridad

### Configuración de Producción
- Cambiar `JWT_SECRET` por una clave segura
- Configurar HTTPS con certificados SSL
- Usar variables de entorno para credenciales
- Implementar backup de base de datos
- Configurar monitoreo y alertas

### Rate Limiting
- General: 100 requests/15min por IP
- Autenticación: 5 requests/15min por IP
- Órdenes: 10 requests/15min por IP

## 📈 Performance

### Optimizaciones Implementadas
- **Cache en Memoria**: Para productos y categorías
- **Índices de Base de Datos**: Para queries frecuentes
- **Compresión Gzip**: Para assets estáticos
- **Lazy Loading**: Para imágenes
- **Tree Shaking**: Para bundle optimization

### Monitoreo
- Logs estructurados en `/app/logs`
- Health checks para todos los servicios
- Métricas de performance
- Alertas de errores

## 🧪 Testing

### Datos de Prueba
- **Admin**: admin@petsyu.com / admin123
- **Cliente**: customer@petsyu.com / customer123

### Endpoints de Testing
- `GET /api/health` - Health check
- `GET /api/products` - Listar productos
- `GET /api/categories` - Listar categorías

## 📝 Logs

### Ubicaciones
- **Backend**: `/app/logs/` en el contenedor
- **Docker**: `docker-compose logs -f backend`

### Tipos de Logs
- `error.log` - Errores de aplicación
- `info.log` - Información general
- `combined.log` - Logs combinados
- Performance logs para requests lentos

## 🚀 Comandos Útiles

### Docker
```bash
# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar servicios
docker-compose restart backend
docker-compose restart frontend

# Detener todo
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

### Base de Datos
```bash
# Acceder a la base de datos
docker-compose exec postgres psql -U petsyu -d petsyu_db

# Backup
docker-compose exec postgres pg_dump -U petsyu petsyu_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U petsyu -d petsyu_db < backup.sql
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: support@petsyu.com
- Documentación: [Wiki del proyecto]
- Issues: [GitHub Issues]

---

**Desarrollado con ❤️ para las mascotas de Panamá y Centroamérica**