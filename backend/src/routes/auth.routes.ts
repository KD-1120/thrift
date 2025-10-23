// Authentication Routes

import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';
import { users, tailors, tailorReviews, TailorProfile } from '../store/data';

// Validation schemas
const registerSchema = z.object({
  firebaseUid: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().min(10),
  role: z.enum(['customer', 'tailor']),
});

const loginSchema = z.object({
  firebaseUid: z.string(),
  email: z.string().email(),
  role: z.enum(['customer', 'tailor']).optional(), // Make role optional for login
});

export default async function authRoutes(fastify: FastifyInstance) {
  // Register new user
  fastify.post(
    '/register',
    {
      preHandler: authenticate,
    },
    async (request: FastifyRequest, reply) => {
      const body = registerSchema.parse(request.body);
      const { uid } = (request as AuthenticatedRequest).user;

      // Check if user already exists
      if (users.has(uid)) {
        return reply.code(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: 'User already exists',
        });
      }

      // Create user
      const user = {
        id: uid,
        email: body.email,
        name: body.name,
        phone: body.phone,
        role: body.role,
        avatar: null,
        createdAt: new Date().toISOString(),
        hasCompletedOnboarding: false,
      };

      users.set(uid, user);

      request.log.info(`User registered: ${uid}`);

      if (body.role === 'tailor' && !tailors.has(uid)) {
        const newTailorProfile: TailorProfile = {
          id: uid,
          userId: uid,
          businessName: `${body.name}'s Atelier`,
          description:
            'Update your tailor profile with specialties, portfolio highlights, and pricing to start attracting clients.',
          avatar: null,
          rating: 0,
          reviewCount: 0,
          specialties: [],
          location: {
            address: '',
            city: '',
            region: '',
            coordinates: undefined,
          },
          portfolio: [],
          priceRange: { min: 0, max: 0 },
          turnaroundTime: '7-14 days',
          verified: false,
        };

        tailors.set(uid, newTailorProfile);
        if (!tailorReviews.has(uid)) {
          tailorReviews.set(uid, []);
        }
      }

      return reply.code(201).send({ user });
    }
  );

  // Login (sync with backend)
  fastify.post(
    '/login',
    {
      preHandler: authenticate,
    },
    async (request: FastifyRequest, reply) => {
      // Validate request body (validation is the purpose, variable intentionally unused)
      loginSchema.parse(request.body);
      const { uid, email, name } = (request as AuthenticatedRequest).user;

      let user = users.get(uid);

      // If user doesn't exist in backend, auto-create them
      if (!user) {
        // Use role from request body, or default to customer
        const requestedRole = (request.body as any)?.role;
        const defaultRole: 'customer' | 'tailor' = requestedRole === 'tailor' ? 'tailor' : 'customer';

        user = {
          id: uid,
          email: email || '',
          name: name || email?.split('@')[0] || 'User',
          phone: '',
          role: defaultRole,
          avatar: null,
          createdAt: new Date().toISOString(),
          hasCompletedOnboarding: false,
        };

        users.set(uid, user);

        // Create tailor profile if role is tailor
        if (defaultRole === 'tailor' && !tailors.has(uid)) {
          const newTailorProfile: TailorProfile = {
            id: uid,
            userId: uid,
            businessName: `${name || 'New Tailor'}'s Atelier`,
            description:
              'Update your tailor profile with specialties, portfolio highlights, and pricing to start attracting clients.',
            avatar: null,
            rating: 0,
            reviewCount: 0,
            specialties: [],
            location: {
              address: '',
              city: '',
              region: '',
              coordinates: undefined,
            },
            portfolio: [],
            priceRange: { min: 0, max: 0 },
            turnaroundTime: '7-14 days',
            verified: false,
          };

          tailors.set(uid, newTailorProfile);
          if (!tailorReviews.has(uid)) {
            tailorReviews.set(uid, []);
          }
        }

        request.log.info(`Auto-registered user: ${uid} (${email}) as ${defaultRole}`);
      }

      request.log.info(`User logged in: ${uid}`);

      return reply.send({ user });
    }
  );
}
