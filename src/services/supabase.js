/**
 * Supabase client for Bella CRM.
 * Replaces Firebase configuration.
 */
import { createClient } from '@supabase/supabase-js'

const env = import.meta.env || {}

const supabaseUrl = env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0NiK7w9Ic0xFaYlim-b0vR4tCGQiecZDDt7xCi4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default supabase
