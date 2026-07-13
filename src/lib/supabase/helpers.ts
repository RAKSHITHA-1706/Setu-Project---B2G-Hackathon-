import { supabase } from './client'
import type { PostgrestError } from '@supabase/supabase-js'

// ─── Result Type ──────────────────────────────────────────────────────────────

/**
 * Typed Result monad for service-layer returns.
 * Forces callers to handle both success and error explicitly.
 *
 * @example
 * const result = await patientsService.getAll()
 * if (result.error) { ... }
 * result.data // typed
 */
export type Result<T> =
  | { data: T; error: null }
  | { data: null; error: string }

/**
 * Wrap a Supabase response into a Result type.
 * Normalizes PostgrestError into a plain string.
 */
export function toResult<T>(
  data: T | null,
  error: PostgrestError | null
): Result<T> {
  if (error || data === null) {
    return { data: null, error: error?.message ?? 'An unexpected error occurred' }
  }
  return { data, error: null }
}

// ─── Query Helpers ────────────────────────────────────────────────────────────

/**
 * Fetch a single row by ID with Result wrapping.
 * @example
 * const result = await fetchById('patients', patientId)
 */
export async function fetchById<T>(
  table: string,
  id: string
): Promise<Result<T>> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single()

  return toResult<T>(data as T | null, error)
}

/**
 * Log a Supabase error consistently.
 * Use this in every service's catch block.
 */
export function logSupabaseError(context: string, error: PostgrestError | Error | unknown): void {
  console.error(`[Supabase][${context}]`, error)
}
