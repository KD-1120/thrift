// Authentication Middleware - Verify Firebase ID tokens

import { FastifyRequest, FastifyReply } from 'fastify';
import { auth } from '../services/firebase-admin';

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    uid: string;
    email: string | undefined;
    name: string | undefined;
  };
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (!idToken) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'No token provided',
      });
    }

    // Verify the ID token
    const decodedToken = await auth().verifyIdToken(idToken);

    // Attach user info to request
    (request as AuthenticatedRequest).user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };
  } catch (error: any) {
    request.log.error('Token verification error:', error);

    return reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
}
