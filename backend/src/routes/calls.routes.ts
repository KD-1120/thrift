import { FastifyInstance } from 'fastify';
// import { StreamVideoClient } from '@stream-io/node-sdk';

// Initialize Stream client
// TODO: Fix StreamVideoClient API - constructor parameters have changed
// const streamClient = new StreamVideoClient({
//   apiKey: process.env.STREAM_API_KEY || 'your-api-key',
//   secret: process.env.STREAM_API_SECRET || 'your-api-secret',
// });

interface TokenQueryParams {
  userId?: string;
  userName?: string;
}

interface CreateCallBody {
  callId: string;
  createdBy: string;
  participants: string[];
}

interface CallIdParams {
  callId: string;
}

export default async function callsRoutes(fastify: FastifyInstance) {
  // Generate call token for user
  fastify.get<{ Querystring: TokenQueryParams }>('/calls/token', async (request, reply) => {
    try {
      // In production, get this from authenticated user
      const userId = request.query.userId || 'user-123';
      const userName = request.query.userName || 'Guest User';

      // TODO: Fix StreamVideoClient API
      // Generate token with expiration
      // const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      // const token = streamClient.createToken(userId, expirationTime);

      // Mock token for now
      const token = `mock-token-${userId}-${Date.now()}`;

      return {
        token,
        apiKey: process.env.STREAM_API_KEY,
        userId,
        userName,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to generate call token' });
    }
  });

  // Create a new call
  fastify.post<{ Body: CreateCallBody }>('/calls/create', async (request, reply) => {
    try {
      const { callId, createdBy, participants } = request.body;

      // In production, validate user permissions here

      return {
        success: true,
        callId,
        createdBy,
        participants,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create call' });
    }
  });

  // End a call
  fastify.post<{ Params: CallIdParams }>('/calls/:callId/end', async (request, reply) => {
    try {
      const { callId } = request.params;

      // In production, validate user permissions and update database

      return {
        success: true,
        callId,
        endedAt: new Date().toISOString(),
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to end call' });
    }
  });
}
