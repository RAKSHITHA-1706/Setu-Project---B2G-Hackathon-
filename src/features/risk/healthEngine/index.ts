/**
 * ═══════════════════════════════════════════════════════════
 * SETU HEALTH ENGINE — Public API
 * ═══════════════════════════════════════════════════════════
 *
 * This is the ONLY file external code should import from.
 * Internal module files are implementation details.
 *
 * @example
 * import { healthEngine } from '@/features/risk/healthEngine'
 * const result = healthEngine.calculate({ disease: 'hypertension', ...inputs })
 */

import type { DiseaseModuleKey } from '@/config/constants'
import { featureFlags } from '@/config/env'
import type { BaseRiskInput, DiseaseModule, EngineResult, RiskScore } from './types'
import { hypertensionModule } from './hypertension'
import { diabetesModule } from './diabetes'
import { tuberculosisModule } from './tuberculosis'
import { maternalModule } from './maternal'
import { copdModule } from './copd'

// ─── Module Registry ──────────────────────────────────────────────────────────

/**
 * Registry of all available disease modules.
 * To add a new disease:
 *   1. Create the module folder + implement DiseaseModule interface
 *   2. Import here
 *   3. Add to this map
 *   4. Done.
 */
const MODULE_REGISTRY: Record<DiseaseModuleKey, DiseaseModule<any>> = {
  hypertension: hypertensionModule,
  diabetes: diabetesModule,
  tuberculosis: tuberculosisModule,
  maternal: maternalModule,
  copd: copdModule,
}

/**
 * Feature-flag guard — returns true if the disease module is enabled.
 */
function isModuleEnabled(disease: DiseaseModuleKey): boolean {
  if (disease === 'hypertension') return true // MVP: always on
  return featureFlags[disease as keyof typeof featureFlags] ?? false
}

// ─── Health Engine ────────────────────────────────────────────────────────────

class HealthEngine {
  /**
   * Calculate the continuity-of-care risk score for a patient.
   *
   * @param input — Must include patientId and disease. Other fields are optional.
   * @returns EngineResult — { score: RiskScore } or { error: string }
   */
  calculate(input: BaseRiskInput): EngineResult {
    const { disease } = input

    if (!isModuleEnabled(disease)) {
      return {
        score: null,
        error: `Disease module "${disease}" is not enabled. Check feature flags.`,
      }
    }

    const module = MODULE_REGISTRY[disease]
    if (!module) {
      return {
        score: null,
        error: `No module registered for disease "${disease}".`,
      }
    }

    try {
      const score = module.calculateRisk(input as any)
      return { score, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown engine error'
      console.error(`[HealthEngine][${disease}]`, err)
      return { score: null, error: message }
    }
  }

  /**
   * Get the list of risk factors for a disease (for UI display).
   */
  getRiskFactors(disease: DiseaseModuleKey) {
    return MODULE_REGISTRY[disease]?.getRiskFactors() ?? []
  }

  /**
   * Get thresholds for a disease module.
   */
  getThresholds(disease: DiseaseModuleKey) {
    return MODULE_REGISTRY[disease]?.getThresholds()
  }

  /**
   * Return all enabled disease modules.
   */
  getEnabledModules(): DiseaseModuleKey[] {
    return (Object.keys(MODULE_REGISTRY) as DiseaseModuleKey[]).filter(isModuleEnabled)
  }

  /**
   * Batch calculate risk scores for multiple patients.
   * Returns partial results — failed patients are included with their error.
   */
  calculateBatch(
    inputs: BaseRiskInput[]
  ): Array<{ patientId: string; result: EngineResult }> {
    return inputs.map((input) => ({
      patientId: input.patientId,
      result: this.calculate(input),
    }))
  }
}

export const healthEngine = new HealthEngine()

// ─── Re-export types for consumers ───────────────────────────────────────────
export type { RiskScore, EngineResult, BaseRiskInput }
export { RISK_TIER } from './types'
export type { RiskTier, RiskFactor, DiseaseModule, RiskThresholds } from './types'
export { getTierFromScore, getRiskColorClass, getRiskLabel, getRiskAction } from './shared'
