# Backend Setup Guide - Fastify + Firebase

Complete guide to setting up and running the ThriftAccra Fastify backend.

## 📦 What Was Created

### Backend Structure (13 files created):

```
backend/
├── src/
│   ├── server.ts                    # Main Fastify server
│   ├── middleware/
│   │   ├── auth.middleware.ts      # Firebase token verification
│   │   └── error-handler.ts        # Global error handler
│   ├── routes/
│   │   ├── auth.routes.ts          # Register, login (4 endpoints)
│   │   ├── orders.routes.ts        # Orders CRUD (9 endpoints)
│   │   ├── users.routes.ts         # User profiles (3 endpoints)
│   │   └── measurements.routes.ts  # Measurements (5 endpoints)
│   ├── services/
│   │   └── firebase-admin.ts       # Firebase Admin SDK setup
│   └── store/
│       └── data.ts                  # In-memory data store
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript config
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
└── README.md                        # Documentation
```

**Total: 21 API endpoints** across 4 resources

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies ⏳

```bash
cd backend
npm install
```

This will install:
- ✅ Fastify (web framework)
- ✅ Firebase Admin SDK
- ✅ TypeScript & tsx (dev server)
- ✅ Zod (validation)
- ✅ Security plugins (helmet, cors, rate-limit)

**Wait time**: ~2 minutes

### Step 2: Get Firebase Admin Credentials (Required)

1. **Go to Firebase Console**:
   - Open [console.firebase.google.com](https://console.firebase.google.com/)
   - Select project: **ripaap-44e5f**

2. **Generate Service Account Key**:
   - Click gear icon ⚙️ → **Project settings**
   - Go to **Service accounts** tab
   - Click **Generate new private key**
   - Click **Generate key** (downloads JSON file)

3. **Save JSON File**:
   - Save as `serviceAccountKey.json` somewhere safe
   - **DO NOT commit to Git!**

### Step 3: Create .env File

Create `backend/.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Firebase Admin SDK (copy from downloaded JSON)
FIREBASE_PROJECT_ID=ripaap-44e5f
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@ripaap-44e5f.iam.gserviceaccount.com

# CORS (allow mobile app)
ALLOWED_ORIGINS=http://localhost:8081,exp://

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

**⚠️ Important**:
- Copy `private_key` value as-is (including `\n`)
- Keep quotes around the private key
- Don't remove `\n` characters

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected output**:
```
[3:54:00 PM] INFO: Server listening at http://0.0.0.0:3000
[3:54:00 PM] INFO: 🚀 ThriftAccra Backend running at http://0.0.0.0:3000
[3:54:00 PM] INFO: 📝 Environment: development
[3:54:00 PM] INFO: 🔥 Firebase Admin initialized
```

### Step 5: Test Health Endpoint

Open browser or use curl:
```bash
curl http://localhost:3000/health
```

**Expected response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-20T15:54:00.000Z",
  "environment": "development"
}
```

✅ **Backend is running!**

---

## 🧪 Testing the API

### Get Firebase Token (from Mobile App)

First, you need a valid Firebase token from your mobile app:

```typescript
// In your mobile app (after user signs in)
import { authService } from './services/firebase';

const token = await authService.getIdToken();
console.log('Token:', token);
// Copy this token for testing
```

### Test Endpoints with cURL

#### 1. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUid": "user123",
    "email": "test@example.com",
    "name": "John Doe",
    "phone": "+233123456789",
    "role": "customer"
  }'
```

#### 2. Login User

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUid": "user123",
    "email": "test@example.com"
  }'
```

#### 3. Create Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tailorId": "tailor123",
    "garmentType": "Kaftan",
    "fabricType": "Silk",
    "description": "Custom fitted kaftan with gold embroidery",
    "referenceImages": ["https://example.com/image1.jpg"],
    "estimatedCost": 250
  }'
```

#### 4. Get Customer Orders

```bash
curl http://localhost:3000/api/orders/customer/me \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

## 🔗 Connect Mobile App to Backend

### Update Mobile App .env

```env
# Change this line in mobile app's .env
EXPO_PUBLIC_API_URL=http://localhost:3000

# Keep Firebase config as-is
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyDvuc4_4DkTV-hscARfGN-d6LgdX0EWxQk
# ... other Firebase vars
```

### Restart Expo

```bash
# In main project folder (not backend)
npm start
```

### Test Full Flow

1. **Sign up in mobile app**
2. **Backend receives registration** → Check backend logs
3. **Create an order in mobile app**
4. **Backend creates order** → Check backend logs
5. **View orders in mobile app** → Should see your order!

---

## 📊 API Endpoints Summary

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | ✅ Firebase Token |
| POST | `/login` | Login user | ✅ Firebase Token |

### Orders (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create order | ✅ |
| GET | `/` | Get all orders (filtered) | ✅ |
| GET | `/customer/me` | Get my orders | ✅ |
| GET | `/tailor/me` | Get tailor's orders | ✅ |
| GET | `/:orderId` | Get order by ID | ✅ |
| PATCH | `/:orderId/status` | Update status | ✅ |
| POST | `/:orderId/cancel` | Cancel order | ✅ |
| POST | `/:orderId/notes` | Add note | ✅ |
| POST | `/:orderId/images` | Add images | ✅ |

### Users (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get my profile | ✅ |
| PUT | `/profile` | Update profile | ✅ |
| GET | `/:userId` | Get user by ID | ✅ |

### Measurements (`/api/measurements`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all measurements | ✅ |
| POST | `/` | Create measurement | ✅ |
| GET | `/:id` | Get by ID | ✅ |
| PUT | `/:id` | Update measurement | ✅ |
| DELETE | `/:id` | Delete measurement | ✅ |

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'fastify'"

**Solution**: Install dependencies
```bash
cd backend
npm install
```

### Error: "Firebase Admin initialization failed"

**Solution**: Check `.env` file
- Verify `FIREBASE_PROJECT_ID` is correct
- Verify `FIREBASE_PRIVATE_KEY` has proper `\n` escaping
- Verify `FIREBASE_CLIENT_EMAIL` is from service account

### Error: "Port 3000 is already in use"

**Solution**: Change port
```env
# In .env
PORT=3001
```

### Error: "401 Unauthorized"

**Solution**: Check token
- Ensure you're sending `Authorization: Bearer <token>` header
- Token must be from Firebase Auth (not random string)
- Token expires after 1 hour - get a fresh one

### Backend not receiving requests from mobile app

**Solution**: Check network
- Mobile device and computer must be on same WiFi
- Use computer's local IP instead of `localhost`:
  ```env
  # Find your local IP (e.g., 192.168.1.5)
  EXPO_PUBLIC_API_URL=http://192.168.1.5:3000
  ```

---

## 🌐 Deploy to Render

### Option 1: Auto-Deploy from Git

1. **Push to GitHub**:
```bash
git add backend/
git commit -m "Add Fastify backend"
git push
```

2. **Deploy on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com/)
   - Click **New +** → **Web Service**
   - Connect GitHub repository
   - Settings:
     - **Name**: thriftaccra-api
     - **Root Directory**: `backend`
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
   - Add environment variables (from `.env`)
   - Click **Create Web Service**

3. **Get URL**:
   - After deployment: `https://thriftaccra-api.onrender.com`
   - Update mobile app:
     ```env
     EXPO_PUBLIC_API_URL=https://thriftaccra-api.onrender.com
     ```

### Option 2: Manual Deploy

```bash
# Build locally
npm run build

# Deploy dist folder to Render
```

---

## 💾 Migrate to Database

Currently using in-memory storage (data lost on restart).

### Add PostgreSQL (Recommended)

1. **Install pg**:
```bash
npm install pg @types/pg
```

2. **Create database service**:
```typescript
// src/services/database.ts
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

3. **Replace in-memory maps**:
```typescript
// Instead of: users.set(uid, user)
await pool.query(
  'INSERT INTO users (id, email, name) VALUES ($1, $2, $3)',
  [uid, email, name]
);
```

4. **Add to Render**:
   - Add PostgreSQL database on Render
   - Copy connection string to environment variables

---

## 📈 Performance Tips

1. **Enable clustering** (for production):
```typescript
// Use PM2 or Node cluster module
pm2 start dist/server.js -i max
```

2. **Add caching**:
```bash
npm install @fastify/caching
```

3. **Add compression**:
```bash
npm install @fastify/compress
```

4. **Monitor performance**:
```bash
npm install pino-pretty # Better logs
```

---

## ✅ Verification Checklist

Before proceeding:

- [ ] Backend starts without errors: `npm run dev`
- [ ] Health endpoint works: `curl http://localhost:3000/health`
- [ ] Firebase Admin initialized (check logs)
- [ ] Can register user with Firebase token
- [ ] Can create order with Firebase token
- [ ] Mobile app connects to backend
- [ ] Orders appear in mobile app

---

## 🎉 Success!

Your Fastify backend is now running! 

**What's working**:
- ✅ 21 API endpoints ready
- ✅ Firebase authentication integrated
- ✅ Request validation with Zod
- ✅ Error handling
- ✅ Security (CORS, rate limiting, helmet)

**Next steps**:
1. Test all endpoints with mobile app
2. Add database (PostgreSQL)
3. Deploy to Render
4. Add payment integration

---

**Need help?** Check:
- `backend/README.md` - Full API documentation
- `BACKEND_INTEGRATION.md` - API reference
- Backend logs - Run `npm run dev` to see detailed logs

**Status**: ✅ Ready for testing!
