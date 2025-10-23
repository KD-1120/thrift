# ThriftAccra Backend API

Fast, secure REST API built with **Fastify** and **TypeScript** for the ThriftAccra mobile application.

## 🚀 Features

- ⚡ **Fastify** - Ultra-fast web framework
- 🔥 **Firebase Admin SDK** - Authentication & user management
- 🔒 **Secure** - JWT token verification, rate limiting, helmet
- 📝 **TypeScript** - Full type safety
- ✅ **Zod** - Request validation
- 🎯 **Clean Architecture** - Routes, middleware, services

## 📦 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Fastify 4.x
- **Language**: TypeScript 5.x
- **Authentication**: Firebase Admin SDK
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main server entry point
│   ├── middleware/
│   │   ├── auth.middleware.ts # JWT verification
│   │   └── error-handler.ts   # Global error handling
│   ├── routes/
│   │   ├── auth.routes.ts     # Authentication endpoints
│   │   ├── orders.routes.ts   # Orders CRUD
│   │   ├── users.routes.ts    # User profiles
│   │   └── measurements.routes.ts # Measurements
│   ├── services/
│   │   └── firebase-admin.ts  # Firebase Admin SDK
│   └── store/
│       └── data.ts             # In-memory data store
├── package.json
├── tsconfig.json
└── .env.example

```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Create `.env` file:

```env
PORT=3000
NODE_ENV=development

# Firebase Admin SDK (from Firebase Console)
FIREBASE_PROJECT_ID=ripaap-44e5f
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@ripaap-44e5f.iam.gserviceaccount.com

# CORS
ALLOWED_ORIGINS=http://localhost:8081,exp://

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

### 3. Get Firebase Admin Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click gear icon ⚙️ → **Project settings**
4. Go to **Service accounts** tab
5. Click **Generate new private key**
6. Download JSON file
7. Copy values to `.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

### 4. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000` 🚀

## 📚 API Endpoints

### Health Check

```http
GET /health
```

### Authentication

```http
POST /api/auth/register    # Register new user
POST /api/auth/login        # Login user
```

### Orders

```http
GET    /api/orders                    # Get all orders (with filters)
POST   /api/orders                    # Create order
GET    /api/orders/customer/me        # Get customer's orders
GET    /api/orders/tailor/me          # Get tailor's orders
GET    /api/orders/:orderId           # Get order by ID
PATCH  /api/orders/:orderId/status    # Update order status
POST   /api/orders/:orderId/cancel    # Cancel order
POST   /api/orders/:orderId/notes     # Add order note
POST   /api/orders/:orderId/images    # Add order images
```

### Users

```http
GET /api/users/profile       # Get current user
PUT /api/users/profile       # Update profile
GET /api/users/:userId       # Get user by ID
```

### Measurements

```http
GET    /api/measurements             # Get all measurements
POST   /api/measurements             # Create measurement
GET    /api/measurements/:id         # Get measurement by ID
PUT    /api/measurements/:id         # Update measurement
DELETE /api/measurements/:id         # Delete measurement
```

## 🔐 Authentication

All endpoints (except `/health`) require Firebase ID token:

```http
Authorization: Bearer <firebase-id-token>
```

Get token from Firebase Auth in mobile app:
```typescript
const token = await user.getIdToken();
```

## 🧪 Testing

### Using cURL

```bash
# Health check
curl http://localhost:3000/health

# Create order (with auth)
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tailorId": "tailor123",
    "garmentType": "Kaftan",
    "fabricType": "Silk",
    "description": "Custom fitted kaftan",
    "referenceImages": [],
    "estimatedCost": 250
  }'
```

### Using Postman

1. Import endpoints from API documentation
2. Set `Authorization` header with Firebase token
3. Test all CRUD operations

## 📦 Scripts

```bash
npm run dev          # Start development server (hot reload)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🌐 Deployment

### Deploy to Render

1. **Create `render.yaml`:**

```yaml
services:
  - type: web
    name: thriftaccra-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: FIREBASE_PROJECT_ID
        sync: false
      - key: FIREBASE_PRIVATE_KEY
        sync: false
      - key: FIREBASE_CLIENT_EMAIL
        sync: false
```

2. **Push to Git:**

```bash
git add backend/
git commit -m "Add backend API"
git push
```

3. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repo
   - Select `backend` folder
   - Add environment variables
   - Deploy!

4. **Update Mobile App:**

Update `.env` in mobile app:
```env
EXPO_PUBLIC_API_URL=https://your-app.onrender.com
```

## 🔥 Firebase Admin Setup

Backend uses Firebase Admin SDK to verify tokens:

1. User signs in via Firebase Auth in mobile app
2. Mobile app gets ID token
3. Mobile app sends token in `Authorization` header
4. Backend verifies token using Firebase Admin SDK
5. Backend returns data if token is valid

## 💾 Data Storage

Currently uses **in-memory storage** for development:
- `src/store/data.ts` - Maps for users, orders, measurements

### Migrate to Database

Replace in-memory storage with:

**Option A: PostgreSQL** (Recommended for production)
```bash
npm install pg
```

**Option B: MongoDB**
```bash
npm install mongodb
```

**Option C: Keep Firestore for everything**
- Use Firestore Admin SDK instead of in-memory maps

## ⚡ Performance

Fastify is **~65% faster** than Express:
- **Express**: ~15,000 req/sec
- **Fastify**: ~30,000 req/sec

## 🔒 Security Features

- ✅ **Helmet** - Security headers
- ✅ **CORS** - Cross-origin protection
- ✅ **Rate Limiting** - Prevent abuse
- ✅ **JWT Verification** - Firebase token validation
- ✅ **Input Validation** - Zod schemas
- ✅ **Error Handling** - No sensitive data leaks

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### "Firebase Admin error"
- Check `.env` file has correct Firebase credentials
- Ensure private key is properly escaped
- Verify project ID matches Firebase Console

### "Port already in use"
```bash
# Change port in .env
PORT=3001
```

## 📖 API Documentation

Full API documentation available at:
- Development: `http://localhost:3000/health`
- Production: `https://your-app.onrender.com/health`

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit PR

## 📄 License

MIT License - ThriftAccra Team

---

**Status**: ✅ Ready for development  
**Next**: Install dependencies and start server!
