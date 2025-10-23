# ThriftAccra - Custom Tailoring Marketplace

A modern React Native mobile application connecting customers with expert tailors in Accra, Ghana.

## 🎯 Overview

ThriftAccra is a comprehensive platform that enables:
- **Customers**: Browse tailors, place custom orders, track progress, and manage measurements
- **Tailors**: Showcase portfolios, manage orders, communicate with clients, and build their business

## 🏗️ Tech Stack

### Frontend
- **React Native** with Expo (~52.0.0)
- **TypeScript** for type safety
- **Redux Toolkit** with RTK Query for state management
- **React Navigation** for routing
- **Expo modules** (Camera, Image Picker, Secure Store, Notifications)

### Backend Architecture
- **Firebase**: Authentication, Real-time Messaging, Media Storage
- **Render (REST API)**: Orders, Profiles, Measurements, Business Logic
- **Hybrid approach** for optimal performance and scalability

## 📱 Features

### Core Features
✅ User authentication (sign up, sign in, password reset)  
✅ Role-based access (Customer/Tailor)  
✅ Tailor discovery and search  
✅ Portfolio browsing with image galleries  
✅ Custom order creation with measurements  
✅ Order tracking and status updates  
✅ Real-time messaging between customers and tailors  
✅ Image uploads for reference photos  
✅ Saved measurements management  
✅ User profile and settings  

### Coming Soon
🔜 Payment integration  
🔜 Push notifications  
🔜 Advanced search filters  
🔜 Review and rating system  
🔜 Tailor analytics dashboard  

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio (for Android development)
- Firebase account
- Render account (for backend hosting)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/thriftaccra.git
cd thriftaccra
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**

Create a `.env` file in the root directory:

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

4. **Start the development server**
```bash
npm start
```

5. **Run on device/emulator**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## 🔧 Development

### Project Structure

```
thriftaccra/
├── src/
│   ├── api/                 # RTK Query API definitions
│   │   ├── auth.api.ts
│   │   ├── orders.api.ts
│   │   ├── tailors.api.ts
│   │   └── messaging.api.ts
│   ├── components/          # Reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Avatar.tsx
│   ├── design-system/       # Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   ├── features/            # Feature modules
│   │   ├── auth/
│   │   ├── orders/
│   │   ├── tailors/
│   │   └── messaging/
│   ├── screens/             # App screens
│   ├── services/            # Firebase services
│   │   ├── firebase.ts
│   │   └── camera.ts
│   ├── store/               # Redux store
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   └── navigation.tsx
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── assets/                  # Images, fonts, etc.
├── .env.example             # Environment template
├── App.tsx                  # App entry point
└── package.json
```

### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm run lint       # Run ESLint
npm run type-check # Run TypeScript type checking
npm test           # Run tests
```

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### 2. Enable Authentication

1. Navigate to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable social providers (Google, Facebook)

### 3. Setup Firestore Database

1. Navigate to **Firestore Database**
2. Create database in production mode
3. Set security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

### 4. Setup Storage

1. Navigate to **Storage**
2. Set security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /orders/{orderId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /tailors/{tailorId}/portfolio/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /users/{userId}/avatar/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Get Firebase Configuration

1. Project Settings → General → Your apps
2. Click "Add app" → Web
3. Copy the configuration object
4. Add values to your `.env` file

## 🌐 Backend Setup (Render)

See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for detailed API documentation.

### Quick Start

1. Create a Node.js/Express backend
2. Install Firebase Admin SDK
3. Implement authentication middleware
4. Create API endpoints for orders, users, measurements
5. Deploy to Render (free tier available)

### Sample Backend Structure

```javascript
// server.js
const express = require('express');
const admin = require('firebase-admin');

const app = express();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Auth middleware
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  req.user = decodedToken;
  next();
}

// Routes
app.post('/api/orders', authenticate, createOrder);
app.get('/api/orders/customer/me', authenticate, getCustomerOrders);
// ... more routes

app.listen(3000);
```

## 🎨 Design System

### Colors

The app uses a VOGANTA-inspired color palette:

- **Primary**: Warm earth tones (`#8B7355`)
- **Neutral**: Gray scale for text and backgrounds
- **Semantic**: Success, Error, Warning, Info with full palettes

### Typography

10 text styles with consistent spacing:
- h1, h2, h3 (headings)
- body, bodyLarge, bodySmall (body text)
- caption, label, smallMedium (supporting text)

### Spacing

8px grid system: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`

### Components

Reusable components with variants:
- **Button**: primary, secondary, outline
- **Card**: elevated, outlined, flat
- **Avatar**: circular with initials fallback

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Coverage

- Unit tests for utilities and services
- Integration tests for API calls
- Component tests with React Testing Library

## 📚 Documentation

- [Backend Integration Guide](./BACKEND_INTEGRATION.md) - API endpoints and Firebase setup
- [Screens Progress](./SCREENS_PROGRESS.md) - Development status tracker

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Team Name

## 🙏 Acknowledgments

- Expo team for the amazing framework
- Firebase for backend services
- React Native community

## 📞 Support

For support, email support@thriftaccra.com or join our Slack channel.

---

**Version**: 1.0.0  
**Last Updated**: October 2025
