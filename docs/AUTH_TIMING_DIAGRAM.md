# Auth Flow Timing Diagram

## BEFORE FIX (Bad UX - Flash Problem) ❌

```
Timeline (milliseconds)
0ms     100ms   200ms   300ms   400ms
│       │       │       │       │
├─ App starts
│
├─ useAuthRestore runs
│  ├─ Check storage (5ms)
│  └─ Token found ✓
│
├─ isRestoring = false
│
├─ Navigation renders
│  └─ Shows ONBOARDING 👀 (FLASH!)
│
        ├─ Firebase auth initializes (async)
        │
        ├─ Firebase confirms user authenticated
        │
        ├─ Redux state updated
        │
        └─ Navigation switches to MAIN APP
```

**User sees**: Loader → Onboarding flash → Main app  
**Duration of flash**: 100-300ms (very noticeable!)

---

## AFTER FIX (Good UX - No Flash) ✅

```
Timeline (milliseconds)
0ms     100ms   200ms   300ms   400ms
│       │       │       │       │
├─ App starts
│
├─ useAuthRestore runs
│  ├─ Check storage (5ms)
│  ├─ Token found ✓
│  │
│  ├─ onAuthStateChanged() listener attached
│  │  (waiting for Firebase...)
│  │
        ├─ Firebase auth initializes
        │
        ├─ onAuthStateChanged fires
        │  ├─ User authenticated ✓
        │  ├─ Get fresh token
        │  └─ Restore Redux session
        │
        ├─ Promise resolves
        │
        ├─ isRestoring = false
        │
        └─ Navigation renders
           └─ Shows MAIN APP directly 🎯
```

**User sees**: Loader (300ms) → Main app directly  
**Duration of flash**: 0ms (eliminated!)

---

## Key Differences

| Aspect | Before | After |
|--------|--------|-------|
| **Storage check** | Synchronous (5ms) | Synchronous (5ms) |
| **Firebase auth** | Not awaited | Awaited via Promise |
| **Navigation timing** | Renders immediately | Waits for Firebase |
| **Flash visibility** | Yes (100-300ms) | No (loader persists) |
| **User experience** | Jarring | Smooth |
| **Total load time** | ~200ms | ~300ms |
| **Perceived quality** | Poor | Professional |

---

## Code Pattern

### Before (Race Condition)
```typescript
// Storage check completes fast
const token = await getStoredAuthToken(); // 5ms ✓

// But Firebase is still initializing...
const user = auth.currentUser; // null (too early!)

setIsRestoring(false); // Navigation renders prematurely!
// → Shows wrong screen while Firebase catches up
```

### After (Synchronized)
```typescript
// Storage check completes fast
const token = await getStoredAuthToken(); // 5ms ✓

// Wait for Firebase to confirm auth state
await new Promise((resolve) => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      // Firebase confirmed - restore session
      dispatch(restoreSession(...));
    }
    resolve(); // Only resolve when Firebase is ready
  });
});

setIsRestoring(false); // Now safe to render navigation
// → Shows correct screen immediately
```

---

## Why This Matters

**Firebase auth initialization is async** - When the app starts:
1. Firebase SDK needs to check secure storage
2. Firebase SDK needs to validate stored auth tokens
3. Firebase SDK needs to connect to auth servers
4. This takes 100-300ms

**Our fix ensures**: We wait for Firebase to finish before rendering navigation.

**Trade-off**: Loader shows 100-300ms longer, but eliminates jarring screen flash.

**Result**: Professional, polished UX that users expect.
