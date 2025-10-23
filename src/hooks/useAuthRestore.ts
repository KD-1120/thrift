// Hook for restoring authentication session on app startup

import { useEffect, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { restoreSession, setLoading } from '../features/auth/authSlice';
import { getStoredAuthToken, getStoredUserData } from '../api/base';
import { auth } from '../services/firebase';

export function useAuthRestore() {
  const dispatch = useAppDispatch();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const restoreAuthSession = async () => {
      try {
        dispatch(setLoading(true));

        // Wait for Firebase to initialize and determine auth state
        // This prevents the flash of onboarding screen
        await new Promise<void>((resolve) => {
          unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            try {
              if (firebaseUser) {
                // Firebase user exists - check if we have stored user data
                const [storedToken, storedUserData] = await Promise.all([
                  getStoredAuthToken(),
                  getStoredUserData(),
                ]);

                if (storedToken && storedUserData) {
                  // Get fresh token and restore session
                  const freshToken = await firebaseUser.getIdToken();
                  dispatch(restoreSession({
                    user: storedUserData,
                    token: freshToken,
                  }));
                } else {
                  // Firebase user exists but no stored data - might be first time
                  // Let the app flow through normal auth
                }
              }
              // else: No Firebase user - user needs to sign in
            } catch (error) {
              console.error('Error in auth state restoration:', error);
            } finally {
              // Auth state is determined - stop loading
              resolve();
            }
          });
        });
      } catch (error) {
        console.error('Error restoring auth session:', error);
      } finally {
        setIsRestoring(false);
        dispatch(setLoading(false));
        
        // Clean up the listener
        if (unsubscribe) {
          unsubscribe();
        }
      }
    };

    restoreAuthSession();

    // Cleanup on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [dispatch]);

  return { isRestoring };
}
