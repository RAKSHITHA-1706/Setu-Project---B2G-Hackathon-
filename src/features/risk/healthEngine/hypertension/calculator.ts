import type { DiseaseModule, RiskFactor, RiskScore, RiskThresholds } from '../types'
import type { HypertensionRiskInput } from './types'
import {
  getTierFromScore,
  weightedScore,
  normalize,
  computeConfidence,
} from '../shared/riskCalculator'
import { HYPERTENSION_THRESHOLDS } from '../shared/thresholds'
import {
  HYPERTENSION_FACTOR_WEIGHTS,
  HYPERTENSION_FACTOR_LABELS,
} from './riskFactors'

/**
 * Hypertension Risk Calculator — MVP Implementation.
 *
 * Calculates the probability of a hypertension patient discontinuing
 * treatment based on clinical, behavioral, and social determinants.
 *
 * NOTE: This is a foundation-phase skeleton.
 *       Implement scoring logic in Phase 2 (Risk Engine).
 *       Method signatures and return types are final.
 */
class HypertensionModule implements DiseaseModule<HypertensionRiskInput> {
  readonly disease = 'hypertension' as const

  calculateRisk(input: HypertensionRiskInput): RiskScore {
    const factors: RiskFactor[] = []
    let provided = 0
    const expected = 7 // number of factors this module uses

    // ── Factor: Missed Appointments ─────────────────────────────────
    if (input.missedAppointments !== undefined) {
      provided++
      const score = normalize(input.missedAppointments, 0, 6) // 0–6 missed appts
      factors.push({
        key: 'missedAppointments',
        label: HYPERTENSION_FACTOR_LABELS.missedAppointments,
        contribution: Math.round(score * HYPERTENSION_FACTOR_WEIGHTS.missedAppointments),
        direction: 'increase',
        explanation: `${input.missedAppointments} missed appointment(s) in the last 6 months`,
      })
    }

    // ── Factor: Medication Adherence ─────────────────────────────────
    if (input.medicationAdherence !== undefined) {
      provided++
      const adherenceScore: Record<string, number> = {
        always: 0,
        sometimes: 40,
        rarely: 75,
        never: 100,
      }
      const score = adherenceScore[input.medicationAdherence] ?? 50
      factors.push({
        key: 'medicationAdherence',
        label: HYPERTENSION_FACTOR_LABELS.medicationAdherence,
        contribution: Math.round(score * HYPERTENSION_FACTOR_WEIGHTS.medicationAdherence),
        direction: 'increase',
        explanation: `Patient reports taking medication "${input.medicationAdherence}"`,
      })
    }

    // ── Factor: Systolic BP ───────────────────────────────────────────
    if (input.systolicBp !== undefined) {
      provided++
      // Controlled: <130 → low risk. Uncontrolled: >160 → high risk
      const score = normalize(input.systolicBp, 110, 200)
      factors.push({
        key: 'systolicBp',
        label: HYPERTENSION_FACTOR_LABELS.systolicBp,
        contribution: Math.round(score * HYPERTENSION_FACTOR_WEIGHTS.systolicBp),
        direction: 'increase',
        explanation: `Systolic BP: ${input.systolicBp} mmHg`,
      })
    }

    // ── Factor: Days Since Last Contact ──────────────────────────────
    if (input.daysSinceLastContact !== undefined) {
      provided++
      const score = normalize(input.daysSinceLastContact, 0, 90) // 0–90 days
      factors.push({
        key: 'daysSinceLastContact',
        label: HYPERTENSION_FACTOR_LABELS.daysSinceLastContact,
        contribution: Math.round(score * HYPERTENSION_FACTOR_WEIGHTS.daysSinceLastContact),
        direction: 'increase',
        explanation: `Last CHW contact was ${input.daysSinceLastContact} day(s) ago`,
      })
    }

    // ── Factor: Distance to Facility ─────────────────────────────────
    if (input.distanceToFacilityKm !== undefined) {
      provided++
      const score = normalize(input.distanceToFacilityKm, 0, 30) // 0–30 km
      factors.push({
        key: 'distanceToFacility',
        label: HYPERTENSION_FACTOR_LABELS.distanceToFacility,
        contribution: Math.round(score * HYPERTENSION_FACTOR_WEIGHTS.distanceToFacility),
        direction: 'increase',
        explanation: `Facility is ${input.distanceToFacilityKm} km away`,
      })
    }

    // ── Factor: Comorbidities ─────────────────────────────────────────
    const comorbidCount = [
      input.hasDiabetes,
      input.hasCKD,
      input.hasHeartDisease,
      input.isSmoker,
    ].filter(Boolean).length

    if (comorbidCount > 0 || input.hasDiabetes !== undefined) {
      provided++
      const score = normalize(comorbidCount, 0, 4)
      factors.push({
        key: 'comorbidities',
        label: HYPERTENSION_FACTOR_LABELS.comorbidities,
        contribution: Math.round(score * HYPERTENSION_FACTOR_WEIGHTS.comorbidities),
        direction: 'increase',
        explanation: `${comorbidCount} comorbid condition(s) identified`,
      })
    }

    // ── Factor: Income Category ───────────────────────────────────────
    if (input.incomeCategory !== undefined) {
      provided++
      const incomeScore: Record<string, number> = {
        below_poverty: 100,
        low: 60,
        middle: 20,
      }
      const score = incomeScore[input.incomeCategory] ?? 50
      factors.push({
        key: 'incomeCategory',
        label: HYPERTENSION_FACTOR_LABELS.incomeCategory,
        contribution: Math.round(score * HYPERTENSION_FACTOR_WEIGHTS.incomeCategory),
        direction: 'increase',
        explanation: `Income category: ${input.incomeCategory.replace('_', ' ')}`,
      })
    }

    // ── Compute final score ───────────────────────────────────────────
    const totalScore = weightedScore(
      factors.map((f) => ({
        weight: HYPERTENSION_FACTOR_WEIGHTS[f.key as keyof typeof HYPERTENSION_FACTOR_WEIGHTS] ?? 0.1,
        score: f.contribution * 10, // scale contribution back to 0–100
      }))
    )

    const tier = getTierFromScore(totalScore)
    const confidence = computeConfidence(provided, expected)

    return {
      score: totalScore,
      tier,
      confidence,
      factors,
      disease: 'hypertension',
      patientId: input.patientId,
      generatedAt: input.assessedAt ?? new Date().toISOString(),
    }
  }

  getRiskFactors(): Omit<RiskFactor, 'contribution'>[] {
    return Object.entries(HYPERTENSION_FACTOR_LABELS).map(([key, label]) => ({
      key,
      label,
      direction: 'increase' as const,
    }))
  }

  getThresholds(): RiskThresholds {
    return HYPERTENSION_THRESHOLDS
  }
}

export const hypertensionModule = new HypertensionModule()
