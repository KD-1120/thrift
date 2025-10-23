// Users Routes

import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  avatar: z.string().url().optional(),
});

import { users } from '../store/data';

export default async function usersRoutes(fastify: FastifyInstance) {
  // Get current user profile
  fastify.get(
    '/profile',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { uid } = (request as AuthenticatedRequest).user;

      const user = users.get(uid);

      if (!user) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'User profile not found',
        });
      }

      return { user };
    }
  );

  // Update user profile
  fastify.put(
    '/profile',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const body = updateProfileSchema.parse(request.body);
      const { uid } = (request as AuthenticatedRequest).user;

      const user = users.get(uid);

      if (!user) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'User profile not found',
        });
      }

      // Update fields
      if (body.name) user.name = body.name;
      if (body.phone) user.phone = body.phone;
      if (body.avatar) user.avatar = body.avatar;

      user.updatedAt = new Date().toISOString();
      users.set(uid, user);

      request.log.info(`User profile updated: ${uid}`);

      return { user };
    }
  );

  // Get user by ID (public)
  fastify.get(
    '/:userId',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { userId } = request.params as { userId: string };

      const user = users.get(userId);

      if (!user) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'User not found',
        });
      }

      // Return public profile only
      return {
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
        },
      };
    }
  );
}
