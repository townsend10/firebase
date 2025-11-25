// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/auth";
import {
  AuthError,
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
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

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore with persistent cache (1 week = 604800000 ms)
const db = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: 100 * 1024 * 1024, // 100 MB cache size
  }),
});

const auth = getAuth(firebaseApp);

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
