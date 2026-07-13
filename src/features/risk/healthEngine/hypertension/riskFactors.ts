import type { HypertensionFactorWeights } from './types'

/**
 * Clinical and behavioral weights for the hypertension risk model.
 *
 * These are initial estimates based on published literature on
 * hypertension treatment adherence in low-resource settings.
 *
 * Tune these weights with real data in Phase 3 (Risk Engine).
 *
 * References:
 * - WHO HEARTS Technical Package
 * - IHCI (India Hypertension Control Initiative) program data
 */
export const HYPERTENSION_FACTOR_WEIGHTS: HypertensionFactorWeights = {
  // Strongest predictor — missed visits correlate directly with dropout
  missedAppointments: 0.30,

  // Self-reported adherence — second strongest behavioral signal
  medicationAdherence: 0.25,

  // Uncontrolled BP suggests existing non-adherence
  systolicBp: 0.15,

  // Time since last CHW contact — social support proxy
  daysSinceLastContact: 0.12,

  // Distance to facility — structural barrier
  distanceToFacility: 0.08,

  // Comorbidities — complexity increases dropout risk
  comorbidities: 0.06,

  // Socioeconomic — financial barrier to medication
  incomeCategory: 0.04,
}

/**
 * Human-readable labels for each factor.
 * Used by the RiskBadge explainability panel.
 */
export const HYPERTENSION_FACTOR_LABELS: Record<keyof HypertensionFactorWeights, string> = {
  missedAppointments: 'Missed Appointments',
  medicationAdherence: 'Medication Adherence',
  systolicBp: 'Blood Pressure Control',
  daysSinceLastContact: 'Time Since CHW Contact',
  distanceToFacility: 'Distance to Facility',
  comorbidities: 'Comorbid Conditions',
  incomeCategory: 'Socioeconomic Status',
}
