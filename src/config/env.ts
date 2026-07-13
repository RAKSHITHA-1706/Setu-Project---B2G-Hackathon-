import { z } from 'zod'

/**
 * Validated environment variables.
 * Fails fast at startup if required vars are missing.
 * All VITE_* vars are strings; cast explicitly.
 */
const envSchema = z.object({
  // Supabase
  VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL must be a valid URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'VITE_SUPABASE_ANON_KEY is required'),

  // App
  VITE_APP_NAME: z.string().default('Setu'),
  VITE_APP_VERSION: z.string().default('0.1.0'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),

  // Feature Flags
  VITE_FF_DIABETES_MODULE: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
  VITE_FF_TUBERCULOSIS_MODULE: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
  VITE_FF_MATERNAL_MODULE: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
  VITE_FF_COPD_MODULE: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('❌ [Setu] Invalid environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment configuration. Check .env.local against .env.example.')
}

export const env = parsed.data

export const isDev = env.VITE_APP_ENV === 'development'
export const isProd = env.VITE_APP_ENV === 'production'

/**
 * Feature flags derived from env vars.
 * Check these before rendering disease-module UI.
 */
export const featureFlags = {
  diabetes: env.VITE_FF_DIABETES_MODULE,
  tuberculosis: env.VITE_FF_TUBERCULOSIS_MODULE,
  maternal: env.VITE_FF_MATERNAL_MODULE,
  copd: env.VITE_FF_COPD_MODULE,
} as const
