// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/auth";
import {
  AuthError,
  browserLocalPersistence,
  getAuth,
  setPersistence,
  Auth,
} from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase with singleton pattern to prevent re-initialization during hot reloads
let firebaseApp: FirebaseApp;
let db: Firestore;
let auth: Auth;

// Check if Firebase app is already initialized
if (!getApps().length) {
  // Initialize Firebase only if not already initialized
  firebaseApp = initializeApp(firebaseConfig);

  // Initialize Firestore with persistent cache (1 week = 604800000 ms)
  db = initializeFirestore(firebaseApp, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
      cacheSizeBytes: 100 * 1024 * 1024, // 100 MB cache size
    }),
  });

  auth = getAuth(firebaseApp);
} else {
  // Use existing Firebase app instance
  firebaseApp = getApp();
  auth = getAuth(firebaseApp);
  // Note: Firestore instance is already initialized, we just need to import it
  db = getFirestore(firebaseApp);
}

export const initializeAuth = async () => {
  try {
    // Use local persistence to keep user logged in across sessions
    await setPersistence(auth, browserLocalPersistence);
    console.log("Local persistence set successfully");
    return auth;
  } catch (error: any) {
    console.error("Error setting persistence:", error);
    if (error as AuthError) {
      console.error("Firebase Authentication Error:", error.code);
    }
    throw error;
  }
};

export { firebaseApp, auth, db };
