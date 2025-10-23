# Backend Integration Guide

## Architecture Overview

ThriftAccra uses a **hybrid backend architecture** combining Firebase and a Render-hosted REST API:

### Firebase Responsibilities
- ✅ **Authentication**: User sign-up, sign-in, password reset
- ✅ **Real-time Messaging**: Chat between customers and tailors (Firestore)
- ✅ **Media Storage**: Images, portfolios, reference photos (Firebase Storage)
- ✅ **Push Notifications**: Order updates, messages (FCM)

### Render Backend Responsibilities
- ✅ **User Profiles**: Extended user data and tailor profiles
- ✅ **Orders Management**: CRUD operations, status tracking
- ✅ **Measurements**: Saved measurements management
- ✅ **Reviews & Ratings**: Tailor reviews and feedback
- ✅ **Search & Discovery**: Tailor search and filtering
- ✅ **Payment Processing**: Order payments and deposits
- ✅ **Analytics**: Business metrics and reporting

---

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root (based on `.env.example`):

```env
# Render Backend API
EXPO_PUBLIC_API_URL=https://your-app.onrender.com

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

---

## Backend API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Create user profile after Firebase registration.

**Headers:**
```json
{
  "Authorization": "Bearer <firebase-id-token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "firebaseUid": "string",
  "email": "string",
  "name": "string",
  "phone": "string",
  "role": "customer" | "tailor"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "phone": "string",
    "role": "customer" | "tailor",
    "avatar": "string | null",
    "createdAt": "ISO 8601 timestamp"
  }
}
```

---

#### POST `/api/auth/login`
Sync user login with backend.

**Headers:**
```json
{
  "Authorization": "Bearer <firebase-id-token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "firebaseUid": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "user": { /* User object */ }
}
```

---

### User Profile Endpoints

#### GET `/api/users/profile`
Get current user profile.

**Headers:**
```json
{
  "Authorization": "Bearer <firebase-id-token>"
}
```

**Response:**
```json
{
  "user": { /* User object */ }
}
```

---

#### PUT `/api/users/profile`
Update user profile.

**Headers:**
```json
{
  "Authorization": "Bearer <firebase-id-token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "avatar": "string (optional)"
}
```

---

### Orders Endpoints

#### POST `/api/orders`
Create a new order.

**Headers:**
```json
{
  "Authorization": "Bearer <firebase-id-token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "tailorId": "string",
  "garmentType": "string",
  "fabricType": "string",
  "description": "string",
  "measurementId": "string (optional)",
  "customMeasurements": { /* key-value pairs */ },
  "referenceImages": ["string (Firebase Storage URLs)"],
  "specialInstructions": "string (optional)",
  "estimatedCost": "number"
}
```

**Response:**
```json
{
  "id": "string",
  "customerId": "string",
  "tailorId": "string",
  "status": "pending",
  "items": [{ /* OrderItem objects */ }],
  "totalAmount": "number",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

---

#### GET `/api/orders`
Get all orders with filters.

**Query Parameters:**
- `status`: Filter by order status
- `tailorId`: Filter by tailor
- `customerId`: Filter by customer
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20)

**Response:**
```json
{
  "data": [{ /* Order objects */ }],
  "total": "number",
  "page": "number",
  "pageSize": "number",
  "hasMore": "boolean"
}
```

---

#### GET `/api/orders/customer/me`
Get current customer's orders.

**Response:**
```json
[{ /* Order objects */ }]
```

---

#### GET `/api/orders/tailor/me`
Get current tailor's orders.

**Query Parameters:**
- `status`: Filter by status (optional)

**Response:**
```json
[{ /* Order objects */ }]
```

---

#### GET `/api/orders/:orderId`
Get order details.

**Response:**
```json
{ /* Order object */ }
```

---

#### PATCH `/api/orders/:orderId/status`
Update order status.

**Request Body:**
```json
{
  "status": "pending" | "accepted" | "confirmed" | "in_progress" | "ready_for_fitting" | "completed" | "cancelled",
  "notes": "string (optional)"
}
```

---

#### POST `/api/orders/:orderId/cancel`
Cancel an order.

**Request Body:**
```json
{
  "reason": "string (optional)"
}
```

---

#### POST `/api/orders/:orderId/notes`
Add note to order.

**Request Body:**
```json
{
  "note": "string"
}
```

---

#### POST `/api/orders/:orderId/images`
Add additional images to order.

**Request Body:**
```json
{
  "images": ["string (Firebase Storage URLs)"]
}
```

---

### Tailors Endpoints

#### GET `/api/tailors`
Get list of tailors with filters.

**Query Parameters:**
- `search`: Search query
- `specialty`: Filter by specialty
- `location`: Filter by location
- `minRating`: Minimum rating
- `page`: Page number
- `pageSize`: Items per page

---

#### GET `/api/tailors/:tailorId`
Get tailor profile details.

---

### Measurements Endpoints

#### GET `/api/measurements`
Get user's saved measurements.

---

#### POST `/api/measurements`
Save new measurement profile.

---

#### PUT `/api/measurements/:measurementId`
Update measurement profile.

---

#### DELETE `/api/measurements/:measurementId`
Delete measurement profile.

---

## Firebase Services Usage

### Authentication

```typescript
import { authService } from './services/firebase';

// Sign up
const user = await authService.signUp(email, password, displayName);

// Sign in
const user = await authService.signIn(email, password);

// Sign out
await authService.signOut();

// Reset password
await authService.resetPassword(email);
```

### Image Upload

```typescript
import { storageService } from './services/firebase';

// Upload single image
const imageUrl = await storageService.uploadImage(
  localUri,
  `orders/${orderId}/reference_${Date.now()}.jpg`,
  (progress) => {
    console.log(`Upload progress: ${progress.progress}%`);
  }
);

// Upload multiple images
const imageUrls = await storageService.uploadMultipleImages(
  uris,
  `tailors/${tailorId}/portfolio`,
  (index, progress) => {
    console.log(`Image ${index}: ${progress.progress}%`);
  }
);
```

### Real-time Messaging

```typescript
import { messagingService } from './services/firebase';

// Send message
await messagingService.sendMessage(
  senderId,
  recipientId,
  'Hello!',
  'text'
);

// Subscribe to messages
const unsubscribe = messagingService.subscribeToMessages(
  userId,
  otherUserId,
  (messages) => {
    console.log('New messages:', messages);
  }
);

// Cleanup
unsubscribe();
```

---

## Redux Integration

All API calls use RTK Query hooks:

### Authentication
```typescript
import { useSignUpMutation, useSignInMutation } from './api/auth.api';

const [signUp, { isLoading }] = useSignUpMutation();
const result = await signUp({ email, password, name, phone, role });
```

### Orders
```typescript
import { 
  useGetCustomerOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation 
} from './api/orders.api';

// Get orders
const { data: orders, isLoading } = useGetCustomerOrdersQuery();

// Create order
const [createOrder] = useCreateOrderMutation();
await createOrder(orderData);

// Update status
const [updateStatus] = useUpdateOrderStatusMutation();
await updateStatus({ orderId, status: 'in_progress' });
```

---

## Authentication Flow

1. **User signs up/in** → Firebase Authentication
2. **Get Firebase ID token** → `user.getIdToken()`
3. **Send token to backend** → Backend verifies with Firebase Admin SDK
4. **Backend creates/fetches user profile** → Returns user data
5. **Store token locally** → Expo SecureStore
6. **Use token for API calls** → Automatic via RTK Query base query

---

## Error Handling

All API errors follow this structure:

```typescript
interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, any>;
}
```

Example error handling:

```typescript
const [createOrder, { error }] = useCreateOrderMutation();

try {
  await createOrder(orderData);
} catch (err) {
  if (error) {
    console.error(error.message);
    // Show error to user
  }
}
```

---

## Security Best Practices

1. **Never expose Firebase config secrets** (use environment variables)
2. **Validate Firebase ID tokens on backend** (using Firebase Admin SDK)
3. **Use Firestore security rules** for real-time data
4. **Use Storage security rules** for image uploads
5. **Store auth tokens in SecureStore** (not AsyncStorage)
6. **Implement rate limiting** on backend endpoints
7. **Validate all user inputs** on both client and server

---

## Next Steps

### Backend Development (Render)

Create a Node.js/Express backend with these requirements:

1. **Setup Firebase Admin SDK** for token verification
2. **Database**: PostgreSQL or MongoDB
3. **Endpoints**: Implement all routes listed above
4. **Middleware**: Auth verification, error handling, logging
5. **Deploy to Render**: Free tier available

### Sample Backend Verification Middleware

```javascript
const admin = require('firebase-admin');

async function verifyFirebaseToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid, email: decodedToken.email };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
```

---

## Testing

### Test with Mock Data

During development, you can test screens with mock data by creating test endpoints:

```typescript
// In your component
const MOCK_ORDERS = [
  {
    id: '1',
    customerId: 'user1',
    tailorId: 'tailor1',
    status: 'in_progress',
    items: [
      {
        id: 'item1',
        garmentType: 'Kaftan',
        price: 250,
        quantity: 1
      }
    ],
    totalAmount: 250,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
```

---

## Support

For issues or questions:
1. Check Firebase Console for auth/storage issues
2. Check Render logs for backend errors
3. Use Redux DevTools to inspect API calls
4. Enable network debugging in React Native Debugger

---

**Last Updated:** October 2025
