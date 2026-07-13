/**
 * Global TypeScript declarations for Setu.
 * Extends Vite's import.meta.env with typed environment variables.
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
  readonly VITE_FF_DIABETES_MODULE: string
  readonly VITE_FF_TUBERCULOSIS_MODULE: string
  readonly VITE_FF_MATERNAL_MODULE: string
  readonly VITE_FF_COPD_MODULE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
