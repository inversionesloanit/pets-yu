import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { generalLimiter, authLimiter, strictLimiter } from './middleware/rateLimiter';
import { securityHeaders, requestSizeLimiter, corsOptions, sanitizeInput } from './middleware/security';
import { errorHandler, notFoundHandler, initializeErrorHandling } from './middleware/errorHandler';
import { logger, requestLogger, performanceLogger } from './utils/logger';
import swaggerUi from 'swagger-ui-express'; // Importar swagger-ui-express
import swaggerSpec from './swagger'; // Importar la configuración de Swagger

// Import routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import testimonialRoutes from './routes/testimonials';
import adminRoutes from './routes/admin';
import inventoryRoutes from './routes/inventory';

// Load environment variables
dotenv.config();

// Initialize error handling
initializeErrorHandling();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Prisma
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Security middleware - Disabled CSP for admin panel
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(requestSizeLimiter);

// Logging
app.use(requestLogger);
app.use(performanceLogger);
app.use(morgan('combined'));

// Body parsing with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, _res, buf) => {
    try {
      JSON.parse(buf.toString());
    } catch (e) {
      // Throwing here lets the body-parser surface a 400 Bad Request
      // and our global error handler can format the response.
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Rate limiting
app.use(generalLimiter.middleware());

// Routes with specific rate limiting
app.use('/api/auth', authLimiter.middleware(), authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', strictLimiter.middleware(), orderRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/admin', adminRoutes);
app.use('/api/inventory', inventoryRoutes);

// Ruta para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error logging middleware (before error handler)
app.use((error: any, req: any, res: any, next: any) => {
  console.error('=== UNHANDLED ERROR ===');
  console.error('URL:', req.url);
  console.error('Method:', req.method);
  console.error('Error type:', error.constructor.name);
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);
  console.error('=== END UNHANDLED ERROR ===');
  next(error);
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info(`Server started successfully`, {
    port: PORT,
    environment: process.env.NODE_ENV,
    healthCheckUrl: `http://localhost:${PORT}/api/health`
  });
  
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
