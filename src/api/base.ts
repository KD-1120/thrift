// RTK Query Base Configuration

import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query';
import { fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../services/firebase';

const AUTH_TOKEN_KEY = 'authToken';
const FIREBASE_UID_KEY = 'firebaseUid';
const USER_DATA_KEY = 'userData';

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://api.thriftaccra.com';
const sanitizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');

export const API_BASE_URL = sanitizedBaseUrl;

// Cross-platform secure storage
const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  
  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: sanitizedBaseUrl,
  prepareHeaders: async (headers) => {
    try {
      const token = await secureStorage.getItem(AUTH_TOKEN_KEY);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    } catch (error) {
      console.error('Error accessing auth token from secure storage:', error);
      return headers;
    }
  },
});

export const baseQuery = rawBaseQuery;

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshedToken = await refreshAuthToken();

    if (refreshedToken) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      await clearStoredAuthSession();
    }
  }

  return result;
};

async function refreshAuthToken(): Promise<string | null> {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return null;
    }

    const token = await currentUser.getIdToken(true);
    await storeAuthToken(token);
    return token;
  } catch (error) {
    console.error('Error refreshing Firebase auth token:', error);
    return null;
  }
}

export async function storeAuthToken(token: string) {
  await secureStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function storeFirebaseUid(uid: string) {
  await secureStorage.setItem(FIREBASE_UID_KEY, uid);
}

export async function storeUserData(userData: any) {
  await secureStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

export async function getStoredUserData(): Promise<any | null> {
  try {
    const data = await secureStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    return null;
  }
}

export async function clearStoredAuthSession() {
  await secureStorage.deleteItem(AUTH_TOKEN_KEY);
  await secureStorage.deleteItem(FIREBASE_UID_KEY);
  await secureStorage.deleteItem(USER_DATA_KEY);
}

export function getStoredAuthToken() {
  return secureStorage.getItem(AUTH_TOKEN_KEY);
}

export function getStoredFirebaseUid() {
  return secureStorage.getItem(FIREBASE_UID_KEY);
}
