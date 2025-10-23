// Global Error Handler

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log error
  request.log.error(error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Validation Error',
      message: 'Request validation failed',
      details: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  // Known Fastify errors
  if (error.statusCode) {
    return reply.code(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name || 'Error',
      message: error.message,
    });
  }

  // Unknown errors - don't leak details in production
  const statusCode = 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message;

  return reply.code(statusCode).send({
    statusCode,
    error: 'Internal Server Error',
    message,
  });
}
