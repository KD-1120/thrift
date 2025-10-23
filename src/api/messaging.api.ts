// Messaging API endpoints using RTK Query

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './base';

// Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  timestamp: string;
  isRead: boolean;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
  };
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  tailorId: string;
  tailorName: string;
  tailorAvatar?: string;
}

export interface Call {
  id: string;
  callerId: string;
  receiverId: string;
  callType: 'audio' | 'video';
  status: 'initiated' | 'ringing' | 'connected' | 'ended';
  startTime?: string;
  endTime?: string;
  duration?: number;
}

// API endpoints
export const messagingApi = createApi({
  reducerPath: 'messagingApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Conversations', 'Messages', 'Calls'],
  endpoints: (builder) => ({
    // Conversations
    getConversations: builder.query<Conversation[], void>({
      query: () => '/api/messaging/conversations',
      providesTags: ['Conversations'],
    }),

    getConversation: builder.query<Conversation, string>({
      query: (conversationId) => `/api/messaging/conversations/${conversationId}`,
      providesTags: (result, error, id) => [{ type: 'Conversations', id }],
    }),

    createConversation: builder.mutation<Conversation, { tailorId: string }>({
      query: (body) => ({
        url: '/api/messaging/conversations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Conversations'],
    }),

    // Messages
    getMessages: builder.query<Message[], string>({
      query: (conversationId) => `/api/messaging/conversations/${conversationId}/messages`,
      providesTags: (result, error, conversationId) => [
        { type: 'Messages', id: conversationId },
      ],
    }),

    sendMessage: builder.mutation<Message, {
      conversationId: string;
      content: string;
      messageType?: 'text' | 'image' | 'file';
      metadata?: any;
    }>({
      query: ({ conversationId, ...body }) => ({
        url: `/api/messaging/conversations/${conversationId}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'Messages', id: conversationId },
        'Conversations',
      ],
    }),

    markMessagesAsRead: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/api/messaging/conversations/${conversationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Conversations'],
    }),

    // Calls
    initiateCall: builder.mutation<Call, {
      receiverId: string;
      callType: 'audio' | 'video';
    }>({
      query: (body) => ({
        url: '/api/messaging/calls',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Calls'],
    }),

    getCallHistory: builder.query<Call[], void>({
      query: () => '/api/messaging/calls',
      providesTags: ['Calls'],
    }),

    endCall: builder.mutation<void, string>({
      query: (callId) => ({
        url: `/api/messaging/calls/${callId}/end`,
        method: 'POST',
      }),
      invalidatesTags: ['Calls'],
    }),

    // File upload for messages
    uploadFile: builder.mutation<{ url: string; fileName: string }, FormData>({
      query: (formData) => ({
        url: '/api/messaging/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  useInitiateCallMutation,
  useGetCallHistoryQuery,
  useEndCallMutation,
  useUploadFileMutation,
} = messagingApi;