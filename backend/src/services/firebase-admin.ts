// Firebase Admin SDK Service

import * as admin from 'firebase-admin';

let initialized = false;
let mockMode = false;
let mockApp: any = null;

export function initializeFirebaseAdmin() {
  if (initialized) {
    return mockMode ? mockApp : admin.app();
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    // For development, allow running without Firebase Admin if credentials are not set
    if (!projectId || !privateKey || !clientEmail || privateKey.includes('...') || clientEmail.includes('xxxxx')) {
      console.warn('⚠️  Firebase Admin credentials not found or are placeholders. Running in development mode without Firebase Admin.');
      console.warn('⚠️  Authentication will be bypassed. Set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL for production.');

      mockMode = true;
      mockApp = getMockApp();
      initialized = true;
      return mockApp;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
    });

    initialized = true;
    return admin.app();
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
    throw error;
  }
}

function getMockApp() {
  return {
    auth: {
      verifyIdToken: async () => ({
        uid: 'dev-user-123',
        email: 'dev@example.com',
        name: 'Dev User',
      }),
    },
    firestore: {
      collection: (_name: string) => ({
        doc: (_id: string) => ({
          get: async () => ({ exists: false, data: () => null }),
          set: async () => {},
          update: async () => {},
        }),
        where: () => ({
          get: async () => ({ docs: [] }),
        }),
        get: async () => ({ docs: [] }),
      }),
    },
  };
}

// Conditional exports based on whether we're in mock mode
export const auth = mockMode ? mockApp.auth : admin.auth;
export const firestore = mockMode ? mockApp.firestore : admin.firestore;
export const storage = mockMode ? null : admin.storage;

export default admin;
