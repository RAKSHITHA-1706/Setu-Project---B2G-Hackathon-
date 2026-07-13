import type { RiskThresholds } from '../types'

/**
 * Risk thresholds for each disease module.
 * Modules may override these if the clinical calibration differs.
 *
 * Structure: score <= threshold → that tier.
 * CRITICAL = anything above HIGH threshold.
 */

export const DEFAULT_THRESHOLDS: RiskThresholds = {
  low: 30,     // 0–30  → LOW
  medium: 60,  // 31–60 → MEDIUM
  high: 80,    // 61–80 → HIGH
               // 81+   → CRITICAL
}

/**
 * Hypertension-specific thresholds.
 * Slightly more aggressive — hypertension drop-off risk escalates faster.
 */
export const HYPERTENSION_THRESHOLDS: RiskThresholds = {
  low: 25,
  medium: 55,
  high: 75,
}

/**
 * Thresholds for future disease modules (placeholders).
 * Override per clinical guidance when implementing.
 */
export const DIABETES_THRESHOLDS: RiskThresholds = DEFAULT_THRESHOLDS
export const TUBERCULOSIS_THRESHOLDS: RiskThresholds = {
  low: 20,  // TB drop-off is especially high risk
  medium: 50,
  high: 75,
}
export const MATERNAL_THRESHOLDS: RiskThresholds = DEFAULT_THRESHOLDS
export const COPD_THRESHOLDS: RiskThresholds = DEFAULT_THRESHOLDS
