/**
 * COPD Disease Module — STUB
 *
 * ⚠️  NOT IMPLEMENTED — Feature flag: VITE_FF_COPD_MODULE
 *
 * Key risk factors for COPD management continuity:
 *   - Inhaler technique and adherence
 *   - Exacerbation frequency
 *   - Smoking cessation status
 *   - Spirometry result (FEV1%)
 *   - Oxygen therapy compliance
 */

import type { DiseaseModule, RiskScore, RiskFactor, RiskThresholds, BaseRiskInput } from '../types'
import { COPD_THRESHOLDS } from '../shared/thresholds'

class COPDModuleStub implements DiseaseModule<BaseRiskInput> {
  readonly disease = 'copd' as const

  calculateRisk(_input: BaseRiskInput): RiskScore {
    throw new Error('[HealthEngine] COPD module is not yet implemented.')
  }

  getRiskFactors(): Omit<RiskFactor, 'contribution'>[] {
    return []
  }

  getThresholds(): RiskThresholds {
    return COPD_THRESHOLDS
  }
}

export const copdModule = new COPDModuleStub()
