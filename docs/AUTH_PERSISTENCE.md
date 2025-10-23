# Authentication Persistence Implementation

## Overview
Implemented full authentication persistence so users stay logged in across app restarts. The implementation uses secure storage (SecureStore on native, AsyncStorage on web) and Firebase auth state synchronization.

## What Was Implemented

### 1. **Secure User Data Storage** (`src/api/base.ts`)
- Added `USER_DATA_KEY` constant for storing user profile data
- Created `storeUserData()` - Saves user profile to secure storage as JSON
- Created `getStoredUserData()` - Retrieves and parses stored user data
- Updated `clearStoredAuthSession()` - Now clears token, Firebase UID, and user data

### 2. **Auth Slice Rehydration** (`src/features/auth/authSlice.ts`)
- Added `restoreSession` action - Restores user and token from storage into Redux state
- Exported new action for use in restoration hooks

### 3. **Auth API Data Persistence** (`src/api/auth.api.ts`)
- Updated `signUp` mutation - Now calls `storeUserData(data.user)` after successful registration
- Updated `signIn` mutation - Now calls `storeUserData(data.user)` after successful login
- Ensures user profile is persisted alongside auth token

### 4. **Session Restoration Hook** (`src/hooks/useAuthRestore.ts`)
- Created `useAuthRestore()` hook - Runs on app startup to check for existing session
- Checks secure storage for token and user data
- Verifies Firebase auth state is valid
- Dispatches `restoreSession` action if valid session found
- Returns `isRestoring` boolean for loading state

### 5. **Firebase Auth State Observer** (`src/hooks/useFirebaseAuthObserver.ts`)
- Created `useFirebaseAuthObserver()` hook - Listens to Firebase auth state changes
- Syncs Redux state with Firebase auth state in real-time
- Handles token refresh automatically
- Clears local session if Firebase signs out
- Prevents auth state drift between Firebase and Redux

### 6. **App Entry Point Updates** (`App.tsx`)
- Added `AppContent` component that uses restoration hooks
- Shows loading spinner while checking for stored session
- Integrated Firebase auth observer to keep state synchronized
- Graceful loading state during session restoration

## How It Works

### **Initial App Launch (First Time)**
1. App shows loading spinner
2. `useAuthRestore` waits for Firebase auth initialization
3. Firebase reports no authenticated user
4. `isRestoring` becomes `false` → Shows auth screens (Onboarding, Sign In)
5. User signs in → Token and user data stored in secure storage
6. Redux state updated with `setCredentials`

### **App Restart (With Valid Session)**
1. App shows loading spinner (no flash of onboarding!)
2. `useAuthRestore` waits for Firebase auth initialization
3. Firebase reports authenticated user exists
4. Retrieves stored user data from secure storage
5. Gets fresh token from Firebase
6. Dispatches `restoreSession` → Redux state restored
7. `isRestoring` becomes `false` → Shows main app screens directly (skips auth)
8. `useFirebaseAuthObserver` monitors for future auth state changes

### **Key UX Improvement**
- **Before**: Loader → Flash of onboarding → Main app ❌
- **After**: Loader → Main app directly ✅
- The loader now waits for Firebase auth state initialization before completing
- Uses `onAuthStateChanged` as a Promise to ensure synchronous auth determination
- Navigation only renders after auth state is fully resolved

### **Token Refresh Flow**
1. Firebase automatically refreshes expired tokens
2. `useFirebaseAuthObserver` detects auth state change
3. Gets fresh token from Firebase
4. Updates Redux state with new token
5. RTK Query automatically uses new token for API calls

### **Logout Flow**
1. User taps logout
2. Calls `authApi.useLogoutMutation()`
3. Signs out from Firebase
4. Clears secure storage (token, UID, user data)
5. Dispatches `logout` action
6. Redux state cleared → Shows auth screens

## Storage Keys
- `authToken` - Firebase ID token (JWT)
- `firebaseUid` - Firebase user ID
- `userData` - JSON string of user profile (`User` type)

## Security Features
- **Native**: Uses Expo SecureStore (encrypted keychain/keystore)
- **Web**: Uses AsyncStorage (localStorage wrapper)
- **Token Refresh**: Automatic via Firebase and RTK Query interceptor
- **Secure Deletion**: All auth data cleared on logout

## Testing Checklist
- [x] Code implementation complete
- [ ] Sign in as customer → Close app → Reopen → Should stay logged in
- [ ] Sign in as tailor → Close app → Reopen → Should stay logged in
- [ ] Sign in → Logout → Close app → Reopen → Should show auth screens
- [ ] Token expires → Should auto-refresh without sign-out
- [ ] Firebase auth state changes → Redux should sync automatically

## Files Modified
1. `src/api/base.ts` - Added user data storage utilities
2. `src/features/auth/authSlice.ts` - Added restoreSession action
3. `src/api/auth.api.ts` - Store user data on sign in/up
4. `App.tsx` - Added restoration hooks and loading state
5. `src/hooks/useAuthRestore.ts` - New file (session restoration)
6. `src/hooks/useFirebaseAuthObserver.ts` - New file (Firebase sync)

## Next Steps
1. Test the flow: Sign in → Close app → Reopen to verify persistence
2. Test logout: Ensure storage is cleared and auth screens appear
3. Test token refresh: Leave app open for extended period to verify auto-refresh
4. Consider adding biometric authentication (Face ID/Touch ID) for additional security

## Notes
- The implementation handles both native (iOS/Android) and web platforms
- Firebase auth state is the source of truth
- Redux state is synchronized with Firebase automatically
- Token refresh is handled transparently by Firebase and RTK Query
