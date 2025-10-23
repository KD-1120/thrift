# Auth Persistence UX Fix - No More Screen Flash!

## Problem Fixed
The loader was completing before Firebase auth state was fully initialized, causing a split-second flash of the onboarding screen even when the user was logged in. This created a jarring UX.

## Solution Implemented

### **Root Cause**
The original `useAuthRestore` hook was checking storage and returning immediately, but Firebase auth state initialization happens asynchronously in the background. The navigation would render before Firebase confirmed the user's auth state.

### **The Fix**

**Updated `src/hooks/useAuthRestore.ts`:**
```typescript
// OLD (problematic):
const currentUser = auth.currentUser; // This is null during initialization!
if (currentUser) {
  dispatch(restoreSession(...));
}
setIsRestoring(false); // ❌ Returns too early!

// NEW (fixed):
await new Promise<void>((resolve) => {
  unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      // Firebase confirmed user is authenticated
      const freshToken = await firebaseUser.getIdToken();
      dispatch(restoreSession({ user: storedUserData, token: freshToken }));
    }
    resolve(); // ✅ Only resolves after Firebase confirms auth state
  });
});
setIsRestoring(false); // Now this happens AFTER auth is determined
```

**Updated `src/hooks/useFirebaseAuthObserver.ts`:**
- Added `hasInitialized` ref to skip the first `onAuthStateChanged` call
- Prevents duplicate restoration (useAuthRestore already handles initial state)
- Only listens for subsequent auth changes (logout, token refresh, etc.)

## Flow Comparison

### Before (Bad UX) ❌
```
User opens app
  ↓
Shows loader (checking storage)
  ↓
Storage check complete (token found)
  ↓
isRestoring = false
  ↓
Navigation renders → Shows onboarding (Firebase auth not ready yet!)
  ↓
Firebase initializes (100-300ms later)
  ↓
Auth state confirmed → Navigates to main app
  ↓
Result: FLASH of onboarding screen
```

### After (Smooth UX) ✅
```
User opens app
  ↓
Shows loader
  ↓
Waits for Firebase auth initialization
  ↓
Firebase confirms auth state + retrieves fresh token
  ↓
Restores session in Redux
  ↓
isRestoring = false
  ↓
Navigation renders → Shows main app directly
  ↓
Result: NO FLASH, smooth transition
```

## Technical Details

### Synchronization Strategy
1. **Wrap Firebase auth initialization in a Promise**
   - `onAuthStateChanged` fires immediately when Firebase determines auth state
   - Promise resolves only after this first call
   - Loader stays visible until Promise resolves

2. **Single source of truth**
   - `useAuthRestore` handles initial auth determination
   - `useFirebaseAuthObserver` handles subsequent changes
   - No race conditions or duplicate restoration

3. **Fresh token on every restore**
   - Gets latest token from Firebase (not stale stored token)
   - Ensures API calls work immediately after restore

## Testing Checklist

✅ **No flash on cold start (logged in)**
- Close app completely
- Reopen
- Loader should show → Main app appears (no onboarding flash)

✅ **No flash on cold start (logged out)**
- Logout completely
- Close app
- Reopen
- Loader should show → Onboarding appears (correct behavior)

✅ **Token refresh works**
- Stay logged in for extended period
- App should silently refresh token via `useFirebaseAuthObserver`

✅ **Logout clears properly**
- Logout
- No residual auth state
- Next launch shows onboarding

## Files Modified
1. `src/hooks/useAuthRestore.ts` - Wait for Firebase auth initialization
2. `src/hooks/useFirebaseAuthObserver.ts` - Skip initial auth state change
3. `AUTH_PERSISTENCE.md` - Updated documentation

## Performance Impact
- **Added delay**: ~100-300ms (Firebase auth initialization time)
- **User perception**: Better! Loader shows slightly longer but eliminates jarring flash
- **Trade-off**: Smooth experience > slightly faster load

## Notes
- This is a common pattern in React Native apps with Firebase
- Firebase auth state initialization is asynchronous and unavoidable
- The fix ensures we wait for this initialization before rendering navigation
- The `onAuthStateChanged` listener is cleaned up properly to avoid memory leaks
