/**
 * Diabetes Disease Module — STUB
 *
 * ⚠️  NOT IMPLEMENTED — Feature flag: VITE_FF_DIABETES_MODULE
 *
 * To implement:
 *   1. Define DiabetesRiskInput extending BaseRiskInput
 *   2. Define factor weights (HbA1c, medication adherence, etc.)
 *   3. Implement DiseaseModule<DiabetesRiskInput>
 *   4. Register in healthEngine/index.ts
 *   5. Set VITE_FF_DIABETES_MODULE=true in .env
 *
 * Key risk factors for diabetes continuity of care:
 *   - HbA1c control
 *   - Insulin adherence
 *   - Blood glucose monitoring frequency
 *   - Dietary adherence
 *   - Comorbid hypertension
 */

import type { DiseaseModule, RiskScore, RiskFactor, RiskThresholds, BaseRiskInput } from '../types'
import { DIABETES_THRESHOLDS } from '../shared/thresholds'

class DiabetesModuleStub implements DiseaseModule<BaseRiskInput> {
  readonly disease = 'diabetes' as const

  calculateRisk(_input: BaseRiskInput): RiskScore {
    throw new Error(
      '[HealthEngine] Diabetes module is not yet implemented. ' +
      'Set VITE_FF_DIABETES_MODULE=false to disable this feature.'
    )
  }

  getRiskFactors(): Omit<RiskFactor, 'contribution'>[] {
    return []
  }

  getThresholds(): RiskThresholds {
    return DIABETES_THRESHOLDS
  }
}

export const diabetesModule = new DiabetesModuleStub()
