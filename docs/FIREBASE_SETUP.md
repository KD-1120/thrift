# Firebase Setup Guide for ThriftAccra

This guide walks you through setting up Firebase for the ThriftAccra application.

## 📋 Prerequisites

- Google account
- Firebase project quota available (free tier is sufficient)

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `thriftaccra` (or your preferred name)
4. *Optional*: Enable Google Analytics (recommended)
5. Click **"Create project"**
6. Wait for project to be created

### 2. Register Web App

1. From project overview, click the **Web icon** (`</>`)
2. Enter app nickname: `ThriftAccra Mobile`
3. *Optional*: Check "Also set up Firebase Hosting" (not needed for mobile)
4. Click **"Register app"**
5. **Copy the configuration object** - you'll need this for `.env`

```javascript
// Your Firebase configuration will look like this:
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

6. Click **"Continue to console"**

### 3. Enable Authentication

1. In left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle to enable
   - Click "Save"

#### Optional: Enable Social Login

**Google Sign-In:**
1. Click "Google" provider
2. Toggle to enable
3. Enter support email
4. Click "Save"

**Facebook Sign-In:**
1. Click "Facebook" provider
2. Toggle to enable
3. Enter App ID and App secret from Facebook Developers
4. Copy OAuth redirect URI
5. Add redirect URI to Facebook app settings
6. Click "Save"

### 4. Setup Firestore Database

1. In left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add rules next)
4. Choose location: `us-central1` or closest to Ghana (`europe-west1`)
5. Click **"Enable"**

#### Set Security Rules

1. Go to **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is participant in conversation
    function isParticipant(participants) {
      return isAuthenticated() && 
             request.auth.uid in participants;
    }
    
    // Conversations collection
    match /conversations/{conversationId} {
      allow read: if isParticipant(resource.data.participants);
      allow create: if isAuthenticated();
      allow update: if isParticipant(resource.data.participants);
      
      // Messages subcollection
      match /messages/{messageId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated();
        allow update: if isAuthenticated() && 
                       request.auth.uid == resource.data.senderId;
      }
    }
    
    // User profiles (optional if you want to store in Firestore)
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

### 5. Setup Cloud Storage

1. In left sidebar, click **"Storage"**
2. Click **"Get started"**
3. Keep default security rules (we'll customize them)
4. Choose same location as Firestore
5. Click **"Done"**

#### Set Storage Rules

1. Go to **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Order reference images
    match /orders/{orderId}/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
      allow delete: if isAuthenticated();
    }
    
    // Tailor portfolio images (public read)
    match /tailors/{tailorId}/portfolio/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthenticated();
      allow delete: if isAuthenticated();
    }
    
    // User avatars (public read, owner write)
    match /users/{userId}/avatar/{allPaths=**} {
      allow read: if true;
      allow write: if isOwner(userId);
      allow delete: if isOwner(userId);
    }
    
    // Measurement guide images (public read)
    match /guides/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Admin only
    }
  }
}
```

3. Click **"Publish"**

### 6. (Optional) Setup Cloud Functions

If you want to add backend logic (e.g., send notifications):

1. In left sidebar, click **"Functions"**
2. Click **"Get started"**
3. Follow the setup wizard to install Firebase CLI
4. Initialize functions in your project

Example function for sending notifications:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Send notification when order status changes
exports.onOrderStatusChange = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const newStatus = change.after.data().status;
    const customerId = change.after.data().customerId;
    
    // Get user's FCM token
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(customerId)
      .get();
    
    const fcmToken = userDoc.data().fcmToken;
    
    if (fcmToken) {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: 'Order Update',
          body: `Your order status: ${newStatus}`
        }
      });
    }
  });
```

### 7. Get Firebase Configuration

1. Click gear icon (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Find your web app
5. Copy the configuration values

### 8. Update `.env` File

Create or update `.env` in your project root:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 9. Test Firebase Connection

Run your app and try to:
1. Sign up a new user
2. Sign in with created user
3. Upload an image
4. Send a test message

Monitor these in Firebase Console:
- **Authentication** → Users (should see new users)
- **Storage** → Files (should see uploaded images)
- **Firestore** → Data (should see messages)

## 🔒 Security Best Practices

### DO:
✅ Use Firebase security rules to restrict access  
✅ Store sensitive config in environment variables  
✅ Enable App Check to prevent abuse  
✅ Set up billing alerts  
✅ Regularly review Authentication logs  
✅ Use HTTPS only  

### DON'T:
❌ Commit `.env` file to git  
❌ Share API keys publicly  
❌ Use "test mode" rules in production  
❌ Store sensitive data in Firestore without encryption  
❌ Allow unauthenticated writes  

## 📊 Firebase Quotas (Free Tier)

### Firestore
- **Stored data**: 1 GB
- **Document reads**: 50,000/day
- **Document writes**: 20,000/day
- **Document deletes**: 20,000/day

### Storage
- **Stored data**: 5 GB
- **Downloads**: 1 GB/day
- **Uploads**: 20,000/day

### Authentication
- **Email/Password**: Unlimited
- **Phone auth**: 10,000 verifications/month

### Cloud Functions
- **Invocations**: 2,000,000/month
- **Compute time**: 400,000 GB-seconds/month
- **Egress**: 5 GB/month

## 🆘 Troubleshooting

### "Firebase app not initialized"
- Check that Firebase config is correctly set in `.env`
- Ensure `EXPO_PUBLIC_` prefix is used
- Restart Expo dev server after changing `.env`

### "Permission denied" errors
- Check Firestore/Storage security rules
- Verify user is authenticated
- Check if user has proper permissions

### Authentication not working
- Verify Email/Password is enabled in console
- Check if API key is correct
- Ensure network connectivity

### Images not uploading
- Check Storage security rules
- Verify storage bucket name
- Check file size limits

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Pricing](https://firebase.google.com/pricing)
- [Expo Firebase Integration](https://docs.expo.dev/guides/using-firebase/)

## 🎉 Next Steps

After completing this setup:

1. ✅ Test authentication flow
2. ✅ Upload a test image
3. ✅ Send a test message
4. 🔜 Deploy backend to Render
5. 🔜 Connect mobile app to backend
6. 🔜 Test full order flow

---

Need help? Check the [README.md](./README.md) or [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
