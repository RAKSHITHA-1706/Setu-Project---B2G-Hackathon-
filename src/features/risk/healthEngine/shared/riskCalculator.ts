import type { RiskScore, RiskTier } from '../types'
import { RISK_TIER } from '../types'
import { RISK_THRESHOLDS } from '@/config/constants'

/**
 * Determine the risk tier from a numeric score.
 * Uses thresholds defined in constants.ts so they stay in sync.
 *
 * @example
 * getTierFromScore(25)  → 'low'
 * getTierFromScore(55)  → 'medium'
 * getTierFromScore(75)  → 'high'
 * getTierFromScore(90)  → 'critical'
 */
export function getTierFromScore(score: number): RiskTier {
  if (score <= RISK_THRESHOLDS.LOW) return RISK_TIER.LOW
  if (score <= RISK_THRESHOLDS.MEDIUM) return RISK_TIER.MEDIUM
  if (score <= RISK_THRESHOLDS.HIGH) return RISK_TIER.HIGH
  return RISK_TIER.CRITICAL
}

/**
 * Apply a simple weighted average across scored factors.
 * Each factor has a weight (0–1). Weights do not need to sum to 1.
 *
 * @param factors — Array of { weight, score } tuples
 * @returns Normalized score 0–100
 */
export function weightedScore(
  factors: Array<{ weight: number; score: number }>
): number {
  if (factors.length === 0) return 0

  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0)
  if (totalWeight === 0) return 0

  const weightedSum = factors.reduce((sum, f) => sum + f.weight * f.score, 0)
  const raw = weightedSum / totalWeight

  // Clamp to 0–100
  return Math.min(100, Math.max(0, Math.round(raw)))
}

/**
 * Normalize a value to 0–100 given its known min and max.
 *
 * @example
 * normalize(140, 80, 200) → 50  (midpoint of 80–200 range)
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
}

/**
 * Compute a simple confidence score based on how many factors were provided
 * vs. how many the module expects.
 *
 * @param provided — Number of non-null inputs available
 * @param expected — Total number of inputs the module uses
 */
export function computeConfidence(provided: number, expected: number): number {
  if (expected === 0) return 1
  return Math.min(1, provided / expected)
}

/**
 * Return the CSS color class for a given risk tier.
 * Used by RiskBadge, RiskScoreBar components.
 */
export function getRiskColorClass(tier: RiskTier): string {
  const map: Record<RiskTier, string> = {
    [RISK_TIER.LOW]: 'text-risk-low bg-risk-low-bg',
    [RISK_TIER.MEDIUM]: 'text-risk-medium bg-risk-medium-bg',
    [RISK_TIER.HIGH]: 'text-risk-high bg-risk-high-bg',
    [RISK_TIER.CRITICAL]: 'text-risk-critical bg-risk-critical-bg',
  }
  return map[tier]
}

/**
 * Return the human-readable label for a risk tier.
 */
export function getRiskLabel(tier: RiskTier): string {
  const map: Record<RiskTier, string> = {
    [RISK_TIER.LOW]: 'Low Risk',
    [RISK_TIER.MEDIUM]: 'Medium Risk',
    [RISK_TIER.HIGH]: 'High Risk',
    [RISK_TIER.CRITICAL]: 'Critical Risk',
  }
  return map[tier]
}

/**
 * Return the action recommendation for a risk tier.
 */
export function getRiskAction(tier: RiskTier): string {
  const map: Record<RiskTier, string> = {
    [RISK_TIER.LOW]: 'Continue monitoring',
    [RISK_TIER.MEDIUM]: 'Schedule follow-up within 1 month',
    [RISK_TIER.HIGH]: 'Intervene within 2 weeks',
    [RISK_TIER.CRITICAL]: 'Immediate outreach required',
  }
  return map[tier]
}

/**
 * Sort an array of RiskScores from highest risk to lowest.
 */
export function sortByRisk(scores: RiskScore[]): RiskScore[] {
  return [...scores].sort((a, b) => b.score - a.score)
}
