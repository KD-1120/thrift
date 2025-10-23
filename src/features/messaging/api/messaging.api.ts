// Messaging API - RTK Query for chat functionality

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../../api/base';
import type { Message } from '../../../types';

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  messageType?: 'text' | 'image';
  imageUrl?: string;
}

export const messagingApi = createApi({
  reducerPath: 'messagingApi',
  baseQuery,
  tagTypes: ['Message', 'Conversation'],
  endpoints: (builder) => ({
    // Get all conversations for current user
    getConversations: builder.query<Conversation[], void>({
      queryFn: async () => {
        // Mock data for development
        const mockConversations: Conversation[] = [
          {
            id: '1',
            participants: [
              { id: 'current-user', name: 'You' },
              { id: 'tailor-1', name: 'Grace Mensah', avatar: 'https://via.placeholder.com/100x100/96CEB4/FFFFFF?text=GM' }
            ],
            lastMessage: {
              id: 'msg-1',
              senderId: 'tailor-1',
              recipientId: 'current-user',
              content: 'Your wedding dress is ready for fitting! When would you like to come in?',
              messageType: 'text',
              read: false,
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            },
            unreadCount: 2,
            updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '2',
            participants: [
              { id: 'current-user', name: 'You' },
              { id: 'tailor-2', name: 'Kofi Asante', avatar: 'https://via.placeholder.com/100x100/45B7D1/FFFFFF?text=KA' }
            ],
            lastMessage: {
              id: 'msg-2',
              senderId: 'current-user',
              recipientId: 'tailor-2',
              content: 'Thank you for the beautiful kente suit! My client loved it.',
              messageType: 'text',
              read: true,
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            },
            unreadCount: 0,
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '3',
            participants: [
              { id: 'current-user', name: 'You' },
              { id: 'tailor-3', name: 'Ama Boateng', avatar: 'https://via.placeholder.com/100x100/FECA57/FFFFFF?text=AB' }
            ],
            lastMessage: {
              id: 'msg-3',
              senderId: 'tailor-3',
              recipientId: 'current-user',
              content: 'I\'ve started working on your corporate blazer. Should be ready by Friday.',
              messageType: 'text',
              read: false,
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            },
            unreadCount: 1,
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return { data: mockConversations };
      },
      providesTags: (result: Conversation[] | undefined) =>
        result
          ? [
              ...result.map(({ id }: Conversation) => ({ type: 'Conversation' as const, id })),
              { type: 'Conversation', id: 'LIST' },
            ]
          : [{ type: 'Conversation', id: 'LIST' }],
    }),

    // Get single conversation with messages
    getConversation: builder.query<{ conversation: Conversation; messages: Message[] }, string>({
      queryFn: async (conversationId: string) => {
        // Mock data for development
        const mockConversation: Conversation = {
          id: conversationId,
          participants: [
            { id: 'current-user', name: 'You' },
            { id: 'tailor-1', name: 'Grace Mensah', avatar: 'https://via.placeholder.com/100x100/96CEB4/FFFFFF?text=GM' }
          ],
          unreadCount: 2,
          updatedAt: new Date().toISOString(),
        };

        const mockMessages: Message[] = [
          {
            id: 'msg-1',
            senderId: 'tailor-1',
            recipientId: 'current-user',
            content: 'Hello! I received your order request. When would you like to schedule the fitting appointment?',
            messageType: 'text',
            read: true,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'msg-2',
            senderId: 'current-user',
            recipientId: 'tailor-1',
            content: 'Hi! I\'m available next Tuesday afternoon around 2 PM. Would that work for you?',
            messageType: 'text',
            read: true,
            createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'msg-3',
            senderId: 'tailor-1',
            recipientId: 'current-user',
            content: 'Perfect! Tuesday at 2 PM works great. I\'ll prepare everything for your fitting. Please bring any reference photos you have.',
            messageType: 'text',
            read: false,
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          },
        ];

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return { data: { conversation: mockConversation, messages: mockMessages } };
      },
      providesTags: (_result: any, _error: any, conversationId: string) => [
        { type: 'Conversation', id: conversationId },
        { type: 'Message', id: conversationId },
      ],
    }),

    // Send a message
    sendMessage: builder.mutation<Message, SendMessageRequest>({
      queryFn: async ({ conversationId, content, messageType }: SendMessageRequest) => {
        // Mock implementation for development
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          senderId: 'current-user',
          recipientId: 'tailor-1',
          content,
          messageType: messageType || 'text',
          read: false,
          createdAt: new Date().toISOString(),
        };

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return { data: newMessage };
      },
      invalidatesTags: (_result: any, _error: any, { conversationId }: SendMessageRequest) => [
        { type: 'Conversation', id: conversationId },
        { type: 'Conversation', id: 'LIST' },
        { type: 'Message', id: conversationId },
      ],
    }),

    // Mark messages as read
    markAsRead: builder.mutation<void, string>({
      queryFn: async (conversationId: string) => {
        // Mock implementation for development
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));

        return { data: undefined };
      },
      invalidatesTags: (_result: any, _error: any, conversationId: string) => [
        { type: 'Conversation', id: conversationId },
        { type: 'Conversation', id: 'LIST' },
      ],
    }),

    // Start new conversation with tailor
    startConversation: builder.mutation<Conversation, { tailorId: string; initialMessage?: string }>({
      queryFn: async ({ tailorId, initialMessage }: { tailorId: string; initialMessage?: string }) => {
        // Mock implementation for development
        const newConversation: Conversation = {
          id: `conv-${Date.now()}`,
          participants: [
            { id: 'current-user', name: 'You' },
            { id: tailorId, name: 'Tailor', avatar: 'https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=T' }
          ],
          lastMessage: initialMessage ? {
            id: `msg-${Date.now()}`,
            senderId: 'current-user',
            recipientId: tailorId,
            content: initialMessage,
            messageType: 'text',
            read: false,
            createdAt: new Date().toISOString(),
          } : undefined,
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        };

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        return { data: newConversation };
      },
      invalidatesTags: [{ type: 'Conversation', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useStartConversationMutation,
} = messagingApi;