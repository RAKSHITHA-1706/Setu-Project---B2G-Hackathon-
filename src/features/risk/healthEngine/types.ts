/**
 * ═══════════════════════════════════════════════════════════
 * SETU HEALTH ENGINE — Core Type Contracts
 * ═══════════════════════════════════════════════════════════
 *
 * This file defines the interfaces every disease module must implement.
 * Adding a new disease = implement DiseaseModule + register in index.ts.
 * No other files change.
 */

import type { DiseaseModuleKey } from '@/config/constants'

// ─── Risk Tier ────────────────────────────────────────────────────────────────

export const RISK_TIER = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const

export type RiskTier = (typeof RISK_TIER)[keyof typeof RISK_TIER]

// ─── Risk Factor ──────────────────────────────────────────────────────────────

/**
 * A single contributing factor to the risk score.
 * Returned as part of RiskScore so callers can explain the result.
 */
export interface RiskFactor {
  /** Machine-readable key */
  key: string
  /** Human-readable label for display */
  label: string
  /** Contribution to score (0–100) */
  contribution: number
  /** Whether this factor increases or decreases risk */
  direction: 'increase' | 'decrease'
  /** Optional human-readable explanation */
  explanation?: string
}

// ─── Risk Thresholds ──────────────────────────────────────────────────────────

export interface RiskThresholds {
  low: number     // max score for LOW tier
  medium: number  // max score for MEDIUM tier
  high: number    // max score for HIGH tier
  // CRITICAL: anything above `high`
}

// ─── Risk Input ───────────────────────────────────────────────────────────────

/**
 * Base inputs shared by all disease modules.
 * Each module extends this with disease-specific fields.
 */
export interface BaseRiskInput {
  patientId: string
  disease: DiseaseModuleKey
  assessedAt?: string  // ISO timestamp — defaults to now
}

// ─── Risk Score ───────────────────────────────────────────────────────────────

/**
 * The output of calculateRisk().
 * Every disease module returns this exact shape.
 */
export interface RiskScore {
  /** 0–100. Higher = greater risk of discontinuing care. */
  score: number
  /** Bucketed tier derived from score + thresholds */
  tier: RiskTier
  /** 0–1. How confident the engine is in this score */
  confidence: number
  /** Factors that drove this score (for explainability) */
  factors: RiskFactor[]
  /** Disease this score applies to */
  disease: DiseaseModuleKey
  /** ISO timestamp of calculation */
  generatedAt: string
  /** ID of the patient this score belongs to */
  patientId: string
}

// ─── Disease Module Interface ─────────────────────────────────────────────────

/**
 * Contract that every disease module MUST implement.
 *
 * To add a new disease:
 *   1. Create src/features/risk/healthEngine/<disease>/index.ts
 *   2. Implement this interface
 *   3. Register in healthEngine/index.ts
 *   4. Done — no other changes needed.
 */
export interface DiseaseModule<TInput extends BaseRiskInput = BaseRiskInput> {
  /** Identifier matching DiseaseModuleKey */
  readonly disease: DiseaseModuleKey

  /**
   * Calculate the continuity-of-care risk score.
   * @param input — Disease-specific inputs
   * @returns RiskScore
   */
  calculateRisk(input: TInput): RiskScore

  /**
   * Return the risk factors this module evaluates.
   * Used by UI to display factor weights and explanations.
   */
  getRiskFactors(): Omit<RiskFactor, 'contribution'>[]

  /**
   * Return the score thresholds for each tier.
   * Allows disease-specific tier calibration.
   */
  getThresholds(): RiskThresholds
}

// ─── Engine Result ────────────────────────────────────────────────────────────

export type EngineResult =
  | { score: RiskScore; error: null }
  | { score: null; error: string }
