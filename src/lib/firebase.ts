// Firebase configuration - the backbone of our auth system 🔥
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, initializeAuth, browserLocalPersistence, browserSessionPersistence, inMemoryPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy_api_key_for_build",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "localhost",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy_project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:default"
}

// Initialize Firebase (get existing app if already initialized)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
// Use inMemoryPersistence on the server to prevent localStorage errors in Node 25
export const auth = typeof window !== 'undefined' 
  ? getAuth(app) 
  : initializeAuth(app, { persistence: inMemoryPersistence })

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Export the app instance if needed elsewhere
export default app
