// Redux Store Configuration

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../api/auth.api';
import { ordersApi } from '../api/orders.api';
import { tailorsApi } from '../api/tailors.api';
import { messagingApi } from '../api/messaging.api';
import authReducer from '../features/auth/authSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [tailorsApi.reducerPath]: tailorsApi.reducer,
    [messagingApi.reducerPath]: messagingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state for serialization checks
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(
      authApi.middleware,
      ordersApi.middleware,
      tailorsApi.middleware,
      messagingApi.middleware
    ),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
