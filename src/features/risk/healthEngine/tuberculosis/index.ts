/**
 * Tuberculosis Disease Module — STUB
 *
 * ⚠️  NOT IMPLEMENTED — Feature flag: VITE_FF_TUBERCULOSIS_MODULE
 *
 * TB has the highest dropout consequences of any disease module.
 * Incomplete treatment leads to drug-resistant TB (MDR-TB, XDR-TB).
 *
 * Key risk factors for TB treatment continuity:
 *   - DOTS (Directly Observed Therapy) adherence
 *   - Days into treatment (risk peaks at months 2–3)
 *   - Side effect severity
 *   - Nutritional status
 *   - Household contact tracing
 */

import type { DiseaseModule, RiskScore, RiskFactor, RiskThresholds, BaseRiskInput } from '../types'
import { TUBERCULOSIS_THRESHOLDS } from '../shared/thresholds'

class TuberculosisModuleStub implements DiseaseModule<BaseRiskInput> {
  readonly disease = 'tuberculosis' as const

  calculateRisk(_input: BaseRiskInput): RiskScore {
    throw new Error('[HealthEngine] Tuberculosis module is not yet implemented.')
  }

  getRiskFactors(): Omit<RiskFactor, 'contribution'>[] {
    return []
  }

  getThresholds(): RiskThresholds {
    return TUBERCULOSIS_THRESHOLDS
  }
}

export const tuberculosisModule = new TuberculosisModuleStub()
