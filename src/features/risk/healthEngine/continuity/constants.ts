/**
 * Constants and thresholds for the Continuity Risk Engine.
 */

export const WEIGHTS = {
  OVERDUE: 0.30,
  BP_TREND: 0.25,
  ADHERENCE: 0.20,
  DISTANCE: 0.15,
  SEVERITY: 0.10,
} as const

export const THRESHOLDS = {
  MAX_DISTANCE_KM: 20, // Distance beyond this is capped at 1.0 risk
  BASE_SYSTOLIC_BP: 120, // Ideal systolic
  MAX_SYSTOLIC_BP: 200, // Cap for severity normalization
} as const

export const RISK_LEVELS = {
  LOW: { min: 0, max: 33, label: 'LOW' },
  MEDIUM: { min: 34, max: 66, label: 'MEDIUM' },
  HIGH: { min: 67, max: 100, label: 'HIGH' },
} as const

export const SUGGESTED_ACTIONS = {
  LOW: 'Continue routine follow-up.',
  MEDIUM: 'Phone reminder and CHW visit within 7 days.',
  HIGH: 'Immediate CHW home visit.\nRefer to PHC.\nSchedule follow-up within 48 hours.',
} as const
