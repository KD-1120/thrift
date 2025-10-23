# Quick Start Guide - ThriftAccra

Get ThriftAccra running on your local machine in **10 minutes**.

## ⚡ Prerequisites

Make sure you have:
- ✅ Node.js 16+ installed
- ✅ npm or yarn
- ✅ Expo CLI (`npm install -g expo-cli`)
- ✅ iOS Simulator (Mac) or Android Studio
- ✅ Google account (for Firebase)

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (2 minutes)

```bash
# Navigate to project
cd thriftaccra

# Install packages
npm install

# This installs all required dependencies including:
# - React Native & Expo
# - Firebase SDK
# - Redux Toolkit
# - Navigation libraries
```

### Step 2: Firebase Setup (3 minutes)

1. **Create Firebase Project**
   - Go to [console.firebase.google.com](https://console.firebase.google.com)
   - Click "Add project"
   - Name it "ThriftAccra"
   - Click through setup (skip Analytics if you want)

2. **Enable Email Authentication**
   - Click "Authentication" → "Get started"
   - Click "Sign-in method" tab
   - Enable "Email/Password"

3. **Get Configuration**
   - Click gear icon ⚙️ → "Project settings"
   - Scroll to "Your apps"
   - Click web icon `</>`
   - Copy the config values

### Step 3: Configure Environment (1 minute)

Create `.env` file in project root:

```env
# Render Backend (use mock for now)
EXPO_PUBLIC_API_URL=https://mock-api.thriftaccra.com

# Firebase (paste your actual values)
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

### Step 4: Start Development Server (30 seconds)

```bash
npm start
```

### Step 5: Run App (30 seconds)

**Option A: iOS Simulator (Mac only)**
```bash
# Press 'i' in terminal
# or
npm run ios
```

**Option B: Android Emulator**
```bash
# Press 'a' in terminal
# or
npm run android
```

**Option C: Physical Device**
1. Install "Expo Go" app from App Store/Play Store
2. Scan QR code shown in terminal

## 🎉 You're Done!

The app should now be running. You can:
- ✅ Sign up for a new account
- ✅ Browse tailors
- ✅ View portfolios
- ✅ Navigate through screens

## 🔧 Troubleshooting

### "Firebase not initialized"
- Check `.env` file exists
- Verify `EXPO_PUBLIC_` prefix on all vars
- Restart Expo server (`Ctrl+C`, then `npm start`)

### "Cannot connect to backend"
- Backend needs to be deployed (see below)
- For now, API calls will fail gracefully
- Auth and UI will still work

### "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start --clear
```

## 📱 Test Features

### What Works Now:
✅ **Authentication**: Sign up, sign in, password reset  
✅ **Browse Tailors**: View list and profiles  
✅ **Portfolios**: View images and details  
✅ **Create Order**: Fill form (submit will fail without backend)  
✅ **Settings**: View and edit profile  

### What Needs Backend:
⏳ **Orders List**: Displays once backend is connected  
⏳ **Messaging**: Real-time chat  
⏳ **Image Upload**: To Firebase Storage  

## 🌐 Deploy Backend (Optional - 20 minutes)

To enable full functionality, deploy the backend:

### Quick Deploy to Render:

1. **Create `server.js` in a new folder:**

```javascript
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// Auth middleware
async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// Mock database (replace with real DB)
const orders = [];
const users = {};

// Register endpoint
app.post('/api/auth/register', authenticate, (req, res) => {
  const { firebaseUid, email, name, phone, role } = req.body;
  users[firebaseUid] = { id: firebaseUid, email, name, phone, role, createdAt: new Date() };
  res.json({ user: users[firebaseUid] });
});

// Login endpoint
app.post('/api/auth/login', authenticate, (req, res) => {
  const user = users[req.user.uid];
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

// Get orders
app.get('/api/orders/customer/me', authenticate, (req, res) => {
  const userOrders = orders.filter(o => o.customerId === req.user.uid);
  res.json(userOrders);
});

// Create order
app.post('/api/orders', authenticate, (req, res) => {
  const order = {
    id: Date.now().toString(),
    customerId: req.user.uid,
    ...req.body,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  orders.push(order);
  res.json(order);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

2. **Deploy to Render:**
   - Create account at [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repo or upload code
   - Set build command: `npm install`
   - Set start command: `node server.js`
   - Add environment variable: `FIREBASE_SERVICE_ACCOUNT` (get from Firebase Console)
   - Deploy!

3. **Update `.env`:**
```env
EXPO_PUBLIC_API_URL=https://your-app.onrender.com
```

## 📚 Next Steps

Once you're comfortable with the basics:

1. **Read Full Documentation**
   - [README.md](./README.md) - Complete overview
   - [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) - API details
   - [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Advanced Firebase setup

2. **Setup Storage (for image uploads)**
   - Enable Firebase Storage
   - Copy security rules from FIREBASE_SETUP.md

3. **Setup Firestore (for messaging)**
   - Enable Firestore Database
   - Copy security rules from FIREBASE_SETUP.md

4. **Add Features**
   - Payment integration
   - Push notifications
   - Analytics

## 🆘 Need Help?

### Common Issues:

**"Expo Go won't connect"**
- Make sure phone and computer on same WiFi
- Try using tunnel mode: `expo start --tunnel`

**"Build errors"**
- Clear cache: `expo start -c`
- Delete node_modules and reinstall

**"Firebase errors"**
- Double-check `.env` values
- Ensure Authentication is enabled
- Check Firebase Console for error logs

### Get Support:

- Check [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for architecture details
- Review [SCREENS_PROGRESS.md](./SCREENS_PROGRESS.md) for feature status
- Search GitHub issues
- Ask in Expo Discord

## ✅ Success Checklist

After setup, you should be able to:
- [ ] App launches without errors
- [ ] Sign up creates a new user in Firebase
- [ ] Sign in works with created account
- [ ] Can browse tailor profiles
- [ ] Can view portfolio images
- [ ] Can navigate through all screens
- [ ] Settings page displays correctly

## 🎯 Development Workflow

```bash
# Start development
npm start

# Make changes to code
# Expo will auto-reload

# Run linter
npm run lint

# Type check
npm run type-check

# Build for production (when ready)
eas build --platform ios
eas build --platform android
```

## 📊 Project Status

**Current**: 85% Complete  
**Working**: Auth, UI, Navigation, Design System  
**Pending**: Backend deployment, Payments, Notifications  

---

**🚀 Happy Coding!**

If you encounter any issues, refer to the comprehensive guides in the project documentation.
