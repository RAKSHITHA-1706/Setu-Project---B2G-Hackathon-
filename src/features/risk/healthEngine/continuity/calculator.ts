import type { Patient, Village, FollowUpVisit, RiskResult, RiskLevel } from './types'
import { WEIGHTS, RISK_LEVELS, SUGGESTED_ACTIONS } from './constants'
import {
  calculateOverdueFactor,
  calculateBpTrendFactor,
  calculateAdherenceFactor,
  calculateDistanceFactor,
  calculateSeverityFactor
} from './factors'

/**
 * Calculates the Continuity Risk Score based on a deterministic, explainable engine.
 * 
 * Returns a score between 0 and 100, the calculated risk level, and an array of 
 * natural-language explanations making the AI transparent to healthcare workers.
 */
export function calculateContinuityRisk(
  patient: Patient,
  village: Village,
  visits: FollowUpVisit[],
  today: Date = new Date()
): RiskResult {
  
  // Sort visits descending (newest first) to easily grab the latest
  const sortedVisits = [...visits].sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime())
  const latestVisit = sortedVisits[0]

  // Default values if no visits exist
  const expectedNextVisit = latestVisit ? latestVisit.expectedNextVisitDate : today
  const currentSystolic = latestVisit ? latestVisit.bpSystolic : 120

  // 1. Calculate individual factors
  const overdueResult = calculateOverdueFactor(today, expectedNextVisit)
  const bpTrendResult = calculateBpTrendFactor(sortedVisits)
  const adherenceResult = calculateAdherenceFactor(sortedVisits)
  const distanceResult = calculateDistanceFactor(village.distanceFromPhcKm)
  const severityResult = calculateSeverityFactor(currentSystolic)

  // 2. Apply precise weights defined by clinical guidelines
  const rawScore = 
    (WEIGHTS.OVERDUE * overdueResult.score) +
    (WEIGHTS.BP_TREND * bpTrendResult.score) +
    (WEIGHTS.ADHERENCE * adherenceResult.score) +
    (WEIGHTS.DISTANCE * distanceResult.score) +
    (WEIGHTS.SEVERITY * severityResult.score)

  // 3. Normalize to 0-100 scale
  const finalScore = Math.round(rawScore * 100)

  // 4. Determine Risk Level
  let level: RiskLevel = 'LOW'
  if (finalScore >= RISK_LEVELS.HIGH.min) {
    level = 'HIGH'
  } else if (finalScore >= RISK_LEVELS.MEDIUM.min) {
    level = 'MEDIUM'
  }

  // 5. Gather Explanations (only include explanations for non-zero or notable factors)
  const explanations: string[] = []
  if (overdueResult.score > 0 && overdueResult.explanation) explanations.push(overdueResult.explanation)
  if (bpTrendResult.score >= 0.4 && bpTrendResult.explanation) explanations.push(bpTrendResult.explanation)
  if (adherenceResult.score > 0 && adherenceResult.explanation) explanations.push(adherenceResult.explanation)
  if (distanceResult.score > 0.2 && distanceResult.explanation) explanations.push(distanceResult.explanation) // Distance is always present, only explain if notable
  if (severityResult.score > 0 && severityResult.explanation) explanations.push(severityResult.explanation)

  return {
    score: finalScore,
    level,
    factors: {
      overdue: overdueResult.score,
      bpTrend: bpTrendResult.score,
      adherence: adherenceResult.score,
      distance: distanceResult.score,
      severity: severityResult.score
    },
    explanations,
    suggestedAction: SUGGESTED_ACTIONS[level]
  }
}
