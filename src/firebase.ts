import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref } from 'firebase/database';

// Your web app's Firebase configuration
// Vite automatically loads .env variables prefixed with VITE_ into import.meta.env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Debug: log config in development (remove in production)
if (import.meta.env.DEV) {
  console.log('[Firebase Config]', {
    apiKey: firebaseConfig.apiKey ? '***' + firebaseConfig.apiKey.slice(-6) : 'MISSING',
    authDomain: firebaseConfig.authDomain || 'MISSING',
    projectId: firebaseConfig.projectId || 'MISSING',
    databaseURL: firebaseConfig.databaseURL || 'MISSING',
  })
}

// Initialize Firebase — let it fail loudly if config is invalid
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const database = getDatabase(app);

// Google provider
export const googleProvider = new GoogleAuthProvider();

// Export a reference to the root of the database
export const dbRef = ref(database);

// Optional: Export types for use in components
export type { User } from 'firebase/auth';
