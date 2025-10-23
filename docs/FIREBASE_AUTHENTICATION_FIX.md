# Firebase Authentication Error Fix

## ❌ Error
```
FirebaseError: Firebase: Error (auth/operation-not-allowed)
```

## 🔍 Root Cause
Email/Password authentication is **not enabled** in your Firebase project.

## ✅ Solution: Enable Email/Password Authentication

### Step 1: Go to Firebase Console
1. Open https://console.firebase.google.com
2. Sign in with your Google account
3. Select your project (e.g., "ThriftAccra")

### Step 2: Navigate to Authentication
1. Click **"Authentication"** in the left sidebar
2. Click the **"Sign-in method"** tab at the top

### Step 3: Enable Email/Password Provider
1. Find **"Email/Password"** in the list of providers
2. Click on it to open settings
3. Toggle **"Enable"** switch to ON (blue)
4. Click **"Save"**

### Step 4: Test Your App Again
1. Restart your app (if needed)
2. Try signing up with email/password
3. Should work now! ✅

---

## 📋 Alternative: Firebase CLI Method

If you prefer using the command line:

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize or update Firebase config
firebase init auth

# Follow prompts to enable Email/Password
```

---

## 🔐 Additional Security Settings (Optional)

While you're in the Firebase Console:

### 1. Email Enumeration Protection
- **Authentication > Settings**
- Enable "Email enumeration protection"
- Prevents attackers from discovering registered emails

### 2. Password Policy
- Set minimum password length (default: 6 characters)
- Consider requiring special characters

### 3. Email Verification
- Enable email verification for new accounts
- Add to SignUp flow in your app

---

## 🧪 Verify Firebase Configuration

Check your `.env` file has correct Firebase credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

---

## 🐛 Other Common Firebase Auth Errors

### Error: auth/invalid-api-key
- **Fix**: Check your `EXPO_PUBLIC_FIREBASE_API_KEY` in `.env`

### Error: auth/network-request-failed
- **Fix**: Check internet connection or Firebase service status

### Error: auth/weak-password
- **Fix**: Password must be at least 6 characters

### Error: auth/email-already-in-use
- **Fix**: Email is already registered, use Sign In instead

### Error: auth/invalid-email
- **Fix**: Check email format is valid

---

## 📝 Testing Checklist

After enabling Email/Password authentication:

- [ ] Clear app cache/data
- [ ] Restart Metro bundler
- [ ] Try signing up with new email
- [ ] Verify user appears in Firebase Console > Authentication > Users
- [ ] Try signing in with created account
- [ ] Test password reset flow

---

## 🚀 Next Steps After Fixing

1. **Test Sign Up Flow**
   - Create new account
   - Verify token stored
   - Check backend profile created

2. **Test Sign In Flow**
   - Login with created account
   - Verify navigation to Home

3. **Test Complete Booking Flow**
   - Home → CategoryBrowse → TailorProfile
   - TailorGallery → ServiceDetail → BookingFlow

---

## 📞 Need Help?

If you still see errors after enabling Email/Password:

1. **Check Firebase Console > Authentication > Users**
   - Verify users tab is accessible
   - Check if any users exist

2. **Verify Firebase Project**
   - Ensure you're using the correct project
   - Check project ID matches your `.env`

3. **Clear Credentials**
   ```bash
   # Clear app data
   npx expo start -c
   
   # Or manually clear AsyncStorage in app
   ```

4. **Check Firebase Status**
   - Visit https://status.firebase.google.com
   - Ensure no outages

---

## ✨ Success Indicators

After fixing, you should see:

✅ Sign up creates user in Firebase Console
✅ No more `auth/operation-not-allowed` error
✅ User token stored in SecureStore
✅ Backend profile created successfully
✅ User navigated to Home screen

---

## 🎯 Quick Summary

**Problem**: Email/Password auth not enabled in Firebase
**Solution**: Enable it in Firebase Console > Authentication > Sign-in method
**Time**: 2 minutes
**Difficulty**: Easy ⭐

**After fixing, your authentication flow will work end-to-end! 🎉**
