/**
 * Route path constants.
 * Always use these constants — never hardcode paths in components.
 *
 * Usage:
 *   import { ROUTES } from '@/config/routes'
 *   navigate(ROUTES.PATIENT_DETAIL('abc-123'))
 */

export const ROUTES = {
  // ─── Top-level ──────────────────────────────────────────────
  ROOT: '/',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '*',

  // ─── Patients ───────────────────────────────────────────────
  PATIENTS: '/patients',
  PATIENT_DETAIL: (id: string = ':id') => `/patients/${id}`,
  PATIENT_NEW: '/patients/new',

  // ─── Referrals ──────────────────────────────────────────────
  REFERRALS: '/referrals',
  REFERRAL_DETAIL: (id: string = ':id') => `/referrals/${id}`,

  // ─── Analytics ──────────────────────────────────────────────
  ANALYTICS: '/analytics',

  // ─── Settings ───────────────────────────────────────────────
  SETTINGS: '/settings',
} as const
