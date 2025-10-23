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
      query: () => '/api/messaging/conversations',
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
      query: (conversationId) => `/api/messaging/conversations/${conversationId}`,
      providesTags: (_result: any, _error: any, conversationId: string) => [
        { type: 'Conversation', id: conversationId },
        { type: 'Message', id: conversationId },
      ],
    }),

    // Send a message
    sendMessage: builder.mutation<Message, SendMessageRequest>({
      query: ({ conversationId, ...body }) => ({
        url: `/api/messaging/conversations/${conversationId}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result: any, _error: any, { conversationId }: SendMessageRequest) => [
        { type: 'Conversation', id: conversationId },
        { type: 'Conversation', id: 'LIST' },
        { type: 'Message', id: conversationId },
      ],
    }),

    // Mark messages as read
    markAsRead: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/api/messaging/conversations/${conversationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: (_result: any, _error: any, conversationId: string) => [
        { type: 'Conversation', id: conversationId },
        { type: 'Conversation', id: 'LIST' },
      ],
    }),

    // Start new conversation with tailor
    startConversation: builder.mutation<Conversation, { tailorId: string; initialMessage?: string }>({
      query: (body) => ({
        url: '/api/messaging/conversations',
        method: 'POST',
        body,
      }),
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