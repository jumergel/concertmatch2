
import { createClient } from '@supabase/supabase-js'

// Fallback to empty strings to prevent crash on import, but auth calls will fail if not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables! Check your .env file.")
}

// Only create client if URL looks valid-ish to avoid "Invalid URL" error
// Otherwise create a dummy object so screen renders (with error in console)
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http'))
    ? createClient(supabaseUrl, supabaseAnonKey)
    : { auth: { signUp: () => Promise.resolve({ error: { message: "Supabase not configured. Check .env" } }) } }
