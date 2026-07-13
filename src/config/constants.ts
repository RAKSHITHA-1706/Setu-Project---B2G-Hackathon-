/**
 * Application-wide constants.
 * Keep magic strings, limits, and timeouts here — never inline them.
 */

export const APP_NAME = 'Setu' as const
export const APP_TAGLINE = 'Screening finds them. Setu keeps them.' as const
export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '0.1.0'

// ─── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// ─── Risk Engine ──────────────────────────────────────────────────────────────
export const RISK_SCORE_MIN = 0
export const RISK_SCORE_MAX = 100

export const RISK_THRESHOLDS = {
  LOW: 30,      // 0–30  → Low
  MEDIUM: 60,   // 31–60 → Medium
  HIGH: 80,     // 61–80 → High
  CRITICAL: 81, // 81+   → Critical
} as const

// ─── Date & Time ──────────────────────────────────────────────────────────────
export const DATE_FORMAT = 'dd MMM yyyy' as const
export const DATETIME_FORMAT = 'dd MMM yyyy, HH:mm' as const
export const TIME_FORMAT = 'HH:mm' as const

// ─── Disease Modules ──────────────────────────────────────────────────────────
export const DISEASE_MODULES = {
  HYPERTENSION: 'hypertension',
  DIABETES: 'diabetes',
  TUBERCULOSIS: 'tuberculosis',
  MATERNAL: 'maternal',
  COPD: 'copd',
} as const

export type DiseaseModuleKey = (typeof DISEASE_MODULES)[keyof typeof DISEASE_MODULES]

// ─── UI ───────────────────────────────────────────────────────────────────────
export const TOAST_DURATION_MS = 4000
export const DEBOUNCE_SEARCH_MS = 300
export const SKELETON_DELAY_MS = 150

// ─── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'setu_auth_token',
  USER_PREFERENCES: 'setu_prefs',
  SIDEBAR_COLLAPSED: 'setu_sidebar_collapsed',
} as const
