// Firebase Auth State Observer

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { restoreSession, logout } from '../features/auth/authSlice';
import { auth } from '../services/firebase';
import { getStoredUserData, clearStoredAuthSession } from '../api/base';

/**
 * Hook to listen to Firebase auth state changes and sync with Redux
 * This ensures the app stays in sync when Firebase auth state changes
 * (e.g., token refresh, session expiry, manual logout)
 * Note: This runs AFTER initial restoration to avoid conflicts
 */
export function useFirebaseAuthObserver() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Skip first auth state change (handled by useAuthRestore)
    // Only listen for subsequent changes
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      // Skip the first call - useAuthRestore handles initial state
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        return;
      }

      if (firebaseUser) {
        // User is signed in - get fresh token and update session if needed
        try {
          const token = await firebaseUser.getIdToken();
          const storedUserData = await getStoredUserData();

          if (storedUserData) {
            // Only update if not already authenticated (prevents unnecessary renders)
            if (!isAuthenticated) {
              dispatch(restoreSession({
                user: storedUserData,
                token,
              }));
            }
          }
        } catch (error) {
          console.error('Error handling Firebase auth state change:', error);
        }
      } else {
        // User is signed out - clear local session only if currently authenticated
        if (isAuthenticated) {
          await clearStoredAuthSession();
          dispatch(logout());
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch, isAuthenticated]);
}
