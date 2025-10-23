// Messaging Routes - Conversations and Messages

import { FastifyInstance, FastifyRequest } from 'fastify';
import { conversations, messages, users } from '../store/data';

interface AuthRequest extends FastifyRequest {
  user?: {
    uid: string;
    email: string;
  };
}

interface ConversationParams {
  conversationId: string;
}

interface CreateConversationBody {
  tailorId: string;
}

interface SendMessageParams {
  conversationId: string;
}

interface SendMessageBody {
  content: string;
  messageType?: 'text' | 'image' | 'file';
  metadata?: any;
}

export default async function messagingRoutes(fastify: FastifyInstance) {
  // Get all conversations for current user
  fastify.get('/api/messaging/conversations', {
    preHandler: (fastify as any).authenticate,
  }, async (request: AuthRequest, reply) => {
    try {
      const userId = request.user?.uid;
      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      // Find all conversations where user is a participant
      const userConversations = conversations.filter((conv: any) =>
        conv.participants.includes(userId)
      );

      // Enrich conversations with participant details and last message
      const enrichedConversations = userConversations.map((conv: any) => {
        // Get other participant (not the current user)
        const otherParticipantId = conv.participants.find((id: string) => id !== userId);
        const otherParticipant = users.get(otherParticipantId || '');

        // Get last message
        const conversationMessages = messages.filter((m: any) => m.conversationId === conv.id);
        const lastMessage = conversationMessages[conversationMessages.length - 1];

        // Count unread messages
        const unreadCount = conversationMessages.filter(
          (m: any) => m.senderId !== userId && !m.read
        ).length;

        return {
          id: conv.id,
          participants: conv.participants.map((pId: string) => {
            const participant = users.get(pId);
            return {
              id: participant?.id || pId,
              name: participant?.name || 'Unknown',
              avatar: participant?.avatar || null,
            };
          }),
          lastMessage: lastMessage ? {
            id: lastMessage.id,
            content: lastMessage.content,
            senderId: lastMessage.senderId,
            timestamp: lastMessage.createdAt,
          } : undefined,
          unreadCount,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          tailorId: otherParticipantId || '',
          tailorName: otherParticipant?.name || 'Unknown',
          tailorAvatar: otherParticipant?.avatar || null,
        };
      });

      // Sort by most recent activity
      enrichedConversations.sort((a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      return reply.send(enrichedConversations);
    } catch (error) {
      console.error('Get conversations error:', error);
      return reply.code(500).send({ error: 'Failed to fetch conversations' });
    }
  });

  // Get single conversation
  fastify.get<{ Params: ConversationParams }>(
    '/api/messaging/conversations/:conversationId',
    { preHandler: (fastify as any).authenticate },
    async (request: AuthRequest & { params: ConversationParams }, reply) => {
      try {
        const userId = request.user?.uid;
        const { conversationId } = request.params;

        if (!userId) {
          return reply.code(401).send({ error: 'Unauthorized' });
        }

        const conversation = conversations.find((c: any) => c.id === conversationId);
        if (!conversation) {
          return reply.code(404).send({ error: 'Conversation not found' });
        }

        // Verify user is a participant
        if (!conversation.participants.includes(userId)) {
          return reply.code(403).send({ error: 'Access denied' });
        }

        return reply.send(conversation);
      } catch (error) {
        console.error('Get conversation error:', error);
        return reply.code(500).send({ error: 'Failed to fetch conversation' });
      }
    }
  );

  // Create new conversation
  fastify.post<{ Body: CreateConversationBody }>(
    '/api/messaging/conversations',
    { preHandler: (fastify as any).authenticate },
    async (request: AuthRequest & { body: CreateConversationBody }, reply) => {
      try {
        const userId = request.user?.uid;
        const { tailorId } = request.body;

        if (!userId) {
          return reply.code(401).send({ error: 'Unauthorized' });
        }

        // Check if conversation already exists
        const existingConversation = conversations.find((conv: any) =>
          conv.participants.includes(userId) && conv.participants.includes(tailorId)
        );

        if (existingConversation) {
          return reply.send(existingConversation);
        }

        // Create new conversation
        const newConversation = {
          id: `conv_${Date.now()}`,
          participants: [userId, tailorId],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        conversations.push(newConversation);

        return reply.code(201).send(newConversation);
      } catch (error) {
        console.error('Create conversation error:', error);
        return reply.code(500).send({ error: 'Failed to create conversation' });
      }
    }
  );

  // Get messages for a conversation
  fastify.get<{ Params: ConversationParams }>(
    '/api/messaging/conversations/:conversationId/messages',
    { preHandler: (fastify as any).authenticate },
    async (request: AuthRequest & { params: ConversationParams }, reply) => {
      try {
        const userId = request.user?.uid;
        const { conversationId } = request.params;

        if (!userId) {
          return reply.code(401).send({ error: 'Unauthorized' });
        }

        const conversation = conversations.find((c: any) => c.id === conversationId);
        if (!conversation) {
          return reply.code(404).send({ error: 'Conversation not found' });
        }

        // Verify user is a participant
        if (!conversation.participants.includes(userId)) {
          return reply.code(403).send({ error: 'Access denied' });
        }

        // Get all messages for this conversation
        const conversationMessages = messages
          .filter((m: any) => m.conversationId === conversationId)
          .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        return reply.send(conversationMessages);
      } catch (error) {
        console.error('Get messages error:', error);
        return reply.code(500).send({ error: 'Failed to fetch messages' });
      }
    }
  );

  // Send message
  fastify.post<{ Params: SendMessageParams; Body: SendMessageBody }>(
    '/api/messaging/conversations/:conversationId/messages',
    { preHandler: (fastify as any).authenticate },
    async (request: AuthRequest & { params: SendMessageParams; body: SendMessageBody }, reply) => {
      try {
        const userId = request.user?.uid;
        const { conversationId } = request.params;
        const { content, messageType = 'text', metadata } = request.body;

        if (!userId) {
          return reply.code(401).send({ error: 'Unauthorized' });
        }

        const conversation = conversations.find((c: any) => c.id === conversationId);
        if (!conversation) {
          return reply.code(404).send({ error: 'Conversation not found' });
        }

        // Verify user is a participant
        if (!conversation.participants.includes(userId)) {
          return reply.code(403).send({ error: 'Access denied' });
        }

        // Create new message
        const newMessage = {
          id: `msg_${Date.now()}`,
          conversationId,
          senderId: userId,
          recipientId: conversation.participants.find((id: string) => id !== userId),
          content,
          messageType,
          metadata,
          read: false,
          createdAt: new Date().toISOString(),
        };

        messages.push(newMessage);

        // Update conversation's updatedAt
        conversation.updatedAt = new Date().toISOString();

        return reply.code(201).send(newMessage);
      } catch (error) {
        console.error('Send message error:', error);
        return reply.code(500).send({ error: 'Failed to send message' });
      }
    }
  );

  // Mark messages as read
  fastify.post<{ Params: ConversationParams }>(
    '/api/messaging/conversations/:conversationId/read',
    { preHandler: (fastify as any).authenticate },
    async (request: AuthRequest & { params: ConversationParams }, reply) => {
      try {
        const userId = request.user?.uid;
        const { conversationId } = request.params;

        if (!userId) {
          return reply.code(401).send({ error: 'Unauthorized' });
        }

        const conversation = conversations.find((c: any) => c.id === conversationId);
        if (!conversation) {
          return reply.code(404).send({ error: 'Conversation not found' });
        }

        // Verify user is a participant
        if (!conversation.participants.includes(userId)) {
          return reply.code(403).send({ error: 'Access denied' });
        }

        // Mark all messages from other participant as read
        messages.forEach((m: any) => {
          if (m.conversationId === conversationId && m.senderId !== userId) {
            m.read = true;
          }
        });

        return reply.send({ success: true });
      } catch (error) {
        console.error('Mark messages as read error:', error);
        return reply.code(500).send({ error: 'Failed to mark messages as read' });
      }
    }
  );
}
