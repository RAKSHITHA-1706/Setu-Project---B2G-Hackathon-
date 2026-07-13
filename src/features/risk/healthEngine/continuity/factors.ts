import type { FollowUpVisit } from './types'
import { THRESHOLDS } from './constants'

/**
 * 1. Days Overdue Factor (0 to 1)
 * Calculates how overdue the patient is based on expected next visit.
 * Capped at 2x the typical interval (e.g., 30 days -> max risk at 60 days).
 */
export function calculateOverdueFactor(
  today: Date,
  expectedNextVisitDate: Date,
  expectedIntervalDays: number = 30
): { score: number; explanation: string | null } {
  const diffTime = today.getTime() - expectedNextVisitDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) {
    return { score: 0, explanation: null }
  }

  const maxOverdueDays = expectedIntervalDays * 2
  const score = Math.min(diffDays / maxOverdueDays, 1.0)
  
  return { 
    score, 
    explanation: `Patient overdue by ${diffDays} day(s).` 
  }
}

/**
 * 2. Blood Pressure Trend Factor (0, 0.4, or 1)
 * Compares recent visits to determine if BP is rising, stable, or dropping.
 */
export function calculateBpTrendFactor(
  visits: FollowUpVisit[]
): { score: number; explanation: string | null } {
  if (visits.length < 2) {
    return { score: 0.4, explanation: 'Insufficient data for BP trend, assuming stable.' } // Not enough data, assume stable
  }

  // Sort visits descending (newest first)
  const sortedVisits = [...visits].sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime())
  
  const currentBp = sortedVisits[0].bpSystolic
  const previousBp = sortedVisits[1].bpSystolic
  
  const diff = currentBp - previousBp

  if (diff > 5) {
    return { score: 1.0, explanation: 'Blood pressure has increased across recent visits.' }
  } else if (diff < -5) {
    return { score: 0.0, explanation: 'Blood pressure is improving.' }
  }
  
  return { score: 0.4, explanation: 'Blood pressure is stable.' }
}

/**
 * 3. Medication Adherence Factor (0 to 1)
 * Calculates non-adherence rate from recent visits.
 */
export function calculateAdherenceFactor(
  visits: FollowUpVisit[]
): { score: number; explanation: string | null } {
  if (visits.length === 0) {
    return { score: 0.5, explanation: 'No adherence data available.' }
  }

  const adherentVisits = visits.filter(v => v.medicationAdherent).length
  const adherenceRate = adherentVisits / visits.length
  
  const score = 1.0 - adherenceRate
  const percentage = Math.round(adherenceRate * 100)
  
  return { 
    score, 
    explanation: score > 0 ? `Medication adherence is only ${percentage}%.` : 'Perfect medication adherence.'
  }
}

/**
 * 4. Distance Factor (0 to 1)
 * Normalizes distance against THRESHOLDS.MAX_DISTANCE_KM.
 */
export function calculateDistanceFactor(
  distanceKm: number
): { score: number; explanation: string | null } {
  const score = Math.min(distanceKm / THRESHOLDS.MAX_DISTANCE_KM, 1.0)
  return { 
    score, 
    explanation: `Patient lives ${distanceKm} km from PHC.` 
  }
}

/**
 * 5. Severity Factor (0 to 1)
 * Normalizes systolic BP severity compared to a base of 120 mmHg.
 */
export function calculateSeverityFactor(
  currentSystolic: number
): { score: number; explanation: string | null } {
  if (currentSystolic <= THRESHOLDS.BASE_SYSTOLIC_BP) {
    return { score: 0, explanation: 'Current systolic BP is within normal range.' }
  }

  const range = THRESHOLDS.MAX_SYSTOLIC_BP - THRESHOLDS.BASE_SYSTOLIC_BP
  const excess = currentSystolic - THRESHOLDS.BASE_SYSTOLIC_BP
  
  const score = Math.min(excess / range, 1.0)
  return { 
    score, 
    explanation: `Current systolic BP is ${currentSystolic} mmHg.` 
  }
}
