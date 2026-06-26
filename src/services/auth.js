/**
 * Authentication service — thin wrapper around Supabase Auth.
 * Bella CRM is a single-operator app, so we only need email/password sign-in.
 */
import { supabase } from './supabase'

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export function subscribeToAuth(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
  // Fire immediately with current session
  supabase.auth.getSession().then(({ data: { session } }) => {
    callback(session?.user ?? null)
  })
  return () => subscription.unsubscribe()
}

export function authErrorMessage(code) {
  const map = {
    'invalid_credentials': 'פרטי התחברות שגויים',
    'email_not_confirmed': 'האימייל לא אומת',
    'user_not_found': 'משתמש לא נמצא',
    'too_many_requests': 'יותר מדי ניסיונות, נסה שוב מאוחר יותר',
    'auth/invalid-email': 'כתובת אימייל לא תקינה',
    'auth/user-disabled': 'המשתמש חסום',
    'auth/user-not-found': 'משתמש לא נמצא',
    'auth/wrong-password': 'סיסמה שגויה',
    'auth/invalid-credential': 'פרטי התחברות שגויים',
    'auth/too-many-requests': 'יותר מדי ניסיונות, נסה שוב מאוחר יותר',
  }
  return map[code] || 'אירעה שגיאה בהתחברות'
}
