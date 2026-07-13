/**
 * Maternal Care Disease Module — STUB
 *
 * ⚠️  NOT IMPLEMENTED — Feature flag: VITE_FF_MATERNAL_MODULE
 *
 * Key risk factors for maternal care continuity:
 *   - ANC (Antenatal Care) visit completion
 *   - Gestational age
 *   - Iron/folic acid supplementation adherence
 *   - Institutional delivery intent
 *   - Previous pregnancy complications
 */

import type { DiseaseModule, RiskScore, RiskFactor, RiskThresholds, BaseRiskInput } from '../types'
import { MATERNAL_THRESHOLDS } from '../shared/thresholds'

class MaternalModuleStub implements DiseaseModule<BaseRiskInput> {
  readonly disease = 'maternal' as const

  calculateRisk(_input: BaseRiskInput): RiskScore {
    throw new Error('[HealthEngine] Maternal care module is not yet implemented.')
  }

  getRiskFactors(): Omit<RiskFactor, 'contribution'>[] {
    return []
  }

  getThresholds(): RiskThresholds {
    return MATERNAL_THRESHOLDS
  }
}

export const maternalModule = new MaternalModuleStub()
