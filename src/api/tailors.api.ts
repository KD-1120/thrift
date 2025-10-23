// Tailors API - RTK Query

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './base';
import type { Tailor, PaginatedResponse, TailorReview, TailorReviewResponse } from '../types';

export const tailorsApi = createApi({
  reducerPath: 'tailorsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Tailor', 'Portfolio', 'TailorReviews'],
  endpoints: (builder) => ({
    // Get all tailors with pagination and filters
    getTailors: builder.query<
      PaginatedResponse<Tailor>,
      {
        page?: number;
        pageSize?: number;
        specialties?: string[];
        minRating?: number;
        search?: string;
        sortBy?: string;
        priceRange?: string;
      }
    >({
      query: ({ page = 1, pageSize = 20, specialties, minRating, search, sortBy, priceRange }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });
        
        if (specialties?.length) {
          params.append('specialties', specialties.join(','));
        }
        if (minRating) {
          params.append('minRating', minRating.toString());
        }
        if (search) {
          params.append('search', search);
        }
        if (sortBy) {
          params.append('sortBy', sortBy);
        }
        if (priceRange) {
          params.append('priceRange', priceRange);
        }
        
        return `/api/tailors?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Tailor' as const, id })),
              { type: 'Tailor', id: 'LIST' },
            ]
          : [{ type: 'Tailor', id: 'LIST' }],
    }),

    // Get single tailor by ID
    getTailor: builder.query<Tailor, string>({
      query: (id) => `/api/tailors/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Tailor', id }],
    }),

    // Search tailors
    searchTailors: builder.query<PaginatedResponse<Tailor>, string>({
      query: (searchTerm) => `/api/tailors?search=${encodeURIComponent(searchTerm)}`,
      providesTags: [{ type: 'Tailor', id: 'SEARCH' }],
    }),

    // Get nearby tailors
    getNearbyTailors: builder.query<
      Tailor[],
      { latitude: number; longitude: number; radius?: number }
    >({
      query: ({ latitude, longitude, radius = 10 }) =>
        `/api/tailors/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`,
      providesTags: [{ type: 'Tailor', id: 'NEARBY' }],
    }),

    // Update tailor profile (for tailor users)
    updateTailorProfile: builder.mutation<Tailor, { id: string; data: Partial<Tailor> }>({
      query: ({ id, data }) => ({
        url: `/api/tailors/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Tailor', id }],
    }),

    // Add portfolio item
    addPortfolioItem: builder.mutation<
      Tailor,
      { tailorId: string; item: Omit<Tailor['portfolio'][0], 'id'> }
    >({
      query: ({ tailorId, item }) => ({
        url: `/api/tailors/${tailorId}/portfolio`,
        method: 'POST',
        body: item,
      }),
      invalidatesTags: (_result, _error, { tailorId }) => [
        { type: 'Tailor', id: tailorId },
        { type: 'Portfolio', id: tailorId },
      ],
    }),

    // Delete portfolio item
    deletePortfolioItem: builder.mutation<void, { tailorId: string; itemId: string }>({
      query: ({ tailorId, itemId }) => ({
        url: `/api/tailors/${tailorId}/portfolio/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { tailorId }) => [
        { type: 'Tailor', id: tailorId },
        { type: 'Portfolio', id: tailorId },
      ],
    }),

    // Get tailor reviews and summary metrics
    getTailorReviews: builder.query<TailorReviewResponse, string>({
      query: (tailorId) => `/api/tailors/${tailorId}/reviews`,
      providesTags: (_result, _error, tailorId) => [
        { type: 'TailorReviews', id: tailorId },
        { type: 'Tailor', id: tailorId },
      ],
    }),

    // Respond to a review
    respondToTailorReview: builder.mutation<
      TailorReview,
      { tailorId: string; reviewId: string; response: string }
    >({
      query: ({ tailorId, reviewId, response }) => ({
        url: `/api/tailors/${tailorId}/reviews/${reviewId}/respond`,
        method: 'POST',
        body: { response },
      }),
      invalidatesTags: (_result, _error, { tailorId }) => [
        { type: 'TailorReviews', id: tailorId },
        { type: 'Tailor', id: tailorId },
      ],
    }),
  }),
});

export const {
  useGetTailorsQuery,
  useGetTailorQuery,
  useSearchTailorsQuery,
  useGetNearbyTailorsQuery,
  useUpdateTailorProfileMutation,
  useAddPortfolioItemMutation,
  useDeletePortfolioItemMutation,
  useGetTailorReviewsQuery,
  useRespondToTailorReviewMutation,
} = tailorsApi;
