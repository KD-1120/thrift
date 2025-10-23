// Firebase Configuration and Services

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  FirebaseStorage,
} from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

type ReactNativeAuthModule = {
  initializeAuth: typeof import('firebase/auth').initializeAuth;
  getReactNativePersistence: (storage: typeof AsyncStorage) => any;
};

let reactNativeAuthModule: ReactNativeAuthModule | null = null;

if (Platform.OS !== 'web') {
  try {
    reactNativeAuthModule = require('firebase/auth/react-native') as ReactNativeAuthModule;
  } catch (error) {
    console.warn('firebase/auth/react-native module not available, falling back to default persistence.', error);
  }
}

export const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      
      if (Platform.OS === 'web' || !reactNativeAuthModule) {
        auth = getAuth(app);
      } else {
        // Use AsyncStorage-backed persistence on native platforms
        auth = reactNativeAuthModule.initializeAuth(app, {
          persistence: reactNativeAuthModule.getReactNativePersistence(AsyncStorage),
        });
      }
      
      db = getFirestore(app);
      storage = getStorage(app);
    } else {
      app = getApps()[0];
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
    }
    
    return { app, auth, db, storage };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

// Initialize Firebase immediately
const { auth: firebaseAuth, db: firebaseDb, storage: firebaseStorage } = initializeFirebase();

// Export initialized instances
export { firebaseAuth as auth, firebaseDb as db, firebaseStorage as storage };

// ========================================
// Authentication Services
// ========================================

export const authService = {
  // Sign up with email and password
  signUp: async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return userCredential.user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  },

  // Send password reset email
  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Failed to send reset email');
    }
  },

  // Get current user
  getCurrentUser: (): FirebaseUser | null => {
    return auth.currentUser;
  },

  // Get ID token
  getIdToken: async (): Promise<string | null> => {
    try {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  },
};

// ========================================
// Firestore Services
// ========================================

export const firestoreService = {
  // Add document to collection
  addDocument: async (collectionName: string, data: any) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  },

  // Update document
  updateDocument: async (collectionName: string, docId: string, data: any) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete document
  deleteDocument: async (collectionName: string, docId: string) => {
    try {
      await deleteDoc(doc(db, collectionName, docId));
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Get document by ID
  getDocument: async (collectionName: string, docId: string) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  },

  // Query documents
  queryDocuments: async (
    collectionName: string,
  conditions: { field: string; operator: any; value: any }[] = [],
    orderByField?: string,
    limitCount?: number
  ) => {
    try {
      let q = query(collection(db, collectionName));

      // Apply where conditions
      conditions.forEach(({ field, operator, value }) => {
        q = query(q, where(field, operator, value));
      });

      // Apply ordering
      if (orderByField) {
        q = query(q, orderBy(orderByField, 'desc'));
      }

      // Apply limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  },

  // Real-time listener
  subscribeToCollection: (
    collectionName: string,
    callback: (data: any[]) => void,
  conditions: { field: string; operator: any; value: any }[] = []
  ) => {
    let q = query(collection(db, collectionName));

    conditions.forEach(({ field, operator, value }) => {
      q = query(q, where(field, operator, value));
    });

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(data);
    });
  },
};

// ========================================
// Storage Services
// ========================================

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export const storageService = {
  // Upload image with progress tracking
  uploadImage: async (
    uri: string,
    path: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> => {
    try {
      // Fetch the image as blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create storage reference
      const storageRef = ref(storage, path);

      // Upload with progress tracking
      if (onProgress) {
        const uploadTask = uploadBytesResumable(storageRef, blob);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = {
                bytesTransferred: snapshot.bytesTransferred,
                totalBytes: snapshot.totalBytes,
                progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              };
              onProgress(progress);
            },
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      } else {
        // Upload without progress tracking
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Upload multiple images
  uploadMultipleImages: async (
    uris: string[],
    basePath: string,
    onProgress?: (index: number, progress: UploadProgress) => void
  ): Promise<string[]> => {
    try {
      const uploadPromises = uris.map((uri, index) => {
        const fileName = `${Date.now()}_${index}.jpg`;
        const path = `${basePath}/${fileName}`;

        return storageService.uploadImage(
          uri,
          path,
          onProgress ? (progress) => onProgress(index, progress) : undefined
        );
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  },

  // Delete image
  deleteImage: async (imageUrl: string): Promise<void> => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Get download URL
  getDownloadUrl: async (path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  },
};

// ========================================
// Messaging Services (Firestore-based)
// ========================================

export const messagingService = {
  // Send message
  sendMessage: async (senderId: string, recipientId: string, content: string, messageType: 'text' | 'image' = 'text', imageUrl?: string) => {
    try {
      const conversationId = [senderId, recipientId].sort().join('_');
      
      await firestoreService.addDocument(`conversations/${conversationId}/messages`, {
        senderId,
        recipientId,
        content,
        messageType,
        imageUrl,
        read: false,
        createdAt: serverTimestamp(),
      });
      
      // Update conversation metadata
      await firestoreService.updateDocument('conversations', conversationId, {
        lastMessage: content,
        lastMessageAt: serverTimestamp(),
        participants: [senderId, recipientId],
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Subscribe to messages
  subscribeToMessages: (
    userId: string,
    otherUserId: string,
    callback: (messages: any[]) => void
  ) => {
    const conversationId = [userId, otherUserId].sort().join('_');
    
    return firestoreService.subscribeToCollection(
      `conversations/${conversationId}/messages`,
      callback,
      []
    );
  },

  // Get conversations list
  getConversations: async (userId: string) => {
    try {
      return await firestoreService.queryDocuments(
        'conversations',
        [{ field: 'participants', operator: 'array-contains', value: userId }],
        'lastMessageAt'
      );
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  },
};

export default {
  auth: authService,
  firestore: firestoreService,
  storage: storageService,
  messaging: messagingService,
};
