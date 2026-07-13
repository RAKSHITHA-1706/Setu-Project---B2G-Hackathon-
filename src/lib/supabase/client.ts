import { createClient } from '@supabase/supabase-js'
import { env } from '@/config/env'

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
export const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
