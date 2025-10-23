// Firebase Admin SDK Service

import * as admin from 'firebase-admin';

let initialized = false;

export function initializeFirebaseAdmin() {
  if (initialized) {
    console.log('Firebase Admin already initialized');
    return admin.app();
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    // For development, allow running without Firebase Admin if credentials are not set
    if (!projectId || !privateKey || !clientEmail || privateKey.includes('...') || clientEmail.includes('xxxxx')) {
      console.warn('⚠️  Firebase Admin credentials not found or are placeholders. Running in development mode without Firebase Admin.');
      console.warn('⚠️  Authentication will be bypassed. Set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL for production.');

      // Create a mock admin app for development
      const mockApp = {
        auth: () => ({
          verifyIdToken: async () => ({
            uid: 'dev-user-123',
            email: 'dev@example.com',
            name: 'Dev User',
          }),
        }),
        firestore: () => ({
          collection: () => ({
            doc: () => ({
              get: async () => ({ exists: false }),
              set: async () => {},
              update: async () => {},
            }),
            where: () => ({
              get: async () => ({ docs: [] }),
            }),
          }),
        }),
      };

      initialized = true;
      return mockApp as any;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
    });

    initialized = true;
    console.log('✅ Firebase Admin initialized successfully');
    return admin.app();
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
    throw error;
  }
}

export const auth = admin.auth;
export const firestore = admin.firestore;
export const storage = admin.storage;

export default admin;
