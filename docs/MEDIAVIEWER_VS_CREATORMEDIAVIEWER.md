# MediaViewer vs CreatorMediaViewer - Role-Based Navigation Fix

## Problem
Customers were seeing portfolio management UI when browsing tailor content, and the navigation was confused between two separate viewers:
- **MediaViewer**: Customer-facing viewer for browsing tailor content
- **CreatorMediaViewer**: Tailor-facing viewer for managing their portfolio

## Root Cause
Navigation was incorrectly routing both user types to the same viewer, and parameter names were inconsistent.

## User Roles and Screens

### Customer (Browsing Mode)
**Purpose**: Discover and engage with tailor content

**Navigation Flow**:
```
Explore Screen (Customer)
  ↓ Tap media item
MediaViewer (Customer-facing)
  - Like, comment, bookmark content
  - Follow tailors
  - Browse tailor portfolio
  - Engage with social features
```

### Tailor (Portfolio Management)
**Purpose**: Manage and analyze portfolio performance

**Navigation Flow**:
```
Portfolio Screen (Tailor)
  ↓ Tap portfolio item
CreatorMediaViewer (Tailor-facing)
  - View performance stats
  - Edit/delete portfolio items
  - Analyze engagement metrics
  - Manage content
```

## Fixes Applied

### 1. **Portfolio.tsx** - Navigate to CreatorMediaViewer

**Before** (❌ Wrong):
```tsx
const handleItemPress = (item: PortfolioItem) => {
  // Navigate to MediaViewer with portfolio item data
  (navigation as any).navigate('MediaViewer', {  // ❌ Customer-facing viewer
    items: portfolioItems.map(p => ({...})),
    initialIndex: portfolioItems.findIndex(p => p.id === item.id),
  });
};
```

**After** (✅ Correct):
```tsx
const handleItemPress = (item: PortfolioItem) => {
  // Navigate to CreatorMediaViewer (tailor-facing portfolio viewer)
  (navigation as any).navigate('CreatorMediaViewer', {  // ✅ Tailor-facing viewer
    items: portfolioItems.map(p => ({...})),
    initialIndex: portfolioItems.findIndex(p => p.id === item.id),
  });
};
```

### 2. **MediaViewer.tsx** - Fix Parameter Name

**Before** (❌ Inconsistent):
```tsx
type RouteParams = {
  MediaViewer: {
    mediaItems: MediaItem[];  // ❌ Wrong parameter name
    initialIndex: number;
  };
};

export default function MediaViewerScreen() {
  const route = useRoute<RouteProp<RouteParams, 'MediaViewer'>>();
  const { mediaItems, initialIndex } = route.params;  // ❌ Wrong
  const [localMediaItems, setLocalMediaItems] = useState(mediaItems);
}
```

**After** (✅ Consistent):
```tsx
type RouteParams = {
  MediaViewer: {
    items: MediaItem[];  // ✅ Correct parameter name
    initialIndex: number;
  };
};

export default function MediaViewerScreen() {
  const route = useRoute<RouteProp<RouteParams, 'MediaViewer'>>();
  const { items, initialIndex } = route.params;  // ✅ Correct
  const [localMediaItems, setLocalMediaItems] = useState(items);
}
```

### 3. **Added Type Annotations**

Fixed TypeScript errors by adding proper type annotations:

```tsx
// Fixed type annotations in state updaters
setLocalMediaItems((prev: MediaItem[]) => {  // ✅ Added type
  const updated = [...prev];
  // ...
  return updated;
});
```

### 4. **Fixed Hook Dependencies**

Reorganized callback hooks to resolve dependency order issues:

```tsx
// Declare handleLike before handleDoubleTap uses it
const handleLike = useCallback(() => {
  // ...
}, [currentIndex]);

// Now handleDoubleTap can safely use handleLike
const handleDoubleTap = useCallback(() => {
  if (!currentItem.isLiked) {
    handleLike();  // ✅ Safe to use
  }
}, [currentItem, animateHeart, handleLike]);
```

## Feature Comparison

| Feature | MediaViewer (Customer) | CreatorMediaViewer (Tailor) |
|---------|----------------------|---------------------------|
| **Purpose** | Browse & engage | Manage & analyze |
| **Swiping** | ❌ Not yet (planned) | ✅ Vertical (TikTok-style) |
| **Like/Comment** | ✅ Yes | ✅ View stats only |
| **Follow Button** | ✅ Yes | ❌ No (own content) |
| **Stats Panel** | ❌ No | ✅ Detailed analytics |
| **Edit/Delete** | ❌ No | ✅ Yes |
| **Performance Insights** | ❌ No | ✅ Yes |
| **Double-tap Like** | ✅ Yes | ❌ No (analytics focus) |
| **Comments Modal** | ✅ Yes | ❌ No (view only) |
| **Bookmark** | ✅ Yes | ❌ No |

## Navigation Summary

### From Explore Screen (Customer)
```tsx
// Customer browsing tailors
navigation.navigate('MediaViewer', {
  items: MediaItem[],       // Content from API
  initialIndex: number,     // Selected item index
});
```
→ Opens **MediaViewer** (customer-facing UI)

### From Portfolio Screen (Tailor)
```tsx
// Tailor managing portfolio
navigation.navigate('CreatorMediaViewer', {
  items: MediaItem[],       // Own portfolio items
  initialIndex: number,     // Selected item index
});
```
→ Opens **CreatorMediaViewer** (tailor-facing UI)

## Files Modified

### 1. `src/features/tailors/screens/Portfolio.tsx`
- **Change**: Navigate to `CreatorMediaViewer` instead of `MediaViewer`
- **Reason**: Tailors need portfolio management tools, not customer browsing UI
- **Lines**: 60-61

### 2. `src/screens/MediaViewer.tsx`
- **Changes**:
  - Fixed parameter name: `mediaItems` → `items`
  - Added type annotations: `prev: MediaItem[]`
  - Fixed hook dependency order
  - Removed console.log statements
- **Reason**: Match parameter naming from Explore.tsx navigation
- **Lines**: 34-40, 98, 111, 121-136

## Testing Checklist

### Customer Flow (MediaViewer)
✅ **Navigate from Explore**
- Open Explore screen as customer
- Tap on any media item
- Should open MediaViewer (not CreatorMediaViewer)
- Should see: Like button, Comment button, Follow button
- Should NOT see: Stats panel, Edit button, Analytics

✅ **Engagement Actions**
- Double-tap to like → Heart animation shows
- Tap comment → Comments modal opens
- Tap bookmark → Item bookmarked
- Tap share → Share sheet opens

### Tailor Flow (CreatorMediaViewer)
✅ **Navigate from Portfolio**
- Open Portfolio screen as tailor
- Tap on any portfolio item
- Should open CreatorMediaViewer (not MediaViewer)
- Should see: Stats panel, Edit button, Analytics
- Should NOT see: Follow button, Comment modal

✅ **Management Actions**
- Tap Stats button → Performance insights panel opens
- Swipe up/down → Navigate between portfolio items
- View engagement metrics → Likes, comments, shares displayed

## Role Detection

The app uses Redux auth state to determine user role:

```tsx
// In Portfolio screen
const user = useAppSelector((state) => state.auth.user);

// Only accessible to tailors
{ skip: !user?.id || user?.role !== 'tailor' }
```

Navigation is triggered based on context:
- **Customer context** (Explore) → MediaViewer
- **Tailor context** (Portfolio) → CreatorMediaViewer

## Future Enhancements

### MediaViewer (Customer)
1. **Vertical Swiping**: Add TikTok-style vertical swipe
2. **Video Playback**: Integrate expo-av for video
3. **Direct Messaging**: Message tailor from viewer
4. **Booking**: Quick booking CTA

### CreatorMediaViewer (Tailor)
1. **Advanced Analytics**: View breakdown, demographics
2. **Bulk Actions**: Select multiple items to edit/delete
3. **Share to Social**: Cross-post to Instagram, TikTok
4. **Performance Alerts**: Notifications for trending content

## Migration Notes

### For Developers
- All customer-facing navigation to media viewer should use `'MediaViewer'`
- All tailor portfolio navigation should use `'CreatorMediaViewer'`
- Both accept same parameters: `{ items: MediaItem[], initialIndex: number }`

### Parameter Naming Convention
```tsx
// ✅ Use this everywhere
navigation.navigate('MediaViewer', {
  items: MediaItem[],
  initialIndex: number,
});

// ❌ Don't use this
navigation.navigate('MediaViewer', {
  mediaItems: MediaItem[],  // ❌ Inconsistent
  initialIndex: number,
});
```

## Related Documentation
- `TIKTOK_VERTICAL_SWIPE.md` - CreatorMediaViewer vertical swipe implementation
- `MEDIAVIEWER_FIX.md` - Original MediaViewer display issues
- `CUSTOMER_ISSUES_FIXED.md` - Customer-facing bug fixes
