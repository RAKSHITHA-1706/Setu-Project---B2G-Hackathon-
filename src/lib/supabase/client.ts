import { createClient } from '@supabase/supabase-js'

/**
 * Safely read environment variables.
 * We fall back to empty strings to prevent hard crashes if env vars are missing,
 * but we log a clear warning to the console.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ [Setu] Supabase environment variables are missing! ' +
    'Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env.local file. ' +
    'The application may not function correctly until these are provided.'
  )
}

/**
 * Supabase singleton client.
 *
 * Always import from this file — never call createClient() elsewhere.
 * This ensures one connection is shared across the entire app.
 *
 * @example
 * import { supabase } from '@/lib/supabase/client'
 * const { data, error } = await supabase.from('patients').select('*')
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co', // Prevent crash on init if missing
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
