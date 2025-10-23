// Authentication API - Integrates Firebase Auth with Backend

import { createApi } from '@reduxjs/toolkit/query/react';
import {
  API_BASE_URL,
  baseQueryWithReauth,
  clearStoredAuthSession,
  storeAuthToken,
  storeFirebaseUid,
  storeUserData,
} from './base';
import { authService } from '../services/firebase';
import type { User } from '../types';

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'customer' | 'tailor';
}

export interface SignInRequest {
  email: string;
  password: string;
  role?: 'customer' | 'tailor'; // Optional role for login
}

export interface AuthResponse {
  user: User;
  token: string;
}

const jsonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

async function requestBackend<T>(
  path: string,
  token: string,
  init: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let message = 'Backend request failed';

    try {
      const errorBody = await response.json();
      message = errorBody?.message || message;
    } catch (error) {
      // Ignore JSON parse errors and fall back to default message
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Sign up - Firebase + Backend sync
    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      async queryFn(args) {
        try {
          // 1. Create user in Firebase Auth
          const firebaseUser = await authService.signUp(
            args.email,
            args.password,
            args.name
          );

          // 2. Get Firebase ID token
          const idToken = await firebaseUser.getIdToken();

          // 3. Create user profile in backend
          const data = await requestBackend<{ user: User }>(
            '/api/auth/register',
            idToken,
            {
              method: 'POST',
              body: JSON.stringify({
                firebaseUid: firebaseUser.uid,
                email: args.email,
                name: args.name,
                phone: args.phone,
                role: args.role,
              }),
            }
          );

          // 4. Store token and user data securely
          await storeAuthToken(idToken);
          await storeFirebaseUid(firebaseUser.uid);
          await storeUserData(data.user);

          return {
            data: {
              user: data.user,
              token: idToken,
            },
          };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),

    // Sign in - Firebase + Backend sync
    signIn: builder.mutation<AuthResponse, SignInRequest>({
      async queryFn(args) {
        try {
          // 1. Authenticate with Firebase
          const firebaseUser = await authService.signIn(args.email, args.password);

          // 2. Get Firebase ID token
          const idToken = await firebaseUser.getIdToken();

          // 3. Fetch user profile from backend
          const data = await requestBackend<{ user: User }>(
            '/api/auth/login',
            idToken,
            {
              method: 'POST',
              body: JSON.stringify({
                firebaseUid: firebaseUser.uid,
                email: args.email,
                role: args.role, // Include role in login request
              }),
            }
          );

          // 4. Store token and user data securely
          await storeAuthToken(idToken);
          await storeFirebaseUid(firebaseUser.uid);
          await storeUserData(data.user);

          return {
            data: {
              user: data.user,
              token: idToken,
            },
          };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),

    // Logout
    logout: builder.mutation<void, void>({
      async queryFn() {
        try {
          // 1. Sign out from Firebase
          await authService.signOut();

          // 2. Clear stored tokens
          await clearStoredAuthSession();

          return { data: undefined };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),

    // Forgot password
    forgotPassword: builder.mutation<void, { email: string }>({
      async queryFn(args) {
        try {
          await authService.resetPassword(args.email);
          return { data: undefined };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),

    // Get current user profile
    getProfile: builder.query<User, void>({
      query: () => ({
        url: '/api/users/profile',
        method: 'GET',
      }),
      transformResponse: (response: { user: User }) => response.user,
    }),

    // Update user profile
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: '/api/users/profile',
        method: 'PUT',
        body,
      }),
      transformResponse: (response: { user: User }) => response.user,
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;
