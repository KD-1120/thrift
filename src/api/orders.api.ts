// Orders API - Backend Integration

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './base';
import type { Order, OrderStatus, PaginatedResponse } from '../types';

export interface CreateOrderRequest {
  tailorId: string;
  garmentType: string;
  fabricType: string;
  description: string;
  measurementId?: string;
  customMeasurements?: Record<string, number>;
  referenceImages: string[];
  specialInstructions?: string;
  estimatedCost: number;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: OrderStatus;
  notes?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  tailorId?: string;
  customerId?: string;
  page?: number;
  pageSize?: number;
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Order', 'Orders'],
  endpoints: (builder) => ({
    // Create new order
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (body) => ({
        url: '/api/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Orders'],
    }),

    // Get all orders (with filters)
    getOrders: builder.query<PaginatedResponse<Order>, OrderFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        if (filters.status) params.append('status', filters.status);
        if (filters.tailorId) params.append('tailorId', filters.tailorId);
        if (filters.customerId) params.append('customerId', filters.customerId);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());

        return {
          url: `/api/orders?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Orders' as const, id: 'LIST' },
            ]
          : [{ type: 'Orders' as const, id: 'LIST' }],
    }),

    // Get single order by ID
    getOrderById: builder.query<Order, string>({
      query: (orderId) => ({
        url: `/api/orders/${orderId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    // Update order status
    updateOrderStatus: builder.mutation<Order, UpdateOrderStatusRequest>({
      query: ({ orderId, ...body }) => ({
        url: `/api/orders/${orderId}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Orders', id: 'LIST' },
      ],
    }),

    // Cancel order
    cancelOrder: builder.mutation<Order, { orderId: string; reason?: string }>({
      query: ({ orderId, reason }) => ({
        url: `/api/orders/${orderId}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Orders', id: 'LIST' },
      ],
    }),

    // Get customer orders
    getCustomerOrders: builder.query<Order[], void>({
      query: () => ({
        url: '/api/orders/customer/me',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Orders' as const, id: 'LIST' },
            ]
          : [{ type: 'Orders' as const, id: 'LIST' }],
    }),

    // Get tailor orders
    getTailorOrders: builder.query<Order[], OrderStatus | undefined>({
      query: (status) => ({
        url: status ? `/api/orders/tailor/me?status=${status}` : '/api/orders/tailor/me',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Orders' as const, id: 'LIST' },
            ]
          : [{ type: 'Orders' as const, id: 'LIST' }],
    }),

    // Update order details (for tailor)
    updateOrder: builder.mutation<Order, { orderId: string; updates: Partial<Order> }>({
      query: ({ orderId, updates }) => ({
        url: `/api/orders/${orderId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Orders', id: 'LIST' },
      ],
    }),

    // Add order note/comment
    addOrderNote: builder.mutation<void, { orderId: string; note: string }>({
      query: ({ orderId, note }) => ({
        url: `/api/orders/${orderId}/notes`,
        method: 'POST',
        body: { note },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
    }),

    // Upload additional order images
    addOrderImages: builder.mutation<void, { orderId: string; images: string[] }>({
      query: ({ orderId, images }) => ({
        url: `/api/orders/${orderId}/images`,
        method: 'POST',
        body: { images },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useGetCustomerOrdersQuery,
  useGetTailorOrdersQuery,
  useUpdateOrderMutation,
  useAddOrderNoteMutation,
  useAddOrderImagesMutation,
} = ordersApi;
