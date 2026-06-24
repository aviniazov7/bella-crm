/**
 * Authentication service — thin wrapper around Firebase Auth.
 * Bella CRM is a single-operator app, so we only need email/password sign-in.
 */
import { signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

/**
 * Sign in with email + password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').User>}
 */
export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

/** Sign the current user out. */
export function signOut() {
  return fbSignOut(auth)
}

/**
 * Subscribe to auth state changes.
 * @param {(user: import('firebase/auth').User | null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback)
}

/** Map a Firebase auth error code to a human-friendly message. */
export function authErrorMessage(code) {
  const map = {
    'auth/invalid-email': 'כתובת אימייל לא תקינה',
    'auth/user-disabled': 'המשתמש חסום',
    'auth/user-not-found': 'משתמש לא נמצא',
    'auth/wrong-password': 'סיסמה שגויה',
    'auth/invalid-credential': 'פרטי התחברות שגויים',
    'auth/too-many-requests': 'יותר מדי ניסיונות, נסה שוב מאוחר יותר',
  }
  return map[code] || 'אירעה שגיאה בהתחברות'
}
