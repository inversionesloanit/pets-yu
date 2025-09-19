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

// Import routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import testimonialRoutes from './routes/testimonials';
import adminRoutes from './routes/admin';

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

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
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
app.use('/admin', strictLimiter.middleware(), adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
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
