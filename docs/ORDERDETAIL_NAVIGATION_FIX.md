# Navigation Fix: OrderDetail Back Button

## Problem
The back button in OrderDetail screen was trying to navigate to `'Home'`, which caused a navigation error:

```
The action 'NAVIGATE' with payload {"name":"Home"} was not handled by any navigator.
```

## Root Cause
`'Home'` is a **tab screen** inside the `HomeTabs` navigator, not a direct route in the MainStack. You cannot directly navigate to tab screens from stack screens.

### Navigation Hierarchy
```
MainStack
├── HomeTabs (Stack Screen)
│   ├── Home (Tab Screen) ← Cannot navigate directly here
│   ├── Explore (Tab Screen)
│   ├── Orders (Tab Screen)
│   ├── Messages (Tab Screen)
│   └── Settings (Tab Screen)
├── OrderDetail (Stack Screen) ← We are here
├── TailorProfile (Stack Screen)
└── ...
```

## The Fix

**Before** (❌):
```tsx
<IconButton
  icon="arrow-back"
  size={24}
  color={colors.text.primary}
  onPress={() => navigation.navigate('Home')}  // ❌ Cannot navigate to tab screen
/>
```

**After** (✅):
```tsx
<IconButton
  icon="arrow-back"
  size={24}
  color={colors.text.primary}
  onPress={() => navigation.goBack()}  // ✅ Go back to previous screen
/>
```

## Why `goBack()` is Better

### Using `navigation.goBack()`:
- ✅ Returns to the screen you came from
- ✅ Maintains navigation history
- ✅ Works regardless of where you navigated from
- ✅ Preserves scroll position and state

### User Flow Examples:

**Scenario 1**: From Home tab
```
Home Tab → OrderDetail → goBack() → Home Tab ✅
```

**Scenario 2**: From Orders tab
```
Orders Tab → OrderDetail → goBack() → Orders Tab ✅
```

**Scenario 3**: From Notification
```
Notification → OrderDetail → goBack() → Previous screen ✅
```

If we used `navigation.navigate('Home')`, all scenarios would force return to Home tab, which is wrong for scenarios 2 and 3.

## Alternative Solutions (Not Used)

### Option 1: Navigate to HomeTabs
```tsx
navigation.navigate('HomeTabs')  // Returns to last active tab
```
- Would work but loses context of which specific screen

### Option 2: Navigate to HomeTabs with specific tab
```tsx
navigation.navigate('HomeTabs', { screen: 'Home' })  // Force Home tab
```
- Too complex, forces specific tab

### Option 3: Use goBack (Chosen) ✅
```tsx
navigation.goBack()  // Simple, maintains context
```
- Best user experience
- Simplest implementation

## Files Modified

### `src/features/orders/screens/OrderDetail.tsx`
- **Line 357**: Changed `navigation.navigate('Home')` → `navigation.goBack()`
- **Impact**: Back button now properly returns to previous screen

## Testing Checklist

✅ **From Home Tab**
- [ ] Navigate to Home tab
- [ ] Tap an order card
- [ ] Opens OrderDetail screen
- [ ] Tap back button
- [ ] Should return to Home tab

✅ **From Orders Tab**
- [ ] Navigate to Orders tab
- [ ] Tap an order in the list
- [ ] Opens OrderDetail screen
- [ ] Tap back button
- [ ] Should return to Orders tab (not Home!)

✅ **From Notification**
- [ ] Tap order notification
- [ ] Opens OrderDetail screen
- [ ] Tap back button
- [ ] Should return to previous screen

✅ **No Console Errors**
- [ ] No navigation warnings in console
- [ ] Smooth transition animation

## Related Navigation Patterns

### Correct Ways to Navigate

**To a tab screen:**
```tsx
// Navigate to HomeTabs and let it show the last active tab
navigation.navigate('HomeTabs')

// Navigate to HomeTabs and show a specific tab
navigation.navigate('HomeTabs', { screen: 'Orders' })
```

**To a stack screen:**
```tsx
// Navigate to a direct stack screen
navigation.navigate('OrderDetail', { orderId: '123' })
navigation.navigate('TailorProfile', { tailorId: 'abc' })
```

**Go back:**
```tsx
// Simple back navigation
navigation.goBack()

// Check if can go back
if (navigation.canGoBack()) {
  navigation.goBack()
} else {
  navigation.navigate('HomeTabs')  // Fallback
}
```

## Prevention

### Code Review Checklist
When adding back buttons, ask:
1. ✅ Is the destination a tab screen or stack screen?
2. ✅ Should it go back or navigate to a specific place?
3. ✅ Does it maintain user context?
4. ✅ Have you tested from multiple entry points?

### Best Practice
```tsx
// ✅ Default to goBack() for back buttons
<IconButton icon="arrow-back" onPress={() => navigation.goBack()} />

// ❌ Avoid hardcoded navigation
<IconButton icon="arrow-back" onPress={() => navigation.navigate('Home')} />
```

## Summary

**The Issue**: Back button tried to navigate to `'Home'` (tab screen) instead of going back

**The Fix**: Changed to `navigation.goBack()`

**The Result**: Back button now properly returns to previous screen, maintaining user context ✅
