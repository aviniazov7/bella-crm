/**
 * Firebase bootstrap for Bella CRM.
 *
 * Configuration is read from Vite env vars (see .env.example). When the env is
 * not populated (e.g. during local CI or tests) a harmless placeholder config is
 * used so module import never throws — real network calls simply won't succeed.
 */
import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const env = import.meta.env || {}

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'placeholder-api-key',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'bella-crm.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'bella-crm',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'bella-crm.appspot.com',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: env.VITE_FIREBASE_APP_ID || '1:000000000000:web:placeholder',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || 'G-PLACEHOLDER',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Wire up local emulators when explicitly requested.
if (env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectStorageEmulator(storage, 'localhost', 9199)
  } catch {
    // Emulators already connected or unavailable — safe to ignore.
  }
}

export default app
