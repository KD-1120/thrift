// ThriftAccra Fastify Backend Server

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';
import { initializeFirebaseAdmin } from './services/firebase-admin';
import authRoutes from './routes/auth.routes';
import ordersRoutes from './routes/orders.routes';
import usersRoutes from './routes/users.routes';
import measurementsRoutes from './routes/measurements.routes';
import tailorsRoutes from './routes/tailors.routes';
import messagingRoutes from './routes/messaging.routes';
import callsRoutes from './routes/calls.routes';
import { errorHandler } from './middleware/error-handler';

// Load environment variables
dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Firebase Admin SDK
initializeFirebaseAdmin();

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: NODE_ENV === 'production' ? 'info' : 'debug',
    transport: NODE_ENV === 'development'
      ? undefined // Use default console transport
      : undefined,
  },
});

// Register plugins
async function registerPlugins() {
  // Security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: false, // Disable for API
  });

  // CORS configuration
  await fastify.register(cors, {
    origin: (origin, cb) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:8081',
        'exp://',
      ];

      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        cb(null, true);
        return;
      }

      // Check if origin is allowed
      const isAllowed = allowedOrigins.some(
        (allowed) => origin.startsWith(allowed)
      );

      if (isAllowed) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  });

  // Rate limiting
  await fastify.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
    }),
  });

  fastify.log.info('Plugins registered successfully');
}

// Register routes
async function registerRoutes() {
  // Health check
  fastify.get('/health', async () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  }));

  // API routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(ordersRoutes, { prefix: '/api/orders' });
  await fastify.register(usersRoutes, { prefix: '/api/users' });
  await fastify.register(measurementsRoutes, { prefix: '/api/measurements' });
  await fastify.register(tailorsRoutes, { prefix: '/api/tailors' });
  await fastify.register(messagingRoutes);
  await fastify.register(callsRoutes, { prefix: '/api' });

  fastify.log.info('Routes registered successfully');
}

// Error handler
fastify.setErrorHandler(errorHandler);

// Graceful shutdown
const closeGracefully = async (signal: string) => {
  fastify.log.info(`Received signal ${signal}, closing gracefully`);
  await fastify.close();
  process.exit(0);
};

process.on('SIGINT', () => closeGracefully('SIGINT'));
process.on('SIGTERM', () => closeGracefully('SIGTERM'));

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    await fastify.listen({ port: PORT, host: HOST });

    fastify.log.info(
      `🚀 ThriftAccra Backend running at http://${HOST}:${PORT}`
    );
    fastify.log.info(`📝 Environment: ${NODE_ENV}`);
    fastify.log.info(`🔥 Firebase Admin initialized`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  fastify.log.error(err);
  process.exit(1);
});

start();
