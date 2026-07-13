import type { BaseRiskInput } from '../types'

/**
 * Hypertension-specific risk inputs.
 * Extends BaseRiskInput with clinical and social determinants.
 *
 * All fields are optional — confidence score adjusts accordingly.
 * Required fields: patientId, disease (inherited from BaseRiskInput).
 */
export interface HypertensionRiskInput extends BaseRiskInput {
  disease: 'hypertension'

  // ─── Clinical Measurements ─────────────────────────────────
  /** Systolic BP in mmHg */
  systolicBp?: number
  /** Diastolic BP in mmHg */
  diastolicBp?: number
  /** Days since last BP measurement */
  daysSinceLastMeasurement?: number
  /** Number of prescribed medications */
  medicationCount?: number
  /** Whether the patient is currently on medication */
  onMedication?: boolean

  // ─── Behavioral Signals ────────────────────────────────────
  /** Number of missed follow-up appointments in last 6 months */
  missedAppointments?: number
  /** Patient-reported: 'always' | 'sometimes' | 'rarely' | 'never' */
  medicationAdherence?: 'always' | 'sometimes' | 'rarely' | 'never'
  /** Days since last CHW contact */
  daysSinceLastContact?: number

  // ─── Social Determinants of Health ─────────────────────────
  /** Distance from nearest health facility in km */
  distanceToFacilityKm?: number
  /** Monthly household income category */
  incomeCategory?: 'below_poverty' | 'low' | 'middle'
  /** Whether the patient has a mobile phone */
  hasMobilePhone?: boolean
  /** Whether the patient has a family support system */
  hasFamilySupport?: boolean

  // ─── Demographics ──────────────────────────────────────────
  age?: number
  gender?: 'male' | 'female' | 'other'

  // ─── Comorbidities ─────────────────────────────────────────
  hasDiabetes?: boolean
  hasCKD?: boolean
  hasHeartDisease?: boolean
  isSmoker?: boolean
}

/**
 * Weight configuration for each risk factor.
 * Higher weight = more influence on final score.
 */
export interface HypertensionFactorWeights {
  missedAppointments: number
  medicationAdherence: number
  systolicBp: number
  daysSinceLastContact: number
  distanceToFacility: number
  comorbidities: number
  incomeCategory: number
}
